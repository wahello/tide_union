import uuidv4 from 'uuid/v4';
import JSBridge from './JSBridge';

class SendService {
   constructor() {
     this.listenerQueue = [];
   }
  /**
  * 发送tcp报文
  * @param message {Object} 报文体
  * @return {Promise}
  */
  send(message) {
  
  }
  /**
  * 接受消息
  */
  onReceiveMessage(cb) {
    this.listenerQueue.push(cb);
    JSBridge.on('TCP.pushMessage', cb);
  }
}

export default SendService;
