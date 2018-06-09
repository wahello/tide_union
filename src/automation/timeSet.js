import React, {Component} from 'react';
import './default/style.css';
import SystemApi from '../jssdk/system';
import { connect } from 'react-redux';
import BarTitle from '../component/barTitle';
import { Lang } from '../public';
import { bindActionCreators } from 'redux';
import {setCurAutoItem} from '../action/automation'
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import Toast from 'antd-mobile/lib/toast';
import MapApi from '../jssdk/Map';
import {PickerView,Picker} from 'antd-mobile';
import ScrollView from '../component/scrollView';


let hours = [];
let minutes = [];

let twelveHours = [];

// 如果不是使用 List.Item 作为 children
const CustomChildren = props => (
	<div onClick={props.onClick}>
		<span className="sun_time">{props.isSelect?props.selectValue[2] == 0?"Before":"After":Lang.automation.timeset.beforeOrAfter}</span>
		<span className="sun_value">{props.isSelect?props.selectValue[0] + " hours " + props.selectValue[1] + " mintutes":""}</span>
		<span className='arrowRight'></span>
	</div>
);

// 经度
let longitude = "";
// 纬度
let latitude = "";
// 时区
let timeZone = "";

class TimeSet extends Component {
	constructor(props) {
		super(props);
		this.state = {
			datas:[],
			pickerDatas:[],
			value:this.getNormalDefaultTime(),
			sunriseValue: this.getSunDefaultTime("sunrise"),
			sunsetValue: this.getSunDefaultTime("sunset"),
			checkIndex:this.getDefaultCheckIndex(), // 选中的TimeSet类型  默认是普通定时  0：普通定时 1:日出  2：日落
			isSet:this.getSunTimeIsSelect(),
			locationDetail:""
		}
		this.systemApi = new SystemApi;
		this.mapApi = new MapApi;
		
		this.handleClickBack = this.handleClickBack.bind(this);
		this.handleClickSave = this.handleClickSave.bind(this);
		this.onChangeLocation = this.onChangeLocation.bind(this);
		this.onChangeTimeSet = this.onChangeTimeSet.bind(this);
		this.onChangeTimeCheck = this.onChangeTimeCheck.bind(this);
		this.isHasSelectTime = this.isHasSelectTime.bind(this);
	}
	
	isHasSelectTime(){
		if(this.state.checkIndex == 1){
			
		} else if(this.state.checkIndex == 2){
			
		}
		
		return false;
	}
	
	onChangeLocation(){
		this.mapApi.getLocation({title:Lang.automation.timeset.locationTitle}).then((res)=>{
			if(res && res.detail){
				this.setState({
					locationDetail:res.detail
				});
				// 经度
				longitude = res.longitude;
				// 纬度
				latitude = res.latitude;
				// 时区
				timeZone = res.timezone;
			}
			
		});
	}
	
	onChangeTimeSet(value){
	  	console.log("onChange value = " + value);
	  	this.setState({
	  		value:value
	  	});
	 }
	
	onChangeTimeCheck(index){
		let auto = this.props.curAutoData;
		console.log("当前选择的设备 = ",auto.then);
		if(index != 0 && auto.then){
			let canChange = true;
			for(let i = 0; i < auto.then.length; i++){
				if(auto.then[i].devType != "wifi_plug"){
					canChange = false;
					break;
				}
			}
			
			if(!canChange){
				Toast.info(Lang.automation.timeset.noWifiPlugTips);
				return;
			}
		}
		this.setState({
			checkIndex:index,
			isSet:false
		});
		
		
		
		console.log("onChangeTimeCheck = " , auto);
		if(auto.if.trigger[0].trigType == "sunrise" && index == 1 || auto.if.trigger[0].trigType == "sunset" && index == 2){
			this.setState({
				isSet:true
			});
		}
	}
	
	generate12HourData(){
		twelveHours = [];
	  	for(let i = 1; i < 13; i++){
	  		let label = "";
	  		if(i < 10){
	  			label = "0" + i;
	  		} else{
	  			label = i;
	  		}
	  		
	  		
	  		twelveHours.push({
	  			label:label,
	  			value:i
	  		})
	  	}
	  	
	  	console.log("twelveHours = ",twelveHours);
	}
  
	generateHourData(){
	  	hours = [];
	  	for(let i = 0; i < 24; i++){
	  		let label = "";
	  		if(i < 10){
	  			label = "0" + i;
	  		} else{
	  			label = i;
	  		}
	  		
	  		
	  		hours.push({
	  			label:label,
	  			value:i
	  		})
	  	}
	  	
	  	console.log("hours = ",hours);
	}
	
	generateMinuteData(){
	  	minutes = [];
	  	
	  	for(let i = 0; i < 60; i++){
	  		let label = "";
	  		if(i < 10){
	  			label = "0" + i;
	  		} else{
	  			label = i;
	  		}
	  		
	  		minutes.push({
	  			label:label,
	  			value:i
	  		})
	  	}
	  	
	  	console.log("minutes = ",minutes);
  	}
	
	handleClickBack(event) {
		this.props.history.goBack();
	}
	
	/**
	 * 设置普通定时时间
	 */
	setNormalTimer(){
		let auto = this.props.curAutoData
		let newHour = this.formatTime(this.get12To24Hour(this.state.value[0],this.state.value[2])) + ":" + this.formatTime(this.state.value[1]);
		console.log("newHour = ",newHour);
		
		console.log("auto = ",auto);
		auto.if.trigger[0].trigType="timer";
		auto.if.trigger[0].at = newHour;
		
		delete auto.if.trigger[0].longitude;
		delete auto.if.trigger[0].latitude;
		delete auto.if.trigger[0].timeZone;
		delete auto.if.trigger[0].intervalType;
		delete auto.if.trigger[0].intervalTime;
		
		this.props.actions.setCurAutoItem(auto);
	}
	
	/**
	 * 获取默认选中的定时类型
	 */
	getDefaultCheckIndex(){
		let auto = this.props.curAutoData;
		console.log("getDefaultCheckIndex auto = ",auto);
		// 普通定时
		if(auto.if.trigger[0].trigType == "timer"){
			return 0;
		} else if(auto.if.trigger[0].trigType == "sunrise"){
			return 1;
		} else if(auto.if.trigger[0].trigType == "sunset"){
			return 2;
		}
		
		return 0;
	}
	
	/**
	 * 格式化时间
	 */
	formatTime(time){
		if(time < 10){
			return "0"+time;
		} else {
			return time;
		}
	}
	
	/**
	 * 12小时转24小时
	 * hour:小时时间
	 * amOrPm：0：am  1：pm
	 */
	get12To24Hour(hour,amOrPm){
		let twelveHour = hour;
		// PM
		if(amOrPm){
			if(hour != 12){
				twelveHour = hour + 12;
			}
		} else { // am
			if(hour == 12){
				twelveHour = 0;
			}
		}
		
		return twelveHour;
	}
	
	/**
	 * 获取普通定时原来的时间，如果新建则为0,0,0
	 */
	getNormalDefaultTime(){
		let auto = this.props.curAutoData;
        let now = new Date();

		let amOrPm = 0;
		let newHour = 0;
		let newMinute = 0;

		if(auto.if.trigger[0].trigType == "timer"){
			let at = auto.if.trigger[0].at;
			if(at){
				let newTime = at.split(":");
				console.log("newTime = ",newTime);
				if(newTime){
					let hour = Number(newTime[0]);
					
					if(hour >= 12){
						amOrPm = 1;
					} 
					
					if(hour == 0 || hour == 12){
						newHour = 12;
					} else{
						newHour = hour % 12;
					}
					
					newMinute = Number(newTime[1]);
					
				}
			}else{
				let h = now.getHours();
				let m = now.getMinutes();
				if(h >= 12){
					amOrPm = 1;
				}
				newHour =h >12 ? h -12 :h;
				newMinute = m;
				console.log(amOrPm,newHour,newMinute,h,m);
			}
		}
		return [newHour,newMinute,amOrPm];
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
	    console.log("theTime = ",theTime);
	    if(theTime1 > 0) {
	    	result = ""+(parseInt(theTime1));
	    } else {
	    	if(theTime <= 0){
	    		result = "0";
	    	} else {
	    		result = "1";
	    	}
	    }
	    
	    if(theTime2 > 0) {
	    	result = ""+parseInt(theTime2)+":"+result;
	    } else {
	    	result = "0:"+result;
	    }
	    
	    console.log("result = ",result);
	    return result;
  	}
	
	getSunDefaultTime(type){
		let auto = this.props.curAutoData;
		let beforeOrAfter = 0;
		let newHour = 0;
		let newMinute = 0;
		console.log("getSunriseDefaultTime = " , auto);
		if(auto.if.trigger[0].trigType == type){
			let intervalTime = auto.if.trigger[0].intervalTime;
			if(intervalTime){
				let formatTime = this.getTime(intervalTime);
				let newTime = formatTime.split(":");
				
				if(newTime){
					newHour = Number(newTime[0]);
					newMinute = Number(newTime[1]);
				}
				console.log("formatTime = " + formatTime);
			}
			
			let intervalType = auto.if.trigger[0].intervalType;
			if(intervalType == 1){
				beforeOrAfter = 0;
			} else if(intervalType == 2){
				beforeOrAfter = 1;
			}
		}

      
		return [newHour,newMinute,beforeOrAfter];
	}
	
	getSunTimeIsSelect(){
		let auto = this.props.curAutoData;
		console.log("getSunriseDefaultTime = " , auto);
		if(auto.if.trigger[0].trigType == "sunrise" || auto.if.trigger[0].trigType == "sunset"){
			let intervalType = auto.if.trigger[0].intervalType;
			if(intervalType == 1 || intervalType == 2){
				return true;
			} 
		}
		
		return false;
	}
	
	handleClickSave() {
		this.props.curAutoData.change =true;
		// 普通定时
		if(this.state.checkIndex == 0){
			this.setNormalTimer();
		} else if(this.state.checkIndex == 1){ // 日出
			this.setSunriseTimer("sunrise");
		} else if(this.state.checkIndex == 2){ // 日落
			this.setSunriseTimer("sunset");
		}
		
		this.props.history.goBack();
	}
	
	setSunriseTimer(type){
		let auto = this.props.curAutoData
		let newHour = this.formatTime(this.get12To24Hour(this.state.value[0],this.state.value[2])) + ":" + this.formatTime(this.state.value[1]);
		console.log("newHour = ",newHour);
		
		console.log("auto = ",auto);
		delete auto.if.trigger[0].at;
		auto.if.trigger[0].trigType=type;
		auto.if.trigger[0].longitude = longitude+"";
		auto.if.trigger[0].latitude = latitude+"";
		auto.if.trigger[0].timeZone = timeZone;
		if(this.state.isSet){
			if(type == "sunrise"){
				if(this.state.sunriseValue[2] == 0){
					auto.if.trigger[0].intervalType = 1;
				} else if(this.state.sunriseValue[2] == 1){
					auto.if.trigger[0].intervalType = 2;
				}
				
				let totalSecond = this.state.sunriseValue[0] * 3600 + this.state.sunriseValue[1] * 60;
				
				auto.if.trigger[0].intervalTime = totalSecond+"";
			} else if(type == "sunset"){
				if(this.state.sunsetValue[2] == 0){
					auto.if.trigger[0].intervalType = 1;
				} else if(this.state.sunsetValue[2] == 1){
					auto.if.trigger[0].intervalType = 2;
				}
				
				let totalSecond = this.state.sunsetValue[0] * 3600 + this.state.sunsetValue[1] * 60;
				
				auto.if.trigger[0].intervalTime = totalSecond+"";
			}
			
		} else {
			auto.if.trigger[0].intervalType = 0;
			auto.if.trigger[0].intervalTime = "0";
		}
		
		console.log("new Auto = ",auto);
		
		this.props.actions.setCurAutoItem(auto);
	}
	
	
	componentWillMount(){
		let datas = [];
		let pickerDatas = [];
		
		this.generate12HourData();
	    this.generateMinuteData();
	    datas.push(twelveHours);
	    datas.push(minutes);
	    
	    this.generateHourData();
	    pickerDatas.push(hours);
	    pickerDatas.push(minutes);
	    
	    datas.push([
	    	{
	  			label:"AM",
	  			value:0
	  		},
	  		{
	  			label:"PM",
	  			value:1
	  		}
	    ]);
	    
	    pickerDatas.push([
	    	{
	  			label:"Before",
	  			value:0
	  		},
	  		{
	  			label:"After",
	  			value:1
	  		}
	    ]);
	    
	    this.setState({
	    	datas:datas,
	    	pickerDatas:pickerDatas
	    });
	    
	}
	
	componentDidMount() {
		// this.setRepeatPre()
		this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
		
	 	this.mapApi.getCurrentLocation().then((res)=>{
			console.log("getCurrentLocation",res);
			this.setState({
				locationDetail:res.detail
			});
			// 经度
			longitude = res.longitude;
			// 纬度
			latitude = res.latitude;
			// 时区
			timeZone = res.timezone;
		});
		
	}

	render() {
		return(
			<div className="timeset">
	  	 		<BarTitle onBack={this.handleClickSave} title={Lang.automation.timeset.title}/>
	  	 		<ScrollView>
					<div className="content">
					 	<ul>
							<li>
								<span className="time">{Lang.automation.timeset.title}</span>
								<label onClick={this.onChangeTimeCheck.bind(this,0)} className={this.state.checkIndex == 0 ? "ck on" : "ck"}>
								</label>
							</li>
							{this.state.checkIndex == 0?
								<li className="time_info">
									<PickerView
								        onChange={this.onChangeTimeSet}
								        value={this.state.value}
								        data={this.state.datas}
								        cascade={false}
								    />
								</li>
								:""
							}
							
					 	</ul>
						<ul className="checkboxGroup2">
							<li>
								<span className="time">{Lang.automation.timeset.sunrise}</span>
								<label  onClick={this.onChangeTimeCheck.bind(this,1)} className={ this.state.checkIndex == 1 ? "ck on" : "ck"} >
								</label>
							</li>
							{this.state.checkIndex == 1?
								<li className="like_first">
									<Picker
									  data={this.state.pickerDatas}
							          title="Before/After"
							          cascade={false}
							          value={this.state.sunriseValue}
							          onChange={v => this.setState({ sunriseValue: v })}
							          onOk={v => this.setState({ sunriseValue: v,isSet:true })}
							          onDismiss={v => this.setState({isSet:false })}>
									 
							         	<CustomChildren isSelect={this.state.isSet} selectValue={this.state.sunriseValue}></CustomChildren>
							        </Picker>
								</li>
								:""
							}
						</ul>
						
						<ul className="checkboxGroup2">
							<li>
								<span className="time">{Lang.automation.timeset.sunset}</span>
								<label  onClick={this.onChangeTimeCheck.bind(this,2)} className={ this.state.checkIndex == 2 ? "ck on" : "ck"} >
								</label>
							</li>
							{this.state.checkIndex == 2?
								<li className="like_first">
									<Picker
									  data={this.state.pickerDatas}
							          title="Before/After"
							          cascade={false}
							          value={this.state.sunsetValue}
							          onChange={v => this.setState({ sunsetValue: v })}
							          onOk={v => this.setState({ sunsetValue: v,isSet:true })}
							          onDismiss={v => this.setState({isSet:false })}
							          >
									 
							         	<CustomChildren isSelect={this.state.isSet} selectValue={this.state.sunsetValue}></CustomChildren>
							        </Picker>
								</li>
								:""
							}
						</ul>
						
						<div className="location" onClick={this.onChangeLocation}>
							<div className="location_title">
								{Lang.automation.timeset.locatioTitle}
							</div>
							
							<ul className="checkboxGroup2">
								<li>
									<span className="time">{this.state.locationDetail}</span>
									<span className='arrowRight'></span>
								</li>
							</ul>
						</div>
					</div>
				</ScrollView>
			</div>
		);
	}
}
const mapStateToProps = (state, ownProps) => {
	return {
		curAutoData: state.automation.autoItem,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		actions: bindActionCreators({
			setCurAutoItem
		}, dispatch),
	}
}
export default connect(mapStateToProps,mapDispatchToProps)(TimeSet)