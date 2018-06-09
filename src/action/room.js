import roomApi from '../jssdk/room';
import Device from '../jssdk/device';
import { executeSQL, querySQL } from '../jssdk/db';

export function initRoomData() {
  return {
    type: 'INIT_ROOM_DATA'
  };
}

function fetchRoomListSucces(room) {
  return {
    type: 'FETCH_ROOM_LIST_SUCCESS',
    room,
  };
}

function fetchRoomListFailure(err) {
  return {
    type: 'FETCH_ROOM_LIST_FAILURE',
    err,
  };
}

export function fetchRoomList(request) {
  return (dispatch, getState) => {
    const handleData = function handleFetchedData(res) {
      // 数据再处理      
      const roomList = res.data.rooms || [];
      const list = [];
      const items = {};
      const totalCount = res.data.totalCount || 0;
      
      // 默认房间
      list.push(0);
      items[0] = {
        roomId: 0,
        name: 'Everything else',
        icon: 'fault',
        devNum: 0,
      };

      roomList.map((item) => {
        items[item.roomId] = item;
        list.push(item.roomId)
      });

      dispatch(fetchRoomListSucces({
        items,
        list,
        totalCount
      }));
    };
    dispatch({
      type: 'FETCH_ROOM_LIST_REQUEST',
    });

    const { mqttStatus } = getState().system;
    if(!mqttStatus) {
      return querySQL(`SELECT value FROM tb_lds_cache WHERE name='room_cache_${request.homeId}'`).then(res => {
        if(res.code === 200 && res.data.length) {
          handleData(JSON.parse(res.data[0].value));
        }
      });
    }

    return roomApi.getRoomList(request)
      .then((res) => {
        // 请求失败
        if (res.code != 200) {
          dispatch(fetchRoomListFailure(res));
          return;
        }
        
        querySQL(`SELECT value FROM tb_lds_cache WHERE name='room_cache_${request.homeId}'`).then(r => {
          if(r.code === 200 && r.data.length) {
            executeSQL(`UPDATE tb_lds_cache SET value='${JSON.stringify(res)}' WHERE name='room_cache_${request.homeId}'`);
            return;
          }

          executeSQL(`INSERT INTO tb_lds_cache(name, value) VALUES('room_cache_${request.homeId}', '${JSON.stringify(res)}')`);
        });
        console.log('获取到的房间列表：', res);
        handleData(res);
      })
      .catch((err) => {
        dispatch(fetchRoomListFailure(err));
      });
  }
}

function fetchRoomDevicesSucces(deviceInfo) {
  return {
    type: 'FETCH_ROOM_DEVICES_SUCCESS',
    deviceInfo,
  };
}

function fetchRoomDevicesFailure(err) {
  return {
    type: 'FETCH_ROOM_DEVICES_FAILURE',
    err,
  };
}

export function fetchRoomDevices(request) {
  return (dispatch, getState) => {
    const handleData = function handleFetchedData(res) {

      const deviceList = res.payload.dev || [];
      const state = getState();
      const list = [];
      const items = {};
      const roomItems  = state.room.items;
      const homeId = state.family.currentId;
      if (deviceList.length) {
        deviceList.map((item) => {
          item.roomName = '';
          if (item.roomId) {
            item.roomName = roomItems[item.roomId].name;
          }
          if (item.roomId === undefined || item.roomId === 0 || item.roomId === '0' || item.roomId === homeId) {
            item.roomName = 'Everything else'
          }

          if (!item.icon || item.icon === 'default') {
            const iconObj = {
              motion: 'motion',
              siren: 'siren',
              sensor: 'door_lock',
              lighting: 'lighting',
              multi_gateway: 'gateway'
            };
            let icon = 'default';
            if (item.devType) {
              if(iconObj[item.devType.toLowerCase()] != undefined) {
                icon = iconObj[item.devType.toLowerCase()];
              }
            }
            item.icon = icon;
          }

          items[item.devId] = item;
          list.push(item.devId)
        });
      }

      const devices = {
        seq: res.seq,
        totalCount: res.payload.totalCount,
        list,
        items
      }

      dispatch(fetchRoomDevicesSucces(devices));
    }
    const { roomId, homeId } = request.payload;
    const deviceApi = new Device();
    dispatch({
      type: 'FETCH_ROOM_DEVICES_REQUEST'
    });

    const { mqttStatus } = getState().system;
    if(!mqttStatus) {
      return querySQL(`SELECT value FROM tb_lds_cache WHERE name='room_device_cache_${roomId}_${homeId}'`).then(res => {
        if(res.code === 200 && res.data.length) {
          handleData(JSON.parse(res.data[0].value));
        }
      });
    }

    // 默认房间
    // if (request.payload.roomId === 0) {
    //   const unbinds = state.device.unbindDevices || [];
    //   dispatch(fetchRoomDevicesSucces({
    //     totalCount: unbinds.length,
    //     list: unbinds,
    //   }));
    //   return;
    // }

    return deviceApi.getRoomDevListReq(request)
      .then((res) => {
        const payload = res.payload;
        if (res.ack.code != 200) {
          dispatch(fetchRoomDevicesFailure(res.ack));
          return;
        }

        querySQL(`SELECT value FROM tb_lds_cache WHERE name='room_device_cache_${roomId}_${homeId}'`).then(r => {
          if(r.code === 200 && r.data.length) {
            executeSQL(`UPDATE tb_lds_cache SET value='${JSON.stringify(res)}' WHERE name='room_device_cache_${roomId}_${homeId}'`);
            return;
          }

          executeSQL(`INSERT INTO tb_lds_cache(name, value) VALUES('room_device_cache_${roomId}_${homeId}', '${JSON.stringify(res)}')`);
        });

        console.log('获取到的房间设备: ', res);
        handleData(res);
      })
      .catch((err) => {
        dispatch(fetchRoomDevicesFailure(err));
      })
  }
}

function addRoomFailure(err) {
  return {
    type: 'ADD_ROOM_FAILURE',
    err,
  };
}

export function addRoom(room) {
  return {
    type: 'ADD_ROOM',
    room,
  };
}

export function saveEditingRoom(room) {
  return {
    type: 'SAVE_EDITING_ROOM',
    room,
  };
}

export function initEditingRoom() {
  return {
    type: 'INIT_EDITING_ROOM'
  };
}

function deleteRoomFailure(err) {
  return {
    type: 'DELETE_ROOM_FAILURE',
    err,
  };
}

function deleteRoomSucces(roomId) {
  return {
    type: 'DELETE_ROOM_SUCCESS',
    roomId,
  };
}

export function deleteRoom(request) {
  return dispatch => {
    return roomApi.deleteRoom(request)
      .then((res) => {        
        if (res.code != 200) {
          dispatch(deleteRoomFailure(res));
          return;
        }        
        dispatch(deleteRoomSucces(request.roomId));
      })
      .catch((err) => {
        dispatch(deleteRoomFailure(err));
      })
  }
}

function updateRoomFailure(err) {
  return {
    type: 'UPDATE_ROOM_FAILURE',
    err,
  };
}
function updateRoomSucces(items) {
  return {
    type: 'UPDATE_ROOM_SUCCESS',
    items,
  };
}
export function updateRoom(request) {
  return (dispatch, getState) => {
    dispatch({
      type: 'UPDATE_ROOM_REQUEST'
    });
    return roomApi.update(request)
      .then((res) => {
        if (res.code != 200) {
          dispatch(updateRoomFailure(res));
          return;
        }

        const state = getState();
        const roomItems = Object.assign({}, state.room.items);
        const updateRoom = roomItems[request.roomId];
        updateRoom.icon = request.icon;
        updateRoom.name = request.name;

        dispatch(updateRoomSucces(roomItems));
      })
      .catch((err) => {
        dispatch(updateRoomFailure(err));
      })
  }
}

function removeDevFromRoomFailure(err) {
  return {
    type: 'REMOVE_DEV_FROM_ROOM_FAILURE',
    err,
  };
}

function removeDevFromRoomSucces(list) {
  return {
    type: 'REMOVE_DEV_FROM_ROOM_SUCCESS',
    list,
  };
}

export function removeDevFromRoom(request) {
  return (dispatch, getState) => {
    dispatch({
      type: 'REMOVE_DEV_FROM_ROOM_REQUEST'
    });
    const deviceApi = new Device();
    console.log("removeDevFromRoom : " ,request);
    return deviceApi.setDevInfoReq(request)
      .then((res) => {
        const payload = res.payload;
        if (res.ack.code != 200) {
          dispatch(removeDevFromRoomFailure(res.ack));
          return;
        }

        const state = getState();
        const list = state.room.deviceInfo.list;
        const newList = Object.assign([], list)
        const index = newList.indexOf(request.payload.devId);
        if (index > -1) {
          newList.splice(index, 1)
        }

        dispatch(removeDevFromRoomSucces(newList));
      })
      .catch((err) => {
        dispatch(removeDevFromRoomFailure(err));
      });
  }
}
