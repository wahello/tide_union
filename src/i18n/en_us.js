export default {
	appName: "SmartHome",
	mainMenu: ["Home", "Scene", "Security", "Automation"],
	home: {
		addRoom: {
			title:"Add Room",
			done: "done",
			remove:"Remove",
			roomTitle:"Devices added",
			roomNameLog:"Please enter Room Name composed of 1 to 30 digit",
			dialog: {
				desc: ["更改密码成功,请重新登录"]
			},
			dialogSuccess:"更改密码成功,请重新登录",
			placeholder:["Email Address", "verification code", "New Password", "New password again"],
			sceneNameNonstandard:"房间名称不应包含特殊符号和表情！"
		},
		editRoom: {
			title:"Room  settings",
			done: "done",
			remove:"Remove",
			roomTitle:"Devices",
			sureDeleteRoom: "Are you sure Delete room？",
			roomNameLog:"Please enter Room Name composed of 1 to 30 digit",
			dialog: {
				desc: ["更改密码成功,请重新登录"]
			},
			dialogSuccess:"更改密码成功,请重新登录",
			placeholder:["Email Address", "verification code", "New Password", "New password again"]
		},
		dialog: {
			tip: ["Are sure to quit?"]
		}
	},
	public: {
		txtMore: "More",
		txtDone: "Done",
		dialog: {
			button: ["Cancel", "OK", "Resert","Remove"],
			title: ["Tip"],
			tip: ["Are you sure to remove？", "unknown error, please try later"]
		},
		delete: "Remove",
		edit: "Edit",
		connecting: 'Connecting',
		loading: 'Loading',
		cannotControl:'离网状态无法操作'
	},
	user: {
		login: {
			welcome: 'Welcome!',
			buttonText: "Sign in",
			signOut: "Sign out",
			linkSwitch: "Create account",
			forgetPw: "Forget Password?",
			placeholder: ["Email address", "Password"],
			forceToLogout: "Your device has been logined on another phone, please login again.",
			sureToLogout: "Are you sure to logout?",
			validator: ["User not found", "Unknow error"]
		},
		register: {
			title: "Create Account",
			buttonText: "Sign up",
			linkSwitch: "The account has already existed",
			// buttonSendCaptcha: "Get verification code",
			buttonSendCaptcha: "Send",
			continue: 'By continuing you agree to the',
			termsOfservice: 'Terms of Service',
			privatePolicy: 'Private Policy',
			dialog: {
				fail: {
					title: "Sign error"
				},
				sendSuccess: {
					desc: ["Please enter the code sent to your email"]
				},
				sendFail: {
					title: "Send error"
				}
			},
			placeholder: ["Email address", "Password", "Confirm password", "verification code"]
		},
		password: {
			changePassword: "修改密码",
			oldPassword: "请输入旧密码",
			newPassword: "请输入新密码",
			newPwdAgain: "请再次输入新密码",
			sumit: "提交",
			errorTip: "Old password is error"
		},
		forgetPassword: {
			title: "Forget password",
			send: "Send",
			resend: "Resend",
			Submit: "Submit",
			forgetPassword: "忘记密码",
			dialog: {
				desc: ["Change the password successfully, please log in again"],
				fail:["错误的验证码，请输入正确的验证码"],
				exit:["This email hasn't been registered yet."]
			},
			dialogSuccess: "Change the password successfully, please log in again",
			placeholder: ["Email Address", "verification code", "New Password", "New password again"]
		},
		modify: {
			title: "My center"
		},
		validator: [
			"Please enter right email address",
			"Please enter password composed of 6 to 32 digit, character and underline",
			"Two input password inconsistencies",
			"verification code must be 8 digits",
			"This email had been registered",
			"verification code is null",
			"verification code is wrong",
			"Either your email or password is incorrect",
			"You have tried your password 3 times, please try again after 5 minutes",
			"Verification has been expired",
			"Please enter nickname composed of 1 to 20 digit",
			"旧密码必须含一个大写字母，6至20位数字、字母或者下划线混合",
			"新密码必须含一个大写字母，6至20位数字、字母或者下划线混合",
			"重复新密码必须含一个大写字母，6至20位数字、字母或者下划线混合",
			"The network disconnected. Please check the network",
		],
		sending: "sending",
		password: {
			changePassword: "Modify password",
			oldPassword: "Old password",
			newPassword: "New password",
			newPwdAgain: "Repeat Password",
			title: "Tip",
			success: "New password saved.",
			fail: "密码修改失败！",
			sumit: "Submit"
		}
	},
	device: {
		title: "Device",
		subTitle: "My device",
		createGroupTip: "Create group to management",
		noDevice: "No device",
		noDeviceTip: "Please press the " + " on top to add device.",
		dialog: {
			tip: [
				"Device cannot be removed when offline",
				"Remove this device will delete all of it's data.Are you sure to remove?",
				"Failed to delete",
				"Failed to update",
				"The device name has been exited"
			]
		},
		onLine: "Online",
		offLine: "Offline",
		control: {
			switch: "Switch",
			color: "Color",
			colorTemp: "Color Temp"
		},
		edit: {
			name: "Device Name",
			room: "Group Room",
			record: "Activity Record",
			placeholder: ["Please enter device name"],
			validator: ["Empty name is not allowed", "Device name has already existed", "Device name can't excess 30 characters"]
		},
		searchGW:{
			noDevice:"Not found Gateway!",
			tryAgain:"Try again",
			refresh:"Pull to refresh",
			done:"Done",
			dialog:{
				tips:[
					"Please choose the gateway you need first.",
					"Abnormal server.",
					'Empty name is not allowed',
				]
			}
		},
		addSuccess:{
			dialog:{
				tips:[
					,
				]
			}
		},
		add1: {
			title: "Add Bulb",
			desc: "Power on the light bulb.",
			addDesc: "The bulb should flash twice to signal you that it is in pairing mode.If flashing does not occur,turn the buld on and off 6 times. this should reset the bulb and begin flashing indicating that is in in pairing mode.",
			nextStep: "Yes, add the device now.",
			fail: "Does the bulb have no response?",
			name:"Add Successfully",
			success:"Your device has been added successfully",
			doneBtn:"Done",
			continue:"Continue adding devices",
			dialog: {
				title: "Tip",
				tips: "Please connect to WiFi first！"
			}
		},
		doorAdd1: {
			title: "Add Door/Window sensor",
			desc: "Step 1",
			addDesc: "Confirm that your device is powered on.",
			nextStep: "Next step",
		},
		/*doorAdd2: {
			title: "Add Door/Window sensor",
			desc: "Step 2",
			addDesc: "Make sure your phone or tablet is conneted to the same WIFI network as your gateway.",
			nextStep: "Next step",
		},*/
		doorAdd2: {
			title: "Add Door/Window sensor",
			desc: "Step 2",
			addDesc: "The LED will begin to flash letting you know the device is in pairing mode. If it does not flash,insert a pin into the reset hole and hold it for 3 seconds.",
			nextStep: "Next step",
		},
		doorAdd3: {
			title: "Add Door/Window sensor",
			desc: "Step 3",
			addDesc: "The LED will stop flashing once the device has paired sucessfully with the gateway.",
			nextStep: "Next step",
		},
		sirenAdd1: {
			title: "Add Siren",
			desc: "Step 1",
			addDesc: "Confirm that your device is powered on.",
			nextStep: "Next step",
		},
		/*sirenAdd2: {
			title: "Add Siren",
			desc: "Step 2",
			addDesc: "Make sure your phone or tablet is conneted to the same WIFI network as your gateway.",
			nextStep: "Next step",
		},*/
		sirenAdd2: {
			title: "Add Siren",
			desc: "Step 2",
			addDesc: "Press SET button twice quickly to finish enroll.Red LED lights flashes quickly.",
			nextStep: "Next step",
		},
		sirenAdd3: {
			title: "Add Siren",
			desc: "Step 3",
			addDesc: "The LED will stop flashing once the device has paired sucessfully with the gateway.",
			nextStep: "Next step",
		},

		record: {
				title: "ActivityRecord",
			},
		addFlow: {
			title: "Device (Flow) list"
		},
		setWifi: {
			title: "Connect Device",
			textBtn: "Cancel",
			dialog: "Connect to 'Leedarson_xxxx' and return",
			currentWifi: "current Wi-Fi:",
			set: "set Wi-Fi",
			alert: {
				title: "Tip",
				tips: "Please connect to the device’s WiFi first！"
			}
		},
		noAnswer: {
			title: "Connection Help",
			desc: "Reset your bulb:",
			addDesc: "The light flashes 5 times, and restarts automatically and renders white light, which means that the bulb is restored to factory setting",
			nextStep: "Next",
			attentions: ["Attentions", "1.Ensure that the device、the phone and the router are close", "2.Ensure that the password is correct", "3.Ensure the network is available"],
		},
		connectWifi: {
			title: "Connect to Wi-Fi",
			pwds: "Password",
			nextStep: "Next",
			connecting: "Please wait,Connecting...",
			validate: {
				empty: "Please enter password",
				error: "Please enter correct password",
				less: "The password's length cann't be less than 8"
			},
			toWifi: {
				title: "Tips",
				tips: "Please connect to the WiFi you set",
			},
			setError: {
				title: "Tips",
				tips: "Please connect to the WiFi you set",
			},
			success: {
				tips: "Success！",
				finish: "Done",
				continue: "Continue",
				retry: "Retry"
			},
			fail: {
				tips: "Fail！",
				help: "Help",
				checkNet: "Please check your account and password.",
			}
		},
		switchChooseControlDevice: {
			title: "Control devices",
		},
		switchDeviceDetail:{
			showInfo:["Device Name","Group Room","Control Devices","Activity Record"],
			deviceStatus:["Online","Offline"],
			deleteText:"Remove",
			dialog: {
				button: ["Cancel", "Remove", "Resert"],
				tip: [
					"Device cannot be removed when offline",
					"Remove this device will delete all of it's data.Are you sure to remove?",
					"Failed to delete",
					"Failed to update",
					"The device name has been exited"
				]
			},
		},
			selectroom:{
				title:"SelectRoom",
				promat:"Please choose the installation location",
		},
		sirenVolume:{
			title:"Siren volume",
			showSettingInfo:["High","Medium","Low"],
			dialog: {
				tip: [
					"Set up failed",
				]
			},

		},
		sirenEdit:{
			title:"Control devices",
			showInfo:["Device Name","Group Room","Siren Volume","Activity Record"],
			dialog: {
				button: ["Cancel", "Remove", "Resert"],
				tip: [
					"Device cannot be removed when offline",
					"Remove this device will delete all of it's data.Are you sure to remove?",
					"Failed to delete",
					"Failed to update",
					"The device name has been exited"
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
		gatewayDetail:{
			title:"Added devices ",
			gatewayName:"Gateway",
			buttonName:"Add product",
			settingTitle:"Gateway",
			resetTxt:"Reset to factory",
			tip:["Reset to factory will clear all devices date, are you sure to resert factory?"]
		}
	},
	space: {
		title: "Group",
		noSpace: "No group",
		noSpaceTip: "Please press the " + " on top to add group.",
		noDevice: "No device",
		failedToDel: "",
		validator: ["Please choose an icon", "Please input group name", "Please select device to mount", "No device is selected"],
		dialog: {
			tip: ["Failed to create", "Failed to remove", "Failed to update", "The group name has been exited"]
		},
		name: "Name",
		delete: "Remove group",
		edit: "Edit Group",
		add: "Add Group",
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
		title: "Scene",
		sceneIcon:"Scene icon",
		create: {
			title:"Create scene",
			listTitle:"Select devices to include in this scene"
		},
		delete:{
			sureDelete:"Are you sure to delete the scene？"
		},
		make:{
			title:"Make this happen",
		},
		createScene:{
			offlineTips:"Your device already offline, please check.",
			sceneNameNull:"Empty name is not allowed",
			sceneNameToLong:"Scene name can't excess 30 characters",
			iconNull:"请选择场景图片",
			sceneUpper:"场景已达上限",
			sceneException:"was fail to set.",
			createSuccess:"Create success",
			editSuccess:"Edit success",
			sceneNameNonstandard:"场景名称不应包含特殊符号和表情！"
		}
	},
	setting: {
		title: "Settings",
		update: {
			title: "Firmware upgrade",
			ask: "Upgrade now？",
			desc: "The bulb would automatically turn off and out of control as well during upgrading. ",
			buttonText: "Now",
			dialog: {
				success: {
					title: "Upgraded sucessfully",
					desc: "There is no upgrade device."
				},
				fail: {
					title: "Upgrade failed",
					desc: "Connection "
				}
			}
		},
		about: {
			title: "About",
			appName: "WIFI bulb",
			appUpdate: "Version upgrade",
			appState: ["Lastest version", "Discovery new version"],
			dialog: {
				success: {
					title: "Upgrade sucessfully",
					desc: "Fixing some bugs"
				},
				fail: {
					title: "Upgrade failed",
					desc: "Current version is lastest"
				}
			}
		},
		activity:{
			title:"Activity",
			empty:"No Record"
		},
		agreement: {
			title: "User aggrement",
			content: ""
		}
	},
	refresh: {
		pull: "Pull to update",
		release: "Release to update",
		finish: "Finish"
	},

	
	automation: {
		title: "Automation",
		delect: "Remove",
		cancel: "Cancel",
		noAutomation: {
			title: "You haven't create any automation yet.",
			hint: 'You can set your devices to turn on or off, based on a specific time or event; such as the motion sensor being triggered... Press "+" to add automation.'
		},
		add: {
			title: "Add Automation",
			hint: "Set up automatic events based on time or slelecting a new device",
			selectTimeItem: {
				title: "Time of day",
				hint: "Turn on my lights at 7 am on weekdays"
			},
			selectSensorItem: {
				title: "Product or sensor",
				hint: "Turn on my lights when my motion detector detects montion"
			}
		},
		create: {
			title: "Create Automation"
		},
		during: {
			title: "During the time",
			name: ["Anytime", "Start","End", "Repeat"],
			picker:["Cancel", "Done"],
		},
		timeofday: {
			title:"Time of day",
			name:"Name",
			nameHint:"New Event",
			time:{
				title:"Time",
			   	start:"Start",
				end:"End",
				repeat:"Repeat",
				at:"At"
			},
			effects:"Effects",
			selectDevices:"Make this happen"
		},repeat:
		{
			title:"Repeat",
			workday:"Working days",
			workdayAry:["Mondey","Tuesday","Wednesday","Thursday","Friday"],
			weekday:"Weekend",
			weekdayAry:["Staturday","Sunday"]
		},repeatSelectDevices:
		{
			title:"Make this happen",
			all:"All bulb"
			
		},
		triggerdevice:{
			title:"IF this device detects"
		},
		triggermotiondetail:{
			title:"Motion Sensor",
			motiontriggered:"Triggered",
			motionuninterrupted:"Uninterrupted"
		},
		triggerdoordetail:{
			title:"Door / Window sensor",
			doorOpen:"Open",
			doorClose:"Close"
		},
		happenbulb:{
			title:"Bulb",
			turnOn:"Turn on",
			turnOff:"Turn off"
		},
		remove:{
			txt:"Remove"
		}
	},

	gateway: {
		title:'Add GateWay',
		littleTitle:['Step 1','Power on your gateway','Room name','Choose the icon'],
		nextstep:"Next step",
		dialog: {
			tip: ["Confirm to exit the application？"]
		},
		start:{
			tips:["Add Gateway","wifi"]
		},
		settings:{
			title:"WLAN",
			step:['settings','Step 2','Connect your phone to"Leedarson-004"and return to app','Settings']
		},
		foudWifi:{
			title:"Connect Wi-Fi",
			step:"Step 3"
		},
		connect:{
			tips:["WI-FI Password",'Enter WIFI Passward','Please enter password']
		},
		adding:{
			load:["Searching...",'Gateway, phone, and the device close to each other during the pairing process.']
		},
		fail:{
			tips:["Fail to Add",'Try again']
		},
		addsuccess:{
			tips:['Your device has been added successfully',
			'You can rename  your device',
			'Assign your product to a Room for easier control later',
			"Device name can't excess 30 characters",
			"Abnormal server",
			'Empty name is not allowed',

		],
			name:"Gateway",
			done:["Done",'Continue adding devices'],
			typename:['Default','Bedroom','Living room','Study','Bathroom','Dinning room','Outside','Basement','Custom'],
			error:"Please enter a custom name"
		},
		noGateway:{
			tips:['Devices cannot function without adding a gateway first.','Add gateway'],
			title:"NO gateway"
		},
		searchGateway:{
			tips:['Searching','Pull down to continue searching','Not found Gateway!'],
			button:["Try again","Done"]
		},
		failAdd:{
			tips:["Server exception",""]
		}
	},

	security: {
		stay: 'Stay',
		away: 'Away',
		off: 'OFF',
		disarm: 'Disarm',
		tip: {
			doorOrWindowOpen: 'Your door & Window still open, are you sure to enter "{mode}" mode in this situation?',
			noSiren: 'Security system could\'t work without siren',
			loadSetting: 'Loading setting',
			noDevice: 'You don\'t have any device yet! Please add first',
			noSiren: '未添加siren 设备！',
			deviceOffline: 'Your device already offline, please check.'
		},
		deviceListTip: 'Select devices that will be active during "{mode}" mode',
		alarm: 'Alarm',
		viewMore: 'View more',
		moreNotif: 'and 2 more notification',
		pageTitle: {
			main: 'Security record',
			siren: 'Siren Volume',
			stayMode: 'Stay Mode',
			awayMode: 'Away Mode',
			effectiveTime: 'Effective Time',
			record: 'Record',
			setting: 'Setting'
		},
		selectTimeTip: 'Select the amount of time before the system alarms',

	}
}