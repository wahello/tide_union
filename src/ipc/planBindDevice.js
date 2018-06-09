import React, { Component } from 'react';
import Device from '../jssdk/device';
import BarTitle from '../component/barTitle';
import { showDialog } from '../action';
import helper from '../public/helper';
import { Lang } from '../public';
import { connect } from 'react-redux';
import './default/style.css';
import SystemApi from '../jssdk/system';
import { createForm } from 'rc-form';
import ScrollView from '../component/scrollView';
import IpcPlanAPi from '../jssdk/ipcplan';
const deviceList = [
    {deviceName:'Light',belongRoomName:'room',deviceId:"123"},
	{deviceName:'Light2',belongRoomName:'haha',deviceId:"12"},
	{deviceName:'Light3',belongRoomName:'weg',deviceId:"11"},
	{deviceName:'Light4',belongRoomName:'check',deviceId:"22"}
]
	

class PlanBindDevice extends Component {
	constructor(props){
		super(props);
		this.state = {
			selectIndex:-1,
			deviceList:[],
			  }
        this.handleClickBack = this.handleClickBack.bind(this);
		this.handleClickSave = this.handleClickSave.bind(this);
		this.handleClickToChoose = this.handleClickToChoose.bind(this);
		this.showChooseDevice = this.showChooseDevice.bind(this);
		 
       
	}
componentDidMount(){
	var plan = this.props.location.query;
	console.log('plan',plan);
	
	var paremeter = {
		deviceType:"03",
		search_currPage:1,
		search_pageSize:20
	};
	IpcPlanAPi.getUnBindPlanDeviceList(paremeter).then((result) => {
		console.log("=========未绑定的设备列表",result);
		if (result.code==200) {
			this.setState({
				deviceList: result.data,
			})
			this.showChooseDevice(plan.deviceId);
		}

	}).catch((err) => {
		
	});
}
	
  handleClickBack(event){
  	this.props.history.goBack();
  }
  
  handleClickToChoose (item){
	this.setState({
		selectIndex:item,
	  });
	 
  }
  handleClickSave(event){
	console.log('savedevuice');
	
	var plan = this.props.location.query;
	const device = this.state.selectIndex>=0?this.state.deviceList[this.state.selectIndex]:"";
	if (device == "") {
	  return;
	}
	var parameter = {
		planId:plan.planId,
		deviceId:device.deviceId,
	}
	IpcPlanAPi.planBandingDevice('planId=' + parameter.planId, 'deviceId=' + parameter.deviceId).then((result) => {
		if (result.code == 200) {
			this.props.history.goBack();
		}
	}).catch((err) => {
		
	});
	
}
  showChooseDevice(deviceId){
    for (let index = 0; index < this.state.deviceList.length; index++) {
		const deviceInfo = this.state.deviceList[index];
		if (deviceInfo.deviceId == deviceId) {
			this.setState({
             selectIndex :index,
			});
		}
		
	}
  }
  
 render(){
	return(
		<div className="planBindDevice">
			<BarTitle onBack={this.handleClickBack} title={Lang.ipc.changePicture.title} onDone={this.handleClickSave}/>
		<ScrollView>
		{ this.state.deviceList.map(
			(deviceData,item) =>{
		    return (
        <div className = "chooseDevice-cell">
					<div className={deviceData.icon ?'switchChooseDevice-icon '+deviceData.icon:'switchChooseDevice-icon camera'}>
		</div>
		<div className = "switchChooseDevice-text">
        	<span className = "spanLine"><span className="txt-bold">{deviceData.name}</span></span><br/>
			<span className="spanLine">{deviceData.roomName}</span>
		</div>
		<div className = {this.state.selectIndex == item?"swithChooseDevice-ChooseState":"swithChooseDevice-unchoose"} onClick={this.handleClickToChoose.bind(this,item)}>
		</div>
		
		</div>
		
           )
		}
		)}
	
		   </ScrollView>
		</div>
	);
}
}



export default connect()(createForm()(PlanBindDevice))