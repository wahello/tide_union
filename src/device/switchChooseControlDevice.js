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

const deviceList = [
    {deviceName:'Light',belongRoomName:'room',deviceSelect:true},
	{deviceName:'Light2',belongRoomName:'haha',deviceSelect:true},
	{deviceName:'Light3',belongRoomName:'weg',deviceSelect:false},
	{deviceName:'Light4',belongRoomName:'check',deviceSelect:false}
]
	

class SwitchChooseControlDevice extends Component {
	constructor(props){
		super(props);
        this.handleClickBack = this.handleClickBack.bind(this);
		this.handleClickSave = this.handleClickSave.bind(this);
		this.handleClickToChoose = this.handleClickToChoose.bind(this);
		 
       
	}
	
	
  handleClickBack(event){
  	this.props.history.goBack();
  }
  
  handleClickToChoose (deviceData){
	this.setState({
		current: deviceData,
		
		
	  });
	  deviceData.deviceSelect = !deviceData.deviceSelect;
	  console.log(deviceData.deviceSelect);
  }
  handleClickSave(event){
	this.props.history.goBack();
	console.log('保存按钮被点击了');
}
  
 render(){
	return(
		<div className="chooseDevice">
		<BarTitle onBack={this.handleClickBack} onDone={this.handleClickSave} title={Lang.device.switchChooseControlDevice.title} />
		<ScrollView>
		{ deviceList.map(
			(deviceData) =>{
		    return (
        <div className = "chooseDevice-cell">
		<div className = "switchChooseDevice-icon">
		</div>
		<div className = "switchChooseDevice-text">
        <span className = "spanLine"><span className="txt-bold">{deviceData.deviceName}</span></span><br/>
        <span className = "spanLine">{deviceData.belongRoomName}</span>
		</div>
		<div className = {deviceData.deviceSelect?"swithChooseDevice-ChooseState":"swithChooseDevice-unchoose"} onClick={this.handleClickToChoose.bind(this,deviceData)}>
		</div>
		
		</div>
		
           )
		}
		)};
	
		   </ScrollView>
		</div>
	);
}
}



export default connect()(createForm()(SwitchChooseControlDevice))