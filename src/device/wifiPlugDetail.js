import React, {
	Component
} from 'react';
import BarTitle from '../component/barTitle';
import { Lang } from '../public';
import { connect } from 'react-redux';
import Device from '../jssdk/device';
import SystemApi from '../jssdk/system';
import './default/style.css';
import { bindActionCreators } from 'redux';
import { fetchProductInfo } from '../action/home';
import { changeBackAction } from '../action';
import { saveDeviceItem, setRecordAttr } from '../action/device';
import { setDeviceMode } from '../action/device';

let countDownTimer = null;
let isShowOver = false;
let isReceive = false;

class WifiPlugDetail extends Component {
	constructor(props) {
		super(props);

		this.device = new Device();
		this.systemApi = new SystemApi;

		const {
			devId,
			deviceItems,
			fromPage,
			recordAttr
		} = this.props;
		

		const deviceItem = deviceItems[devId];
		let attr = {
			OnOff: 0
		}

		console.log("plug deviceItem = ", deviceItem);
		console.log("recordAttr = ", recordAttr);
		console.log("fromPage = ", fromPage);

		if(fromPage === 'list' || recordAttr.devId === '') {
			if(!deviceItem.online) {
				deviceItem.attr.OnOff = 0;
			}
			attr = deviceItem.attr;
		} else {
			attr = recordAttr.attr;
		}

		this.state = {
			isOnline: deviceItem.online,
			OnOff: attr && attr.OnOff !== undefined ? (attr.OnOff - 0) : 0,
			hasCountDown: false,
			devId: devId,
			devType: deviceItem.devType,
			remainCountDown:0,
			isEnable:0
		}

		this.dataDetail = deviceItem;

		this.handleClickBack = this.handleClickBack.bind(this);
		this.handleClickSet = this.handleClickSet.bind(this);
		this.handGoToCountDown = this.handGoToCountDown.bind(this);
		this.handGoToSetCountDown = this.handGoToSetCountDown.bind(this);
		this.handleClickSave = this.handleClickSave.bind(this);
		this.handleChangeSwitch = this.handleChangeSwitch.bind(this);
	}
	
	handleClickSave() {
	    this.props.changeBackAction(true);
	    const { fromPage, actions, devId, deviceItems } = this.props;
	    const device = deviceItems[devId];
	    if (fromPage !== 'list') {
	      let attrObj = {
	        OnOff: this.state.OnOff,
	      };
	
	      actions.setRecordAttr({
	        devId: devId,
	        attr: attrObj
	      });
	      
	      console.log("devId = ", devId);
	      console.log("recordAttr = ", attrObj);
	    }
	
	    this.props.history.goBack();
  	}

	handGoToCountDown() {
		if(countDownTimer != null){
			isReceive = false;
  			clearTimeout(countDownTimer);
  		}
		this.props.actions.saveDeviceItem(this.dataDetail);
		this.props.history.push(`/device/countDown`);
	}

	handGoToSetCountDown() {
		if(countDownTimer != null){
  			clearTimeout(countDownTimer);
  		}
  		if(!this.state.hasCountDown){
			this.props.deviceItems[this.props.devId].setCountDown = 0;
		}
		this.props.history.push(`/device/setCountDown`);
	}

	handleClickBack() {
	    if(countDownTimer != null){
  			clearTimeout(countDownTimer);
  		}
		console.log("recordAttr = ",this.props.recordAttr);
		this.props.changeBackAction(false);
		if (this.props.fromPage !== 'list' && this.props.recordAttr && this.props.recordAttr.devId != '' && this.props.recordAttr.isCheck) {
    	 	this.device.setDevAttrReq({
		      parentId: this.props.recordAttr.devId,
		      payload: {
		        devId: this.props.recordAttr.devId,
		        attr: this.props.recordAttr.attr
		      }
		    }).then(res => {
		      if (res && res.ack && res.ack.code == 200) {
		      } else {
		      }
		    }).catch(res => {
		      // this.setState({ OnOff: !that.state.OnOff });
		    });
    	}
		this.props.history.goBack();
	}

	handleClickSet() {
		this.props.actions.saveDeviceItem(this.dataDetail);
		if(this.dataDetail.attr){
			this.props.setDeviceMode(this.dataDetail.attr.Mode);
		}
		this.props.history.push(`/device/edit/${this.state.devId}`);
	}

	handleChangeSwitch(value) {
		if(!isShowOver){
			return;
		}
		const {
			deviceItems,
			devId
		} = this.props;
		const currentDevice = deviceItems[devId];
		if(!currentDevice.online) {
			return false;
		}

		this.setState({
			OnOff: value?1:0
		});
			console.log("wcb currentDevice.communicationMode = ",currentDevice);
		if(currentDevice.devType === 'wifi_plug') {
			this.switchByWifi(currentDevice, value);
		}else if(currentDevice.communicationMode == "BLE"){
			if(value == 1){
				console.log("wcb value = ",value);
				this.device.turnOn({devId:currentDevice.devId});//开
				this.refreshBleCountDown();
	    	}else if(value == 0){
	    		console.log("wcb value = ",value);
				this.device.turnOff({devId:currentDevice.devId});//关
				if(countDownTimer != null){
		  			clearTimeout(countDownTimer);
		  		}
	    	}
		}
		
	}

	switchByWifi(currentDevice, value) {
		let that = this;
		this.device.setDevAttrReq({
			parentId: currentDevice.devId,
			payload: {
				devId: currentDevice.devId,
				attr: {
					"OnOff": 0 + value
				}
			}
		}).then(res => {
			console.log("OnOff回传：", res);
			if(res && res.ack && res.ack.code == 200) {
				if(value){
					this.refreshCountDown();
				} else{
					if(countDownTimer != null){
  						clearTimeout(countDownTimer);
  					}
				}
			} else {
				that.setState({
					OnOff: that.state.OnOff?0:1
				});
			}
		}).catch(res => {
			that.setState({
				OnOff: that.state.OnOff?0:1
			});
		});
	}

	componentDidMount() {
		// 默认为false，1秒后改为true，解决首页点击进入该页后出发开关
		isShowOver = false;
		this.systemApi.offGoBack().onceGoBack(this.handleClickBack);

		if(this.state.OnOff){
			this.refreshCountDown();
		}
		
		
		setTimeout(()=>{
				isShowOver = true;
				console.log("isShowOver = ",isShowOver);
			}, 200);
	}
	
	
	refreshCountDown(){
		const {
			fromPage,
			deviceItems,
			devId
		} = this.props;
		if (fromPage !== 'list'){
			return;
		}
		const currentDevice = deviceItems[devId];
		
		if(this.state.OnOff){
			if(currentDevice.communicationMode == "BLE"){
				this.refreshBleCountDown();
			} else {
				this.refreshCountDown();
			}
		}
		
		
		setTimeout(()=>{
				isShowOver = true;
				console.log("isShowOver = ",isShowOver);
			}, 200);

	}
	
	componentWillUnmount(){
  	}
	
	refreshBleCountDown(){
		const {
			deviceItems,
			devId
		} = this.props;
		const currentDevice = deviceItems[devId];
		
		
		let that = this;
		isReceive = true;
		this.device.getCountDownReq({
			devId: currentDevice.devId
		}).then(res => {
			if(!isReceive){
				return;
			}
			console.log("wifiPlugDetail getCountDownResp ：", res);
			console.log("isShowOver ：", isShowOver);
			if(res){
				that.props.deviceItems[that.props.devId].setCountDown = res.setCountDown;
				if(res.remainCountDown > 0){
					that.setState({
						hasCountDown: true,
						remainCountDown:res.remainCountDown
					});
					
					if(countDownTimer != null){
						clearTimeout(countDownTimer);
					}
					
					if(res.enable){
						that.startCountDown();
					}
				} else {
					that.setState({
						hasCountDown: false,
						remainCountDown:res.remainCountDown
					});
				}
			}
			
		}).catch(res => {
			that.setState({
				hasCountDown: false,
				remainCountDown:0
			});
		});
	}
	
	refreshCountDown(){
		const {
			deviceItems,
			devId
		} = this.props;
		const currentDevice = deviceItems[devId];
		
		
		let that = this;
		
		this.device.getCountDownReq({
			devId: currentDevice.devId,
			payload: {
			}
		}).then(res => {
			console.log("getCountDownResp ：", res);
			if(res && res.ack && res.ack.code == 200) {
				that.props.deviceItems[that.props.devId].setCountDown = res.payload.setCountDown;
				if(res.payload.remainCountDown > 0){
					that.setState({
						hasCountDown: true,
						isEnable:res.payload.enable,
						remainCountDown:res.payload.remainCountDown
					});
					
					if(countDownTimer != null){
  						clearTimeout(countDownTimer);
  					}
					
					if(res.payload.enable){
  						that.startCountDown();
  					}
				} else {
					that.setState({
						hasCountDown: false,
						isEnable:0,
						remainCountDown:res.payload.remainCountDown
					});
				}
				
			} else {
				that.setState({
					hasCountDown: false,
					isEnable:0,
					remainCountDown:0
				});
			}
		}).catch(res => {
			that.setState({
				hasCountDown: false,
				remainCountDown:0
			});
		});
	}

	componentWillReceiveProps(nextProps) {
		console.log("componentWillReceiveProps ：", nextProps);
		if(nextProps.receivePushMessage) {
			if(nextProps.receivePushMessage.method !== null) {
				// 上报电量信息
				if(nextProps.receivePushMessage.method === 'updateEnergyReq') {

				} else if(nextProps.receivePushMessage.method === 'updateRuntimeReq') { // 上报运行时间

				}
			}
		}
	}

	getTime(value) {
		let theTime = parseInt(value); // 秒
		let theTime1 = 0; // 分
		let theTime2 = 0; // 小时
		if(theTime >= 60) {
			theTime1 = parseInt(theTime / 60);
			theTime = parseInt(theTime % 60);
			if(theTime1 >= 60) {
				theTime2 = parseInt(theTime1 / 60);
				theTime1 = parseInt(theTime1 % 60);
			}
		}

		let result = "";
		console.log("theTime = ", theTime);
		if(theTime1 > 0) {
			if((parseInt(theTime1) + 1) < 10) {
				result = "0" + (parseInt(theTime1) + 1);
			} else {
				result = "" + (parseInt(theTime1) + 1);
			}
		} else {
			if(theTime <= 0) {
				result = "00";
			} else {
				result = "01";
			}

		}

		if(theTime2 > 0) {
			result = "" + parseInt(theTime2) + "." + result;
		} else {
			result = "0." + result;
		}

		console.log("result = ", result);
		return result;
	}
	
	getCountDownTime(value){
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
	
	startCountDown(){
	  	let that = this;
	  	
		countDownTimer = setTimeout(()=>{
				if(this.state.hasCountDown){
					let time = this.state.remainCountDown - 1;
					if(time <= 0){
						this.setState({
				  			remainCountDown:time
				  		});
					} else {
						this.setState({
				  			remainCountDown:time
				  		});
				  		console.log("wifiPlugDetail time = " + time);
				  		that.startCountDown();
					}
				}
			}, 1000);
  	}


	render() {
		const {
			fromPage,
			deviceItems,
			devId
		} = this.props;
		const currentDevice = deviceItems[devId];
		console.log("currentDevice.attr.OnOff = ",currentDevice.attr.OnOff);
		let iconState = !Number(currentDevice.attr.OnOff) ? ' off' : '';
		let btnState = !Number(currentDevice.attr.OnOff) ? ' off' : '';

		if(!this.state.hasCountDown){
			this.props.deviceItems[this.props.devId].setCountDown = 0;
		}
		return(
			<div className="device wifiPlugDetail">
				<BarTitle onBack={fromPage != 'list' ? this.handleClickSave :this.handleClickBack} title={currentDevice.name} >
					{(fromPage == 'list') && (<a className="set-btn" onClick={this.handleClickSet}></a>)}
		        	
		        </BarTitle>
		        <div className="bodyer">
		        	<div className='plug_icon_div'>
			        	<div className={'plug_icon_bg' + iconState}></div>
				        <div className={'plug-icon' + iconState} onClick={this.handleChangeSwitch.bind(this,!Number(currentDevice.attr.OnOff))}>
		                </div>
		        	</div>
		        	
		        	<div className="container">
				       	<div className="item-box">
			                <div className="item-box-icon">
			                	Energy
			                </div>      
			                <div className="item-box-text">
			                    <span className="item-box-title"></span>
			                </div>
			                
			                <div className="item-value-div">
				                <div className="item-value-icon energy">
				                   {currentDevice.attr && currentDevice.attr.Energy ? currentDevice.attr.Energy : "0.00"}
				                </div>      
				                <div className="item-value-text">
				                    kW.h
				                </div>
			                </div>
			                
		            	</div>
		            	
		            	<div className="item-box">
			                <div className="item-box-icon">
			                   Runtime
			                </div>      
			                <div className="item-box-text">
			                    <span className="item-box-title"></span>
			                </div>
			                
			               <div className="item-value-div">
				                <div className="item-value-icon runtime">
				                   {currentDevice.attr && currentDevice.attr.Runtime ? this.getTime(currentDevice.attr.Runtime) : "0.00"}
				                </div>      
				                <div className="item-value-text">
				                    hr.s
				                </div>
			                </div>
		            	</div>
		        	</div>
		        	
		        	{
		        		this.state.hasCountDown && Number(currentDevice.attr.OnOff) == 1?
		        		<div className={this.state.isEnable?'count_down':'count_down disable'} onClick={this.handGoToCountDown}>
		        			{this.getCountDownTime(this.state.remainCountDown)}
		        		</div>
		        		:
		        		<div className="un_set_count_down" onClick={this.handGoToSetCountDown}>
			        		<div className="count_down_bg"></div>
			        		<div className="count_down_icon"></div>
			        		
			        		<div className="count_down_title">Countdown</div>
		        		</div>
		        		
		        	}
		        </div>
			</div>
		)
	}
}

//将state绑定到props
const mapStateToProps = (state) => {
	const devId = (state.device.fromPage === 'list' || state.device.recordAttr.devId === '') ? state.device.deviceItem.devId : state.device.recordAttr.devId;
	console.log("plug DevId = " + devId);
	console.log(state.device.recordAttr);
	return {
		recordAttr: state.device.recordAttr,
		devId: devId,
		deviceItems: state.device.items,
		deviceIds: state.device.list,
		fromPage: state.device.fromPage,
		directDevIds: state.device.directDevIds || [],
	}
};

//将action的所有方法绑定到props上
const mapDispatchToProps = dispatch => ({
	changeBackAction: (...args) => dispatch(changeBackAction(...args)),
	actions: bindActionCreators({
		fetchProductInfo,
		saveDeviceItem,
		setRecordAttr,
	}, dispatch),
	setDeviceMode: (...args) => dispatch(setDeviceMode(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WifiPlugDetail);