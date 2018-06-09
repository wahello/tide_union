import React, { Component } from 'react';
import PullToRefresh from 'antd-mobile/lib/pull-to-refresh';
import 'antd-mobile/lib/pull-to-refresh/style/css';
import ListView from 'antd-mobile/lib/list-view';
import 'antd-mobile/lib/list-view/style/css';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import { bindActionCreators } from 'redux';
import { DeviceCard } from 'lds-rc';
import Toast from 'antd-mobile/lib/toast';
import 'antd-mobile/lib/toast/style/css';
// import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import { fetchRoomDevices, fetchRoomList } from '../action/room';
import { fetchHomeDevices, setDeviceAttr, devUnbindReq, saveDeviceItem, sortOrder } from '../action/device';
import { fetchFamilyList } from '../action/family';
import MQTTService, { TOPIC } from '../jssdk/MQTTService';
import Device from '../jssdk/device';
import { showDialog, devicesUpdatingDone, changeFromPage } from '../action';
import { Lang } from '../public';
import './default/style2.css';
import jsBridge from '../jssdk/JSBridge';
import helper from '../public/helper';
import TCPService from '../jssdk/TCPService';
import DeviceIPCItem from '../ipc/component/ipcItem'

const dialogLang = Lang.public.dialog;
const deviceLang = Lang.device;
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
const cookies = new Cookies();

class DeviceList extends Component {
  constructor(props) {
    super(props);

    this.communicator = jsBridge;
    this.state = {
      isLongPress: false,
      onlyIpc:this.setOnlyIpc(),
      hasSearchedGateway:false,
      dataSource:ds.cloneWithRows(this.props.deviceIds)
    };

    this.device = new Device();
    this.handleDel = this.handleDel.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.setOnlyIpc = this.setOnlyIpc.bind(this);
    this.goToDeviceDetail = this.goToDeviceDetail.bind(this);
    this.handleLongPress = this.handleLongPress.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
   

    this.handleOnOff = this.handleOnOff.bind(this);
    // this.onSortEnd = this.onSortEnd.bind(this);
    this.newIndex = 0;
    this.currentScrollTop = 0;
  }

  setOnlyIpc(props){
    var props = props || this.props
    let  deviceData = props.deviceItems;
    if(props.deviceIds === undefined) return ;
    return  Boolean(props.deviceIds.length &&　props.deviceIds.every(id=>{
      return (deviceData[id] && deviceData[id].devType === "IPC")
    }))
  }
  
  componentDidMount() {
    const {
      mqttStatus,
      currentHomeId,
      actions,
      mqttSubscribed,
      deviceIds,
    } = this.props;

    if (!currentHomeId) {
      this.getFamilyData();
    }
    
    //if(mqttSubscribed) {
      this.fetchList();
    //}
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    const { mqttSubscribed, deviceIds, isFirstIn } = this.props;
    if (nextProps.mqttSubscribed !== mqttSubscribed && nextProps.mqttSubscribed === 1 && isFirstIn) {
      this.fetchList({isFirstIn: false});
    }
    if (nextProps.currentHomeId !== '' && nextProps.currentHomeId !== this.props.currentHomeId) {
      this.fetchList({homeId: nextProps.currentHomeId, isMqttSubscribed: this.props.mqttSubscribed});
    }

    if ((nextProps.delDevNotify !== this.props.delDevNotify && nextProps.delDevNotify.ack.code === 200)) {
      this.fetchList();
    }

    if (nextProps.receivePushMessage) {
      // 删除设备
      if (nextProps.receivePushMessage.method !== null && nextProps.receivePushMessage.method === 'delDevNotif') {
        this.fetchList();
      }
    }
    this.setState({ dataSource:ds.cloneWithRows(nextProps.deviceIds)})
    if(deviceIds.length === 0) {this.setState({onlyIpc:this.setOnlyIpc(nextProps)})}
    if (nextProps.cancelLongPress) {
      this.setState({
        isLongPress: false,
      });
    }
   
  }

  componentDidUpdate() {
    if (this.newIndex > 0) {
      this.scrollTop();
      this.newIndex = 0;
    }
  }

  // onSortEnd({ oldIndex, newIndex }) {
  //   if (oldIndex === newIndex) {
  //     return;
  //   }
  //   const { actions, deviceIds } = this.props;
  //   const reorderIds = arrayMove(deviceIds, oldIndex, newIndex);
  //   this.newIndex = newIndex;
  //   this.currentScrollTop = this.scroll.scrollTop;
  //   actions.sortOrder(reorderIds);
  // }

  getRoomData() {
    // 获取当前家庭房间列表
    const { actions, currentHomeId, familyItems } = this.props;
    actions.fetchRoomList({
      cookieUserId: cookies.get('userId'),
      cookieUserToken: '',
      pageSize: 100,
      offset: 0,
      homeId: currentHomeId,
    }).then(() => {
      if (currentHomeId) {
			if(!familyItems[currentHomeId].isSecurityPwd){
				// this.props.history.push('/family/setPwd');
			}
		}
    });
  }

  getFamilyData() {
    const { actions } = this.props;
    // 获取家庭列表
    actions.fetchFamilyList({
      cookieUserId: cookies.get('userId'),
      cookieUserToken: '',
      pageSize: 100,
      offset: 0,
    }).then(() => {
      this.getRoomData();
    });
  }

  handleAdd() {
    this.props.history.push('/device/add');
  }

  handleLongPress(isLongPress) {
    if (this.props.pageFrom === 'room' && this.props.queryId == 0) {
      return;
    }
    this.setState({ isLongPress });
    this.props.setParentCancelLongPress(isLongPress);
  }

  goToDeviceDetail(devId) {
    if (this.state.isLongPress) {
      return;
    }

    const { deviceItems } = this.props;
    const dataDetail = deviceItems[devId];
    // 离线设备不能控制
    if (!dataDetail.online) {
      return;
    }

    this.props.actions.saveDeviceItem(dataDetail);
    console.log('dataDetail.devType ：', dataDetail.devType);
    switch (dataDetail.devType) {
      case 'Light_RGBW':
      case 'Light_ColourTemperature':
      case 'Light_ColorTemperature':
      case 'Light_Dimmable':
      case 'light':
        this.props.changeFromPage('list');
        this.props.history.push('/device/control');
        break;
      case 'Alarm_Siren':
      case 'Sensor_Doorlock':
      case 'Sensor_PIR':
      case 'Sensor_Motion':
      case 'Keyfob':
      case 'Keypad':
      case 'Siren_Hub':
        this.props.history.push(`/device/edit/${dataDetail.devId}`);
        break;
      case 'Multi_Gateway':
      		this.props.history.push('/device/gatewayDetail');       
        break;
      case 'remote':
        this.props.history.push('/device/remoteDetail');
        break;
      case 'Smartplug_Meter':
      	this.props.changeFromPage('list');
        this.props.history.push('/device/wifiPlugDetail');
        break;
      case 'IPC':
      	if(typeof(dataDetail.p2pId) === 'undefined'){
      		return;
      	}
				let deviceInfo = {
            userId:cookies.get('userId'),
            uid:dataDetail.p2pId,
          //  name:dataDetail.name,
          //  password:dataDetail.password,
            deviceId:dataDetail.devId,
            deviceName:dataDetail.name,
            online:dataDetail.online,
            name:"admin",
            password:"admin123",
          }
          
          jsBridge.send({
            service: 'LiveAndPlayBack',
            action: 'start',
            data: deviceInfo,
          }).then(res => {
      
          });
        this.props.changeFromPage('list');
        this.props.history.push('/ipc');
        break;
      case 'wifi_plug':
     		this.props.changeFromPage('list');
      	this.props.history.push('/device/wifiPlugDetail');
        break;
      default:
        break;
    }
  }

  fetchList(options = {}) {
    let {homeId, isMqttSubscribed, isFirstIn} = options;
    const {
      pageFrom,
      currentHomeId,
      queryId,
      actions,
      mqttSubscribed,
      familyItems,
      // directDevIds,
      // deviceItems
    } = this.props;
    if (!homeId) {
      homeId = currentHomeId;
    }

    if (!isMqttSubscribed) {
      isMqttSubscribed = mqttSubscribed;
    }

    if (pageFrom === 'home') {
      // if (process.env.NODE_ENV !== 'development') {
      //   if (!homeId || !isMqttSubscribed) {
      //     return;
      //   }
      // }
      
      // if (isFirstIn) {
      //   Toast.loading('loading');
      // }
      console.log("=============刷主页列表")
      actions.fetchHomeDevices({
        userId: cookies.get('userId'),
        payload: {
          homeId: queryId || homeId,
          pageSize: 100,
          offset: 0,
        },
        isFirstIn: isFirstIn !== undefined ? isFirstIn : this.props.isFirstIn
      }).then(() => {
        Toast.hide();
        this.setState({onlyIpc:this.setOnlyIpc()})
        this.subscribeDirectDev();

        const {
          directDevIds,
          deviceItems
        } = this.props;

      }).catch((err) => {
        Toast.hide();
      });
    }
    if (pageFrom === 'room') {
      actions.fetchRoomDevices({
        userId: cookies.get('userId'),
        payload: {
          roomId: queryId,
          homeId: homeId,
          pageSize: 100,
          offset: 0,
        }
      }).then(res=>{
        this.setState({onlyIpc:this.setOnlyIpc()})
      })
    }
  }

 
  handleRefresh() {
    const {
      currentHomeId,
      familyItems
    } = this.props;

    if(familyItems[currentHomeId]){
        this.device.startConnect({
          meshName: familyItems[currentHomeId].currentMeshName,
          meshPassword: familyItems[currentHomeId].currentMeshPassword
        });
      }

    this.fetchList();

    
  }

  handleOnOff(devId) {
    const { deviceItems } = this.props;
    const dataDetail = deviceItems[devId];
    console.log('开关之前设备信息2：', dataDetail);
    // this.oInterLongPress && clearTimeout(this.oInterLongPress);
    // this.props.handleLongPress(false);
    if (!dataDetail.online) {
      return;
    }
    const { actions } = this.props;
    const isOnOff = (dataDetail.attr.OnOff === 0 || dataDetail.attr.OnOff === '0') ? 1 : 0;
      console.log('开关请求参数1：', dataDetail);
    if(dataDetail.communicationMode=="BLE"){
			if(dataDetail.attr.OnOff == 1){
					this.device.turnOff({devId:dataDetail.devId});//关
						this.setState({
		        OnOff: 0,
		      });
	    	}else if(dataDetail.attr.OnOff == 0){
	    		this.device.turnOn({devId:dataDetail.devId});//开
	    			this.setState({
		        OnOff: 1,
		      });
	    	}
		}else{
			const options = {
	      parentId: dataDetail.parentId || dataDetail.devId,
	      payload: {
	        devId: dataDetail.devId,
	        attr: {
	          OnOff: isOnOff,
	        },
	      },
	    };
	    console.log('开关请求参数2：', options);
	    actions.setDeviceAttr(options);
		}
  }

  handleDel(devId) {
  	console.log("wcb list delete");
    const { deviceItems } = this.props;
    const dataDetail = deviceItems[devId];
	console.log("wcb handleDel dataDetail:",dataDetail);
    const that = this;
    if (!dataDetail.online) {
      this.props.showDialog(dialogLang.title[0], deviceLang.dialog.tip[0], [{
        text: dialogLang.button[1],
        handleClick: function cancel() {
          this.hide();
        },
      }]);
      return;
    }
    console.log("断开网络删除设备提示用户网络断开");
    this.props.showDialog(dialogLang.title[0], deviceLang.dialog.tip[1], [
      {
        text: dialogLang.button[0],
        handleClick: function cancel() {
          this.hide();
        },
      },
      {
        text: dialogLang.button[1],
        className: 'btn-split',
        handleClick: function onHandle() {
        	this.hide();
        	if(!window.system.networkStatus) {
			      console.log("wcb networkStatus");
			      Toast.info(Lang.user.validator[14], 3, null, false);
			      return;
			    }else{
					const { actions, pageFrom, currentHomeId } = that.props;
		          	if (pageFrom === 'room') {
		            // 删除房间设备
		            if (!dataDetail.parentId) {
		              Toast.info(Lang.device.notFoundGatewayId, 3, null, false);
		              return;
		            }
		            that.device.setDevInfoReq({
		              parentId: dataDetail.parentId,
		              payload: {
		                devId: dataDetail.devId,
		                icon: dataDetail.icon,
		                name: dataDetail.name,
		                userId: cookies.get('userId'),
		                roomId: 0, // currentHomeId,
		                homeId: currentHomeId,
		              },
		            }).then(() => {
		              that.fetchList();
		            });
		            return;
		          }
		          if (pageFrom === 'home') {
		            if (dataDetail.devType === 'Multi_Gateway'||dataDetail.devType === 'Siren_Hub') {
		              // 直连设备解绑
		              that.device.devUnbindReq({
		                payload: {
		                  unbindDevId: dataDetail.devId,
		                  unbindUserId: cookies.get('userId'),
		                  userId: cookies.get('userId'),
		                },
		              }).then((res) => {
		                console.log(res);
		                that.fetchList();
		              });
		            } else {
		              // 删除子设备
                  if (!dataDetail.parentId && dataDetail.communicationMode != "BLE") {
                    Toast.info(Lang.device.notFoundGatewayId, 3, null, false);
                    return;
                  }
                  if(dataDetail.devType === 'remote'&& dataDetail.communicationMode ==="BLE") {
                    console.log("wcb，如果是ble遥控器先将灯全部剔除再删除遥控器");
                    that.device.delDeviceFromeGroupAll({groupId:dataDetail.remoteId});//
                    that.device.delDeviceFromeGroupAllDB({groupId:dataDetail.remoteId});//
                  }
		              that.device.delDevReq({
		                parentId: dataDetail.parentId,
		                payload: {
		                  devId: dataDetail.devId,
		                },
		              }).then((res) => {
		                console.log(res);
		                that.fetchList();
		              });
		            }
		          }
			    }
        },
      },
    ]);
  }

  subscribeDirectDev() {
    const { directDevIds } = this.props;
    let directDevIdTotal = directDevIds.gateway.concat(directDevIds.devices);
    if (directDevIdTotal.length) {
      directDevIdTotal.map((devId) => {
        console.log(`===============订阅主题：lds/v1/cb/${devId}/# =====================`);
        MQTTService.subscribe({
          topic: `${TOPIC.broadcastV1}/${devId}/#`,
        });
      });
    }
  }

  scrollTop() {
    if (!this.scroll) {
      return;
    }
    this.scroll.scrollTop = this.currentScrollTop;
  }

  getStatusDesc(props) {
    console.log("getStatusDesc(props)===========",props)
    let status = props.online ? Lang.device.onLine : Lang.device.offLine;
        
    if(props.online){
      if(props.attr.OnOff != null && Number(props.attr.OnOff)==1){
         status = Lang.device.on;
      }else if(props.attr.OnOff != null && Number(props.attr.OnOff)==0){
        status = Lang.device.off;
      }else{
        status = Lang.device.off;
      }

      switch (props.devType.toLowerCase()) {
        case 'sensor_doorlock': {
          console.log("props.attr.Door===========",props.attr.Door)
          if (props.attr && props.attr.Door && Number(props.attr.Door) == 1) {
            status = Lang.device.statusOpen;
          } else if (props.attr && props.attr.Door && Number(props.attr.Door) == 0) {
            status = Lang.device.statusClose;
          }else{
            status = Lang.device.statusClose;
          }
          break;
        }
        case 'sensor_pir':
        case 'sensor_motion': {
          if (props.attr && props.attr.Occupancy !== undefined &&
            props.attr.Occupancy !== null) {
            if ((props.attr.Occupancy - 0) === 1) {
              status = Lang.device.statusTrigger;
            } else {
              status = Lang.device.statusUntrigger;
            }
          } else {
            status = props.online ? Lang.device.onLine : Lang.device.offLine;
          }
          break;
        }
        case 'multi_gateway': {
          status = props.online ? Lang.device.onLine : Lang.device.offLine;
          break
        }
        case 'siren_hub': {
          status = props.online ? Lang.device.onLine : Lang.device.offLine;
          break
        }
        case 'keypad': {
          status = props.online ? Lang.device.onLine : Lang.device.offLine;
          break
        }
        case 'keyfob': {
          status = props.online ? Lang.device.onLine : Lang.device.offLine;
          break
        }
        case 'camera': {
          status = props.online ? Lang.device.onLine : Lang.device.offLine;
          break
        }
        default:
          break;
      }
      
    }else{
       status = Lang.device.offLine;
    }
    
    return status;
  }


  render() {
    const {
      pageFrom,
      deviceIds,
      unbindDevices,
      deviceItems,
      roomIds,
      rooms,
      isFetching,
      queryId,
      isFirstIn,
      securityStatus,
    } = this.props;
    const { isLongPress } = this.state;
    const clsName = {
      cardIcon: 'devices-icon',
      battery: 'battery',
      switch: 'switch',
      close: 'close',
    };
    console.log("deviceItems===========",deviceItems)

    // const getStatusDesc = (dataDetail) => {
    //   let status = dataDetail.online ? Lang.device.onLine : Lang.device.offLine;
      
    //   if(dataDetail.online){
    // 		console.log("wcb dataDetail:",dataDetail);
    // 		if(dataDetail.attr.OnOff != null && Number(dataDetail.attr.OnOff)==1){
    // 			 status = Lang.device.on;
    // 		}else if(dataDetail.attr.OnOff != null && Number(dataDetail.attr.OnOff)==0){
    // 			status = Lang.device.off;
    // 		}else{
    // 			status = Lang.device.off;
    // 		}
    		
    // 	}else{
    // 		 status = Lang.device.offLine;
    // 	}
      
    //   switch (dataDetail.devType.toLowerCase()) {
    //     case 'sensor_doorlock': {
    //       if (dataDetail.attr && dataDetail.attr.Door && dataDetail.attr.Door - 0) {
    //         status = Lang.device.statusOpen;
    //       } else {
    //         status = Lang.device.statusClose;
    //       }
    //       break;
    //     }
    //     case 'sensor_pir':
    //     case 'sensor_motion': {
    //       if (dataDetail.attr && dataDetail.attr.Occupancy !== undefined &&
    //         dataDetail.attr.Occupancy !== null) {
    //         if ((dataDetail.attr.Occupancy - 0) === 1) {
    //           status = Lang.device.statusTrigger;
    //         } else {
    //           status = Lang.device.statusUntrigger;
    //         }
    //       } else {
    //         status = dataDetail.online ? Lang.device.onLine : Lang.device.offLine;
    //       }
    //       break;
    //     }
    //     case 'multi_gateway': {
    //     	status = dataDetail.online ? Lang.device.onLine : Lang.device.offLine;
    //     	break
    //     }
    //     case 'siren_hub': {
    //     	status = dataDetail.online ? Lang.device.onLine : Lang.device.offLine;
    //     	break
    //     }
    //     case 'keypad':
    //     case 'keyfob':
    //       status = Lang.security.sos;
    //       if(dataDetail.attr.Arm == 1){
    //         status = Lang.security.stay;
    //       }else if(dataDetail.attr.Arm == 2){
    //         status = Lang.security.away;
    //       }else if(dataDetail.attr.Arm == 3){
    //         status = Lang.security.sos;
    //       }

    //       if (securityStatus === 1) {
    //         status = Lang.security.stay;
    //       } else if(securityStatus == 2){
    //         status = Lang.security.away;
    //       } else if(securityStatus == 3){
    //         status = Lang.security.sos;
    //       }
    //       break
    //     default:
    //       break;
    //   }
    //   return status;
    // };

    const hasOnOffSwitch = function isOnOff(device) {
      return device.devType && (device.devType.toLowerCase().indexOf('light') > -1 || device.devType.toLowerCase().indexOf('smartplug') > -1 || device.devType.toLowerCase().indexOf('wifi_plug') > -1);
    };

    const hasLowPower = function isLowPower(device) {
      return device.attr && device.attr.PowerLow !== undefined && (device.attr.PowerLow === true || device.attr.PowerLow === 1 || device.attr.PowerLow === '1');
    };
    // const SortableItem = SortableElement(({ device }) =>
    //   <DeviceCard
    //     devId={device.devId}
    //     devType={device.devType}
    //     name={device.name}
    //     online={device.online}
    //     icon={device.icon}
    //     onGetStatus={this.getStatusDesc}
    //     // statusDesc={getStatusDesc(device)}
    //     securityStatus={securityStatus}
    //     roomId={device.roomId}
    //     roomName={device.roomName}
    //     attr={device.attr}
    //     cls={clsName}
    //     hasOnOffSwitch={hasOnOffSwitch(device)}
    //     hasLowPower={hasLowPower(device)}
    //     isLongPress={this.state.isLongPress}
    //     onOnOff={this.handleOnOff}
    //     onLongPress={this.handleLongPress}
    //     onDelete={this.handleDel}
    //     onTouchEnd={this.goToDeviceDetail}
    //   />);
    // const SortableList = SortableContainer(() => {
    //   return (
    //     <div className="device list">
    //       <div className="scroll-view" ref={(ref) => { this.scroll = ref; }}>
    //         {deviceIds.map((devId, index) => (
    //           <SortableItem key={devId} index={index} device={deviceItems[devId]} />
    //         ))}
    //       </div>
    //     </div>
    //   );
    // });

    const EmptyTip = (() => {
      if (isFirstIn) {
        return null;
      }
      return (
        <div className="empty-tip">
          <PullToRefresh
            distanceToRefresh={window.devicePixelRatio * 35}
              indicator={this.state.down ? {} : { deactivate: Lang.refresh.pull, finish: Lang.refresh.finish,activate: Lang.refresh.activate}}
            refreshing={isFetching}
            onRefresh={this.handleRefresh}
          >
            {pageFrom === 'room' && <p className="empty-text">{Lang.room.NotDevice}</p>}{pageFrom === 'home' && <p className="empty-text">{Lang.home.notDeviceTip}</p>}
          </PullToRefresh>
        </div>
      );
    });

    // if (isLongPress) {
    //   return (
    //     <SortableList
    //       axis="xy"
    //       pressDelay={200}
    //       shouldCancelStart={(e) => {
    //         const disabledElements = ['input', 'textarea', 'select', 'option', 'button', 'a'];
    //         if (disabledElements.indexOf(e.target.tagName.toLowerCase()) !== -1) {
    //           return true; // Return true to cancel sorting
    //         }
    //         return false;
    //       }}
    //       onSortEnd={this.onSortEnd}
    //     />
    //   );
    // }

    const row = (deviceId) => {
      const device = deviceItems[deviceId];
      if (roomIds.length && device.roomId && rooms[device.roomId]) {
        device.roomName = device.roomName || rooms[device.roomId].name;
      }
      return (
        this.state.onlyIpc?<DeviceIPCItem key={'DeviceIPCItem'}  devId={deviceId} history={this.props.history} mqttStatus={this.props.mqttStatus}/>:
        <DeviceCard
          devId={deviceId}
          devType={device.devType}
          name={device.name}
          online={device.online}
          icon={device.icon}
          onGetStatus={this.getStatusDesc}
          // statusDesc={getStatusDesc(device)}
          securityStatus={securityStatus}
          roomId={device.roomId}
          roomName={device.roomName}
          attr={device.attr}
          cls={clsName}
          hasOnOffSwitch={hasOnOffSwitch(device)}
          hasLowPower={hasLowPower(device)}
          isLongPress={this.state.isLongPress}
          onOnOff={this.handleOnOff}
          onLongPress={this.handleLongPress}
          onDelete={this.handleDel}
          onTouchEnd={this.goToDeviceDetail}
        />
      );
    };
    // const dataSource = ds.cloneWithRows(deviceIds);

    return (
      <div className="device list">
        {(isFetching || deviceIds.length) ?
          <ListView
            key="1"
            useBodyScroll={false}
            dataSource={this.state.dataSource}
            renderRow={row}
            pageSize={50}
            pullToRefresh={
              <PullToRefresh
                distanceToRefresh={window.devicePixelRatio * 35}
                 indicator={this.state.down ? {} : { deactivate: Lang.refresh.pull, finish: Lang.refresh.finish,activate: Lang.refresh.activate}}
                refreshing={isFetching}
                onRefresh={this.handleRefresh}
              />}
          />
          :
          <div className="empty-root">
            <EmptyTip />
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    cacheUpdated: state.device.cacheUpdated,
    currentHomeId: state.family.currentId,
    familyItems: state.family.items || null,
    deviceIds: ownProps.pageFrom === 'room' ? state.room.deviceInfo.list : state.device.list,
    deviceItems: state.device.items,
    unbindDevices: state.device.unbindDevices,
    roomIds: state.room.list,
    rooms: state.room.items,
    pageFrom: ownProps.pageFrom,
    queryId: ownProps.queryId,
    mqttStatus: state.system.mqttStatus,
    mqttSubscribed: state.system.mqttSubscribed,
    shouldUpdateList: state.device.shouldUpdateList,
    isFetching: ownProps.pageFrom === 'room' ? state.room.isFetching : state.device.isFetching,
    isFirstIn: state.device.isFirstIn,
    directDevIds: state.device.directDevIds || [],
    delDevNotify: state.device.delDevNotify,
    cancelLongPress: ownProps.cancelLongPress,
    p2pUpdate:state.device.p2pUpdate,
    securityStatus: state.device.securityStatus, // 安防状态
    securityStatus0: state.security.modes.status,// 安防初始状态,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    cacheUpdatingDone: () => {
      dispatch(devicesUpdatingDone());
    },
    showDialog: (title, tip, btns) => {
      dispatch(showDialog(title, tip, btns));
    },
    changeFromPage: (...args) => dispatch(changeFromPage(...args)),
    actions: bindActionCreators({
      fetchFamilyList,
      fetchRoomList,
      fetchRoomDevices,
      fetchHomeDevices,
      setDeviceAttr,
      saveDeviceItem,
      devUnbindReq,
      sortOrder,
    }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceList);
