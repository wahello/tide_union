import React, {Component} from 'react';
import { showDialog ,selectTab} from '../../action';
import { Lang } from '../../public';
import { connect } from 'react-redux';
import { SwipeAction, PullToRefresh, DatePicker, Toast } from 'antd-mobile';
import ReactDOM from 'react-dom';
import Ipcplan from '../../jssdk/ipcplan';
import helper from '../../public/helper';
import { bindActionCreators } from 'redux';
import { setPlayType, setDataState, setPlayTime, setPauseTime } from '../../action';
import jsBridge from '../../jssdk/JSBridge';
import 'antd-mobile/lib/pull-to-refresh/style/css';
import 'antd-mobile/lib/list-view/style/css';
import EventItem from './eventItem';

const PAGE_SIZE = 10;//全局常量。一页显示10条数据
const PAGE_HEIGHT = document.documentElement.clientHeight;//页面的高度

class EventList extends Component {
	constructor(props) {
		super(props);
		const {planId} = this.props.data;
		/*全局变量*/
		this.params = {
			planId : planId,
			fileType : "ts",
			startTime : "",
			endTime : ""
		};
		this.videoFileList = {};//保存文件数据
		this.playData = {};//存放事件时间点对应的播放数据
		this.recordTotal = 0;//存放图片列表总数
		this.currPage = 0;//存放当前页数
		this.currentPlayTime = '';//存放当前事件播放的时间
		this.timeSection = [];//存放视频文件请求时间段
		this.requestNum = 0;//记录请求次数
		/*end*/
	    this.state = {
	    	photoList:[],
	    	isLoading: true,
	    	height: 0,
		    refreshing: true,
		    online:false,
		    playBackStatus:0
	    };
//	    this.setDefaultParamsTime = this.setDefaultParamsTime.bind(this);
	    this.getNextPhotoUrlList = this.getNextPhotoUrlList.bind(this);
	    this.generatePlayData = this.generatePlayData.bind(this);
	    this.handleOnPlayClick = this.handleOnPlayClick.bind(this);
	    this.handleOnPauseClick = this.handleOnPauseClick.bind(this);
	    this.getData = this.getData.bind(this);
	    this.onRefresh = this.onRefresh.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.getNextEventTime = this.getNextEventTime.bind(this);
	}
	
	componentDidMount() {
		const self = this;
		const { actions, data } = this.props;
  		if(self.state.online){
			console.log('设备在线，开始直播')
		}
		else{
			console.log('设备离线');
		}
		jsBridge.on('LiveAndPlayBack.playBackStatus', function (res) {
			console.log('playBackStatus',res);//res= 0 无状态 1 播放 2 暂停 3 播放结束 
			self.setState({playBackStatus:res.state});
			if(res.state == 1){//开始播放视频
				console.log('开始播放，播放按钮变为暂停，当前播放时间为：',self.currentPlayTime);
				actions.setPlayTime(self.currentPlayTime);
				actions.setPauseTime('');
			}
			else if(res.state == 2){//视频暂停播放返回状态
				actions.setPauseTime(self.currentPlayTime);
				actions.setPlayTime('');
			}
			else if (res.state == 3) {
				self.currentPlayTime = self.getNextEventTime();
				if(self.currentPlayTime !== ''){
					console.log('toPlayNextRecord...');
			  		jsBridge.send({
						service: 'LiveAndPlayBack',
						action: 'toPlayRecord',
						data:{json:JSON.stringify(self.playData[self.currentPlayTime]),time:self.currentPlayTime,type:'event'}
					}).then(res => {	
					});
				}
			}
		});
		jsBridge.on('LiveAndPlayBack.playBackLoadingStatus', function (res) {
			// 4缓冲中 5缓冲结束
			console.log('playBackLoadingStatus',res); 
			self.setState({playBackStatus:res.state});
			if(res.state == 4){
				Toast.loading('loading');
			}
			if(res.state == 5) {
				Toast.hide();
			}
		});
  		if(this.params.startTime == '' && this.params.endTime == ''){//第一次进入事件播放页面，设置默认请求时间为当天0点到当前时间点
  			console.log('data------------------------------------------',data)
  			if(data.eventStartTime !== '' && data.eventEndTime !== ''){
  				this.params.startTime = data.eventStartTime;
  				this.params.endTime = data.eventEndTime;
  				this.getData(false);
  			}
		}
  	}
	
 	componentWillReceiveProps(nextProps){
		if(typeof(nextProps) != 'undefined'){
			const { data } = nextProps;
			const { actions } = this.props;
			if(this.state.online !== data.online){
				this.setState({online:data.online});
			}
//			console.log('选择的查询时间-----开始时间:', data.eventStartTime, '结束时间：' , data.eventEndTime);
//			console.log('请求参数------开始时间：', this.params.startTime, '结束时间' , this.params.endTime)
			if(data.eventStartTime == '' || data.eventEndTime ==''){
//				console.log('首次进入播放页面，没有更新请求参数！！！！');
			}
			else{
//				console.log('已更新请求参数！！！！');
				if(this.params.startTime !== data.eventStartTime || this.params.endTime !== data.eventEndTime){
					this.params.startTime = data.eventStartTime;
					this.params.endTime = data.eventEndTime;
					this.getData(false);
				}
				else{
//					console.log('请求参数没变');
				}
			}
			console.log('nextProps:',data.playType, 'props:',this.props.playType);
			if(data.playType !== this.props.playType && data.playType == 1){
				/*从点播切换到直播*/
				jsBridge.send({
					service: 'LiveAndPlayBack',
					action: 'toPlayLive',
				}).then(res => {
				});
				actions.setPlayType(1);
				actions.setPlayTime('');
				this.currentPlayTime = '';
			}
			if(data.heightTotal !== 0 && this.state.height !== PAGE_HEIGHT - data.heightTotal){
				this.setState({height:PAGE_HEIGHT - data.heightTotal});
			}
//			console.log('更新后的请求参数：',this.params.startTime, this.params.endTime);
			/*if(typeof(nextProps.playTime) != 'undefined'){
				this.currentPlayTime = nextProps.playTime;
			}*/
		}
 	}
 	
 	/**
	 * 把时间字符串转换为时间戳
	 * @param {String} timeStr 时间字符串
	 */
 	getTime(timeStr){
 		if(typeof(timeStr) !== 'string'){
 			return;
 		}
 		return new Date(timeStr.replace(/-/g, "/")).getTime();
 	}
 	
 	/**
	 * 请求文件列表接口、图片列表接口
	 * @param {Boolean} isOnRefresh: 判断是否上拉刷新查询 
	 */
 	getData(isOnRefresh){
		const self = this;
		const { actions } = self.props;
		Toast.loading('loading');
		let fileParameter = {
 			planId : self.params.planId,
			fileType : 'ts',
			startTime : '',
			endTime : ''
 		}
		let photoParameter = {
	      pageNum: 1,
	      pageSize: PAGE_SIZE,
	      planId:self.params.planId,
	      eventCode:'12',
	      eventStartTime:'',
	      eventEndTime:''
	    }
		
		if(isOnRefresh){//上拉刷新重新查询下一个时间段
			self.requestNum -= 1;
			console.log('requestNum', self.requestNum);
			fileParameter.startTime = self.timeSection[self.requestNum].sta;
			fileParameter.endTime = self.timeSection[self.requestNum].end;
			photoParameter.eventStartTime = self.timeSection[self.requestNum].sta;
			photoParameter.eventEndTime = self.timeSection[self.requestNum].end;
		}
		else{//首次查询
			self.videoFileList = {};//清空文件列表
			self.state.photoList.splice(0, self.state.photoList.length);//清空图片列表
			self.playData = {};//清空播放数据
			self.requestNum = 0;//清空请求次数
			let diffTime = self.getTime(self.params.endTime) - self.getTime(self.params.startTime);
			let hour = Math.floor(diffTime/(3600*1000));
			if(hour > 2){//选择查询时间大于两个小时，查询文件列表需要分段查询
				self.timeSection.splice(0, self.timeSection.length);
				let tmpTime = new Date();
				let tmp_staTime = self.params.startTime,
					tmp_endTime = '';
				tmpTime.setTime(self.getTime(self.params.startTime));
				while(tmpTime.getTime() < self.getTime(self.params.endTime)){
					tmpTime.setHours(tmpTime.getHours() + 2);
					if(tmpTime.getTime() < self.getTime(self.params.endTime)){
						tmp_endTime = helper.formatDate(tmpTime);
					}
					else{
						tmp_endTime = self.params.endTime;
					}
					self.timeSection.push({sta:tmp_staTime,end:tmp_endTime});
					tmp_staTime = tmp_endTime;
				}
				console.log('分割后的数组：',self.timeSection);
				self.requestNum = self.timeSection.length !== 0 ? self.timeSection.length : 0;
				self.requestNum -= 1;
				console.log('requestNum', self.requestNum);
				fileParameter.startTime = self.timeSection[self.requestNum].sta;
				fileParameter.endTime = self.timeSection[self.requestNum].end;
				photoParameter.eventStartTime = self.timeSection[self.requestNum].sta;
				photoParameter.eventEndTime = self.timeSection[self.requestNum].end;
			}
			else{//选择的查询时间小于两个小时
				fileParameter.startTime = self.params.startTime;
				fileParameter.endTime = self.params.endTime;
				photoParameter.eventStartTime = self.params.startTime;
				photoParameter.eventEndTime = self.params.endTime;
			}
		}
		
		request();
		
		function request(){
			let promiseList= [];
			promiseList.push(
				Ipcplan.getVideoFileList(fileParameter).then(res => {//请求文件列表
					Toast.hide();
					if(res.code)
					self.videoFileList = res;
					let _fileList = !res.data?[]:res.data;
					if(res.code == 200 && _fileList.length != 0){//请求成功,有数据
						actions.setDataState(true);
						_fileList = _fileList.filter((item) => {
							return item.fileSize != 0;
						});
						self.videoFileList.data = _fileList;
						console.log('!!!!!!!!!!过滤后的文件列表：',self.videoFileList);
					}
					else{//请求失败，无数据
						actions.setDataState(false);
						self.videoFileList.data = [];
//						Toast.info(Lang.ipc.videoPlayer.tips[0]);
					}
				}).catch(res => {//请求失败，无数据
					actions.setDataState(false);
					self.videoFileList.data = [];
					Toast.info(Lang.ipc.videoPlayer.tips[0]);
				})
			);
			promiseList.push(
				Ipcplan.getEventPhotoList(photoParameter).then((res) => {//请求图片URL列表接口
		    	if(res.code == 200 && res.data.list.length != 0){//请求成功,有数据
		    		self.currPage = res.data.pageNum;
					self.recordTotal = res.data.total;
					res.data.list.map((item) => {
						self.state.photoList.push({'eventOddurTime':item.eventOddurTime, 'url':item.url});
					});
		    		self.setState({
		    			refreshing: false,
		    		});
		    	}
		    	else{//请求失败，无数据
		    		actions.setDataState(false);
//		    		Toast.info(Lang.ipc.eventPlay.tips[2]);
		    	}
		    }).catch((err) => {//请求失败，无数据
		    	actions.setDataState(false);
		    	Toast.info(Lang.ipc.eventPlay.tips[2]);
				})
			);
			Promise.all(promiseList).then((res) => {
				console.log('~~~~~~~文件列表、图片列表已请求完成~~~~~~~');
				if(self.state.photoList.length !== 0 && self.videoFileList.data.length !== 0){//查到图片列表跟文件列表，才会生成播放数据
					self.generatePlayData();
					if(self.state.photoList.length < 10){
						console.log('图片列表小于10条记录，判断是否还有下一时间段的请求');
						if(self.requestNum !== 0){
							self.requestNum -= 1;
							console.log('查到的图片记录小于10条进入下一轮请求,请求次数为：', self.requestNum);
							fileParameter.startTime = self.timeSection[self.requestNum].sta;
							fileParameter.endTime = self.timeSection[self.requestNum].end;
							photoParameter.eventStartTime = self.timeSection[self.requestNum].sta;
							photoParameter.eventEndTime = self.timeSection[self.requestNum].end;
							request();
						}
					}
					else{
						console.log(`目前已请求到的分割数组下标:${self.requestNum},目前已请求到以下时间段：${self.timeSection[self.requestNum].sta} - ${self.timeSection[self.requestNum].end}`)
					}
				}
				else{//查不到数据，查询分割时间数组，如果长度不为0，则进入下一轮请求
					if(self.requestNum !== 0){
						self.requestNum -= 1;
						console.log('查不到数据进入下一轮请求,请求次数为：', self.requestNum);
						fileParameter.startTime = self.timeSection[self.requestNum].sta;
						fileParameter.endTime = self.timeSection[self.requestNum].end;
						photoParameter.eventStartTime = self.timeSection[self.requestNum].sta;
						photoParameter.eventEndTime = self.timeSection[self.requestNum].end;
						console.log('fileParameter.startTime', fileParameter.startTime);
						console.log('fileParameter.endTime', fileParameter.endTime);
						console.log('photoParameter.eventStartTime', photoParameter.eventStartTime);
						console.log('photoParameter.eventEndTime', photoParameter.eventEndTime);
						request();
					}
					else{
						Toast.info(Lang.ipc.eventPlay.tips[2]);
					}
				}
				
			})
		}
		
 		
		
		
 	}
 	
	/**
	 * 设置默认开始、结束时间(当前时间点前后一个小时的区间)
	 * @param {String} sta 开始时间
	 * @param {String} end 结束时间
	 */
	/*setDefaultParamsTime(sta, end){
		const self = this;
		const currentTime = new Date();
		let startTime = new Date();
	    let endTime = new Date();
	    startTime.setTime(currentTime.getTime());
	    endTime.setTime(currentTime.getTime());
	    startTime.setHours(startTime.getHours() - 1);
	    endTime.setHours(endTime.getHours() + 1);
	    self.params.startTime = helper.formatDate(startTime);
	    self.params.endTime = helper.formatDate(endTime);
	}
	*/
	/**
	 * 获取下一页事件图片URL列表
	 * @param {Int} pageNum 请求页数
	 * @param {Object} callback 回调函数
	 */
  getNextPhotoUrlList(pageNum, callback){
  	const self = this;
  	console.log('下一页：：：：：：', pageNum);
  	console.log('请求图片列表下一页的时间：', self.timeSection[self.requestNum].sta, self.timeSection[self.requestNum].end);
  	const { actions } = this.props;
		let photoUrlList = [],
			tmpArr = [];
	    let photoParameter = {
	      pageNum: pageNum,
	      pageSize: PAGE_SIZE,
	      planId:self.params.planId,
	      eventCode:'12',
	      eventStartTime:self.timeSection[self.requestNum].sta,
	      eventEndTime:self.timeSection[self.requestNum].end
	    }
		Ipcplan.getEventPhotoList(photoParameter).then((res) => {//请求图片URL列表接口
    	if(res.code == 200 && res.data.list.length != 0){
    		self.currPage = res.data.pageNum;
			self.recordTotal = res.data.total;
			res.data.list.map((item) => {
				photoUrlList.push({'eventOddurTime':item.eventOddurTime, 'url':item.url});
			});
			tmpArr = self.state.photoList.concat(photoUrlList);
			
    		self.setState({
    			refreshing: false,
    			photoList:tmpArr
    		}, () => {callback(photoUrlList)});
    	}
    	else{
    		actions.setDataState(false);
    		Toast.info(Lang.ipc.eventPlay.tips[2]);
    	}
    	
    }).catch((err) => {
    	actions.setDataState(false);
			/*setTimeout(() => {
				self.rData = genData();
				self.setState({
					dataSource: self.state.dataSource.cloneWithRows(self.rData),
					refreshing: false,
					isLoading: false,
				});
			}, 600);*/
		});
	}

	/**
	 * 生成事件时间点对应的播放数据
	 */
	generatePlayData(photoList){
		const self = this;
		if(typeof(self.videoFileList.data) == 'undefined' || self.state.photoList == 0){
			return;
		}
		const fileList = self.videoFileList.data;
		const eventList = typeof photoList !== 'undefined' ? photoList : self.state.photoList;
		let k = eventList.length - 1;//事件列表数组最后一项下标
		let key = eventList[k].eventOddurTime;
		let tmpArr = [];
		self.playData[key] = {"code": 200,"desc": "Success.","data":[]};
		for(let i = 0; i < fileList.length; i++){
			const infoDic = fileList[i];
			const fileStaTime = self.getTime(infoDic.videoStartTime);//文件列表第i项开始时间
			const fileEndTime = self.getTime(infoDic.videoEndTime);//文件列表第i项结束时间
			const eventStaTime = self.getTime(eventList[k].eventOddurTime);//事件列表第k项开始时间
			let eventEndTime = new Date();
			eventEndTime.setTime(eventStaTime);
			eventEndTime.setSeconds(eventEndTime.getSeconds() + 30);//事件列表第k项结束时间
			
			if(fileStaTime >= eventStaTime && fileEndTime <= eventEndTime){//文件在事件时间范围内
				self.playData[key].data.push(infoDic);
				delete self.videoFileList.data[i];
				if(i >= (fileList.length - 1)){//文件列表数组到了最后一项，直接退出
					break;
				}
				const infoDic1 = fileList[i+1];
				//第一个数组的下一项的开始时间，结束时间
				const fileStaTime1 = self.getTime(infoDic1.videoStartTime);
				const fileEndTime1 = self.getTime(infoDic1.videoEndTime);
				if(fileStaTime1 >= eventEndTime || fileEndTime1 > eventEndTime){//下一个数组的starttime、endtime不在事件区域范围内
					k--;
					if(k < 0){//代表事件列表已经取完了
						break;
					}
					key = eventList[k].eventOddurTime;
					self.playData[key] = {"code": 200,"desc": "Success.","data":[]};
				}
			}
			if(fileStaTime >= eventEndTime || fileEndTime > eventEndTime){
				k--;
				if(k < 0){//代表事件列表已经取完了
					break;
				}
				key = eventList[k].eventOddurTime;
				self.playData[key] = {"code": 200,"desc": "Success.","data":[]};
			}
		}
		for(let i = 0; i < self.videoFileList.data.length; i++){
			if(typeof(self.videoFileList.data[i]) !== 'undefined'){
				tmpArr.push(self.videoFileList.data[i]);
			}
		}
		console.log('过滤后的文件列表：',tmpArr);
		self.videoFileList.data.splice(0, self.videoFileList.data.length);
		self.videoFileList.data = tmpArr;
		console.log('::::::::::::::result::::::::::::::', self.playData);
		console.log('文件列表--------------------------',self.videoFileList.data)
	}
	
	/**
	 * 查找下一个要播放的事件时间点
	 */
	getNextEventTime(){
		const self = this;
		const keys = Object.keys(self.playData).sort(function(a, b){//key从早到晚的时间进行排序
			let ta = self.getTime(a);
			let tb = self.getTime(b);
			if(ta < tb){
				return -1;
			}
			else if(ta > tb){
				return 1;
			}
			else{
				return 0;
			}
		});
		console.log('keysssssssssssssssssssssssss',keys);
		console.log('当前播放时间：',self.currentPlayTime);
		let index = keys.indexOf(self.currentPlayTime);
		
		if(index == -1){
			//没找到下一个播放的时间
			return '';
		}
		if(index < keys.length - 1){
			console.log('下一个要播放的事件时间：', keys[index + 1]);
			return keys[index + 1];
		}
		else{//已经找到最后一个
			console.log('已经找到最后一个');
			return '';
		}
	}
   
   /**
	 * 下拉刷新方法
	 */
  onRefresh(){
  	const self = this;
  	console.log('当前页数：', self.currPage, '总记录数：', self.recordTotal);
  	if(self.currPage * PAGE_SIZE < self.recordTotal){
  		console.log('还没请求完,请求下一页。');
  		self.getNextPhotoUrlList(self.currPage + 1, (list) => {
  			console.log('查询到下一页的URL列表:',list);
				self.generatePlayData(list);
			});
  	}
  	else{
  		console.log('已经请求完了,判断是否还有下一个时间段的请求。');
  		if(self.requestNum !== 0){
  			console.log('还有下一个时间段的请求。', self.requestNum);
  			self.getData(true);
  		}
  		else{
  			console.log('没有下一个时间段的请求。');
  		}
//		Toast.info(Lang.ipc.eventPlay.tips[3]);
  	}
  	
  };

  handleDelete(event){
  console.log("delete data")
  let that = this;
      that.props.showDialog(Lang.public.dialog.title[0], Lang.public.dialog.tip[0], [{
            text: Lang.public.dialog.button[0],
            handleClick: function(){
              this.hide();
            }
        },{
            text: Lang.public.dialog.button[1],
            className: "btn-split",
            handleClick: function(){
              this.hide();
              that.props.selectTab('device');
              that.setState({ data: [] });
            }
        }]);
    }
  handleOnPlayClick(time){
  	const self = this;
  	const { actions } = self.props;
  	if(typeof(self.playData[time]) == 'undefined'){
  		return;
  	}
  	actions.setPlayType(2);
  	console.log('点击播放按钮前的当前播放时间：', self.currentPlayTime);
  	
  	if(time == self.currentPlayTime){
  		if(self.state.playBackStatus == 2){
  			console.log('resume');
  			jsBridge.send({
				service: 'LiveAndPlayBack',
				action: 'resume',
			});
  		}
  	}
  	else{
  		self.currentPlayTime = time;
  		console.log('点击播放按钮，保存当前时间到全局变量self.currentPlayTime:', self.currentPlayTime);
  		console.log('播放的时间点：', time, '播放的文件列表：', self.playData[time].data);
  		if(self.playData[time].data.length == 0){
	  		jsBridge.send({
				service: 'LiveAndPlayBack',
				action: 'toPlayRecord',
				data:{json:''}
			}).then(res => {	
			});
	  	}
	  	else{
	  		console.log('toPlayRecord...');
	  		jsBridge.send({
				service: 'LiveAndPlayBack',
				action: 'toPlayRecord',
				data:{json:JSON.stringify(self.playData[time]),time:time,type:'event'}
			}).then(res => {	
			});
	  	}
  		
  	}
  	
  }
  
  handleOnPauseClick(){
  	jsBridge.send({
		service: 'LiveAndPlayBack',
		action: 'pause',
	});
  }
  
  
  render() {
    return (
      <div className="eventList" style={{height:this.state.height - 50}}>
	      <div className = {this.state.photoList.length?"":"no_list_image"}></div>
	      <div className = {this.state.photoList.length?"":"no_list_text"}>
	      	{this.state.photoList.length?"":Lang.ipc.eventList.tips[0]}
	      </div>
		      { this.state.photoList.length?
		      	<PullToRefresh
        			ref={el => this.ptr = el}
        			direction='up'
        			style={{
        				height:this.state.height - 50,
        				overflow:'auto'
        			}}
        			refreshing={this.state.refreshing}
        			onRefresh={this.onRefresh}
        		>
        		{
        			this.state.photoList.map((item) => 
        				<EventItem 
        					key = {item.eventOddurTime} 
        					data = {item}
        					onPlayClick = {this.handleOnPlayClick}
        					onPauseClick = {this.handleOnPauseClick}
        					/>
        			)
        		}
        		
        		</PullToRefresh>
						:""
					}
      </div>
    );   
  }
}


//将state绑定到props
const mapStateToProps = (state) => {
  return {
  	  selectedTab: state.other.selectedTab,
  	  playTime: state.ipc.playTime,
  	  playType: state.ipc.playType,
  }
};
//将action的所有方法绑定到props上
const mapDispatchToProps = (dispatch) => {
  return {
  	selectTab: (...args) => dispatch(selectTab(...args)),
    showDialog: (...args) => dispatch(showDialog(...args)),
  	actions: bindActionCreators({
			setPlayType,
			setDataState,
			setPlayTime,
			setPauseTime,
		},
    dispatch)
  }
};
export default connect(mapStateToProps, mapDispatchToProps)(EventList);