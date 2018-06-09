import JSBridge from './JSBridge'

const SMART_LINK_SERVICE = 'SmartLink'
let instance = null

export default class SmartLink{
	
	constructor () {
    	if (instance) {
     	 return instance
    	}

    	instance = this
 	}
	
	/**
	 * 配置SmartLink信息
	 */
	config (data) {
	  return JSBridge.send({
	    service: SMART_LINK_SERVICE,
	    action: 'config',
	    data: data
	  },60000)
	}
}

