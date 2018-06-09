const stateInit = {
  oldVersion: "",
  newVersion: "",
  deviceUpdateInfo: {},
  updateVersionNotifyList: [],
  versionList: [
  	{
  		oldVersion: "V.old",
  		newVersion: "V.new",
  	}
  ],
};

function ota(state = stateInit,action){
	switch (action.type) {
		case 'DEVICE_UPDATE_INFO':
			return {
				...state,
				deviceUpdateInfo: action.deviceUpdateInfo,
			};
		case 'UPDATE_VERSION_NOTIFY_LIST':
			return {
				...state,
				updateVersionNotifyList: action.updateVersionNotifyList,
			};
		case 'GET_VERSION_LIST':
			return{
				...state,
				versionList: action.versionList,
			}
		default: 
			return state;
	}
}

export default ota;
