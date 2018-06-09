import React, { Component } from 'react';
import './default/style.css';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import { Lang } from '../public';
import BarTitle from '../component/barTitle';
import BarNormal from '../component/barNormal';
import { Route, Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { saveDeviceItem, setRecordAttr, initRecordAttr } from '../action/device';
import { Toast } from 'antd-mobile';
import { showDialog, changeFromPage } from '../action';
import SystemApi from '../jssdk/system';
import {
	setCurAutoItem,
	saveAutomation,
	saveAutoRule,
	editAutomation,
	editAutoRule,
	refreshAutoList,
	setAutoDevices,
	setTriChooseTmp
} from '../action/automation'

const cookies = new Cookies();
const dataObj = {
	"autoId": "",
	"autoName": "",
	"if": {
		"logic": "or",
		"valid": {
			"begin": "00:00",
			"end": "23:59",
			"week": [0, 1, 2, 3, 4, 5, 6]
		},
		"trigger": []
	},
	"then": []
}
const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
	regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im,
	testChar = /[\u4E00-\u9FA5]/g;
const dialogLang = Lang.public.dialog;
class AutomationCreate extends Component {	
	constructor(props) {
		super(props);
		let data = Object.assign({ ...dataObj }, this.handleAutoMationRule());
		this.state = {
			effect: 'home-start',
			second: 3,
			data,
			autoName: data.autoName,
			seldev: this.resetSelDevListFunc(data.then || []),
			trigger: data.if.trigger || [],
			change: data.change || false
		};
		this.goNext = this.goNext.bind(this);
		this.testInfo = this.testInfo.bind(this);
		this.getDevAttr = this.getDevAttr.bind(this);
		this.addAutoRule = this.addAutoRule.bind(this);
		this.resetTrigger = this.resetTrigger.bind(this);
		this.setDuringTime = this.setDuringTime.bind(this);
		this.setRepeatInfo = this.setRepeatInfo.bind(this);
		this.setTriggerList = this.setTriggerList.bind(this);
		this.checkEveryTime = this.checkEveryTime.bind(this);
		this.handleClickBack = this.handleClickBack.bind(this);
		this.handleClickSave = this.handleClickSave.bind(this);
		this.handleChangeName = this.handleChangeName.bind(this);
		this.pushDeviceContro = this.pushDeviceContro.bind(this);
		this.resetSelDevListFunc = this.resetSelDevListFunc.bind(this);
		this.handleAutoMationRule = this.handleAutoMationRule.bind(this);
		this.getCCTContent        =this.getCCTContent.bind(this);
		this.getDevAttrValue     =this.getDevAttrValue.bind(this);
		this.systemApi = new SystemApi;
	}

	handleClickBack(event) {
		var that = this;
		if (!this.state.change) {
			that.props.history.goBack();
			return false;
		}
		this.props.showDialog(dialogLang.title[0], Lang.automation.create.backTip, [{
			text: dialogLang.button[7],
			handleClick: function () {
				that.handleClickSave();
				this.hide();
			}
		}, {
			text: dialogLang.button[6],
			handleClick: function () {
				that.props.history.goBack();
				this.hide();
			}
		}]);
	}
	componentDidMount() {
		this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
	}
	resetSelDevListFunc(selArr) {
		this.props.recordAttr.devId.length
		selArr.some(item => {
			return ((item.devId || item.id) === this.props.recordAttr.devId) && (item.attr = JSON.parse(JSON.stringify(this.props.recordAttr.attr)))
		})
		this.props.actions.initRecordAttr()
		return selArr;
	}
	pushDeviceContro(item) {

		let deviceItem = this.props.deviceItem[(item.id || item.devId)] || {};
		if (!deviceItem.online) {
			return;
		}
		this.state.data.change = true;
		item.attr.OnOff = parseInt(item.attr.OnOff);
		this.props.actions.setRecordAttr({
			devId: item.id || item.devId,
			attr: item.attr
		})
		this.props.changeFromPage('/automation/create');
		this.props.actions.setCurAutoItem(this.state.data);
		this.props.actions.saveDeviceItem(deviceItem);
		this.props.history.push('/device/control'); 
	}
	getDevAttr(attr) {

		if(attr.OnOff ==0){
			return (<p>{ <span> off </span>}</p>);
		 }
		var arr = Object.keys(attr);
		const attrArr = ["CCT", "Dimming", "RGBW"]
		return (<p>
			{arr.filter(item => {
				if (attrArr.indexOf(item) > -1) return item;
			}).map((item,index) => <span key={index}>{this.getDevAttrValue(item ,attr)}</span>)}
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

	setRepeatInfo(repeat) {
		if (repeat === undefined) {
			return
		}
		repeat.sort();
		let weekAbbr = ["Su", "M", "Tu", "W", "Th", "F", "Sa"]
		var msg = this.getRepeatMsg(repeat);
		if (!msg) {
			msg = [];
			repeat.forEach((item) => {
				msg.push(weekAbbr[item])
			});
			msg = msg.join(",")
		}
		return msg
	}

	getRepeatMsg(repeat) {
		if (repeat.length === 7) return "everyday"
		let workday = 0, weekday = 0;
		repeat.forEach(item => {
			if (item > 0 && item < 6) { workday++ }
			else { weekday++ }
		})
		return (workday === 5 && repeat.length === 5 && "workday") || (weekday === 2 && repeat.length === 2 && "weekend")
	}
	
	setDuringTime(){
		let item = this.state.data.begin? this.state.data: this.state.data.if.valid
	 	return <div  className={"item devItem auto-device-box alltimeIcon"}  style={{margin:"0"}} >
		 		{
					 	this.state.data.everyTime ?<section><h1>Anytime</h1> </section>:<section>
						 <h2>{item.begin +" to " + item.end}</h2>
						 <h3>{this.setRepeatInfo(item.week)}</h3>
					 </section>
				 }
			{/*<span className='arrowRight'></span>*/}
		</div>
	}
	setTriggerList(item,index) {
		// if (Object.keys(this.props.deviceItem).length) {
		// 	let triArr = this.state.data.if.trigger;
		// 	return triArr.map((item, index) => {
		// 		if(item.devId.length===0){
		// 			return
		// 		}
				return <div key={index} className={"item devItem auto-device-box " + this.props.deviceItem[item.devId].icon} style={{ margin: "0" }}>
					<section>
						<h2 style={{ lineHeight: "2rem", width: "10rem" }}>{this.props.deviceItem[item.devId].name}</h2>
						<h3 style={{ lineHeight: "3.2rem", width: "10rem" }}>{this.props.deviceItem[item.devId].roomName}</h3>
					</section>
					{<span className='arrowRight'></span>}
					<div className="txtDiv first">
						{item.attr === "Door" ? <p>{eval(item.value) ? Lang.automation.triggerdoordetail.doorOpen : Lang.automation.triggerdoordetail.doorClose}</p> : <p>{eval(item.value) ? Lang.automation.triggermotiondetail.motiontriggered : Lang.automation.triggermotiondetail.motionuninterrupted}</p>}
					</div>
				</div>
			// })
		// }
	}
	handleAutoMationRule() {
		let curAutoData = this.props.curAutoData;
		curAutoData.if.trigger.length || (curAutoData.if.trigger = JSON.parse(JSON.stringify(dataObj.if.trigger)));
		curAutoData.if.valid.begin || (curAutoData.if.valid = JSON.parse(JSON.stringify(dataObj.if.valid)));
		curAutoData.then.length || (curAutoData.then = JSON.parse(JSON.stringify(dataObj.then)))
		// &&(	curAutoData.seldev = JSON.parse(JSON.stringify(curAutoData.then)))  
		this.checkEveryTime(curAutoData);
		return curAutoData
	}

	checkEveryTime(curAutoData){
		curAutoData.everyTime  = (curAutoData.if.valid.week.length === 7 &&　curAutoData.if.valid.begin === "00:00" &&　curAutoData.if.valid.end === "23:59")
	}

	goNext(url) {
		this.state.data.fromPage = this.props.location.pathname;
		// this.state.change = true;
		// this.state.data.change = true;
		this.props.actions.setTriChooseTmp(this.state.data.if.trigger);
		this.props.actions.setCurAutoItem(this.state.data);
		console.log(url)
		this.props.history.push(url)
	}

	testInfo() {
		if (!this.state.data.autoName) { Toast.info(Lang.automation.create.tip[0]); return false; }
		if (regEn.test(this.state.data.autoName) || regCn.test(this.state.data.autoName)) {
			Toast.info(Lang.automation.create.tip[1]);
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
		
		if ((this.state.data.if.trigger.length && this.state.data.if.trigger[0].devId) || this.state.data.if.valid.begin || this.state.seldev.length) {
			if (this.state.data.if.trigger.length &&!this.state.data.if.trigger[0].devId) { Toast.info(Lang.automation.create.tip[3]); return false; }
			if (!this.state.data.if.valid.begin) { Toast.info(Lang.automation.create.tip[4]); return false; }
			if (!this.state.seldev.length) { Toast.info(Lang.automation.create.tip[5]); return false; }
		}
		return true;
	}

	handleClickSave() {
		if (!this.testInfo()) return false;
		this.props.actions.setCurAutoItem(this.props.curAutoData)
		Toast.loading(Lang.automation.create.tip[6], 15);
		if (this.state.data.type === "add") {
			this.props.actions.saveAutomation({
				"cookieUserId": cookies.get("userId"),
				"cookieUserToken": cookies.get("accessToken"),
				"name": this.state.data.autoName,
				"icon": "living.png",
				"homeId": this.props.currentHomeId,
				"enable": 1,
				"type": "dev"
			}).then((res) => {
				switch (res.code) {
					case -1:
					case -2:
						Toast.info(res.desc);
						break;
					case -3:
						Toast.info(Lang.automation.create.tip[7]);
						break;
					case 200:
						if (this.state.data.if.trigger[0].devId && this.state.data.if.valid.begin && this.state.seldev.length) {
							this.addAutoRule(res.data.autoId);
						} else {
							Toast.hide();
							this.props.actions.refreshAutoList(true);
							this.props.history.push("./automation");
						}
						break;
					default:
						break
				}
			})
		} else {
			if (this.state.data.hasChangeName) {
				this.props.actions.editAutomation({
					"cookieUserId": cookies.get("userId"),
					"cookieUserToken": cookies.get("accessToken"),
					"name": this.state.data.autoName,
					"icon": "living.png",
					"homeId": this.props.currentHomeId,
					"enable": 1,
					"type": "dev",
					"autoId": this.props.curAutoData.autoId,
				}).then(() => this.state.data.hasChangeName = false)
			}
			this.editAutoRule();
		}
	}

	addAutoRule(autoId) {
		this.state.data.if.logic = "or";
		let then = this.state.seldev.map((item, index) => {
			if(item.attr.OnOff&&typeof(item.attr.OnOff) === 'string'){
		    	item.attr.OnOff =Number(item.attr.OnOff)
			}
			if(item.attr.CCT){
				item.attr.CCT =Number(item.attr.CCT)
				item.attr.CCT =parseInt(item.attr.CCT);
			}
			if(item.attr.Dimming){
				item.attr.Dimming =Number(item.attr.Dimming)
				item.attr.Dimming =parseInt(item.attr.Dimming);
			}
			if(item.attr.OnOff ==0){
				item.attr ={"OnOff":0}
			}
			return {
				idx: 0,
				thenType: "dev",
				parentId: item.parentId,
				id: item.devId,
				attr: item.attr
				// enable:item.enable
			}
		})
		this.props.actions.saveAutoRule({
			"payload": {
				autoId,
				"enable": 1,
				"enableDelay": 0,
				"if": this.resetTrigger( true),
				"then": then
			}
		}).then((res) => {

			if (res &&res.ack&& (res.ack.code != 200)) {
				this.props.actions.refreshAutoList(true);
				this.props.history.push("./automation");
				Toast.info(res.desc || 'Create failed', 3, null, false);
				return;
			}

			Toast.info(res.desc || 'Create failed', 3, null, false);	
			console.log('--------------------------------------------------  add autoRule faile-----------------')
			console.log(res)

			Toast.hide();
			this.props.actions.refreshAutoList(true);
			this.props.history.push("./automation");
		})

	}

	resetTrigger( isAdd) {
		
		let ifObj = this.state.data.if;
		let idx = 1;
		console.log('----------------------------------门磁 --------------------h j c---------')
		console.log(ifObj)
	
		let triggerArr = [];
		ifObj.trigger.map((item) => {
		 	if(item.devId.length == 0){
		 		return;
		 	}
		 	const triggerDev = {
				"idx": typeof item.idx !== 'number' ? idx : item.idx,
				"trigType": "dev",
				"devId": item.devId,
				parentId: item.parentId,
				"attr": item.attr,
				"compOp": "==",
				"value": Number(item.value),
			}
			idx++;
			triggerArr.push(triggerDev);
		});
		ifObj.trigger =triggerArr;
		// ifObj.trigger = [{
		// 	"idx": 0,
		// 	"trigType": "dev",
		// 	"devId": device.devId,
		// 	parentId: device.parentId,
		// 	"attr": device.attr,
		// 	"compOp": "==",
		// 	"value": device.value || "1",
		// }]
		return ifObj
	}

	editAutoRule() {
		this.state.data.if.logic = "or"
		let then = this.state.seldev.map((item, index) => {

			if(item.attr.OnOff&&typeof(item.attr.OnOff) === 'string'){

				item.attr.OnOff =Number(item.attr.OnOff)
			}
			if(item.attr.CCT){
				item.attr.CCT =Number(item.attr.CCT);
		    	item.attr.CCT =parseInt(item.attr.CCT);
			}
			if(item.attr.Dimming){
				item.attr.Dimming =Number(item.attr.Dimming)
				item.attr.Dimming =parseInt(item.attr.Dimming);
			}

			if(item.attr.OnOff ==0){
				item.attr ={"OnOff":0}
			}
			return {
				idx: 0,
				thenType: "dev",
				parentId: item.parentId,
				id: item.devId || item.id,
				attr: item.attr
				// enable:item.enable
			}
		})
		this.props.actions.editAutoRule({
			"payload": {
				"autoId": this.props.curAutoData.autoId,
				"enable": 1,
				"enableDelay": 0,
				"if": this.resetTrigger(false),
				"then": then
			}
		}).then((res) => {

			if (res && res.ack&&(res.ack.code != 200)) {
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

	handleChangeName() {
		let name = this.refs.name.value
		this.state.change = true;
		this.setState({ autoName: name })
		this.state.data.autoName = name
		this.state.data.hasChangeName = true;
	}

	render() {
		const { deviceItem } = this.props;
		return (
			<div>
				<BarTitle onBack={this.handleClickBack} title={Lang.automation.create.title} onDone={this.handleClickSave} doneTitle={Lang.public.txtSave}/>
				<div className="automation create">
					<div className="auto-group">
						<label>{Lang.automation.create.subTitle[0]}</label>
						<BarNormal>
							<input type="text" name="name" ref="name" maxLength="30" value={this.state.autoName} onChange={this.handleChangeName} />
						</BarNormal>
					</div>
					<div className="auto-group dayandtime">
						 <label>{Lang.automation.create.subTitle[1]}</label>	
						 {this.state.data.if.trigger.length==0 ?
								<BarNormal onNext={this.goNext.bind(this,"/automation/triggerDeviceList")}>
						  		  <span className="title">{Lang.automation.create.labelText[0]}</span>
								</BarNormal>	
								:
							this.state.data.if.trigger.map((item, index)=>{
								return <BarNormal onNext={this.goNext.bind(this,"/automation/triggerDeviceList")}>
								 <div key={index} className={"item devItem auto-device-box " +   this.props.deviceItem[item.devId].icon} style={{ margin: "0" }}>
									<section>
										<h2 style={{ lineHeight: "2rem", width: "10rem" }}>{this.props.deviceItem[item.devId].name}</h2>
										<h3 style={{ lineHeight: "3.2rem", width: "10rem" }}>{this.props.deviceItem[item.devId].roomName}</h3>
									</section>
									{/* {<span className='arrowRight'></span>} */}
									<div className="txtDiv first">
										{item.attr === "Door" ? <p>{item.value == "1" ? Lang.automation.triggerdoordetail.doorOpen : Lang.automation.triggerdoordetail.doorClose}</p> : <p>{item.value =="1" ? Lang.automation.triggermotiondetail.motiontriggered : Lang.automation.triggermotiondetail.motionuninterrupted}</p>}
									</div>
							  </div>
							</BarNormal>
							})
						}				
							
			{/* // <BarNormal onNext={this.goNext.bind(this, "/automation/triggerDeviceList")}>
			// 						{this.state.data.if.trigger.length>0 ? this.setTriggerList() : <span className="title">{Lang.automation.create.labelText[0]}</span>}
			// 						</BarNormal> */}
				
						<BarNormal onNext={this.goNext.bind(this,"/automation/duringTime")}>
							{(this.state.data.if.valid.begin) ? this.setDuringTime() : <span className="title">{Lang.automation.create.labelText[1]}</span>}
						</BarNormal>
					</div>
					<div className="auto-group dayandtime">
						<label>{Lang.automation.create.subTitle[2]}</label>
						{
							Object.keys(deviceItem).length ?
								this.state.seldev.map((item, index) =>
									<div key={index} className={("item devItem auto-device-box" + "  " + (deviceItem[item.id || item.devId] ? deviceItem[item.id || item.devId].icon : '') + (eval(item.attr.OnOff) ? "-true" : "-false"))} onClick={this.pushDeviceContro.bind(this, item)}>
										<section>
											<h2>{deviceItem[item.id || item.devId] ? deviceItem[item.id || item.devId].name : ''}</h2>
											<h3>{deviceItem[item.id || item.devId] ? deviceItem[item.id || item.devId].roomName : ''}</h3>
										</section>
										<span className='arrowRight'></span>
										<div className="txtDiv">
											{this.getDevAttr(item.attr)}
										</div>
									</div>
								) : ""
						}
						<div className="bottom_" style={{ paddingBottom: "20px" }}>
							<BarNormal onNext={this.goNext.bind(this,"/automation/selectdevices")}>
								<span className="title">{Lang.automation.create.labelText[2]}</span>
							</BarNormal>
						</div>
					</div>
				</div>
			</div>
		);
	}
}


const mapStateToProps = (state, ownProps) => {
	console.log('-----------------------------automation.devicesOfAuto------------')
	console.log(state.automation.devicesOfAuto)
	return {
		autoMationRule: state.automation.autoMationRule,
		deviceList: state.device.list,
		deviceItem: state.automation.devicesOfAuto,
		curAutoData: state.automation.autoItem,
		currentHomeId: state.family.currentId,
		recordAttr: state.device.recordAttr
	}
}

const mapDispatchToProps = dispatch => {
	return {
		actions: bindActionCreators({
			setCurAutoItem,
			saveDeviceItem,
			saveAutomation,
			saveAutoRule,
			editAutomation,
			editAutoRule,
			setAutoDevices,
			refreshAutoList,
			setRecordAttr,
			initRecordAttr,
			setTriChooseTmp
		}, dispatch),
		showDialog: (...args) => dispatch(showDialog(...args)),
		changeFromPage: (...args) => dispatch(changeFromPage(...args))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AutomationCreate)