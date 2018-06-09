import Cookies from 'universal-cookie'
import JSBridge from '../JSBridge'
import MQTTService from '../MQTTService'
import UDPService from '../UDPService'
import http from '../Http'
import config from '../../config'
import BLEService from '../BLEService'
import * as db from '../db';
import uuidv4 from 'uuid/v4';
import BLEAddDevice from '../../device/BLEAddDevice';
import sliderBrightness from '../../component/sliderBrightness';

// 'http://172.16.55.119:8090/space'
const homeURL = `${config.httpServer}`;

const cookies = new Cookies();
const DEVICE_SERVICE = 'devManage';
const IPC_SERVICE = 'IPC';
const TB_DEVICE = 'device';
const DEVICE_STATUS = 'device_status';
const DEVICE_ATTR = 'device_state';
const GROUP_DEVICE = "group1_device";
let instance = null;

export default class Device {
  constructor () {
    if (instance) {
      return instance
    }

    this.jsBridge = JSBridge
    this.mqttService = MQTTService
    this.udpService = UDPService
    this.BLEService = BLEService;
    instance = this
  }

	/**
	 * 4.1	上线消息
	 * @param {String} options.devId 设备ID
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  devConnect (options) {
    return this.mqttService.sendData({
      service: DEVICE_SERVICE,
      method: 'connect',
      topic: `lds/v1/cb/${options.devId || options.userId}/devManage/connect`,
      payload: options.payload || {}
    })
  }

	/**
	 * 4.2	下线消息
	 * @param {String} options.devId 设备ID
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  devDisconnect (options) {
    return this.mqttService.sendData({
      service: DEVICE_SERVICE,
      method: 'disconnect',
      topic: `lds/v1/cb/${options.devId || options.userId}/devManage/disconnect`,
      payload: options.payload || {}
    })
  }

	/**
	 * 4.3	设备发现请求
	 * @param {String} options.ip 发送地址
	 * @param {string} options.port 发送端口
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  devDiscoveryReq (options) {
    return this.udpService.sendData(options.ip, options.port, {
      service: DEVICE_SERVICE,
      method: 'devDiscoveryReq',
      payload: options.payload || {}
    }, 5000, 10)
  }

	/**
	 * 4.5	设置绑定信息请求
	 * @param {String} options.ip 发送地址
	 * @param {string} options.port 发送端口
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  setBindInfoReq (options) {
    return this.udpService.sendData(options.ip, options.port, {
      service: DEVICE_SERVICE,
      method: 'setBindInfoReq',
      payload: options.payload || {}
    })
  }

	/**
	 * 4.7	WIFI列表请求
	 * @param {String} options.ip 发送地址
	 * @param {string} options.port 发送端口
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  wifiListReq (options) {
    return this.udpService.sendData(options.ip, options.port, {
      service: DEVICE_SERVICE,
      method: 'wifiListReq',
      payload: options.payload || {}
    })
  }

	/**
	 * 4.9	设置WIFI请求
	 * @param {String} options.ip 发送地址
	 * @param {string} options.port 发送端口
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  setWifiReq (options) {
    const req = options.payload || {}
    if (!req.ssid) {
      console.error('payload.ssid is required.')
    }
    if (!req.password) {
      console.error('payload.password is required.')
    }
    if (!req.secret) {
      console.error('payload.secret is required.')
    }

    return this.udpService.sendData(options.ip, options.port, {
      service: DEVICE_SERVICE,
      method: 'setWifiReq',
      payload: req
    })
  }

	/**
	 * 4.11	设备绑定请求
	 * @param {String} options.devId 设备ID
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  devBindReq (options) {
    const req = options.payload || {}
    if (!options.devId) {
      console.error('devId is required.')
    }
    if (!req.userId) {
      console.error('payload.userId is required.')
    }

    return this.mqttService.sendData({
      service: DEVICE_SERVICE,
      method: 'devBindReq',
      srcAddr: cookies.get('userId'),
      topic: `lds/v1/s/${options.devId}/devManage/devBindReq`,
      payload: req
    })
  }

	/**
	 * 4.13	设备绑定通知
	 * @param {String} options.devId 设备ID
	 * @param {String} options.userId 设备ID
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  devBindNotif (options) {
    const req = options.payload || {}
    if (!req.userType) {
      console.error('payload.userType is required.')
    }
    if (!req.devId) {
      console.error('payload.devId is required.')
    }
    if (!req.password) {
      console.error('payload.password is required.')
    }

    return this.mqttService.sendData({
      service: DEVICE_SERVICE,
      method: 'devBindNotif',
      topic: `lds/v1/c/${req.devId}/devManage/devBindNotif`,
      payload: req
    })
  }

	/**
	 * 4.14	设备解绑通知
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  devUnbindNotif (options) {
    const req = options.payload || {}
    if (!req.userId) {
      console.error('payload.userId is required.')
    }
    if (!req.devId) {
      console.error('payload.devId is required.')
    }

    return this.mqttService.sendData({
      service: IPC_SERVICE,
			// method: 'devUnbindNotif',
      topic: `lds/v1/c/${req.devId}/devManage/devUnbindNotif`,
      payload: req
    })
  }

	/**
	 * 4.15	设备解绑请求
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  devUnbindReq (options) {
    const req = options.payload || {}
    if (!req.userId) {
      console.error('payload.userId is required.')
    }
    if (!req.unbindDevId) {
      console.error('payload.unbindDevId is required.')
    }
    if (!req.unbindUserId) {
      console.error('payload.unbindUserId is required.')
    }

    return this.mqttService.sendData({
      service: DEVICE_SERVICE,
      method: 'devUnbindReq',
      topic: `lds/v1/s/${req.userId}/devManage/devUnbindReq`,
      payload: req
    })
  }

	/**
	 * 4.17	设备解绑确认
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  devUnbindConfirm (options) {
    const req = options.payload || {}
    if (!req.userId) {
      console.error('payload.userId is required.')
    }
    if (!req.devId) {
      console.error('payload.devId is required.')
    }

    return this.mqttService.sendData({
      service: IPC_SERVICE,
      method: 'devUnbindConfirm',
      topic: `lds/v1/s/${req.devId}/devManage/devUnbindConfirm`,
      payload: req
    })
  }

	/**
	 * 4.18	上报设备基本信息
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  updateDevBaseInfo (options) {
    const req = options.payload || {}
    if (!req.devId) {
      console.error('payload.devId is required.')
    }
    if (!req.resetRandom) {
      console.error('payload.resetRandom is required.')
    }
    if (!req.productId) {
      console.error('payload.productId is required.')
    }
    if (!req.version) {
      console.error('payload.version is required.')
    }

    return this.mqttService.sendData({
      service: DEVICE_SERVICE,
      method: 'updateDevBaseInfo',
      topic: `lds/v1/s/${req.devId}/devManage/updateDevBasics`,
      payload: req
    })
  }

	/**
	 * 4.19	同步设备基本配置
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  synDevBaseConfigure (options) {
    const req = options.payload || {}
    if (!req.devId) {
      console.error('payload.devId is required.')
    }
    if (!req.resetRandom) {
      console.error('payload.resetRandom is required.')
    }
    if (!req.userType) {
      console.error('payload.userType is required.')
    }
    if (!req.userId) {
      console.error('payload.userId is required.')
    }
    if (!req.password) {
      console.error('payload.password is required.')
    }

    return this.mqttService.sendData({
      service: DEVICE_SERVICE,
      method: 'synDevBaseConfigure',
      topic: `lds/v1/c/${req.devId}/devManage/synDevBasicConfig`,
      payload: req
    })
  }

	/**
	 * 4.20	上报设备详细信息
	 * @param {String} options.userId 消息体
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  updateDevDetails (options) {
    const req = options.payload || {}
    if (!req.devId) {
      console.error('payload.devId is required.')
    }
    if (!req.productId) {
      console.error('payload.productId is required.')
    }
    if (!req.version) {
      console.error('payload.version is required.')
    }

    return this.mqttService.sendData({
      service: DEVICE_SERVICE,
      method: 'updateDevBaseInfo',
      topic: `lds/v1/s/${req.devId}/devManage/updateDevDetails`,
      payload: req
    })
  }

	/**
	 * 4.21	同步设备详细配置
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  synDevDetails (options) {
		// TODO 协议未给
  }



	/**
	 * 4.24	获取房间设备列表请求
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  getRoomDevListReq (options) {
    const req = options.payload || {}
    return this.mqttService.sendData({
      service: DEVICE_SERVICE,
      method: 'getRoomDevListReq',
      topic: `lds/v1/s/${options.userId}/devManage/getRoomDevListReq`,
      payload: req
    })
  }

	/**
	 * 4.26	获取设备信息请求（房间 ，名字，图片）
	 * @param {Object} options.parentId 设备parentId 即网关ID
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  getDevInfoReq (options) {
    const req = options.payload || {}
    if (!req.devId) {
      console.error('payload.devId is required.')
    }
    if (!options.parentId) {
      console.error('options.parentId is required.')
    }
    return this.mqttService.sendData({
      service: DEVICE_SERVICE,
      method: 'getDevInfoReq',
      topic: `lds/v1/s/${options.parentId}/devManage/getDevInfoReq`,
      payload: req
    })
  }

	/**
	 * 4.29	设置设备信息通知（房间 ，名字，图片）
	 * @param {Object} options.parentId 设备父ID
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  setDevInfoNotif (options) {
    const req = options.payload || {}
    if (!options.parentId) {
      console.error('parentId is required.')
    }
    if (!req.devId) {
      console.error('payload.devId is required.')
    }
    if (!req.userId) {
      console.error('payload.userId is required.')
    }
    return this.mqttService.sendData({
      service: DEVICE_SERVICE,
      method: 'setDevInfoNotif',
      topic: `lds/v1/s/${options.parentId}/devManage/setDevInfoNotif`,
      payload: req
    })
  }

	/**
	 * 4.31	添加子设备请求
	 * @param {Object} options.devId 设备ID
	 * @param {Object} options.userId 用户ID
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  addDevReq (options) {
    const req = options.payload || {}
    if (!options.devId) {
      console.error('devId is required.')
    }

    if (!req.networkType) {
      console.error('payload.networkType is required.')
    }
    return this.mqttService.sendData({
      service: DEVICE_SERVICE,
      method: 'addDevReq',
      topic: `lds/v1/c/${options.devId}/devManage/addDevReq`,
      payload: req
    })
  }

	/**
	 * 4.34	停止添加子设备请求
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  stopDevReq (options) {
    const req = options.payload || {}
    return this.mqttService.sendData({
      service: DEVICE_SERVICE,
      method: 'stopDevReq',
      topic: `lds/v1/c/${options.parentId}/devManage/stopDevReq`,
      payload: req
    })
  }
	/**
	 * 4.33	添加子设备通知
	 * @param {Object} options.userId 用户ID
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  addDevNotif (options) {
    const req = options.payload || {}
    if (!req.devId) {
      console.error('payload.devId is required.')
    }
    if (!req.productId) {
      console.error('payload.productId is required.')
    }
    return this.mqttService.sendData({
      service: DEVICE_SERVICE,
      method: 'addDevNotif',
      topic: `lds/v1/cb/${req.devId}/devManage/addDevNotif`,
      payload: req
    })
  }

	

	/**
	 * 4.36	删除子设备通知
	 * @param {Object} options.userId 用户ID
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  delDevNotif (options) {
    const req = options.payload || {}
    if (!req.devId) {
      console.error('payload.devId is required.')
    }
    return this.mqttService.sendData({
      service: DEVICE_SERVICE,
      method: 'delDevNotif',
      topic: `lds/v1/cb/${req.devId}/devManage/delDevNotif`,
      payload: req
    })
  }

	/**
	 * 4.37	获取设备属性请求
	 * @param {Object} options.userId 用户ID
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  getDevAttrReq (options) {
    const req = options.payload || {}
    if (!req.devId) {
      console.error('payload.devId is required.')
    }
    return this.mqttService.sendData({
      service: DEVICE_SERVICE,
      method: 'getDevAttrReq',
      topic: `lds/v1/c/${options.parentId}/devManage/getDevAttrReq`,
      payload: req
    })
  }

	/**
	 * 4.39	设置设备属性请求
	 * @param {Object} options.parentId 直连设备的ID，即网关id
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  setDevAttrReq (options) {
    const req = options.payload || {}
    if (!options.parentId) {
      console.error('options.parentId is required.')
    }
    if (!req.devId) {
      console.error('payload.devId is required.')
    }
    return this.mqttService.sendData({
      service: DEVICE_SERVICE,
      method: 'setDevAttrReq',
      topic: `lds/v1/c/${options.parentId}/devManage/setDevAttrReq`,
      payload: req
    })
  }

	/**
	 * 4.41	设置设备属性通知
	 * @param {Object} options.userId 用户ID
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  setDevAttrNotif (options) {
    const req = options.payload || {}
    if (!req.devId) {
      console.error('payload.devId is required.')
    }
    return this.mqttService.sendData({
      service: DEVICE_SERVICE,
      method: 'setDevAttrNotif',
      topic: `lds/v1/cb/${req.devId}/devManage/setDevAttrNotif`,
      payload: req
    })
  }

	/**
	 * 4.42	获取产品列表
	 * @param {Object} options.userId 用户ID
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  getProductList (options) {
    const req = options.payload || {}
    if (!req.devId) {
      console.error('payload.devId is required.')
    }
    return this.mqttService.sendData({
      service: DEVICE_SERVICE,
      method: 'getProductList',
      topic: `lds/v1/cb/${req.devId}/devManage/getProductList`,
      payload: req
    })
  }

	/**
	 *  10.1 获取全部设备记录
	 * @param {*} data
	 */
  getAllDevActivity (data) {
    return http.post({
      url: `${homeURL}/activityController/getAllDevActivity`,
      data
    })
  }

	/**
	 *  10.2 删除全部设备记录
	 * @param {*} data
	 */
  delAllDevActivity (data) {
    return http.post({
      url: `${homeURL}/activityController/delAllDevActivity`,
      data
    })
  }

	/**
	 *  10.3 获取单个设备记录
	 * @param {*} data
	 */
  getDevActivity (data) {
    return http.post({
      url: `${homeURL}/activityController/getDevActivityById`,
      data
    })
  }

	/**
	 *  10.4 删除单个设备记录
	 * @param {*} data
	 */
  delDevActivity (data) {
    return http.post({
      url: `${homeURL}/activityController/delDevActivity`,
      data
    })
  }

  /**
   * 获取蓝牙设备最新固件版本
   * 
   */
  getBLEDevicelastVersion(data){
    /*return http.post({
      url: `${homeURL}/`,
      data
    });*/
    const fakePromise = {
      resolve: function () {},
      reject: function () {},
      then: function (cb) {
        this.resolve = cb
        return this
      },
      catch: function (cb) {
        this.reject = cb
        return this
      }
    }

    fakePromise.resolve({code:200,payload:{version:'V2.2'}});

    return fakePromise;
  }


/************************************ 本地数据操作(重写原本 MQTT 接口) ******************************************* */
/**
	 * 4.34	删除子设备请求
	 * @param {String} options.userId 用户ID
	 * @param {String} options.parentId 父设备ID即网关ID
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  delDevReq (options) {
    const fakePromise = {
      resolve: function () {},
      reject: function () {},
      then: function (cb) {
        this.resolve = cb
        return this
      },
      catch: function (cb) {
        this.reject = cb
        return this
      }
    }

    const payload = options.payload || {}
    if (!payload.devId) {
      console.error('payload.devId is required.')
    }

    this.getDeviceWithDevId(payload.devId,[]).then(req=>{
      let res = req.res;
      if(res.code == 200){
        if(res.data[0].dev_communication_mode == "BLE"){

          this.kickout({devId:payload.devId});

          db.deleteData("ifttt_actuator","device_id=?",[payload.devId]);
          db.deleteData(TB_DEVICE,"address=?",[payload.devId]).then(res=>{
            fakePromise.resolve({ack:{code:res.code,desc:""}});
          });

        }else{
          db.deleteData("ifttt_actuator","device_id=?",[payload.devId]);
          db.deleteData(TB_DEVICE,"address=?",[payload.devId]).then(res=>{
            fakePromise.resolve({ack:{code:res.code,desc:""}});
          });
        }
      }
    });
    return fakePromise
  }


/**
	 * 4.28	设置设备信息请求（房间 ，名字，图片）
	 * @param {Object} options.devId 设备ID
	 * @param {Object} options.userId 用户ID
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  setDevInfoReq (options) {
    const req = options.payload || {}
    if (!req.devId) {
      console.error('payload.devId is required.')
    }

    if(req.roomId){
      db.querySQL(`SELECT id FROM space_device WHERE device_id=${req.devId}`).then(res=>{
        if(res.code == 200){
          if(res.data.length > 0 && res.data.device_id == req.devId){

            db.update(
              "space_device",
              {
                space_id: req.roomId,
                last_update_date: this.getNowFormatDate()
              },
              'device_id=?',
              [req.devId],
            );

          }else{

            db.insert("space_device",{
              create_time: this.getNowFormatDate(),
              last_update_date: this.getNowFormatDate(),
              device_id: req.devId,
              space_id: req.roomId
            });

          }
        }
      })
    }

    return db.update(
      TB_DEVICE,
      {
        name: req.name,
				icon: req.icon
      },
      'address=?',
      [req.devId],
    ).then(res=>{
      return {ack:{code:res.code,desc:""}};
    });



  }


	getGroupDevList(options){
		const req = options.payload || {};
		return db.querySQL(`SELECT * FROM ${GROUP_DEVICE} where group_id=${options.groupId}`).then((res) => {
      if (res.code === 200) {
        const { code, data } = res;
//      let newResulst = {
				return{
          ack:{
            code:code
          },
          payload:{
            data
          }
        };
      }
				
      return res;
    });
	}
  /**
	 * 4.22	获取设备列表请求
	 * @param {Object} options.payload 消息体 options.userId   options.payload.homeId   options.payload.pageSize   options.payload.offset 
	 * @return {Promise}
	 */
  getDevListReq (options) {
  	let BleStatus = cookies.get("BleStatus");
  	console.log("wcb BleStatus : ",BleStatus);
    const req = options.payload || {}
    if (!req.pageSize) {
      console.error('payload.pageSize is required.')
    }
    if (req.offset == undefined) {
      console.error('payload.offset is required.')
    }
      
      return db.querySQL(`SELECT dev.*,
                          devStatus.id as dev_s_id,
                      devStatus.on_off as dev_s_onoff,
               devStatus.online_status as dev_s_online,
               (select property_value from device_state where device_id=dev.id and property_name='dimming' order by log_date desc limit 1) 
                                       as dev_s_bright,
               (select property_value from device_state where device_id=dev.id and property_name='cct' order by log_date desc limit 1) 
                                       as dev_s_cct,
               (select property_value from device_state where device_id=dev.id and property_name='rgbw' order by log_date desc limit 1) 
                                       as dev_s_rgbw,
                     spaceDev.space_id as room_id,
                            space.name as room_name
                          FROM ${TB_DEVICE} dev
                          LEFT JOIN ${DEVICE_STATUS} devStatus 
                             ON devStatus.device_id=dev.id 
                          LEFT JOIN space_device spaceDev 
                             ON spaceDev.device_id=dev.id 
                          LEFT JOIN space 
                             ON space.id=spaceDev.space_id group by dev.address order by dev.create_time DESC
                          `).then((res) => {
      if (res.code === 200) {
        const { code, data } = res;
        // this.setBulbTime();
        
//      let newResulst = {
				return{
          ack:{
            code:code
          },
          payload:{
            totalCount:data.length,
            dev:data.map((item) => {
              let newItem = {};
              newItem.roomId = item.room_id;
              newItem.online = (item.dev_s_online == 0)?false:true;
              newItem.parentId = '';
            	newItem.homeId = "";
              newItem.icon = item.icon;
              newItem.name = item.name;
              newItem.devType = item.type;
              newItem.firmwareVersion = item.version;
              newItem.firmwareProductId = item.firmware_product_id;
              //newItem.devType = "Light_RGBW";
              newItem.devId = item.address;
              if(newItem.devType=="remote"){
              	console.log("item.remote_ground_id :",item.remote_groud_id);
								newItem.remoteId = parseInt(item.remote_groud_id);
								
								if(BleStatus==0){
									newItem.online = false;
										console.log("wcb BleStatus 0 : ",BleStatus);
								}else{
										console.log("wcb BleStatus 1: ",BleStatus);
										newItem.online = true;
									item.dev_s_onoff = "1";
								}
              }else{
              	console.log("newItem.devType :",newItem.devType);
                newItem.online = (item.dev_s_online == 0)?false:true;
                // newItem.online = true;
              }
              newItem.attr = {
                OnOff: item.dev_s_onoff =='1'? 1:0,
                CCT: item.dev_s_cct,
                RGBW: item.dev_s_rgbw,
                Dimming: item.dev_s_bright
              }
              //newItem.devType = "Light_RGBW";
              newItem.devId = item.address;
              
             /* newItem.attr = {
                "OnOff": 1,
                "Dimming": 100,
               };*/
              newItem.communicationMode = item.communication_mode;
              return newItem;
            }),
          }
        };
      }
				
      return res;
    });
  }


/************************************ 本地数据操作(新增) ******************************************* */


removeRepeatDevice(){
  return db.deleteData(TB_DEVICE,"id in (select max(id) from device group by address having count(id)>1)");
}


/**
 *  添加设备
 * @param {*} data
 */

addDevice(data){
//	return db.querySQL(`SELECT address FROM ${TB_DEVICE} where address=${data.address}`);
return db.querySQL(`SELECT address FROM ${TB_DEVICE} where address=${data.address}`).then((res) => {
	console.log("addDevice querySQL : ",res);
    if (res.code == 200) {
      console.log("验证地址："+33333+" 是否在数据库中已存在："+33333);
        console.log("开始添加到设备"+333333+"到数据库");
        return db.insert(TB_DEVICE, {
          uuid: uuidv4(),
          name: data.name,
          icon: data.icon,
          type: data.type,
          communication_mode: data.communicationMode,
          address: data.address,
          remote_groud_id:data.remote_groud_id,
          create_time:this.getNowFormatDate()

        });
    }
    console.log("db.querySQL(`SELECT address 回调:"+res.code);
    return new Promise((resolve, reject) => {
      resolve(res);
    });
  }).catch(res=>{
    return new Promise((resolve, reject) => {
      resolve(res);
    });
}).catch(res => {
	                    console.log("catch  回调:",res);
                  });
}

/**
 * 从本地数据库获取设备状态信息
 * @param {int} devId 
 */
getDeviceWithDevId(devId,data){
  const fakePromise = {
    resolve: function () {},
    reject: function () {},
    then: function (cb) {
      this.resolve = cb
      return this
    },
    catch: function (cb) {
      this.reject = cb
      return this
    }
  }

   db.querySQL(`SELECT dev.id as dev_id,
             dev.communication_mode as dev_communication_mode,
                        dev.address as dev_address,
                       devStatus.id as dev_s_id,
                   devStatus.on_off as dev_s_onoff,
            devStatus.online_status as dev_s_online,
            (select property_value from device_state where device_id=dev.id and property_name='dimming' order by log_date desc limit 1) 
                                    as dev_s_bright,
            (select property_value from device_state where device_id=dev.id and property_name='cct' order by log_date desc limit 1) 
                                    as dev_s_tem,
            (select property_value from device_state where device_id=dev.id and property_name='rgbw' order by log_date desc limit 1) 
                                    as dev_s_rgw
                      FROM ${TB_DEVICE} dev 
                      LEFT JOIN ${DEVICE_STATUS} devStatus 
                             ON devStatus.device_id=dev.id 
                      WHERE dev.address=${devId} `).then((res) => {

                        fakePromise.resolve({res:res,data:data});
  });

  return fakePromise
}

/**
 * 编辑设备基本信息
 * @param {Object} options 参数
 * @param {int} options.address 编辑的设备地址 
 * @param {Array} options.keyVals 编辑的字段列表
 * 
 */
editDeviceWithAddress(options){
  if (!options.address) {
    console.error('编辑失败，设备地址为空');
  }
  
  return db.update(
    TB_DEVICE,
    options.keyVals,
    'address=?',
    [options.address],
  );
}

/**
 * 
 * @param {object} options 参数
 * @param {string} options.deviceStatusTableId 设备状态表的id
 * @param {number} options.onOffStatus 设备开关状态 0,1
 * @param {number} options.onLineStatus 设备离线状态 0,1
 * @param {number} options.deviceTableId 设备主表id
 */
changeDeviceStatus(options){
  //还么有设备状态记录
  if(options.deviceStatusTableId != ''){
    return db.update(
      DEVICE_STATUS,
      {
        on_off: options.onOffStatus,
        online_status: options.onLineStatus
      },
      'id=?',
      [options.deviceStatusTableId],
    );
  }else{
    return db.insert(DEVICE_STATUS,{
      device_id: options.deviceTableId,
      on_off: options.onOffStatus,
      online_status: options.onOffStatus,
      active_time: this.getNowFormatDate()
    });
  }
}

offLineAllDevice(){
		console.log("wcb,最后一个直连灯断开连接，设备全部离线");
    return db.update(
      DEVICE_STATUS,
      {
        on_off: 0,
        online_status: 0
      },
      '',
      [],
    );
}

/**
 * 添加设备属性记录
 */
changeDeviceAttr(options){
  options.attrList.forEach(AttrItem => {
    console.log(AttrItem);
    db.insert(DEVICE_ATTR,{
      device_id: options.deviceTableId,
      property_name: AttrItem.attrName,
      property_value: AttrItem.attrValue,
      log_date: this.getNowFormatDate()
    });
  });
}

getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();

  var hour = date.getHours();
  var minute = date.getMinutes();
  var secound = date.getSeconds();
  

  if (month >= 1 && month <= 9) {
      month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
  }
  if (hour >= 0 && hour <= 9) {
    hour = "0" + hour;
  }
  if (minute >= 0 && minute <= 9) {
    minute = "0" + minute;
  }
  if (secound >= 0 && secound <= 9) {
    secound = "0" + secound;
  }

  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
          + " " + hour + seperator2 + minute
          + seperator2 + secound;
  return currentdate;
}

/**
 *  获取新的设备地址
 */
getNextAddress(){
  return db.querySQL(`SELECT max(address) as maxaddress FROM ${TB_DEVICE}`).then((res) => {
    if (res.code == 200) {
      if(res.data.length == 0){
        return 1;
      }
      if(!res.data[0].maxaddress){
        return 1;
      }
      let nextAddress = parseInt(res.data[0].maxaddress)+1;
      console.log("获取所有设备地址最大值："+nextAddress);
      if(nextAddress >= 256){
        console.log("数据库中设备地址大于255，遍历查询未使用的地址");
        return db.querySQL(`SELECT address FROM ${TB_DEVICE}`).then((res) => {
          if (res.code == 200) {
            for(let checkAddress = 1; checkAddress < 256; checkAddress++){
              let alreadyExist = 0;
              res.data.map((item) => {
                if(item.address == checkAddress){
                  alreadyExist = 1;
                }
              });
              if(alreadyExist == 0){
                console.log("查询到地址未使用："+checkAddress);
                return checkAddress;
              }
            }
          }

          return 0;
        });
      }
      return nextAddress;
    }

    return 0;
  });
}

getDeviceSceneCount(options){
  return db.querySQL(`SELECT scene_id FROM ifttt_actuator where device_id = ${options.devId}`).then((res) => {
    if (res.code === 200) {
      return res.data.count;
    }else{
      return 0;
    }
  });
}


getNextTimertId(options){
  return db.querySQL(`SELECT max(${options.field}) as maxfield FROM ifttt_actuator where device_id = ${options.devId}`).then((res) => {
    if (res.code === 200) {
      if(res.data.length == 0){
        return 1;
      }
      if(!res.data[0].maxfield){
        return 1;
      }
      let nextfield = parseInt(res.data[0].maxfield)+1;
      if(nextfield >= 256){
        return db.querySQL(`SELECT ${options.field} as queryfield FROM ifttt_actuator where device_id = ${options.devId}`).then((res) => {
          if (res.code === 200) {
            for(let checkfield= 1; checkfield < 256; checkfield++){
              let alreadyExist = 0;
              res.data.map((item) => {
                if(item.queryfield == checkfield){
                  alreadyExist = 1;
                }
              });
              if(alreadyExist == 0){
                return checkfield;
              }
            }
          }

          return 0;
        });
      }
      return nextfield;
    }

    return 0;
  });
}


/**
 * 获取下一个场景id
 */
getNextSceneId(options){
  let queryStr = "";
  if(options && options.devId){
    queryStr = 'where device_id = '+options.devId;
  }

  let queryTable = '(select scene_id,device_id from ifttt_actuator union all select scene_id,device_id from scene_detail)';

  return db.querySQL(`SELECT max(scene_id) as maxfield FROM ${queryTable} ${queryStr}`).then((res) => {
    if (res.code === 200) {
      if(res.data.length == 0){
        return 1;
      }
      if(!res.data[0].maxfield){
        return 1;
      }
      let nextfield = parseInt(res.data[0].maxfield)+1;
      if(nextfield >= 256){
        return db.querySQL(`SELECT scene_id as queryfield FROM ${queryTable} ${queryStr}`).then((res) => {
          if (res.code === 200) {
            for(let checkfield= 1; checkfield < 256; checkfield++){
              let alreadyExist = 0;
              res.data.map((item) => {
                if(item.queryfield == checkfield){
                  alreadyExist = 1;
                }
              });
              if(alreadyExist == 0){
                return checkfield;
              }
            }
          }

          return 0;
        });
      }
      return nextfield;
    }

    return 0;
  });
}

/**
 *  获取新加入的遥控器组id
 */
getNextRemoteGroupID(){
  return db.querySQL(`SELECT remote_groud_id FROM ${TB_DEVICE} WHERE type="remote"`).then((res) => {
    console.log("获取到遥控器id列表");
    console.log(res);
    if (res.code == 200) {
      for(let nextRemoteGroupId = 17; nextRemoteGroupId < 36; nextRemoteGroupId++){
        console.log("判读"+nextRemoteGroupId+"是否被使用");
        let alreadyExist = 0;
        if(res.data){
	        	for(let dataindex = 0;dataindex<res.data.length;dataindex++){
	          let item = res.data[dataindex];
	          console.log(item.remote_groud_id +" ==> "+ nextRemoteGroupId);
	          if(item.remote_groud_id == nextRemoteGroupId){
	            console.log("被使用了");
	            alreadyExist = 1;
	          }
	        }
        }
        if(alreadyExist == 0){
          return nextRemoteGroupId;
        }
      }
    }

    return 0;
  });
}

/**
 * 清除所有设备在数据库中的状态，修改为离线关闭状态。
 */
clearAllDeviceStatus(){
  return db.update("device_status",{
    online_status:'0',
    on_off:'0'
  },'',[]);
}

/**
 * 打开系统设置蓝牙页面
 */
openBuletoothSetting(){
  return this.BLEService.openBuletoothSetting();
}


/************************************* BLE 发送指令 **********************************************/ 


/**
 * 获取蓝牙开关状态
 * 
 */
getBuleToothStatus(){
  const fakePromise = {
    resolve: function () {},
    reject: function () {},
    then: function (cb) {
      this.resolve = cb
      return this
    },
    catch: function (cb) {
      this.reject = cb
      return this
    }
  }

  this.BLEService.getBuleToothStatus();

  let timer = setTimeout(function () {
      clearTimeout(timer)
      fakePromise.resolve({
        status:0
      })
  }, 2000);

  let that = this;
  this.BLEService.onGetBuleToothStatus(res => {
    BLEService.offGetBuleToothStatus();
    if (res){
      clearTimeout(timer)
      fakePromise.resolve(res)
    }
  });
 return fakePromise
}

/**
 * 获取设备的firmware版本
 * （目前蓝牙设备无法主动获取版本号，只有在设备刚入网时会主动上报）
 */
getFirmwareVersion(){
  const fakePromise = {
    resolve: function () {},
    reject: function () {},
    then: function (cb) {
      this.resolve = cb
      return this
    },
    catch: function (cb) {
      this.reject = cb
      return this
    }
  }

  this.BLEService.onConnectionDevFirmWare(res => {
    if (res){
      fakePromise.resolve(res);
    }
  });

 return fakePromise
}

/************************************* BLE 搜索设备 *************************************************/ 


/**
 *   开始搜索蓝牙设备
 * 
 * 
 */
startScan(){
  const fakePromise = {
    resolve: function () {},
    reject: function () {},
    then: function (cb) {
      this.resolve = cb
      return this
    },
    catch: function (cb) {
      this.reject = cb
      return this
    }
  }

  this.BLEService.startScan({
    ourMeshName: config.BLEServer.defaultOurMeshName,      //安卓原生sdk需要用到这个字段
    meshName: config.BLEServer.defaultMeshName,
    meshPassword: config.BLEServer.defaultMeshPassword
   });
  let timer = setTimeout(function () {
      clearTimeout(timer)
      fakePromise.reject({
        CODE: -1000,
        ERR_MSG: 'request timeout'
      })
  }, 20000);

  this.BLEService.OnDevChange(res => {
    console.log("搜索到设备回调");
    if (res){
      console.log("搜索到设备回调",res);
      clearTimeout(timer)
      fakePromise.resolve(res)
    }
  });

 return fakePromise
}

/**
  *   对搜索到的设备设置新的设备地址及mesh
  * @param {Object} options.oldAddress 搜索到的设备地址
  * @param {Object} options.newAddress 修改的新地址
  * @param {Object} options.oldMeshName 搜索到的设备当前的mesh信息
  * @param {Object} options.oldMeshPassword 
  * @param {Object} options.newMeshName 修改的新的mesh信息
  * @param {Object} options.newMeshPassword 
  */
setNewAddressAndMesh(options){

  const fakePromise = {
    resolve: function () {},
    reject: function () {},
    then: function (cb) {
      this.resolve = cb
      return this
    },
    catch: function (cb) {
      this.reject = cb
      return this
    }
  }

  this.BLEService.setNewAddressAndMesh({
    oldAddress: options.oldAddress,
    newAddress: options.newAddress,
    oldMeshName: options.oldMeshName,
    oldMeshPassword: options.oldMeshPassword,
    newMeshName: options.newMeshName,
    newMeshPassword: options.newMeshPassword
  });

  let timer = setTimeout(function () {
      clearTimeout(timer)
      fakePromise.reject({
        CODE: -1000,
        ERR_MSG: 'request timeout'
      })
  }, 3000);

  this.BLEService.onSetNetworkFinish(res => {
    console.log("onSetNetworkFinish回调AAA：", res);
    BLEService.offSetNetworkFinish();
    if (res){
      //clearTimeout(timer)
      console.log("onSetNetworkFinish回调2BBBB2 if (res)：", res);
      fakePromise.resolve(res)
    }
  });

  this.BLEService.onSetNewAddressAndMeshFail(res => {
    console.log("onSetNewAddressAndMeshFail回调："+res);
    BLEService.offSetNewAddressAndMeshFail();
    clearTimeout(timer)
    fakePromise.reject({
      CODE: -1001,
      ERR_MSG: 'Set Network Fail.'
    })
  });

 return fakePromise
}

/**
  *   停止搜索
  * 
  */
stopScan(){
  this.BLEService.OffDevChange();
  this.BLEService.offSetNetworkFinish();
  this.BLEService.offSetNewAddressAndMeshFail();
  this.BLEService.offConnectionDevFirmWare();
  
  return this.BLEService.stopScan({});
}

/**
  *   重新开始搜索
  * 
  */
scanAgain(){
  return this.BLEService.scanAgain({
    meshName: config.BLEServer.defaultMeshName,
    meshPassword: config.BLEServer.defaultMeshPassword
  });
}

/**
  *   开始连接蓝牙设备
  * 
  * @param {Object} options.meshName 修改的新的mesh信息
  * @param {Object} options.meshPassword 
  */
startConnect(options){
  return this.BLEService.startConnect({
    meshName: options.meshName,
    meshPassword: options.meshPassword
  });
}



  /**
	 *   参数说明
	 * @param {Object} options.devId 设备地址
   * @param {Object} options.rgbValue rgb值
   * @param {Object} options.lumValue 亮度值
   * @param {Object} options.ctValue ct值
   * @param {Object} options.timerId 定时id
   * @param {Object} options.sceneId 场景id
   * @param {Object} options.param   数据包。
	 */

/************************************* 设备 控制 *************************************************/ 
/**
  *   开灯
  * @param {Object} options.devId 设备地址
  * @param {Object} options.parameter 01 开 --- +延时参数暂无
	*/
turnOn(options){
  return this.BLEService.sendCommand({
    cmd:'d0',
     address:this.BLEService.parseIntString(options.devId)+"00",
    parameter:`010000`
}); 
}
/**
  *   分组群控开灯写死第一个遥控器位置控制测试
  * @param {Object} options.devId 设备地址
  * @param {Object} options.parameter 01 开 --- +延时参数暂无
	*/
turnGroupOn(options){
  return this.BLEService.sendCommand({
    cmd:'d0',
//   address:this.BLEService.parseIntString(options.remoteId)+"80",
     address:"1180",
    parameter:`010000`
}); 
}
/**
  *   分组群控关灯写死第一个遥控器位置控制测试
  * @param {Object} options.devId 设备地址
  * @param {Object} options.parameter 01 开 --- +延时参数暂无
	*/
turnGroupOff(options){
  return this.BLEService.sendCommand({
    cmd:'d0',
//   address:this.BLEService.parseIntString(options.remoteId)+"80",
     address:"1180",
    parameter:`000000`
}); 
}
/**
	* 关灯
	* @param {Object} options.devId 设备地址
  * @param {Object} options.parameter 00 关 --- +延时参数暂无
	*/
turnOff(options){
  return this.BLEService.sendCommand({
    cmd:'d0',
     address:this.BLEService.parseIntString(options.devId)+"00",
    parameter:`000000`
}); 
}

/**
 * 设置RGB
 * @param {Object} options.devId 设备地址
 * @param {Object} options.parameter RGB参数 04标示位 +rgb值 0x00~0xff
 */
  setRgbColor(options){

    return this.BLEService.sendCommand({
      cmd:'e2',
      address:this.BLEService.parseIntString(options.devId)+"00",
      parameter:`04${options.rgbValue}`
  }); 
  }
  /**
	 * 设置ct
	 * @param {Object} options.devId 设备地址
   * @param {Object} options.ctValue lum 值 //取值范围是0x00~0x64(即0%~100%)
	 */
  setCt(options){

    return this.BLEService.sendCommand({
      cmd:'e2',
      address:this.BLEService.parseIntString(options.devId)+"00",
      parameter:`05${options.ctValue}`
  }); 
  }

  /**
	 * 设置亮度
	 * @param {Object} options.devId 设备地址
   * @param {Object} options.lumValue lum 值
	 */
  setLum(options){
    return this.BLEService.sendCommand({
      cmd:'d2',
      address:this.BLEService.parseIntString(options.devId)+"00",
      parameter:`${this.BLEService.parseIntString(options.lumValue)}`
  }); 
  }
/**
	 *  删除设备-剔除出网络
	 * @param {Object} options.devId 设备地址
   * 
	 */
  kickout(options){
    return this.BLEService.sendCommand({
      cmd:'e3',
      address:this.BLEService.parseIntString(options.devId)+"00",
      parameter:``
  });
  }

  /**
	 *  获取知道的灯的亮度、ttc (time to cost)、hops(跳数)信息 ---------------------- 暂时原生没有用到
	 * @param {Object} options.devId 设备地址  addr为0xffff，所有的灯都会响应该命令。
   * @param 
	 */
  getStatus(options){

    return this.BLEService.sendCommand({
      cmd:'da',
      address:this.BLEService.parseIntString(options.devId)+"00",
      parameter:`10`
  }); 
  }



 /************************************* 分组 房间  一个设备最多添加8个房间 ？？？*************************************************/ 
 /**
	 *  添加灯 到 group
	 * @param {Object} options.devId 设备地址 
   * @param {Object} options.groupId  01表示添加组 +group地址   
   * @param 
	 */
 addDeviceToGroup(options){
	  return this.BLEService.sendCommand({
	    cmd:'d7',
	    address:this.BLEService.parseIntString(options.devId)+"00",
	    parameter:`01${this.BLEService.parseIntString(options.groupId)}80`
	}); 
 }
 /**
	 * 从group 中删除灯
	 * @param {Object} options.devId 设备地址 
   * @param {Object} options.groupId  00表示删除组 +group地址   
   * @param 
	 */
 delDeviceFromeGroup(options){
		  return this.BLEService.sendCommand({
		    cmd:'d7',
		    address:this.BLEService.parseIntString(options.devId)+"00",
		    parameter:`00${this.BLEService.parseIntString(options.groupId)}80`
		}); 
	 }
 
  /**
	 *  添加灯 到 group
	 * @param {Object} options.devId 设备地址 
   * @param {Object} options.groupId  01表示添加组 +group地址   
   * @param 
	 */
addDeviceToGroupDb(data){
    console.log("开始添加到设备"+data.devId+"到数据库");
    return db.insert(GROUP_DEVICE, {
      group_id: data.groupId,
      device_id: data.devId,
    });
}
deleteDeviceToGroupDb(data){
    console.log("开始删除设备"+data.devId+"到数据库");
    return db.deleteData(GROUP_DEVICE, `group_id=${data.groupId} and device_id=${data.devId}`);
}


 /**
	 * 从group 中删除灯  （组播） 
	 * @param {Object} options.groupId 组地址 
   * @param {Object} options.groupId  00表示删除组 +group地址   
   * @param 
	 */
  delDeviceFromeGroupAll(options){

    return this.BLEService.sendCommand({
      cmd:'d7',
      address:`${this.BLEService.parseIntString(options.groupId)}80`,
      parameter:`00${this.BLEService.parseIntString(options.groupId)}80`
  }); 
  
   }
   /**
	 * 从group 中删除灯  （组播） 
	 * 删除数据库表中遥控器下所有灯
   * @param 
	 */
  delDeviceFromeGroupAllDB(data){
    return db.deleteData(GROUP_DEVICE, `group_id=${data.groupId}`);
   }

 /**
	 * 获取该灯的所以组地址  
	 * @param {Object} options.devId  设备地址 
   *  
	 */
   getGroupAdr(options){

    return this.BLEService.sendCommand({
      cmd:'dd',
      address: this.BLEService.parseIntString(options.devId)+"00",
      parameter:`1001`
  });

   }


   /**
    * 给遥控器分配分组id
    * 
    */
   setRemoteGroupId(options){
    return this.BLEService.sendCommand({
        cmd:'f6',
//      address: this.BLEService.parseIntString(options.devId)+"00",
				address:"0000",
        parameter:this.BLEService.parseIntString(options.nextRemoteGroupId)+"80"
    });
   }




/************************************* 定时 ～闹钟~ 情景 *************************************************/ 

/**
	 *  添加一个闹钟到一个设备实体
	 * @param {Object} options.devId 设备地址
	 * @param {Object} options.timerId 定时id [11]:表示闹钟操作类型，0x00(添加闹钟) 
   * @param {Object} options.param 一个闹钟的数据包。
	 */
  addTimer(options){

    return this.BLEService.sendCommand({
        cmd:'e5',
        address: options.devId,
        parameter:`00${options.param}`
    });
  }

 /**
	 *  获取设备的闹钟   //（[20]:该灯存在的闹钟的总个数，当app收到的闹钟的notify个数和这个值不
等的时候，应重新发送Get_Alarm命令）
	 * @param {Object} options.devId 设备地址
	 * 
	 */
  getTimer(options){

    return this.BLEService.sendCommand({
        cmd:'e6',
        address:options.devId,
    });
  }

  /**
	 *  获取设备内某ID的闹钟
	 * @param {Object} options.devId 设备地址
	 * @param {Object} options.timerId 定时id
	 */
  getTimerByIdReq(options){

    return this.BLEService.sendCommand({
        cmd:'e6',
        address:options.devId,
        parameter:`10${options.timerId}`
    });
  }

  /**
 *  删除设备某个索引的闹钟
 *
 *  @param {Object} options.devId 
 *  @param {Object} options.timerId //[11]:表示闹钟操作类型，0x01(删除闹钟)。
 */
 delTimerByIdReq(options){

    return this.BLEService.sendCommand({
        cmd:'e5',
        address:options.devId,
        parameter:`01${options.timerId}000000000000`
    });
  }

/**
 *  关闭设备某个索引的闹钟
 *
 *  @param {Object} options.devId 
 *  @param {Object} options.timerId //[11]:表示闹钟操作类型，0x04(关闭闹钟)
 */
disTimerByIdReq(options){

  return this.BLEService.sendCommand({
      cmd:'e5',
      address:options.devId,
      parameter:`04${options.timerId}000000000000`
  });
}
/**
 *  打开设备某个索引的闹钟
 *
 *  @param {Object} options.devId 
 *  @param {Object} options.timerId //[11]:表示闹钟操作类型，0x03(打开闹钟)
 */
enTimerByIdReq(options){

  return this.BLEService.sendCommand({
      cmd:'e5',
      address: options.devId,
      parameter:`03${options.timerId}000000000000`
  });
}

/**
 *  更改设备某个索引的闹钟
 *
 *  @param {Object} options.devId 
 *  @param {Object} options.param 一个更改闹钟的数据包。
 */
chgTimerByIdReq(options){

  return this.BLEService.sendCommand({
      cmd:'e5',
      address:options.devId,
      parameter:`02${options.param}`
  });
}




 /************************************* 场景 *************************************************/ 


  /**
	 *  获取设备内的动作（场景列表--[19]:该灯存在的场景的总个数，当app收到的场景的notify个数和这个值不
等的时候，应重新发送Get_Scene命令）
	 * @param {Object} options.devId 设备地址
	 */
  getScene(options){

    return this.BLEService.sendCommand({
        cmd:'c0',
        address:options.devId,
    });
  }

  /**
	 *  获取设备内某ID的动作（场景）
	 * @param {Object} options.devId 设备地址
	 * @param {Object} options.sceneId 场景id
	 */
  getSceneByIdReq(options){

    return this.BLEService.sendCommand({
        cmd:'c0',
        address: options.devId,
        parameter:`${options.sceneId}`
    });
  }

  /**
	 *  加载场景
	 * @param {Object} options.address 0xffff，表示destination addr为0xffff，即所有的灯都会响应该命令
	 * @param {Object} options.sceneId 场景id
	 */
  loadScene(options){

    return this.BLEService.sendCommand({
        cmd:'ef',
        address:'ffff',
        parameter:`${options.sceneId}`
    });
  }

  /**
	 *  在一个设备上删除一个场景
	 * @param {Object} options.devId 0xffff，表示destination addr为0x0000，即只有当前直连的灯会响应
    该命令
	 * @param {Object} options.sceneId 场景id [11]:表示场景的操作类型，0x00(删除场景)。 [12]场景索引，若该值为0xff 则删除所以场景
	 */
  delScene(options){
    return this.BLEService.sendCommand({
        cmd:'ee',
        address:options.devId,
        parameter:`00${options.sceneId}`
    });
  }
/**
	 * 在一个设备实体上添加一个场景
	 * @param {Object} options.devId 0xffff，表示destination addr为0x0000，即只有当前直连的灯会响应
该命令
	 * @param {Object} options.sceneId 场景id [11]:表示场景的操作类型，0x0(添加场景)。 
   * 
   * @param {Object} options.param 一个场景的数据包。
	 */
  addScene(options){
    return this.BLEService.sendCommand({
        cmd:'ee',
        address:options.devId,
        parameter:`01${options.sceneId}${options.param}`
    });
  }


	getCountDownReq(options){
		console.log("ble getCountDownReq :",options);
		const fakePromise = {
	    resolve: function () {},
	    reject: function () {},
	    then: function (cb) {
	      this.resolve = cb
	      return this
	    },
	    catch: function (cb) {
	      this.reject = cb
	      return this
	    }
	  }
	
	 	this.BLEService.sendCommand({
		    cmd:'EA',
		    address:this.BLEService.parseIntString(options.devId)+"00",
		    parameter:`0880`
		}); 
		
	  let timer = setTimeout(function () {
	      clearTimeout(timer)
	      fakePromise.reject({
	        CODE: -1000,
	        ERR_MSG: 'request timeout'
	      })
	  }, 20000);
	  
	  
	  this.BLEService.onDeviceNofify(res => {
	    console.log("onDeviceNofify = ",res);
	    if (res){
	      let resp = this.fillCountDownData(res);
	      console.log("搜索到设备回调",resp);
	      clearTimeout(timer);
	      fakePromise.resolve(resp);
	    }
	  });
	
	 return fakePromise
	}
	
	 //解析倒计时数据
  fillCountDownData(res){
  	let bytesStr = res;
  	if(res.data != undefined){
    	bytesStr = res.data;
  	}
  	let bytes = this.getBytesByString(bytesStr);
  	let command = bytes[7];

    if(command == 0xeb){
    	let devId = bytes[3];
	    let type = bytes[11];
	    let enable = bytes[12];
	    let setHour = bytes[13];
	    let setMinute = bytes[14];
	    let hour = bytes[15];
	    let minute = bytes[16];
	    
	    let remainCountDown = 0;
	    
	    if(hour == 0xff && minute == 0xff){
	    	remainCountDown = 0;
	    } else {
	    	remainCountDown = hour * 3600 + minute * 60;
	    }
	    
	    let setCountDown = 0;
	    
	    if(setHour == 0xff && setMinute == 0xff){
	    	setCountDown = 0;
	    } else {
	    	setCountDown = setHour * 3600 + setMinute * 60;
	    }
	
	    let countDownData = {
	      devId: devId,
	      type: type,
	      remainCountDown: remainCountDown,
	      enable:enable,
	      setCountDown:setCountDown,
	    };
	
			if(type == 0x80){
				return countDownData;
			}
    }
    return null;
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
  
  
  setCountDownReq(options){
		console.log("ble setCountDownReq :",options);
		let hour = this.parseIntToHex(options.hour,2)
		let minute = this.parseIntToHex(options.minute,2)
	  return this.BLEService.sendCommand({
		    cmd:'F5',
		    address:this.BLEService.parseIntString(options.devId)+"00",
		    parameter:`06${hour}${minute}`
		}); 
		
	}
  
  /**
   * 设置倒计时使能请求 
   */
  setCountDownEnableReq(options){
		let enable = this.parseIntToHex(options.enable,2)
	  return this.BLEService.sendCommand({
		    cmd:'F5',
		    address:this.BLEService.parseIntString(options.devId)+"00",
		    parameter:`07${enable}`
		});
  }

/**
	 * 在一个设备实体上设置经纬度、时区 （ble plug）
	 * @param {Object} options.devId 0xffff，表示destination addr为0x0000，即只有当前直连的灯会响应
该命令
	 * 
   * 
   * @param {Object} options.param 一个经纬度时区数据包。
	 */
  setLocation(options){
    return this.BLEService.sendCommand({
        cmd:'f5',
        address:this.BLEService.parseIntString(options.devId)+"00",
        parameter:`03${options.param}`
    });
  }
  /**
	 * 在一个设备实体上设置经纬度、时区 （ble plug）
	 * @param {Object} options.devId 0xffff，表示destination addr为0x0000，即只有当前直连的灯会响应
该命令
	 * 
   * 
   * @param {Object} options.param 使能开关 
	 */
  setSunriseOnOff(options){
    return this.BLEService.sendCommand({
        cmd:'f5',
        address:this.BLEService.parseIntString(options.devId)+"00",
        parameter:`04${options.param}`
    });
  }


  /**
	 * 在一个设备实体上设置经纬度、时区 （ble plug）
	 * @param {Object} options.devId 0xffff，表示destination addr为0x0000，即只有当前直连的灯会响应
该命令
	 * 
   * 
   * @param {Object} options.param 使能开关 
	 */
  setSunsetOnOff(options){
    return this.BLEService.sendCommand({
        cmd:'f5',
        address:this.BLEService.parseIntString(options.devId)+"00",
        parameter:`05${options.param}`
    });
  }


  /**
  *
  *查询经纬度设置
  */
  queryLocaltionSet(options){
    return this.BLEService.sendCommand({
        cmd:'ea',
        address:this.BLEService.parseIntString(options.devId)+"00",
        parameter:`0881`
    });
  }

  /**
  *
  *查询日出设置
  */
  querySunrise(options){
    return this.BLEService.sendCommand({
        cmd:'ea',
        address:this.BLEService.parseIntString(options.devId)+"00",
        parameter:`0882`
    });
  }

    /**
  *
  *查询日落设置
  */
  querySunset(options){
    return this.BLEService.sendCommand({
        cmd:'ea',
        address:this.BLEService.parseIntString(options.devId)+"00",
        parameter:`0883`
    });
  }










 /****************************************************/ 
/**
	 *  时间校验
	 * 
	 *  
   */

  parseIntToHex(intValue,length){
    console.log(intValue)
    let hexValue = parseInt(intValue).toString(16);
    if(hexValue.length < length){
      hexValue = (Array(length).join(0) + hexValue).slice(-length);;
    }

    console.log(hexValue)
    return hexValue;
  }

  setBulbTime(options){

    console.log('setBulbTimesetBulbTimesetBulbTimesetBulbTimesetBulbTimesetBulbTime')

  var myDate = new Date()
  let year =  this.parseIntToHex(myDate.getFullYear(),4); //获取完整的年份(4位,1970-????)
  let month =  this.parseIntToHex(myDate.getMonth(),2); //获取当前月份(0-11,0代表1月)
  let date =  this.parseIntToHex(myDate.getDate(),2); //获取当前日(1-31)
  let hours = this.parseIntToHex(myDate.getHours(),2); //获取当前小时数(0-23)
  let minutes = this.parseIntToHex(myDate.getMinutes(),2); //获取当前分钟数(0-59)
  let seconds = this.parseIntToHex(myDate.getSeconds(),2); //获取当前秒数(0-59)
/*
  year1 =year.substring(0,2);
 
 cmdDate= parseInt(date) & 0xff
 cmdday= parseInt(day) & 0xff
 cmdhours= parseInt(hours) & 0xff
 cmdminutes= parseInt(minutes) & 0xff
 cmdseconds= parseInt(seconds) & 0xff
*/
let year1 = year.substring(0,2);
let year2 = year.substring(2,4);
console.log("----------------------------")
console.log(year)
console.log(year1)
console.log(year2)

  return this.BLEService.sendCommand({
      

      cmd:'e4',
      address:'ffff',
      parameter:year2+year1+month+date+hours+minutes+seconds
      
  });

  }









}
