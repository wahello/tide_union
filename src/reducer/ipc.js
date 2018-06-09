const stateInit = {
    getVolumeVaule:"",
    getLangugae:"",
    getAngle:"",
    getMotionValue:"",
    getTimezone:"",
    getEvent:"",
    getIpcRoomname:"",
    getIpcdata:{},
    getIpcCycle:{},
    getCameraName:"",
    versionList:[],
    playType:"1",
    dataState:false,
    timeListInfo:{},
    eventlist:[],
    wifi:{},
    SDRecordConfig:{},
    onlineState:false,
    playTime:'',
    pauseTime:''
};
function camera (state = stateInit,action){
    switch (action.type) {
        case 'SAVE_VOLUME_VALUE':
        return {
            ...state,
            getVolumeVaule:action.value
        }
        case 'SAVE_LANGUAGE_VALUE':
        return {
            ...state,
            getLangugae:action.value
        }
        case 'SAVE_ANGLE_VALUE':
        return {
            ...state,
            getAngle:action.value
        }
        case 'SAVE_MOTION_VALUE':
        return {
            ...state,
            getMotionValue:action.value
        }
        case 'SAVE_LAMP_VALUE':
        return {
            ...state,
            getLampValue:action.value
        }
        case 'SAVE_TIME_ZONE':
        return {
            ...state,
            getTimezone:action.value
        }
        case 'SAVE_EVENT_VALUE':
        return {
            ...state,
            getEvent:action.value
        }
        case 'SAVE_CAMERA_ROOMNAME':
        return {
          ...state,
          getIpcRoomname:action.value
        }
        case 'SAVE_CAMERA_DATA':
        return {
          ...state,
          getIpcdata:action.ipcItem
        }
        case 'SAVE_IPC_CYCLE':
        return {
          ...state,
          getIpcCycle:action.cycleItem 
        }
        case 'SAVE_CAMERA_NAME':
        return {
            ...state,
            getCameraName:action.value
        }
        case 'FETCH_VERSION_LIST_SUCCESS':
        return {
            ...state,
            versionList:action.verList
        }
        case 'OTA_UPDATE_STATUS':
        return {
            ...state,
            otaStatus:action.otaStatus
        }
        case 'GET_SD_RECORD_CONFIG':
		return {
			...state,
			SDRecordConfig:action.SDRecordConfig
        }
        case 'SD_CARD_FORMAT':
        return{
            ...state,
			formateRes:action.rescode
        }
        case 'SET_HAS_SD_CARD':
        return {
            ...state,
			havsd:action.havsd
        }
		case 'CHANGE_SD_RECORD_MODE':
		return {
			...state,
			SDRecordConfig:action.SDRecordMode
		}
		case 'SET_PLAY_TYPE':
		return{
			...state,
			playType:action.playType
        }
		case 'SET_DATA_STATE':
		return{
			...state,
			dataState:action.dataState
		}
        case 'GET_SDCARD_LIST_INFO':
        return{
            ...state,
			sdcardinfo:action.sdcardinfo
        }
        case 'GET_TIME_LIST_INFO':
        return{
            ...state,
            isFetching:true,
            requestDateInterval:action.requestDateInterval
        }
        case 'GET_TIME_LIST_INFO_SUCCESS':
        return {
            ...state,
            isFetching:false,
            status:1,
            timeListInfo:Object.assign(state.timeListInfo,action.timeListInfo),
        }
        case 'GET_TIME_LIST_INFO_FAILURE':
        return {
            ...state,
            isFetching:false,
            status:0,
            errorInfo:action.errorInfo
        }
        case 'CLEAR_TIME_LIST_INFO':
        return {
            ...state,
            timeListInfo:{}
        }
        case 'GET_SDCARD_ONE_HOUR_LIST':
        return {
            ...state,
            isFetching:true,
            hour:action.hour
        }
        case 'GET_SDCARD_ONE_HOUR_LIST_SUCCESS':
        return {
            ...state,
            isFetching:false,
            status:1,
            eventlist:action.eventlist
        }
        case 'GET_SDCARD_ONE_HOUR_LIST_FAILURE':
        return {
            ...state,
            isFetching:false,
            status:0,
            errorinfo:action.errorinfo
        }
        case 'SAVE_WIFI_SETTING':
        return {
            ...state,
            wifi:action.wifi
        }
        case 'SAVE_ONLINE_STATE':
        return {
        	...state,
        	onlineState:action.onlineState
        }
        case 'SET_PLAY_TIME':
        return{
        	...state,
        	playTime:action.playTime
        }
        case 'SET_PAUSE_TIME':
        return{
        	...state,
        	pauseTime:action.pauseTime
        }
        default:
        return state;
    }
}

export default camera;