/**
 * 此类用于JS与原生交互, 且为单例模式
 */
import mock from '../mock';

let instance = null;
class JSBridge {
  constructor() {
    if (instance) return instance;

    this.callbackQue = {};
    instance = this;
  }

  setwebivewbridge(callback) {
    // 如果原生已经注入的桥对象，直接执行回调
    if (window.WebViewJavascriptBridge) {
      callback(window.WebViewJavascriptBridge);
      return;
    }

    if (window.WVJBCallbacks) {
      window.WVJBCallbacks.push(callback)
      return
    }

    window.WVJBCallbacks = [callback]

    // ios, 按需注入
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      var WVJBIframe = document.createElement('iframe')
      WVJBIframe.style.display = 'none'
      WVJBIframe.src = 'https://__bridge_loaded__' // 通知原生注入jsbridge
      document.documentElement.appendChild(WVJBIframe)
      setTimeout(function () {
        document.documentElement.removeChild(WVJBIframe)
      }, 0)
    }
    // android，启动既注入
    else {
      document.addEventListener('WebViewJavascriptBridgeReady', function () {
        setTimeout(function () {
          var callbacks = window.WVJBCallbacks
          delete window.WVJBCallbacks
          for (var i = 0; i < callbacks.length; i++) {
            callbacks[i](window.WebViewJavascriptBridge)
          }
        }, 0)
      }, false)
    }
  }

  /*
   * js 调用原生方法
   * todo: 重试，超时
   */
  callHandler(url, data, timeout) {
    return new Promise((resolve, reject) => {
      let timer;
      try {
        const date = new Date();
        const requestName = `${data.service}.${data.action}(${date.getHours()}:${date.getMinutes()}:${date.getSeconds()})`;
        this.setwebivewbridge((bridge) => {
          console.info('-----------', requestName, JSON.stringify(data), '-----------');
          console.log('-----------', requestName, data, '----------');
          bridge.callHandler(url, data, (res) => {
            const request_data = data;
            try{
              res = typeof res === 'string' && !/^\s?$/.test(res) ? JSON.parse(res) : res;
            }catch(e){
              console.log("callHandler_____________err____catch")
              console.log(e)
            }
            console.info('-----------', requestName + ' response:', (typeof res === 'string' ? res : JSON.stringify(res)), 'request message:', (typeof request_data === 'string' ? request_data : JSON.stringify(request_data)), '-----------');
            console.log('-----------', requestName + ' response:', res, 'request message:', request_data, '-----------');
            resolve(res);
            clearTimeout(timer);
          });

        });
      } catch (e) {
        clearTimeout(timer);
        reject(e);
      }

      if (typeof timeout === 'number' && timeout >= 0) {
        timer = setTimeout(function () {
          reject({
            code: -1000,
            desc: 'Request timeout!'
          })
        }, timeout)
      }
    })
  }

  /*
   * 监听原生调用
   */
  on(name, callback) {
    if (this.callbackQue[name]) {
      this.callbackQue[name].push(callback)
    } else {
      this.callbackQue[name] = [callback]
    }

    if (process.env.REACT_APP_MOCK) {
      if (name && name.indexOf('.') > -1) {
        const req = name.split('.')
        setTimeout(() => {
          this.callbackQue[name] && this.callbackQue[name].forEach((cb, i) => {
            const mockData = mock({
              service: `H5_${req[0]}`,
              action: req[1]
            })

            if (mockData) {
              cb && cb(mockData)
              if (cb.once) {
                cb = null
              }
            }
          })
        }, 0)
      }
    }
  }
  /*
   * 取消监听
   */
  off(name, callback) {
    var que = this.callbackQue[name]
    if (que && que.length) {
      if (callback) {
        this.callbackQue[name] = que.filter(function (item) {
          return item !== callback
        })
      } else {
        this.callbackQue[name] = []
      }
    }
  }

  /*
   * 监听原生调用，只触发一次
   */
  once (name, callback) {
    callback.once = true
    this.on(name, callback)
  }

  /*
   * js 发送请求给原生
   * params data.service 服务名
   * params data.action 执行动作
   * params data.data 执行动作所需数据
   */
  send (data, timeout = 10000) {
    if (process.env.REACT_APP_MOCK) {
      const mockData = mock(data);
      if(mockData) {
        return new Promise((resolve, reject) => {
          setTimeout(function () {
            Object.keys(mockData).length ? resolve(mockData) : reject({})
          }, 1000)
        })
      }
    }

    return this.callHandler('send', data)
  }

  /**
   * 开始监听原生请求
   */
  listen () {
    this.setwebivewbridge((bridge) => {
      bridge.registerHandler('send', (req) => {
        req = typeof req === 'string' && !/^\s?$/.test(req) ? JSON.parse(req) : req
        const eventName = req.service + '.' + req.action
        console.info('Native call H5-' + eventName + ':', (req.data ? JSON.stringify(req.data) : 'null'))
        // console.log('Native call H5-' + eventName + ':', req.data);
        this.callbackQue[eventName] && this.callbackQue[eventName].forEach((cb, i) => {
          cb && cb(req.data)
          if (cb.once) {
            cb = null
          }
        })
      })
    })
  }
}

export default new JSBridge()
