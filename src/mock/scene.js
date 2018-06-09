export default {
	list: {
		code: 200,
		desc:"Success",
		data: [
			{
				sceneId:"0",
				name:"At home",
				icon:"at_home",
				ruleCount:2
			},
			{
				sceneId:"1",
				name:"Go away",
				icon:"go_away",
				ruleCount:2
			},
			{
				sceneId:"2",
				name:"Goodnight",
				icon:"good_night",
				ruleCount:1
			},
			{
				sceneId:"3",
				name:"GoodMorning",
				icon:"good_morning",
				ruleCount:0
			},
			{
				sceneId:"4",
				name:"Movie",
				icon:"watch_movie",
				ruleCount:0
			},
			{
				sceneId:"5",
				name:"Reading",
				icon:"reading_book",
				ruleCount:0
			}
		]
	},
	delete:{
		service:"sceneManage",
		method:"delSceneResp",
		seq:"123456",
		srcAddr:"xxxxx",
		payload:{
			sceneId:"1",
			idx:[1,2,3]
		},
		ack:{
			code:200,
			desc:"Success"
		}
	},
	deleteRule:{
		service:"sceneManage",
		method:"delSceneRuleResp",
		seq:"123456",
		srcAddr:"xxxxx",
		payload:{
			sceneId:"1",
			idx:1
		}
	},
	create:{
		code:200,
		desc:"Success",
		data:{
			sceneId:"10",
			sceneName:"test",
			sceneIcon:"At_home"
		}
	},
	executeScene:{
		service:"sceneManage",
		method:"excSceneResp ",
		seq:"123456",
		srcAddr:"xxxxx",
		payload:{
			sceneId:"1",
		},
		ack:{
			code:200,
			desc:"Success"
		}
	},
	addScene:{
		code:200,
		desc:"Success",
		data:{
			sceneId:"5"
		}
	},
	editScene:{
		code:200,
		desc:"Success",
		data:null
	},
	getSceneRuleResp:{
		service:"sceneManage",
		method:"getSceneRuleResp ",
		seq:"123456",
		srcAddr:"xxxxx",
		payload:{
			totalCount:15,
			sceneId:"1",
			then:[
				{
					idx:0,
					type:"dev",
					id:"100001",
					attr:{
						OnOff:1,
					}
				},
				{
					idx:1,
					id:"100002",
					attr:{
						OnOff:1,
					}
				}
			]
		},
		ack:{
			code:200,
			desc:"Success"
		}
	},
	addSceneRuleResp:{
		service:"sceneManage",
		method:"addSceneRuleResp ",
		seq:"123456",
		srcAddr:"xxxxx",
		payload:{
			sceneId:"1",
			idx:0,
			type:"dev",
			id:"100003",
			attr:{
				OnOff:1,
				Dimming:87
			}
		},
		ack:{
			code:200
		}
	},
	editSceneRuleResp:{
		service:"sceneManage",
		method:"editSceneRuleResp ",
		seq:"123456",
		srcAddr:"xxxxx",
		payload:{
			sceneId:"1",
			idx:0,
			type:"dev",
			id:"100002",
			attr:{
				OnOff:1,
				Dimming:87
			}
		},
		ack:{
			code:200
		}
	},
	setSecurityPasswdReq:{
		service: "security",
	    method: "setSecurityPasswdReq",
	    seq: "123456",
	    srcAddr: " x.xxxxxxx",
	    payload: {
	        "result": 0
	    },
	    ack: {
	        "code": 200,
	        "desc": "Success."
	    }
	}

}