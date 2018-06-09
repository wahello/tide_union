/*
* 原生接口
*/
import jsBridge from './JSBridge'

let instance = null
export default class Map {
  constructor () {
    if (instance) {
      return instance
    }

    instance = this
  }
  
  /**
   * 调用地图，获取地图选择的经纬度及时区 
   */
  getLocation (options) {
    return jsBridge.send({
      service: 'Map',
      action: 'location',
      data:options
    })
  }
  
  
  getCurrentLocation(){
  	return jsBridge.send({
      service: 'Map',
      action: 'currentLocation',
      data:{}
    })
  }
}
