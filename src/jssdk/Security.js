import Cookies from 'universal-cookie';
import MQTTService, { TOPIC } from './MQTTService';
import http from '../jssdk/Http';
import config from '../config';

const cookies = new Cookies();
const SECURITY_SERVICE = 'security';


/**
* 8.15获取安防规则请求
* @param {String} payload.homeId 家id
* @param {String} payload.securityType 安防类型
*/
export function getSecurityRule(payload) {
  return MQTTService.sendData({
    service: SECURITY_SERVICE,
    method: 'getSecurityRuleReq',
    topic: `${TOPIC.serverV1}/${cookies.get('userId')}/${SECURITY_SERVICE}/getSecurityRuleReq`,
    payload,
  });
}

/**
* 8.3忽略未就绪设备请求
* @param {String} payload.homeId 家id
*
*/
export function bypass(payload) {
   return MQTTService.sendData({
    service: SECURITY_SERVICE,
    method: 'bypassReq',
    topic: `${TOPIC.serverV1}/${cookies.get('userId')}/${SECURITY_SERVICE}/bypassReq`,
    payload,
  });
}

/**
* 8.6获取安防状态请求
* @param {String} payload.homeId 家id
*
*/
export function getStatus(payload) {
   const method = 'getStatusReq';
   return MQTTService.sendData({
    service: SECURITY_SERVICE,
    method,
    topic: `${TOPIC.serverV1}/${cookies.get('userId')}/${SECURITY_SERVICE}/getStatusReq`,
    payload,
  });
}

/**
* 8.8设置安防密码请求
* @param {String} payload.homeId 家id
* @param {String} payload.oldPasswd 旧密码
* @param {String} payload.newPasswd 新密码
*/
export function setSecurityPasswd(payload) {
   return MQTTService.sendData({
    service: SECURITY_SERVICE,
    method: 'setSecurityRuleReq',
    topic: `${TOPIC.serverV1}/${cookies.get('userId')}/${SECURITY_SERVICE}/setSecurityPasswdReq`,
    payload,
  });
}

/**
* 8.13设置安防规则请求
* @param {String} payload.homeId 家id
*
*/
export function setSecurityRule(payload) {
   return MQTTService.sendData({
    service: SECURITY_SERVICE,
    method: 'setSecurityRuleReq',
    topic: `${TOPIC.serverV1}/${cookies.get('userId')}/${SECURITY_SERVICE}/setSecurityRuleReq`,
    payload,
  });
}

/**
* 8.1布置安防请求
* @param {String} req.homeId 家id
* @param {String} req.armMode 安防模式（off:撤防, stay:在家布防, away:离家布防）
*/
export function setArmMode(req) {
  return MQTTService.sendData({
    service: SECURITY_SERVICE,
    method: 'setArmModeReq',
    topic: `${TOPIC.serverV1}/${cookies.get('userId')}/${SECURITY_SERVICE}/setArmModeReq`,
    payload: req,
  });
}

/**
 * 10.5获得安防活动记录
 * @param {String} data.cookieUserId 用户id
 * @param {String} data.cookieUserToken 会话token
 * @param {Number} data.pageSize 每页大小
 * @param {Number} data.offset 偏移量
 * @param {String} data.timestamp 时间戳
 * @return {Promise}
 */
export function getSecurityActivity(data) {
  return http.post({
    url: `${config.httpServer}/activityController/getSecurityActivity`,
    data,
  });
}
