import React, {
	Component
} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Lang } from '../public';
import BarTitle from '../component/barTitle';
import { Route, Link } from 'react-router-dom';
import { WhiteSpace, Button } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import './default/style.css';
import './ipcCountDown.js';
import jsBridge from '../jssdk/JSBridge';
import MQTTService, { TOPIC } from '../jssdk/MQTTService';
import {getVerList,excOta} from "../action/ipc"
class Ipcupdate extends Component {
	
	constructor(props) {
		super(props);
		this.state =　{
			flag:false,
			devObj:{}
		}
		this.handleClickBack = this.handleClickBack.bind(this);
		this.loadVersionList = this.loadVersionList.bind(this)
		this.update = this.update.bind(this);
	}
	componentDidMount() {
		var that = this;
		let dev = this.props.currentDevice
		this.props.actions.getVerList({
			devId:[dev.devId],
			productId:dev.productId,
			devType:dev.devType,
			homeId:dev.homeId,
			timestamp: "2014-04-05T12:30:00-02:00"
		}).then(res=>{
      console.log('-----------------------res--------------------------')
      console.log(res)
			that.loadVersionList();
		})
		MQTTService.subscribe({
			topic: `${TOPIC.broadcastV1}/${dev.devId}/ota/updateOtaStautsNotif`,
		});
	} 

	loadVersionList(){
		console.log()
		let devObj = this.props.versionList[0];
		let flag =  (devObj.newVersion !== "")
		console.log(flag)
		this.setState({flag,devObj:{...devObj}})
	}

	handleClickBack(event) {
		this.props.history.goBack();
	}
	// 点击更新按钮
	update(next){
		let dev = this.props.currentDevice
		this.props.actions.excOta({
			devId:[dev.devId]
		})
		this.props.history.push('/ipc/ipcCountDown');
	}
	render() {
		return(
			<div className="ipcupdate">
		    <BarTitle  title={Lang.ipc.ipcupdate.title} onBack={this.handleClickBack} />
			<div className="content" >
			   	<div className="appIcon"></div>
			   	<div className="titleVersion">{this.state.flag ? (Lang.ipc.ipcupdate.versionTitle +this.state.devObj.oldVersion): Lang.ipc.ipcupdate.versionTip} </div>
			  	<WhiteSpace size="sm" />	
			   	<div className="versionNumber">{this.state.flag ? (Lang.ipc.ipcupdate.version[0]+":"+this.state.devObj.newVersion) : (Lang.ipc.ipcupdate.version[1] +":"+this.state.devObj.oldVersion)}</div>
			   	<WhiteSpace size="lg" />	
			   	<WhiteSpace size="lg" />	
			   	<div  style ={{display: (this.state.flag  ? "" :  "none")}} >
            <div className="versionHint">{Lang.ipc.ipcupdate.tips[0]}</div>
            <div className="versionHint">{Lang.ipc.ipcupdate.tips[1]}</div>
            <WhiteSpace size="lg" />
            <WhiteSpace size="lg" />
            {this.state.flag? <Button onClick={() => this.update()}>{Lang.ipc.ipcupdate.upgrade}</Button> : "" }
			   </div>
			</div>
		</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		currentDevice : state.device.deviceItem,
		versionList:state.ipc.versionList
	}
}

const mapDispatchToProps = dispatch => {
	return {
		actions: bindActionCreators({
			getVerList,
			excOta
		}, dispatch),
	}
}

export default  connect(mapStateToProps, mapDispatchToProps)(Ipcupdate)