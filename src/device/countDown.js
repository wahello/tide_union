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
import Cookies from 'universal-cookie';
import Toast from 'antd-mobile/lib/toast';

const dialogLang = Lang.public.dialog;
const deviceLang = Lang.device;
let countDownTimer = null;
let isReceive = false;

class CountDown extends Component {
	cookies = new Cookies();
	
  constructor(props) {
    super(props);
		
	this.state = {
      isEnable: false,
      currentTime:0
    };
    this.device = new Device;
    this.systemApi = new SystemApi;
    this.handleClickBack = this.handleClickBack.bind(this);
    this.onChangeEnable = this.onChangeEnable.bind(this);
    this.handleRevise = this.handleRevise.bind(this);
  }

  handleClickBack(event){
  	isReceive = false;
  	if(countDownTimer != null){
  		clearTimeout(countDownTimer);
  	}
  	this.props.history.goBack();
  }
  
  
  componentDidMount(){
    this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
    
    if(this.props.deviceItem &&  this.props.deviceItem.communicationMode == "BLE"){
    	this.refreshBLERemainCountDown();
    } else {
    	this.refreshRemainCountDown();
    }
   
  }
  
  refreshBLERemainCountDown(){
		let that = this;
		isReceive = true;
		this.device.getCountDownReq({
			devId: this.props.deviceItem.devId
		}).then(res => {
			if(!isReceive){
				return;
			}
			console.log("getCountDownResp ：", res);
			if(res){
				that.setState({
					isEnable: res.enable,
					currentTime:res.remainCountDown
				});
					
				if(countDownTimer != null){
					clearTimeout(countDownTimer);
				}
					
				if(res.enable){
					that.startCountDown();
				}
			}
			
			
		}).catch(res => {
			that.setState({
				isEnable: false,
				currentTime:0
			});
		});
	}
  
  refreshRemainCountDown(){
  	let that = this;
  	this.device.getCountDownReq({
			devId: this.props.deviceItem.devId,
			payload: {
			}
		}).then(res => {
			console.log("getCountDownResp ：", res);
			if(res && res.ack && res.ack.code == 200) {
					that.setState({
						isEnable: res.payload.enable,
						currentTime:res.payload.remainCountDown
					});
					
					if(countDownTimer != null){
  						clearTimeout(countDownTimer);
  					}
					
					if(res.payload.enable){
  						that.startCountDown();
  					}
			} else {
				that.setState({
					isEnable: false,
					currentTime:0
				});
			}
		}).catch(res => {
			that.setState({
				isEnable: false,
				currentTime:0
			});
		});
  }
  
  componentWillUnmount(){
  	
  }
  
  onChangeEnable(){
  	let enable = !this.state.isEnable;
  	
  	console.log("enable = " + enable);
  	let enableValue = 1;
  	
  	if(enable){
  		this.setCountDownEnable(enableValue);
  	} else {
  		enableValue = 0;
  		this.setCountDownEnable(enableValue);
  	}
  }
  
  setCountDownEnable(enableValue){
  	Toast.loading("", 0, null, true);
		if(this.props.deviceItem &&  this.props.deviceItem.communicationMode == "BLE"){
			this.device.setCountDownEnableReq({
				devId:this.props.deviceItem.devId,
				enable:enableValue
			});
			
			this.setState({
				isEnable: enableValue
			});
			
			if(countDownTimer != null){
				clearTimeout(countDownTimer);
			}
			
			this.refreshBLERemainCountDown();
			
			Toast.hide();
		}else{
			this.device.setCountDownEnableReq({
						userId: this.cookies.get('userId'),
						payload: {
							devId:this.props.deviceItem.devId,
							enable:enableValue
						}
					}).then(res => {
						console.log("setCountDownEnableReq ：", res);
						if(res && res.ack && res.ack.code == 200) {
							this.setState({
								isEnable: res.payload.enable,
								currentTime:res.payload.countDown
							});
							
							if(countDownTimer != null){
	  						clearTimeout(countDownTimer);
	  					}
							
							if(res.payload.enable){
	  							this.startCountDown();
	  						}
						} else{
							throw res;
						}
						
						Toast.hide();
					}).catch(res => {
						this.refreshRemainCountDown();
						Toast.hide();
					});
		}
  	
  }
  
   startCountDown(){
  	let that = this;
  	
		countDownTimer = setTimeout(()=>{
				if(this.state.isEnable){
					let time = this.state.currentTime - 1;
					if(time <= 0){
						this.setState({
				  		currentTime:time
				  	});
					} else {
						this.setState({
				  		currentTime:time
				  	});
				  	console.log("time = " + time);
				  	that.startCountDown();
					}
				}
			}, 1000);
  }
  
  handleRevise(){
  	if(countDownTimer != null){
  		clearTimeout(countDownTimer);
  	}
  	this.props.history.push(`/device/setCountDown`);
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
    	if(theTime == 0){
			if(parseInt(theTime1) < 10){
	    		result = "0"+parseInt(theTime1);
	    	} else {
	    		result = ""+parseInt(theTime1);
	    	}
		} else {
			if((parseInt(theTime1) + 1) < 10){
	    		result = "0"+(parseInt(theTime1) + 1);
	    	} else {
	    		result = ""+(parseInt(theTime1) + 1);
	    	}
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
    		result = "0"+parseInt(theTime2)+" : "+result;
    	} else {
    		result = ""+parseInt(theTime2)+" : "+result;
    	}
    } else {
    	result = "00 : "+result;
    }
    
    console.log("result = ",result);
    return result;
  }
  
    
  render() {
  	
    return (
      <div className="count_down_root">
      	<BarTitle onBack={this.handleClickBack} title={Lang.device.countdown.title} onRevise={this.handleRevise}/>
      	
      	<div className="count_down_main">{this.getTime(this.state.currentTime)}</div>
      	<div className={this.state.isEnable?"count_down_enable disable":"count_down_enable enable"} onClick={this.onChangeEnable}>
      		<div className={this.state.isEnable?"count_down_status disable":"count_down_status enable"}>
      			{
      				this.state.isEnable?
      				"Disable"
      				:
      				"Enable"
      			}
      		</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(CountDown);