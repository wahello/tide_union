import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route } from 'react-router-dom';
import { LayoutNavigation } from 'lds-rc';
import { Lang } from './public';
import MQTTService from './jssdk/MQTTService';
import BLEService from './jssdk/BLEService';
import Device from './jssdk/device';
import userApi from './jssdk/User';
import { showDialog } from './action';
import { fetchFamilyList, initFamilyData } from './action/family';
import { fetchRoomList } from './action/room';
import { refreshDevice,onMessageReceive, initDeviceData, shouldUpdateDeviceList, fetchHomeDevices } from './action/device';
import { setMqttStatus, setNetworkStatus, setMqttSubscribed, onReceivePushMessage } from './action/system';
import config from './config';
import { AWAY_MODE, STAY_MODE, fetchModes, initSecurityData } from './action/security';
import { querySQL, executeSQL } from './jssdk/db';
import * as DeviceDAO from './dao/DeviceDAO';
import { onOTAMessageReceive } from './action/ota';
// 引用模块
import ModuleMenu from './menu';
import ModuleHome from './home';
import ModuleScene from './scene';
import ModuleDevice from './device';
import ModuleSecurity from './security';
import ModuleAutomation from './automation';
import ModuleFamily from './family';
import ModuleGateWay from './gateway';
import ModuleSetting from './setting';
import ModuleIpc from './ipc';

// 引用页面
import PageHomeMain from './home/main';
import PageSceneMain from './scene/main';
import PageSecurityMain from './security/PageSecurityMain';
import PageAutomationMain from './automation/main';

import Toast from 'antd-mobile/lib/toast';
import 'antd-mobile/lib/toast/style/css';
// import { Modal } from 'antd-mobile';
// import 'antd-mobile/lib/modal/style/css';
// const alert = Modal.alert;
import SystemApi from './jssdk/system';
import './App.css';

const systemApi = new SystemApi;
const cookies = new Cookies();
const accoutDueDate = 15;
var isExit = false;

class App extends Component {
  constructor(props) {
    super(props);

    if (this.props.location.pathname === "/") {
      this.props.history.replace("/home");
    } else {
      this.props.history.replace(this.props.location.pathname);
    }

    this.device = new Device();
  }

  initFamilyData() {
    // const { familyList } = this.props;
    // if (familyList.length) {
    //   return;
    // }

    const { actions } = this.props;
    //清除设备状态
    this.device.clearAllDeviceStatus();
    // 获取家庭列表
    actions.fetchFamilyList({
      cookieUserId: cookies.get('userId'),
      cookieUserToken: '',
      pageSize: 100,
      offset: 0,
    }).then(() => {
      const { familyList,familyitems,currentHomeId } = this.props;
      if (!familyList.length) {
        // 无家跳转至创建家庭引导页
//       本地版本的就不跳到创建家的位置
        this.props.history.replace('/family/create');
        return;
      }
      console.log('家庭列表：', familyList)

      console.log(familyitems);
      this.device.startConnect({
        meshName:familyitems[currentHomeId || 0].currentMeshName,
        meshPassword:familyitems[currentHomeId || 0].currentMeshPassword
      });

      cookies.set('currentMeshName',familyitems[currentHomeId || 0].currentMeshName);
      cookies.set('currentMeshPassword',familyitems[currentHomeId || 0].currentMeshPassword);

      this.initRoomData();
    });
  }

  initRoomData() {
    // 获取当前家庭房间列表
    const { actions, currentHomeId, familyList } = this.props;
    actions.fetchRoomList({
      cookieUserId: cookies.get('userId'),
      cookieUserToken: '',
      pageSize: 100,
      offset: 0,
      homeId: currentHomeId || familyList[0],
    });
  }


  fetchSecurityModes() {
    this.props.actions.fetchModes({
      cookieUserId: cookies.get("userId"),
      cookieUserToken: cookies.get("accessToken"),
      homeId: this.props.currentHomeId
    });
  }


  connectMQTT() {
    // if (this.props.mqttStatus === 1) {
    //   return;
    // }
    const mqttPassword = cookies.get('mqttPassword');
    const userId = cookies.get('userId');
    const clientId = `app-${userId}`;

    MQTTService.init({
      userName: userId,
      passWord: mqttPassword,
      clientId: clientId,
    }).then((res) => {
      console.log('mqtt inited', res);
      MQTTService.connect({
        mqttIp: config.mqttServer.ip, 
        mqttPort: config.mqttServer.port,
      });
      MQTTService.autoConnect();
    });
  }

  showAlert(message) {
    const { actions } = this.props;
    actions.showDialog('', message, [{
      text: Lang.public.dialog.button[1],
      handleClick: function () {
        this.hide();
      }
    }]);

    // Toast.info(message, 2, null, false);
    // alert('Tip', message, [
    //   { text: 'Ok' },
    // ])
  }

  alertNotify(notifyMessage) {
      if (notifyMessage.ack && notifyMessage.ack.code != 200) {
        return;
      }
      if (!notifyMessage.method) {
        return;
      }
      const payload= notifyMessage.payload;
      if (!payload) {
        return;
      }
      
      const { deviceItems, actions } = this.props;
      
      const devId = payload.devId;
      const device = deviceItems[devId];
      if (!device) return;

      switch(notifyMessage.method) {
        case 'delDevNotif': {
          this.showAlert(`${device.name} was deleted.`);
          actions.shouldUpdateDeviceList();
          break;
        }
        case 'setDevAttrNotif':
        case 'devStautsNotif': {
          if (payload.attr === undefined) return;
          // 低电量提醒
          if (payload.attr.PowerLow && ((payload.attr.PowerLow - 0) === 1)) {
            this.showAlert(`${device.name} low battery, please change.`);
          }
          break;
        }
        default:
          break;
      }
  };

  //订阅mqtt
  subscribeMQTT() {
    const locationId = cookies.get('locationId');
    const clientId = cookies.get('clientId');
    const userId=cookies.get('userId');
    MQTTService.onMqttStatusChange(res => {
      console.log('==============onMqttStatusChange==============', res);

      const { actions } = this.props;
      actions.setMqttStatus(res.status);

      if (res.status == 1) {
        Promise.all([
          MQTTService.subscribe({
            topic: `lds/v1/c/${userId}/#`
          }),
          MQTTService.subscribe({
            topic: `lds/v1/s/${userId}/#`
          })
        ]).then(values => {
          console.log('subscribed', values);
          actions.setMqttSubscribed(1);

          //提前获取安防规则
          this.fetchSecurityModes();
        });
        
      } else {
        actions.setMqttSubscribed(0);
      }

      window.system.mqttStatus = parseInt(res.status);

    });
    
  }

  listenOnMqttMsg(){
    // 监听云端推送的消息
    MQTTService.offMessageReceive().onMessageReceive(res => {
      console.log('=========onMessageReceive==========', res);
      if (res === undefined) {
        return;
      }

      let response = null;

      if (res && typeof(res.message) === 'string') {
        response = JSON.parse(res.message)
      }

      if (res && typeof(res.message) === 'object') {
        response = res.message
      }
      if (response === null ) {
        return;
      }
      // if (res.ack.code != 200) {
      //   return;
      // }

      // 通知弹窗处理
      this.alertNotify(response);
      this.showAlarmPage(response);
      const { actions } = this.props;
      actions.onMessageReceive(response);
      actions.onReceivePushMessage(response);
    });
  }


  showAlarmPage(response){
    if(response.method === 'setDevAttrNotif' && response.payload.attr.WarningMode == 1 && this.props.securityModes) {
      const device = this.props.deviceItems[response.payload.devId];
      if(device && device.devType.toLocaleLowerCase().indexOf('alarm_siren') > -1) {
        console.log()
        const securitySirenId = ( this.props.securityModes[AWAY_MODE] && this.props.securityModes[AWAY_MODE].enable && this.props.securityModes[AWAY_MODE].rule.then[0].id) || (
          this.props.securityModes[STAY_MODE] && this.props.securityModes[STAY_MODE].enable && this.props.securityModes[STAY_MODE].rule.then[0].id );
        if(securitySirenId == device.devId) {
          this.props.history.push(`/security/alarm/${device.devId}`);
        }
      }
    }
    
  }

  listenBLEStatusChange(){
  	let that = this;
    const { currentHomeId, familyList } = this.props;
    const { deviceItems, actions } = this.props;
    let expires = new Date;
    expires.setDate(expires.getDate() + accoutDueDate);
    console.log("------监听BLE状态-----");
    //监听mesh网络连接状态
    BLEService.onConnectStatusChange(res => {
      console.log("监听到BLE连接状态改变："+res.status);
      if(res.status == 0 && cookies.get('currentMeshName')){
      	this.refreshAllDevice();
      	cookies.set('BleStatus', '0', {expires});
        this.device.startConnect({
          meshName: cookies.get('currentMeshName'),
          meshPassword: cookies.get('currentMeshPassword')
        });
      }else{
      	cookies.set('BleStatus', '1', {expires});
      	actions.shouldUpdateDeviceList();
      }
    });

    //监听蓝牙开关状态
    BLEService.onBuletoothStatusChange(res => {
      console.log("监听到蓝牙开关状态改变："+res.status);
      if(res.status == 0){
      		cookies.set('BleStatus', '0', {expires});
        this.showAlert(Lang.public.buleToothCloseNotify);
        this.refreshAllDevice();
      }else{
      		cookies.set('BleStatus', '1', {expires});
      		actions.shouldUpdateDeviceList();
        if(cookies.get('currentMeshName')){
          this.device .startConnect({
            meshName: cookies.get('currentMeshName'),
            meshPassword: cookies.get('currentMeshPassword')
          });
        }
      }
    });

    //设备状态上报监听
    BLEService.onDeviceNofify(res=>{
      console.log("收到设备上报数据：",res);
      let bytesStr = res;
      if(res.data != undefined){
        bytesStr = res.data;
      }
      let bytes = this.getBytesByString(bytesStr);
      let command = bytes[7];

      if(command == 0xdc){
        //解析设备上报的状态数据
        this.fillDeviceStatusData(bytes);
      }else if(command == 0xc1){
        //解析场景数据
        this.fillSceneData(bytes);
      }else if(command == 0xe7){
        //解析闹钟数据
        this.fillTimerData(bytes);
      }

    });


    //设备OTA监听
    BLEService.onDeviceOTAStatusChange(res=>{
      const { actions } = this.props;

      let response = {
        ack:{
          code:200
        },
        method:"updateOtaStautsNotif",
        payload:res
      }

      actions.onOTAMessageReceive(response);
    });

  }

  //byte字符串转byte列表
  getBytesByString(str){
    let list = [];
    for(let index = 0; index < str.length; index += 2){
      if(str.length >= index+2){
        let byte = parseInt(str.substring(index,index+2),16);
        list.push(byte);
      }
    }
    return list;
  }
  

  //解析闹钟数据
  fillTimerData(bytes){
    let devId = bytes[3];
    let sceneId = bytes[18];
    let timerId = bytes[11];

    let timerData = {
      timerId: timerId,
      hour: bytes[15],
      minute: bytes[16],
      timerType: bytes[12] & 0x03,    //闹钟类型：0:关灯定时    1:开灯定时     2:场景定时
      sceneId: bytes[18],
      timerId: bytes[11],
      state: (bytes[12]>>7)&1,   //闹钟使能
      timerCycle: (bytes[12]>>4)&1,  //周期类型 0:指定天   1：week
      cycWeek: bytes[14],          //周期类型为 1 时有效
      cycMonth: bytes[13],         //周期类型为 0 时有效，月
      cycDay: bytes[14]            //周期类型为 0 时有效，日
    };

    let timerCount =  bytes[19]; //该设备情景总数量
    
    if(cookies.get("checkTimerId") == timerId){
      cookies.set("addTimer",'{"devId":'+devId+',"sceneId":'+sceneId+',"timerId":'+timerId+',"status":"success"}');
    }

    if(sceneId == 0){
      cookies.set("delTimer",'{"devId":'+devId+',"sceneId":'+sceneId+',"timerId":'+timerId+',"status":"success"}');
    }

  }

  //解析场景数据
  fillSceneData(bytes){
    let devId = bytes[3];
    let sceneId = bytes[10];

    let sceneData = {
      sceneId:bytes[10], //scene id
      dimming :bytes[11], //亮度
      cct :bytes[12], //色温
      rgb: this.device.parseIntToHex(bytes[13],2)+this.device.parseIntToHex(bytes[14],2)+this.device.parseIntToHex(bytes[15],2),
      cctOrRgb: bytes[16], //CCT or RGB
      unSet: bytes[17]//保留数据，无用
    }; 

    let sceneCount =  bytes[18]; //该设备情景总数量

    if(cookies.get("checkSceneId") == sceneId){
      cookies.set("addScene",'{"devId":'+devId+',"sceneId":'+sceneId+',"status":"success"}');
    }

    if(sceneId == 0){
      cookies.set("delScene",'{"devId":'+devId+',"sceneId":'+sceneId+',"status":"success"}');
    }

  }

  //解析设备上报的状态数据
  fillDeviceStatusData(bytes){
    const { deviceItems,
      deviceList,
      actions, currentHomeId
    } = this.props;

    let newItems = deviceItems;

    //一个包中有两个设备的数据
    let devicesInfo = [
                      [bytes[10],bytes[11],bytes[12],bytes[13]],
                      [bytes[14],bytes[15],bytes[16],bytes[17]]
                     ];

    devicesInfo.forEach(devInfo => {
      if(devInfo[0] != 0){
        this.device.getDeviceWithDevId(devInfo[0],devInfo).then(req=>{
          let res = req.res;
          let devInfo = req.data;
          if(!res.data){
          	return;
          }else if(res.code == 200 && res.data.length >= 1 && res.data[0].dev_address == devInfo[0]){
            console.log("数据库中查询到设备："+res.data[0].dev_s_id);
            let currentOnOff = '0';
            if(devInfo[1] == 0){
              //设备离线
              this.device.changeDeviceStatus({
                deviceStatusTableId:res.data[0].dev_s_id,
                deviceTableId:res.data[0].dev_id,
                onOffStatus:'0',
                onLineStatus:'0'
              });
              currentOnOff = '0';
              if(typeof(newItems[devInfo[0]]) == 'object')newItems[devInfo[0]].online = false;
            }else{
              if(typeof(newItems[devInfo[0]]) == 'object')newItems[devInfo[0]].online = true;
              //亮度为0 关灯状态
              if(devInfo[2] == 0){
                //设备关灯
                this.device.changeDeviceStatus({
                  deviceStatusTableId:res.data[0].dev_s_id,
                  deviceTableId:res.data[0].dev_id,
                  onOffStatus:'0',
                  onLineStatus:'1'
                });
                currentOnOff = '0';
                if(typeof(newItems[devInfo[0]]) == 'object')newItems[devInfo[0]].attr.OnOff = '0';
              }else{
                //设备开灯
                this.device.changeDeviceStatus({
                  deviceStatusTableId:res.data[0].dev_s_id,
                  deviceTableId:res.data[0].dev_id,
                  onOffStatus: '1',
                  onLineStatus: '1'
                });
                currentOnOff = '1';
                if(typeof(newItems[devInfo[0]]) == 'object')newItems[devInfo[0]].attr.OnOff = '1';
                //设备原本是离线状态的话，上限后要设置时间
                if(res.data[0].dev_s_online == 0){
                  this.device.setBulbTime();
                }

                //亮度 bytes[index+2]
                //色温 bytes[index+3]
                let attrList = [];
                //亮度发生改变增加记录
                if(res.data[0].dev_s_bright != devInfo[2].toString()){
                  attrList.push({
                    attrName:'dimming',
                    attrValue:devInfo[2].toString()
                  });
                  if(typeof(newItems[devInfo[0]]) == 'object')newItems[devInfo[0]].attr.Dimming = devInfo[2].toString();
                }

                //色温发生改变增加记录
                if(res.data[0].dev_s_tem != devInfo[3].toString()){
                  //色温小于100有效
                  if(devInfo[3] <= 100){
                    attrList.push({
                      attrName:'cct',
                      attrValue:devInfo[3].toString()
                    });
                    if(typeof(newItems[devInfo[0]]) == 'object')newItems[devInfo[0]].attr.CCT = devInfo[3].toString();
                  }
                }
                //开关状态发生改变增加记录
                if(currentOnOff != res.data[0].dev_s_onoff){
                  attrList.push({
                    attrName:'onoff',
                    attrValue: currentOnOff
                  });
                }

	
                if(attrList.length > 0){
                  this.device.changeDeviceAttr({
                    deviceTableId:res.data[0].dev_id,
                    attrList:attrList
                  });
                }
      
              }
            }
          }
        });
      }
    });

    //存完数据库刷新一下列表
    setTimeout(function(){
      /*actions.fetchHomeDevices({
        userId: cookies.get('userId'),
        payload: {
          homeId: currentHomeId,
          pageSize: 100,
          offset: 0,
        }
      });*/

      actions.refreshDevice({
        deviceInfo:{
          list:deviceList,
          items:newItems
        }
      });
    },200);

   
    
  }
  
  refreshAllDevice(){
  	console.log("wcb,刷新所有设备，refreshAllDevice");
  	const { deviceItems,
      deviceList,
      actions, currentHomeId
    } = this.props;

    let newItems = deviceItems;
		
		for(let item in deviceItems){
			if(typeof(newItems[item]) == 'object'){
				newItems[item].online = false;
				newItems[item].attr.OnOff = '0';
			}
		}
		
		actions.refreshDevice({
	    deviceInfo:{
	      list:deviceList,
	      items:newItems
	    }
	  });
		
		this.device.offLineAllDevice();
  }

  onNetworkStatus() {
    const { actions } = this.props;
    systemApi.onNetworkStatusChange(function(res){
      window.system.networkStatus = res.state;
      actions.setNetworkStatus(res.state);
    });
  }

  componentDidMount() {
    console.log('------componentDidMount()--------');
    const that = this;
    const { 
      initFamilyData,
      initDeviceData,
      initSecurityData,
      showDialog
    } = this.props.actions;
    this.subscribeMQTT();
    this.listenOnMqttMsg();
    this.onNetworkStatus();
    this.initFamilyData();
    this.listenBLEStatusChange();
    // initDataBase('db_lds_smarthome');
     //initTables();

    MQTTService.onForceQuit(() => {
      MQTTService.destroy();
      initFamilyData();
      initSecurityData();
      initDeviceData();
      userApi.clearAuthorityInfo();
      this.props.history.replace('/user/login');
      showDialog("",Lang.user.login.forceToLogout, [
        {
          text: Lang.public.dialog.button[1],
          handleClick: () => {
            this.hide();
          },
        },
      ]);

    });
  }

  componentWillUpdate(){
    console.log('------componentWillUpdate()--------');
    systemApi.offGoBack().onceGoBack(this.quitApp);
  }

   /*
   * 退出APP
   */
  quitApp(){
    console.log('------quitApp()--------');
    console.log('1'+isExit);
    if(!isExit){
      isExit = true;
      console.log('2'+isExit);
      Toast.info(Lang.public.exit, 2, null, false);
      setTimeout(() => {
        isExit = false;
        console.log('setTimeout:'+isExit);
      }, 2000);
    }else{
      console.log('systemApi.quitApp()');
      systemApi.quitApp();
    }
  }

  componentWillUnmount() {
    console.log('------app unmount--------');
    systemApi.offNetworkStatusChange();
    executeSQL('DELETE * FROM tb_lds_cache');
  }

  componentWillReceiveProps(nextProps) {
    // 切换家庭时，重新获取房间列表
    if (nextProps.currentHomeId !== this.props.currentHomeId) {
      this.initRoomData();
    }
  }

  render() {
    const { history, location } = this.props;
    const props = { history, location };
    
    return (
      <React.Fragment>
        <LayoutNavigation {...props} navClass="tab-nav">
          <Route exact path="/home" component={PageHomeMain} title={Lang.mainMenu[0]} iconClass="home" />
          <Route exact path="/scene" component={PageSceneMain} title={Lang.mainMenu[1]} iconClass="scene" />
          <Route exact path="/security" component={PageSecurityMain} title={Lang.mainMenu[2]} iconClass="security" />
          <Route exact path="/automation" component={PageAutomationMain} title={Lang.mainMenu[3]} iconClass="automation" />
        </LayoutNavigation>        
        <ModuleHome {...props} />
        <ModuleSecurity {...props} />
        <ModuleScene {...props} />
        <ModuleAutomation {...props} />
        <ModuleFamily {...props} />
        <ModuleMenu {...props} />
        <ModuleGateWay {...props} />
        <ModuleDevice {...props} />
        <ModuleSetting {...props} />
        <ModuleIpc {...props} />
     </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    familyList: state.family.list || [],
    familyitems: state.family.items || [],
    currentHomeId: state.family.currentId,
    networkStatus: state.system.networkStatus,
    deviceItems: state.device.items,
    mqttStatus: state.system.mqttStatus,
    rooms: state.room.items,
    securityModes: state.security.modes.list,

    deviceList: state.device.list,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators({ 
      showDialog,
      fetchFamilyList, 
      fetchRoomList, 
      setMqttStatus, 
      setMqttSubscribed,
      setNetworkStatus, 
      onMessageReceive,
      onReceivePushMessage,
      fetchModes,
      initFamilyData,
      initDeviceData,
      initSecurityData,
      fetchHomeDevices,
      refreshDevice,
      shouldUpdateDeviceList,
      onOTAMessageReceive
    }, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
