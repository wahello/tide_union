import React, { Component } from 'react';
import './default/style.css';
import './default/style_2.css';
import Cookies from 'universal-cookie';
import SystemApi from '../jssdk/system';
import BleApi from '../jssdk/device/device_local';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showDialog, changeFromPage } from '../action';
import BarTitle from '../component/barTitle';
import { Lang } from '../public';
import Repeat from './repeat';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import { createForm } from 'rc-form';
// import DatePicker from 'antd-mobile/lib/date-picker';
import { Toast,DatePicker,LocaleProvider } from 'antd-mobile';
import 'antd-mobile/lib/date-picker/style';
import DeviceItem from '../component/deviceItem';
import { saveDeviceItem,setRecordAttr,initRecordAttr } from '../action/device';
import BarNormal from '../component/barNormal';
import {setCurAutoItem,saveAutoRule,saveAutomation,editAutomation,editAutoRule,refreshAutoList,setAutoDevices} from '../action/automation'
import enUS from 'antd-mobile/lib/locale-provider/en_US'
import helper from '../public/helper';
import AutoDBApi from '../jssdk/automation/automation_local';

const ifttt_rule = 'ifttt_rule';
const ifttt_actuator = 'ifttt_actuator';
const ifttt_sensor = 'ifttt_sensor';

const workdayAry = Lang.automation.repeat.workdayAry;
const weekdayAry = Lang.automation.repeat.weekdayAry;
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
// GMT is not currently observed in the UK. So use UTC now.
const utcNow = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
// Make sure that in `time` mode, the maxDate and minDate are within one day.
let minDate = new Date(nowTimeStamp - 1e7);
const maxDate = new Date(nowTimeStamp + 1e7);
// console.log(minDate, maxDate);
if (minDate.getDate() !== maxDate.getDate()) {
	// set the minDate to the 0 of maxDate
	minDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
}

function formatDate(date) {
	/* eslint no-confusing-arrow: 0 */
	const pad = n => n < 10 ? `0${n}` : n;
	const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
	const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
	return `${dateStr} ${timeStr}`;
}
const CustomChildren = ({
	extra,
	onClick,
	children
}) => (
		<div onClick={onClick} style={{ backgroundColor: '$color-line', height: '56px', lineHeight: '56px', padding: '0', border: "1px solid $color-line", borderRadius: '0.5rem', textIndent: "1.34rem" }}>
			{children}
			<span className='arrowRight'></span>
			<span className='txtSpan'>{extra}</span>
		</div>
	);

const dataObj = {
	"autoName": "",
	"if": {
		"logic":"or",
		"valid": {
			"begin": "00:00",
			"end": "00:00",
			"week": [ 0, 1, 2, 3, 4, 5, 6 ]
		},
		"trigger": [{
			"idx": 0,
			"trigType": "timer",
			"at": null,
			"repeat": []
		}]
	},
	"then": []
}
const cookies = new Cookies();
const dialogLang = Lang.public.dialog;
const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
	  regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im,
	  testChar = /[\u4E00-\u9FA5]/g;
class PageTimeOfDay extends Component {
	constructor(props) {
		super(props);
		let data = Object.assign({ ...dataObj}, this.handleAutoMationRule())
		console.log("timeofday data = ",data);
		this.state = {
			data,
			sceneName: data.autoName || "",
			repeatData: 'Every day',
			at: data.if.trigger[0].at || null,
			seldev:  this.resetSelDevListFunc(data.then || []),
			change: data.change || false
		}
		this.systemApi 			 = new SystemApi;
		this.BleApi 			 = new BleApi;
		this.AutoDBApi           = new AutoDBApi
		this.goNext 			 = this.goNext.bind(this);
		this.testInfo 			 = this.testInfo.bind(this);
		this.setAtTime 			 = this.setAtTime.bind(this);
		this.getDevAttr 		 = this.getDevAttr.bind(this);
		this.addAutoRule 		 = this.addAutoRule.bind(this);
		this.resetSeldev 		 = this.resetSeldev.bind(this);
		this.editAutoRule 		 = this.editAutoRule.bind(this);
		this.setRepeatInfo		 = this.setRepeatInfo.bind(this);
		this.handleClickSave	 = this.handleClickSave.bind(this)
		this.handleClickBack	 = this.handleClickBack.bind(this);
		this.handleChangeTime 	 = this.handleChangeTime.bind(this);
		this.handleChangeName 	 = this.handleChangeName.bind(this);
		this.pushDeviceContro 	 = this.pushDeviceContro.bind(this);
		this.resetSelDevListFunc = this.resetSelDevListFunc.bind(this);
		this.handleAutoMationRule = this.handleAutoMationRule.bind(this);
		this.getCCTContent        =this.getCCTContent.bind(this);
		this.getDevAttrValue     =this.getDevAttrValue.bind(this);
		this.goTimeSet           = this.goTimeSet.bind(this);
	}
	
	goTimeSet(url){
		this.state.data.fromPage = this.props.location.pathname;
		// this.state.data.change = true;
		this.props.actions.setCurAutoItem(this.state.data)
		this.props.history.push(url)
	}

	pushDeviceContro(index) {
		let item =this.state.seldev[index]

		console.log('----------------push  pre------------')
		console.log(this.state.seldev)
		console.log(this.state.data)
		let id = item.devId || item.id
		let deviceItem = this.props.deviceItem[id];
		if (!deviceItem.online) {
			return;
		}
		this.state.data.change = true;
		// item.attr.OnOff = parseInt(item.attr.OnOff);
		this.props.actions.setRecordAttr({
			devId:id,
			attr:item.attr
		})

		this.props.changeFromPage('/automation/timeofday');
		this.props.actions.setCurAutoItem(this.state.data);
		this.props.actions.saveDeviceItem(deviceItem);

		if(item.devType.toLowerCase().indexOf('light') > -1){
		  this.props.history.push("/device/control");	
		}else if(item.devType.toLowerCase().indexOf('plug') > -1){
		  this.props.history.push("/device/wifiPlugDetail");
		}
		
	}

	setRepeatInfo() {
		if (this.state.data.if.trigger[0].repeat.length === 0) return false;
		let repeat = this.state.data.repeat || this.state.data.if.trigger[0].repeat;
		repeat.sort();
		let weekAbbr = ["Su","M", "Tu", "W", "Th", "F", "Sa"]
		var msg = this.getRepeatMsg(repeat);
		if (!msg) {
			msg = [];
			repeat.forEach((item) => {
				msg.push(weekAbbr[item])
			});
			msg = msg.join(",")
		}
		this.setState({ repeatData: msg })
	}
	resetSelDevListFunc(selArr){

		this.props.recordAttr.devId.length 
		selArr.some(item=>{	
			return ((item.devId ||item.id) === this.props.recordAttr.devId) && (item.attr = {...this.props.recordAttr.attr})
		})
		this.props.actions.initRecordAttr()

		// console.log('---------------------------resetSelDevListFunc-------------------*****************')
		// console.log(this.props.recordAttr)
		// console.log(selArr)
		return selArr;
	}
	getRepeatMsg(repeat){
		if(repeat.length=== 7) return "Everyday"
		let workday=0,weekday=0;
		repeat.forEach(item=>{
			if(item>0 && item < 6) {workday++}
			else{weekday++}
		})
		return   (workday === 5 && repeat.length=== 5  && "Workday") || (weekday === 2&& repeat.length=== 2  && "Weekend")
	}
	handleAutoMationRule() {
		let curAutoData = this.props.curAutoData;
		console.log(curAutoData)
		curAutoData.if.trigger = curAutoData.if.trigger.filter((item, index) => {
			// console.log("handleAutoMationRule = ",item);
			if (item.trigType === "timer" || item.trigType === "sunrise" || item.trigType === "sunset") return item;
		})
		curAutoData.if.trigger.length || (curAutoData.if.trigger = JSON.parse(JSON.stringify(dataObj.if.trigger)))
		curAutoData.then.length || (curAutoData.then = JSON.parse(JSON.stringify(dataObj.then)))
		// console.log(JSON.parse(JSON.stringify(this.props.curAutoData)))

		// console.log('--------------------------------------------------------handleAutoMationRule --------------------')
		// console.log(curAutoData)
		return curAutoData
	}
	setAtTime(timeAt) {
		
		// console.log("_____________________curAutoData__________________________")
		// console.log(this.props.curAutoData)
		if (!(timeAt || this.props.curAutoData.if)) return false;
		let at = timeAt || this.props.curAutoData.if.trigger[0].at;
		if(!at) return false;
		let now = new Date();
		let timeStr = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate() + " " + at + ":00"
		return new Date(timeStr)
	}
	goNext(url) {
		this.state.data.fromPage = this.props.location.pathname;
		// this.state.data.change = true;
		this.props.actions.setCurAutoItem(this.state.data)
		this.props.history.push(url)
	}
	getDevAttr(item) {

     	// console.log('-----------------------------getDevAttr ------------------')
		let attr =item.attr;
		if(attr.OnOff ==0||item.devType &&item.devType.toLowerCase().indexOf('smartplug') > -1){
		 return;
		}
		

		if(attr.OnOff ==0){
			return (<p>{ <span> off </span>}</p>);
		 }
		var arr = Object.keys(attr);
		
		const attrArr = ["CCT","Dimming","RGBW"]
		return (<p>
			{arr.filter(item=>{
				if(attrArr.indexOf(item)>-1) return item;
			}).map((item,index) => <span key={index}>{this.getDevAttrValue(item,attr)}</span>)}
			</p>)
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

	handleClickBack(event) {
		var that = this;
		if(!this.state.change) {
			that.props.history.goBack();
			return false;
		}
		this.props.showDialog(dialogLang.title[0], Lang.automation.create.backTip, [{
			text: dialogLang.button[7],
			handleClick: function () {
			    //that.handleClickSave();
				this.hide();
			}
		},{
			text: dialogLang.button[6],
			handleClick: function () {
				// console.log('----------------------------------------------goback save ----------------------')
				that.props.history.goBack();
				this.hide();
			}
		}]);
	}
	handleChangeName() {
		let name = this.refs.name.value
		this.state.change = true;
		this.setState({ sceneName: name })
		this.state.data.autoName = name
		this.state.data.hasChangeName = true;
	}
	handleChangeTime(date) {
		this.setState({ at: date });
		this.state.data.if.trigger[0].at = format(date.getHours())+":"+format(date.getMinutes())
		// this.state.change = true;
		function format(num){
			if (num < 10)  return  "0"+num;
			return num;
		}
	}
	testInfo(){
		if(!this.state.data.autoName) {Toast.info(Lang.automation.timeofday.tip[0]);return false;}
		if(regEn.test(this.state.data.autoName) || regCn.test(this.state.data.autoName)){
			Toast.info(Lang.automation.timeofday.tip[1]);
			return false;
		}
		if (testChar.test(this.state.data.autoName)) {
			let charNum = this.state.data.autoName.match(testChar).length;
			if ((charNum * 2 + (this.state.data.autoName.length - charNum)) > 30) {
				Toast.info(Lang.automation.create.tip[2]);
				return false;
			}
		} 
		if (this.state.data.autoName.length > 30) {
				Toast.info(Lang.automation.create.tip[2]);
				return false;
		}
//		if((this.state.data.if.trigger[0].trigType == "trimer" && this.state.data.if.trigger[0].at)){
//			console.log(this.state.data.if.trigger[0].at)
//			console.log(this.state.data.if.trigger[0].repeat.length)
//			console.log(this.state.seldev.length)
//			
//			
//		}
//		

		// console.log("----data-----",this.state.data)
		// console.log("----at-----",this.state.data.if.trigger[0].at)
		// console.log("----trigType-----",this.state.data.if.trigger[0].trigType)
		if(!this.state.data.if.trigger[0].trigType || (this.state.data.if.trigger[0].trigType == "timer" && !this.state.data.if.trigger[0].at)) {
			Toast.info(Lang.automation.timeofday.tip[3]);
			return false;
		}
		
		if(!this.state.data.if.trigger[0].repeat.length) 
		{Toast.info(Lang.automation.timeofday.tip[4]);
			return false;
		}
		
		if(!this.state.seldev.length) {
		  Toast.info(Lang.automation.timeofday.tip[5]);
		  return false;
		}
		return true;
	}
	handleClickSave(event) {

		// console.log("=======================this.state.data==============================")
		// console.log(this.state.data)
		if(!this.testInfo()) return false;
		this.props.actions.setCurAutoItem(this.state.data)
		Toast.loading(Lang.automation.timeofday.tip[6], 15);
		// Toast.loading('保存 ------');
		if(this.state.data.type === "add"){
			this.props.actions.saveAutomation({
				"cookieUserId": cookies.get("userId"),
				"cookieUserToken":cookies.get("accessToken"),
				"name": this.state.data.autoName,
				"icon": "living.png",
				"homeId": this.props.currentHomeId,
				"enable":  1, 
				"type": this.state.data.if.trigger[0].trigType || "timer"
			}).then((res)=>{
				// console.log("saveAutomation resp = ",res);
				switch(res.code){
					case -1:
					case -2:
					Toast.info(res.desc);
					break;
					case -3:
					Toast.hide();
					Toast.info(Lang.automation.timeofday.tip[7]);
					break;
					case 200:
					if(this.state.data.if.trigger[0].repeat.length&&this.state.seldev.length){
						this.addAutoRule(res.data.autoId);
					}else{
						Toast.hide();
				     //	Toast.info(res.desc || 'Create failed', 3, null, false);
					 this.props.actions.refreshAutoList(true);
					 this.props.history.push("./automation");
					}
					break;
					default:
					break;
				}
			})
		}else{
			if (this.state.data.hasChangeName){
				this.props.actions.editAutomation({
					"cookieUserId": cookies.get("userId"),
					"cookieUserToken":cookies.get("accessToken"),
					"name": this.state.data.autoName,
					"icon": "living.png",
					"autoId":this.state.data.autoId,
					"homeId": this.props.currentHomeId,
					"enable":  1, 
					"type": this.state.data.if.trigger[0].trigType || "timer"
				}).then((res)=>{
					this.state.data.hasChangeName = false;
					// this.editAutoRule();
				})
			}
			this.editAutoRule();
		}
	}
	editAutoRule(){
		this.state.data.if.logic =  "or";
		let then = this.state.seldev.map((item,index)=>{
			let attr =(Object.keys(item.attr).length)?item.attr:{"OnOff":0};

			if(attr.OnOff&&typeof(attr.OnOff) === 'string'){

				attr.OnOff =Number(attr.OnOff)
			}
			if(item.attr.CCT){
				item.attr.CCT =Number(item.attr.CCT);
				item.attr.CCT =parseInt(item.attr.CCT);

			}
			if(item.attr.Dimming){
				item.attr.Dimming =Number(item.attr.Dimming);
				item.attr.Dimming =parseInt(item.attr.Dimming);
			}

			if(attr.OnOff ==0){
				attr ={"OnOff":0}
			}

			return {
				idx:0,
				thenType:"dev",
				parentId:item.parentId,
				id:item.devId || item.id,
				attr:attr
			}
		})
		// delete this.state.data.if.valid;

		this.props.actions.editAutoRule({
			"payload":{
				"autoId":this.state.data.autoId,
				"enable":  1,
				"enableDelay": 0,
				"if":this.state.data.if,
				"then":then
			},
			"Expand":{
				bleData: this.state.seldev
			}
		}).then((res)=>{
			// console.log(res);
			if (res &&res.ack&& (res.ack.code != 200)) {
				Toast.info(res.desc || 'Create failed', 3, null, false);
				this.props.actions.refreshAutoList(true);
				this.props.history.push("./automation");
				return;
		    }
			Toast.hide();
			this.props.actions.refreshAutoList(true);
			this.props.history.push("./automation");
		})
	}
	addAutoRule(autoId){
		this.state.data.if.logic =  "or";
		let then = this.state.seldev.map((item,index)=>{
			let attr =(Object.keys(item.attr).length)?item.attr:{"OnOff":0};
			if(attr.OnOff&&typeof(attr.OnOff) === 'string'){

				attr.OnOff =Number(attr.OnOff)
			}
			if(item.attr.CCT){
				item.attr.CCT =Number(item.attr.CCT)
				item.attr.CCT =parseInt(item.attr.CCT);
			}
			if(item.attr.Dimming){
				item.attr.Dimming =Number(item.attr.Dimming);	
				item.attr.Dimming =parseInt(item.attr.Dimming);
			}

			if(attr.OnOff ==0){
				attr ={"OnOff":0}
			}
			return {
				idx:0,
				thenType:"dev",
				parentId:item.parentId,
				id:item.devId,
				attr:attr
				// enable:item.enable
			}
		})
		console.log(this.state.data)
		// delete this.state.data.if.valid;
		this.props.actions.saveAutoRule({
			"payload":{
				autoId,
				"enable":  1,
     			"enableDelay": 0,
				"if":this.state.data.if,
				"then":then
			},
			"Expand":{
				bleData: this.state.seldev
			}
		}).then((res)=>{
            console.log("======================= addAutoRule ==============================")
			// console.log(res)
			if (res&&res.ack&&(res.ack.code != 200)) {
				Toast.info(res.desc || 'Create failed', 3, null, false);
				this.props.actions.refreshAutoList(true);
				this.props.history.push("./automation");
				return;
		    }
			Toast.hide();
			this.props.actions.refreshAutoList(true);
			this.props.history.push("./automation");
		})
	}
	componentDidMount() {
		this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
		this.setAtTime();
		this.setRepeatInfo();
		this.resetSeldev();
		
		console.log("AAAAAAAAAAAAAAAA deviceItem = ",this.props.deviceItem);
	}

	resetSeldev() {

		let arr = this.state.data.then.map((item, index) => {
			let id = item.id || item.devId
			if(this.props.deviceItem[id] ==undefined){
				return;
			}
			let device = JSON.parse(JSON.stringify(this.props.deviceItem[id]))
			// console.log(device)
			// console.log('---------------------------resetSeldev pre-------------------*****************')
			Object.keys(device).forEach(i=>{
				item[i] || (item[i] = device[i])
			})
			return item
		})
		console.log('---------------------------resetSeldev-------------------*****************')
		console.log(arr)
		this.setState({seldev:arr})
	}
	
	getTime(value){
	  	let theTime = parseInt(value);// 秒
	    let theTime1 = 0;// 分
	    let theTime2 = 0;// 小时
	    if(theTime >= 60) {
	        theTime1 = parseInt(theTime/60);
	        theTime = parseInt(theTime%60);
	        if(theTime1 >= 60) {
		        theTime2 = parseInt(theTime1/60);
		        theTime1 = parseInt(theTime1%60);
	        }
	    }
	    
	    let result = "";
	//  if(parseInt(theTime) < 10){
	//  	result = "0"+parseInt(theTime)+"";
	//		} else {
	//			result = ""+parseInt(theTime)+"";
	//		}
	    // console.log("theTime = ",theTime);
	    if(theTime1 > 0) {
	    	if((parseInt(theTime1) + 1) < 10){
    			result = "0"+(parseInt(theTime1));
	    	} else {
	    		result = ""+(parseInt(theTime1));
	    	}
	    } else {
	    	if(theTime <= 0){
	    		result = "00";
	    	} else {
	    		result = "01";
	    	}
	    }
	    
	    if(theTime2 > 0) {
	    	if(parseInt(theTime2) < 10){
	    		result = "0"+parseInt(theTime2)+":"+result;
	    	} else {
	    		result = ""+parseInt(theTime2)+":"+result;
	    	}
	    } else {
	    	result = "00:"+result;
	    }
	    
	    // console.log("result = ",result);
	    return result;
  	}
	
	getTimeAtSet(){
		if(this.state.data.if.trigger[0]){
			// 普通定时返回at属性
			if(this.state.data.if.trigger[0].trigType == "timer"){
				let timeStr = this.state.data.if.trigger[0].at
				if(timeStr){
					let timerArr = timeStr.split(":");
					if(timerArr.length ==2){
						if(parseInt(timerArr[0])>=12){
							return parseInt(timerArr[0])-12 +":"+timerArr[1] +" PM"
						}else{
							return this.state.data.if.trigger[0].at +" AM"
						}
					}
				}	
				return ""
			} else if(this.state.data.if.trigger[0].trigType == "sunrise" || this.state.data.if.trigger[0].trigType == "sunset"){
				let intervalType = this.state.data.if.trigger[0].intervalType;
				let typeStr = this.state.data.if.trigger[0].trigType;
				
				typeStr = typeStr.substring(0,1).toUpperCase() + typeStr.substring(1)
				if(intervalType == 0){
					return typeStr;
				} else if(intervalType == 1){
					typeStr = typeStr + " Before ";
				} else if(intervalType == 2){
					typeStr = typeStr + " After ";
				}
				return typeStr + this.getTime(this.state.data.if.trigger[0].intervalTime);
			} 
		}
		
		return "";
	}

	render() {
		const {deviceItem} = this.props
		return (
			<div>
				<BarTitle onBack={this.handleClickBack} title={Lang.automation.timeofday.title} onDone={this.handleClickSave} doneTitle={Lang.public.txtSave}/>
		  		
			  <div className="dayandtime"  style={{height:'88vh',overflow:'auto'}}>
		
				<div className="content">
					<h3 style={{marginBottom:"1rem"}}>{Lang.automation.timeofday.name}</h3>
					<BarNormal>
						<input ref="name" type="text" maxLength="30" value={this.state.sceneName} onChange={this.handleChangeName} />
					</BarNormal>
					<br/>
					<h3 style={{margin:"2rem 0 1.5rem 0"}}>{Lang.automation.timeofday.time.title}</h3>
					<div className="item repeat" onClick={this.goTimeSet.bind(this,'/automation/timeSet')}>
						<span className='titleSpan'>{Lang.automation.timeofday.time.at}</span>
						<span className='arrowRight'></span>
						<span className="txtSpan">{this.getTimeAtSet()}</span>
						{/*<DatePicker
							mode="time"
							format="HH:mm"
							title={Lang.automation.during.picker[2]}
							value={this.state.at}
							onChange={this.handleChangeTime}
							extra="new"
							okText={Lang.automation.during.picker[1]}
							dismissText={Lang.automation.during.picker[0]}
						>
							<CustomChildren>{Lang.automation.timeofday.time.at}</CustomChildren>
						</DatePicker>*/}
					</div>
					{/* <Link to="/automation/repeat"> */}
					<div className="item repeat" onClick={this.goNext.bind(this, '/automation/repeat')}>
						<span className='titleSpan'>{Lang.automation.timeofday.time.repeat}</span>
						<span className='arrowRight'></span>
						<span className="txtSpan">{this.state.repeatData}</span>
					</div>
					{/* </Link> */}
					<h3 style={{margin:"2.5rem 0 1.5rem 0"}}>{Lang.automation.timeofday.effects}</h3>
					{
						Object.keys(deviceItem).length ?
						this.state.seldev.map((item, index) =>
							<div key={index} className={("item devItem auto-device-box" + "  " + item.icon + (eval(item.attr.OnOff) ? "-true" : "-false"))} onClick={this.pushDeviceContro.bind(this,index)}>
								<section>
									<h2>{item.name}</h2>
									<h3>{item.roomName}</h3>
								</section>
								<span className='arrowRight'></span>
								<div className="txtDiv">
									{this.getDevAttr(item)}
								</div>
							</div>
						):""
					}
					<div className="item" onClick={this.goNext.bind(this, '/automation/selectdevices')}>
						<span className='titleSpan'>{Lang.automation.timeofday.selectDevices}</span>
						<span className='arrowRight'></span>
						<span className="txtSpan"></span>
					</div>
				</div>
			</div>
		 </div>
		);
	}
}
const mapStateToProps = (state, ownProps) => {
	// console.log("_____________deviceList____________________")
	// console.log(state.device)
	console.log(state.automation.autoItem)
	return {
		autoMationRule: state.automation.autoMationRule,
		curAutoData: state.automation.autoItem,
		deviceList: state.device.list,
		deviceItem: state.automation.devicesOfAuto,
		currentHomeId:state.family.currentId,
		recordAttr:state.device.recordAttr
	}
}

const mapDispatchToProps = dispatch => {
	return {
		actions: bindActionCreators({
			saveDeviceItem,
			setCurAutoItem,
			saveAutoRule,
			saveAutomation,
			editAutomation,
			editAutoRule,
			refreshAutoList,
			setAutoDevices,
			setRecordAttr,
			initRecordAttr
		}, dispatch),
		showDialog: (...args) => dispatch(showDialog(...args)),
		changeFromPage: (...args) => dispatch(changeFromPage(...args)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PageTimeOfDay)
