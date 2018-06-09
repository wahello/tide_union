import user from './user';
import device from './device';
import room from './room';
import home from './home';
import scene from './scene';
import automation from './automation';
import ipcplan from './ipcplan';
import security from './security';

// const rules = [];
export default function mock(request) {
	// for(var i = 0; i < rules.length; i++){
	// 	for(let key in rules[i]){
	// 		const rules[i](request);
	// 		if(rules[i]){
	// 			return rules[i];
	// 		}
	// 	}

	// 	return {
	// 		code: 200
	// 	}
	// }
	const {
		service
	} = request;
	console.log(" 111service : ",service);
	switch (service) {
		case'AppUpgrade':
			switch (request.action) {
				case 'checkUpdateH5':
					return {
						updateInfo: 'Fix',
						newVersion:"V2.0.1",
						isForeceUpdate:0,
						versionDiff:1
					}
				case 'startUpdateH5':
					return {
						code: 200
					}
			}
		break;
		case 'HTTP':
			const {
				url
			} = request.data;

			if (url.indexOf('activeUser') !== -1) {
				return {
					code: 200
				}
			}

			if (url.indexOf('refreshUserToken') !== -1) {
				return {
					code: 200,
					data: {
						accessToken: '',
						refresToken: ''
					}
				}
			}

			if (url.indexOf('checkUserName') !== -1) {
				return {
					code: 200
				}
			}
			if (url.indexOf('login') !== -1) {
				return user.login;
			}
			if (url.indexOf('addRoom') !== -1) {
				return room.addRoom;
			}
			if (url.indexOf('delRoom') !== -1) {
				return room.delRoom;
			}
			if (url.indexOf('editRoom') !== -1) {
				return room.editRoom;
			}
			if (url.indexOf('appUserResetPassword') !== -1) {
				return {
					code: 200
				}
			}
			if (url.indexOf('appUserModifyPassword') !== -1) {
				return {
					code: 200
				};
			}
			if (url.indexOf('getHomeList') !== -1) {
				return home.homes;
			}
			if (url.indexOf('getProductInfo') !== -1) {
				return home.getProductInfoResp;
			}
			if (url.indexOf('getDevActivityById') !== -1) {
				return device.deviceRecordResp;
			}
			if (url.indexOf('getAllDevActivity') !== -1) {
				return device.deviceRecordResp;
			}
			if (url.indexOf('delDevActivity') !== -1) {
				return device.deviceRecordResp;
			}
			if (url.indexOf('delAllDevActivity') !== -1) {
				return device.deviceRecordResp;
			}
			if (url.indexOf('getScenes') !== -1) {
				return scene.list;
			}
			if (url.indexOf('scene/delete') !== -1) {
				return scene.delete;
			}
			if (url.indexOf('scene/create') !== -1) {
				return scene.create;
			}
			if (url.indexOf('getRoomList') !== -1) {
				return room.roomList;
			}
			if (url.indexOf('addScene') !== -1) {
				return scene.addScene;
			}
			if (url.indexOf('editScene') !== -1) {
				return scene.editScene;
			}
			// 新增房间
			if (url.indexOf('space/create') !== -1) {
				return room.addRoom;
			}
			if (url.indexOf('space/create') !== -1) {
				return room.addRoom;
			}
			if (url.indexOf('automation/getAutoList') !== -1) {
				return automation.getAutoList;
			}
			if (url.indexOf('automation/addAuto') !== -1) {
				return automation.addAuto;
			}
			if (url.indexOf('automation/editAuto') !== -1) {
				return automation.editAuto;
			}
			if(url.indexOf('addAutoRuleReq') !== -1){
				return automation.addAutoRule;
			}
			if(url.indexOf('editAutoRuleReq') !== -1){
				return automation.editAutoRule;
			}
			if(url.indexOf('getVideoFileList') !== -1){
				return ipcplan.videoFileList;
			}
			if(url.indexOf('getVideoEventList') !== -1){
				return ipcplan.eventFileList;
			}
			if(url.indexOf('getP2pId') !== -1){
				return ipcplan.p2pId;
			}
			if(url.indexOf('getPlanType') !== -1){
				return ipcplan.planType;
			}
			if(url.indexOf('getEventPhotoList') !== -1){
				return ipcplan.eventPhotoList;
			}
			return {
				code: 200
			}
			break;

		case 'System':
			const {
				action
			} = request;
			switch (action) {
				case 'getDeviceID':
					return {
						deviceId: '123'
					}
			}
			break;
		case 'Map':
			return {
					 code:200,
					 desc:"Success",
				   	 latitude:"40.14924",
				   	 longitude:"113.211",
				   	 timezone:"GMT+8",
				   	 detail:"FuJian XiaMen SiMingQu"
					}
			break;
		case 'MQTT':
			if(request.data === undefined) {
				request.data = {
					message: {}
				}
			}
			const {
				message
			} = request.data;
			const method = message && message.method || '';
			
			if ( request.action.indexOf('subscribe') !== -1) {
				return {
					code: 200
				}
			}

			if (method && method.indexOf('getCountDownReq') !== -1) {
				return device.getCountDownResp;
			}
			
			if (method && method.indexOf('setCountDownEnableReq') !== -1) {
				return device.setCountDownEnableResp;
			}
			
			if (method && method.indexOf('setCountDownReq') !== -1) {
				return device.setCountDownEnableResp;
			}
			
			// 获取设备列表请求
			if (method && method.indexOf('getDevListReq') !== -1) {
				return device.devListResp;
				/*} else if (method && method.indexOf('getDevInfoReq') !== -1) {
					console.log('return的数据是' + device.deviceDetailResp.payload.name);*/
			}

			if (method && method.indexOf('getDevInfoReq') !== -1) {
				console.log('return的数据是' + device.deviceDetailResp.payload.name);
				return device.deviceDetailResp;
			}

			if (method && method.indexOf('delSceneReq') !== -1) {
				console.log("return的数据是 = " + scene.delete.ack.code);
				return scene.delete;
			}

			if (method && method.indexOf('delSceneRuleReq') !== -1) {
				console.log("return的数据是 = " + scene.deleteRule);
				return scene.deleteRule;
			}

			if (method && method.indexOf('getRoomDevListReq') !== -1) {
				if (request.data.message.payload.roomId == 8) {
					return device.roomDevListResp_empty;
				}
				console.log("getRoomDevListReq = " , device.roomDevListResp);
				return device.roomDevListResp;
			}

			if (method && method.indexOf('setDevAttrReq') !== -1) {
				return device.deviceAttrResp
			}

			if (method && method.indexOf('setDevInfoReq') !== -1) {
				return device.deviceInfoResp
			}

			if (method && method.indexOf('excSceneReq') !== -1) {
				return scene.executeScene;
			}

			if (method && method.indexOf('getSceneRuleReq') !== -1) {
				return scene.getSceneRuleResp;
			}

			if (method && method.indexOf('addSceneRuleReq') !== -1) {
				return scene.addSceneRuleResp;
			}

			if (method && method.indexOf('editSceneRuleReq') !== -1) {
				return scene.editSceneRuleResp;
			}

			if (method && method.indexOf('getAutoRuleReq') !== -1) {
				return automation.getAutoRuleResp[message.payload.autoId]
				// return automation.getAutoRuleResp["0001"]
			}

			if (method && method.indexOf('devUnbindReq') !== -1) {
				return {
					"service": "devManage",
					"method": "devUnbindResp",
					"seq": "123456",
					"srcAddr": "xxxxxxx",
					"payload": {
						"timestamp ": "2014-04-05T12:30:00-02:00"
					},
					"ack": {
						"code": 200,
						"desc": "Success."
					}
				}
			}

			if (method && method.indexOf('editAutoRule') !== -1) {
				return automation.editAutoRule;
			}
			if (method && method.indexOf('addAutoRule') !== -1) {
				return automation.addAutoRule;
			}
			if (method && method.indexOf('delDevReq') !== -1) {
				return device.delDevReq;
			}
			if (method && method.indexOf('setAutoEnableReq') !== -1) {
				return automation.setAutoEnableReq;
			}
			if(method && method.indexOf('getVerListReq') !== -1){
				return ipcplan.getVerListResp;
			}
			if(method && method.indexOf('excOtaReq') !== -1){
				return ipcplan.updateOtaStautsNotif;
			}
			if(method && method.indexOf('setRebootReq') !== -1){
				return ipcplan.setRebootResp;
			}
			if(method && method.indexOf('setSecurityPasswdReq') !== -1){
				return scene.setSecurityPasswdReq;//设置安防密码
			}
			if(method && method.indexOf('setResetReq') !== -1){
				return ipcplan.setResetResp;
			}
			if(method && method.indexOf('setSDFormatReq') !== -1){
				return ipcplan.setSDFormatResp;
			}
			if(method && method.indexOf('setDevTimezoneReq') !== -1){
				return ipcplan.setDevTimezoneReq;
			}
			if(method && method.indexOf('getDevTimezoneReq') !== -1){
				return ipcplan.getDevTimezone;
			}
			if(method && method.indexOf('getSDRecordConfigReq') !== -1){
				return ipcplan.getSDRecordConfigResp;
			}
			if(method && method.indexOf('setSDRecordConfig') !== -1){
				return ipcplan.setSDRecordConfigResp;
			}
      if(method && method.indexOf('setEventNotifReq') !== -1){
				return {
					service: "IPC",
					method: "setEventNotifResp",
					seq: "123456",
					srcAddr: "xxxxxxx",
					payload: {
						timestamp: "2014-04-05T12:30:00-02:00"
					},
					ack: {
						code: 200,
						desc: "Success."
					}
				}
			}
      if(method && method.indexOf('getEventNotifReq') !== -1){
				return {
					service: "IPC",
					method: "getEventNotifResp",
					seq: "123456",
					srcAddr: "xxxxxxx",
					payload: {
            eventNotifEnabled: true,
						timestamp: "2014-04-05T12:30:00-02:00"
					},
					ack: {
						code: 200,
						desc: "Success."
					}
				}
			}
			if(method && method.indexOf('getTimeList') !== -1){
				return ipcplan.getTimeListResp
			}
			if(method && method.indexOf('getSDRecordList') !== -1){
				return ipcplan.getSDRecordListResp
			}

			//安防mock
			if(security[method]){
				return security[method]
			}

			break;
		case 'SmartLink':
			switch (request.action) {
				case 'config':
					return {
						"code": 200,
						"desc": "success",
						"data": {
							"mac": "1cd6bd0041a5"
						}
					}
			}
			break;
		case 'H5_MQTT':
			if (request.action === 'mqttStatusChange') {
				return {
					status: 1
				}
			}
			break;

		case 'H5_UDP':
			if (request.action === 'pushMessage') {
				return device.devDiscoveryReq;
			}

			break;
		case 'DataBase':
			console.log("DataBase.action = ", request.action);
			if (request.action === 'querySQL') {
				return device.devListResp;
			}
			break;
			
		case 'H5_System':
			if(request.action === 'networkStatus'){
				return {
					state: 1
				}
			}
			break;
		
	}
}