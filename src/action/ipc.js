import ipcMqtt from '../jssdk/ipcMqtt';
import ipcTutk from '../jssdk/ipcTutk'

// 音量修改
export function  saveVolume(value){
	return (dispatch,getState) => {
		dispatch({
			type:"SAVE_VOLUME_VALUE",
			value
		})
	}
}
// 语言切换 
export function  saveLanguage(value){
	return (dispatch,getState) => {
		dispatch({
			type:"SAVE_LANGUAGE_VALUE",
			value
		})
	}
}
// ipc角度控制
export function  saveAngle(value){
    return (dispatch,getState) => {
        dispatch({
            type:"SAVE_ANGLE_VALUE",
            value
        })
    }
}
// 侦测灵敏度
export function  saveMotionValue(value){
    return (dispatch,getState) => {
        dispatch({
            type:"SAVE_MOTION_VALUE",
            value
        })
    }
}
// ipc指示灯开关
export function  saveLampValue(value){
    return (dispatch,getState) => {
        dispatch({
            type:"SAVE_LAMP_VALUE",
            value
        })
    }
}
// ipc设备时区
export function  saveTimezone(value){
    return (dispatch,getState) => {
        dispatch({
            type:"SAVE_TIME_ZONE",
            value
        })
    }
}
// ipc事件推送通知开关
export function  saveEvent(value){
  return (dispatch,getState) => {
      dispatch({
        type:"SAVE_EVENT_VALUE",
        value
      })
  }
}
// ipc 修改房间保存房间名称
export function  saveIpcRoomname(value){
	return (dispatch,getState) => {
		dispatch({
			type:"SAVE_CAMERA_ROOMNAME",
			value
		})
	}
}
// 录影计划参数
export function  saveIpcdata(ipcItem){
	return (dispatch,getState) => {
		dispatch({
			type:"SAVE_CAMERA_DATA",
			ipcItem
		})
	}
}
// 录影计划周期参数
export function  saveIpcCycle(cycleItem){
	return (dispatch,getState) => {
		dispatch({
			type:"SAVE_IPC_CYCLE",
			cycleItem
		})
	}
}
// camera 名字修改
export function  saveCamerName(value){
	return (dispatch,getState) => {
		dispatch({
			type:"SAVE_CAMERA_NAME",
			value
		})
	}
}


// 获取版本列表
export function getVerList(request) {
	return (dispatch, getState) => {
		return ipcMqtt.getVerListReq(request).then(res => {
			dispatch({
				type: 'FETCH_VERSION_LIST_SUCCESS',
				verList: res.payload.verList
			})
			return res
		}).catch((err) => {
			return err
		})
	}
}
// 更新版本操作
export function excOta(request){
	return (dispatch, getState) => {
		return ipcMqtt.excOtaReq(request).then(res => {
			dispatch({
				type: 'OTA_UPDATE_STATUS',
				otaStatus: res.payload
			})
			return res.payload
		}).catch((err) => {
			return err
		})
	}
}
// 获取是否有SD卡
export function getHavSD(request){
	return (dispatch,getState)=>{
		return ipcMqtt.getHavSD(request).then(res=>{
			if(res.ack.code !== 200)  return res.ack
			dispatch({
				type: 'SET_HAS_SD_CARD',
				havsd:res.payload.havsd
			})
			return res
		}).catch((err) => {
			return err
		})
	}
}

// 获取SD卡录影配置
export function getSDRecordConfig(request){
	return (dispatch, getState) => {
		return ipcMqtt.getSDRecordConfig(request).then(res => {
			if(res.ack.code !== 200)  return res.ack
			console.log("getSDRecordConfig")
			console.log(res);
			dispatch({
				type: 'GET_SD_RECORD_CONFIG',
				SDRecordConfig:res.payload
			})
			return res
		}).catch((err) => {
			return err
		})
	}
}

// SD卡格式化
export function setSDFormat(request){
	return (dispatch, getState) => {
		return ipcMqtt.setSDFormat(request).then(res => {
			dispatch({
				type:"SD_CARD_FORMAT",
				rescode:res.ack
			})
			return res
		}).catch((err) => {
			return err
		})
	}
}

// 设备Reboot
export function setReboot(request){
	return (dispatch, getState) => {
		return ipcMqtt.setReboot(request).then(res => {
			dispatch();
			return res.ack
		}).catch((err) => {
			return err
		})
	}
}
// 设备Reset
export function setReset(request){
	return (dispatch, getState) => {
		return ipcMqtt.setReset(request).then(res => {
			dispatch();
			return res.ack
		}).catch((err) => {
			return err
		})
	}
}

// 获取SD卡一小时视频
export function getSDOneHourList(request){
	return (dispatch, getState)=>{
		dispatch({
			type:"GET_SDCARD_ONE_HOUR_LIST",
			hour:request.data.hour
		});
		return ipcTutk.sendTutk(request).then(res => {
			if(res.state === 1){
				dispatch({
					type:"GET_SDCARD_ONE_HOUR_LIST_SUCCESS",
					eventlist:res.desc.eventlist
				})
			}else{
				dispatch({
					type:"GET_SDCARD_ONE_HOUR_LIST_FAILURE",
					errorinfo:res.errorinfo
				});
			}
			return res;
		}).catch((err) => {
			dispatch({
				type:"GET_SDCARD_ONE_HOUR_LIST_FAILURE",
				errorinfo:err
			});
			return err;	
		})
	}
}
// 获取SD卡近三天视频节点
export function getTimeList(request){
	return (dispatch, getState)=>{
		dispatch({
			type:"GET_TIME_LIST_INFO",
			requestDateInterval:request.data
		});
		return ipcTutk.sendTutk(request).then(res => {
			if(res.state === 1){
				dispatch({
					type:"GET_TIME_LIST_INFO_SUCCESS",
					timeListInfo:res.desc.periodList
				});
			}else{
				dispatch({
					type:"GET_TIME_LIST_INFO_FAILURE",
					errorInfo:res.errorinfo
				});
			}
			return res
		}).catch((err) => {
			dispatch({
				type:"GET_TIME_LIST_INFO_FAILURE",
				errorInfo:err
			});
			return err;
		})
	}
}


// 保存WIFI数据
export function saveWifiSetting(data){
	return (dispatch, getState)=>{
		dispatch({
			type:"SAVE_WIFI_SETTING",
			wifi:data
		});
	}
}

//保存mqtt、设备在线状态
export function saveOnlineState(data){
	return (dispatch, getState) => {
		dispatch({
			type:"SAVE_ONLINE_STATE",
			onlineState:data
		});
	}
}


// 静态触发

// 清空播放列表
export const clearTimeListInfo = () => ({
  type: 'CLEAR_TIME_LIST_INFO'
})

// 更改SD卡模式
export const changeSDCardMode = (request)=>({
	type:"CHANGE_SD_RECORD_MODE",
	SDRecordMode:request
})

// 解绑删除IPC
export const unBindIPCDev = (request) =>　({
	type:"UPDATE_DEVICE_LIST",
	list:request
})