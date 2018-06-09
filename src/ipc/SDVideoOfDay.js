import React, {
	Component
} from 'react';
import './default/style.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Lang } from '../public';
import { Route, Link } from 'react-router-dom';
import BarTitle from '../component/barTitle';
import { Toast, Flex } from 'antd-mobile';
import { link } from 'fs';
import ScrollView from '../component/scrollView';
import { showDialog } from '../action';
import jsBridge from '../jssdk/JSBridge';
import { getSDOneHourList} from '../action/ipc';
const dialogLang = Lang.public.dialog;
const SDLang = Lang.ipc.ipcSDCard;
class SDVideoAll extends Component {
	constructor(props) {
		super(props);
		this.getWholeTime = this.getWholeTime.bind(this);
		this.handleDelVideo = this.handleDelVideo.bind(this);
		this.handleClickBack = this.handleClickBack.bind(this);
		this.handleClickToList = this.handleClickToList.bind(this);
		this.handleClickToPlay = this.handleClickToPlay.bind(this);
		this.handleClickToSelect = this.handleClickToSelect.bind(this);
		this.handleClickCheckbox = this.handleClickCheckbox.bind(this);
		this.handleClickAllCheckbox = this.handleClickAllCheckbox.bind(this);
		this.state = {
			select: false,
			chooseArr: [],
			allSelect: false,
			eventList:this.props.eventList,
		}
	}
	componentDidMount() {
		var that = this;
		this.props.isFetching && Toast.loading(SDLang.waitInfo[0],60)
	}
	componentWillReceiveProps(nextProps){
		this.setState({ select: false })
		nextProps.isFetching || Toast.hide();
		nextProps.status ? this.setState({eventList:nextProps.eventList}) : Toast.info(SDLang.infoMessage[5])
	}

	handleClickBack(data) {
		this.props.history.goBack()
	}
	handleClickCheckbox(data) {
		let chooseArr = this.state.chooseArr
		let index = chooseArr.indexOf(data)
		index > -1 ? chooseArr.splice(index, 1) : chooseArr.push(data);
		let allSelect = (chooseArr.length === this.state.eventList.length)
		this.setState({ chooseArr, allSelect })
	}
	handleClickToSelect() {
		this.setState({ select: true })
	}

	handleClickToPlay(item) {
		console.log(item);
		jsBridge.send({
			service:'SDCard',
			action: 'ToShowSD',
			data: {playTime:item},
		}).then(res => {
			console.log("单时段");
			console.log(res);
		});
		this.props.history.push("/ipc/SDVideoPlayer")
	}

	handleClickToList() {
		if(this.state.eventList.length==0) return ;
		this.setState({ select: false })
	}
	handleClickAllCheckbox() {
		let allSelect = !this.state.allSelect;
		let [...chooseArr] = allSelect ? this.state.eventList : [];
		this.setState({ chooseArr, allSelect });
	} 
	handleDelVideo() {
		var type = (this.state.chooseArr.length === this.state.eventList.length) ? 1:0;
		var eventList = type?this.getWholeTime():this.state.chooseArr.sort();
		var time = this.state.eventList[0].split(":")[0];
		var deleteInfo = {type,eventList};
		var that = this;
		this.props.showDialog("",SDLang.infoMessage[1], [{
			text: dialogLang.button[0],
			handleClick: function () {
				this.hide();
			}
		}, {
			text: SDLang.confirm,
			handleClick: function () {
				Toast.loading(SDLang.waitInfo[2],60,()=>{
					Toast.info("请求超时！")
				})
				jsBridge.send({
					service:'SDCard',
					action: 'deleteEventlist',
					data:deleteInfo,
				}).then(res => {
					if(!res.status){
						Toast.info(SDLang.deleteInfo[0])
						that.props.actions.getSDOneHourList({
							service: 'SDCard',
							action: 'getSDRecordList',
							data:{startTime:time+":00:00",endTime:time+":59:59",time:this.props.hour},
						})
					}else{
						Toast.info(SDLang.deleteInfo[1])
					}
				});
				this.hide();
			}
		}]);
	}
	getWholeTime(){
		var hour = this.state.chooseArr[0].split(":")[0]
		return [hour+":00:00",hour+":59:59"]
	}


	getImage(date){
		var timeStamp = date.replace(/[^0-9]/ig,"");  
		return {
			backgroundImage: 'url(/static/media/'+this.props.p2pId+timeStamp+'_tempPhoto.jpg),url('+require('../public/resource/image/default/sd_card_list_default picture.png')+')',
		}
	}
	render() {
		return (	
			<div className="ipcSD">
				<BarTitle title={this.props.hour} onBack={this.handleClickBack}  >
					{this.state.select ? <a className="txt" onClick={this.handleClickToList}>{SDLang.btnName[1]}</a> :
						<a className="txt" onClick={this.handleClickToSelect}>{SDLang.btnName[0]}</a>}
				</BarTitle>
				{
					this.state.eventList.length ? <ScrollView>
						<div className="videoList">
							{
								this.state.eventList.map((item, index) => <div className="videoListItem" key={index}>
									{this.state.select ? <label onClick={this.handleClickCheckbox.bind(this, item)} className={(this.state.chooseArr.indexOf(item) > -1) ? "ck on" : "ck"}> </label> : ""}
									<div  className={this.state.select ? "videoItemInfo videoItemSelect" : "videoItemInfo"} style={this.getImage(item)} onClick={this.handleClickToPlay.bind(this,item)}>
										<h2>{item.split(" ")[0]}</h2>
										<span>{item.split(" ")[1]}</span>
									</div>
								</div>)
							}
						</div>
					</ScrollView> : <div className="emptyMsg"><span>{SDLang.infoMessage[0]}</span></div>
				}
				{
					this.state.select ? <div className="delBottomBar component">
						<label onClick={this.handleClickAllCheckbox} className={this.state.allSelect ? "ck on" : "ck"}></label>
						<span className="textAll">{SDLang.btnName[2]}</span>
						<span className="icon delete" onClick={this.handleDelVideo}></span>
					</div> : ""
				}

			</div>
		);
	}
}


const mapStateToProps = (state, ownProps) => {
	const devId = (state.device.fromPage === 'list' || state.device.recordAttr.devId === '') ? state.device.deviceItem.devId : state.device.recordAttr.devId;
	return {
		eventList:state.ipc.eventlist,
		isFetching:state.ipc.isFetching,
		status:state.ipc.status,
		errorinfo:state.ipc.errorinfo,
		hour:state.ipc.hour,
		p2pId:state.device.items[devId].p2pId
	}
}

const mapDispatchToProps = dispatch => {
	return {
		actions: bindActionCreators({
			getSDOneHourList,
		}, dispatch),
		showDialog: (...args) => dispatch(showDialog(...args)),
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(SDVideoAll)