import React, { Component } from 'react';
import './default/style.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Lang } from '../public';
import Cookies from 'universal-cookie';
import { Route, Link } from 'react-router-dom';
import BarTitle from '../component/barTitle';
import IpcBottom from '../component/ipcBottom';
import DropMenu from '../component/dropMenu';
import TalkAnimation from './component/talkAnimation';
import AllTimeScale from './component/allTimeScale';
import jsBridge from '../jssdk/JSBridge';
import EventList from './component/eventList';
import ipcMqtt from '../jssdk/ipcMqtt';
import { saveEvent, getTimeList, getHavSD, saveOnlineState} from '../action/ipc';
import { Toast, DatePicker, WhiteSpace } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import RcCalendar from './component/calendar_rc';
import helper from '../public/helper';
import ipcHttp from '../jssdk/ipcplan';
import { changeFromPage } from '../action';
import MQTTService, { TOPIC } from '../jssdk/MQTTService';

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const utcNow = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
const minDate = new Date(nowTimeStamp - 1e7);
const maxDate = new Date(nowTimeStamp + 1e7);
// if (minDate.getDate() !== maxDate.getDate()) {
//     minDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
// }
var result = [];
function formatDate(date, type) {
	const pad = n => n < 10 ? `0${n}` : n;
	const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
	const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
	if (type == 1) {
		return `${timeStr}`;
	} else if (type == 2) {
		return `${dateStr}`;
	}
	else {
		return `${dateStr} ${timeStr}`;
	}
}

const cookies = new Cookies();
class Ipccamera extends Component {
	constructor(props) {
		super(props);
		const { mqttStatus, deviceConnect } = this.props;
		let mqttConnect = false;
		if (mqttStatus == 1) {
			mqttConnect = true;
		}
		else {
			mqttConnect = false;
		}

		this.state = {
			visible: false,
			beginTime: this.setAtTime("00:00"),//时间控件开始时间
			endTime: this.setAtTime(helper.formatDate(new Date(), 'hh:mm')),//时间控件结束时间
		    eventStartTime:helper.formatDate(new Date(), 'yyyy-MM-dd') + ' 00:00:00',//事件查询开始时间
		    eventEndTime:helper.formatDate(new Date),//事件查询结束时间
			talkClick: false,
			recordClick: false,
			reconnectClick: false,//是否已点击重连按钮，true:已点击；false:没点击
			nonCard: false,
			isMute: false,
			resolution: Lang.ipc.resolution.menuName[0],
			resolutionSubmenu: false,
			playType: 1,//1:直播；2：点播；
			showCalendar: false,
			searchDate: '',
			packageType: null,
			planId: null,
			// online: (mqttConnect && deviceConnect),//MQTT在线状态、设备在线状态
			online:true,
			tutkOnline: true,//tutk在线状态
			dataState: false,//点播有无数据,true:有数据；false:无数据
			heightTotal:0,//保存除了时间轴之外的元素高度（不包括时间控件高度）
			eventCount:0,//保存一段时间事件的数量
		}
		this.getHasSDCard = this.getHasSDCard.bind(this);
		this.handleClickBack = this.handleClickBack.bind(this);
		this.handleClickSet = this.handleClickSet.bind(this);
		this.handleScreenshotClick = this.handleScreenshotClick.bind(this);
		this.handleTalkClick = this.handleTalkClick.bind(this);
		this.handleRecordClick = this.handleRecordClick.bind(this);
		this.handleTalkClose = this.handleTalkClose.bind(this);
		this.handleNonCardClose = this.handleNonCardClose.bind(this);
		this.handleClouldClick = this.handleClouldClick.bind(this);
		//	this.handleSubClick = this.handleSubClick.bind(this);
		this.handleReturnToLiveClick = this.handleReturnToLiveClick.bind(this);
		this.getEventNotif = this.getEventNotif.bind(this);
		this.handleOnCancel = this.handleOnCancel.bind(this);
		this.handleOnDone = this.handleOnDone.bind(this);
		this.handleOnDoneEvent = this.handleOnDoneEvent.bind(this);
		this.showRcCalendar = this.showRcCalendar.bind(this);
		this.getStartAndEndTime = this.getStartAndEndTime.bind(this);
		this.handleReconnectClick = this.handleReconnectClick.bind(this);
		this.handleLocalFileClick = this.handleLocalFileClick.bind(this);
		this.handlefullScreenClick = this.handlefullScreenClick.bind(this);
		this.handleSetStartTime = this.handleSetStartTime.bind(this);
		this.handleSetEndTime = this.handleSetEndTime.bind(this);
		this.setVideoPlayerHeight = this.setVideoPlayerHeight.bind(this);
		this.getEventCount = this.getEventCount.bind(this);
	}
	componentWillUnmount() {
		const self = this;
		console.log('componentWillUnmount')
		jsBridge.send({
			service: 'LiveAndPlayBack',
			action: 'hidden',
		}).then(res => {});
		const { actions } = this.props;
		actions.changeFromPage('');
		self.props.actions.saveOnlineState(self.state.online);
		jsBridge.off('LiveAndPlayBack.motion');
		jsBridge.off('LiveAndPlayBack.connectState');
		jsBridge.off('LiveAndPlayBack.mute');
		jsBridge.off('LiveAndPlayBack.videoQuality');
		jsBridge.off('LiveAndPlayBack.pop');
		jsBridge.off('LiveAndPlayBack.click');
		jsBridge.off('LiveAndPlayBack.backPlayTime');
		jsBridge.off('LiveAndPlayBack.toplaylive');
	}
	setAtTime(queryAt) {
		let now = new Date();
		let timeStr = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate() + " " + queryAt + ":00"
		return new Date(timeStr)
	}
	subscribeDirectDev() {
		const { devId } = this.props;
		if (devId) {
			console.log(`===============订阅主题：lds/v1/cb/${devId}/# =====================`);
			MQTTService.subscribe({
				topic: `${TOPIC.broadcastV1}/${devId}/#`,
			});
		}
	}

	componentDidMount() {
		const that = this;
		const { deviceItem, fromPage, onlineState } = that.props;
		that.setVideoPlayerHeight();
		console.log('***************mqtt状态***************', that.props.mqttStatus);
		console.log('***************设备状态***************', that.props.deviceConnect);
		console.log("IpcBottom",this.props.deviceItem)
		
		that.subscribeDirectDev();
		let request = {
			deviceId: that.props.devId,
			payload: {
				userId: cookies.get('userId'),
				password: deviceItem.password,
			}
		}

		that.getHasSDCard();
		
		// let _packageType = null,
		// 	_planId = null;
		

		if(that.props.deviceItem.planId !== null){
			that.setState({
				packageType: that.props.deviceItem.packageType,
				planId: that.props.deviceItem.planId
			}, () => {
				if(that.state.packageType == 1){
					const currentDate = new Date();
					const startTime = helper.formatDate(currentDate, 'yyyy-MM-dd') + ' 00:00:00';
					const endTime = helper.formatDate(currentDate, 'yyyy-MM-dd') + ' 23:59:59';
					that.getEventCount({
						"planId":that.state.planId,
						"startTime":startTime,
						"endTime":endTime
						});
				}
			});
		}
		
		// ipcHttp.getPlanType('deviceId=' + deviceItem.devId).then(res => {
		// 	console.log("计划-----------------------",res)
		// 	if (res.data) {
		// 		_packageType = res.data.packageType;
		// 		_planId = res.data.planId;
		// 	}
		// 	else {
		// 		_packageType = null;
		// 		_planId = null;
		// 	}
		// 	that.setState({
		// 		packageType: _packageType,
		// 		planId: _planId
		// 	});
		// }).catch(res => {
		// 	_packageType = null;
		// 	_planId = null;
		// 	that.setState({
		// 		packageType: _packageType,
		// 		planId: _planId
		// 	});
		// });


		if (fromPage === 'list' || fromPage === 'ipcItem') {
		} else {
			jsBridge.send({
				service: 'LiveAndPlayBack',
				action: 'show',
			}).then(res => {
				//res.state //tutk: 0离线；1在线；2连接中
				console.log('从设备首页以外的页面返回播放页的时候tutk在线状态：', res.state)
				if (res.state) {
					that.setState({
						tutkOnline: res.state == 1 ? true : false
					});
					if (res.state == 2) {
						that.setState({ reconnectClick: true });
					}
					else {
						that.setState({ reconnectClick: false });
					}
				}
			});

			if (onlineState) {
				console.log('从设备首页以外的页面返回播放页的时候MQTT、设备在线状态', onlineState);
				that.setState({
					online: onlineState
				});
			}

		}


		ipcMqtt.getMotion(request).then(res => {
			console.log("getMotion成功了");
			console.log(res);
			if (res.ack.code == 200) {//获取设置情况后，再发给原生
				var info = {
					enable: res.payload.motionDetection.enabled
				}
				jsBridge.send({
					service: 'LiveAndPlayBack',
					action: 'getMotion',
					data: info
				})
			} else {
				console.log("getMotion失败了");
			}
		}).catch((err) => {
			console.log(err);
			console.log("getMotion失败了");
		})


		jsBridge.on('LiveAndPlayBack.motion', function (res) {
			console.log("监听到了motion");
			var request = {
				userId: cookies.get('userId'),
				deviceId: that.props.devId,
				payload: {
					userId: cookies.get('userId'),
					password: deviceItem.password,
					motionDetection: {
						enabled: res.enable ? true : false,
					}
				}
			}
			var motionInfo = {
				enable: res.enable ? true : false
			}
			ipcMqtt.setMotion(request).then(res => {//监听到原生的设置后去设置，设置成功后再给原生
				console.log("setMotion返回结果", res);
				if (res.ack.code == 200) {
					jsBridge.send({
						service: 'LiveAndPlayBack',
						action: 'motion',
						data: motionInfo
					})
				}
			}).catch((err) => {
				console.log('setmotion失败', err);

			})

		});

		jsBridge.on('LiveAndPlayBack.connectState', function (res) {
			// res.state 0:离线 ; 1:在线； 2:重连；
			if (res.state == 1) {
				that.setState({ tutkOnline: true });
			}
			else {
				that.setState({ tutkOnline: false });
				if (res.state == 2) {
					that.setState({ reconnectClick: true });
				}
				else {
					that.setState({ reconnectClick: false });
				}
			}
		});

		jsBridge.on('LiveAndPlayBack.mute', function (res) {
			console.log(res);
			that.setState({ isMute: res.state });
		});

		jsBridge.on('LiveAndPlayBack.toplaylive', function (res) {
			//切换到直播
			that.setState({ playType: 1 });
		});


		jsBridge.on('LiveAndPlayBack.videoQuality', function (res) {
			// console.log(res);
			// resolutionData.map((item) => {
			// 	if(item.name === res.quality){
			// 		item.selected = true;
			// 	}else {
			// 		item.selected = false;
			// 	}
			// })
			// console.log(resolutionData);
			let quality = '';
			if(res.quality == 'HD'){
				quality = Lang.ipc.resolution.menuName[0];
			}
			else if(res.quality == 'SD'){
				quality = Lang.ipc.resolution.menuName[1];
			}
			that.setState({ 
				resolution: quality, 
				resolutionSubmenu: false 
			});

		});

		jsBridge.on('LiveAndPlayBack.pop', function (res) {
			//点击到了返回
			that.props.history.goBack();
		});

		jsBridge.on('LiveAndPlayBack.click', function (res) {
			//console.log(res.data.path);
			// that.props.history.push(res.data.path);

			that.props.history.push("/ipc/ipcsetting");
		});
		jsBridge.on('LiveAndPlayBack.backPlayTime', function (res) {
			console.log(res.time);
		});
		this.getEventNotif()
	}
	
	/**
	 * 设置页面元素的初始高度
	 */
	setVideoPlayerHeight(){
		const self = this;
		self.videoPlayer.style.height = document.body.clientWidth * (9 /16) + 'px';
		const videoPlayerHeight = self.videoPlayer.offsetHeight;
		const videoButtonBarHeight = self.videoButtonBar.offsetHeight;
		const ipcButtomHeight = self.ipcBottom.getHeight();
		console.log('player height:',videoPlayerHeight);
		console.log('video botton bar heihgt:',videoButtonBarHeight);
		console.log('ipc buttom height:',ipcButtomHeight);
		const height_total = videoPlayerHeight + videoButtonBarHeight + ipcButtomHeight;
		self.setState({heightTotal:height_total});
	}
	
	onRef = (ref) => {
		this.ipcBottom = ref;
	}
	
	/**
	 * 获取一段时间的事件数量
	 * @param {Object} data:请求参数：planId,startTime,endTime
	 */
	getEventCount(data){
		const self = this;
		ipcHttp.getVideoEventCount(data).then(res => {
			if(res.code == 200 && res.data !==''){
				console.log('获取一段时间的事件数量', res.data);
				self.setState({eventCount:res.data});
			}
		}).catch(res => {
			console.log('获取一段时间的事件数量失败', res);
		});
	}
	
	getEventNotif() {
		const { deviceItem } = this.props;
		ipcMqtt.getEventNotif({
			userId: cookies.get('userId'),
			payload: {
				devId: this.props.devId,
				userId: cookies.get('userId'),
				password: deviceItem.password,
			}
		}).then(res => {
			let Is = res.payload.eventNotifEnabled
			this.props.actions.saveEvent(Is);
		}).catch(res => {
			Toast.info(Lang.device.dialog.tip[3]);
		})
	}

	handleScreenshotClick() {
		if (this.state.recordClick || !this.state.tutkOnline || (this.state.playType == 2 && !this.state.dataState)) {
			return;
		}
		console.log('快照');
		jsBridge.send({
			service: 'LiveAndPlayBack',
			action: 'screenshot'
		}).then(res => {
			// desc: imgPath:"path"
		});
	}

	handleTalkClick() {
		if (this.state.recordClick || !this.state.tutkOnline) {
			return;
		}
		jsBridge.send({
			service: 'LiveAndPlayBack',
			action: 'startTalkBackServer'
		}).then(res => {
			console.log("--------");
			console.log(res);
			if (res.state) {
				this.setState({ talkClick: res.state });
			}
		});
	}

	handleRecordClick(value) {
		if (!this.state.tutkOnline || (this.state.playType == 2 && !this.state.dataState)) {
			return;
		}
		console.log('开始录影');
		this.setState({ recordClick: value });
		if (value) {
			jsBridge.send({
				service: 'LiveAndPlayBack',
				action: 'startRecord'
			}).then(res => {
				if (res.state) {
					this.setState({ recordClick: res.state });
				}
			});
		} else {
			jsBridge.send({
				service: 'LiveAndPlayBack',
				action: 'stopRecord'
			}).then(res => {
				if (res.state) {
					this.setState({ recordClick: res.state });
				}
			});
		}

	}

	handleTalkClose() {
		this.setState({ talkClick: false });
		jsBridge.send({
			service: 'LiveAndPlayBack',
			action: 'stopTalkBackServer'
		}).then(res => {

		});
	}

	handleClickBack() {
		this.props.history.goBack();
	}
	//子菜单点击
	handleSubClick(value) {

	}

	handleClickSet() {
		this.props.history.push('/ipc/ipcsetting');
	}
	handleNonCardClose() {
		this.setState({ nonCard: false })
	}
	handlefullScreenClick() {
		if (this.state.talkClick || this.state.recordClick || !this.state.tutkOnline || (this.state.playType == 2 && !this.state.dataState)) {
			return;
		}
		console.log('全屏');
		jsBridge.send({
			service: 'LiveAndPlayBack',
			action: 'fullScreen'
		}).then(res => {

		});
	}
	handleLocalFileClick() {
		if (this.state.talkClick || this.state.recordClick) {
			return;
		}
		console.log('跳转到本地文件夹');
		jsBridge.send({
			service: 'LiveAndPlayBack',
			action: 'openLocalAlbum',
		}).then(res => {

		});
	}

	handleResolutionClick(value) {
		const self = this;
		if (self.state.talkClick || self.state.recordClick || self.state.playType == 2 || !self.state.tutkOnline) {
			return;
		}
		console.log('设置分辨率');
		self.setState({ resolutionSubmenu: value }, () => {
			var showState = this.state.resolutionSubmenu ? 'show' : 'hide';
			if (showState === 'show') {
				jsBridge.send({
					service: 'LiveAndPlayBack',
					action: 'showQuality'
				}).then(res => {
				});
			} else {
				jsBridge.send({
					service: 'LiveAndPlayBack',
					action: 'hideQuality'
				}).then(res => {
				});
			}
		});
	}

	handleMuteClick(value) {
		if (this.state.talkClick || this.state.recordClick || !this.state.tutkOnline || (this.state.playType == 2 && !this.state.dataState)) {
			return;
		}
		console.log('设置静音');
		this.setState({ isMute: value });
		jsBridge.send({
			service: 'LiveAndPlayBack',
			action: 'mute',
			data: { state: value }
		}).then(res => {

		});
	}
	handleClouldClick() {
		this.props.history.push('ipc/ipcmanage');
		// jsBridge.send({
		// 	service:'LiveAndPlayBack',
		// 	action: 'hidden',
		//   }).then(res => {

		//   });
	}
	goNext(url) {
		if (this.state.talkClick || this.state.recordClick || !this.state.tutkOnline || (this.state.playType == 2 && !this.state.dataState)) {
			return;
		}
		console.log('跳转SD卡');
		var that = this;
		console.log(this.props.havsd)
		if (this.props.havsd) {
			this.props.actions.getTimeList({
				service: 'SDCard',
				action: 'getTimeList',
				data: this.getStartAndEndTime(),
			})
			this.props.history.push(url);
		} else {
			this.setState({ nonCard: true })
		}
	

		//  jsBridge.send({
		// service:'LiveAndPlayBack',
		// action: 'hidden',
		//  }).then(res => {

		//  });

		// jsBridge.send({
		// 	service:'SDCard',
		// 	action: 'deleteEventList',
		// 	data:deleteInfo,
		// }).then(res => {
		// });

		//  jsBridge.send({
		// service:'LiveAndPlayBack',
		// action: 'stopLive',
		//  }).then(res => {

		//  });

	}

	getStartAndEndTime() {
		var endTime = new Date();
		var startTime = new Date(endTime.getTime() - 172800000)
		return {
			startTime: helper.formatDate(startTime, "yyyy-MM-dd") + ' 00:00:00',
			endTime: helper.formatDate(endTime, "yyyy-MM-dd") + ' 23:59:59'
		}
	}
	handleReturnToLiveClick() {
		if (this.state.recordClick) {
			return;
		}
		this.setState({
			searchDate: helper.formatDate(new Date()),
			playType: 1
		});

	}
	handleReconnectClick() {

		const self = this;
		if (self.state.reconnectClick) {
      //console.log('正在重连,不能重复点击！');
			return;
		}
		self.setState({ reconnectClick: true });
		//console.log('已点击重连按钮');
		jsBridge.send({
			service: 'LiveAndPlayBack',
			action: 'reconnect',
		}).then(res => {

		});
	}
	componentWillReceiveProps(nextProps) {
		const self = this;
		if (typeof (nextProps) != 'undefined') {
			if(nextProps.playType !== self.state.playType){
				console.log('//////////////播放器切换///////////////////当前类型：', self.state.playType, '切换类型：',nextProps.playType);
				self.setState({ playType: nextProps.playType });
			}
			self.setState({ dataState: nextProps.dataState });
			if (nextProps.mqttStatus !== this.props.mqttStatus) {
				console.log('------------------------mqttStatus ', nextProps.mqttStatus);
				if (nextProps.mqttStatus == 1 && this.props.deviceConnect) {
					self.setState({ online: true });
				}
				else {
					self.setState({ online: false });
				}

				const statusInfo = {
					status: nextProps.mqttStatus && this.props.deviceConnect
				}
				jsBridge.send({
					service: 'LiveAndPlayBack',
					action: 'mqttStatusChange',
					data: statusInfo
				}).then(res => {

				});
			}
			if (nextProps.deviceConnect !== this.props.deviceConnect) {
				console.log('--------------device connect-----------', nextProps.deviceConnect);
				if (nextProps.deviceConnect == 1 && this.props.mqttStatus) {
					self.setState({ online: true });
				}
				else {
					self.setState({ online: false });
				}

				const statusInfo = {
					status: nextProps.deviceConnect && this.props.mqttStatus
				}
				jsBridge.send({
					service: 'LiveAndPlayBack',
					action: 'mqttStatusChange',
					data: statusInfo
				}).then(res => {

				});
			}
		}

		if(nextProps.deviceItem.planId !== null  &&  this.state.planId === null){
			this.setState({
				packageType:nextProps.deviceItem.packageType,
				planId:nextProps.deviceItem.planId
			});
		}
	}
	getHasSDCard() {
		var { devId, deviceItem } = this.props;
		console.log("begin____________________getHasSDCard")
		return this.props.actions.getHavSD({
			devId,
			userId: cookies.get('userId'),
			password: deviceItem.password
		}).then(res=>{
			console.log("res____________________getHasSDCard")
			console.log(res)
		})
	}
	handleOnCancel() {
		console.log('---取消---');
		this.setState({
			showCalendar: false
		})
	}
	handleOnDone() {//全时时间控件
		let dateStr = '';
		let t = helper.formatDate(new Date(), 'hh:mm:ss');
		if (this.calendar.getSelectDate() == '') {
			let d = helper.formatDate(new Date(), 'yyyy-MM-dd');
			dateStr = d + ' ' + t;
		}
		else {
			dateStr = this.calendar.getSelectDate() + ' ' + t;
		}
		this.setState({
			showCalendar: false,
			searchDate: dateStr
		});
	}
	
	handleOnDoneEvent(){//事件时间控件
		const self = this;
		let dateStr = '';//选择日期
		if(self.calendar.getSelectDate() == ''){
			dateStr = helper.formatDate(new Date(), 'yyyy-MM-dd');
		}
		else{
			dateStr = self.calendar.getSelectDate();
		}
		let eventStaStr = self.state.eventStartTime !== '' ? helper.formatDate(self.state.eventStartTime, 'hh:mm') : '';
		let eventEndStr = self.state.eventEndTime !== '' ? helper.formatDate(self.state.eventEndTime, 'hh:mm') : '';
		let selectStaStr = helper.formatDate(self.state.beginTime, 'hh:mm');
		let selectEndStr = helper.formatDate(self.state.endTime, 'hh:mm');
		const stateSearchDate = self.state.searchDate == '' ? helper.formatDate(new Date(), 'yyyy-MM-dd') : self.state.searchDate;
		if(dateStr !== stateSearchDate || selectStaStr !== eventStaStr || selectEndStr !== eventEndStr){
			//console.log('选择的日期已改变!');
			if(dateStr == helper.formatDate(new Date(), 'yyyy-MM-dd')){
//				console.log('选择的是当天的日期，把结束时间置为当前时间。');
				self.setState({
					beginTime: this.setAtTime("00:00"),
					endTime: this.setAtTime(helper.formatDate(new Date(), 'hh:mm'))
				});
			}
			else{
//				console.log('选择的是其它日期，把开始、结束时间置为00:00:00-23:59:59');
				self.setState({
					beginTime: this.setAtTime("00:00"),
					endTime: this.setAtTime("23:59:59")
				});
			}
			self.setState({
				showCalendar:false,
				searchDate:dateStr
			},() => {
				//console.log('选择的日期：', dateStr);
				let _beginTime = helper.formatDate(self.state.beginTime, 'hh:mm');
				let _endTime = helper.formatDate(self.state.endTime, 'hh:mm');
				_beginTime = dateStr + ' ' +  _beginTime + ':00';
				_endTime = dateStr + ' ' +  _endTime + ':00';
				self.setState({
					eventStartTime:_beginTime,
					eventEndTime:_endTime
				}, () => {
					//console.log('设置开始日期：', self.state.eventStartTime, '设置结束日期：', self.state.eventEndTime);
					self.getEventCount({
						"planId":self.state.planId,
						"startTime":self.state.eventStartTime,
						"endTime":self.state.eventEndTime
						});
				});
			});
		}
		else{
			//console.log('选择的日期没变!')
			self.setState({
				showCalendar:false
			});
		}
	}
	
	showRcCalendar() {
		this.setState({ showCalendar: true })
	}
	
	handleSetStartTime(value){//设置开始时间
		const self = this;
		if(value.getTime() == self.state.beginTime.getTime()){
			//console.log('选择的时间一样');
			return;
		}
		if(value.getTime() > self.state.endTime.getTime()){
			Toast.info(Lang.ipc.eventPlay.tips[0]);
		}
		else{
			self.setState({beginTime:value}, () => {
				let _searchDate = self.state.searchDate == '' ? helper.formatDate(new Date(), 'yyyy-MM-dd'): self.state.searchDate;
				self.setState({
					eventStartTime:_searchDate + ' ' + helper.formatDate(value, 'hh:mm') + ':00',
					eventEndTime:_searchDate + ' ' + helper.formatDate(self.state.endTime, 'hh:mm') + ':00'
				}, () => {
					self.getEventCount({
						"planId":self.state.planId,
						"startTime":self.state.eventStartTime,
						"endTime":self.state.eventEndTime
						});
				});
			});
		}
	}
	
	handleSetEndTime(value){//设置结束时间
		const self = this;
		if(value.getTime() == self.state.endTime.getTime()){
			//console.log('选择的时间一样');
			return;
		}
		if(value.getTime() < self.state.beginTime.getTime()){
			Toast.info(Lang.ipc.eventPlay.tips[1]);
		}
		else{
			self.setState({endTime:value}, () => {
				let _searchDate = self.state.searchDate == '' ? helper.formatDate(new Date(), 'yyyy-MM-dd'): self.state.searchDate;
				self.setState({
					eventEndTime:_searchDate + ' ' + helper.formatDate(value, 'hh:mm') + ':00',
					eventStartTime:_searchDate + ' ' + helper.formatDate(self.state.beginTime, 'hh:mm') + ':00'
				},() => {
					self.getEventCount({
						"planId":self.state.planId,
						"startTime":self.state.eventStartTime,
						"endTime":self.state.eventEndTime
						});
				});
			});
		}
	}
	render() {
		let controlModule = [
			{
				component: (
					<div className="default-module">
						<a onClick={this.handleClouldClick}></a>
						<h2>{Lang.ipc.mainTxt.txt[0]}</h2>
						<h3>{Lang.ipc.mainTxt.txt[1]}</h3>
					</div>
				)
			},
			{
				component: (
					<div className="video-control">
						<div className="time-bar" onClick={this.showRcCalendar}>
							<p className="time-txt">
								{(this.state.searchDate == '' || helper.formatDate(this.state.searchDate, 'yyyy-MM-dd') == helper.formatDate(new Date(), 'yyyy-MM-dd')) ? 'Today' : helper.formatDate(this.state.searchDate, 'yyyy-MM-dd')}
							</p>
							<span className="time-arrow"></span>
						</div>
            <RcCalendar onCancle={this.handleOnCancel} showDate={this.state.showCalendar} onDone={this.handleOnDone} ref={calendar => this.calendar = calendar} />
						<AllTimeScale 
							data={{
								searchDate: this.state.searchDate, 
								online: this.state.online, 
								planId: this.state.planId, 
								heightTotal:this.state.heightTotal 
							}} />z
					</div>
				)
			},
			{
				component: (
					<div className="video-control">
						<div className="time-bar" ref={time => this.time = time}>
							<p className="time-txt" onClick={this.showRcCalendar}>
								<span style={{ fontWeight: "600" }}>{(this.state.searchDate == '' || helper.formatDate(this.state.searchDate, 'yyyy-MM-dd') == helper.formatDate(new Date(), 'yyyy-MM-dd')) ? 'Today' : helper.formatDate(this.state.searchDate, 'yyyy-MM-dd')}</span>
								<i className='video_event_date'></i> <br />
								<span style={{ fontSize: "14px", color: "#fff", opacity: '0.5' }}>{this.state.eventCount} {Lang.ipc.eventList.event}</span>
							</p>
							{/* <div className="time-arrow"></div> */}
							<div className="eventCount">
				                <DatePicker
				                  mode="time"
				                  title='Time'
				                  format='HH:mm'
				                  // minDate={minDate}
				                  // maxDate={maxDate}
				                  value={this.state.beginTime}
				                  onChange={this.handleSetStartTime}
				                >
				                  <div className="event_start_time" >
				                    {/* <span className="hintTxt">Start time</span> */}
				                    <span className="name event_select_time">{formatDate(this.state.beginTime,1)}</span>
				                  </div>
				                </DatePicker>
				                <div className='event_from'>
				                  <span>To</span>
				                </div>
				                <DatePicker
				                  mode="time"
				                  title='Time'
				                  format='HH:mm'
				                  // minDate={minDate}
				                  // maxDate={maxDate}
				                  value={this.state.endTime}
				                  onChange={this.handleSetEndTime}
				                >
				                  <div className="event_end_time" >
				                    {/* <span className="hintTxt">End time</span><span className="arrow-span"></span> */}
				                    <span className="name event_select_time">{formatDate(this.state.endTime, 1)}</span>
				                  </div>
				                </DatePicker> 
				              </div>
							</div>
						<RcCalendar onCancle={this.handleOnCancel} showDate={this.state.showCalendar} onDone={this.handleOnDoneEvent} ref={calendar => this.calendar = calendar} />
						<EventList 
							data={{
									playType: this.state.playType,
									eventStartTime: this.state.eventStartTime, 
									eventEndTime:this.state.eventEndTime, 
									online: this.state.online, 
									planId: this.state.planId, 
									heightTotal:this.state.heightTotal
								}} 
						/>
					</div>
				)
			},
			{
				component: (
					<div className="default-module">
						<div className="loading"></div>
					</div>
				)
			}
		];

		if (typeof (this.state.packageType) === 'undefined') {//还没有查到计划类型
			controlModule = controlModule.slice(3, 4);
		}
		else if (this.state.packageType === null) {//没有购买过计划
			controlModule = controlModule.slice(0, 1);
		}
		else {//已购买计划
			controlModule = this.state.packageType == 0 ? controlModule.slice(1, 2) : controlModule.slice(2, 3);
		}

		/*设置页面按钮状态开始*/
		//按钮初始状态
		let dropMenuClass = 'drop-menu',
			sdCardBtnClass = 'sdCard-btn',
			localFileBtnClass = 'localFile-btn',
			fullScreenBtnClass = 'fullScreen-btn',
			soundBtnClass = 'sound-btn',
			controlMask = 'none',
			disableObj = {
				onScreenshot: false,
				onTalk: false,
				onReturnToLive: false,
				onReconnect: false,
				onRecord: false
			};
		//按钮状态切换
		if (this.state.playType == 1) {//直播
			if (this.state.reconnectClick) {
				disableObj.onReconnect = true;
			}
			else {
				disableObj.onReconnect = false;
			}

			if (this.state.tutkOnline) {//tutk在线
				if (this.state.talkClick || this.state.recordClick) {//点击对讲和录影
					dropMenuClass += ' disable';
					sdCardBtnClass += ' disable';
					localFileBtnClass += ' disable';
					fullScreenBtnClass += ' disable';
					controlMask = 'mask';
					disableObj.onScreenshot = true;
					disableObj.onTalk = true;
					if (this.state.isMute) {//静音
						soundBtnClass = 'sound-btn mute muteDisable';
					}
					else {//非静音
						soundBtnClass = 'sound-btn disable';
					}
				}
				else {//默认状态
					dropMenuClass = 'drop-menu';
					sdCardBtnClass = 'sdCard-btn';
					localFileBtnClass = 'localFile-btn';
					fullScreenBtnClass = 'fullScreen-btn';
					controlMask = 'none';
					disableObj.onScreenshot = false;
					disableObj.onTalk = false;
					if (this.state.isMute) {//静音
						soundBtnClass = 'sound-btn mute';
					}
					else {//非静音
						soundBtnClass = 'sound-btn';
					}
				}
			}
			else {//tutk离线
				dropMenuClass += ' disable';
				sdCardBtnClass += ' disable';
				soundBtnClass += ' disable';
				fullScreenBtnClass += ' disable';
				disableObj.onScreenshot = true;
				disableObj.onTalk = true;
				disableObj.onRecord = true;
			}
		}
		else if (this.state.playType == 2) {//点播
			dropMenuClass += ' disable';
			if (this.state.dataState) {//查询到数据
				if (this.state.recordClick) {//点击录影
					sdCardBtnClass += ' disable';
					localFileBtnClass += ' disable';
					fullScreenBtnClass += ' disable';
					controlMask = 'mask';
					disableObj.onScreenshot = true;
					disableObj.onReturnToLive = true;
					if (this.state.isMute) {//静音
						soundBtnClass = 'sound-btn mute muteDisable';
					}
					else {//非静音
						soundBtnClass = 'sound-btn disable';
					}
				}
				else {//默认状态
					sdCardBtnClass = 'sdCard-btn';
					localFileBtnClass = 'localFile-btn';
					fullScreenBtnClass = 'fullScreen-btn';
					controlMask = 'none';
					disableObj.onScreenshot = false;
					disableObj.onReturnToLive = false;
					if (this.state.isMute) {//静音
						soundBtnClass = 'sound-btn mute';
					}
					else {//非静音
						soundBtnClass = 'sound-btn';
					}
				}
			}
			else {//查不到数据
				sdCardBtnClass += ' disable';
				soundBtnClass += ' disable';
				fullScreenBtnClass += ' disable';
				disableObj.onScreenshot = true;
				disableObj.onRecord = true;
				if (this.state.isMute) {//静音
					soundBtnClass = 'sound-btn mute muteDisable';
				}
				else {//非静音
					soundBtnClass = 'sound-btn disable';
				}
			}
		}
		/*设置页面按钮状态结束*/

		return (
			<div className="ipc main">
				<div className="nonCardMask" style={{ display: this.state.nonCard ? "block" : "none" }}></div>
				<div className="video-player" ref={videoPlayer => this.videoPlayer = videoPlayer}>
					{/*<a className="motion-detection"></a>*/}
				</div>
				{/*<div className="barTitle-box">
				<BarTitle onBack={this.handleClickBack} title='123' onDone={null}>
					<a className="set-btn" onClick={this.handleClickSet}></a>
				</BarTitle>
		  	</div>*/}
				<div className="video-button-bar" ref={videoButtonBar => this.videoButtonBar = videoButtonBar}>
					<div className="lf">
						{/*<DropMenu style = {dropStyle} data = {this.state.resolution} onSubClick={this.handleSubClick} />*/}
						<a className={dropMenuClass} onClick={this.handleResolutionClick.bind(this, !this.state.resolutionSubmenu)}>{this.state.resolution}</a>
					</div>
					<div className="rg">
						<a className={sdCardBtnClass} onClick={this.goNext.bind(this, "/ipc/SDVideoAll")}></a>
						<a className={localFileBtnClass} onClick={this.handleLocalFileClick}></a>
						<a className={soundBtnClass} onClick={this.handleMuteClick.bind(this, !this.state.isMute)}></a>
						<a className={fullScreenBtnClass} onClick={this.handlefullScreenClick}></a>
					</div>
				</div>
				<div className="control-area">
					<div className={controlMask}></div>
					{controlModule[0].component}
				</div>
				<IpcBottom ref="IpcBottom"
					onScreenshot={this.handleScreenshotClick}
					onRecord={this.handleRecordClick}
					onTalk={(this.state.playType == 1 && this.state.tutkOnline) ? this.handleTalkClick : null}
					onReturnToLive={this.state.playType == 2 ? this.handleReturnToLiveClick : null}
					onReconnect={(this.state.playType == 1 && !this.state.tutkOnline) ? this.handleReconnectClick : null}
					recordState={this.state.recordClick}
					disable={disableObj}
					onRef={this.onRef}
				/>
				<div className="talk-box" style={{ display: this.state.talkClick ? 'block' : 'none' }}>
					<TalkAnimation handleClickClose={this.handleTalkClose} position={{ y: 1.59 }} />
				</div>
				<div className="non-card-warn" style={{ display: this.state.nonCard ? "block" : "none" }}>
					<div className="non-card-img"></div>
					<h2>{Lang.ipc.nonCard.txt[0]}</h2>
					<ul>
						<li>{Lang.ipc.nonCard.txt[1]}</li>
						<li>{Lang.ipc.nonCard.txt[2]}</li>
						<li>{Lang.ipc.nonCard.txt[3]}</li>
						<li>{Lang.ipc.nonCard.txt[4]}</li>
					</ul>
					{/* <h3></h3> */}
					<button onClick={this.handleNonCardClose}>{Lang.ipc.nonCard.btnName}</button>
				</div>
			</div>
		);
	}
}
const mapStateToProps = state => {
	const devId = (state.device.fromPage === 'list' || state.device.fromPage === 'ipcItem' || state.device.recordAttr.devId === '') ? state.device.deviceItem.devId : state.device.recordAttr.devId;
	return {
		recordAttr: state.device.recordAttr,
		havsd:state.ipc.havsd,
		devId: devId,
		deviceItem: state.device.items[devId],
		playType: state.ipc.playType,
		dataState: state.ipc.dataState,
		fromPage: state.device.fromPage,
		mqttStatus: state.system.mqttStatus,
		deviceConnect: state.device.deviceConnect,
		onlineState: state.ipc.onlineState
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(
		{
			saveEvent,
			getTimeList,
			changeFromPage,
			getHavSD,
			saveOnlineState
		},
		dispatch)
})
export default connect(mapStateToProps, mapDispatchToProps)(Ipccamera)