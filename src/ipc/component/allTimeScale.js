import React, { Component } from 'react';
import Ipcplan from '../../jssdk/ipcplan';
import jsBridge from '../../jssdk/JSBridge';
import testCloud from '../default/testCloud.json';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPlayType, setDataState } from '../../action';
import helper from '../../public/helper';
import { Toast } from 'antd-mobile';
import { Lang } from '../../public';

/*全局常量*/
const MIN_DISTANCE = 20;//一个刻度的距离(2分钟时间轴移动距离)
const MIN_TIME = 2 * 60;//一个刻度的秒数(2分钟的秒数)
const SPEED = MIN_DISTANCE / MIN_TIME;//每秒移动距离
const AXIS_MIN_TOP = MIN_DISTANCE * 2 - MIN_DISTANCE * 720;//时间轴顶点
const AXIS_MAX_BOTTOM = MIN_DISTANCE * 2 ;//时间轴最低点
const ZERO_TRANSLATE_Y = MIN_DISTANCE * 720;//
const EVENT_WIDTH = MIN_DISTANCE / MIN_TIME * 30;//事件rect宽度
/*end*/

class AllTimeScale extends Component{	
	constructor(props){
		super(props);
		this.state = {
			currentTime:new Date(),
			online:false
	    };
	    const {planId} = this.props.data;
		/*全局变量*/
		this.params = {
			planId : planId,
			fileType : "ts",
			startTime : "",
			endTime : ""
		};
		this.liveTime = null;//直播时间定时器
		this.scaleInterval = null;
		this.videoFileList = {};//保存文件数据
		this.playArray = [];//可播放区域
		this.eventArray = [];
		this.firstRequest = false;//当进入页面时第一次请求接口，该变量置为:true,第一次之后的请求置为：false, 用于判断是否给播放器发送文件列表
		this.selectDate = new Date();//保存选择的日期
		this.imageX = 0;//事件图像x坐标
		this.imgBgHeight = 0;//事件图像高度
		/*end*/
		this.handleTouchStart = this.handleTouchStart.bind(this);
		this.handleTouchMove = this.handleTouchMove.bind(this);
		this.handleTouchEnd = this.handleTouchEnd.bind(this);
		this.initTimeAxis = this.initTimeAxis.bind(this);
		this.setAxisY = this.setAxisY.bind(this);
		this.getVideoFileExtList = this.getVideoFileExtList.bind(this);
		this.createVideoSvg = this.createVideoSvg.bind(this);
		this.appendRect = this.appendRect.bind(this);
		this.createEventSvg = this.createEventSvg.bind(this);
		this.axisYToTime = this.axisYToTime.bind(this);
		this.setParamsTime = this.setParamsTime.bind(this);
		this.createLtInterval = this.createLtInterval.bind(this);
		this.clearLtInterval = this.clearLtInterval.bind(this);
		this.changePlayTime = this.changePlayTime.bind(this);
		this.playbackVideo = this.playbackVideo.bind(this);
		this.findCurrentTime = this.findCurrentTime.bind(this);
		this.findEventTime = this.findEventTime.bind(this);
	}
	componentDidMount(){
		const self = this;
		self.initTimeAxis();
		jsBridge.on('LiveAndPlayBack.currentTime', function(res){
			 console.log('监听点播视频返回的时间：', res.time);
			 let _resTime = new Date(res.time.replace(/-/g,"/"));
			 self.setAxisY(self.timeToAxisY(_resTime));
			 self.setState({currentTime:_resTime});
			 self.findEventTime(_resTime);
		});
	}
	componentWillReceiveProps(nextProps){
		const self = this;
		if(typeof(nextProps) != 'undefined'){
			const date = nextProps.data.searchDate || helper.formatDate(self.selectDate);
			const onlineState = nextProps.data.online;
			console.log('-----参数已更新-----',date);
			if(onlineState != self.state.online){
				self.setState({online:onlineState});
			}
			if(date != helper.formatDate(self.selectDate)){
				self.selectDate = new Date(date.replace(/-/g,"/"));
				self.changePlayTime(date.replace(/-/g,"/"));
			}
		}
	}
	componentWillUnmount(){
		jsBridge.off('LiveAndPlayBack.currentTime');
		this.clearLtInterval();
	}
	
	/**
	 * 初始化时间轴
	 */
	initTimeAxis(){
		const self = this;
		self.generateScale();
		self.selectDate = new Date();
		console.log('*************************1.时间轴初始化，默认进入直播*************************');
		self.playLiveVideo(helper.formatDate(self.state.currentTime, 'yyyy/MM/dd hh:mm:ss'));
	    const scaleBgWidth = self.scaleBg.getBoundingClientRect().width;
	    let scaleX = scaleBgWidth - 25;
	    self.timeAxis.children[0].setAttribute('transform', 'translate(' + scaleX + ',0)');
	    const lineWidth = self.baseLine.getBoundingClientRect().width;
	    let timeTxtX = lineWidth + 13 + 18 + 5;
	    self.timeTxt.setAttribute('transform', 'translate(' + timeTxtX + ', 14)');
	    const imgBgWidth = self.eventImage.children[0].getBoundingClientRect().width;
	    const imgLoadingWidth = self.eventImage.children[1].getBoundingClientRect().width;
	    this.imgBgHeight = self.eventImage.children[0].getBoundingClientRect().height;
	    const imgLoadingHeight = self.eventImage.children[1].getBoundingClientRect().height;
	    this.imageX = timeTxtX - imgBgWidth + 3;
	    let imageY = 40;
	    self.eventImage.setAttribute('transform', 'translate(' + this.imageX + ',' + imageY + ')');
	    let imgLoadingX = (imgBgWidth - imgLoadingWidth) / 2;
	    let imgLoadingY = (this.imgBgHeight - imgLoadingHeight) / 2;
	    self.eventImage.children[1].setAttribute('transform', 'translate(' + imgLoadingX + ',' + imgLoadingY + ')');
	}
	
	/**
	 * 创建刻度线条Svg
	 * @param {Number} key
	 * @param {Number} x1
	 * @param {Number} y1
	 * @param {Number} x2
	 * @param {Number} y2
	 * @param {String} class_name
	 */
	createLine(key, x1, y1, x2, y2, class_name){
		let line = document.createElementNS('http://www.w3.org/2000/svg','line');
		line.setAttribute("key", key);
		line.setAttribute("x1", x1);
		line.setAttribute("y1", y1);
		line.setAttribute("x2", x2);
		line.setAttribute("y2", y2);
		line.setAttribute("class", class_name);
		return line;
	}
	
	/**
	 * 创建刻度时间Svg
	 * @param {Number} key
	 * @param {Number} x
	 * @param {Number} y
	 * @param {String} y
	 */
	createText(key, x, y, val, class_name){
		let text = document.createElementNS('http://www.w3.org/2000/svg','text');
		text.setAttribute("key", key);
		text.setAttribute("x", x);
		text.setAttribute("y", y);
		text.setAttribute("class", class_name);
		text.appendChild(document.createTextNode(val));
		return text;
	}	

	/**
	 * 生成时间轴刻度
	 */
	generateScale(){
		const self = this;
		let _x1, _y1, _x2, _y2, _x, _y, _text;
		_x2 = 25;
		_x = _x2 + 12;
		const d = self.setMinTime(new Date());
		for(let i = -2; i <= 800; i++){
			_y1 = MIN_DISTANCE * i;
			_y2 = _y1;
			_y = _y2 + 4;
			let t = new Date();
			_text = '';
			if(i == 0){
				t.setTime(d.getTime());
				_x1 = 0;
				_text = helper.changeTimeto12(t, 'hh:mm pp');
				self.scale.appendChild(self.createText(i, _x, _y, _text, 'text'));
			}
			else{
				if(i % 5 == 0){
					d.setMinutes(d.getMinutes() - 10);
					t.setTime(d.getTime());
					_x1 = 0;
					_text = helper.changeTimeto12(t, 'hh:mm pp');
					self.scale.appendChild(self.createText(i, _x, _y, _text, 'text'));
				}
				else{
					_x1 = 10;
				}
			}
			self.scale.appendChild(self.createLine(i, _x1, _y1, _x2, _y2 , 'line'));
		}
	}
	
	/**
	 * 设置0点
	 * @param {Date} time 日期对象
	 */
	setMinTime(time){
		if(typeof(time) != 'object'){
			console.log('接收的参数不是日期对象');
			return;
		}
		let timeObj = new Date();
		timeObj.setTime(time.getTime());
		timeObj.setHours(0);
	    timeObj.setMinutes(0);
	    timeObj.setSeconds(0);
	    timeObj.setMilliseconds(0);
	    return timeObj;
	}
	
	/**
	 * 设置24点
	 * @param {Date} time 日期对象
	 */
	setMaxTime(time){
		if(typeof(time) != 'object'){
			console.log('接收的参数不是日期对象');
			return;
		}
		let timeObj = new Date();
		timeObj.setTime(time.getTime());
		timeObj.setHours(24);
	    timeObj.setMinutes(0);
	    timeObj.setSeconds(0);
	    timeObj.setMilliseconds(0);
	    return timeObj;
	}
	
	/**
	 * 设置开始、结束时间
	 * @param {Date} dateObj 日期对象
	 */
	setParamsTime(dateObj){
		const self = this;
		const minTime = self.setMinTime(dateObj);
		const maxTime = self.setMaxTime(dateObj);
		let startTime = new Date();
	    let endTime = new Date();
	    startTime.setTime(dateObj.getTime());
	    endTime.setTime(dateObj.getTime());
	    startTime.setHours(startTime.getHours() - 1);
	    endTime.setHours(endTime.getHours() + 1);
	    self.params.startTime = startTime < minTime ? helper.formatDate(minTime) : helper.formatDate(startTime);
	    self.params.endTime = endTime > maxTime ? helper.formatDate(maxTime) : helper.formatDate(endTime);
	}
	
	/**
	 * 时间转换为距离(时间轴)
	 * @param {Date} time 日期对象
	 */
	timeToAxisY(time){
		const self = this;
		const differSeconds = parseInt(time - self.setMinTime(time))/1000;
		return AXIS_MIN_TOP + differSeconds * SPEED;
	}
	
	/**
	 * 时间转换为距离(刻度)
	 * @param {Date} time 日期对象
	 */
	timeToScaleY(time){
		const self = this;
		const differSeconds = parseInt(time - self.setMinTime(time))/1000;
		return ZERO_TRANSLATE_Y - differSeconds * SPEED;
	}

	/**
	 * 距离转换为时间(时间轴)
	 * @param {Date} time 日期对象
	 */
	axisYToTime(y){
		const self = this;
		if(!self.selectDate){
			return;
		}
		let differY = y - AXIS_MIN_TOP;
		let seconds = differY * (MIN_TIME / MIN_DISTANCE);
		let currentTimeZero = self.setMinTime(self.selectDate);
		currentTimeZero.setSeconds(currentTimeZero.getSeconds() + seconds);
		return currentTimeZero;
	}
	
	/**
	 * 设置时间轴y坐标
	 */
	setAxisY(y){
		const self = this;
		if(!self.timeAxis){
			return;
		}
		self.timeAxis.setAttribute('transform', 'translate(0,' + y + ')');
	}
	
	/**
	 * 删除子节点
	 */
	removeAllChild(element){  
		if(typeof(element) == 'undefined'){
			return;
		}
	    while(element.hasChildNodes()){  
            element.removeChild(element.firstChild);  
        }  
    }  
    
	/**
	 * 查询视频文件
	 * @param {Object} callback 回调函数
	 */
	getVideoFileExtList(callback){
		const self = this;
		const { actions } = self.props;
		Toast.loading('loading');
		Ipcplan.getVideoFileList(self.params).then(res => {
			Toast.hide();
			self.videoFileList = res;
			let _fileList = !res.data?[]:res.data;
			if(_fileList.length != 0){
				actions.setDataState(true);
				_fileList = _fileList.filter((item) => {
					return item.fileSize != 0;
				});
				self.videoFileList.data = _fileList;
				console.log('!!!!!!!!!!过滤后的文件列表：',self.videoFileList);
				callback();
				self.createVideoSvg(_fileList);
			}
			else{
				actions.setDataState(false);
	//Toast.info(Lang.ipc.videoPlayer.tips[0]);
			}
			
		}).catch(res => {
			actions.setDataState(false);
	//Toast.info(Lang.ipc.videoPlayer.tips[0]);
		});
		
	}
	
	/**
	 * 创建可以播放区域
	 * @param {Array} fileList 可播放区域数组
	 */
	createVideoSvg(fileList){
		const self = this;
		self.playArray.length = 0;
		if(!fileList || fileList.length == 0){
			return;
		}
		if(helper.formatDate(fileList[0].videoStartTime, 'yyyy/MM/dd') != helper.formatDate(self.params.startTime, 'yyyy/MM/dd')){
			console.log('不在同一天...');
			return;
		}
		let staTime = new Date(self.params.startTime.replace(/-/g,"/"));
		let endTime = self.params.startTime.replace(/-/g,"/");
		
		fileList.map((item, index) => {//生成可播放区域数组
			
			if(new Date(item.videoStartTime.replace(/-/g,"/")).getTime() - new Date(endTime).getTime() > 2000){
				if(index != 0){
					self.playArray.push({sta:staTime, end:endTime});
				}
				staTime = new Date(item.videoStartTime.replace(/-/g,"/"));
			}
			endTime = new Date(item.videoEndTime.replace(/-/g,"/"));
			if(index == fileList.length - 1){
				self.playArray.push({sta:staTime, end:endTime});
			}
		});
		console.log('可播放区域', self.playArray);
		self.removeAllChild(self.video);
		self.playArray.map((item,index) => {
			let pool = parseInt(item.end - item.sta) / 1000;
			let height = pool * SPEED;
			let y = self.timeToScaleY(item.end);
			self.appendRect(self.video, 'video-area', y, height);
			if(index == 0){//计算可播放区域x坐标,适配不同终端的分辨率
				if(typeof(self.video.children[0]) != 'undefined'){
					const scaleBgWidth = self.scaleBg.getBoundingClientRect().width;
					const rectWidth = self.video.children[0].getBoundingClientRect().width;
					let rectX = scaleBgWidth - rectWidth;
 					self.video.setAttribute('transform', 'translate(' + rectX + ',0)');
 					self.event.setAttribute('transform','translate(' +  rectX + ',0)');
				}
			}
		});
		Ipcplan.getVideoEventList(self.params).then(res => {
			let _eventList = !res.data?[]:res.data;
			console.log('发生事件时间点：', _eventList);
			if(_eventList || _eventList.length != 0){
				self.createEventSvg(_eventList);
			}
		}).catch(res => {
		})
	}
	/**
	 * 创建时间轴色块
	 * @param {Object} obj:父元素
	 * @param {String} class_name: 色块样式
	 * @param {Number} y:y坐标
	 * @param {Number} h:高度
	 */
	appendRect(obj, class_name, y, h){
		let rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		rect.setAttribute("x", 0);
		rect.setAttribute("y", y);
		rect.setAttribute("class", class_name);
		rect.setAttribute("height", h);
		obj.append(rect);
	}
	
	/**
	 * 创建事件区域
	 * @param {Array} eventList:事件区域数组
	 */
	createEventSvg(eventList){
		const self = this;
		let y = 0,
			h = 0;
		self.eventArray.length = 0;
		self.removeAllChild(self.event);
		eventList.map((eItem) => {//发生事件时间
			let odd = new Date(eItem.eventOddurTime.replace(/-/g,"/"));
			let endDate = new Date();
			self.playArray.map((pItem, index) => {//判断是否在可播放区域内
				if( odd.getTime() >= pItem.sta.getTime() && odd <= pItem.end.getTime() ){//发生事件的时间点在可播放区域内
					let time_dif = parseInt(pItem.end - odd) / 1000;
					if(time_dif * SPEED < EVENT_WIDTH){//可播放区域小于30秒
						y = self.timeToScaleY(pItem.end);
						h = time_dif * SPEED;
						endDate.setTime(pItem.end.getTime());
					}
					else{
						y = self.timeToScaleY(odd);
						h = EVENT_WIDTH;
						y = y - h;
						endDate.setTime(odd.getTime());
						endDate.setSeconds(endDate.getSeconds() + 30);
					}
					self.eventArray.push({sta:odd, end:endDate});
					self.appendRect(self.event, 'event-area', y, h);
				}
			});
		});
	}
	
	/*createScaleInterval(){
		const self = this;
		if(!self.scaleInterval){
			self.scaleInterval = window.setInterval(() => {
				let _dTime = new Date();
				_dTime.setTime(self.state.currentTime.getTime());
				_dTime.setSeconds(_dTime.getSeconds() + 1);
				self.setState({currentTime: _dTime});
				self.setAxisY(self.timeToAxisY(_dTime));
				self.findEventTime(_dTime);
			}, 1000);
		}
	}
	clearScaleInterval(){
		const self = this;
		if(self.scaleInterval){
			window.clearInterval(self.scaleInterval);
			self.scaleInterval = null;
		}
	}*/
	/**
	 * 直播时间定时器
	 */
	createLtInterval(){
		const self = this;
		if(!self.liveTime){
			self.liveTime = window.setInterval(() => {
				let _dTime = new Date();
				_dTime.setTime(self.state.currentTime.getTime());
				_dTime.setSeconds(_dTime.getSeconds() + 1);
				self.setState({currentTime: _dTime});
				self.setAxisY(self.timeToAxisY(_dTime));
			}, 1000);
		}
	}
	
	/**
	 * 清除直播时间定时器
	 */
	clearLtInterval(){
		const self = this;
		if(self.liveTime){
			window.clearInterval(self.liveTime);
			self.liveTime = null;
		}
	}
	
	defaultEvent(e) {
		e.preventDefault();
	}
	
	handleTouchStart(e){//开始拖动时间轴触发的事件
		const self = this;
		const touch = e.touches[0];
		const scaleY = typeof(self.timeAxis.transform) != 'undefined' ? self.timeAxis.transform.animVal.getItem("translate").matrix.f : MIN_DISTANCE * 2;
		self.startY = touch.clientY - scaleY;
		self.clearLtInterval();
		//阻止页面的滑动默认事件
		document.addEventListener("touchmove",self.defaultEvent,false);
	}
	
	handleTouchMove(e){//时间轴拖动中触发的事件
		const self = this;
		e.preventDefault();
		const touch = e.touches[0];
   		let differY = touch.clientY - self.startY;//鼠标移动距离
   		if(differY >= AXIS_MAX_BOTTOM){
   			self.setAxisY(AXIS_MAX_BOTTOM);
   		}
   		else if(differY <= AXIS_MIN_TOP){
   			self.setAxisY(AXIS_MIN_TOP);
   		}
   		else{
   			self.setAxisY(differY);
   		}
	}
	
	handleTouchEnd(){//时间轴结束拖动触发的事件
		const self = this;
		const _timeAxisY = typeof(self.timeAxis.transform) != 'undefined' ? self.timeAxis.transform.animVal.getItem("translate").matrix.f : MIN_DISTANCE * 2;
		const _newTime = self.axisYToTime(_timeAxisY);
		self.changePlayTime(helper.formatDate(_newTime, 'yyyy/MM/dd hh:mm:ss'));
		document.removeEventListener("touchmove",self.defaultEvent,false);
	}
	
	/**
	 * 计算可播放的最近时间(请求接口成功返回数据后用)
	 * @param {Date} newTime:新的日期对象
	 */
	findCurrentTime(newTime){
		const self = this;
		if(self.playArray.length == 0){
			return helper.formatDate(newTime);
		}
		let find = false;
		let currentTime = new Date();
		console.log('可播放区域数组：',self.playArray);
		
		//点在可以播放区域内，直接返回当前时间
		for(let i = 0; i < self.playArray.length; i++){
			if(newTime.getTime() >= self.playArray[i].sta.getTime() && newTime.getTime() <= self.playArray[i].end.getTime()){
				console.log('点在可播放区域内');
				currentTime.setTime(newTime.getTime());
				find = true;
				break;
			}
		}
		if(find){
			return helper.formatDate(currentTime);
		}
		
		//点在所有视频区域之前，返回第一个视频区域的开始时间
		for(let j = 0; j < self.playArray.length; j++){
			if(newTime.getTime() < self.playArray[j].sta.getTime()){
				if(j == 0){
					console.log('点在所有事件区域之前');
					currentTime.setTime(self.playArray[j].sta.getTime());
					find = true;
					break;
				}
			}
		}
		if(find){
			return helper.formatDate(currentTime);
		}
		
		//点在两视频区域之间，返回下一个视频区域的开始时间
		//点在所有视频区域之后，返回最后一个视频区域的结束时间
		for(let k = 0; k < self.playArray.length; k++){
			if(newTime.getTime() > self.playArray[k].end.getTime()){
				if(k < self.playArray.length - 1){
					console.log('点在事件两区域之间');
					currentTime.setTime(self.playArray[k + 1].sta.getTime());
				}
				else{
					console.log('点在所有事件区域之后');
					currentTime.setTime(self.playArray[k].end.getTime());
					find = true;
					break;
				}
			}
			else{
				find = true;
				break;
			}
		}
		if(find){
			return helper.formatDate(currentTime);
		}
	}
	
	/**
	 * 查找事件时间
	 * @param {Date} newTime:新的日期对象
	 */
	findEventTime(newTime){
		const self = this;
		if(self.eventArray.length == 0){
			return;	
		}
		let imageY = self.eventImage.transform.animVal.getItem("translate").matrix.f;
		self.eventArray.map((item) => {
			if(newTime.getTime() > item.sta.getTime() && newTime.getTime() < item.end.getTime()){
				console.log('事件播放开始！！！！！');
				let diff = parseInt(item.end.getTime() - item.sta.getTime()) / 1000;
				let speed = this.imgBgHeight / diff;
				let move = imageY - speed;
				self.eventImage.removeAttribute('class');
				self.eventImage.setAttribute('transform', 'translate(' + this.imageX + ', ' + move + ')');
			}
			if(newTime.getTime() >= item.end.getTime()){
				console.log('事件播放结束^^^^^');
				self.eventImage.setAttribute('class', 'none');
				self.eventImage.setAttribute('transform', 'translate(' + this.imageX + ', 40)');
			}
		});
	}
	/**
	 * 更新播放时间
	 * @param {String} dateStr:新的时间字符串
	 */
	changePlayTime(dateStr){
		const self = this;
		const { actions } = self.props;
		const crDate = helper.formatDate(new Date(), 'yyyy/MM/dd hh:mm:ss');
		console.log('选择的时间：', dateStr);
		console.log('默认时间：', crDate);
		if(dateStr >= crDate){
			console.log('选择的时间大于或等于当前默认时间，进入直播');
			/*从点播切换到直播*/
			jsBridge.send({
				service: 'LiveAndPlayBack',
				action: 'toPlayLive',
			}).then(res => {
			});
			actions.setPlayType(1);
			self.playLiveVideo(dateStr);
		}
		else{
			console.log('选择的时间小于当前默认时间，进入全时播放');
			actions.setPlayType(2);
			self.playbackVideo(dateStr);
		}
	}
	/**
	 * 进入直播
	 * @param {String} newTime:新的日期字符串
	 */
	playLiveVideo(newTime){
		const self = this;
		let _newTime = newTime > helper.formatDate(new Date(), 'yyyy/MM/dd hh:mm:ss') ? new Date() : new Date(newTime);
		self.setAxisY(self.timeToAxisY(_newTime));
		if(self.state.online){
			self.createLtInterval();
		}
		else{
			self.clearLtInterval();
		}
		self.setState({currentTime:_newTime});
		
		if(self.params.startTime == '' && self.params.endTime == ''){
			console.log("**首次进入播放页面，默认状态为直播，第一次请求文件列表接口**");
			self.setParamsTime(_newTime);
			self.getVideoFileExtList(() => {
		    	self.firstRequest = true;
		    });
		}
		else{
			if(helper.formatDate(_newTime, 'yyyy/MM/dd hh:mm:ss') >= self.params.startTime.replace(/-/g,"/") && 
				helper.formatDate(_newTime, 'yyyy/MM/dd hh:mm:ss') <= self.params.endTime.replace(/-/g,"/")){
					console.log('!!!在上次请求起始时间内, 把firstRequest置为true');
					self.firstRequest = true;
			}
			else{
				console.log('!!!超出了上次请求的起始时间, 重新请求文件列表接口');
				self.setParamsTime(_newTime);
				self.getVideoFileExtList(() => {
			    	self.firstRequest = true;
			    });
			}
		}
	}
	
	/**
	 * 进入点播
	 * @param {String} newTime:新的日期字符串
	 */
	playbackVideo(newTime){
		const self = this;
		self.clearLtInterval();
		let _newTime = new Date(newTime);
		let _checkTime = '';
		self.setState({currentTime:_newTime});
		console.log('~当前时间：', newTime, '!开始时间：', self.params.startTime.replace(/-/g,"/"), '@结束时间：', self.params.endTime.replace(/-/g,"/"));
		if(newTime >= self.params.startTime.replace(/-/g,"/") && newTime <= self.params.endTime.replace(/-/g,"/")){
			console.log('!!!在上次请求起始时间内, 更新播放时间：', helper.formatDate(newTime));
			if(!self.videoFileList.code || self.videoFileList.code != 200){
				Toast.info(Lang.ipc.videoPlayer.tips[1]);
				return;
			}
			if(self.videoFileList.code == 200 && self.videoFileList.data.length == 0){
		//Toast.info(Lang.ipc.videoPlayer.tips[0]);
				jsBridge.send({
					service: 'LiveAndPlayBack',
					action: 'toPlayRecord',
					data:{json:''}
				}).then(res => {	
				});
				return;
			}
			_checkTime = self.findCurrentTime(_newTime);
			console.log('经过计算返回的时间：',_checkTime);
			
			if(self.firstRequest){
				console.log('toPlayRecord...');
				self.firstRequest = false;
				jsBridge.send({
					service: 'LiveAndPlayBack',
					action: 'toPlayRecord',
					data:{json:JSON.stringify(self.videoFileList),time:_checkTime,type:'allTime'}
				}).then(res => {	
					self.setAxisY(self.timeToAxisY(new Date(_checkTime.replace(/-/g,"/"))));
				});
			}
			else{
				console.log('seek...');
				jsBridge.send({
					service: 'LiveAndPlayBack',
					action: 'seek',
					data:{time:_checkTime},
				}).then(res => {
					self.setAxisY(self.timeToAxisY(new Date(_checkTime.replace(/-/g,"/"))));
				});
			}
		}
		else{
			console.log('!!!超出了上次请求的起始时间, 更新播放时间：', helper.formatDate(newTime));
			self.setParamsTime(_newTime);
			self.getVideoFileExtList(() => {
				self.firstRequest = false;
				console.log('toPlayRecord...');
				_checkTime = self.findCurrentTime(_newTime);
				console.log('经过计算返回的时间：',_checkTime);
				jsBridge.send({
					service: 'LiveAndPlayBack',
					action: 'toPlayRecord',
					data:{json:JSON.stringify(self.videoFileList),time:_checkTime,type:'allTime'}
				}).then(res => {	
					self.setAxisY(self.timeToAxisY(new Date(_checkTime.replace(/-/g,"/"))));
				});
			});
		}
	}
	
	render(){
		return (
			<svg className="scale-box">
				<rect 
				  className="scale-bg" 
				  fill="#4E5367"
				  onTouchStart={this.handleTouchStart}
				  onTouchMove={this.handleTouchMove}
				  onTouchEnd={this.handleTouchEnd}
				  ref={scaleBg => this.scaleBg = scaleBg}
				/>
				<g transform="translate(0, 40)" ref={timeAxis => this.timeAxis = timeAxis}>
					<g ref={scale => this.scale = scale} />
					<g ref={video => this.video = video} />
					<g ref={event => this.event = event} />
				</g>
				<g ref={eventImage => this.eventImage = eventImage} className="none">
					<rect x={0} y={0} fill="#000000" className="event-image-bg"/>
					<image className="event-image-loading" href={require("../../public/resource/image/default/loading_the_drop_down.png")}/>
					{/*<image x={2} y={2} className="event-image" href="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1525257676992&di=6a44f02d9333a68227627521ede874e4&imgtype=0&src=http%3A%2F%2Fimage14-c.poco.cn%2Fmypoco%2Fqing%2F20130204%2F11%2F7851822501582084985_650x365_220.jpg"/>*/}
				</g>
				<g transform="translate(18,30)">
					<polygon points="0,0 13,10 0,20" className="polygon"/>
					<rect x={20} y={10} fill="#FFFFFF" className="base-line" ref={baseLine => this.baseLine = baseLine}/>
					<text className="base-text" ref={timeTxt => this.timeTxt = timeTxt}>{helper.changeTimeto12(this.state.currentTime)}</text>
				</g>
			</svg>
		)
	}
}

const mapStateToProps = state => {
	return {}
};
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
		setPlayType,
		setDataState
	},dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps) (AllTimeScale)
