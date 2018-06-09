import jsBridge from './JSBridge'

let instance = null
class BLEService {
  constructor () {
    if (instance) return instance
    instance = this
  }

  /**
  * 发送蓝牙指令
  * @param {object} data 参数
  * @param {string} data.cmd 指令操作类型，1个字节，如开关灯操作 D0
  * @param {string} data.address 指令操作对象地址，2个字节，如直连灯地址 0000
  * @param {string} data.parameter 指令操作参数，1-10个字节，如开灯 010000
	*/
  sendCommand (data) {
    return jsBridge.send({
      service: 'BLEService',
      action: 'sendCommand',
      data: data
    })
  }

  /**
  * 开始连接
  * @param {object} data 参数
  * @param {string} data.meshName mesh名称 如：6A795D353561
  * @param {string} data.meshPassword mesh密码 如：123456
	*/
  startConnect(data){
    return jsBridge.send({
      service: 'BLEService',
      action: 'startConnect',
      data: data
    });
  }

  /**
  * 开始搜索设备
  * @param {object} data 参数
  * @param {string} data.meshName 搜索复位状态设备mesh名称 如：leedarsonmesh
  * @param {string} data.meshPassword 搜索复位状态设备mesh密码 如：123
	*/
  startScan(data){
    return jsBridge.send({
      service: 'BLEService',
      action: 'sartScan',
      data: data
    });
  }

  /**
  * 停止搜索
  * @param {object} data 参数 （预留，暂时不需要参数）
	*/
  stopScan(data){
    return jsBridge.send({
      service: 'BLEService',
      action: 'stopScan',
      data: data
    });
  }
 
  /**
  * 对新设备设置新的地址及新的mesh
  * @param {object} data 参数
  * @param {string} data.oldAddress 设备旧的地址
  * @param {string} data.newAddress 设备新的地址
  * @param {string} data.oldMeshName 设备旧的mesh名称
  * @param {string} data.newMeshName 设备新的mesh名称
  * @param {string} data.oldMeshPassword 设备旧的mesh密码
  * @param {string} data.newMeshPassword 设备新的mesh密码
  * 
	*/
  setNewAddressAndMesh(data){
    return jsBridge.send({
      service: 'BLEService',
      action: 'setNewAddressAndMesh',
      data: data
    });
  }

  /**
  * 重新开始搜索
  * @param {object} data 参数
  * @param {string} data.meshName 搜索复位状态设备mesh名称 如：leedarsonmesh
  * @param {string} data.meshPassword 搜索复位状态设备mesh密码 如：123
	*/
  scanAgain(data){
    return jsBridge.send({
      service: 'BLEService',
      action: 'scanAgain',
      data: data
    });
  }

  /**
  * 获取蓝牙开关状态
  *
	*/
  getBuleToothStatus(){
    return jsBridge.send({
      service: 'BLEService',
      action: 'getBuleToothStatus',
      data: {}
    });
  }

  /**
   * 打开蓝牙设置页面
   */
  openBuletoothSetting(){
    return jsBridge.send({
      service: 'BLEService',
      action: 'openBuletoothSetting',
      data: {}
    });
  }

  startOta(data){
    return jsBridge.send({
      service: 'BLEService',
      action: 'startOta',
      data: data
    });
  }

  /**
  * 监听设备状态上报
	*/
  onDeviceNofify(cb){
    return jsBridge.on('BLEService.deviceNofify', cb);
  }

  /**
  * 关闭监听设备状态上报
	*/
  offDeviceNofify (cb) {
    jsBridge.off('BLEService.deviceNofify',cb);
    return this;
  }

  /**
  * 监听搜索到新设备
	*/
  OnDevChange(cb){
    return jsBridge.on('BLEService.OnDevChange', cb);
  }

   /**
  * 监听搜索到新设备
	*/
  OffDevChange(){
    jsBridge.off('BLEService.OnDevChange');
    return this;
  }

   /**
  * 监听新设备入网成功
	*/
  onSetNetworkFinish(cb){
    return jsBridge.on('BLEService.onSetNetworkFinish', cb);
  }

   /**
  * 取消监听新设备入网成功
	*/
  offSetNetworkFinish(){
    jsBridge.off('BLEService.onSetNetworkFinish');
    return this;
  }

  /**
  * 监听新设备入网失败
	*/
  onSetNewAddressAndMeshFail(cb){
    return jsBridge.on('BLEService.onSetNewAddressAndMeshFail', cb);
  }

   /**
  * 取消监听新设备入网失败
	*/
  offSetNewAddressAndMeshFail(){
    jsBridge.off('BLEService.onSetNewAddressAndMeshFail');
    return this;
  }

  /**
  * 监听获取峰位版本
	*/
  onConnectionDevFirmWare(cb){
    return jsBridge.on('BLEService.onConnectionDevFirmWare', cb);
  }

  /**
  * 关闭监听获取峰位版本
	*/
  offConnectionDevFirmWare(){
    jsBridge.off('BLEService.onConnectionDevFirmWare');
    return this;
  }

   /**
  * 监听获取峰位id
  */
  onConnectionDevFirmWareId(cb){
    return jsBridge.on('BLEService.onConnectionDevFirmWareId', cb);
  }

  /**
  * 关闭监听获取峰位id
  */
  offConnectionDevFirmWareId(){
    jsBridge.off('BLEService.onConnectionDevFirmWareId');
    return this;
  }

  /**
  * 蓝牙连接状态改变监听 
	*/
  onConnectStatusChange(cb){
    return jsBridge.on('BLEService.onConnectStatusChange', cb);
  }

  /**
  * 蓝牙连接状态改变监听 
	*/
  offConnectStatusChange(){
    jsBridge.off('BLEService.onConnectStatusChange');
    return this;
  }

  /**
  * 蓝牙开关状态改变监听 
	*/
  onBuletoothStatusChange(cb){
    return jsBridge.on('BLEService.onBuletoothStatusChange', cb);
  }

  /**
  * 蓝牙开关状态改变监听 
	*/
  offBuletoothStatusChange(){
    jsBridge.off('BLEService.onBuletoothStatusChange');
    return this;
  }

  /**
  * 蓝牙开关状态改变监听 
	*/
  onGetBuleToothStatus(cb){
    return jsBridge.on('BLEService.onGetBuleToothStatus', cb);
  }

  /**
  * 蓝牙开关状态改变监听 
	*/
  offGetBuleToothStatus(){
    jsBridge.off('BLEService.onGetBuleToothStatus');
    return this;
  }

  /**
  * OTA状态监听
  */
  onDeviceOTAStatusChange(cb){
    return jsBridge.on('BLEService.onDeviceOTAStatusChange', cb);
  }

  /**
  * 关闭OTA状态监听
  */
  offDeviceOTAStatusChange(){
    jsBridge.off('BLEService.onDeviceOTAStatusChange');
    return this;
  }
  
  /**
 * wcb 该代码要合到大一统
 */
	parseIntToString(options){
		let res = parseInt(options).toString(16);
		if(res.length<2){
			res ="0"+parseInt(options).toString(16)+"00"
		}else if(res.length>1){
			res =parseInt(options).toString(16)+"00"
		}
		return res;
	}
	parseIntString(options){
		let res = parseInt(options).toString(16);
		
		if(res.length<2){
			res ="0"+parseInt(options).toString(16)
		}else if(res.length>1){
			res =parseInt(options).toString(16)
		}
		return res;
	}
}

export default new BLEService()
