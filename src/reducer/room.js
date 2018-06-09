const stateInit = {
  isFetching: false,
  err: null,
  totalCount: 0,
  list: [],
  items: {},
  deviceInfo: {
    seq: null,
    totalCount: 0,
    list: [],
    items: {}
  },
  editing: null,
};

function room(state = stateInit, action) {
  switch (action.type) {
    case 'INIT_ROOM_DATA':
      return stateInit;
    // 房间列表请求中
    case 'FETCH_ROOM_LIST_REQUEST':
      return { ...state,
        isFetching: true
      };
      // 房间列表请求成功
    case 'FETCH_ROOM_LIST_SUCCESS':
      return { ...state,
        isFetching: false,
        totalCount: action.room.totalCount,
        list: action.room.list,
        items: action.room.items
      };
      // 房间列表请求失败
    case 'FETCH_ROOM_LIST_FAILURE':
      return { ...state,
        isFetching: false,
        err: action.err
      };
      /* --- 房间设备列表 --- */
    case 'FETCH_ROOM_DEVICES_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_ROOM_DEVICES_SUCCESS':
      const device = {
        seq: action.deviceInfo.seq,
        totalCount: action.deviceInfo.totalCount,
        list: action.deviceInfo.list || [],
        items: action.deviceInfo.items
      }
      return { ...state,
        isFetching: false,
        deviceInfo: device,
      };
    case 'FETCH_ROOM_DEVICES_FAILURE':
      return { ...state,
        isFetching: false,
        err: action.err
      };
      /* --- 房间设备列表 --- */
   
    case 'ADD_ROOM':
      state.list.push(action.room.roomId);
      const items = state.items;
      items[action.room.roomId] = action.room;
      return {
        ...state,
        items: items
      };
    case 'UPDATE_ROOM_SUCCESS': 
      {
        return {
          ...state,
          items: action.items
        };
      }
    case 'SAVE_EDITING_ROOM':
      return {
        ...state,
        editing: action.room
      };
    case 'INIT_EDITING_ROOM':
      return {
        ...state,
        editing: null
      }
    case 'DELETE_ROOM_SUCCESS':
      const index = state.list.indexOf(action.roomId);
      state.list.splice(index, 1);
      return {
        ...state,
      }
    case 'REMOVE_DEV_FROM_ROOM_SUCCESS':
      return Object.assign({}, state, {
        list: action.list
      });
    default:
      return state;
  }
}

export default room;