import Cookies from 'universal-cookie'
import JSBridge from '../JSBridge'
import MQTTService, { TOPIC } from '../MQTTService'
import http from '../Http'
import config from '../../config'

const cookies = new Cookies()
const AUTO_SERVICE = 'automation'
let instance = null
const serviceURL = `${config.httpServer}/${AUTO_SERVICE}`
export default class Automation {
  constructor () {
    if (instance) {
      return instance
    }

    this.jsBridge = JSBridge
    this.mqttService = MQTTService
    instance = this
  }
  getAutoList (data) {
    return http.post({url: `${serviceURL}/getAutoList`, data})
  }

  addAuto (data) {
    return http.post({url: `${serviceURL}/addAuto`, data})
  }

  editAuto (data) {
    return http.post({url: `${serviceURL}/editAuto`, data})
  }

	/**
	 * 7.4 删除Automation
	 * @param {String} options.autoId Automation ID
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  delAutomation (options) {
    const req = options.payload || {}
    if (!req.autoId) {
      console.error('options.autoId is required.')
    }
    return this.mqttService.sendData({
      service: AUTO_SERVICE,
      method: 'delAutoReq',
      topic: `${TOPIC.serverV1}/${cookies.get('userId')}/${AUTO_SERVICE}/delAutoReq`,
      payload: req
    })
  }
	/**
	 * 7.6	获取Automation规则
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  getAutoRule (options) {
    const req = options.payload || {}
    if (!req.autoId) {
      console.error('payload.autoId is required.')
    }
    return this.mqttService.sendData({
      service: AUTO_SERVICE,
      method: 'getAutoRuleReq',
      topic: `${TOPIC.serverV1}/${cookies.get('userId')}/${AUTO_SERVICE}/getAutoRuleReq`,
      payload: req
    })
  }
	/**
	 * 7.8	添加Automation规则
	 * @param {String} options.autoId Automation ID
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  addAutoRule (options) {
    const req = options.payload || {}
    console.log('__________req.autoId________________')
    console.log(req.autoId)
    if (!req.autoId) {
      console.error('options.autoId is required.')
    }
    return this.mqttService.sendData({
      service: AUTO_SERVICE,
      method: 'addAutoRuleReq',
      topic: `${TOPIC.serverV1}/${cookies.get('userId')}/${AUTO_SERVICE}/addAutoRuleReq`,
      payload: req
    })
  }

	/**
	 * 7.10	编辑Automation规则
	 * @param {String} options.autoId Automation ID
	 * @param {Object} options.payload 消息体
 	 * @param {Number} options.timeout 超时时间
	 * @return {Promise}
	 */
  editAutoRule (options) {
    const req = options.payload || {}
    if (!req.autoId) {
      console.error('options.autoId is required.')
    }
    return this.mqttService.sendData({
      service: AUTO_SERVICE,
      method: 'editAutoRuleReq',
      topic: `${TOPIC.serverV1}/${cookies.get('userId')}/${AUTO_SERVICE}/editAutoRuleReq`,
      payload: req
    })
  }

	/**
	 * 7.12	设置Automation使能（开关）
	 * @param {String} options.autoId Automation ID
	 * @param {String} options.enable 开关
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  setAutoEnable (options) {
    const req = options.payload || {}
    if (typeof req.autoId !== 'string') {
      console.error('options.autoId is required.')
    }
    if (typeof req.enable !== 'boolean') {
      console.error('options.enable is required.')
    }
    return this.mqttService.sendData({
      service: AUTO_SERVICE,
      method: 'setAutoEnableReq',
      topic: `${TOPIC.serverV1}/${cookies.get('userId')}/${AUTO_SERVICE}/setAutoEnableReq`,
      payload: req
    })
  }
	/**
	 * 7.14	删除Automation规则
	 * @param {String} options.autoId Automation ID
	 * @param {String} options.idx 规则id
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  delAutoRule (options) {
    const req = options.payload || {}
    if (!req.autoId) {
      console.error('options.autoId is required.')
    }
    if (!req.idx) {
      console.error('options.idx is required.')
    }
    return this.mqttService.sendData({
      service: AUTO_SERVICE,
      method: 'delAutoRuleReq',
      topic: `${TOPIC.serverV1}/${cookies.get('userId')}/${AUTO_SERVICE}/delAutoRuleReq`,
      payload: req
    })
  }
}
