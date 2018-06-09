import jsBridge from '../jssdk/JSBridge';
import config from '../config';
import Cookies from 'universal-cookie';
const cookies = new Cookies()

const listenOnTutk = function(option,callback){
  jsBridge.on(option.service+"."+option.action, res=>{callback(res)})
}

const listenOffTutk = function(option){
  jsBridge.off(option.service+"."+option.action)
}


export default{
  

  sendTutk(option){
    if (process.env.REACT_APP_MOCK) {
      let {service,action} = option 
      option = {
        service: 'MQTT',
        action: 'public',
        data: {
          message:{
            method:action
          },
          topic:service,
        }
      }
    }
    return jsBridge.send(option)
  }
  /**
	 * 获取SD卡录影信息
	 * @param {Object} options.userId 用户id
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  // getTimeList(option){
  //   return sendTutk(option)
  // },

  // getSDOneHourList(option){
  //   return sendTutk(option)
  // }
}