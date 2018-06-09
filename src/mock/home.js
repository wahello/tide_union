export default {
	getProductInfoResp: {
		"code": 200,
		"desc": "Success",
		"data": [{
				"productId": "00001",
				"productName": "lds smart light a60",
				"displayName": "lds smart light a60",
				"model": "lds.light.a60",
				"devType": "Light_RGBW",
				" networkType": "zigbee",
				" configNetMode": ["AP", "SL"],
				"attrs": [{
						"displayName": "开关",
						"name": "OnOff",
						"dataType": "bool",
						"type": "statusWritable",
						"id": 0,
						"desc": "打开或者关闭灯泡"
					},
					{
						"displayName": "亮度",
						"name": "dimming",
						"dataType": "uint8",
						"type": "statusWritable",
						"uintSpec": {
							"addition": 0,
							"max": 100,
							"ratio": 1,
							"min": 0
						},
						"id": 1,
						"desc": "调节灯泡的亮度"
					},
					{
						"displayName": "色温",
						"name": "cct",
						"dataType": "uint8",
						"type": "statusWritable",
						"uintSpec": {
							"addition": 0,
							"max": 6500,
							"ratio": 1,
							"min": 2700
						},
						"id": 2,
						"desc": "调节灯泡的色温"
					},
					{
						"displayName": "颜色",
						"name": "rgbw",
						"dataType": "uint8",
						"type": "statusWritable",
						"uintSpec": 7,
						"id": 3,
						"desc": "调节灯泡的颜色"
					}
				]
			},
			{
				"productId": "00002",
				"productName": "门磁传感器",
				"displayName": "门磁传感器",
				"model": "lds.light.a60",
				"devType": "Sensor_Doorlock",
				" networkType": "zigbee",
				" configNetMode": ["AP", "SL"],
				"attrs": [{
						"displayName": "开关",
						"name": "OnOff",
						"dataType": "bool",
						"type": "statusReadonly",
						"id": 0,
						"desc": "打开或者关闭门磁"
					},
					{
						"displayName": "电量报警",
						"name": "batteryAlarm",
						"dataType": "boolean",
						"type": "statusReadonly",
						"id": 1,
						"desc": "门磁低电量警告"
					},
					{
						"displayName": "传感器电池电量",
						"name": "batteryLevel",
						"dataType": "uint8",
						"type": "statusReadonly",
						"uintSpec": {
							"addition": 0,
							"max": 100,
							"ratio": 1,
							"min": 0
						},
						"id": 2,
						"desc": "门磁电池电量"
					}
				]
			},
			{
				"productId": "00003",
				"productName": "红外人体传感器",
				"displayName": "红外人体传感器",
				"model": "lds.light.a60",
				"devType": "Sensor_PIR",
				" networkType": "zigbee",
				" configNetMode": ["AP", "SL"],
				"attrs": [{
						"displayName": "捕获状态",
						"name": "occupancy",
						"dataType": "bool",
						"type": "statusReadonly",
						"id": 0,
						"desc": "捕获状态,1捕获 0未捕获"
					},
					{
						"displayName": "电量报警",
						"name": "batteryAlarm",
						"dataType": "boolean",
						"type": "statusReadonly",
						"id": 1,
						"desc": "传感器低电量警告"
					},
					{
						"displayName": "传感器电池电量",
						"name": "batteryLevel",
						"dataType": "uint8",
						"type": "statusReadonly",
						"uintSpec": {
							"addition": 0,
							"max": 100,
							"ratio": 1,
							"min": 0
						},
						"id": 2,
						"desc": "传感器电池电量"
					}
				]
			},
			{
				"productId": "00004",
				"productName": "声光报警器",
				"displayName": "声光报警器",
				"model": "lds.light.a60",
				"devType": "Alarm_Siren",
				" networkType": "zigbee",
				" configNetMode": ["AP", "SL"],
				"attrs": [{
					"displayName": "声光报警器",
					"name": "sirenLevel",
					"dataType": "boolean",
					"type": "statusWritable",
					"uintSpec": {
						"max": 3,
						"mid": 2,
						"min": 1,
						"mute": 0,
					},
					"id": 1,
					"desc": "传感器低电量警告"
				}]
			},
			{
				"productId": "00006",
				"productName": "网关",
				"displayName": "网关",
				"model": "lds.light.a60",
				"devType": "Multi_Gateway",
				" networkType": "zigbee",
				" configNetMode": ["AP", "SL"],
				"attrs": [{
						"displayName": "开关",
						"name": "OnOff",
						"dataType": "bool",
						"type": "statusWritable",
						"id": 0,
						"desc": "打开或者关闭灯泡"
					},
					{
						"displayName": "亮度",
						"name": "dimming",
						"dataType": "uint8",
						"type": "statusWritable",
						"uintSpec": {
							"addition": 0,
							"max": 100,
							"ratio": 1,
							"min": 0
						},
						"id": 1,
						"desc": "调节灯泡的亮度"
					},
					{
						"displayName": "色温",
						"name": "cct",
						"dataType": "uint8",
						"type": "statusWritable",
						"uintSpec": {
							"addition": 0,
							"max": 6500,
							"ratio": 1,
							"min": 2700
						},
						"id": 2,
						"desc": "调节灯泡的色温"
					},
					{
						"displayName": "颜色",
						"name": "rgbw",
						"dataType": "uint8",
						"type": "statusWritable",
						"uintSpec": 7,
						"id": 3,
						"desc": "调节灯泡的颜色"
					}
				]
			}
		]

	},
	homes: {
		code: 200,
		data: {
			homes: [{
				homeId: 1,
				name: '家庭1',
				icon: '',
				isSecurityPwd: true
			}, {
				homeId: 2,
				name: '家庭2',
				icon: '',
				isSecurityPwd: true
			}, {
				homeId: 3,
				name: '家庭3',
				icon: '',
				isSecurityPwd: true
			}, {
				homeId: 4,
				name: '家庭4',
				icon: '',
				isSecurityPwd: true
			}]
		}
	}
}