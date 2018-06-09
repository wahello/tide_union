import Automation from '../jssdk/automation';
import { executeSQL, querySQL } from '../jssdk/db';
import {
  STAY_MODE,
  AWAY_MODE
} from './security';

const automation = new Automation();   


function fetchAutomationListSuccess(data){
  return {
      type:'FETCH_AUTOMATION_LIST_SUCCESS',
      autoMationList: data
  };
}

export function initAutomationData() {
    return (dispatch, getState) => {
        dispatch({
            type: 'INIT_AUTOMATION_DATA'
        });
    }
}

export function getAutomationList(request){
    return (dispatch, getState) =>  {
        dispatch({
            type: 'FETCH_AUTOMATION_REQUEST'
        });

        //待处理，此处需要兼容ble local版本，调试临时注释
        const { mqttStatus } = getState().system;
        if(!mqttStatus && window.globalState.isLocal == 0) {
            //获取缓存
            return querySQL(`SELECT value FROM tb_lds_cache WHERE name='automation_cache_${request.homeId}'`).then(res => {
                if(res.code === 200 && res.data.length) {
                  dispatch(fetchAutomationListSuccess(JSON.parse(res.data[0].value)));
                }
            });
        }
 
        return automation.getAutoList(request).then((res) =>{
                console.log(res)
                // const list = res.data.result.filter(item => {
                //     console.log(item)
                //     return (item.name.indexOf(STAY_MODE) === -1) && (item.name.indexOf(AWAY_MODE) === -1)
                // });
                let  list = [];
                if(res.data.result){
                    list = res.data.result;
                }
                querySQL(`SELECT value FROM tb_lds_cache WHERE name='automation_cache_${request.homeId}'`).then(r => {
                  if(r.code === 200 && r.data.length) {
                    executeSQL(`UPDATE tb_lds_cache SET value='${JSON.stringify(list)}' WHERE name='automation_cache_${request.homeId}'`);
                    return;
                  }

                  executeSQL(`INSERT INTO tb_lds_cache(name, value) VALUES('automation_cache_${request.homeId}', '${JSON.stringify(list)}')`);
                });

                console.log(list)
                dispatch(fetchAutomationListSuccess(list));
                return res
            }
        ).catch((err)=>{
            dispatch({
                type:'FETCH_AUTOMATION_LIST_FAILURE',
                err
            })
        })
    }
}

export function getAutoRuleResp(request){
    return (dispatch, getState) =>  {
        dispatch({
            type: 'FETCH_AUTOMATION_REQUEST'
        });
        
        return automation.getAutoRule(request).then((res) =>{
                dispatch({
                    type:"FETCH_AUTOMATION_RULE_SUCCESS",
                    autoMationRule:res.payload
                })
                return res
            }
        ).catch((err)=>{
            dispatch({
                type:"FETCH_AUTOMATION_LIST_FAILURE",
                err
            })
        })
    }
}

export function saveAutomation(request){
    return (dispatch,getState) => {
        dispatch({
            type: 'SAVE_AUTOMATION_REQUEST'
        });
        return automation.addAuto(request).then((res) =>{
                console.log("___________saveAutomation_______res_________")
                console.log(res);
                dispatch({
                    type:"SAVE_AUTOMATION_SUCCESS",
                })
                return res
            }
        ).catch((err)=>{
            dispatch({
                type:"SAVE_AUTOMATION_FAILURE",
                err
            })
        })
    }
}

export function saveAutoRule(request){
    return (dispatch,getState) => {
        dispatch({
            type: 'SAVE_AUTOMATION_REQUEST'
        });
        console.log('-------------------------addAutoRule---------------------------')
        console.log(request)
        console.log('----------------------------saveAutoRule  000000000  hjc  ----------------')
        return automation.addAutoRule(request).then((res) =>{
                dispatch({
                    type:"SAVE_AUTOMATION_RULE_SUCCESS",
                })
                return res
            }
        ).catch((err)=>{
            dispatch({
                type:"SAVE_AUTOMATION_RULE_FAILURE",
                err
            })
        })
    }
}

export function editAutomation(request){
    return (dispatch,getState) => {
        dispatch({
            type: 'EDIT_AUTOMATION_REQUEST'
        });
        return automation.editAuto(request).then((res) =>{
                console.log("___________editAutomation_______res_________")
                console.log(res);
                dispatch({
                    type:"EDIT_AUTOMATION_SUCCESS",
                })
                return res
            }
        ).catch((err)=>{
            dispatch({
                type:"EDIT_AUTOMATION_FAILURE",
                err
            })
        })
    }
}

export function editAutoRule(request){
    return (dispatch,getState) => {
        dispatch({
            type: 'EDIT_AUTOMATION_REQUEST'
        });  
        console.log('---------------------------------------edit auto rule -- hjc---------------')
        console.log(request)
        return automation.editAutoRule(request).then((res) =>{
            console.log(res)
                dispatch({
                    type:"EDIT_AUTOMATION_RULE_SUCCESS",
                })
                return res
            }
        ).catch((err)=>{
            dispatch({
                type:"EDIT_AUTOMATION_RULE_FAILURE",
                err
            })
        })
    }
}

export function delAutomation(request){
    return (dispatch,getState) => {
        return automation.delAutomation(request).then((res) =>{
                dispatch({
                    type:"DEL_AUTOMATION_SUCCESS",
                })
                return res
            }
        ).catch((err)=>{
            dispatch({
                type:"DEL_AUTOMATION_FAILURE",
                err
            })
        })
    }
}

export function delAutoRule(request){
    return (dispatch,getState) => {
        return automation.delAutoRule(request).then((res) =>{
                dispatch({
                    type:"DEL_AUTOMATION_RULE_SUCCESS",
                })
                return res.data
            }
        ).catch((err)=>{
            dispatch({
                type:"DEL_AUTOMATION_RULE_FAILURE",
                err
            })
        })
    }
}

export function setAutoEnable(request){
    console.log('------------------------------request--------------------------------------------')
    console.log(request)
    return (dispatch,getState) => {
        return automation.setAutoEnable(request).then((res) =>{
                dispatch({
                    type:"SET_AUTOMATION_ENABLE_SUCCESS",
                })
                return res
            }
        ).catch((err)=>{
            dispatch({
                type:"SET_AUTOMATION_ENABLE_FAILURE",
                err
            })
        })
    }
}


export function  saveChooseArr(arr){
    return (dispatch,getState) => {
        dispatch({
            type:"SAVE_DEV_LIST_ARR",
            arr
        })
    }
}


export function setCurAutoItem(autoItem){
    return (dispatch,getState) => {
        dispatch({
            type:"SET_CUR_AUTOMATION_ITEM",
            autoItem
        })
    }
}

export function setCurSensorItem(sensor){// 设置当前的sensor 的开关
    return (dispatch,getState) => {
        dispatch({
            type:"SET_CUR_SENSOR_ITEM",
            sensor
        })
    }
}

export function refreshAutoList(boolean){
    return (dispatch,getState) => {
        dispatch({
            type:"REFRESH_AUTO_LIST",
            boolean
        })
    }
}

export function setTriChooseTmp(sensors){
    return (dispatch,getState) => {
        dispatch({
            type:"SET_TRI_CHOOSE_TMP",
            sensors
        })
    }
}

export function setAutoDevices(devices){
    return (dispatch,getState) => {
        dispatch({
            type:"SET_AUTO_DEVICE_LIST",
            devices
        })
    }
}