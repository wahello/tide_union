export default {
	appName: "智能家居",
	mainMenu: ["主页", "场景", "安防", "情景"],
	home: {
		addRoom: {
			title: "Add Room",
			done: "done",
			remove: "Remove",
			roomTitle: "Devices added",
			roomNameLog: "Please enter Room Name composed of 1 to 30 digit",
			dialog: {
				desc: ["更改密码成功,请重新登录"]
			},
			dialogSuccess: "更改密码成功,请重新登录",
			placeholder: ["Email Address", "Verification Code", "New Password", "New password again"],
			sceneNameNonstandard: "房间名称不应包含特殊符号和表情！"
		},
		editRoom: {
			title: "Room  settings",
			done: "done",
			remove: "Remove",
			roomTitle: "Devices",
			sureDeleteRoom: "确定删除房间？",
			roomNameLog: "Please enter Room Name composed of 1 to 30 digit",
			dialog: {
				desc: ["更改密码成功,请重新登录"]
			},
			dialogSuccess: "更改密码成功,请重新登录",
			placeholder: ["Email Address", "Verification Code", "New Password", "New password again"]
		},
		title: 'Add GateWay',
		littleTitle: ['Step 1', 'Power on your gateway'],
		nextstep: "Next step",
		dialog: {
			tip: ["确认退出应用？"]
		},
		title: '添加设备',
		nextstep: "下一步"

	},
	public: {
		txtMore: "更多",
		txtDone: "完成",
		dialog: {
			button: ["取消", "确定", "Resert", "移除"],
			title: ["提示"],
			tip: ["确认删除？", "未知错误，请稍候再试"]

		},
		delete: "删除",
		edit: "编辑",
		connecting: '连接中',
		loading: '加载中',
		cannotControl:'离网状态无法操作',
	},
	user: {
		login: {
			welcome: '欢迎!',
			buttonText: "登录",
			signOut: '退出',
			linkSwitch: "创建帐号",
			forgetPw: "忘记密码？",
			dialog: {
				fail: {
					title: "登录出错"
				}
			},
			placeholder: ["邮箱地址", "密码"],
			forceToLogout: "您的设备在另外一台设备登陆，请重新登陆",
			sureToLogout: "确定退出当前账号？",

		},
		register: {
			buttonText: "注册",
			linkSwitch: "已有账号",
			buttonSendCaptcha: "获取",
			continue: 'By continuing you agree to the',
			termsOfservice: 'Terms of Service',
			privatePolicy: 'Private Policy',
			dialog: {
				fail: {
					title: "注册出错",
					desc: ["请输入正确的邮箱地址"]
				},
				sendSuccess: {
					desc: ["验证码已发送，请前往邮箱查收"]
				},
				sendFail: {
					title: "发送出错"
				}
			},
			placeholder: ["邮箱地址", "密码", "确认密码", "验证码"]
		},
		forgetPassword: {
			title: "Forget password",
			send: "Send",
			resend: "Resend",
			Submit: "Submit",
			forgetPassword: "忘记密码",
			dialog: {
				desc: ["更改密码成功,请重新登录"],
				fail: ["错误的验证码，请输入正确的验证码"],
				exit: ["账号不存在"]
			},
			dialogSuccess: "更改密码成功,请重新登录",
			placeholder: ["Email Address", "Verification Code", "New Password", "New password again"]
		},
		modify: {
			title: "个人中心"
		},
		validator: [
			"请输入正确的邮箱地址",
			"请输入密码，必须包含一个大写字母，6至20位数字、字母或者下划线",
			"两次输入的密码不一致",
			"请输入8位验证码",
			"账号已存在",
			"验证码不能为空",
			"验证码错误",
			"密码错误，请重新输入",
			"密码连续输入错误3次，账号将被禁用5分钟",
			"验证码已失效",
			"请输入正确的用户名，1至20个字符",
			"旧密码必须含一个大写字母，6至20位数字、字母或者下划线混合",
			"新密码必须含一个大写字母，6至20位数字、字母或者下划线混合",
			"重复新密码必须含一个大写字母，6至20位数字、字母或者下划线混合",
			"Please enter Room Name composed of 1 to 30 digit"
		],
		sending: "发送中",
		password: {
			changePassword: "修改密码",
			oldPassword: "旧密码",
			newPassword: "新密码",
			newPwdAgain: "重复新密码",
			title: "提示",
			success: "New password saved.",
			fail: "密码修改失败！",
			sumit: "提交",
			error: "旧密码错误"
		}
	},
	device: {
		title: "设备",
		subTitle: "我的设备",
		createGroupTip: "创建分组，已便管理",
		noDevice: "没有设备",
		noDeviceTip: "点击顶部“+”，添加你的设备",
		dialog: {
			tip: ["离线设备不可删除", "确定删除此设备?", "删除失败", "修改失败", "设备名称已存在"]
		},
		sureToDelete: "确定删除记录？",
		onLine: "在线",
		offLine: "离线",
		control: {
			switch: "开关",
			color: "颜色",
			colorTemp: "色温"
		},
		edit: {
			name: "名称",
			room: "所属房间",
			placeholder: ["请输入设备名称"],
			validator: ["设备名称不能为空", "设备名称已存在", "设备名称请不要超过30个字符"]
		},
		searchGW: {
			noDevice: "没有发现网关!",
			tryAgain: "重试",
			refresh: "下拉刷新",
			done: "完成",
			dialog: {
				tips: [
					"请先选择你需要的网关",
				]
			}
		},
		add1: {
			title: "添加设备",
			desc: "安装你的智能灯泡：",
			addDesc: "为设备上电，当灯泡闪烁两下就可进行搜索配对",
			nextStep: "下一步",
			fail: "灯泡没有响应？",
			name: "添加成功",
			success: "您的设备添加成功！",
			doneBtn: "完成",
			continue: "继续添加设备",
			dialog: {
				title: "提示",
				tips: "您尚未连接WiFi，请先连接。"
			}
		},
		doorAdd1: {
			title: "添加门/窗传感器",
			desc: "步骤 1",
			addDesc: "Confirm that your device is powered on.",
			nextStep: "下一步",
		},
		/*doorAdd2: {
			title: "添加门/窗传感器",
			desc: "步骤 2",
			addDesc: "Make sure your phone or tablet is conneted to the same WIFI network as your gateway.",
			nextStep: "下一步",
		},*/
		doorAdd2: {
			title: "添加门/窗传感器",
			desc: "步骤 2",
			addDesc: "The LED will begin to flash letting you know the device is in pairing mode.If it does not flash,insert a pin into the reset hole and hold it for 3 seconds",
			nextStep: "下一步",
		},
		doorAdd3: {
			title: "添加门/窗传感器",
			desc: "步骤 3",
			addDesc: "Make sure your phone or tablet is conneted to the same WIFI network as your gateway.",
			nextStep: "下一步",
		},
		sirenAdd1: {
			title: "添加报警器",
			desc: "步骤 1",
			addDesc: "Confirm that your device is powered on.",
			nextStep: "下一步",
		},
		/*sirenAdd2: {
			title: "添加报警器",
			desc: "步骤 2",
			addDesc: "Make sure your phone or tablet is conneted to the same WIFI network as your gateway.",
			nextStep: "下一步",
		},*/
		sirenAdd2: {
			title: "添加报警器",
			desc: "步骤 2",
			addDesc: "The LED will begin to flash letting you know the device is in pairing mode.If it does not flash,insert a pin into the reset hole and hold it for 3 seconds",
			nextStep: "下一步",
		},
		sirenAdd3: {
			title: "添加报警器",
			desc: "步骤 3",
			addDesc: "Make sure your phone or tablet is conneted to the same WIFI network as your gateway.",
			nextStep: "下一步",
		},
		addFlow: {
			title: "设备(流程)列表"
		},
		record: {
			title: "设备记录",
		},
		setWifi: {
			title: "连接设备Wi-Fi",
			textBtn: "取消",
			dialog: "请将手机Wi-Fi链接到“Leedarson_xxxx”后返回",
			currentWifi: "当前Wi-Fi:",
			set: "设置Wi-Fi",
			alert: {
				title: "提示",
				tips: "您尚未连接到设备的WiFi，请先连接。"
			}
		},
		noAnswer: {
			title: "连接帮助",
			desc: "复位你的智能灯泡：",
			addDesc: "智能灯泡连接开关5次直至灯闪烁，灯泡自动重启并呈现白光，即表示灯泡恢复出厂设置",
			nextStep: "下一步",
			attentions: ["添加设备请注意", "1.保证设备、手机、路由器三者靠近", "2.确保网络密码正确", "3.确保路由器网络畅通"],
		},
		connectWifi: {
			title: "连接Wi-Fi",
			pwds: "请输入密码",
			nextStep: "下一步",
			connecting: "设备连接中...",
			validate: {
				empty: "请输入密码",
				error: "请输入正确的密码",
				less: "密码不能少于8位"
			},
			toWifi: {
				title: "提示",
				tips: "请连接您设置的wifi"
			},
			setError: {
				title: "提示",
				tips: "请连接您设置的wifi",
			},
			success: {
				tips: "设备连接成功！",
				finish: "完成",
				continue: "继续添加",
				retry: "重新添加"
			},
			fail: {
				tips: "连接失败！",
				help: "连接帮助?",
				checkNet: "请检查你的账号和密码是否正确",
			},

		},
		switchChooseControlDevice: {
			title: "控制设备",
		},
		switchDeviceDetail: {
			showInfo: ["设备名称", "房间归属", "控制的设备", "活动记录"],
			deviceStatus: ["在线", "离线"],
			deleteText: "移除",
			dialog: {
				button: ["取消", "移除", "复位"],
				tip: [
					"设备离线，无法删除",
					"你确定删除设备吗？",
					"删除失败",
					"更新失败",
					"设备名称已存在"
				]
			},
		},
		selectroom: {
			title: "选择房间",
			promat: "请选择设备安装的位置",
		},
		sirenVolume: {
			title: "声音",
			showSettingInfo: ["高", "中", "低"],
			dialog: {
				tip: [
					"设置失败",
				]
			},
		},
		sirenEdit: {
			title: "声音",
			showInfo: ["设备名称", "房间归属", "音量设置", "活动记录"],
			dialog: {
				button: ["取消", "移除", "复位"],
				tip: [
					"设备离线，无法删除",
					"你确定删除设备吗？",
					"删除失败",
					"更新失败",
					"设备名称已存在"
				]
			},
		},
		motionAdd1: {
			title: "Add Motion sensor",
			desc: "Step 1",
			addDesc: "Confirm that your device is powered on",
			nextStep: "Next step",
		}
		/*,
		motionAdd2: {
			title: "Add Motion sensor",
			desc: "Step 2",
			addDesc: "Make sure your phone or tablet is conneted to the same WIFI network as your gateway.",
			nextStep: "Next step",
		}*/
		,
		motionAdd2: {
			title: "Add Motion sensor",
			desc: "Step 2",
			addDesc: "The LED will begin to flash letting you know the device is in pairing mode. If it does not flash,insert a pin into the reset hole and hold it for 3 seconds.",
			nextStep: "Next step",
		}
		,
		motionAdd3: {
			title: "Add Motion sensor",
			desc: "Step 3",
			addDesc: "The LED will stop flashing once the device has paired sucessfully with the gateway.",
			nextStep: "Next step",
		},
		plugAdd1: {
			title: "Add Plug",
			desc: "Step 1",
			addDesc: "Confirm that your device is powered on and the indicator is blue",
			nextStep: "Next step",
		},
		plugAdd2: {
			title: "Add Plug",
			desc: "Step 2",
			addDesc: "Press the reset button for 3 seconds,the indicator light will turn red and flash once every second.",
			nextStep: "Next step",
		},
		gatewayDetail: {
			title: "添加设备",
			gatewayName: "网关",
			buttonName: "Add product",
			settingTitle: "Gateway",
			resetTxt: "Reset to factory",
			tip: ["Reset to factory will clear all devices date, are you sure to resert factory?"]
		}

	},

	space: {
		title: "分组",
		noSpace: "没有添加分组",
		noSpaceTip: "点击顶部“+”，添加你的分组",
		noDevice: "没有设备",
		validator: ["请选择图标", "请输入名称", "请选择需要挂载的设备", "未选择挂载任何设备"],
		dialog: {
			tip: ["添加失败", "删除失败", "修改失败", "分组名称已存在"]
		},
		name: "名称",
		delete: "删除分组",
		edit: "编辑分组",
		add: "添加分组",
		updateIcon: "Room Icon"
	},

	room: {
		title: [
			"MyRooms",
			"Room icon",
			"Room name",
			"Choose the icon"
		]
	},

	scene: {
		title: "场景",
		sceneIcon: "场景图标",
		create: {
			title: "创建场景",
			listTitle: ""
		},
		delete: {
			sureDelete: "确认删除该场景？"
		},
		make: {
			title: "触发场景",
		},
		createScene: {
			offlineTips: "Your device already offline, please check.",
			sceneNameNull: "Empty name is not allowed",
			sceneNameToLong: "Scene name can't excess 30 characters",
			iconNull: "请选择场景图片",
			sceneUpper: "场景已达上限",
			sceneException: "was fail to set.",
			createSuccess: "Create success",
			editSuccess: "Edit success",
			sceneNameNonstandard: "场景名称不应包含特殊符号和表情！"
		}
	},

	setting: {
		title: "设置",
		update: {
			title: "固件升级",
			ask: "是否需立即进行升级？",
			desc: "升级过程中灯会自动关闭，并且暂时不能控制",
			buttonText: "马上升级",
			dialog: {
				success: {
					title: "升级完成",
					desc: "暂无可升级设备"
				},
				fail: {
					title: "升级失败",
					desc: "网络连接有问题"
				}
			}
		},
		about: {
			title: "关于",
			appName: "WIFI灯",
			appUpdate: "版本更新",
			appState: ["最新版本", "有新版本"],
			dialog: {
				success: {
					title: "更新成功",
					desc: "新版本修复BUG"
				},
				fail: {
					title: "更新失败",
					desc: "已是最新版本"
				}
			}
		},
		agreement: {
			title: "用户协议",
			content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget."
		},
		activity: {
			title: "页面记录",
			empty: "无记录"
		},
	},
	refresh: {
		pull: "下拉刷新",
		release: "松开刷新",
		finish: "完成"
	},

	automation: {
		title: "情景",
		delect: "Remove",
		noAutomation: {
			title: "你还没有创建过情景",
			hint: "点击'+'创建情景"
		},
		add: {
			title: "添加情景",
			hint: "选择时间或设备创建情景",
			selectTimeItem: {
				title: "时间日期",
				hint: "每天早上七点开灯"
			},
			selectSensorItem: {
				title: "产品或传感器",
				hint: "当我的门磁打开时灯亮"
			}
		},
		create: {
			title: "创建情景"
		},
		during: {
			title: "时间段",
			name: ["任何时间", "开始", "结束", "重复"],
			picker: ["取消", "确定"],
		},
		timeofday: {
			title: "周期",
			name: "名称",
			nameHint: "新事件",
			time: {
				title: "时间",
				start: "开始",
				end: "结束",
				repeat: "重复",
				at: "At"
			},
			effects: "时间",
			selectDevices: "选择设备"
		}, repeat:
			{
				title: "周期",
				workday: "工作日",
				workdayAry: ["星期一", "星期二", "星期三", "星期四", "星期五"],
				weekday: "周末",
				weekdayAry: ["星期六", "星期七"]
			}, repeatSelectDevices:
			{
				title: "选择设备",
				all: "All bulb"

			},
		triggerdevice: {
			title: "IF this device detects"
		},
		triggermotiondetail: {
			title: "Motion Sensor",
			motiontriggered: "Triggered",
			motionuninterrupted: "Uninterrupted"
		},
		triggerdoordetail: {
			title: "Door / Window sensor",
			doorOpen: "Open",
			doorClose: "Close"
		},
		happenbulb: {
			title: "Bulb",
			turnOn: "Turn on",
			turnOff: "Turn off"
		},
		remove: {
			txt: "删除"
		}
	},

	gateway: {
		title: 'Add GateWay',
		littleTitle: ['Step 1', 'Power on your gateway', 'Room name', 'Choose the icon'],
		nextstep: "Next step",
		dialog: {
			tip: ["确认退出应用？"]
		},
		start: {
			tips: ["添加网关", "wifi"]
		},
		settings: {
			title: "WLAN",
			step: ['settings', 'Step 2', 'Connect your phone to"Leedarson-004"and return to app', 'Settings']
		},
		foudWifi: {
			title: "Connect Wi-Fi",
			step: "Step 3"
		},
		connect: {
			tips: ["WI-FI Password", 'Enter WIFI Passward', 'Please enter password']
		},
		adding: {
			load: ["Searching...", 'Gateway, phone, and the device close to each other during the pairing process.']
		},
		fail: {
			tips: ["Fail to Add", 'Try again']
		},
		addsuccess: {
			tips: ['Your device has been added successfully',
				'You can rename  your device',
				'Assign your product to a Room for easier control later',
				"Device name can't excess 30 characters",
				"Abnormal server",
				'Empty name is not allowed',
			],
			name: "Gateway",
			done: ["Done", 'Continue adding devices'],
			typename: ['Default', 'Bedroom', 'Living room', 'Study', 'Bathroom', 'Dinning room', 'Outside', 'Basement', 'Custom'],
			error: "Please enter a custom name"
		},
		noGateway: {
			tips: ['Devices cannot function without adding a gateway first.', 'Add gateway'],
			title: "NO gateway"
		},
		searchGateway: {
			tips: ['Searching', 'Pull down to continue searching', 'Not found Gateway!'],
			button: ["Try again", "Done"]
		},
		failAdd: {
			tips: ["Server exception", ""]
		}
	}
}