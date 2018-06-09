import MQTTService from './MQTTService'
import JSBridge from './JSBridge'

export default class Device {
  constructor () {
    this.jsBridge = JSBridge
		// this.service = new MQTTService(this.jsBridge);
    this.service = MQTTService
  }

  makeRequestHeader (method, data) {
	//	return this.service.makeRequestHeader('ObjectService', method, data);
  }

  queryWithHeader (method, data) {
    var header = this.makeRequestHeader(method, data)
    return this.service.send({url: method, data: header})
  }

  createObject (data) {
    const METHOD = 'createObject'
    return this.queryWithHeader(METHOD, data)
  }

  updateObject (data) {
    const METHOD = 'updateObject'
    return this.queryWithHeader(METHOD, data)
  }

  deleteObject (data) {
    const METHOD = 'deleteObject'
    return this.queryWithHeader(METHOD, data)
  }

  objectControl (data) {
    const METHOD = 'objectControl'
    var header = this.makeRequestHeader(METHOD, data)
    return this.jsBridge.callHandler(METHOD, header)
  }

  queryList (data) {
    const METHOD = 'downloadDataStructure'
    return this.queryWithHeader(METHOD, data)
  }

	/**
	* 拉取最新列表数据
	*/
  updateObjectListCache (timeout) {
    const METHOD = 'updateObjectListCache'
    return this.service.send({url: METHOD, data: null, timeout})
  }

	/**
	* 查询挂载设备
	* @params {Object} params 查询参数
	* @return {Promise}
	*/
  queryMountDevices (data) {
    const METHOD = 'queryMountDevices'
    var header = this.makeRequestHeader(METHOD, data)
    return this.jsBridge.callHandler(METHOD, header)
  }

  deviceMount (data) {
    const METHOD = 'deviceMount'
    return this.queryWithHeader(METHOD, data)
  }

  onMQTTConnected (cb) {
    this.service.onMQTTConnected(cb)
  }

  onceMQTTConnected (cb) {
    this.service.onceMQTTConnected(cb)
  }

  onDeviceMountResponse (cb) {
    this.jsBridge.on('deviceMountResponse', cb)
  }

  offDeviceMountResponse (cb) {
    this.jsBridge.off('deviceMountResponse', cb)
  }
}
