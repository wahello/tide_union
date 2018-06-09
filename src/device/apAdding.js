import React, {
	Component
} from 'react';
import Cookies from 'universal-cookie';
import { bindActionCreators } from 'redux';
import '../gateway/default/style.css';
import { Lang } from '../public/resource';
import { showDialog } from '../action';
import BarTitle from '../component/barTitle';
import { connect } from 'react-redux';
import CircularProgress from '../component/circularProgress';
import Device from '../jssdk/device';
import SystemApi from '../jssdk/system';
import { initAddDevNotifyList, shouldUpdateDeviceList, initBindDevNotify } from '../action/device';
import MQTTService, {
	TOPIC
} from '../jssdk/MQTTService';
import { Toast } from 'antd-mobile';
import SmartLinkApi from '../jssdk/SmartLink';
import MQTTBasic from '../jssdk/MQTTBasic';

const delayTime = 100;
const Progress_bar = 1 / delayTime;
const dialogLang = Lang.public.dialog;
let countDownTimer;
class ApAdding extends Component {
	constructor(props) {
		super(props);
		// debugger;
		this.state = {
				progress: Progress_bar,
				time: 0,
				pointR: 4,
				init: true,
				searching: false,
				error: false,
				mac: this.props.location.mac,
				ssid: this.props.location.ssid,
				passWord: this.props.location.passWord,
				ip: this.props.location.ip,
				devId: this.props.location.devId
			},
		this.handleClickBack = this.handleClickBack.bind(this);
		this.device = new Device;
		this.cookies = new Cookies;
		this.systemApi = new SystemApi;
		this.smartLinkApi = new SmartLinkApi;
		this.MQTTBasic = new MQTTBasic();
	};

	//订阅设备广播主题
	subscribeDirectDev() {
		const {
			directDevIds
		} = this.props;
		let directDevIdTotal = directDevIds.gateway.concat(directDevIds.devices);
		if(directDevIdTotal.length) {
			directDevIdTotal.map((devId) => {
				console.log(`===============订阅主题：lds/v1/cb/${devId}/# =====================`);
				MQTTService.subscribe({
					topic: `${TOPIC.broadcastV1}/${devId}/#`,
				});
			});
		}
	}

	startSearchDevices() {
		if(this.state.searching) {
			return;
		}

		const {
			directDevIds
		} = this.props;
		this.setState({
			init: false,
			refreshing: true,
			searching: true,
		});

		this.setState({
			refreshing: false,
			searching: true,
		});

		// 60秒超时
		setTimeout(() => {
			this.setState({
				searching: false,
			});
		}, 60000);

		console.log("this.state.ip = ", this.state);
		if(this.state.ip) {
			this.searchApMode();
		} else {
//			this.searchSmartLink();

			this.sendSmartLinkConfig({
				ssid: this.state.ssid,
				password: this.state.passWord
			});
		}
	}
	
	sendSmartLinkConfig(data) {
		const {
			searchType
		} = this.props;
		
		this.smartLinkApi.config(data).then(res => {
			console.log("smartLinkApi config = ", res);
			if(res.code != 200) {
				throw res;
			}
			this.setState({
				mac:res.data.mac
			});
			
			this.searchSmartLink();
		}).catch(res => {
			let path = {
				pathname: '/device/plugAddFail',
				isSmartLink:1
			}
			this.props.history.push(path);
		});
	}

	componentDidMount() {
		const {
			searchType
		} = this.props;
		//console.log("id:"+ this.state.devId.devId +" " + "name:" + this.state.name.name + " " +'type:'+ this.state.type.type +" ip: " + this.state.ip.ip);
		let countDownTimer = setInterval(() => {
			var _num = this.state.progress;
			var _time = this.state.time;
			_num += Progress_bar;
			_time++;
			this.setState({
				progress: _num,
				time: _time
			}, () => {
				if(_time === delayTime) {
					clearInterval(countDownTimer);
					let data = {
						error: {
							code: "-2",
							desc: 'request timeout',
						}
					};
					
					if(searchType == "wifi_plug" && !this.state.ip){
						let path = {
							pathname: '/device/plugAddFail',
							isSmartLink:this.state.ip ? 0 : 1
						}
						this.props.history.push(path);
					} else {
						let path = {
							pathname: '/gateway/failAdd',
							query: {
								devType: 'siren hub',
								...data
							}
						}
						this.props.history.push(path);
					}
					
					// this.props.history.push('/gateway/failAdd');
				}
			})
		}, 1000)
		this.startSearchDevices();
	}

	searchApMode() {
		var dataList = [];
		let that = this;
		let {
			showDialog
		} = this.props;
		this.device.setWifiReq({
			ip: this.state.ip,
			port: "6667",
			payload: {
				ssid: this.state.ssid,
				password: this.state.passWord,
				secret: "WPA2",
				timestamp: "2018-03-14 17:30:00",
			}
		}).then(res => {
			console.log("------setWifiResp:", res);
			if(res.ack.code == 200) {
				Toast.hide();
				
				// 通知原生去连接到指定的WIFI
				this.systemApi.connectWifi({
					ssid:this.state.ssid,
					password:this.state.passWord
				});
				// this.afterNetworkConnet = () => {
				// 	console.log('00000000000000000000000000000000000000000000000')
				// 	MQTTService.reconnect();
				// }
				// this.systemApi.onNetworkStatusChange(this.afterNetworkConnet);
//				const icon = <span className="warn-icon" />;
//
//				showDialog(icon, "Please connect to the home router's WiFi", [{
//					text: dialogLang.button[1],
//					handleClick: function cancel() {
//						that.systemApi.gotoWiFiSetting();
//						this.hide();
//					},
//				}]);
			}
		}).catch(res => {
			console.log("catch setWifi Error-----", res);
			this.setState({
				refreshing: false,
				searching: false,
				error: true,
			});
		});
	}

	searchSmartLink() {
		var dataList = [];
		//		this.device.devDisconnect({
		//			timestamp: "2018-03-14 17:30:00",
		//		});

		//		MQTTService.disconnect({});

		console.log("====================SL模式=========================");
//		 setTimeout(() => {
//		 	console.log("this.state.devId = ",this.state.devId);
//          if(!this.state.devId){
//          	this.searchSmartLink();
//          }
//        }, 2000);
		this.device.devDiscoveryReq({
			ip: "255.255.255.255",
			port: "6666",
			payload: {
				timestamp: "2018-03-14 17:30:00",
			},
			time:20000
		}).then(res => {
			console.log("------devDiscoveryReq:" + res.payload.devId + "-" + res.payload.ip + "-" + res.payload.mac + "-" + res.payload.model);
			console.log("this.state.mac", this.state.mac);
			//			let noMac = this.state.mac.replaceAll(":","");
			//			console.log("noMac = ", noMac);
			// 如果设备发现的Mac地址与进来的Mac一致，则判定发现到该设备
			if(res.payload.mac == this.state.mac) {
				console.log("一样的mac");
				this.setState({
					devId: res.payload.devId
				});
				let gmtHours = new Date().getTimezoneOffset() / 60;

				let timeZone = "GMT";
				if(gmtHours < 0) {
					timeZone = timeZone + "+" + Math.abs(Number(gmtHours));
				} else if(gmtHours > 0) {
					timeZone = timeZone + "-" + Math.abs(Number(gmtHours));
				}

				console.log("timeZone " + timeZone);

				this.device.setBindInfoReq({
					ip: res.payload.ip,
					port: "6667",
					payload: {
						timeZone: timeZone,
						userId: this.cookies.get('userId'),
						timestamp: "2018-03-14 17:30:00",
					}
				}, 5000).then((res) => {
					console.log("setBindInfoResp=======", res);
					if(res.ack.code != 200) {
						throw res;
					}

				}).catch(res => {
					console.log("setBindInfoResp Error----");
					//						this.setState({
					//							refreshing: false,
					//							searching: false,
					//							error: true,
					//						});
					//	
					//						this.props.history.push(`/device/plugAddFail`);
				});
			} else {
				console.log("不一样的mac，重新尝试发现设备");
//				this.searchSmartLink();
			}
		}).catch(res => {
			console.log("-----");
			this.setState({
				refreshing: false,
				searching: false,
				error: true,
			});
		});
	}

	stopSearching() {
		const {
			directDevIds
		} = this.props;
		//		this.device.stopDevReq({
		//			parentId: directDevIds[0],
		//			payload: {},
		//		}).then(() => {
		//			console.log('停止搜索');
		//		}).catch((res) => {
		//			console.log(`停止搜索失败${res.CODE}`);
		//		});
	}

	handleClickToSet() {
		this.stopSearching();
		const {
			actions,
			searchType,
			directDevIds,
			currentHomeId,
			addDevNotifyList,
			devBindNotif
		} = this.props;
		const device = devBindNotif.payload;
		const data = {
			name: device.name || "WiFi Plug",
			devId: device.devId,
			type: searchType,
			icon: "plug",
			devType: searchType,
		};
		this.subscribeDirectDev();
		const path = {
			pathname: '/gateway/addSuccess',
			query: data,
		};

		actions.initAddDevNotifyList();
		actions.initBindDevNotify();

		this.props.history.push(path);
	}

	handleClickBack(event) {
//		this.props.history.goBack();
		this.props.history.push('../home');
	};

	goConnect(e) {
		const target = e.target;
		console.log(e.target.innerHTML)
		this.props.history.push('/gateway/connect')
	};

	componentWillReceiveProps(nextProps) {
		const {
			devBindNotif,
			networkStatus
		} = nextProps;
		const {
			actions,
			searchType,
			directDevIds,
			currentHomeId,
			addDevNotifyList,
		} = this.props;
		if(networkStatus !== this.props.networkStatus && networkStatus === 1){
		 	this.MQTTBasic.reconnect();
		}
		
		if(devBindNotif && devBindNotif !== this.props.devBindNotif) {
			console.log("devBindNotif.payload.devId = ",devBindNotif.payload.devId);
			console.log("this.state.devId = ",this.state.devId)
			if(devBindNotif.payload.devId === this.state.devId && !this.jobDone) {
				const device = devBindNotif.payload;
				console.log("productName=======",device.productName)
				const data = {
					name: device.productName,
					devId: device.devId,
					type: searchType,
					icon: searchType,
					devType: searchType,
				};

				this.jobDone = true;
				if(devBindNotif.ack.code == 200) {
					let path = {
						pathname: '/gateway/addSuccess',
						query: data,
					}
					//设备订阅消息
					//this.subscribeDirectDev();
					this.props.history.push(path);
					clearInterval(countDownTimer);
					return;
				} else {
					console.log("网关绑定失败" + devBindNotif.ack.code);
					let data = {
						error: devBindNotif.ack
					};
					
					if(searchType == "wifi_plug"){
						let path = {
							pathname: '/device/plugAddFail',
							isSmartLink:this.state.ip ? 0 : 1
						}
						this.props.history.push(path);
					} else {
						let path = {
							pathname: '/gateway/failAdd',
							query: data
						}
						this.props.history.push(path);
					}
					
					clearInterval(countDownTimer);
				}
			}

		}

	}

	render() {
		return(
			<div className='foudWifi adding'>
                <BarTitle onBack={this.handleClickBack} title={Lang.gateway.foudWifi.title}/>
                <div className="adding_main">
                    <div className='wifi_list add_load'>
                        <span className="load_time"></span>
                        <CircularProgress r={95} progress={this.state.progress} pointR={this.state.pointR} className="time_clock"/>
                    </div>
                    <p className='wifi_search'>{Lang.gateway.foudWifi.wait}</p>
                    <p className='wifi_search_text'>{this.props.searchType == "wifi_plug" ?Lang.gateway.foudWifi.plugTips : Lang.gateway.foudWifi.tips}</p>
                </div>
            </div>
		)
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		addDevNotifyList: state.device.addDevNotifyList,
		directDevIds: state.device.directDevIds,
		searchType: ownProps.match.params.type,
		currentHomeId: state.family.currentId,
		devBindNotif: state.device.devBindNotif,
		networkStatus: state.system.networkStatus,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		showDialog: (title, tip, btns) => {
			dispatch(showDialog(title, tip, btns));
		},
		actions: bindActionCreators({
			initAddDevNotifyList,
			shouldUpdateDeviceList,
			initBindDevNotify,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ApAdding)