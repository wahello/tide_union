import React, {
	Component
} from 'react';
import './default/style.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Lang } from '../public';
import { Route, Link } from 'react-router-dom';
import BarTitle from '../component/barTitle';
import { Toast,Flex,PullToRefresh } from 'antd-mobile';
import { link } from 'fs';
import ScrollView from '../component/scrollView';
import jsBridge from '../jssdk/JSBridge';
import helper from '../public/helper';
import { getSDOneHourList,getTimeList,clearTimeListInfo } from '../action/ipc';

const timeArr = [["00:00","01:00","02:00","03:00","04:00","05:00"],
				["06:00","07:00","08:00","09:00","10:00","11:00"],
				["12:00","13:00","14:00","15:00","16:00","17:00"],
				["18:00","19:00","20:00","21:00","22:00","23:00"]]
const defaultDay = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
const mockData = []
const SDLang = Lang.ipc.ipcSDCard;
class VideoSingleDay extends Component{
	constructor(props) {
		super(props);
		this.state={
			refreshing: false,
      down: true,
			eventArr:[]
		}
	}
	componentDidMount() {
    this.setState({
      eventArr:this.props.data.eventArr
    });
	}

	render() {
		return(
			<div className="videoOfDay" key={this.props.key}>
				<h2>{this.props.data.date}</h2>
				<div className="singleDay">
					{
						this.state.eventArr.length ? timeArr.map((item,index)=><Flex key={index}>{item.map((i,eq) => <Flex.Item  key={eq}  className={(this.state.eventArr[parseInt(i.split(":")[0])])?"singleHour choose":"singleHour"}  
							onClick={this.props.onClick.bind(this,this.state.eventArr[parseInt(i.split(":")[0])],this.props.data.date,i)}>{i}</Flex.Item>)}</Flex>):SDLang.infoMessage[4]
					}
				</div>
			</div>
		);
	}
}


class SDVideoAll extends Component {
	constructor(props) {
		super(props);
		this.onRefresh = this.onRefresh.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleClickBack = this.handleClickBack.bind(this);
		this.getSDOneHourList = this.getSDOneHourList.bind(this);
		this.getStartAndEndTime  = this.getStartAndEndTime.bind(this);
		this.state = {
			height:document.documentElement.clientHeight - 64,
			videoArr:this.videoArrFactory(this.props.timeListInfo),
			timePoint:new Date(this.props.requestDate.startTime.replace(new RegExp("-","gm"),"/"))
		}
		this.tmp={
			refreshing:false
		}
	}
	// [
	// 	{"date":"2018-05-04","eventArr":[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]},
	// 	{"date":"2018-05-03","eventArr":[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0]},
	// 	{"date":"2018-05-02","eventArr":[]}
	// ]


	componentDidMount() {
		// jsBridge.on('SDCard.timeList', function(res){
		// 	console.log("获取原生返回的时间列表");
		// 	console.log(res);
		// });	 
		
		this.props.isFetching && Toast.loading(SDLang.waitInfo[0],60,()=>{
			var startTime = new Date(this.props.requestDate.startTime.replace(new RegExp("-","gm"),"/"));
			this.props.isFetching && this.setState({videoArr:this.getDefaultTime(startTime)},()=>{
				Toast.info('请求超时！')
			})
		})
	}
	handleClick(hasEvent,date,time){
		hasEvent?this.getSDOneHourList(date,time):Toast.info(SDLang.infoMessage[3])
	}
	onRefresh(){
		if(this.tmp.refreshing) return;
		this.tmp.refreshing = true;
		this.setState({ refreshing: true });
		this.fetchSDVideoData().then(res=>{
			this.setState({ refreshing: false },()=>{this.tmp.refreshing = false});
		}).catch((err)=>{
			Toast.info(err);
			this.setState({ refreshing: false },()=>{this.tmp.refreshing = false});
		})
	}
	getStartAndEndTime(){
		var endTime = new Date(this.state.timePoint.getTime()-1000);
		var startTime = new Date(endTime.getTime() - 172800000)
		return {startTime:helper.formatDate(startTime,"yyyy-MM-dd")+' 00:00:00',
						endTime:helper.formatDate(endTime,"yyyy-MM-dd hh:mm:ss")}
	}


	fetchSDVideoData(cb){
		return this.props.actions.getTimeList({
			service:'SDCard',
			action: 'getTimeList',
			data:this.getStartAndEndTime(),
		 })
	}

	getSDOneHourList(date,time){
		this.props.actions.getSDOneHourList({
			service: 'SDCard',
			action: 'getSDRecordList',
            // data:{startTime:'2018-04-19 19:00:00',endTime:'2018-04-19 19:59:59'},
			data:{startTime:date+" "+time+":00",endTime:date+" "+time.split(":")[0]+":59:59",hour:time},
		})
		this.props.history.push('/ipc/SDVideoOfDay')
	}


	handleClickBack(data) {
		this.props.clearTimeList()
		this.props.history.goBack()
	}
	componentWillReceiveProps(nextProps){
		nextProps.isFetching || Toast.hide();
		var startTime = new Date(nextProps.requestDate.startTime.replace(new RegExp("-","gm"),"/"));
		this.setState({timePoint:startTime});
		nextProps.status ? this.setState({videoArr:this.videoArrFactory({...nextProps.timeListInfo})}) : this.setState({videoArr:this.getDefaultTime(startTime)},()=>{
			Toast.info(SDLang.infoMessage[5])
		})
	}

	getDefaultTime(startTime){
		var exitArr = this.state.videoArr
		return [...exitArr,	{"date":helper.formatDate(new Date(startTime.getTime() - 86400000),"yyyy-MM-dd"),'eventArr':defaultDay},
												{"date":helper.formatDate(new Date(startTime.getTime() - 172800000),"yyyy-MM-dd"),'eventArr':defaultDay},
												{"date":helper.formatDate(new Date(startTime.getTime() - 259200000),"yyyy-MM-dd"),'eventArr':defaultDay}]
	}

	videoArrFactory(obj){
		console.log("videoArrFactory",obj)
		var keyArr = Object.keys(obj).sort((prev,next)=>{
			return (new Date(prev.replace(new RegExp("-","gm"),"/")).getTime() - new  Date(next.replace(new RegExp("-","gm"),"/")).getTime())
		}).reverse();
		if(keyArr.length === 0)  return [];
		return  keyArr.map(key=>{
			return {
				'date':key.split(" ")[0],
				'eventArr':obj[key]
			}
		})
		
	}

	render() {
		return(
			<div className="ipcSD">
				<BarTitle  title={SDLang.title[0]} onBack={this.handleClickBack} />
				<ScrollView>
					<PullToRefresh  ref="PullToRefresh"
						style={{
							height: this.state.height,
							overflow: 'auto',
						}}
						indicator={this.state.down ? {} : { deactivate: SDLang.waitInfo[1] }}
						direction={this.state.down ? 'down' : 'up'}
						refreshing={this.state.refreshing}
						onRefresh={this.onRefresh}>
					<div className="SD_alltime">
						{
							this.state.videoArr.map((item,index)=> <VideoSingleDay key={index} data={item} onClick={this.handleClick}/>)
						}    
					</div> 
					</PullToRefresh>
				</ScrollView>
			</div>
		);
	}
}



//将state绑定到props
const mapStateToProps = state => {
    console.log("SDVideoAll")
    console.log(state);
	return{
		requestDate:state.ipc.requestDateInterval,
		isFetching:state.ipc.isFetching,
		status:state.ipc.status,
		timeListInfo:state.ipc.timeListInfo,
		errorInfo:state.ipc.errorInfo
	}
};
const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			getSDOneHourList,
			getTimeList
		}, dispatch),
		clearTimeList:()=>{dispatch(clearTimeListInfo())}
	}
};
export default connect(mapStateToProps, mapDispatchToProps)(SDVideoAll)