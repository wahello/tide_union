import jsBridge from './JSBridge';

class MQTTBasic {
  /**
  * @param {object} data 初始化所需参数
  * @param {string} data.userName MQTT连接用户名
  * @param {string} data.password MQTT连接密码
  * @param {string} data.clientId MQTT连接所需client id
  */
  init (data) {
    //mqtt状态
    this.status = 0;
    return jsBridge.send({
      service: 'MQTT',
      action: 'init',
      data: data
    });
  }
  

  /**
  * mqtt订阅
  * @param {string} topic 订阅主题
  */
  subscribe (topic) {
    return jsBridge.send({
      service: 'MQTT',
      action: 'subscribe',
      data: topic
    })
  }

  /**
  * 连接MQTT
  * @param {object} data 连接所需参数
  * @param {string} data.mqttIp MQTT连接IP
  * @param {string} data.mqttPort MQTT连接端口
  */
  connect (data) {
    this.mqttIp = data.mqttIp
    this.mqttPort = data.mqttPort

    this.autoConnect();
    return jsBridge.send({
      service: 'MQTT',
      action: 'connect',
      data: data
    });
  }

  /**
  * MQTT重连
  */
  reconnect () {
    console.log(this.mqttIp, this.mqttPort);

    if (!this.mqttIp || !this.mqttPort || this.status === 1) {
      return
    }
    jsBridge.send({
      service: 'MQTT',
      action: 'reconnect',
      data: {
        mqttIp: this.mqttIp,
        mqttPort: this.mqttPort
      }
    })
  }


  /**
  * @param {object} data 断开连接所需参数
  */
  disconnect (data) {
    // if(!this.status) {
    //   return;
    // }
    
    this.cancelAutoConnect();
    return jsBridge.send({
      service: 'MQTT',
      action: 'disconnect',
      data: data
    });
  }

  sendData (options, timeout) {
    return jsBridge.send(options, timeout)
  }
  

  /**
  * 监听mqtt连接成功事件
  * @param cb {Function} 事件回调
  */
  onMQTTConnected (cb) {
    jsBridge.on('MQTT.mqttStatusChange', function (res) {
      if (res.status == 1) {
        cb();
      }
    });
  }

  /**
  * 监听mqtt连接成功事件，只执行一次
  * @param cb {Function} 事件回调
  */
  onceMQTTConnected (cb) {
    jsBridge.once('MQTT.mqttStatusChange', function (res) {
      if (res.status == 1) {
        cb();
      }
    })
  }

  /**
  * 监听mqtt连接断开事件
  * @param cb {Function} 事件回调
  */
  onMQTTDisconnected (cb) {
    jsBridge.on('MQTT.mqttStatusChange', function (res) {
      if (res.status != 1) {
        cb();
      }
    })
  }

  /**
  * 监听mqtt连接状态改变事件
  * @param cb {Function} 事件回调
  */
  onMqttStatusChange (cb) {
    jsBridge.on('MQTT.mqttStatusChange', cb);
  }

  offMqttStatusChange (cb) {
    jsBridge.off('MQTT.mqttStatusChange', cb)
    return this
  }

  /**
  * 监听mqtt消息推送事件
  * @param cb {Function} 事件回调
  */
  onMessageReceive (cb) {
    jsBridge.on('MQTT.pushMessage', cb)
  }

  /**
  * 撤销监听mqtt消息推送事件
  */
  offMessageReceive (cb) {
    jsBridge.off('MQTT.pushMessage', cb)
    return this
  }

  /**
  * 自动重连
  * @param {string} options.retry MQTT自动重连次数
  * @param {string} options.delay 重连间隔基数(重连间隔 = 重连间隔基数 x 重连次数)
  */
  autoConnect (options = {}) {
    const tryTimes = options.retry || 15;
    let countDown = 1;
    //重练间隔基数
    const defer = options.delay || 2000;
    const delayReconnet = () => {
      if(this.mqttStatus) {
        return;
      }
      console.log('-------delayReconnet----------');
      setTimeout(() => this.reconnect(), countDown * defer);
    }
    
    this.handleAutoConnect = (res) => {
      this.status = Number(res.status);
      if (res.status == 1) {
        countDown = 1;
      } else {
        countDown += 1;
        if (countDown <= tryTimes && window.system.networkStatus) {
          delayReconnet();
        } else {
          this.autoConnectFailed();
        }
      }
    };
    this.afterNetworkRecover = (res) => {
      if (res.state == 1) {
        this.reconnect();
      }
    }

    this.onMqttStatusChange(this.handleAutoConnect);
    jsBridge.on('System.networkStatus', this.afterNetworkRecover);
  }

  cancelAutoConnect () {
    jsBridge.off('System.networkStatu', this.afterNetworkRecover);
    this.offMqttStatusChange(this.handleAutoConnect);
    clearTimeout(this.autoConnectTimer);
  }

  /**
  * MQTT连接被踢中断事件
  * @param cb {Function} 事件回调
  */
  onForceQuit (cb) {
    return jsBridge.on('MQTT.forceQuit', cb);
  }

  /**
  * MQTT连接被踢中断事件
  * @param cb {Function} 事件回调
  */
  offForceQuit () {
    return jsBridge.off('MQTT.forceQuit');
  }

  destroy () {
    this.offMessageReceive();
    this.offMqttStatusChange();
    this.offForceQuit();
    this.cancelAutoConnect();
    this.disconnect();
  }

  onAutoConncetFailed(cb) {
    this.autoConnectFailed = cb;
  }

}

export default MQTTBasic;