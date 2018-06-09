import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Lang } from './public';
import { Route } from 'react-router-dom';
import LayoutNavigation from './layout/navigation';
import MQTTService, { TOPIC } from './jssdk/MQTTService';
import { initDataBase, initTables } from './jssdk/db';
import 'antd-mobile/lib/notice-bar/style/css';
import uuidv4 from 'uuid/v4';
import userApi from './jssdk/User';
import familyApi from './jssdk/family';
import { showDialog } from './action';
import { fetchFamilyList, initFamilyData, fetchFamilyListFailure } from './action/family';
import { fetchRoomList } from './action/room';
import { onMessageReceive, initDeviceData, shouldUpdateDeviceList } from './action/device';
import { initSecurityData, onSecurityMessageReceive } from './action/security';
import { setMqttStatus, setNetworkStatus, setMqttSubscribed, onReceivePushMessage } from './action/system';
import config from './config';
import { AWAY_MODE, STAY_MODE } from './action/security';
import { onOTAMessageReceive } from './action/ota';
import Http from './jssdk/Http';
import helper from './public/helper';

/** 引用模块 **/
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

/** 引用页面 **/
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
import JSBridge from './jssdk/JSBridge';
import TCPService from './jssdk/TCPService';

const systemApi = new SystemApi;
const cookies = new Cookies();
const accoutDueDate = 15;
var isExit = false;

class App extends Component {
  constructor(props) {
    super(props);
    if (!cookies.get('refreshToken')) {
      this.props.history.replace('/user/login');
      return;
    }

    if (this.props.location.pathname === "/") {
      this.props.history.replace("/home");
    } else {
      this.props.history.replace(this.props.location.pathname);
    }
    
    //所有请求都需要判断accessToken是否过期
    Http.setUp({
      complete: (res) => {
        if(!res || !res.code) {
          return;
        }

        if(Number(res.code) === 21025 || Number(res.code) === 21015) {
          this.logOut();
        }
       
      }
    });
    initDataBase('db_lds_smarthome');
    initTables();
    this.props.actions.setMqttSubscribed(0);
  }

  refreshToken() {
    const newLogin = Number(window.localStorage.getItem('newLogin'));
    const afterRefreshToken = () => {
       this.connectMQTT();
      this.fetchFamilyData();
    };
    //记住账号
    let expires = new Date;
    expires.setDate(expires.getDate() + 15);

    if (!newLogin && !cookies.get('accessToken')) {
        userApi.refreshToken({
          refreshToken: cookies.get('refreshToken'),
        }).then(res => {
          if(res.code != 200) {
            throw res;
          }

          cookies.set('accessToken', res.data.accessToken, {expires});
          cookies.set('refreshToken', res.data.refreshToken, {expires});
          afterRefreshToken();
        }).catch(err => {
          console.log('auto login eror', err);
          cookies.remove('isLogined');
          this.props.history.replace('/user/login');
        });
    } else {
      window.localStorage.setItem('newLogin', 0);
      afterRefreshToken();
    }
  }

  fetchFamilyData() {
    // const { familyList } = this.props;
    // if (familyList.length) {
    //   return;
    // }
    let that = this;
    const { actions } = this.props;
    // 获取家庭列表
    actions.fetchFamilyList({
      cookieUserId: cookies.get('userId'),
      cookieUserToken: '',
      pageSize: 100,
      offset: 0,
    }).then(() => {
      const { familyList,fetchFamilyErr,actions } = this.props;
      if(fetchFamilyErr){      	
      	actions.showDialog('', 'There may be some mistakes when you fetch home, please try again. Thank you.', [{
		      text: Lang.public.dialog.button[1],
		      handleClick: function () {
		        this.hide();
		        actions.fetchFamilyListFailure(null);
		        that.fetchFamilyData();
		      }
		    }]);
		    return;
      }
      if (!familyList.length) {
        // 无家跳转至创建家庭引导页
        this.props.history.replace('/family/create');
		//杀了进程重新进默认给他新建好 myhome
		//this.onSave('MyHome');
        return;
      }
      console.log('家庭列表：', familyList)

      this.initRoomData();
    });
  }
  
  onSave(familyName) {
    const family = {
      icon: 'bg.png',
      // id: '',
      // locationId: '',
      // parentId: '',
      // position: '',
      // sort: 0,
      // tenantId: '',
      name: familyName || 'MyHome',
      // type: 'HOME',
      cookieUserId: cookies.get('userId'),
      cookieUserToken: '',
      defaultSpace: 1 // 是否是默认家
    };
    familyApi.createFamily(family).then((res) => {
      if (res.code != 200) {
        Toast.info(res.desc || 'Create failed', 3, null, false);
        return;
      }
      const { actions } = this.props;
      actions.fetchFamilyList({
        cookieUserId: cookies.get('userId'),
        cookieUserToken: '',
        pageSize: 100,
        offset: 0,
      });

      JSBridge.send({ "service": "DataBase", "action": "executeSQL", "data": { "sql": `INSERT INTO tb_lds_family(userId, name, type, id, icon) VALUES('${family.userId}', '${family.name}','HOME', '${res.data.id}', '${res.data.icon}')` } });
      // 创建6个默认场景
      let homeId = res.data.id;
      const atHomeParameter = {
  					cookieUserId:cookies.get('userId'),
	          name: 'At home',
	          icon: 'at_home',
	          homeId: homeId
	        };
	  	this.sceneApi.addScene(atHomeParameter);
	  	
	  	const goAwayParameter = {
  					cookieUserId:cookies.get('userId'),
	          name: 'Go away',
	          icon: 'go_away',
	          homeId: homeId
	        };
	  	this.sceneApi.addScene(goAwayParameter);
	  	
	  	const goodnightParameter = {
  					cookieUserId:cookies.get('userId'),
	          name: 'Goodnight',
	          icon: 'good_night',
	          homeId: homeId
	        };
	  	this.sceneApi.addScene(goodnightParameter);
	  	
	  	const goodMorningParameter = {
  					cookieUserId:cookies.get('userId'),
	          name: 'GoodMorning',
	          icon: 'good_morning',
	          homeId: homeId
	        };
	  	this.sceneApi.addScene(goodMorningParameter);
	  	
	  	const movieParameter = {
  					cookieUserId:cookies.get('userId'),
	          name: 'Movie',
	          icon: 'watch_movie',
	          homeId: homeId
	        };
	  	this.sceneApi.addScene(movieParameter);
	  	
	  	const readingParameter = {
  					cookieUserId:cookies.get('userId'),
	          name: 'Reading',
	          icon: 'reading_book',
	          homeId: homeId
	        };
	  	this.sceneApi.addScene(readingParameter);
	  	// 创建默认场景结束
      //this.props.history.replace('/home');
      this.props.history.push('/family/setPwd');
    }).catch(function (res) {
      Toast.info(res.desc || Lang.home.saveFail, 3, null, false);
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
      homeId: currentHomeId || familyList[0]
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
    const topic = TOPIC.broadcastV1 + '/'+userId +'/user/disconnect';
    
    
 		const seq = (new Date().getTime() + '').substr(4, 9);
//  message.srcAddr = `0.${cookies.get('userId')}`
		const srcAddr = userId;
		
//  const options = {
//    service: 'MQTT',
//    action: 'public',
//    data: {
//      topic,
//      message
//    }
//  }
   // 初始化时加入mqtt will
    MQTTService.init({
      userName: userId,
      passWord: mqttPassword,
      clientId: clientId,
      topic:topic,
      message:{
      	service: "user",
      	method: 'disconnect',
      	seq:seq,
      	srcAddr:srcAddr,
      	payload:{
      		timestamp: "2018-03-14 17:30:00",
      	}
      }
    }).then((res) => {
      console.log('mqtt inited', res);
      MQTTService.connect({
        mqttIp: config.mqttServer.ip, 
        mqttPort: config.mqttServer.port,
      });
    });
    MQTTService.onAutoConncetFailed(res => {
      // todo 搜索网关后建立tcp连接
      const {directDevIds, deviceItems} = this.props;
      if(!window.tcpToGateway.isConnected && !window.tcpToGateway.isConnecting && directDevIds.gateway) {
        window.tcpToGateway.connectTCP(directDevIds.gateway[0], deviceItems[directDevIds.gateway[0]].password);
      }
    });
    // setTimeout(res => {
    //   const {directDevIds, deviceItems} = this.props;
    //   if(!window.tcpToGateway.isConnected && !window.tcpToGateway.isConnecting && directDevIds.gateway && directDevIds.gateway.length) {
    //     window.tcpToGateway.connectTCP(directDevIds.gateway[0], deviceItems[directDevIds.gateway[0]].password);
    //   }
    // }, 5000);
  }

  showAlert(message) {
    const { actions } = this.props;
    actions.showDialog('', message, [{
      text: Lang.public.dialog.button[1],
      handleClick: function () {
        this.hide();
      }
    }]);

    // Toast.info(message, 3, null, false);
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
        case 'devStatusNotif': {
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
    MQTTService.onMqttStatusChange((res) => {
      console.log('==============onMqttStatusChange==============', res);
      const { actions } = this.props;

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
      if (res.status == 1) {
        MQTTService.subscribe({
            topic: `${TOPIC.clientV1}/${userId}/#`
        }).then(res => {
        	
        	if(Number(res.code) !== 200) {
        		return;
        	}
        	
          actions.setMqttSubscribed(1);
		      	
        });
        
      } else {
        actions.setMqttSubscribed(0);
      }
      
      window.system.mqttStatus = Number(res.status);
      actions.setMqttStatus(window.system.mqttStatus);
  
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
      actions.onOTAMessageReceive(response);
    });
    
    if (!window.mqttStatus) {
      window.tcpToGateway.offMessageReceive().onReceiveMessage(res =>{
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
        const { actions } = this.props;
        actions.onMessageReceive(response);
        this.showAlarmPage(response);

      });
    }
     
  
  }


  showAlarmPage(response){
    console.log('------alarm apge---------', response)
    const { onSecurityMessageReceive } = this.props.actions;
    const { service, method, payload } = response;
    if(service === 'security' && method === 'stateChangedNotif' && payload.state == 0) {
      console.log('-------stateChangedNotif-------------', service, method, payload.state);
      onSecurityMessageReceive(payload.trigger);
      if(this.props.location.pathname === '/security/alarm') {
        return;
      }
      
      this.props.history.push('/security/alarm', { trigger: payload.trigger });
    }
    
  }

  onNetworkStatus() {
    const { actions } = this.props;
    systemApi.onNetworkStatusChange(function(res){
    	console.log('--------------------------network status change---------------------------', res);
      window.system.networkStatus = res.state;
      actions.setNetworkStatus(res.state);
    });
  }

  logOut() {
    const {
      initFamilyData,
      initDeviceData,
      initSecurityData
    } = this.props.actions;

    MQTTService.destroy();
    initFamilyData();
    initSecurityData();
    initDeviceData();
    userApi.clearAuthorityInfo();
    this.props.history.replace('/user/login');
  }

  //接受本地通知
  handleNativePushNotify() {
    console.log('开始监听通知');
    var that = this;
    JSBridge.on('System.pushNotificatoin', function (res) {
      console.log('收到通知' + res.deviceId);

      if (res.deviceId) {
        that.props.history.push(`/device/refresh/${res.deviceId}`);
      }
    })
  }
  //进入首页
  handleComeinHomePage() {
    console.log('进入首页');
    var that = this;
    JSBridge.send({
      service: 'System',
      action: 'comeinHome',
      data: {},
    });
  }
  //首页已销毁
  handleComeoutHomePage() {
    console.log('退出首页');
    var that = this;
    JSBridge.send({
      service: 'System',
      action: 'comeoutHome',
      data: {},
    });
  }
  componentDidMount() {
    console.log('------componentDidMount()--------');
    const that = this;
    const { showDialog } = this.props.actions;
    const tcpToGateway = new TCPService();
    window.tcpToGateway = tcpToGateway;
    this.subscribeMQTT();
    this.listenOnMqttMsg();
    this.onNetworkStatus();
    this.refreshToken();
    this.handleNativePushNotify();//收到通知跳转都活动记录界面
    this.handleComeinHomePage();//初次进入home 通知原生

    MQTTService.onForceQuit(() => {
      showDialog("", Lang.user.login.forceToLogout, [
        {
          text: Lang.public.dialog.button[1],
          handleClick: function clickOk() {
            this.hide();
          },
        },
      ]);
      this.logOut();
    });
  }

  componentDidCatch(error, info) {
    console.log('-----------componentDidCatch-------------', error, info);
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
      Toast.info(Lang.public.exit, 3, null, false);
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
    systemApi.offNetworkStatusChange();
    JSBridge.off('System.pushNotificatoin');

    this.handleComeoutHomePage();
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
    currentHomeId: state.family.currentId,
    networkStatus: state.system.networkStatus,
    deviceItems: state.device.items,
    directDevIds: state.device.directDevIds || {},
    mqttStatus: state.system.mqttStatus,
    rooms: state.room.items,
    securityModes: state.security.modes.list,
    fetchFamilyErr: state.family.err
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
      initFamilyData,
      initDeviceData,
      initSecurityData,
      shouldUpdateDeviceList,
      onOTAMessageReceive,
      fetchFamilyListFailure,
      onSecurityMessageReceive
    }, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
