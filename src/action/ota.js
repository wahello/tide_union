import Device from '../jssdk/device';
import { getHashCode } from '../utils/hashCode';

/**
 * MQTT监听推送回来的消息，接收消息处理
 * @param {Object} res 消息体
 * @return {Promise}
 */
export function onOTAMessageReceive(res) {
  const payload = res.payload;
  const ack = res.ack;
  console.log('onMessageReceive payload: ', payload);
  console.log('onMessageReceive ack: ', ack);
  switch (res.method) {
    // 设置设备属性通知
    case 'updateOtaStautsNotif':
    	{
    		return (dispatch, getState) => {
    			const state = getState();
    			const deviceUpdateInfo = payload;
    			
    			dispatch({
    				type: 'DEVICE_UPDATE_INFO',
    				deviceUpdateInfo,
    			});
    		}
    	}
    case 'updateVerNotif':
    	{
    		return (dispatch, getState) => {
    			const state = getState();
    			const updateVersionNotify = payload;
    			let updateVersionNotifyList = state.ota.updateVersionNotifyList;
    			console.log("123123123",updateVersionNotifyList.length)
    			const len = updateVersionNotifyList.length;
    			
    			if(len == 0){
    				updateVersionNotifyList.push(updateVersionNotify);
    			}
    			
    			for(var i=0;i<len;i++){
    				if(updateVersionNotifyList[i].devId == updateVersionNotify.devId){
    					
    					updateVersionNotifyList[i] = updateVersionNotify;
    					return
    				}else{
    					
    					updateVersionNotifyList.push(updateVersionNotify);
    					return
    				}
    			}
    			
    			dispatch({
    				type: "UPDATE_VERSION_NOTIFY_LIST",
    				updateVersionNotifyList,
    			});
    		}
    	}

    default:
      return {
        type: 'MISSING_TYPE'
      }
  }
}

export const getVersionList = (versionList) => ({
	type: 'GET_VERSION_LIST',
  versionList
})
