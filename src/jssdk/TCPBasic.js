import uuidv4 from 'uuid/v4';
import JSBridge from './JSBridge';

class TCPBasic {

  constructor() {
    this.listenerQueue = [];
    this.isConnected = false;
    this.hasBuildConnection = false;
    this.isConnecting = false;
   
  }

  /**
   * 建立tcp连接
   * @param ip {String} 发送的ip地址
   * @param port {String} 发送的端口
   * @return {Promise}
   */
  connect(ip, port) {
    this.ip = ip;
    this.port = port;
    this.hasBuildConnection = true;
    this.isConnecting = true;
    if (this.isConnected) {
      return Promise.resolve({
        code: 200,
        desc: 'TCP has connected',
      });
    }

    this.sessionId = uuidv4();
    return JSBridge.send({
      service: 'TCP',
      action: 'connect',
      data: {
        ip,
        port,
        sessionId: this.sessionId,
      },
    });
  }

  /**
   * tcp重连
   * @return {Promise}
   */
  reconnect() {
    if (this.isConnected) {
      return Promise.resolve({
        code: 200,
        desc: 'TCP has connected',
      });
    }

    return JSBridge.send({
      service: 'TCP',
      action: 'reconnect',
      data: {
        sessionId: this.sessionId,
      },
    });
  }

  /**
   * tcp断开
   * @return {Promise}
   */
  disconnect() {
    if (!this.isConnected) {
      return Promise.resolve({
        code: 200,
        desc: 'TCP has connected',
      });
    }

    this.offStatusChange();
    return JSBridge.send({
      service: 'TCP',
      action: 'disconnect',
      data: {
        sessionId: this.sessionId,
      },
    });
  }

  /**
   * 发送tcp报文
   * @param message {Object} 报文体
   * @return {Promise}
   */
  send(message) {
    return JSBridge.send({
      service: 'TCP',
      action: 'send',
      data: {
        sessionId: this.sessionId,
        message,
      },
    });
  }

  /**
   * 接受消息
   */
  onReceiveMessage(cb) {
    this.listenerQueue.push(cb);
    JSBridge.on('TCP.pushMessage', cb);

  }

  /**
   * 撤销监听TCP消息推送事件
   */
  offMessageReceive() {
    JSBridge.off('TCP.pushMessage')
    return this
  }

  /*
   * 监听连接状态改变
   */
  onStatusChange(cb) {
    if (this.statusChangeCb) {
      this.offStatusChange();
    }

    this.statusChangeCb = (res) => {
      if (res.sessionId === this.sessionId) {
        this.isConnected = res.status;
          this.isConnecting = false;
        
        
        cb(res.status);
      }
    };

    JSBridge.on('TCP.tcpStatusChange', this.statusChangeCb);
  }

  offStatusChange() {
    JSBridge.off('TCP.tcpStatusChange', this.statusChangeCb);
  }

}

export default TCPBasic;