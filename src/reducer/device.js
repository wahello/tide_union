const stateInit = {
  cacheUpdated: false,
  timeoutState: false,
  shouldUpdateList: false,
  shouldUpdateActivityRecord: false,
  shouldUpdateRefresh: false,
  isFetching: false,
  resultStatus:true,
  isFirstIn: true,
  totalCount: 0,
  list: [],
  deviceRecord: [],
  deviceRecordCount: 0,
  devicePageNum: 0,
  allRecord: [],
  allRecordCount: 0,
  allPageNum: 0,
  unbindDevices: [],
  items: {},
  desc: '',
  deviceItem: {},
  directDevIds: {
  	gateway: [],
  	devices: []
  }, // 直连设备ID对象，gateway为网关ID数组，devices为其他直连设备ID数组
  writeableIds: [], // 可控设备ID数组
  unwriteableIds: [], // 不可控设备ID数组
  backDone: false,
  fromPage: '',
  addDevNotifyList: [],
  devBindNotif: null,
  fetchAllRecordError: {},
  deleteAllRecordError: {},
  fetchDeviceRecordError: {},
  deleteDeviceRecordError: {},
  // 接收删除子设备的通知
  delDevNotify: {
    hasNewNotify: false,
    payload: {},
    ack: {},
  },
  recordAttr: {
    lastUpdated: '',
    devId: '',
    attr: null,
  }, // recordAttr 记录的设备attr，不一定是实时设备的attr。比如情景或场景
  editingName: '',
   deviceMode:null,
   cctNumber:{},
  sirenhubVolume: 3,
  deviceConnect:false,
  securityStatus: -1,
};


function device(state = stateInit, action) {
  switch (action.type) {
    case 'INIT_DEVICE_DATA':
      return stateInit;
    case 'UPDATE_DEVICES_DONE':
      return {
        ...state,
        cacheUpdated: true,
      };
      /* --- begin 家庭设备列表 --- */
    case 'FETCH_HOME_DEVICES_REQUEST':
      return {
        ...state,
        isFetching: false,
      };
    case 'FETCH_HOME_DEVICES_SUCCESS':
      return {
        ...state,
        isFetching: false,
        isFirstIn: action.deviceInfo.isFirstIn,
        shouldUpdateList: false,
        totalCount: action.deviceInfo.totalCount,
        list: action.deviceInfo.list || [],
        unbindDevices: action.deviceInfo.unbindDevices || [],
        items: action.deviceInfo.items,
        directDevIds: action.deviceInfo.directDevIds,
        writeableIds: action.deviceInfo.writeableIds,
        unwriteableIds: action.deviceInfo.unwriteableIds,
      };
    case 'FETCH_HOME_DEVICES_CACHE':
      return {
        ...state,
        totalCount: action.deviceInfo.totalCount,
        list: action.deviceInfo.list || [],
        unbindDevices: action.deviceInfo.unbindDevices || [],
        items: action.deviceInfo.items,
        directDevIds: action.deviceInfo.directDevIds,
        writeableIds: action.deviceInfo.writeableIds,
        unwriteableIds: action.deviceInfo.unwriteableIds,
      };
    case 'UPDATE_DEVICE_LIST':
    return {
      ...state,
      list:action.list
    }
    case 'FETCH_HOME_DEVICES_FAILURE':
      return {
        ...state,
        isFetching: false,
        isFirstIn: false,
        err: action.err,
      };
      /* --- end 家庭设备列表 --- */

      /* --- begin 设置设备属性 --- */
    case 'SET_DEVICE_ATTR_REQUEST':
      return {
        ...state,
      };
    case 'SET_DEVICE_ATTR_SUCCESS':
      state.items[action.response.devId] = action.response.item;
      return {
        ...state,
        isFetching: false,
      };
    case 'SET_DEVICE_ATTR_FAILURE':
      return {
        ...state,
        err: action.err,
      };
      /* --- 获取单个设备记录 --- */
    case 'FETCH_DEV_ACTIVITY_REQUEST':
      return {
        ...state,
        isFetching: true,
      };
      // 请求成功
    case 'FETCH_DEV_ACTIVITY_SUCCESS':
      return {
        ...state,
        isFetching: false,
        resultStatus:true,
        shouldUpdateRefresh: true,
        deviceRecord: action.record.recordList,
        deviceRecordCount: action.record.count,
        devicePageNum: action.record.currentNum,
      };
      // 请求失败
    case 'FETCH_DEV_ACTIVITY_FAILURE':
      return {
        ...state,
        isFetching: false,
        resultStatus:false,
        fetchDeviceRecordError: action.err,
      };

      /**
       * 删除单个设备记录
       */
    case 'DELETE_DEV_ACTIVITY_REQUEST':
      return {
        ...state,
        isFetching: true,
      };
      // 请求成功
    case 'DELETE_DEV_ACTIVITY_SUCCESS':
      return {
        ...state,
        isFetching: false,
        desc: action.record.desc,
        deviceRecord: action.record.recordList,
        deviceRecordCount: action.record.count,
        devicePageNum: action.record.currentNum,
      };
      // 请求失败
    case 'DELETE_DEV_ACTIVITY_FAILURE':
      return {
        ...state,
        isFetching: false,
        deleteDeviceRecordError: action.err,
      };

      /**
       * 获取全部设备记录
       */
    case 'FETCH_ALL_DEV_ACTIVITY_REQUEST':
      return {
        ...state,
        isFetching: true,
      };

    case 'FETCH_ALL_DEV_ACTIVITY_SUCCESS':
      return {
        ...state,
        isFetching: false,
        resultStatus:true,
        shouldUpdateActivityRecord: true,

        allRecord: action.record.recordList,
        allRecordCount: action.record.count,
        allPageNum: action.record.currentNum,
      };

    case 'FETCH_ALL_DEV_ACTIVITY_FAILURE':
      return {
        ...state,
        isFetching: false,
        resultStatus:false,
        fetchAllRecordError: action.err,
      };

      /**
       * 删除全部设备记录
       */
    case 'DELETE_ALL_DEV_ACTIVITY_REQUEST':
      return {
        ...state,
        isFetching: true,
      };
    case 'SAVE_DEVICE_ITEM_DATA':
      return {
        ...state,
        deviceItem: action.deviceItem,
      };
    case 'DELETE_ALL_DEV_ACTIVITY_SUCCESS':
      return {
        ...state,
        isFetching: false,
        desc: action.record.desc,
      };

    case 'DELETE_ALL_DEV_ACTIVITY_FAILURE':
      return {
        ...state,
        isFetching: false,
        deleteAllRecordError: action.err,
      };
    case 'CHANGE_BACK_ACTION':
      return {
        ...state,
        backDone: action.backDone,
      };
    case 'CHANGE_FROM_PAGE':
      return {
        ...state,
        fromPage: action.fromPage,
      };
    case 'DEV_UNBIND_REQ_FAILURE':
      return {
        ...state,
        isFetching: false,
        err: action.err,
      };
    case 'DEV_UNBIND_REQ_SUCCESS':
      return Object.assign({}, state, {
        list: action.list,
      });
    case 'DEV_STATUS_NOTIFY':
      // TODO: 待测试
      // const devId = action.notifyDevice.devId;
      // state.items[devId] = action.notifyDevice;
      return {
        ...state,
        items: action.deviceItems,
      };
    case 'SHOULD_UPDATE_DEVICE_LIST':
      return {
        ...state,
        shouldUpdateList: true,
      };
    case 'SHOULD_UPDATE_ACTIVITY_RECORD':
      return {
        ...state,
        shouldUpdateActivityRecord: false,
      };
    case 'SHOULD_UPDATE_REFRESH':
      return {
        ...state,
        shouldUpdateRefresh: false,
      };
    case 'ADD_DEV_NOTIFY':
      return {
        ...state,
        addDevNotifyList: action.devNotifyList,

      };
    case 'STATUS_CHANGE_NOTIFY':
      return {
        ...state,
        securityStatus: action.status,
      };
    case 'BIND_DEV_NOTIFY':
      return {
        ...state,
        devBindNotif: action.devBindNotif,
      };
    case 'INIT_BIND_DEV_NOTIFY':
      return {
        ...state,
        devBindNotif: null,
      };

    case 'INIT_ADD_DEV_NOTIFY_LIST':
      return {
        ...state,
        addDevNotifyList: [],
      };
    case 'DEL_DEV_NOTIFY':
      return {
        ...state,
        list: action.delDevNotify.list,
        delDevNotify: {
          hasNewNotify: true,
          payload: action.delDevNotify.payload,
          ack: action.delDevNotify.ack,
        },
      };
    case 'INIT_DEL_DEV_NOTIFY':
      return {
        ...state,
        delDevNotify: {
          hasNewNotify: false,
          payload: {},
          ack: {},
        },
      };
    case 'SET_RECORD_ATTR':
      return {
        ...state,
        recordAttr: {
          lastUpdated: (new Date()).valueOf(),
          devId: action.reocrd.devId,
          attr: action.reocrd.attr,
          isCheck:action.reocrd.isCheck
        },
      };
    case 'INIT_RECORD_ATTR':
      return {
        ...state,
        recordAttr: {
          lastUpdated: '',
          devId: '',
          attr: null,
        },
      };
    case 'DEVICE_EDITING_NAME':
      return {
        ...state,
        editingName: action.editingName,
      };
    case 'DEVICE_REORDER':
      return {
        ...state,
        list: action.deviceIds,
      };
    case 'SET_DEVICE_MODE':
    	return {
        ...state,
        deviceMode: action.deviceMode,
      };
     case 'UPDATE_DEVICES_CCT':
      return {
        ...state,
        cctNumber: action.cctNumber,
      };
    case 'SET_SIREN_HUB_VOLUME':
    	return {
        ...state,
        sirenhubVolume: action.sirenhubVolume,
      };
    case 'SET_DEVICE_CONNECT':
    	return {
    		...state,
    		deviceConnect:true
    	};
    case 'SET_DEVICE_DISCONNECT':
	    return {
	    	...state,
	    	deviceConnect:false
	    };
    default:
      return state;
  }
}

export default device;
