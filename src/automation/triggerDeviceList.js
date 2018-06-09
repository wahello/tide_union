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
import { bindActionCreators } from 'redux';
import {setCurAutoItem,setTriChooseTmp,setCurSensorItem} from '../action/automation'
import { link } from 'fs';
import device from './../reducer/device';


// const trigger = [
// 	{ deviceName: 'Motion Sensor', belongRoomName: 'Bedroom', deviceType: 'motion-icon' },
// 	{ deviceName: 'Motion Sensor2', belongRoomName: 'Bedroom', deviceType: 'motion-icon' },
// 	{ deviceName: 'Door/Window sensor', belongRoomName: 'other', deviceType: 'door-icon' },
// 	{ deviceName: 'Door/Window sensor2', belongRoomName: 'other', deviceType: 'door-icon' },
// 	{ deviceName: 'Motion Sensor3', belongRoomName: 'other', deviceType: 'motion-icon' }
// ]
const dialogLang = Lang.public.dialog;
class TriggerDeviceList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			num:null,
			trigger:this.setTrigger(),
			chooseDeviceArr:this.props.triChooseTmp ||null,
		}
		this.systemApi = new SystemApi();
		this.setTrigger = this.setTrigger.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
		this.handleClickSave =  this.handleClickSave.bind(this);
		this.handleClickBack = this.handleClickBack.bind(this);
		this.handleClickToDetail = this.handleClickToDetail.bind(this);
		this.checkDup = this.checkDup.bind(this);
	}
	componentDidMount() { 
		// console.log("333333333333333");
		// console.log(this.props.triChooseTmp);
		// console.log(this.state.chooseDeviceArr);
		// console.log(this.state.trigger);
		if(!this.props.triChooseTmp){return false}
		this.state.trigger.some((item,index)=>{
			 if(item.devId !==this.props.triChooseTmp.devId) return false;
			 this.setState({num:index}); 
			 return true
		})
		this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
	}
	setTrigger(){
		return this.props.devIds.map((item,index)=>{
			return resetDev(this.props.devData[item])
		}).filter(item=>{
				if(item.devType == "Sensor_PIR"||item.devType == "Sensor_Motion"||item.devType == "Sensor_Doorlock"){
				return item;
			}
			// return (item.devType !== "Multi_Gateway")  //||item.devType !== "Alarm_Siren"
		})
		function resetDev(device){
			if(typeof(device.attr) !== "string"){
				if(device.devType === "Sensor_Doorlock"){
					device.value = device.attr.Door ||1;
					device.attr = "Door"
				}
				else{
					device.value = device.attr.Occupancy || 1;
					device.attr = "Occupancy"
				}
			}
			return device
		}
	}

	handleClickSave(){
		// const {...device} = this.state.chooseDeviceArr;
		if(this.state.chooseDeviceArr){
			this.props.curAutoData.change =true;
			const _itemList = this.props.curAutoData;
			_itemList.if.trigger = this.state.chooseDeviceArr;
			this.props.actions.setCurAutoItem(_itemList);
		}
		this.props.actions.setTriChooseTmp([])
		this.props.history.goBack();
	}

	handleClickBack(event) {
		this.props.actions.setTriChooseTmp([])
		this.props.history.goBack();
	}

	handleSelect(num,device){
		// if(this.state.num === num){
		// 	num = -1;
		// 	device = {
		// 		"idx": "",
		// 		"trigType": "dev",
		// 		"devId": "",
		// 		"attr": "",
		// 		"compOp":"",
		// 		"value": "",
		// 	}
		// }
		// this.setState({num})
		// this.setState({device})

		// console.log('111111111111')
		// console.log(num)
		// console.log(device);
		// this.props.actions.setTriChooseTmp(device)


		// makeDeviceSel(obj) {
			let seldev = this.state.chooseDeviceArr
			let {attr,devId,devType} = device;
			seldev.some((item, index) => {
				return(item.devId === device.devId) &&seldev.splice(index, 1) 
			}) || seldev.push(Object.assign(device));
			this.setState({seldev})
			this.props.actions.setTriChooseTmp(seldev)

			// console.log('选择-------------')
			// console.log(seldev)
			// this.setState({allSelect:(seldev.length === this.state.allDevice.length)})
		


	}

	handleClickToDetail(device,index) {
		if (device.devType == "Sensor_PIR"||device.devType == "Sensor_Motion") {
			var  url = '/automation/triggerMotionDetail';
		} else if (device.devType == "Sensor_Doorlock") {
			var  url = '/automation/triggerDoorDetail';
		}
	
		this.props.actions.setCurSensorItem(device)
		
		// (this.state.num !== index) && this.handleSelect(index,device)
		this.props.history.push(url)
	}
   checkDup(array,obj){
        var value= obj.devId;
        for (var i=0;i<array.length;i++){
            if(obj ){
                if(array[i]){
                    var value1 = array[i].devId;
                    if(value === value1){
                        return true;
                    }
                }
            }
        }
    return false;
}


	render() {
		// console.log("this.state.trigger.length")
		// console.log(this.state.trigger.length)
		// console.log(this.state.trigger)
		return (
			<div className="user">
				<BarTitle onBack={this.handleClickSave} title={Lang.automation.triggerdevice.title}/>
				<div style={{height:"100vh",background:"#3A4056"}}>
				<ScrollView>
					{	
						!this.state.trigger.length?
						<div className="NoDevieInfo">
							<div className="NoDevieInfo_tips">
								<p>{Lang.automation.triggerdevice.tip[0]}</p>
								<p>{Lang.automation.triggerdevice.tip[1]}</p>
							</div>
						</div>
						:
						this.state.trigger.map((device,index) => {
						return (
							<div key={index} className="triggerList">
								<label className={this.checkDup(this.state.chooseDeviceArr,device)==true ? "act" : ""} onClick={this.handleSelect.bind(this,index,device)}></label>
								<div className="triggerdevice-cell" onClick={this.handleClickToDetail.bind(this, device, index)}>
									<div className={"triggerdevice-icon " + device.icon + "-icon"}>
									</div>
									<div className="triggerdevice-text">
										<span className="spanLine"><span className="txt-bold omisAbbr">{device.name}</span></span><br />
										<span className="spanLine omisAbbr">{device.roomName}</span>
									</div>
									<div className="arrowRight" />
								</div>
							</div>
						)
					}
					)}
				</ScrollView>
				</div>
			</div>
		);
	}
}
const mapStateToProps = (state, ownProps) => {
	console.log('000000000000')
	console.log(state.automation.autoMationRule);
	console.log(state.automation.autoItem);
	console.log(state.automation.devicesOfAuto);
	

	return {
		autoMationRule: state.automation.autoMationRule,
		devIds: state.device.unwriteableIds,
		devData: state.automation.devicesOfAuto,
		curAutoData: state.automation.autoItem,
		triChooseTmp:state.automation.triChooseTmp,
		cutSensor:state.automation.curSensor
	}
}

const mapDispatchToProps = dispatch => {
	return {
		showDialog: (...args) => dispatch(showDialog(...args)),
		actions: bindActionCreators({
			setCurAutoItem,
			setTriChooseTmp,
			setCurSensorItem
		}, dispatch)
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(TriggerDeviceList)