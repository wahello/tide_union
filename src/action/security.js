import { getStatus, setArmMode, getSecurityRule, setSecurityRule } from '../jssdk/Security';
import { executeSQL, querySQL } from '../jssdk/db';
import Automation from '../jssdk/automation';


export const STAY_MODE = 'stay';
export const AWAY_MODE = 'away';
export const SOS_MODE = 'panic';
export const STATUS = {
  off: 0,
  stay: 1,
  away: 3,
  awayDelay: 4,
  stayDelay: 5,
  notReady: 6
};

export function initSecurityData(){
  return {
    type: 'INIT_SECURITY_DATA'
  }
}

export function setMode(mode) {
  return {
    type: 'SET_SECURITY_MODE',
    mode,
  };
}

export const setSirenVolume = (volume) => ({
  type: 'SET_SIREN_VOLUME',
  volume
})

export const setLEDMode = (value) => {
  return {
    type: 'SET_LED_MODE',
  value
  }
}


export const setSirenTime = (time) => ({
  type: 'SET_SIREN_TIME',
  time
})

export const setSirenDeviceID = (siren) => ({
  type: 'SET_SIREN_DEVICEID',
  siren
})

export const setDelay = (duration) => ({
  type: 'SET_DELAY',
  duration
})

/*
export const setCurrentModes = (delay) => ({
  type: 'CURRENT_MODES',
  delay
})*/
export function setCurrentModes(modes) {
  return (dispatch, getState) => {
    dispatch({
      type: 'CURRENT_MODES',
      modes
    })
  }
}


function fetchModesSucces(modes, progress) {
  console.log('-----------security mode list-----------', modes);
  return {
    type: 'FETCH_MODES_SUCCESS',
    modes,
    progress
  };
}

function fetchModesFailure(err) {
  return {
    type: 'FETCH_MODES_FAILURE',
    err,
  };
}

function shouldFetchModes(state) {
  if (state.security.modes.list) {
    return true;
  }

  return false;
}

export function fetchModes(options) {
  return (dispatch, getState) => {

    if (shouldFetchModes(getState())) {
      return Promise.resolve();
    }

    dispatch({
      type: 'FETCH_MODES_REQUEST'
    });

    // 获取缓存
    querySQL(`SELECT value FROM tb_lds_cache WHERE name="security_cache_${options.homeId}"`).then(res => {
      if(res.code === 200 && res.data.length) {
        const modes = JSON.parse(res.data[0].value);
        const progress = (modes[STAY_MODE] && modes[STAY_MODE].enable) || (modes[AWAY_MODE] && modes[AWAY_MODE].enable) ? 1 : 0;
        dispatch(fetchModesSucces(modes, progress));
      }
    });

    const automationApi = new Automation();
    return automationApi.getAutoList(options)
      .then((res) => {
        if (res.code != 200) {
          dispatch(fetchModesFailure(res));
          return;
        }

        const data = ((res.data && res.data.result) || []).filter(item => {
          return item.name === STAY_MODE || item.name === AWAY_MODE;
        });
        const promiseList = [];
        const modes = {};
        let progress = 0;

        if (data.length) {
          data.map((item) => {

            promiseList.push(automationApi.getAutoRule({
              payload: {
                autoId: item.autoId
              }
            }));
            item.enable = Boolean(item.enable);
            modes[item.name] = item;

            if(item.enable) {
              progress = 1;
            }
          });

          Promise.all(promiseList).then(values => {
            values.forEach(item => {
              const { payload } = item;
              if (modes[STAY_MODE] && modes[STAY_MODE].autoId === payload.autoId) {
                modes[STAY_MODE].rule = payload
              } else if (modes[AWAY_MODE] && modes[AWAY_MODE].autoId === payload.autoId) {
                modes[AWAY_MODE].rule = payload
              }

            });

            querySQL(`SELECT value FROM tb_lds_cache WHERE name='security_cache_${options.homeId}'`).then(r => {
              if(r.code === 200 && r.data.length) {
                executeSQL(`UPDATE tb_lds_cache SET value='${JSON.stringify(modes)}' WHERE name='security_cache_${options.homeId}'`);
                return;
              }

              executeSQL(`INSERT INTO tb_lds_cache(name, value) VALUES('security_cache_${options.homeId}', '${JSON.stringify(modes)}')`);
            });
            dispatch(fetchModesSucces(modes, progress));
          });
        } else {
          dispatch(fetchModesFailure(res));
        }

      })
      .catch((err) => {
        dispatch(fetchModesFailure(err));
      })
  }
}

export function fetchMode(payload) {
    return (dispatch, getState) => {
      const { mqttStatus } = getState().system;

      if(!mqttStatus) {
        // 获取缓存
        return querySQL(`SELECT value FROM tb_lds_cache WHERE name="security_cache_${payload.securityType}"`).then(res => {
          if(res.code === 200 && res.data.length) {
            const data = JSON.parse(res.data[0].value);
            dispatch({
              type: 'SET_MODE',
              securityType: payload.securityType,
              rule: data.payload
            });

            return data;
          }

          return {
            ack: {
              code: 200
            },
            payload: {
            }
          };
        });
      }

      return getSecurityRule(payload).then(res => {
        if(res.ack.code == 200){
          dispatch({
            type: 'SET_MODE',
            securityType: payload.securityType,
            rule: res.payload
          });

          querySQL(`SELECT value FROM tb_lds_cache WHERE name="security_cache_${payload.securityType}"`).then(r => {
            if(r.code === 200 && r.data.length) {
              executeSQL(`UPDATE tb_lds_cache SET value='${JSON.stringify(res)}' WHERE name='security_cache_${payload.securityType}'`);
              return;
            }

            executeSQL(`INSERT INTO tb_lds_cache(name, value) VALUES('security_cache_${payload.securityType}', '${JSON.stringify(res)}')`);
          });
        }

        return res;
      });
    }
}

export function deployMode(payload) {
  return (dispatch, getState) => {
    return setArmMode(payload).then(res=> {
      if(!res.ack) {
        return res;
      }
      
      if(res.ack.code == 200){
        console.log(getState())
        console.log('set arm mode', payload.armMode);

        if(payload.armMode === SOS_MODE) {
          return res;
        }

//      dispatch({
//        type: 'SET_STATUS',
//        status: res.payload.status,
//        progress: 0
//      });
      }

      return res;
    });
  }
}

export function addMode(mode) {
  return (dispatch, getState) => {
    dispatch({
      type: 'ADD_MODE',
      mode
    })
  }
}

export function editMode(rule) {
  return (dispatch, getState) => {
    return setSecurityRule(rule).then((res) => {
      if(Number(res.ack.code) === 200) {
         dispatch({
          type: 'EDIT_MODE',
          rule
        });
      }

      return res;
    });
  }
}

let timer;
export function countDown(duration, startProgress) {
  clearInterval(timer);
  return (dispatch, getState) => {
    const interval = 100;
    const stepLength = duration > 0 ? 1 / (duration * 1000 / interval) : 1;
    const progress = startProgress || getState().security.modes.progress;

    dispatch(setProgress(stepLength));
    return new Promise((resolve) => {
      timer = setInterval(() => {
        let curProgress = getState().security.modes.progress;
        if (curProgress > 1) {
          clearInterval(timer);
          resolve();
          return;
        }

        dispatch(setProgress(curProgress + stepLength));
      }, interval);
    });

  }

}

export function stopCountingDown() {
  return (dispatch, getState) => {
    clearInterval(timer);
    dispatch(setProgress(0));
  }
}

export function setProgress(progress) {
  return {
    type: 'SET_PROGRESS',
    progress: progress
  };
}

export function setStatus(status, progress) {
  return (dispatch, getState) => {
    const { mqttStatus } = getState().system;
    const { modes } = getState().security;
    querySQL(`SELECT value FROM tb_lds_cache WHERE name="security_cache_status"`).then(r => {
      if(r.code === 200 && r.data.length) {
        executeSQL(`UPDATE tb_lds_cache SET value='${status}' WHERE name='security_cache_status'`);
        return;
      }

      executeSQL(`INSERT INTO tb_lds_cache(name, value) VALUES('security_cache_status', '${status}')`);
    });

    console.log('set security status', status);

    dispatch({
      type: 'SET_STATUS',
      status,
      progress: progress || (status === 1 || status === 3 ? 1 : 0)
    })
  }
}

export function getSecurityStatus(payload) {
  return (dispatch, getState) => {
    const { mqttStatus } = getState().system;
    const { progress, status } = getState().security.modes;
    
    if(progress > 0 && progress < 1) {
      return Promise.resolve({
        ack: {
          code: 200
        },
        payload: {
          status: status
        }
      });
    }
    // if(status !== null) {
    //   return Promise.resolve({
    //     ack: {
    //       code: 200
    //     },
    //     payload: {
    //       status: status
    //     }
    //   });
    // }

    if(!mqttStatus) {

      const message = {
        ack: {
          code: 200
        },
        payload: {
          status: 6
        }
      };
       // 获取缓存
      return querySQL(`SELECT value FROM tb_lds_cache WHERE name="security_cache_status"`).then(res => {
        if(res.code === 200 && res.data.length) {
          const status = Number(res.data[0].value);
          dispatch({
            type: 'SET_STATUS',
            status,
            progress: status === 1 || status === 3 ? 1 : 0
          })
          message.payload.status = status;
        }

        return message;
      });
    }
   

    return getStatus(payload).then(res => {
      const { ack, payload } = res;

      if(!ack) {
        return res;
      }

      if(ack.code == 200){
        dispatch(setStatus(payload.status, payload.remaining));
      }

      return res;
    });   

    
  }
}

/**
 * MQTT监听推送回来的消息，接收消息处理
 * @param {Object} res 消息体
 * @return {Promise}
 */
export function onSecurityMessageReceive(trigger) {
	return (dispatch, getState) => {
		const state = getState();
		let triggerList = state.security.modes.triggerList;
		let devIdList = [];
		triggerList.forEach((item)=>{
			devIdList.push(item.devId)
		});
		
		trigger.forEach((item)=>{
			if (devIdList.indexOf(item.devId) === -1) {
		    triggerList.push(item);
		  }
		})
		
		console.log("6666666666666666666666666666666====",triggerList.length)
		
		dispatch({
			type: "FETCH_TRIGGER_LIST",
			triggerList,
		});
	}
}

export const setTriggerList = (triggerList) => {
  return {
    type: 'FETCH_TRIGGER_LIST',
  	triggerList
  }
}
