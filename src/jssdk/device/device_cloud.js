import Cookies from 'universal-cookie'
import JSBridge from '../JSBridge'
import MQTTService, { TOPIC } from '../MQTTService'
import UDPService from '../UDPService'
import http from '../Http'
import config from '../../config'
import BLEService from '../BLEService'

// 'http://172.16.55.119:8090/space'
const homeURL = `${config.httpServer}`

const cookies = new Cookies()
const DEVICE_SERVICE = 'device'
const IPC_SERVICE = 'IPC'

let instance = null
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
      topic: `${TOPIC.broadcastV1}/${options.devId || options.userId}/${DEVICE_SERVICE}/connect`,
      payload: options.payload || {}
    });
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
      topic: `${TOPIC.broadcastV1}/${options.devId || options.userId}/${DEVICE_SERVICE}/disconnect`,
      payload: options.payload || {}
    })
  }

	/**
	 * 4.3	设备发现请求
	 * @param {String} options.ip 发送地址
	 * @param {string} options.port 发送端口
	 * @param {Object} options.payload 消息体
	 * @param {Object} options.retryTimes 消息体
	 * @return {Promise}
	 */
  devDiscoveryReq (options) {
    return this.udpService.sendData(options.ip, options.port, {
      service: DEVICE_SERVICE,
      method: 'devDiscoveryReq',
      payload: options.payload || {}
    }, options.time||5000,  typeof options.retryTimes === 'number' ? options.retryTimes : 10)
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
    }, options.time, options.retryTimes)
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
    }, options.time, options.retryTimes)
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
    }, options.time||5000,  typeof options.retryTimes === 'number' ? options.retryTimes : 10)
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
      topic: `${TOPIC.serverV1}/${options.devId}/${DEVICE_SERVICE}/devBindReq`,
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
      topic: `${TOPIC.clientV1}/${req.devId}/${DEVICE_SERVICE}/devBindNotif`,
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
      topic: `${TOPIC.clientV1}/${req.devId}/${DEVICE_SERVICE}/devUnbindNotif`,
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
      topic: `${TOPIC.serverV1}/${req.userId}/${DEVICE_SERVICE}/devUnbindReq`,
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
      topic: `${TOPIC.serverV1}/${req.devId}/${DEVICE_SERVICE}/devUnbindConfirm`,
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
      topic: `${TOPIC.serverV1}/${req.devId}/${DEVICE_SERVICE}/updateDevBasics`,
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
      topic: `${TOPIC.clientV1}/${req.devId}/${DEVICE_SERVICE}/synDevBasicConfig`,
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
      topic: `${TOPIC.serverV1}/${req.devId}/${DEVICE_SERVICE}/updateDevDetails`,
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
	 * 4.22	获取设备列表请求
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  getDevListReq (options) {
    const req = options.payload || {}
    if (!req.pageSize) {
      console.error('payload.pageSize is required.')
    }
    if (req.offset == undefined) {
      console.error('payload.offset is required.')
    }
    return this.mqttService.sendData({
      service: DEVICE_SERVICE,
      method: 'getDevListReq',
      topic: `${TOPIC.serverV1}/${options.userId || cookies.get('userId')}/${DEVICE_SERVICE}/getDevListReq`,
      payload: req
    })
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
      topic: `${TOPIC.serverV1}/${options.userId}/${DEVICE_SERVICE}/getRoomDevListReq`,
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
      console.error('options.userId is required.')
    }
    return this.mqttService.sendData({
      service: DEVICE_SERVICE,
      method: 'getDevInfoReq',
      topic: `${TOPIC.serverV1}/${options.userId}/${DEVICE_SERVICE}/getDevInfoReq`,
      payload: req
    })
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
    if (!req.userId) {
      console.error('payload.userId is required.')
    }
    return this.mqttService.sendData({
      service: DEVICE_SERVICE,
      method: 'setDevInfoReq',
      topic: `${TOPIC.clientV1}/${options.parentId}/${DEVICE_SERVICE}/setDevInfoReq`,
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
      topic: `${TOPIC.serverV1}/${options.parentId}/${DEVICE_SERVICE}/setDevInfoNotif`,
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
    
    options.payload.installCode = "";
    return this.mqttService.sendData({
      service: DEVICE_SERVICE,
      method: 'addDevReq',
      topic: `${TOPIC.clientV1}/${options.devId}/${DEVICE_SERVICE}/addDevReq`,
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
      topic: `${TOPIC.clientV1}/${options.parentId}/${DEVICE_SERVICE}/stopDevReq`,
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
      topic: `${TOPIC.broadcastV1}/${req.devId}/${DEVICE_SERVICE}/addDevNotif`,
      payload: req
    })
  }

	/**
	 * 4.34	删除子设备请求
	 * @param {String} options.userId 用户ID
	 * @param {String} options.parentId 父设备ID即网关ID
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  delDevReq (options) {
    const req = options.payload || {}
	    if (!options.parentId) {
      console.error('parentId is required.')
    }
    if (!req.devId) {
      console.error('payload.devId is required.')
    }
    return this.mqttService.sendData({
      service: DEVICE_SERVICE,
      method: 'delDevReq',
      topic: `${TOPIC.clientV1}/${options.parentId}/${DEVICE_SERVICE}/delDevReq`,
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
      topic: `${TOPIC.broadcastV1}/${req.devId}/${DEVICE_SERVICE}/delDevNotif`,
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
      topic: `${TOPIC.clientV1}/${options.parentId}/${DEVICE_SERVICE}/getDevAttrReq`,
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
      topic: `${TOPIC.clientV1}/${options.parentId}/${DEVICE_SERVICE}/setDevAttrReq`,
      payload: req
    });
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
      topic: `${TOPIC.broadcastV1}/${req.devId}/${DEVICE_SERVICE}/setDevAttrNotif`,
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
      topic: `${TOPIC.broadcastV1}/${req.devId}/${DEVICE_SERVICE}/getProductList`,
      payload: req
    })
  }
  
  /**
   * 获取倒计时时间请求 
   */
  getCountDownReq(options){
  	const req = options.payload || {}
    if (!options.devId) {
      console.error('devId is required.')
    }
    return this.mqttService.sendData({
      service: DEVICE_SERVICE,
      method: 'getCountDownReq',
      topic: `iot/v1/c/${options.devId}/device/getCountDownReq`,
      payload: req
    })
  }
  
  /**
   * 设置倒计时使能请求 
   */
  setCountDownEnableReq(options){
  	const req = options.payload || {}
    if (!req.devId) {
      console.error('devId is required.')
    }
    return this.mqttService.sendData({
      service: DEVICE_SERVICE,
      method: 'setCountDownEnableReq',
      topic: `iot/v1/s/${options.userId}/device/setCountDownEnableReq`,
      payload: req
    })
  }
  
  setCountDownReq(options){
  	const req = options.payload || {}
    if (!req.devId) {
      console.error('devId is required.')
    }
    return this.mqttService.sendData({
      service: DEVICE_SERVICE,
      method: 'setCountDownReq',
     	topic: `iot/v1/s/${options.userId}/device/setCountDownReq`,
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
    meshName: config.BLEServer.defaultMeshName,
    meshPassword: config.BLEServer.defaultMeshPassword
   });
  let timer = setTimeout(function () {
      clearTimeout(timer)
      fakePromise.reject({
        CODE: -1000,
        ERR_MSG: 'request timeout'
      })
  }, 60000);

  this.BLEService.OnDevChange(res => {
    if (res){
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
    if (res){
      clearTimeout(timer)
      fakePromise.resolve(res)
    }
  });

  this.BLEService.onSetNewAddressAndMeshFail(res => {
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
    address:options.devId,
    parameter:`010000`
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
    address:options.devId,
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
      address:options.devId,
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
      address:options.devId,
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
      address:options.devId,
      parameter:`${options.lumValue}`
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
      address:options.devId,
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
      address:options.devId,
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
    cmd:'da',
    address:options.devId,
    parameter:`01${options.groupId}80`
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
    address:options.devId,
    parameter:`00${options.groupId}80`
}); 
 }

 /**
	 * 从group 中删除灯  （组播） 
	 * @param {Object} options.groupId 组地址 
   * @param {Object} options.groupId  00表示删除组 +group地址   
   * @param 
	 */
  delDeviceFromeGroup(options){

    return this.BLEService.sendCommand({
      cmd:'d7',
      address:`${options.groupId}80`,
      parameter:`00${options.groupId}80`
  }); 
  
   }

 /**
	 * 获取该灯的所以组地址  
	 * @param {Object} options.devId  设备地址 
   *  
	 */
   getGroupAdr(options){

    return this.BLEService.sendCommand({
      cmd:'dd',
      address: options.devId,
      parameter:`1001`
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
        address:options.devId,
        parameter:`00${options.timerId}${options.param}`
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
      address:options.devId,
      parameter:`03${options.timerId}000000000000`
  });
}

/**
 *  更改设备某个索引的闹钟
 *
 *  @param {Object} options.devId 
 *  @param {Object} options.timerId //[11]:表示闹钟操作类型，0x02(更改闹钟)
 *  @param {Object} options.param 一个更改闹钟的数据包。
 */
chgTimerByIdReq(options){

  return this.BLEService.sendCommand({
      cmd:'e5',
      address:options.devId,
      parameter:`02${options.timerId}${options.param}`
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
        address:options.devId,
        parameter:`10${options.sceneId}`
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
        parameter:`01${options.sceneId}`
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


 /****************************************************/ 
/**
	 *  时间校验
	 * 
	 *  
   */
  setBulbTime(options){
    return this.BLEService.sendCommand({
      
  });

  }

	setCountDownReq(options){
  	const req = options.payload || {}
    if (!req.devId) {
      console.error('devId is required.')
    }
    return this.mqttService.sendData({
      service: DEVICE_SERVICE,
      method: 'setCountDownReq',
     	topic: `iot/v1/s/${options.userId}/device/setCountDownReq`,
      payload: req
    })
  }

	/**
   * 设置倒计时使能请求 
   */
  setCountDownEnableReq(options){
  	const req = options.payload || {}
    if (!req.devId) {
      console.error('devId is required.')
    }
    return this.mqttService.sendData({
      service: DEVICE_SERVICE,
      method: 'setCountDownEnableReq',
      topic: `iot/v1/s/${options.userId}/device/setCountDownEnableReq`,
      payload: req
    })
  }

  /**
   * 获取倒计时时间请求 
   */
  getCountDownReq(options){
  	const req = options.payload || {}
    if (!options.devId) {
      console.error('devId is required.')
    }
    return this.mqttService.sendData({
      service: DEVICE_SERVICE,
      method: 'getCountDownReq',
      topic: `iot/v1/c/${options.devId}/device/getCountDownReq`,
      payload: req
    })
  }

  /**
	 *   获取单个设备 more about
	 * @param {*} data
	 */
  getMoreAbout (data) {
    return http.get({
      url: `${homeURL}/deviceController/getDeviceMoreInfoByDeviceId`,
      data
    })
  }

}
