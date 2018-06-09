export const SET_MQTT_SUBSCRIBED = 'SET_MQTT_SUBSCRIBED';
export function setMqttStatus(status) {
  return dispatch => {
    dispatch({
      type: 'SET_MQTT_STATUS',
      status,
    });
  }
}

export function setNetworkStatus(status) {
  return dispatch => {
    dispatch({
      type: 'SET_NETWORK_STATUS',
      status,
    });
  }
}

export function setMqttSubscribed(status) {
  return dispatch => {
    dispatch({
      type: SET_MQTT_SUBSCRIBED,
      status,
    });
  }
}

export function onReceivePushMessage(res) {
  return dispatch => {
    dispatch({
      type: 'RECEIVE_PUSH_MESSAGE',
      res,
    });
  }
}