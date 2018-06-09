import http from '../../jssdk/Http'
import JSBridge from '../JSBridge'
import MQTTService, { TOPIC } from '../MQTTService'
import Cookies from 'universal-cookie'
import config from '../../config'

const cookies = new Cookies();
const SCENE_SERVICE = 'scene';
const serviceURL = `${config.httpServer}/${SCENE_SERVICE}`
export default class Scene {
  constructor () {
    this.jsBridge = JSBridge
    this.mqttService = MQTTService
  }

  list (data) {
    return http.get({url: `${serviceURL}/getScenes`, data})
  }
	/**
	 * 删除场景
	 * @param {String} options.userId 用户ID
	 * @param {Object} options.seq 会话ID
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  delete (options) {
    const req = options.payload || {}
    if (!req.sceneId) {
      throw new Error('payload.sceneId is required.')
    }
    return this.mqttService.sendData({
      service: SCENE_SERVICE,
      method: 'delSceneReq',
      seq: options.seq || (new Date().getTime() + '').substr(4, 9),
      srcAddr: options.userId || cookies.get('userId'),
      topic: `${TOPIC.serverV1}/${options.userId || cookies.get('userId')}/${SCENE_SERVICE}/delSceneReq`,
      payload: req
    })
  }
  
//test (options) {
//  return this.jsBridge.send({
//    service: 'ABC',
//    action: 'ZXY',
//    data: options
//  })
//}

	/**
	 * 删除场景规则
	 */
  deleteRule (options) {
    const req = options.payload || {}
    if (!req.sceneId) {
      throw new Error('payload.sceneId is required.')
    }
    return this.mqttService.sendData({
      service: SCENE_SERVICE,
      method: 'delSceneRuleReq',
      seq: options.seq || (new Date().getTime() + '').substr(4, 9),
      srcAddr: options.userId || cookies.get('userId'),
      topic: `${TOPIC.serverV1}/${options.userId || cookies.get('userId')}/${SCENE_SERVICE}/delSceneRuleReq`,
      payload: req
    })
  }

	/**
	 * 创建场景
	 */
  create (data) {
    const req = data || {}
    if (!req.sceneName) {
      throw new Error('sceneName is not null')
    }

    if (!req.sceneIcon) {
      throw new Error('sceneIcon is not null')
    }
    
    return http.post({url: `${serviceURL}/create`, data})
  }

	/**
	 * 执行场景
	 */
  execute (options) {
    const req = options.payload || {}
    if (!req.sceneId) {
      throw new Error('payload.sceneId is required.')
    }
    return this.mqttService.sendData({
      service: SCENE_SERVICE,
      method: 'excSceneReq',
      seq: options.seq || (new Date().getTime() + '').substr(4, 9),
      srcAddr: options.userId || cookies.get('userId'),
      topic: `${TOPIC.serverV1}/${options.userId || cookies.get('userId')}/${SCENE_SERVICE}/excSceneReq`,
      payload: req
    })
  }

	/**
	 * 6.2添加场景
	 * @param {String} cookieUserId 用户ID
	 * @param {String} cookieUserToken 用户Token
	 * @param {String} name 场景名
	 * @param{String} icon 场景图标名称
	 * @param{String} homeId 当前家的ID
	 */
  addScene (data) {
    console.log('addScene data = ', data)
    return http.post({url: `${serviceURL}/addScene`, data})
  }

	/**
	 * 6.3编辑场景
	 * @param {String} cookieUserId 用户ID
	 * @param {String} cookieUserToken 用户Token
	 * @param{String} sceneId 场景ID
	 * @param {String} name 场景名
	 * @param {String} icon 场景图标名称
	 * @param {String} homeId 当前家的ID
	 */
  editScene (data) {
    console.log('editScene data = ', data)
    return http.post({url: `${serviceURL}/editScene`, data})
  }

	/**
	 * 6.6获取场景中的设备规则
	 * @param sceneId{String} sceneId 场景ID
	 */
  getSceneRuleReq (options) {
    const req = options.payload || {}
    if (!req.sceneId) {
      throw new Error('payload.sceneId is required.')
    }
    return this.mqttService.sendData({
      service: SCENE_SERVICE,
      method: 'getSceneRuleReq',
      seq: options.seq || (new Date().getTime() + '').substr(4, 9),
      srcAddr: options.userId || cookies.get('userId'),
      topic: `${TOPIC.serverV1}/${options.userId || cookies.get('userId')}/${SCENE_SERVICE}/getSceneRuleReq`,
      payload: req
    })
  }

	/**
	 * 6.8 添加场景规则
	 * @param sceneId{String} 场景ID
	 * @param idx{Int32Array} 规则ID！！！！这个ID应该由云端产生
	 * @param type{String}设备类型 dev
	 * @param devId{String} 设备ID
	 * @param attr{obj} 设备规则属性
	 */
  addSceneRuleReq (options) {
    const req = options.payload || {}

    console.log('addSceneRuleReq req = ', req)
    if (!req.sceneId) {
      throw new Error('payload.sceneId is required.')
    }

    if (!req.id) {
      throw new Error('payload.devId is required.')
    }
    return this.mqttService.sendData({
      service: SCENE_SERVICE,
      method: 'addSceneRuleReq',
      seq: options.seq || (new Date().getTime() + '').substr(4, 9),
      srcAddr: options.userId || cookies.get('userId'),
      topic: `${TOPIC.serverV1}/${options.userId || cookies.get('userId')}/${SCENE_SERVICE}/addSceneRuleReq`,
      payload: req
    })
  }

	/**
	 * 6.10 编辑场景规则
	 * @param sceneId{String} 场景ID
	 * @param idx{Int32Array} 规则ID！！！！这个ID应该由云端产生
	 * @param type{String}设备类型 dev
	 * @param devId{String} 设备ID
	 * @param attr{obj} 设备规则属性
	 */
  editSceneRuleReq (options) {
    const req = options.payload || {}
    console.log('editSceneRuleReq req = ', req)
    if (!req.sceneId) {
      throw new Error('payload.sceneId is required.')
    }

    if (!req.id) {
      throw new Error('payload.devId is required.')
    }
    return this.mqttService.sendData({
      service: SCENE_SERVICE,
      method: 'editSceneRuleReq',
      seq: options.seq || (new Date().getTime() + '').substr(4, 9),
      srcAddr: options.userId || cookies.get('userId'),
      topic: `${TOPIC.serverV1}/${options.userId || cookies.get('userId')}/${SCENE_SERVICE}/editSceneRuleReq`,
      payload: req
    })
  }
  
  /**
* 8.8设置安防密码请求
*/
setSecurityPasswd (options) {
    const req = options.payload || {}
    console.log('setSecurityPasswd req = ', req)

    return this.mqttService.sendData({
      service: 'security',
      method: 'setSecurityPasswdReq',
      seq: options.seq || (new Date().getTime() + '').substr(4, 9),
      srcAddr: options.userId || cookies.get('userId'),
      topic: `${TOPIC.serverV1}/${cookies.get('userId')}/${'security'}/setSecurityPasswdReq`,
      payload: req
    })
  }
}
