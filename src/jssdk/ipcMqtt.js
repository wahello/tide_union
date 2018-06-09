import http from '../jssdk/Http';
import paypal from '../jssdk/paypal';
import config from '../config';
import MQTTService, { TOPIC } from './MQTTService'
import Cookies from 'universal-cookie'
import jsBridge from '../jssdk/JSBridge';
//const baseUrl = 'http://172.24.20.220:8080';
const baseUrl = `${config.httpServer}/videoPlanController`;
// const roomURL = 'http://172.16.55.119:8090/space';
const cookies = new Cookies()
export default {

  updatePlanName(data) {
      return http.post({ url: `${baseUrl}/updatePlanName`, data });
  },

   /**
	 * 获取侦测
	 * @param {Object} options.password 设备密码
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  getMotion (options) {
    const req = options.payload || {}
    if (!req.password) {
      console.error('payload.password is required.')
    }
    if (!req.userId) {
      console.error('payload.userId is required.')
    }
    return MQTTService.sendData({
      service: "IPC",
      method: 'getEventTriggersReq',
      topic: `${TOPIC.clientV1}/${options.deviceId}/getEventTriggersReq`,
      payload: req
    })
  },
   /**
	 * 设置侦测
	 * @param {Object} options.password 设备密码
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  setMotion (options) {
    const req = options.payload || {}
    if (!req.password) {
      console.error('payload.password is required.')
    }
    if (!req.userId) {
      console.error('payload.userId is required.')
    }
    return MQTTService.sendData({
      service: "IPC",
      method: 'setEventTriggersReq',
      topic: `${TOPIC.clientV1}/${options.deviceId}/setEventTriggersReq`,
      payload: req
    })
  },

  /**
	 * 4.14	设备解绑
	 * @param {Object} options.userId 用户ID
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  devUnbindReq(options) {
    const req = options.payload || {}
    if (!req.unbindDevId) {
      console.error('payload.unbindDevId  is required.')
    }
    if (!req.unbindUserId ) {
      console.error('payload.unbindUserId  is required.')
    }
    if (!req.userId  ) {
      console.error('payload.userId   is required.')
    }
    return MQTTService.sendData({
      service: "device",
      method: 'devUnbindReq',
      topic: `${TOPIC.serverV1}/${options.userId}/device/devUnbindReq`,
      payload: req
    })
  },

  
 /**
	 * 获取设备信息请求（房间 ，名字，图片）
	 * @param {Object} options.devId 设备Id
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  getDevInfoReq (options) {
    const req = options.payload || {}
    if (!options.userId) {
      console.error('options.userId is required.')
    }
    return MQTTService.sendData({
      service: 'device',
      method: 'getDevInfoReq',
      topic: `${TOPIC.serverV1}/${options.userId}/device/getDevInfoReq`,
      payload: req
    })
  },


  
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
    return MQTTService.sendData({
      service: "DEVICE",
      method: 'setDevInfoReq',
      topic: `${TOPIC.clientV1}/${options.parentId}/devManage/setDevInfoReq`,
      payload: req
    })
  },

  /**
	 * 执行OTA请求
	 * @param {Object} options.devId 设备ID
	 * @param {Object} options.userId 用户ID
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
  */
  excOtaReq(payload){
    const req = payload || {}
    if (!req.devId) {
      console.error('payload.devId is required.')
    }
    return MQTTService.sendData({
      service: "ota",
      method: 'excOtaReq',
      topic: `${TOPIC.serverV1}/${cookies.get('userId')}/ota/excOtaReq`,
      payload: req
    })
  },


  /**
	 * 获取版本列表请求
	 * @param {Object} options.devId 设备ID
	 * @param {Object} options.userId 用户ID
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
  */
  getVerListReq(payload){
    const req = payload || {}
    if (!req.devId) {
      console.error('payload.devId is required.')
    }
    return MQTTService.sendData({
      service: "ota",
      method: 'getVerListReq',
      topic: `${TOPIC.serverV1}/${cookies.get('userId')}/ota/getVerListReq`,
      payload: req
    })
  },

  /**
   * 获取是否有SD卡
   * @param {Object} options.devId 设备ID
   * @param {Object} options.userId 用户ID
   * @param {Object} options.payload 消息体
   * @return {Promise}
  */
  getHavSD(payload){
    const req = payload || {}
    if (!req.devId) {
      console.error('payload.devId is required.')
    }
    return MQTTService.sendData({
      service: "IPC",
      method: 'getHavSDReq',
      topic: `${TOPIC.clientV1}/${req.devId}/getHavSDReq`,
      payload: req
    }) 
  },


  /**
   * 格式化SD卡
   * @param {Object} options.devId 设备ID
   * @param {Object} options.userId 用户ID
   * @param {Object} options.payload 消息体
   * @return {Promise}
  */
  setSDFormat(payload){
    const req = payload || {}
    if (!req.devId) {
      console.error('payload.devId is required.')
    }
    return MQTTService.sendData({
      service: "IPC",
      method: 'setSDFormatReq',
      topic: `${TOPIC.clientV1}/${req.devId}/setSDFormatReq`,
      payload: req
    }) 
  },

 /**
   * 设备执行reboot
   * @param {Object} options.devId 设备ID
   * @param {Object} options.userId 用户ID
   * @param {Object} options.payload 消息体
   * @return {Promise}
  */
  setReboot(options){
    const req = options.payload || {}
    if (!req.devId) {
      console.error('options.devId is required.')
    }
    return MQTTService.sendData({
      service: "IPC",
      method: 'setRebootReq',
      topic: `${TOPIC.clientV1}/${options.devId}/setRebootReq`,
      payload: req
    }) 
   },
  
  
     /**
     * 设备执行reset
     * @param {Object} options.devId 设备ID
     * @param {Object} options.userId 用户ID
     * @param {Object} options.payload 消息体
     * @return {Promise}
    */
   setReset( options ){
    const req = options.payload || {}
    if (!req.devId) {
      console.error('options.devId is required.')
    }
    return MQTTService.sendData({
      service: "IPC",
      method: 'setResetReq ',
      topic: `${TOPIC.clientV1}/${options.devId}/setResetReq`,
      payload: req
    }) 
   },
  
 
 
  /**
	 * 获取SD卡录影配置
	 * @param {Object} options.devId 设备ID
	 * @param {Object} options.userId 用户ID
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
  */

  getSDRecordConfig(payload){
    const req = payload || {}
    if (!req.devId) {
      console.error('payload.devId is required.')
    }
    return MQTTService.sendData({
      service: "IPC",
      method: 'getSDRecordConfigReq',
      topic: `${TOPIC.clientV1}/${req.devId}/getSDRecordConfigReq`,
      payload: req
    }) 
   },

    /**
	 * 设置SD卡录影配置
	 * @param {Object} options.devId 设备ID
	 * @param {Object} options.userId 用户ID
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
  */

  setSDRecordConfig(payload){
    const req = payload || {}
    if (!req.devId) {
      console.error('payload.devId is required.');
    }
    return MQTTService.sendData({
      service: "IPC",
      method: 'setSDRecordConfigReq',
      topic: `${TOPIC.clientV1}/${req.devId}/setSDRecordConfigReq`,
      payload: req
    }) 
   },

	/**
	 * 设置设备时区的请求
	 * @param {Object} options.parentId 直连设备的ID，即网关id
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  setDevTimezone (options) {
    const req = options.payload || {}
    if (!options.parentId) {
      console.error('options.parentId is required.')
    }
    if (!req.devId) {
      console.error('payload.devId is required.')
    }
    return MQTTService.sendData({
      service: 'IPC',
      method: 'setDevTimezoneReq',
      topic: `${TOPIC.clientV1}/${options.parentId}/setDevTimezoneReq`,
      payload: req
    })
  },

  /**
	 * 获取设备时区的请求
	 * @param {Object} options.parentId 直连设备的ID，即网关id
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  getDevTimezoneReq(options) {
    const req = options.payload || {}
    if (!options.parentId) {
      console.error('options.parentId is required.')
    }
    if (!req.devId) {
      console.error('payload.devId is required.')
    }
    return MQTTService.sendData({
      service: 'IPC',
      method: 'getDevTimezoneReq',
      topic: `${TOPIC.clientV1}/${options.parentId}/getDevTimezoneReq`,
      payload: req
    })
  },

  /**
	 * 设置事件通知的请求
	 * @param {Object} options.userId 用户id
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  setEventNotif (options) {
    const req = options.payload || {}
    if (typeof req.devId !== 'string') {
      console.error('options.devId is required.')
    }
    if (typeof req.eventNotifEnabled !== 'boolean') {
      console.error('options.eventNotifEnabled is required.')
    }
    return MQTTService.sendData({
      service: 'IPC',
      method: 'setEventNotifReq',
      topic: `${TOPIC.serverV1}/${options.devId}/setEventNotifReq`,
      payload: req
    })
  },
  
  /**
	 * 获取事件通知的请求
	 * @param {Object} options.userId 用户id
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  getEventNotif (options) {
    const req = options.payload || {}
    if (typeof req.userId !== 'string') {
      console.error('options.userId is required.')
    }
    if (!req.devId) {
      console.error('payload.devId is required.')
    }
    return MQTTService.sendData({
      service: 'IPC',
      method: 'getEventNotifReq',
      topic: `${TOPIC.serverV1}/${cookies.get('userId')}/getEventNotifReq`,
      payload: req
    })
  }, 
}