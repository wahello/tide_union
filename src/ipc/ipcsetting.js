import React, {
	Component
} from 'react';
import './default/style.css';
import { connect } from 'react-redux';
import { Lang } from '../public';
import BarTitle from '../component/barTitle';
import { Route, Link } from 'react-router-dom';
import { Button, WhiteSpace, List, WingBlank } from 'antd-mobile';
import { bindActionCreators } from 'redux';
import {setReboot,setReset} from "../action/ipc";
import 'antd-mobile/dist/antd-mobile.css';
import Switch from '../component/switch';
import jsBridge from '../jssdk/JSBridge';
import ScrollView from '../component/scrollView';
import { showDialog } from '../action';
import { Toast } from 'antd-mobile';
import SystemApi from '../jssdk/system';
import Device from '../jssdk/device';
// import { saveLampValue,saveLanguage, saveVolume, saveMotionValue } from '../action/ipc';
import ipcMqtt from '../jssdk/ipcMqtt';
import Cookies from 'universal-cookie';
import { saveTimezone } from '../action/ipc';
import { getSDRecordConfig,unBindIPCDev } from "../action/ipc";
import { lchmod } from 'fs';

const Item = List.Item;
const Brief = Item.Brief;
const cookies = new Cookies();
let city = [];
const inss = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'];
let cityList = [];
class Ipcsetting extends Component {
	constructor(props) {
		super(props);
		this.state = {
      ipcName:this.props.getCameraName,
			volume:this.getVolume(),
      language:this.getLanguage(),
      Motion:this.getMotion(), 
			angle:this.getAngle(),
			checked:this.props.getLamp,
      roomName:this.props.roomName,
			eventNotifEnabled:this.props.getEvent,
			time_: ''
    }
		this.systemApi = new SystemApi;
		this.device = new Device;
		this.handleClickRestore = this.handleClickRestore.bind(this);
		this.handleClickReboot = this.handleClickReboot.bind(this);
		this.handleClickRemove = this.handleClickRemove.bind(this);
		this.handleClickBack = this.handleClickBack.bind(this); 
		this.setLamp = this.setLamp.bind(this);	
		this.getTime = this.getTime.bind(this);
    this.isOpen = this.isOpen.bind(this);
    this.getLanguage = this.getLanguage.bind(this);
    this.initRoomName = this.initRoomName.bind(this);
    this.getVolume = this.getVolume.bind(this)
    this.getMotion = this.getMotion.bind(this)
    this.getAngle = this.getAngle.bind(this)
	}

	componentDidMount() {
		this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
		this.getTime()
		eval(this.props.havsd)  &&  this.props.actions.getSDRecordConfig({
			devId: this.props.devId,
			userId: cookies.get('userId'),
			password: this.props.password
    })
	}

	handleClickBack(event) {
		this.props.history.goBack();
	}

	handleClickRestore(event) {
    const that = this;
		this.props.showDialog(null, Lang.ipc.setting.dialogrestoreHint, [{
			text: Lang.public.dialog.button[0],
			handleClick: function() { 
				this.hide();
			}
		}, {
			text: Lang.public.dialog.button[5],
			handleClick: function() {
        Toast.loading(Lang.public.loading);
        const options = {
          devId:that.props.devId,
          payload : {
            devId:that.props.devId,
            userId:cookies.get('userId'),
            password:that.props.password,
          }
        };
        ipcMqtt.setReset( options ).then(res =>{
          if(res.ack.code == 200 ){
            Toast.hide();
            Toast.info(Lang.ipc.setting.reset, 2)
            this.hide();
            jsBridge.send({
				      service:'LiveAndPlayBack',
				      action: 'destory',
            }).then(res => {});
            that.props.history.go(-2);
          }
        }).catch(res => {
          Toast.info( Lang.device.dialog.tip[3] );
        })
			}
		}]);
		return;
	}

	handleClickReboot(event) {
    let that = this;
		this.props.showDialog(null, Lang.ipc.setting.dialogrebootHint, [{
			text: Lang.public.dialog.button[0],
			handleClick: function() {
				this.hide();
			}
		}, {
			text: Lang.public.dialog.button[5],
			handleClick: function() {
        let self  = this;
        Toast.loading(Lang.public.loading);
        const options = {
          devId:that.props.devId,
          payload : {
            devId:that.props.devId,
            userId:cookies.get('userId'),
            password:that.props.password,
          }
        };
        console.log('重启设备');
		    ipcMqtt.setReboot( options ).then(res =>{
          if(res.ack.code == 200 ){
            Toast.hide();
            Toast.info(Lang.ipc.setting.reboot, 2)
	        jsBridge.send({
				service:'LiveAndPlayBack',
				action: 'destory',
			}).then(res => {

			});
			that.props.history.go(-2);
            this.hide();
          }
        }).catch(res => {
          Toast.info( Lang.device.dialog.tip[3] );
        })
			}
		}]
		);
		return;
	}

	handleClickRemove(event) {
		var that = this;
		const {devId,deviceItems} = this.props;
		const  message = deviceItems[devId].planId === null ? Lang.ipc.setting.dialogremoveHint : Lang.ipc.setting.dialogremovePlanHint 
		this.props.showDialog(null, message, [{
			text: Lang.public.dialog.button[0],
			handleClick: function() {
				this.hide();
			}
		}, {
			text: Lang.public.dialog.button[5],
			handleClick: function() {
				this.hide();
				var request = {
					userId: cookies.get('userId'),
					payload:{
					 	unbindDevId:devId,
						unbindUserId :cookies.get('userId'),
						userId :cookies.get('userId'),
					}
				}
				Toast.loading("解绑中...",60)
				ipcMqtt.devUnbindReq(request).then(res => {
					if(res.ack.code === 200){
						jsBridge.send({
							service:'LiveAndPlayBack',
							action: 'destory',
						}).then(res => {
							console.log("ipc销毁")
						});
						var newlist =  that.props.deviceIds.filter(item=>{return item !== devId})
						that.props.unBindIPCDev(newlist)
						Toast.info("IPC解绑成功");
						that.props.history.push("/home")
					}
					else{
						console.log("解绑失败",res.ack)
						Toast.info("IPC解绑失败");
					}
				 }).catch((err) => {
					 console.log("解绑失败",err)
					 Toast.info("IPC解绑失败");
				 })
			}
		}]);
		return;
	}


	// ipc指示灯开关
	setLamp(){
		this.setState({
			checked:!this.state.checked
		},() => {
			const { checked } = this.state;
      let isOff = checked ? 1 : 0;
      let getOff = isOff === 1 ? Lang.ipc.setting.tips[3] : Lang.ipc.setting.tips[2];
      Toast.loading(Lang.public.loading);
			this.device.setDevAttrReq({
				parentId:this.props.devId,
				payload:{
          devId:this.props.devId,
          userId: cookies.get('userId'),
          password:this.props.password,
				attr:{
						LedOnOff:isOff
					}
				}
			}).then(res => {
        Toast.hide();
				if (res.ack.code == 200 ) {
					// this.props.actions.saveLampValue( checked )
					Toast.info(Lang.ipc.setting.tips[1] + ' ' + getOff, 2);
					console.log(">>>>>>>>>",this.props.getLamp)
				}
			}).catch(res => {
				Toast.info( Lang.device.dialog.tip[3], 2 );
			});
		})
	}

	// 获取时区
	getTime(){
		// debugger;
    let isTimeZone = this.props.tz;
    let tz_ = ''
		if( isTimeZone ==  ''){
      Toast.loading(Lang.public.loading);
      const options = {
        parentId: this.props.devId,
				payload: {
					devId: this.props.devId,
          userId: cookies.get('userId'),
          password:this.props.password,
				}
      }
			ipcMqtt.getDevTimezoneReq( options ).then(res =>{
        if(res.ack.code === 200 ){
          const _item = Lang.ipc.timeZone.cityName;
          city = inss.filter(item => _item[item]);
          let cityKey = []
          city.map((item,index) =>{
            for(var i=0;i<_item[item].key.length;i++){
              cityKey.push(_item[item].key[i])
            } 
          })
          let cityVal = []
          city.map((item,index) =>{
            for(var i=0;i<_item[item].val.length;i++){
              cityVal.push(_item[item].val[i])
            } 
          })
          // console.log('^^^^^^^^^^^^^^^^^^^^^^^ cityName ^^^^^^^^^^^^^^^^^^^^^^^^^^^');
          // console.log(cityKey)
          // console.log('^^^^^^^^^^^^^^^^^^^^^^^ cityVal ^^^^^^^^^^^^^^^^^^^^^^^^^^^');
          // console.log(cityVal)
          console.log("vvvvvvvvvvvvvvvvvvv")
          tz_ = res.payload.devTimezone;
          console.log(tz_);
          let get_a = ''
          cityVal.map((item,index) =>{
            if(item == tz_){
              get_a = index
            }
          })
          console.log("对应下标",get_a)
          const get_val = cityKey[get_a]
          console.log("对应中文",get_val)
          this.setState({
            time_:get_val
          })
          Toast.hide();
          this.props.actions.saveTimezone( get_val );
        }
			}).catch(res => {
				Toast.info(Lang.ipc.setting.tips[0], 2);
			})
		}else{
			this.setState({
        time_:isTimeZone
      })
    }
	}

	// 报警推送开关
	isOpen(){
		this.setState({
			eventNotifEnabled:!this.state.eventNotifEnabled
		},() => {
      const { eventNotifEnabled } = this.state;
      Toast.loading(Lang.public.loading);
      ipcMqtt.setEventNotif({
        devId: cookies.get('userId'),
				payload: {
					devId: this.props.devId,
					userId: cookies.get('userId'),
          password:this.props.password,
          eventNotifEnabled:eventNotifEnabled
				}
			}).then(res =>{
				console.log(res.ack.code);
				Toast.hide();
				let msg = this.state.eventNotifEnabled ? Lang.ipc.setting.tips[3] : Lang.ipc.setting.tips[2];
				Toast.info(Lang.ipc.setting.tips[4] + ' ' + msg,2);
			}).catch(res => {
				Toast.info(Lang.device.dialog.tip[3]);
			})
		})
	} 

  getLanguage(){
    const getLan = Lang.ipc.deviceLanguage;
    let getLang = this.props.getLangugae == 0 ||  this.props.getLangugae == undefined ? getLan.language[0] : getLan.language[1];
    return getLang
  }

  getVolume(){
    let currVol = this.props.getVolumeVaule
    let text = Lang.ipc.deviceVolume;
    let showText = ''
    if(currVol == undefined || currVol == 0){
      showText = text.type[0]
    } else if(currVol == 2){
      showText = text.type[2]
    }else if(currVol == 1){
      showText = text.type[1]
    }else if(currVol == 3){
      showText = text.type[3]
    }else{
      showText = text.type[4]
    }
    return showText
  }

  initRoomName() {
    let room_N = this.props.newRoomName;
    return room_N === "" ? this.props.roomName : room_N;
  }

  getMotion(){
    let motion_ = this.props.getMotion;
    let motionText = Lang.ipc.detectionSensitivity;
    let showMotion = '';
    if(motion_ == 0 || motion_ == undefined){
      showMotion = motionText.value[2]
    }else if(motion_ == 1){
      showMotion = motionText.value[1]
    }else{
      showMotion = motionText.value[0]
    }
    return showMotion
  }

  getAngle(){
    let angle_ = Lang.ipc.pictureRotation;
    let currAngle = this.props.get_angle;
    let renAngle = '';
    if( currAngle == '0' || currAngle == undefined ){
      renAngle = angle_.rotation[0];
    }else if( currAngle == '90' || currAngle == '90°'){
      renAngle = angle_.rotation[1]
    } else if( currAngle == '180' || currAngle == '180°'){
      renAngle = angle_.rotation[2]
    }else{
      renAngle = angle_.rotation[3]
    }
    return renAngle
  }
  
	render() {
		return(
			<div className="ipcsetting">
		    <BarTitle   title={Lang.ipc.setting.title}  onBack={this.handleClickBack} />
				<div className="content" >
					<ScrollView>
						<List className="my-list">
							<Item style={{padding:"0 0 0 15px"}}
								arrow="horizontal" onClick={() => {this.props.history.push("/ipc/setName")}}
							>
								<span style={{float:"left"}}>{Lang.ipc.setting.camerName}</span>
								<span className="get_ipc_name">{this.state.ipcName}</span>
							</Item>
							<Item extra={this.state.roomName}  arrow="horizontal" onClick={() => {this.props.history.push("/ipc/ipcSelectRoom")}}>{Lang.ipc.setting.locationName }</Item>
							<Item arrow="horizontal" onClick={() => {this.props.history.push("/ipc/ipcinfo")}}>{Lang.ipc.setting.deviceInformation} </Item>
							<Item arrow="horizontal" onClick={() => {this.props.history.push("/ipc/ipcupdate")}}>{Lang.ipc.setting.firmwareUpdate} </Item>  
						</List>
						<WhiteSpace size="lg" />				
						<List className="my-list">
							<Item arrow="horizontal" onClick={() => {this.props.history.push("/ipc/ipcmanage")}}>{Lang.ipc.setting.videoManagement} </Item> 
						</List>			
						<WhiteSpace size="lg" />			
						<List className="my-list">
							<Item arrow="horizontal" onClick={() => {this.props.history.push("/ipc/settingvolume")}}>{Lang.ipc.setting.volume}
								<span className="get_ipc_name">{this.state.volume}</span>
							</Item>  
							<Item arrow="horizontal" onClick={() => {this.props.history.push("/ipc/settinglanguage")}}>{Lang.ipc.setting.language}
								<span className="get_ipc_name">{ this.state.language }</span>
							</Item>
							<Item arrow="horizontal" onClick={() => {this.props.history.push("/ipc/settingselectcity")}}>{Lang.ipc.setting.timeZone}
								<span className="get_ipc_name">{ this.state.time_ }</span>
							</Item>  
						</List>			  
						<WhiteSpace size="lg" />			
						<List className="my-list">
							<Item extra={this.state.angle}   arrow="horizontal" onClick={() => {this.props.history.push("/ipc/settingangle")}}>{Lang.ipc.setting.screenRotation}</Item>  
							<Item extra={ this.state.Motion }   arrow="horizontal" onClick={() => {this.props.history.push("/ipc/settingmotion")}}>{Lang.ipc.setting.detection} </Item>
							<Item extra={<Switch onClick={ this.isOpen } checked={ this.state.eventNotifEnabled }/>}  onClick={() => {}}>{Lang.ipc.setting.alarmNotice} </Item>
							<Item extra={<Switch onClick={ this.setLamp } checked={ this.state.checked }/>}>{Lang.ipc.setting.stateLamp} </Item>
							<Item arrow="horizontal" onClick={() => {this.props.history.push("../device/refresh")}}>{Lang.ipc.setting.activityRecord} </Item>
						</List>			
						<WhiteSpace size="lg" />				
						<List className="my-list">
							{
								eval(this.props.havsd) ? <Item extra={Lang.ipc.setting.memoryCardExtra}  arrow="horizontal" onClick={() => {this.props.history.push("/ipc/settingmemory")}}>{Lang.ipc.setting.memoryCard}</Item>  
								:<Item extra={Lang.ipc.setting.noMemoryCard}  arrow="horizontal" onClick={() => {Toast.info(Lang.ipc.setting.noMemoryCard);console.log(this.props.SDRecordConfig)}}>{Lang.ipc.setting.memoryCard}</Item>
							}
							<Item onClick={this.handleClickRestore}>{Lang.ipc.setting.restoreFactory} </Item>
						</List>
						<WhiteSpace size="lg" />		
							<Button onClick={this.handleClickReboot} >{Lang.ipc.setting.rebootDevice} </Button><WhiteSpace />
							<WhiteSpace size="lg" />		
							<Button type="warning" onClick={this.handleClickRemove}>{Lang.ipc.setting.removeDevice} </Button><WhiteSpace />
						<WhiteSpace size="lg" /><WhiteSpace size="lg" />		
					</ScrollView>	
				</div>
			</div>
		);
	}
}
//将state绑定到props
const mapStateToProps = (state) => {
  console.log('gogogogogog+++++++++++++++')
  console.log(state)
  // const devId = '896a7cb56c3e41dcac48a0f457783314'
  const devId = (state.device.fromPage === 'list' || state.device.recordAttr.devId === '') ? state.device.deviceItem.devId : state.device.recordAttr.devId;
  const attr_ = state.device.items[devId].attr;
  const items_ = state.device.items[devId];
	return {
		parentId:devId,
		devId:devId,
		deviceIds: state.device.list,
    getVolumeVaule:attr_.SoundLevel,
    getCameraName:items_.name,
    getLangugae:attr_.Language,
		get_angle: attr_.VideoAngle,
		getMotion:attr_.MotionDetection,
		getLamp:attr_.LedOnOff,
		tz:state.ipc.getTimezone,
    roomName:items_.roomName,
    getEvent:state.ipc.getEvent,
		password:items_.password,
		havsd:state.ipc.havsd,
		SDRecordConfig: state.ipc.SDRecordConfig,
		deviceItems:state.device.items
	}
};
const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
      saveTimezone,
			setReboot,
			setReset,
			getSDRecordConfig
		}, dispatch),
		showDialog: (...args) => dispatch(showDialog(...args)),
		unBindIPCDev :  (...args) => dispatch(unBindIPCDev(...args)),
	}
};
export default connect(mapStateToProps, mapDispatchToProps)(Ipcsetting)