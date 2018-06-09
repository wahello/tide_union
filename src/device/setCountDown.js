import React, { Component } from 'react';
import Device from '../jssdk/device';
import BarTitle from '../component/barTitle';
import ScrollView from '../component/scrollView';
import { showDialog } from '../action';
import helper from '../public/helper';
import SystemApi from '../jssdk/system';
import { Lang } from '../public';
import { connect } from 'react-redux';
import './default/style.css';
import {PickerView} from 'antd-mobile';
import Cookies from 'universal-cookie';
import Toast from 'antd-mobile/lib/toast';

const dialogLang = Lang.public.dialog;
const deviceLang = Lang.device;

let hours = [];
let minutes = [];

class SetCountDown extends Component {
	cookies = new Cookies();
	
  constructor(props) {
    super(props);
		
		this.state = {
			datas:[],
			value:[0,0]
    };
    this.device = new Device;
    this.systemApi = new SystemApi;
    
    this.handleClickBack = this.handleClickBack.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }
  
  handleSave(){
  	if(this.state.value.length == 2){
  		Toast.loading("", 0, null, true);
  		let sec = 0;
  		// 计算秒数
  		sec = this.state.value[0] * 3600 + this.state.value[1]*60;
  		console.log("handleSave sec = " + sec);
  		console.log("this.props.deviceItem = " , this.props.deviceItem);
  		
  		if(this.props.deviceItem &&  this.props.deviceItem.communicationMode == "BLE"){
  			this.device.setCountDownReq({
  				devId: this.props.deviceItem.devId,
  				hour:this.state.value[0],
  				minute:this.state.value[1]
  			});
  			Toast.hide();
  			this.props.history.goBack();
  		} else{
  			this.device.setCountDownReq({
					userId: this.cookies.get('userId'),
					payload: {
						devId:this.props.deviceItem.devId,
						countDown:sec
					}
				}).then(res => {
					console.log("setCountDownReq ：", res);
					if(res && res.ack && res.ack.code == 200) {
						this.props.history.goBack();
					} else{
						throw res;
					}
					Toast.hide();
				}).catch(res => {
					Toast.hide();
					Toast.info("Fail to save,please try again.");
				});
  		}
  		
  	}
    
    let datas = [];
    this.generateHourData();
    this.generateMinuteData();
    datas.push(hours);
    datas.push(minutes);
    
    this.setState({
    	datas:datas
    });
  }
  
  onChange(value){
  	console.log("onChange value = " + value);
  	if(value[0] == 12){
  		value[1] = 0;
  	}
  	this.setState({
  		value:value
  	});
  }
  
  generateHourData(){
  	hours = [];
  	for(let i = 0; i <= 12; i++){
  		let label = "";
  		if(i < 10){
  			label = "0" + i;
  		} else {
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
  	
  	for(let i = 0; i < 60; i = i + 10){
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

  handleClickBack(event){
  	this.props.history.goBack();
  }
  
  
  componentDidMount(){
    this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
    
    let datas = [];
    this.generateHourData();
    this.generateMinuteData();
    datas.push(hours);
    datas.push(minutes);
    
    this.setState({
    	datas:datas
    });
    
    console.log("this.props.deviceItem = " , this.props.deviceItem);
  }
  
  componentWillUnmount(){
  }
  
    
  render() {
  	
    return (
      <div className="count_down_root">
      	<BarTitle onBack={this.handleClickBack} title="setCountDown" onDone={this.handleSave}/>
      	
      	<PickerView
	        onChange={this.onChange}
	        value={this.state.value}
	        data={this.state.datas}
	        cascade={false}
	      />
      	
      	<div id="demo-inline">
      	</div>
      </div>
    );
  }
}

//将state绑定到props
const mapStateToProps = (state) => {
  return {
  	deviceItem:state.device.deviceItem,
  }
};
//将action的所有方法绑定到props上
const mapDispatchToProps = (dispatch) => {
  return {
    showDialog: (...args) => dispatch(showDialog(...args))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SetCountDown);