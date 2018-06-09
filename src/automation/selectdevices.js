import React, {
	Component
} from 'react';
import './default/style.css';
import './default/automationStyle.css';
import SystemApi from '../jssdk/system';
import { connect } from 'react-redux';
import Switch from '../component/switch';
import BarTitle from '../component/barTitle';
import {Lang} from '../public';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import { setTimeout } from 'timers';
import { Toast } from 'antd-mobile';
import { bindActionCreators } from 'redux';
import { saveDeviceItem,setRecordAttr,initRecordAttr} from '../action/device';
import {setCurAutoItem,saveChooseArr,setAutoDevices} from '../action/automation'
import { changeFromPage,showDialog } from '../action';
import Device from '../jssdk/device';
// import AutoLiComponent from '../automation/component/AutoLiComponent';

class AutoLiComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			state: true,
			switch:true,
			select:false
		};
		this.handleSelect = this.handleSelect.bind(this);
		this.handleSwitchClick = this.handleSwitchClick.bind(this);
		this.getDevAttr = this.getDevAttr.bind(this);
		this.getCCTContent        =this.getCCTContent.bind(this);
		this.getDevAttrValue     =this.getDevAttrValue.bind(this);
	}

	handleSelect(event) {
		var select = !this.state.select;
		this.setState({select})
		this.props.makeDeviceSel(this.props.data)
	}
	handleSwitchClick() {
		//	setState是异步的，可以利用setState的第二传参，传入一个回调(callback)函式
		let switchs = !this.props.data.attr.OnOff;
		this.props.data.attr.OnOff = switchs?1:0;
		this.setState({switchs})
		this.props.makeDevSwitch()
	}
	componentDidMount(){

		this.props.deviceSel.some((item,index)=>{
			return item.devId === this.props.data.devId
		}) && this.setState({select:true})
	}
	getDevAttr(item) {
	    let attr =item.attr;
		if(attr.OnOff ==0||item.devType.toLowerCase().indexOf('smartplug') > -1){
			return;
		 }

		if(attr.OnOff ==0){
			return (<p>{ <span> off </span>}</p>);
		 }
		var arr = Object.keys(attr)
		arr.splice(arr.indexOf("OnOff"),1)

		var arr = Object.keys(attr);
		const attrArr = ["CCT","Dimming","RGBW"]
		return (<p>
			{arr.filter(item=>{
				if(attrArr.indexOf(item)>-1) return item;
			}).map((item,index) => <span key={index}>{this.getDevAttrValue(item,attr)}</span>)}
			</p>)
		// return (<p>{arr.map((item, index) => <span>{attr[item]}</span>)}</p>)
	}

	getDevAttrValue(item ,attr){

		if(item ==="RGBW"){
			return "RGB";
		}else if(item ==="CCT"){
		    return	this.getCCTContent(attr[item])
		}else if(item ==="Dimming"){
			return attr[item] +'%'
		}
	}

	getCCTContent(cct){
		if(cct == undefined || cct == null){
			return cct;
		}
		if(cct >= 2000 && cct < 3000){
			return "Soft white";
		} else if(cct >= 3000 && cct < 5000){
			return "Bright white";
		} else if(cct >= 5000 && cct <= 6500){
			return "Daylight";
		} 
	}

	render() {
		// debugger;
		// console.log('---------------------gggggg---------------------');
		// console.log(this.props.data);
		if(!this.props.data) return
		return(
			<li style={{ display:(this.props.data.online ? 'block' : 'none') }}>
				<label  className={this.state.select ? "act":""}   onClick={this.handleSelect}></label>
				<div className={ eval(this.props.data.attr.OnOff) ? ("auto-device-box"+"  " +this.props.data.icon+ "-true") :("auto-device-box"+"  " + this.props.data.icon+ "-false")} onClick={e=>{this.props.onClick(this.props.data,this.props.index)}}  >
					<div className= {this.props.data.online ?'line':'line off-line'}></div>
					<section>
						<h2>{this.props.data.name}</h2>
						<h3>{this.props.data.roomName}</h3>
					</section>
					{/* <i > */}
						<div className="num_text" style={{color:"#333"}}>
							{this.getDevAttr(this.props.data)}
							<span className='right_side'></span>
						</div>
						{/* <Switch checked = {this.props.data.switch} onClick={this.handleSwitchClick}  ></Switch> */}
					{/* </i> */}
				</div>
			</li>
		);
	}
}



const localDeviceArr = {  
	"100001": {
		"devId": "100001",
		"name": "灯1",
		"online": true,
		"homeId": "00001",
		"roomId": "bedroom-id_0001",
		"parentId": "02114102",
		"productId": "00001",
		"deviceType": "Light_RGBW",
		"icon": "lighting",
		"attr": [{
			"OnOff": 0,
			"Dimming": 57
		}],
		"roomName": ""
	},
	"100002": {
		"devId": "100002",
		"name": "灯2",
		"online": true,
		"homeId": "00001",
		"roomId": "livingRoom_id_0001",
		"parentId": "02114102",
		"productId": "00002",
		"deviceType": "Light_RGBW",
		"icon": "lighting",
		"attr": [{
			"OnOff": 1
		}],
		"roomName": ""
	},
	"100003": {
		"devId": "100003",
		"name": "灯3",
		"online": true,
		"homeId": "00001",
		"roomId": "Study_id_0001",
		"parentId": "02114102",
		"productId": "00003",
		"deviceType": "Light_CCT",
		"icon": "door_lock",
		"attr": [{
			"OnOff": 1
		}],
		"roomName": ""
	},
	"100004": {
		"devId": "100004",
		"name": "红外",
		"online": true,
		"homeId": "00001",
		"roomId": "diningRoom_id_0001",
		"parentId": "02114102",
		"productId": "00004",
		"icon": "motion",
		"deviceType": "Sensor_RGBW",
		"attr": [{
			"OnOff": 0
		}],
		"roomName": ""
	},
	"100005": {
		"devId": "100005",
		"name": "门磁",
		"online": true,
		"homeId": "00001",
		"roomId": "",
		"parentId": "02114102",
		"productId": "00001",
		"deviceType": "Sensor_RGBW",
		"icon": "door_lock",
		"attr": [{
			"OnOff": 0
		}],
		"roomName": ""
	}
};
const 	dialogLang = Lang.public.dialog;
class PageSelectDevices extends Component {
	constructor(props) {
		super(props);
		this.state = {
			allDevice: this.resetAllDevListFunc(),
			allBulbs: this.resetAllBulbsListFunc(),
			allPlug: this.resetAllPlugListFunc(),

			chooseDeviceArr:this.setChooseDev(),
			chooseBulbsArr:this.setChooseBulbs(),
			choosePlugArr:this.setChoosePulg(),
			// allSelect: false,
			// allSwitch: false,
			allBulbsSelect: false,
			allBulbsSwitch: false,
			allPlugSelect: false,
			allPlugSwitch: false
		}
		this.systemApi = new SystemApi;
		this.device = new Device;
		this.testChange = this.testChange.bind(this);

		this.setChooseDev = this.setChooseDev.bind(this);
		this.setChooseBulbs = this.setChooseBulbs.bind(this);
		this.setChoosePulg = this.setChoosePulg.bind(this);

		this.handleClickBack = this.handleClickBack.bind(this);
		this.handleClickSave = this.handleClickSave.bind(this);

		// this.handleAllSelect = this.handleAllSelect.bind(this);
		// this.handleAllSwitch = this.handleAllSwitch.bind(this);
		this.handleAllBulbsSelect =this.handleAllBulbsSelect.bind(this);
		this.handleAllBulbsSwitch =this.handleAllBulbsSwitch.bind(this);
		this.handleAllPlugSelect =this.handleAllPlugSelect.bind(this);
		this.handleAllPlugSwitch =this.handleAllPlugSwitch.bind(this);

		this.makeDeviceSel = this.makeDeviceSel.bind(this);
		this.makeDevSwitch = this.makeDevSwitch.bind(this);

		this.resetDevListFunc = this.resetDevListFunc.bind(this);

		this.resetAllDevListFunc = this.resetAllDevListFunc.bind(this);
		this.resetAllBulbsListFunc = this.resetAllBulbsListFunc.bind(this);
		this.resetAllPlugListFunc = this.resetAllPlugListFunc.bind(this);

		this.pushDeviceContro = this.pushDeviceContro.bind(this);
	}
	pushDeviceContro(obj,index) {
		if (!obj.online) {
			return;
		}
		this.props.actions.saveDeviceItem(obj);
		this.props.changeFromPage('/automation/selectdevices');
		// obj.attr.OnOff = parseInt(obj.attr.OnOff)
		this.props.actions.setRecordAttr({
			devId:obj.devId,
			attr:obj.attr
		})
		// this.refs[index].state.select ||this.makeDeviceSel(obj);
		this.props.actions.saveChooseArr(this.state.chooseDeviceArr)
		
		if(obj.devType.toLowerCase().indexOf('light') > -1){
			this.props.history.push("/device/control");	
		}else if(obj.devType.toLowerCase().indexOf('plug') > -1){	
			this.props.history.push("/device/wifiPlugDetail");
		}
		
	}


	setChooseDev(){
		var obj =  this.props.chooseDeviceArr.length?this.props.chooseDeviceArr:this.props.curAutoData.then
		return JSON.parse(JSON.stringify(obj))
	}
	setChooseBulbs(){
		if(this.props.chooseDeviceArr.length>0){
	   
			let obj= [];
			this.props.chooseDeviceArr.map((item,index)=>{
				// console.log(item)
				if(item.devType.toLowerCase().indexOf('light')>-1)
				obj.push(item);
			})
			return JSON.parse(JSON.stringify(obj))	 

		}else{
			let obj= [];
			this.props.curAutoData.then.map((item,index)=>{
				
				if(item.devType.toLowerCase().indexOf('light')>-1)
				obj.push(item);
			})
			return JSON.parse(JSON.stringify(obj))

		}

	}
	setChoosePulg(){
		if(this.props.chooseDeviceArr.length>0){
	   
			let obj= [];
			this.props.chooseDeviceArr.map((item,index)=>{
				if(item.devType.toLowerCase().indexOf('plug')>-1)
				obj.push(item);		
			})
			return JSON.parse(JSON.stringify(obj))		 

		}else{
			let obj= [];
			this.props.curAutoData.then.map((item,index)=>{
				if(item.devType.toLowerCase().indexOf('plug')>-1)
				obj.push(item);	
			})
			return JSON.parse(JSON.stringify(obj))

		}
	}
	// handleAllSelect() {
	// 	var sel = !this.state.allSelect
	// 	this.state.chooseDeviceArr = []
	// 	if(sel){
	// 		this.state.allDevice.every((item, index) => {
	// 			item.thenType = item.devType,
	// 				item.id ? (item.devId = item.id) : (item.id = item.devId)
	// 			return this.state.chooseDeviceArr.push(item)
	// 		});
	// 	}
	// 	Object.keys(this.refs).forEach((item, index) => {
	// 		this.refs[item].setState({
	// 			select: sel
	// 		});
	// 	})
	// 	this.setState({
	// 		allSelect: sel
	// 	});
	// }

	// handleAllSwitch() {
	// 	let switchDev = !this.state.allSwitch;
	// 	this.state.allDevice.forEach((item, index) => {
	// 		item.attr.OnOff = switchDev
	// 	})
	// 	this.setState({
	// 		allSwitch: switchDev
	// 	});
	// }
/**
 * bulbs 全选
 */
    handleAllBulbsSelect() {
		// console.log('--------------------------------------All bulbs select---------------')
		var sel = !this.state.allBulbsSelect
		this.state.chooseDeviceArr= this.state.chooseDeviceArr.filter(item=>{
			if(item.devType.toLowerCase().indexOf('plug')>-1) return item
		})
		this.state.chooseBulbsArr = []
		if(sel){
			this.state.allBulbs.every((item, index) => {
				item.thenType = item.devType,
					item.id ? (item.devId = item.id) : (item.id = item.devId)
				return this.state.chooseBulbsArr.push(item)
			});
		}
		Object.keys(this.refs).forEach((item, index) => {
			if(this.props.deviceArr[item].devType.toLowerCase().indexOf('light')>-1){
				this.refs[item].setState({
					select: sel
				});	
			}
			
		})
		this.state.chooseDeviceArr=this.state.chooseDeviceArr.concat(this.state.chooseBulbsArr)
		this.setState({
			allBulbsSelect: sel
		});
	}
/**
 * bulbs 全开
 */
	handleAllBulbsSwitch() {
		let switchDev = !this.state.allBulbsSwitch;
		this.state.allBulbs.forEach((item, index) => {
			item.attr.OnOff = switchDev
		})
		this.setState({
			allBulbsSwitch: switchDev
		});
	}

/**
 * plug 全选
 */
    handleAllPlugSelect() {
	
		var sel = !this.state.allPlugSelect
		this.state.choosePlugArr = []
		this.state.chooseDeviceArr= this.state.chooseDeviceArr.filter(item=>{
			if(item.devType.toLowerCase().indexOf('light')>-1) return item
		})
		if(sel){
			this.state.allPlug.every((item, index) => {
				item.thenType = item.devType,
					item.id ? (item.devId = item.id) : (item.id = item.devId)
				return this.state.choosePlugArr.push(item)
			});
		}
		Object.keys(this.refs).forEach((item, index) => {
			if(this.props.deviceArr[item].devType.toLowerCase().indexOf('plug')>-1){
				this.refs[item].setState({
					select: sel
				});	
			}
		})
		this.state.chooseDeviceArr=this.state.chooseDeviceArr.concat(this.state.choosePlugArr)
		// console.log('----------------------------------All plug select -----------------------')
		// console.log(this.state.choosePlugArr)
		// console.log(this.state.chooseDeviceArr)
		this.setState({
			allPlugSelect: sel
		});
	}

/**
 * plug 全开
 */
	handleAllPlugSwitch() {
		let switchDev = !this.state.allPlugSwitch;
		this.state.allPlug.forEach((item, index) => {
			item.attr.OnOff = switchDev

			// 给每个设备发送控制指令
			this.controlDeviceOnOff({
				deviceId:item.devId,
				isOn:switchDev
			});
		})
		this.setState({
			allPlugSwitch: switchDev
		});
	}

	/**
	 * 控制设备开关，主要用于All blub的开关处理
	 */
	controlDeviceOnOff(params){
		let that = this;
		let onOff = 0;
		if(params.isOn=="1"){
			onOff = 1;
		}
		let ids =this.props.deviceArr
		this.device.setDevAttrReq({
		  parentId:ids[params.deviceId].parentId || params.deviceId,
			payload:{
				devId:params.deviceId,
				attr:{
					OnOff: onOff
				}
			}
		}).then(res => {
			
	  });
	}

	resetAllDevListFunc(){
		let devObj =  Object.keys(this.props.deviceArr).length > 0 ? this.props.deviceArr:localDeviceArr;
		// console.log('-----------------------------------------------resetAllDevListFunc---------------------------------')
		// console.log(this.props.deviceArr)
		var arr =   this.props.deviceIds.map((item,index)=>{
			if(devObj[item])  {
				if(this.props.recordAttr.devId  === devObj[item].devId)  devObj[item].attr = JSON.parse(JSON.stringify(this.props.recordAttr.attr))
				// if(devObj[item].devType.indexOf("plug")>-1)  return false;
				return devObj[item]
			}
		})
		this.props.actions.setAutoDevices(devObj);
		this.props.actions.initRecordAttr()
		return arr
	}
	resetAllBulbsListFunc(){
		let devObj =  Object.keys(this.props.deviceArr).length > 0 ? this.props.deviceArr:localDeviceArr;
		let arr =[];
		this.props.deviceIds.map((item,index)=>{
			if(devObj[item])  {
				if(this.props.recordAttr.devId  === devObj[item].devId)  devObj[item].attr = JSON.parse(JSON.stringify(this.props.recordAttr.attr))
				if(devObj[item].devType.toLowerCase().indexOf('light')>-1&&devObj[item].online==true)
				arr.push(devObj[item]) 
			}
		})
		// console.log(arr)
		return arr

	}
	resetAllPlugListFunc(){
		let devObj =  Object.keys(this.props.deviceArr).length > 0 ? this.props.deviceArr:localDeviceArr;
		let arr =[];
		this.props.deviceIds.map((item,index)=>{
			if(devObj[item])  {
				if(this.props.recordAttr.devId  === devObj[item].devId)  devObj[item].attr = JSON.parse(JSON.stringify(this.props.recordAttr.attr))
				// if(devObj[item].devType.indexOf("plug")>-1)  return false;

				if(devObj[item].devType.toLowerCase().indexOf('plug')>-1&&devObj[item].online==true)
				arr.push(devObj[item]) 
			}
		})
		// console.log('-------------------------all plug -------------------------------------------------')
		// console.log(arr)
		return arr

	}

	makeDeviceSel(obj) {
		let seldev =[]
		if(obj.devType.toLowerCase().indexOf('light')>-1){
			seldev = this.state.chooseBulbsArr

			this.state.chooseDeviceArr= this.state.chooseDeviceArr.filter(item=>{
				if(item.devType.toLowerCase().indexOf('plug')>-1) return item
			})
			seldev = this.state.chooseBulbsArr 

		}else{
			this.state.chooseDeviceArr= this.state.chooseDeviceArr.filter(item=>{
				if(item.devType.toLowerCase().indexOf('light')>-1) return item
			})
			seldev = this.state.choosePlugArr

		}
		 

		let {attr,devId,devType} = obj;
		seldev.some((item, index) => {
			return(item.devId === obj.devId) &&seldev.splice(index, 1) 
		}) || seldev.push(Object.assign(obj,{thenType:obj.devType}));

        this.state.chooseDeviceArr= this.state.chooseDeviceArr.concat(seldev)

		if(obj.devType.toLowerCase().indexOf('light')>-1){
			this.setState({allBulbsSelect:(seldev.length === this.state.allBulbs.length)})
		}else if(obj.devType.toLowerCase().indexOf('plug')>-1){
			this.setState({allPlugSelect:(seldev.length === this.state.allPlug.length)})
		}
		
	}
	makeDevSwitch() {
		this.state.allDevice.some((item, index) => {
			return  !item.attr.OnOff
		}) ? this.setState({
			allSwitch: false
		}) : this.setState({
			allSwitch: true
		})
		// console.log(this.state.chooseDeviceArr)
	}

	handleClickBack() {
		this.props.actions.saveChooseArr([]);
		this.props.history.goBack();
		// var that = this;
		// if(this.testChange()) {
		// 	that.props.history.goBack();
		// 	return false;
		// }
		// this.props.showDialog(dialogLang.title[0], Lang.automation.create.backTip, [{
		// 	text: dialogLang.button[0],
		// 	handleClick: function () {
		// 	    that.props.history.goBack();
		// 		this.hide();
		// 	}
		// },{
		// 	text: dialogLang.button[1],
		// 	handleClick: function () {
		// 		that.handleClickSave();
		// 		this.hide();
		// 	}
		// }]);
	}

	testChange(){
		if(this.props.curAutoData.then.length !== this.state.chooseDeviceArr.length) {return false;} 
		return this.props.curAutoData.then.every(item=>{
			return this.state.chooseDeviceArr.some(i=>{
				return i.devId === item.devId 
			})
		})
	}
	handleClickSave() {
		if(this.state.chooseDeviceArr.length > 25){
			Toast.info(Lang.automation.repeatSelectDevices.tip)
			return false;
		}
		// console.log("this.state.chooseDeviceArr")
		// console.log(this.state.chooseDeviceArr);
		this.props.curAutoData.change =true;
		this.props.curAutoData.then =JSON.parse(JSON.stringify(this.state.chooseDeviceArr));
		this.props.actions.setCurAutoItem(this.props.curAutoData);
		this.props.actions.saveChooseArr([]);
		this.props.history.goBack();
	}

	resetDevListFunc() {
		if(!this.props.curAutoData) return false;
		let seldev = this.props.curAutoData.then || [],
			switchCount = 0,
			selCount = 0,
			selblubs = 0,
			selplug = 0
		if(this.state.chooseDeviceArr.length===0) this.state.chooseDeviceArr = [...(JSON.parse(JSON.stringify(seldev)))];
		let resetDevList  = []
		let allplug  = []
		let allblubs = []
		// console.log("curAutoData = ",this.props.curAutoData)
		this.state.allDevice.forEach((item, index) => {
			// console.log("item = ",item.devType)
			this.state.chooseDeviceArr.some((i, e) => {
				if(i.id === item.devId &&i.devType.toLowerCase().indexOf('light')>-1&&i.online){
					++selblubs
				}else if(i.id === item.devId&&i.devType.toLowerCase().indexOf('plug')>-1&&i.online){
                    ++selplug
				}

				return(i.id === item.devId) && ++selCount && Object.assign(item, i) && (this.state.chooseDeviceArr[e] = item)
			})
			item.attr.OnOff && switchCount++;
			
			console.log("this.props.curAutoData.if.trigger[0] = ",this.props.curAutoData.if.trigger[0])
			if(this.props.curAutoData.if.trigger[0] && (this.props.curAutoData.if.trigger[0].trigType == "sunrise" || this.props.curAutoData.if.trigger[0].trigType == "sunset")){
				if(item.devType.indexOf("plug") >= 0){
					resetDevList.push(item);
				}
			} else {
				if(item.devType.toLowerCase().indexOf('light')>-1&&item.online){
                  allblubs.push(item)
				}else if(item.devType.toLowerCase().indexOf('plug')>-1&&item.online){
					allplug.push(item)
				}
				resetDevList.push(item);
			}
			
		})
		
		let allSelect = selCount === Object.keys(resetDevList).length
		let allSwitch = switchCount ===  Object.keys(resetDevList).length

		let allBulbsSelect = selblubs ===  Object.keys(allblubs).length
		let allPlugSelect = selplug ===  Object.keys(allplug).length

		
		this.setState({
			allDevice: resetDevList,
			allSelect,
			allSwitch,

			allBulbsSelect,
			allPlugSelect
			
		})
		
		
		// for(let i = 0; i < this.props.deviceIds.length; i++){
		// 	let deviceType = this.props.deviceArr[this.props.deviceIds[i]].devType;	
		// 	if(deviceType.indexOf('Light') > -1){
		// 		this.setState(prevState => ({
		// 			allDevice: [...prevState.allDevice, this.props.deviceIds[i]]
		// 			})
		// 		);
		// 	}
		// }
	}
	componentWillMount() {
		this.resetDevListFunc()
	}
	componentDidMount() {
		this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
	}

	render() {
		// console.log("______________________this.state.allDevice______________________")
		// console.log(this.state.allDevice)
		return(
			<div  style={{height:'100vh'}}>
	  	    <BarTitle onBack={this.handleClickSave} title={Lang.automation.repeatSelectDevices.title} />
			{	
				this.state.allDevice.length === 0?
				<div className="NoDevieInfo">
					<div className="NoDevieInfo_tips">
						<p>{Lang.automation.triggerdevice.tip[0]}</p>
						<p>{Lang.automation.triggerdevice.tip[1]}</p>
					</div>
				</div>
				:
				<div className="bodyer" style={{height:"100vh"}}>
					<ul className="select-device-list">
					{this.state.allBulbs.length>0 ?
						<li >
							<label className={ this.state.allBulbsSelect ?"act":"" } onClick={this.handleAllBulbsSelect}></label>
							<div className={ this.state.allBulbsSwitch ? ("auto-device-box lighting-true") :("auto-device-box lighting-false")} >
								<div className="line"></div>
								<section>
									<h2>{Lang.automation.repeatSelectDevices.all}</h2>
								</section>
								<i>
									<a className={this.state.allBulbsSwitch ?"switch switch-on":"switch switch-off" } onClick={this.handleAllBulbsSwitch}></a>
								</i>
							</div>
						</li>
						:''}
						{	
							this.state.allBulbs.map((item, index) => 
								<AutoLiComponent ref={item.devId} makeDeviceSel={this.makeDeviceSel}  makeDevSwitch={this.makeDevSwitch}  data={item} deviceSel={this.state.chooseBulbsArr} index={item.devId} key={item.devId} onClick={this.pushDeviceContro}/>
							)
						}
						{this.state.allPlug.length>0 ?
						<li >
							<label className={ this.state.allPlugSelect ?"act":"" } onClick={this.handleAllPlugSelect}></label>
							<div className={ this.state.allPlugSwitch ? ("auto-device-box plug4-true") :("auto-device-box plug4-false")} >
								<div className="line"></div>
								<section>
									<h2>{'All plug'}</h2>
								</section>
								<i>
									<a className={this.state.allPlugSwitch ?"switch switch-on":"switch switch-off" } onClick={this.handleAllPlugSwitch}></a>
								</i>
							</div>
						</li>
						:''}
						
						{	
							this.state.allPlug.map((item, index) => 
								<AutoLiComponent ref={item.devId} makeDeviceSel={this.makeDeviceSel}  makeDevSwitch={this.makeDevSwitch}  data={item} deviceSel={this.state.choosePlugArr} index={item.devId} key={item.devId} onClick={this.pushDeviceContro}/>
							)
						}	
					</ul>
				</div>
			}
		</div>
		);
	}
}
const mapStateToProps = (state, ownProps) => {
	// console.log('----------------------------------qqqqqqq--------------------')
	// console.log(state.device.writeableIds)
	return {
		curAutoData: state.automation.autoItem,
		deviceIds: state.device.writeableIds,
		deviceArr: state.automation.devicesOfAuto,
		chooseDeviceArr:state.automation.chooseDeviceArr,
		recordAttr:state.device.recordAttr 
	}
}

const mapDispatchToProps = dispatch => ({
	changeFromPage: (...args) => dispatch(changeFromPage(...args)),
	showDialog: (...args) => dispatch(showDialog(...args)),
	actions: bindActionCreators({
		saveDeviceItem,
		setCurAutoItem,
		changeFromPage,
		saveChooseArr,
		setRecordAttr,
		setAutoDevices,
		initRecordAttr
	}, dispatch)
})

export default connect(mapStateToProps,mapDispatchToProps)(PageSelectDevices)