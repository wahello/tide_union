import jsBridge from './JSBridge';

class UDPBasic {
  /**
  * 发送udp报文
  * @param ip {String} 发送的ip地址
  * @param port {String} 发送的端口
  * @param message {Object} 报文体
  * @return {Promise}
  */
  static send(ip, port, message) {
    return jsBridge.send({
      service: 'UDP',
      action: 'send',
      data: {
        ip,
        port,
        message,
      },
    });
  }

  static onReceiveMessage(cb) {
    jsBridge.on('UDP.pushMessage', cb);
  }
}

export default UDPBasic;

