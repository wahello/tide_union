import React, {
	Component
} from 'react';
import './default/style.css';
import { connect } from 'react-redux';
import { Lang } from '../public';
import BarTitle from '../component/barTitle';
import { Route, Link } from 'react-router-dom';
import { Progress, Toast } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import jsBridge from '../jssdk/JSBridge';
import { showDialog } from '../action';
import Cookies from 'universal-cookie';
import ipcMqtt from '../jssdk/ipcMqtt';
import { bindActionCreators } from 'redux';
import {getSDRecordConfig,setSDFormat} from "../action/ipc";
const cookies = new Cookies()
class Settingmemory extends Component {
	constructor(props) {
		super(props);
		let data = 	this.props.SDRecordConfig || {}
		let percent = 0,totalSize=0,usedSize=0,recordMethod='full';
		if(data){
			percent = parseInt((data.usedSize/data.totalSize)*100)
			totalSize = (data.totalSize/1024).toFixed(2);
			usedSize = (data.usedSize/1024).toFixed(2);
			recordMethod = data.recordMethod;
		}
		this.state = {
			totalSize,
			usedSize,
			recordMethod,
			percent
		}
		this.formatMemory = this.formatMemory.bind(this);
		this.handleClickBack = this.handleClickBack.bind(this);
		this.handleClickFormat = this.handleClickFormat.bind(this);
	}
	componentDidMount() {
		// let dev = this.props.currentDevice;
		// Toast.loading("加载中...",60)
		// this.props.actions.getSDRecordConfig({
		// 	devId:dev.devId,
		// 	userId:cookies.get('userId'),
		// 	password:this.props.password
		// }).then(res=>{
		// 	Toast.hide()
		// 	let data = 	this.props.SDRecordConfig
		// 	let percent = 0
		// 	if(data.totalSize){percent = parseInt((data.usedSize/data.totalSize)*100)}
		// 	this.setState({
		// 		totalSize:data.totalSize/1024,
		// 		usedSize:data.usedSize/1024,
		// 		recordMethod:data.recordMethod || 'full',
		// 		percent
		// 	})
		// })
	}

	componentWillReceiveProps(nextProps){
		let data = 	nextProps.SDRecordConfig
		let percent = 0,totalSize=0,usedSize=0;
		if(data){
			percent = parseInt((data.usedSize/data.totalSize)*100)
			totalSize = (data.totalSize/1024).toFixed(2);
			usedSize = (data.usedSize/1024).toFixed(2);
		}
		this.setState = {
			totalSize,
			usedSize,
			percent
		}
	}


	handleClickBack(event) {
		this.props.history.goBack();
	}

	handleClickFormat(event) {
		var that = this;
		this.props.showDialog(null, Lang.ipc.sdmemory.dialogHint, [{
			text: Lang.public.dialog.button[0],
			handleClick: function() {
				this.hide();
			}
		}, {
			text: Lang.public.dialog.button[5],
			handleClick: function() {
				that.formatMemory() 
				this.hide();
			}
		}]);
		return;
	}

	formatMemory(){
		var dev = this.props.currentDevice;
		Toast.loading(Lang.ipc.sdmemory.formating,60,()=>{
			Toast.info("请求超时！")
		})
		var that = this;
		this.props.actions.setSDFormat({
			devId:dev.devId,
			userId:cookies.get('userId'),
			password:this.props.password,
		}).then(res=>{
			Toast.success(Lang.ipc.sdmemory.formatsuccessful, 2);
			that.setState({
				usedSize:0,
				percent:0
			})
		}).catch(err=>{
			Toast.fail(Lang.ipc.sdmemory.formatfail, 2);
		})
	}

	render() {
		return(
			<div className="ipcmemory">
		    <BarTitle title={Lang.ipc.sdmemory.title} onBack={this.handleClickBack} />
				<div className="content" >
				<div  style ={{padding: '0.8rem'}}>
					<div className="memorytitle">{Lang.ipc.sdmemory.memoryCard} </div>
					<div className="memorysubtext">{this.state.usedSize}GB({Lang.ipc.sdmemory.memoryTotal}{this.state.totalSize}GB)</div> 
					
           <div className="progress"><Progress percent={this.state.percent} position="normal" /></div>
        </div>
						<div className="customlist">
							<div className="item" onClick={() => {this.props.history.push("/ipc/sdrecordmode")}}>
								<span className="title">{Lang.ipc.sdmemory.memory} </span><span  className="arrow-span"></span>
								<span  className="name">{
									this.state.recordMethod.length?(this.state.recordMethod === "full"?Lang.ipc.sdstoremode.modefulltime:Lang.ipc.sdstoremode.modeevent):""
								}</span>
							</div>
							<div className="item"  onClick={this.handleClickFormat}>
								<span className="title">{Lang.ipc.sdmemory.formatCard} </span>
							</div>
						</div>
					</div>
		  </div>
		);
	}
}
//将state绑定到props
const mapStateToProps = (state) => {
	var devId = state.device.deviceItem.devId
	return {
		SDRecordConfig:state.ipc.SDRecordConfig,
		currentDevice : state.device.deviceItem,
		password:state.device.items[devId].password
	}
};
const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			getSDRecordConfig,
			setSDFormat
		}, dispatch),
		showDialog: (...args) => dispatch(showDialog(...args))
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Settingmemory)