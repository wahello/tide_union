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
import Toast from 'antd-mobile/lib/toast';

const volumeSetting = [
   {volumeName:Lang.device.sirenVolume.showSettingInfo[0],volumeSelect:false},
   {volumeName:Lang.device.sirenVolume.showSettingInfo[1],volumeSelect:false},
   {volumeName:Lang.device.sirenVolume.showSettingInfo[2],volumeSelect:false}

]
class SirenVolume extends Component {
	constructor(props){
		super(props);
		this.device = new Device;
		this.deviceInfo = this.props.deviceItems[this.props.devId];
		this.state={
			selecteIndex:-1,
		}

        this.handleClickBack = this.handleClickBack.bind(this);
    
	}
componentWillMount(){
	 
//	if (this.deviceInfo.attr) {
//		if(this.deviceInfo.attr.sirenLevel == "3"){
//			this.state.selecteIndex = 0;
//		}else if(this.deviceInfo.attr.sirenLevel == "2"){
//			this.state.selecteIndex = 1;
//		}else if(this.deviceInfo.attr.sirenLevel == "1"){
//			this.state.selecteIndex = 2;
//		}else{
//			this.state.selecteIndex = -1;
//		}
//	}
	
	
}
 handleClickBack(event){
	  this.props.history.goBack();
	  
  }
handleClickToChoose(item,index){
	var volume = 0;
	if(this.state.selecteIndex == index){
		volume = 0,
		this.setState({
			selecteIndex:-1,  
			 });
		
	}else{
		volume = (3-index),
		this.setState({
			selecteIndex:index,
			 });		
	}
	
 console.log("volume ==== " + volume);
 this.device.setDevAttrReq({
	parentId:this.deviceInfo.parentId,
	payload:{
		devId:this.deviceInfo.devId,
	attr:{
		WarningMode:volume,
	}
}
 }).then(res => {
	Toast.hide();
	if (res.ack.code == 200 ) {
		this.props.shouldUpdateDeviceList()
		this.props.history.goBack();
		console.log("设备更新设备信息成功");
	} else {
		Toast.info(Lang.device.sirenVolume.dialog.tip[0]);
		console.log("设备更新失败，其他原因");
		
	}
}).catch(res => {
	Toast.info(Lang.device.dialog.tip[3]);
});
	
	
	this.props.history.goBack();
  }
    render(){
	return(
        <div className="chooseDevice">
		<BarTitle onBack={this.handleClickBack}  title={Lang.device.sirenVolume.title}/>
		 {
             volumeSetting.map((item,index) =>{
		    return (
		
        <div className = "sirenVolume-cell">
		<div className = "sirenVolume-text">{item.volumeName}</div>
		<div className = {index == this.state.selecteIndex?"sirenVolume-ChooseState":"sirenVolume-unchoose"} onClick={this.handleClickToChoose.bind(this,item,index)}>
		</div>
		</div>
           )
        }
        )
        };
		</div>);
}
}
const mapStateToProps = state => {
	return {
	  rooms: state.room.items,
	  deviceItems: state.device.items,
	  devId: state.device.deviceItem.devId,
	}
  };
  
  const mapDispatchToProps = (dispatch) => {
	return {
	}
  };
export default connect(mapStateToProps, mapDispatchToProps)(SirenVolume)