export default {
	getAutoList: {
		code: 200,
		desc: "Success",
		data: {
			result:[{
			"autoId": "0001",
			"name": "autoName0001",
			"type": "timer",
			"enable": true,
			"icon": "live.png"
		},
		{
			"autoId": "0002",
			"name": "autoName0002",
			"type": "dev",
			"enable": true,
			"icon": "live.png"
		},
		{
			"autoId": "0003",
			"name": "autoName0003",
			"type": "timer",
			"enable": false,
			"icon": "live.png"
		},
		{
			"autoId": "0004",
			"name": "autoName0004",
			"type": "dev",
			"enable": false,
			"icon": "live.png"
		},
		{
			"autoId": "0005",
			"name": "__stay_mode",
			"type": "dev",
			"enable": false,
			"icon": "live.png",
			delay: 30
		},
		{
			"autoId": "0006",
			"name": "999",
			"type": "dev",
			"enable": false,
			"icon": "live.png",
			delay: 0
		},
		{
			"autoId": "0006",
			"name": "999",
			"type": "dev",
			"enable": false,
			"icon": "live.png",
			delay: 0
		},
		{
			"autoId": "0006",
			"name": "999",
			"type": "dev",
			"enable": false,
			"icon": "live.png",
			delay: 0
		},{
			"autoId": "0006",
			"name": "1233",
			"type": "dev",
			"enable": false,
			"icon": "live.png",
			delay: 0
		},
		{
			"autoId": "0006",
			"name": "97777",
			"type": "dev",
			"enable": false,
			"icon": "live.png",
			delay: 0
		},
		{
			"autoId": "ssd",
			"name": "5666622",
			"type": "dev",
			"enable": false,
			"icon": "live.png",
			delay: 0
		},
		{
			"autoId": "0006",
			"name": "999",
			"type": "dev",
			"enable": false,
			"icon": "live.png",
			delay: 0
		},{
			"autoId": "0006",
			"name": "1233",
			"type": "dev",
			"enable": false,
			"icon": "live.png",
			delay: 0
		},
		{
			"autoId": "0006",
			"name": "97777",
			"type": "dev",
			"enable": false,
			"icon": "live.png",
			delay: 0
		},
		{
			"autoId": "ssd",
			"name": "last",
			"type": "dev",
			"enable": false,
			"icon": "live.png",
			delay: 0
		}
	]}
	},
	addAuto: {
		"code": 200,
		"desc": "Success",
		"data": {
			"autoId": "0005"
		}
	},
	editAuto: {
		"code": 200,
		"desc": "Success",
		"data": null
	},
	delAutoResp: {
		"service": " autoManage",
		"method": "delAutoResp",
		"seq": "123456",
		"srcAddr": " xxxxxxx",
		"payload": {
			"autoId ": "123456",
			"idx": [0]
		},
		"ack": {
			"code": 200,
			"desc": "Success."
		}
	},
	getAutoRuleResp: {
		'0001': {
			"service": "autoManage",
			"method": " getAutoRuleReqsp",
			"seq": "123456",
			"srcAddr": " xxxxxxx",
			"payload": {
				"autoId": "0001",
				"if": {
					"valid": {
						"begin": "08:08",
						"end": "09:09",
						"repeat": [0, 1, 2, 3, 4, 5, 6]
					},
					"trigger": [{
						"idx": "00001",
						"trigType": "Sensor_Doorlock",
						"devId": "b6f7c7f3e7a14a74be155d6a0f7f38e1",
						"attr": "door",
						"compOp": "==",
						"value": "1",
					},
					{
						"idx": "00001",
						"trigType": "Sensor_Doorlock",
						"devId": "b6f7c7f3e7a14a74be155d6a0f7f38e1",
						"attr": "door",
						"compOp": "==",
						"value": "1",
					},
					{
						"idx": 0,
						"trigType": "sunrise",
						"at": "15:59",
						"repeat": [0, 1, 2, 3, 4, 5, 6],
						"intervalTime":3660,
						"intervalType":2
					}]

				},
				"then": [{
					"idx": 1,
					"thenType": "Light_RGBW",
					"devId": "b6f7c7f3e7a14a74be155d6a0f7f38e1",
					"attr": {
						"OnOff": 1,
						"dimming": 87
					}
				},
				{
					"idx": 1,
					"thenType": "Light_RGBW",
					"devId": "9cfc9d1744a04fc5baac076cc2672dcd",
					"attr": {
						"OnOff": 1,
						"cct": 5000
					}
				}
				]
			},
			"ack": {
				"code": 200,
				"desc": "Success"
			}
		},
		'0002': {
			"service": "autoManage",
			"method": " getAutoRuleReqsp",
			"seq": "123456",
			"srcAddr": " xxxxxxx",
			"payload": {
				"autoId": "0002",
				"if": {
					"valid": {
						"begin": "08:08",
						"end": "09:09",
						"repeat": [0, 1, 2, 3, 4, 5, 6]
					},
					"trigger": [{
						"idx": "00001",
						"trigType": "Sensor_Doorlock",
						"devId": "100005",
						"attr": "door",
						"compOp": "==",
						"value": "1",
					}]

				},
				"then": [{
					"idx": 1,
					"thenType": "Light_RGBW",
					"devId": "b6f7c7f3e7a14a74be155d6a0f7f38e1",
					"attr": {
						"OnOff": 1,
						"dimming": 87
					}
				},
				{
					"idx": 1,
					"thenType": "Light_RGBW",
					"devId": "9cfc9d1744a04fc5baac076cc2672dcd",
					"attr": {
						"OnOff": 1,
						"cct": 5000
					}
				}

				]
			},
			"ack": {
				"code": 200,
				"desc": "Success"
			}
		},
		'0003': {
			"service": "autoManage",
			"method": " getAutoRuleReqsp",
			"seq": "123456",
			"srcAddr": " xxxxxxx",
			"payload": {
				"autoId": "0003",
				"if": {
					"valid": {
						"begin": "08:05",
						"end": "09:09",
						"repeat": [0, 1, 2, 3, 4, 5, 6]
					},
					"trigger": [{
						"idx": "00001",
						"trigType": "Sensor_Doorlock",
						"devId": "100005",
						"attr": "door",
						"compOp": "==",
						"value": "1",
					}]

				},
				"then": [{
					"idx": 1,
					"thenType": "Light_RGBW",
					"devId": "b6f7c7f3e7a14a74be155d6a0f7f38e1",
					"attr": {
						"OnOff": 1,
						"dimming": 87
					}
				},
				{
					"idx": 1,
					"thenType": "Light_RGBW",
					"devId": "9cfc9d1744a04fc5baac076cc2672dcd",
					"attr": {
						"OnOff": 1,
						"cct": 5000
					}
				}
				]
			},
			"ack": {
				"code": 200,
				"desc": "Success"
			}
		},
		'0004': {
			"service": "autoManage",
			"method": " getAutoRuleReqsp",
			"seq": "123456",
			"srcAddr": " xxxxxxx",
			"payload": {
				"autoId": "0005",
				"if": {
					"valid": {
						"begin": "08:30",
						"end": "09:09",
						"repeat": [0, 1, 2, 3, 4, 5, 6]
					},
					"trigger": [{
						"idx": "00001",
						"trigType": "Sensor_Doorlock",
						"devId": "100005",
						"attr": "door",
						"compOp": "==",
						"value": "1",
					}]

				},
				"then": [{
					"idx": 1,
					"thenType": "Light_RGBW",
					"devId": "b6f7c7f3e7a14a74be155d6a0f7f38e1",
					"attr": {
						"OnOff": 1,
						"dimming": 87
					}
				},
				{
					"idx": 1,
					"thenType": "Light_RGBW",
					"devId": "9cfc9d1744a04fc5baac076cc2672dcd",
					"attr": {
						"OnOff": 1,
						"cct": 5000
					}
				}

				]
			},
			"ack": {
				"code": 200,
				"desc": "Success"
			}
		},
		'0005': {
			"service": "autoManage",
			"method": " getAutoRuleReqsp",
			"seq": "123456",
			"srcAddr": " xxxxxxx",
			"payload": {
				"autoId": "0005",
				"if": {
					"valid": {
						"begin": "08:40",
						"end": "09:09",
						"repeat": [0, 1, 2, 3, 4, 5, 6]
					},
					"trigger": [{
						"idx": "00001",
						"trigType": "Sensor_Doorlock",
						"devId": "100005",
						"attr": "door",
						"compOp": "==",
						"value": "1",
					}]

				},
				"then": [{
					"idx": 1,
					"thenType": "Light_RGBW",
					"devId": "b6f7c7f3e7a14a74be155d6a0f7f38e1",
					"attr": {
						"OnOff": 1,
						"dimming": 87
					}
				},
				{
					"idx": 1,
					"thenType": "Light_RGBW",
					"devId": "9cfc9d1744a04fc5baac076cc2672dcd",
					"attr": {
						"OnOff": 1,
						"cct": 5000
					}
				}

				]
			},
			"ack": {
				"code": 200,
				"desc": "Success"
			}
		},
		'0006': {
			"service": "autoManage",
			"method": " getAutoRuleReqsp",
			"seq": "123456",
			"srcAddr": " xxxxxxx",
			"payload": {
				"autoId": "0006",
				"if": {
					"valid": {
						"begin": "08:10",
						"end": "09:09",
						"repeat": [0, 1, 2, 3, 4, 5, 6]
					},
					"trigger": [{
						"idx": "00001",
						"trigType": "Sensor_Doorlock",
						"devId": "100005",
						"attr": "door",
						"compOp": "==",
						"value": "1",
					}]

				},
				"then": [{
					"idx": 1,
					"thenType": "Light_RGBW",
					"devId": "b6f7c7f3e7a14a74be155d6a0f7f38e1",
					"attr": {
						"OnOff": 1,
						"dimming": 87
					}
				},
				{
					"idx": 1,
					"thenType": "Light_RGBW",
					"devId": "9cfc9d1744a04fc5baac076cc2672dcd",
					"attr": {
						"OnOff": 1,
						"cct": 5000
					}
				}

				]
			},
			"ack": {
				"code": 200,
				"desc": "Success"
			}
		}
	},
	setAutoEnableResp: {
		"service": "autoManage ",
		"method": "setAutoEnableResp",
		"seq": "123456",
		"srcAddr": " xxxxxxx",
		"payload": {
			"autoId": "0001",
			"enable": false,
		},
		"ack": {
			"code": 200,
			"desc": "Success."
		}

	},
	delAutoRuleResp :{
		"service": "autoManage",
		"method": "delAutoRuleResp",
		"seq": "123456",
		"srcAddr": " xxxxxxx",
		"payload": {
			"autoId": "0001",
			"idx": 0

		}

	},
	delAutoRuleResp: {
		"service": "autoManage",
		"method": "delAutoRuleResp",
		"seq": "123456",
		"srcAddr": " xxxxxxx",
		"payload": {
			"autoId": "0001",
			"idx": 0
		}

	},
	editAutoRule: {
		"service": "automation",
		"method": " editAutoRuleResp",
		"seq": "123456",
		"srcAddr": " xxxxxxx",
		"payload": {
			"autoId": "0005",
			"if": {
				"valid": {
					"begin": "08:40",
					"end": "09:09",
					"repeat": [0, 1, 2, 3, 4, 5, 6]
				},
				"trigger": [{
					"idx": "00001",
					"trigType": "Sensor_Doorlock",
					"devId": "100005",
					"attr": "door",
					"compOp": "==",
					"value": "1",
				}]

			},
			"then": [{
				"idx": 1,
				"thenType": "Light_RGBW",
				"devId": "b6f7c7f3e7a14a74be155d6a0f7f38e1",
				"attr": {
					"OnOff": 1,
					"dimming": 87
				}
			},
			{
				"idx": 1,
				"thenType": "Light_RGBW",
				"devId": "9cfc9d1744a04fc5baac076cc2672dcd",
				"attr": {
					"OnOff": 1,
					"cct": 5000
				}
			}

			]
		},
		"ack": {
			"code": 200,
			"desc": "Success"
		}
	},
	addAutoRule:{
		"service": "automation",
		"method": " addAutoRuleResp",
		"seq": "123456",
		"srcAddr": " xxxxxxx",
		"payload": {
			"autoId": "0005",
			"if": {
				"valid": {
					"begin": "08:40",
					"end": "09:09",
					"repeat": [0, 1, 2, 3, 4, 5, 6]
				},
				"trigger": [{
					"idx": "00001",
					"trigType": "Sensor_Doorlock",
					"devId": "100005",
					"attr": "door",
					"compOp": "==",
					"value": "1",
				}]

			},
			"then": [{
				"idx": 1,
				"thenType": "Light_RGBW",
				"devId": "b6f7c7f3e7a14a74be155d6a0f7f38e1",
				"attr": {
					"OnOff": 1,
					"dimming": 87
				}
			},
			{
				"idx": 1,
				"thenType": "Light_RGBW",
				"devId": "9cfc9d1744a04fc5baac076cc2672dcd",
				"attr": {
					"OnOff": 1,
					"cct": 5000
				}
			}

			]
		},
		"ack": {
			"code": 200,
			"desc": "Success"
		}
	}
}