/*
* 原生接口
*/
import jsBridge from './JSBridge'

let instance = null
export default class System {
  constructor () {
    if (instance) {
      return instance
    }

    instance = this
  }

  getDeviceId () {
    // 获取设备id
    return jsBridge.send({
      service: 'System',
      action: 'getDeviceID'
    })
  }

  vibrate (duration) {
    return jsBridge.send({
      service: 'System',
      action: 'vibrate',
      data: {
        duration
      }
    })
  }
  
  stopVibration () {
    return jsBridge.send({
      service: 'System',
      action: 'stopVibration',
      data: {}
    })
  }
  
  connectWifi(option){
  	return jsBridge.send({
      service: 'System',
      action: 'connectWifi',
      data: option
    })
  }

  quitApp () {
    return jsBridge.send({
      service: 'System',
      action: 'quitApp'
    })
  }

  onGoBack (cb) {
    jsBridge.on('System.appGoBack', cb)
    return this
  }

  onceGoBack (cb) {
    jsBridge.once('System.appGoBack', cb)
    return this
  }

  offGoBack (cb) {
    jsBridge.off('System.appGoBack', cb)
    return this
  }

  onNetworkStatusChange (cb) {
    jsBridge.on('System.networkStatus', cb)
    return this
  }

  offNetworkStatusChange (cb) {
    jsBridge.off('System.networkStatus', cb);
    return this
  }

  onAppStatusChange (cb) {
    jsBridge.on('System.applicationStatusChange', cb)
    return this
  }

  offAppStatusChange (cb) {
    jsBridge.off('System.applicationStatusChange', cb)
    return this
  }

  gotoWiFiSetting(){
    //跳转系统WiFi设置页面
    return jsBridge.send({
      service: 'System',
      action: 'gotoWiFiSetting',
      data:{
        url:"App-Prefs:root=WIFI"
      }
    });
  
  }
  getWiFiSSID(){
    //获得手机当前连接WiFi SSID
    return jsBridge.send({
      service: 'System',
      action: 'getWiFiSSID'
    });
  
  }
  takePhoto(params) {
		return jsBridge.send({
			service: 'Camera',
      action: 'takePhoto',
			data: params
		});
	}
	
	choicePhoto(params){
		return jsBridge.send({
			service: 'Camera',
      action: 'getPhoto',
			data:params
		});
	}
}
