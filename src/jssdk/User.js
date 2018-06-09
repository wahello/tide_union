import http from '../jssdk/Http'
import config from '../config'
import Cookies from 'universal-cookie'
import helper from '../public/helper'
import MQTTService, { TOPIC } from '../jssdk/MQTTService'

const USER_SERVICE = 'user';
const serviceURL = `${config.httpServer}/user`


export default {
  login(data) {
    return http.post({url: `${serviceURL}/login`, data})
  },

  refreshToken(data) {
    return http.get({url: `${serviceURL}/refreshUserToken`, data});
  },

  logout() {
    return http.post({url: `${serviceURL}/logout`});
  },

  register(data) {
    return http.post({url: `${serviceURL}/register`, data})
  },

  checkUserName(data) {
    return http.get({url: `${serviceURL}/checkUserName/${data.userName}`})
  },

  sendRegistVerifyCode(data) {
    return http.post({url: `${serviceURL}/sendRegistVerifyCode`, data})
  },

  sendResetPwdVerifyCode(data) {
    return http.post({url: `${serviceURL}/sendResetPwdVerifyCode`, data});
  },

  sendPwdErrorVerifyCode(data) {
    return http.post({url: `${serviceURL}/sendPwdErrorVerifyCode`, data});
  },

  changePwd(data) {
    return http.post({url: `${serviceURL}/modifyPwd`, data})
  },

  modifyUserName(data) {
    return http.post({url: `${serviceURL}/updateUser`, data})
  },

  forgetPassword(data) {
    return http.post({url: `${serviceURL}/resetPwd`, data})
  },

    /**
	 * 4.1	上线消息
	 * @param {String} options.userId 用户ID
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  notifyOnline (options = {
    timestamp: helper.formatDate(new Date(), 'yyyy-mm-dd hh:MM:ss')
  }) {
    const cookies = new Cookies();
  	console.log("发送MQTT用户上线消息——>云");
    return MQTTService.sendData({
      service: USER_SERVICE,
      method: 'connect',
      topic: `${TOPIC.broadcastV1}/${cookies.get('userId')}/${USER_SERVICE}/connect`,
      payload: options.payload
    })
  },


	/**
	 * 4.2	下线消息
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  notifyOffline (options =  {
    timestamp: helper.formatDate(new Date(), 'yyyy-mm-dd hh:MM:ss')
  }) {
    const cookies = new Cookies()
  	console.log("发送MQTT下线消息——>云")
    return MQTTService.sendData({
      service: USER_SERVICE,
      method: 'disconnect',
      topic: `${TOPIC.broadcastV1}/${cookies.get('userId')}/${USER_SERVICE}/disconnect`,
      payload: options.payload
    })
  },

  clearAuthorityInfo() {
    const cookies = new Cookies()
    cookies.remove('isLogined')
    cookies.remove('userId')
    cookies.remove('nickName')
    cookies.remove('password')
    cookies.remove('mqttPassword')
    cookies.remove('accessToken')
    cookies.remove('refreshToken')
    cookies.remove('locationId')
    cookies.remove('photoUri')
    localStorage.removeItem('newLogin')
  }

}
