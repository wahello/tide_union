import Cookies from 'universal-cookie';
import UDPBasic from './UDPBasic';

let instance = null;
class UDPService {
  constructor() {
    if (instance) return instance;
    instance = this;
  }

  /**
  * 发送udp报文
  * @param ip {String} 发送的ip地址
  * @param port {String} 发送的端口
  * @param message {Object} 报文体
  * @param interval {Number} 重试间隔
  * @param retryTimes {Number} 重试次数
  * @return {Promise}
  */
  sendData(ip, port, message, interval, retryTimes) {
    const that = this;
    const fakePromise = {
      resolve: function fakePromiseResolve() {},
      reject: function fakePromiseReject() {},
      then: function fakePromiseFake(cb) {
        this.resolve = cb;
        return this;
      },
      catch: function fakePromiseCatch(cb) {
        this.reject = cb;
        return this;
      },
    };

    const reqInterval = interval || 1500;

    let timer;
    let count = typeof retryTimes === 'number' ? retryTimes : 3;
    let seq;
    const request = function sendUDPRequest() {
      const cookies = new Cookies();
      seq = String(new Date().getTime()).substr(4, 9);
      const Wrapedmessage = {
        ...message,
        seq: message.seq || seq,
        srcAddr: cookies.get('userId'),
      };
      UDPBasic.send(ip, port, Wrapedmessage);
      count -= 1;
      timer = setTimeout(() => {
        if (count > 0) {
          request();
        } else {
          clearTimeout(timer);
          fakePromise.reject({
            code: -1000,
            desc: 'UDP request timeout',
          });
        }
      }, reqInterval);
    };

    UDPBasic.onReceiveMessage((res) => {
      console.log('-------------udp receive message---------------------', res.seq, seq);
      if (res && res.seq === seq) {
        clearTimeout(timer);
        fakePromise.resolve(res);
      }

      // if(process.env.NODE_ENV === 'development'){
      // clearTimeout(timer);
      // fakePromise.resolve(res);
      // }
    });
    request();

    return fakePromise;
  }
}

export default new UDPService();

