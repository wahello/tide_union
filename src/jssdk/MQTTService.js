import Cookies from 'universal-cookie';
import jsBridge from './JSBridge';
import MQTTBasic from './MQTTBasic';
import helper from '../public/helper'
import Toast from 'antd-mobile/lib/toast';
import 'antd-mobile/lib/toast/style/css';
import userApi from './User';
import { Lang } from '../public';
const cookies = new Cookies();
const TOPIC_HEADER = 'iot';
const TOPIC_VERSION = 'v1';

const TOPIC = {
  clientV1: `${TOPIC_HEADER}/${TOPIC_VERSION}/c`,
  serverV1: `${TOPIC_HEADER}/${TOPIC_VERSION}/s`,
  broadcastV1: `${TOPIC_HEADER}/${TOPIC_VERSION}/cb`,
};

let instance = null;
class MQTTService extends MQTTBasic {
  constructor() {
    super();
    if (instance){
      return instance;
    }

    instance = this;
  }

  connect (data) {
    // if(this.status) {
    //   return Promise.resolve({
    //     ack: {
    //       code: 200,
    //       desc: 'mqtt has already connected'
    //     }
    //   });
    // }

    return super.connect(data);
  }

  disconnect() {
    // if(this.status) {
    //   userApi.notifyOffline();
    // }
    
    // this.status = 0;
    userApi.notifyOffline();
    return super.disconnect();
  }

  subscribe(topic) {
    return super.subscribe(topic).then(res => {
      if(res.code === 200) {
        userApi.notifyOnline();
      }

      return res;
    });
  }

  sendData (req) {
    let {topic, timeout, ...message} = req
    message.seq = (new Date().getTime() + '').substr(4, 9)
//  message.srcAddr = `0.${cookies.get('userId')}`
		message.srcAddr = `${cookies.get('userId')}`;
		console.log("seq的通知",message.seq)
    const data = {
      message
    };

    const sendRequest = (resolve, reject) => {
      console.log('================发送请求',message,window.system.mqttStatus)
      const dueTime = timeout || 10 * 1000;
      
//    if(!window.system.networkStatus){
//    	if(['setDevAttrReq','excSceneReq','setArmModeReq','bypassReq'].indexOf(message.method) == -1) {
//          Toast.info(Lang.public.cannotControl);
//          return;
//        }
//    }
      
      if(!window.system.mqttStatus) {
        if(window.tcpToGateway && window.tcpToGateway.isConnected){
          if(['setDevAttrReq','excSceneReq','setArmModeReq','bypassReq'].indexOf(message.method) == -1) {
            Toast.info(Lang.public.cannotControl);
            return;
          }
          
          window.tcpToGateway.send(message, dueTime).then(res => {
            resolve(res);
          }).catch(err => {
            reject(err);
          });
        }else{
          //重连
           if(window.tcpToGateway)window.tcpToGateway.reconnectTCP();
        }
      }else{
        super.sendData({
          service: 'MQTT',
          action: 'public',
          data:{
            topic,
            message
          }
        }, dueTime).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        });
      }

     
    }
    

    return new Promise((resolve, reject) => {
      //if (window.system.mqttStatus == 1) {
        sendRequest(resolve, reject);
      // } else {
      //   reject({
      //     ack: {
      //       code: -1001,
      //       desc: 'MQTT disconnected'
      //     }
      //   });
      // }
    })
  }

}

export default new MQTTService();
export {
  TOPIC,
};
