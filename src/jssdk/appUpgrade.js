/*
* 原生接口
*/
import jsBridge from './JSBridge'

let instance = null
export default class AppUpgrade {
  constructor () {
    if (instance) {
      return instance
    }

    instance = this
  }

  checkUpdateH5 (options) {
    // 获取设备id
    return jsBridge.send({
      service: 'AppUpgrade',
      action: 'checkUpdateH5',
      data:options
    })
  }

  startUpdateH5 (options) {
    return jsBridge.send({
      service: 'AppUpgrade',
      action: 'startUpdateH5',
      data: options
    })
  }


  onUpdateProgressNotify (cb) {
    jsBridge.on('AppUpgrade.updateProgressNotify', cb)
    return this
  }

  onceUpdateProgressNotify (cb) {
    jsBridge.once('AppUpgrade.updateProgressNotify', cb)
    return this
  }

  offUpdateProgressNotify (cb) {
    jsBridge.off('AppUpgrade.updateProgressNotify', cb)
    return this
  }

}
