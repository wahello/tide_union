import { SET_MQTT_SUBSCRIBED } from '../action/system';

const stateInit = {
  mqttStatus: 1,
  networkStatus: 1,
  mqttSubscribed: 0,
  receivePushMessage: null,
};

function system(state = stateInit, action) {
  switch (action.type) {
    case 'SET_MQTT_STATUS':
      return {
        ...state,
        mqttStatus: action.status - 0
      };
    case 'SET_NETWORK_STATUS':
      return {
        ...state,
        networkStatus: action.status - 0
      };
    
    case SET_MQTT_SUBSCRIBED :{
      return {
        ...state,
        mqttSubscribed: action.status - 0
      }
    }
    case 'RECEIVE_PUSH_MESSAGE': {
      return {
        ...state,
        receivePushMessage: action.res
      }
    }

    default:
      return state;
  }
}
export default system;