import Device from '../jssdk/device';
import ipcHttp from '../jssdk/ipcplan';
import { getHashCode } from '../utils/hashCode';
import { executeSQL, querySQL } from '../jssdk/db';
import { ftruncate } from 'fs';

function dedupe(array){
  return Array.from(new Set(array)); 
} 

export function initDeviceData() {
  return (dispatch) => {
    dispatch({
      type: 'INIT_DEVICE_DATA'
    });
  }
}

/* --- 获取首页设备列表 --- */
function fetchHomeDevicesSucces(deviceInfo) {
  return {
    type: 'FETCH_HOME_DEVICES_SUCCESS',
    deviceInfo,
  };
}


function fetchHomeDevicesFailure(err) {
  return {
    type: 'FETCH_HOME_DEVICES_FAILURE',
    err,
  };
}

export function refreshDevice(request){
  return (dispatch, getState) => {
    dispatch({
      type: 'FETCH_HOME_DEVICES_REQUEST'
    });

    const deviceList = [];
    for (let itemKey in request.deviceInfo.items){
      deviceList.push(request.deviceInfo.items[itemKey]);
    }

    const list = [];
    const items = {};
    
    const state = getState();
    const roomItems = state.room.items;
    const unbindDevices = []; // 未绑定房间设备
    const directDevIds = []; // 直连设备
    const writeableIds = []; // 可控设备ID数组
    const unwriteableIds = []; // 不可控
    const homeId = state.family.currentId;

    if (deviceList.length) {
      deviceList.map((item) => {
        if (!item.roomId || item.roomId == 0 || item.roomId === homeId) {
          unbindDevices.push(item.devId);
        }
        item.roomName = '';
        if (item.roomId && roomItems[item.roomId]) {
          item.roomName = roomItems[item.roomId].name;
        }
        if (item.roomId === 0 || item.roomId === '0') {
          item.roomName = 'Default room';
        }
        console.log('item icon', item.icon)
        if (!item.icon || item.icon === 'default') {
          console.log('item devType', item.devType)
          const iconObj = {
            lighting: 'lighting',
            light_colortemperature: 'lighting',
            light_colourtemperature: 'lighting',
            light_dimmable: 'lighting',
            light_rgbw: 'lighting',

            sensor: 'door_lock',
            sensor_doorlock: 'door_lock',

            sensor_pir: 'motion',
            sensor_motion: 'motion',
            motion: 'motion',

            siren: 'siren',
            alarm_siren: 'siren',

            gateway: 'gateway',
            multi_gateway: 'gateway',
            smartplug_meter: 'plug',
            remote: 'remote',
          };
          let icon = 'default';
          if (item.devType) {
            if (iconObj[item.devType.toLowerCase()] != undefined) {
              icon = iconObj[item.devType.toLowerCase()];
            }
          }
          item.icon = icon;
        }
        items[item.devId] = item;
        if (item.devType === 'Multi_Gateway') {
          directDevIds.push(item.devId);
        }

        if (item.devType && ((item.devType.toLowerCase().indexOf('light') > -1)||(item.devType.toLowerCase().indexOf('plug') > -1))) {
          writeableIds.push(item.devId);
        }
         else if (item.devType.toLowerCase().indexOf('plug') < 0) {
          unwriteableIds.push(item.devId);
        }
        list.push(item.devId);
      });
    }

    const devices = {
      seq: undefined,
      totalCount:deviceList.length,
      list:request.deviceInfo.list,
      items:request.deviceInfo.items,
      unbindDevices,
      directDevIds,
      writeableIds,
      unwriteableIds
    }

    dispatch(fetchHomeDevicesSucces(devices));
  }
 
}


export function fetchHomeDevices(request) {
  return (dispatch, getState) => {
    const handleData = (res) => {
        const { payload } = res;
        const deviceList = payload.dev;
        const list = [];
        const items = {};

        const state = getState();
        const roomItems = state.room.items;
        const unbindDevices = []; // 未绑定房间设备
        const directDevIds = {
        	gateway: [],
        	devices: [],        	
        }; // 直连设备
        const writeableIds = []; // 可控设备ID数组
        const unwriteableIds = []; // 不可控
        const homeId = state.family.currentId;
        var promiseList= [];
        if (deviceList.length) {
          deviceList.map((item) => {
            if (!item.roomId || item.roomId == 0 || item.roomId === homeId) {
              unbindDevices.push(item.devId);
            }
            item.roomName = '';
            if (item.roomId && roomItems[item.roomId]) {
              item.roomName = roomItems[item.roomId].name;
            }
            if (item.roomId === 0 || item.roomId === '0') {
              item.roomName = 'Everything else';
            }
            console.log('item icon', item.icon)
            if (!item.icon || item.icon === 'default') {
              console.log('item devType', item.devType)
              const iconObj = {
                lighting: 'lighting',
                light_colortemperature: 'lighting',
                light_colourtemperature: 'lighting',
                light_dimmable: 'lighting',
                light_rgbw: 'lighting',

                sensor: 'door_lock',
                sensor_doorlock: 'door_lock',
                sensor_pir: 'motion',
                sensor_motion: 'motion',
                motion: 'motion',

                siren: 'siren',
                alarm_siren: 'siren',

                gateway: 'gateway',
                multi_gateway: 'gateway',
                smartplug_meter: 'plug',
                remote: 'remote',
              };
              let icon = 'default';
              if (item.devType) {
                if (iconObj[item.devType.toLowerCase()] != undefined) {
                  icon = iconObj[item.devType.toLowerCase()];
                }
              }
              item.icon = icon;
            }
            if (item.devType === 'Multi_Gateway' || item.devType === 'Siren_Hub') {
              directDevIds.gateway.push(item.devId);
            }else if (item.devType.toLowerCase().indexOf('wifi_plug') >= 0){
            	directDevIds.devices.push(item.devId);
            }

            if (item.devType && ((item.devType.toLowerCase().indexOf('light') > -1) || item.devType.toLowerCase().indexOf('wifi_plug') > -1)) {
              writeableIds.push(item.devId);
            } else if (item.devType.toLowerCase().indexOf('wifi_plug') < 0) {
              unwriteableIds.push(item.devId);
            }

            if(item.devType == 'IPC'){
          		if(item.devId != ''){
          			item.planId = null;
                item.packageType = null;
                promiseList.push(	ipcHttp.getP2pId('deviceId=' + item.devId).then(res => {
          				if(res.code != 200){
          					dispatch(fetchHomeDevicesFailure(res.desc));
          					return;
          				}
                  item.p2pId = res.data;
                  items[item.devId] = item;
								}).catch(err => {}));
                promiseList.push(	ipcHttp.getPlanType('deviceId=' + item.devId).then(res => {
                  if(res.data){
                    item.planId = res.data.planId;
                    item.packageType = res.data.packageType;
                  }　
                  items[item.devId] = item;
                }).catch(err=>{
                  item.planId = null;
                  item.packageType = null;
                }))
          		}
            }
            items[item.devId] = item;
            list.push(item.devId);
          });
        }
        Promise.all(promiseList).then((res)=>{
          const devices = {
            seq: res.seq,
            totalCount: payload.totalCount,
            list,
            items,
            unbindDevices,
            directDevIds,
            writeableIds,
            unwriteableIds,
            isFirstIn: request.isFirstIn
          }
          dispatch(fetchHomeDevicesSucces(devices));
        }).catch(err=>{
          console.log(err)
        })
    }
    const deviceApi = new Device();

    dispatch({
      type: 'FETCH_HOME_DEVICES_REQUEST'
    });

    //待处理，此处需要兼容ble local版本，调试临时注释
    const { mqttStatus } = getState().system;
    if(!mqttStatus && !request.isFirstIn && window.globalState.isLocal == 0) {
      return querySQL(`SELECT value FROM tb_lds_cache WHERE name='deviceList_cache_${request.payload.homeId}'`).then(res => {
        if(res.code === 200 && res.data.length) {
          handleData(JSON.parse(res.data[0].value));
        }

        return res;
      });
    }

    console.log('获取设备列表请求参数:', request)
    return deviceApi.getDevListReq(request)
      .then((res) => {
        console.log('获取设备列表:', res)
        const payload = res.payload;
        if (res.ack.code != 200) {
          dispatch(fetchHomeDevicesFailure(res.ack));
          return;
        }
        
        querySQL(`SELECT value FROM tb_lds_cache WHERE name='deviceList_cache_${request.payload.homeId}'`).then(r => {
          if(r.code === 200 && r.data.length) {
            executeSQL(`UPDATE tb_lds_cache SET value='${JSON.stringify(res)}' WHERE name='deviceList_cache_${request.payload.homeId}'`);
            return;
          }

          executeSQL(`INSERT INTO tb_lds_cache(name, value) VALUES('deviceList_cache_${request.payload.homeId}', '${JSON.stringify(res)}')`);
        });
        handleData(res);
      })
      .catch((err) => {
        dispatch(fetchHomeDevicesFailure(err));
      })
  }
}

/* --- 获取首页设备列表 --- */

/* --- 设置设备属性请求 --- */
function setDeviceAttrFailure(err) {
  return {
    type: 'SET_DEVICE_ATTR_FAILURE',
    err,
  };
}

function setDeviceAttrSucces(response) {
  return {
    type: 'SET_DEVICE_ATTR_SUCCESS',
    response,
  };
}

export function setDeviceAttr(request) {
  return (dispatch, getState) => {
    dispatch({
      type: 'SET_DEVICE_ATTR_REQUEST'
    });
    const deviceApi = new Device();
    return deviceApi.setDevAttrReq(request)
      .then((res) => {
        console.log(console.log('控制设备属性响应：', res))
        const payload = res.payload;
        if (res.ack.code != 200) {
          dispatch(setDeviceAttrFailure(res.ack));
          return;
        }

        const state = getState();
        const item = state.device.items[request.payload.devId];
        const newAttr = Object.assign(item.attr, request.payload.attr);
        item.attr = newAttr;

        dispatch(setDeviceAttrSucces({
          devId: request.payload.devId,
          item
        }));
      })
      .catch((err) => {
        dispatch(setDeviceAttrFailure(err));
      });
  }
}

// 修改设备名称
export function setDeviceName(request) {
  return (dispatch, getState) => {
    dispatch({
      type: 'SET_DEVICE_ATTR_REQUEST'
    });
    const deviceApi = new Device();
    return deviceApi.setDevInfoReq(request)
      .then((res) => {
        console.log(console.log('修改设备名称：', res))
        const payload = res.payload;
        if (res.ack.code != 200) {
          dispatch(setDeviceAttrFailure(res.ack));
          return;
        }
        const state = getState();
        const item = state.device.items[request.payload.devId];
        const newName = request.payload.name;
        const newIcon = request.payload.icon;
        const newRoomname = request.payload.roomName
        const newRoomId = request.payload.roomId
        item.name = newName;
        item.icon = newIcon;
        item.roomName = newRoomname;
        item.roomId = newRoomId;
        dispatch(setDeviceAttrSucces({
          devId: request.payload.devId,
          item
        }));
      })
      .catch((err) => {
        dispatch(setDeviceAttrFailure(err));
      });
  }
}

/* ---获取单个设备的记录 --- */

function fetchDevActivitySucces(record) {

  return {
    type: 'FETCH_DEV_ACTIVITY_SUCCESS',
    record,
  };
}

function fetchDevActivityFailure(err) {
  return {
    type: 'FETCH_DEV_ACTIVITY_FAILURE',
    err,
  };
}
export function setEmpty(){
  return(dispatch)=>{
    const recordList =  [];
    const count = 0;
    const currentNum = 0;
    dispatch(fetchDevActivitySucces({
      recordList,
      count,
      currentNum
    }));
  }
}
export function fetchDevActivity(request) {
  return (dispatch) => {
    dispatch({
      type: 'FETCH_DEV_ACTIVITY_REQUEST',
    });
    const deviceApi = new Device();
    return deviceApi.getDevActivity(request)
      .then((res) => {

        // 请求失败
        if (res.code != 200) {
          dispatch(fetchDevActivityFailure(res));
          return;
        }

        // 数据再处理
        const recordList = res.data.result || [];
        const count = res.data.pages;
        const currentNum = res.data.pageNum;



        dispatch(fetchDevActivitySucces({
          recordList,
          count,
          currentNum
        }));
      })
      .catch((err) => {
        console.log(err);
        dispatch(fetchDevActivityFailure(err));
      });
  }
}

/* ---删除单个设备的记录 --- */

function deleteDevActivitySucces(record) {

  return {
    type: 'DELETE_DEV_ACTIVITY_SUCCESS',
    record,
  };
}

function deleteDevActivityFailure(err) {
  return {
    type: 'DELETE_DEV_ACTIVITY_FAILURE',
    err,
  };
}

export function deleteDevActivity(request) {
  return (dispatch) => {
    dispatch({
      type: 'DELETE_DEV_ACTIVITY_REQUEST',
    });
    const deviceApi = new Device();
    return deviceApi.delDevActivity(request)
      .then((res) => {
        // 请求失败
        if (res.code != 200) {
          dispatch(deleteDevActivityFailure(res));
          return;
        }

        // 数据再处理

        const desc = res.desc;
        const recordList = [];
        const count = 0;
        const currentNum = 0;

        dispatch(deleteDevActivitySucces({
          desc,
          recordList,
          count,
          currentNum
        }));
      })
      .catch((err) => {
        console.log(err);
        dispatch(deleteDevActivityFailure(err));
      });
  }
}

/* ---获取全部设备的记录 --- */

function fetchAllDevActivitySucces(record) {

  return {
    type: 'FETCH_ALL_DEV_ACTIVITY_SUCCESS',
    record,
  };
}

function fetchAllDevActivityFailure(err) {
  return {
    type: 'FETCH_ALL_DEV_ACTIVITY_FAILURE',
    err,
  };
}

export function fetchAllDevActivity(request) {
  return (dispatch) => {
    dispatch({
      type: 'FETCH_ALL_DEV_ACTIVITY_REQUEST',
    });
    const deviceApi = new Device();
    return deviceApi.getAllDevActivity(request)
      .then((res) => {

        // 请求失败
        if (res.code != 200) {
          dispatch(fetchAllDevActivityFailure(res));
          return;
        }

        const recordList = res.data.result || [];
        const count = res.data.pages;
        const currentNum = res.data.pageNum;

        dispatch(fetchAllDevActivitySucces({
          recordList,
          count,
          currentNum
        
        }));
      })
      .catch((err) => {
        console.log(err);
        dispatch(fetchAllDevActivityFailure(err));
      });
  }
}

/* ---删除全部设备的记录 --- */

function deleteAllDevActivitySucces(record) {

  return {
    type: 'DELETE_ALL_DEV_ACTIVITY_SUCCESS',
    record,
  };
}

function deleteAllDevActivityFailure(err) {
  return {
    type: 'DELETE_ALL_DEV_ACTIVITY_FAILURE',
    err,
  };
}

export function deleteAllDevActivity(request) {
  return (dispatch,getState) => {
    dispatch({
      type: 'DELETE_ALL_DEV_ACTIVITY_REQUEST',
    });
    const deviceApi = new Device();
    return deviceApi.delAllDevActivity(request)
      .then((res) => {
        // 请求失败
        if (res.code != 200) {
          dispatch(deleteAllDevActivityFailure(res));
          return;
        }
        const desc = res.desc;
        dispatch(deleteAllDevActivitySucces({
          desc
        }));
      })
      .catch((err) => {
        console.log(err);
        dispatch(deleteAllDevActivityFailure(err));
      });
  }
}


export function saveDeviceItem(deviceItem) {
  return (dispatch, getState) => {
    dispatch({
      type: 'SAVE_DEVICE_ITEM_DATA',
      deviceItem,
    });
  }
}

/**
 * MQTT监听推送回来的消息，接收消息处理
 * @param {Object} res 消息体
 * @return {Promise}
 */
export function onMessageReceive(res) {
  const payload = res.payload;
  const ack = res.ack;
  console.log('onMessageReceive payload: ', payload);
  console.log('onMessageReceive ack: ', ack);
  switch (res.method) {
    // 设置设备属性通知
    case 'setDevAttrNotif':
    case 'devStatusNotif':
      {
        return (dispatch, getState) => {
          // if (ack.code != 200) {
          //   return dispatch({
          //     type: 'ATTR_NOTIFY_FAIL'
          //   });
          // }

          const state = getState();
          const deviceItems = Object.assign({}, state.device.items);
          console.log('deviceItems=======: ', deviceItems);
          const notifyDevice = deviceItems[payload.devId];
          console.log('notifyDevice=======: ', notifyDevice);
          if (!notifyDevice) {
            dispatch({
              type: 'NOT_FOUND_DEVICE',
              deviceItems,
            });
            return;
          }

          console.log('old_Attr: ', notifyDevice.attr);
          let hasOnlyCCT = payload.attr.CCT !== undefined;
          let hasOnlyRGBW = payload.attr.RGBW !== undefined;
          console.log('payload_Attr: ', payload.attr);
          const newAttr = Object.assign(notifyDevice.attr, payload.attr);
          console.log('new_Attr: ', newAttr);
          if (hasOnlyCCT && newAttr.RGBW !== undefined) {
            delete newAttr.RGBW;
          }
          if (hasOnlyRGBW && newAttr.CCT !== undefined) {
            delete newAttr.CCT;
          }

          console.log('after_delete_Attr: ', newAttr);
          notifyDevice.attr = newAttr;
          dispatch({
            type: 'DEV_STATUS_NOTIFY',
            deviceItems,
          });
        }
      }
    case 'addDevNotif':
      {
        return (dispatch, getState) => {
          // addDevNotifyList
          const state = getState();
          const addedList = state.device.addDevNotifyList || [];
          let devNotifyList = Object.assign([], addedList);

          let hasAdded = [];
          if (devNotifyList.length) {
            hasAdded = devNotifyList.filter((dev) => {
              return dev.devId === payload.devId;
            })
          }
          
          const devSimpleType = {
            Light_ColorTemperature: 'Light_CCT',
            Light_ColourTemperature: 'Light_CCT',
            Light_Dimmable: 'Light_Dim',
            Light_RGBW: 'Light_RGB',
            Sensor_Doorlock: 'Door/Window',
            Sensor_PIR: 'Motion',
            Sensor_Motion: 'Motion',
            Alarm_Siren: 'Siren',
            Multi_Gateway: 'Gateway',
            Smartplug_Meter: 'Plug',
            remote: 'remote',
            SirenHub: 'SirenHub',
            Sensor_Keypad: 'Keypad',
            Sensor_Keyfob: 'Keyfob',
            light: 'lighting',
            gateway: 'multi_gateway',
            plug: 'plug',         
            magnet: 'door/window',
            motion: 'motion',
            camera: 'camera',
            keyfob: 'keyfob',
            keypad: 'keypad'
          }


          if (hasAdded.length === 0) {
            const code = getHashCode();
            let str = payload.productId; 
            let arr = str.split(".");
            let devType =  arr[1];
            const simpleName = devSimpleType[devType] !== undefined ? devSimpleType[devType] : devType;
            devNotifyList.push({
              devId: payload.devId,
              devType: payload.devType,
              productId: payload.productId,
              name: devSimpleType[devType] !== undefined ? `${simpleName}_${code}` : simpleName,
              deviceSelect: false,
            });
          }

          dispatch({
            type: 'ADD_DEV_NOTIFY',
            devNotifyList,
          });
        }
      }
    case 'statusChangedNotif':
      {
        return (dispatch, getState) => {
          console.log("____________安防状态更新通知_______________________",payload)
          const status = payload.status;
          console.log('安防状态 status: ', payload.status);

          dispatch({
            type: 'STATUS_CHANGE_NOTIFY',
            status
          });
        }
      }
    case 'delDevNotif':
      {
        return (dispatch, getState) => {
          const state = getState();
          const list = state.device.list;
          const newList = Object.assign([], list);
          const index = newList.indexOf(payload.devId);

          if (index > -1 && ack.code == 200) {
            newList.splice(index, 1)
          }

          const delDevNotify = {
            list: newList,
            payload,
            ack
          }

          return {
            type: 'DEL_DEV_NOTIFY',
            delDevNotify
          };
        }
      }
    case 'devBindNotif':
      {
        return (dispatch, getState) => {
          const state = getState();
          console.log("____________绑定消息云端通知_______________________",payload)
          dispatch({
            type: 'BIND_DEV_NOTIFY',
            devBindNotif: {
              payload,
              ack
            }
          });
        }
      }
    case 'devUnbindNotif':
      {
        // TODO
        return (dispatch) => {
          dispatch({
            type: 'SHOULD_UPDATE_DEVICE_LIST',
          });
        }
      }
    case 'setDevInfoNotif':
      return (dispatch) => {
        dispatch({
          type: 'SHOULD_UPDATE_DEVICE_LIST',
        });
      }
		case 'connect':
		{
			return (dispatch) => {
				dispatch({
					type:'SET_DEVICE_CONNECT'
				});
			}
		}
		case 'disconnect':
		{
			return (dispatch) => {
				type:'SET_DEVICE_DISCONNECT'
			}
		}
    default:
      return {
        type: 'MISSING_TYPE'
      }
  }
}

function devUnbindReqFailure(err) {
  return {
    type: 'DEV_UNBIND_REQ_FAILURE',
    err,
  };
}

function devUnbindReqSucces(list) {
  return {
    type: 'DEV_UNBIND_REQ_SUCCESS',
    list,
  };
}

/**
 * 设备解绑请求
 * @param {Object} res 消息体
 * @return {Promise}
 */
export function devUnbindReq(request) {
  return (dispatch, getState) => {
    dispatch({
      type: 'DEV_UNBIND_REQUEST'
    });
    const deviceApi = new Device();
    return deviceApi.devUnbindReq(request)
      .then((res) => {
        const payload = res.payload;
        if (res.ack.code != 200) {
          dispatch(devUnbindReqFailure(res.ack));
          return;
        }

        const state = getState();
        const list = state.device.list;
        const newList = Object.assign([], list);
        const index = newList.indexOf(request.payload.unbindDevId);
        if (index > -1) {
          newList.splice(index, 1)
        }

        dispatch(devUnbindReqSucces(newList));
      })
      .catch((err) => {
        dispatch(devUnbindReqFailure(err));
      });
  }
}

export function shouldUpdateDeviceList() {
  return (dispatch) => {
    dispatch({
      type: 'SHOULD_UPDATE_DEVICE_LIST'
    });
  }
}
export function shouldUpdateActivityRecord() {
  return (dispatch) => {
    dispatch({
      type: 'SHOULD_UPDATE_ACTIVITY_RECORD'
    });
  }
}
export function shouldUpdateRefresh() {
  return (dispatch) => {
    dispatch({
      type: 'SHOULD_UPDATE_REFRESH'
    });
  }
}
// 重置添加搜索设备的的数据
export function initAddDevNotifyList() {
  return (dispatch) => {
    dispatch({
      type: 'INIT_ADD_DEV_NOTIFY_LIST'
    });
  }
}

// 重置删除子设备通知
export function initdelDevNotify() {
  return (dispatch) => {
    dispatch({
      type: 'INIT_DEL_DEV_NOTIFY'
    });
  }
}

// 重置设备绑定通知
export function initBindDevNotify() {
  return (dispatch) => {
    dispatch({
      type: 'INIT_BIND_DEV_NOTIFY'
    });
  }
}

export function setRecordAttr(reocrd) {
  return (dispatch) => {
    dispatch({
      type: 'SET_RECORD_ATTR',
      reocrd
    });
  }
}

export function initRecordAttr(reocrd) {
  return (dispatch) => {
    dispatch({
      type: 'INIT_RECORD_ATTR',
    });
  }
}

export function setEditingName(editingName) {
  return (dispatch) => {
    dispatch({
      type: 'DEVICE_EDITING_NAME',
      editingName
    });
  }
}

export function sortOrder(deviceIds) {
  return (dispatch) => {
    dispatch({
      type: 'DEVICE_REORDER',
      deviceIds
    });
  }
}
/**
 * wcb 该代码要合到大一统
 */
export function setDeviceMode(deviceMode) {
  return (dispatch) => {
    dispatch({
      type: 'SET_DEVICE_MODE',
      deviceMode
    });
  }
}
export function setDeviceCCT(cctNumber) {
  return (dispatch) => {
    dispatch({
      type: 'UPDATE_DEVICES_CCT',
      cctNumber
    });
  }
}

export const setSirenHubVolume = (sirenhubVolume) => ({
  type: 'SET_SIREN_HUB_VOLUME',
  sirenhubVolume
})
