const stateInit = {
    autoMationList:[],
    autoMationRule:{},
    devicesOfAuto:{},
    chooseDeviceArr:[],
    triChooseTmp:[],
    refreshAuto:false
};


function automation(state = stateInit,action){
    switch (action.type) {
        case 'INIT_AUTOMATION_DATA':
            return stateInit;
        // 情景列表请求中
        case "FETCH_AUTOMATION_REQUEST" :
        return {
            ...state,
            isFetching:true
        };
        // 情景列表获取成功
        case "FETCH_AUTOMATION_LIST_SUCCESS" : 
        return {
            ...state,
            isFetching: false,
            autoMationList:action.autoMationList
        };
        // 情景列表获取失败
        case "FETCH_AUTOMATION_LIST_FAILURE" : 
        return {
            ...state,
            isFetching: false,
            err: action.err
        };
        // 情景规则获取成功
        case "FETCH_AUTOMATION_RULE_SUCCESS" : 
        return {
            ...state,
            isFetching: false,
            autoMationRule:action.autoMationRule,
            autoItem:action.autoMationRule
        };
        // 情景规则获取失败
        case "FETCH_AUTOMATION_RULE_FAILURE" : 
        return {
            ...state,
            isFetching: false,
            err: action.err
        };
        // 设置情景设备列表数据
        case 'SET_AUTO_DEVICE_LIST':
        return {
            ...state,
            devicesOfAuto: action.devices
        }
        case 'SET_CUR_AUTOMATION_ITEM':
        return {
            ...state,
            isFetching: false,
            autoItem:action.autoItem
        };
        case 'SAVE_AUTOMATION_REQUEST':
        return {
            ...state,
            isSaving: true,
        };
        case 'SAVE_AUTOMATION_SUCCESS':
        return {
            ...state,
            isSaving: false
        };
        case 'SAVE_AUTOMATION_FAILURE':
        return {
            ...state,
            isSaving: false,
            err: action.err
        };
        case 'SAVE_AUTOMATION_RULE_SUCCESS':
        return {
            ...state,
            isSaving: false,
        };
        case 'SAVE_AUTOMATION_RULE_FAILURE':
        return {
            ...state,
            isSaving: false,
            err: action.err
        };
        case 'EDIT_AUTOMATION_REQUEST':
        return {
            ...state,
            isEditing: true,
        };
        case 'EDIT_AUTOMATION_SUCCESS':
        return {
            ...state,
            isEditing: false
        };
        case 'EDIT_AUTOMATION_FAILURE':
        return {
            ...state,
            isEditing: false,
            err: action.err
        };
        case 'EDIT_AUTOMATION_RULE_SUCCESS':
        return {
            ...state,
            isEditing: false,
        };
        case 'EDIT_AUTOMATION_RULE_FAILURE':
        return {
            ...state,
            isEditing: false,
            err: action.err
        };
        case 'SET_AUTOMATION_ENABLE_SUCCESS':
        return {
            ...state
        };
        case 'SET_AUTOMATION_ENABLE_FAILURE':
        return {
            ...state
        }
        case 'SAVE_DEV_LIST_ARR':
        return {
            ...state,
            chooseDeviceArr:action.arr
        }
        case 'SET_TRI_CHOOSE_TMP':
        return {
            ...state,
            triChooseTmp:action.sensors
        }
        case 'REFRESH_AUTO_LIST':
        return {
            ...state,
            refreshAuto:action.boolean
        }
        case 'SET_CUR_SENSOR_ITEM':
        return {
            ...state,
            curSensor:action.sensor
        }
        default:
        return state;
    }
}

export default automation;

