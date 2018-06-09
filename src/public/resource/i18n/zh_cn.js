export default {
	appName: "智能家居",
	mainMenu: ["Home", "Scene", "Security", "Automation"],
	home: {
		addRoom: {
			title:"Create Room",
			done: "done",
			remove:"Remove",
			roomTitle:"Devices",
			roomNameLog:"Room name can't excess 20 characters!",
			dialog: {
				desc: ["The rooms you add can't excess 10."],
				result:["{feedbackNum} Modify success. {changeNum} Modify fail."],
				offline:["Your device already offline, please check."],
				isModify:["Save the change you've made?"]
			},
			loading:"loading",
			length:"The devices you add can't excess 50.",
			sceneNameNonstandard:"Special character and emoj are not allowed for room name.",
			offline:"Your device already offline, please check.",
			saveFail:"save failed",
			emptyRoomIcon:"Plese choose the room icon.",
			emptyRoomName:"Empty room name is not allowed"
		},
		editRoom: {
			title:"Room  settings",
			done: "done",
			remove:"Remove",
			roomTitle:"Devices",
			sureDeleteRoom: "Are you sure you want to remove the room?",
			roomNameLog:"Room name can't excess 30 characters!",
			dialog: {
				desc: ["The password change success,please sign in again."]
			},
			dialogSuccess:"The password change success,please sign in again.",
			placeholder:["Email Address", "Verification code", "New Password", "Reenter Password"]
		},
		title:'Adding hub',
		littleTitle:['Step 1','Power on your hub'],
		nextstep:"Next step",
		dialog: {
			tip: ["You will not be able to control the device and receive message reminders. Are you sure you want to log out?"]
		},
		notDeviceTip: 'Press " + " to add device',
		saveFail: 'The network disconnected. Please check the network.',
		nameIsRequired: 'name is required',
		homeSettingTitle: 'Home settings',
		homes: 'Homes',
		addHome: 'Add New Home',
		removeHomeTitle: 'Remove {name} Home',
		removeHomeTip: 'By removing this Home selection, you will also remove all of the data associated with it. Are you sure want to remove it?',
		setting: 'Settings',
		homeName: 'Home Name',
		gateway: 'hub',
		homeWallpaper: 'Home Wallpaper',
		takePhoto: 'Take photo...',
		removeHome: 'Remove Home',
		chooseAlbum: 'Choose from local album',
		chooseWallpaper: 'Choose wallpaper',
		photos: 'Photos',
		editFamily: {
			editFailed: 'Failed',
			editSuccessed: 'Successed'
		}
	},
	public: {
		txtMore: "More",
		txtDone: "Done",
		txtSave: "Save",
		dialog: {
			button: ["Cancel", "OK", "Reset","Remove","Update","Confirm","Yes","No"],
			title: ["Tip"],
			tip: ["Are you sure to remove？", "unknown error, please try later","Are you sure you want to delete all of the past activity?"]
		},
		delete: "Remove",
		edit: "Edit",
		connecting: 'Connecting',
		loading: '稍等',
		done: 'Done',
		tryAgain: 'Try Again',
		exit: '再按一次退出',
		buleToothCloseNotify: 'Please turn on Bluetooth first and then you can control it.',
		cannotControl:'离网状态无法编辑'
	},
	pullToRefresh: {
		searching: 'Searching',
		pullDownSearching: 'Pull down to continue searching',
	},
	user: {
		login: {
			welcome: 'Welcome!',
			buttonText: "Sign in",
			signOut: "Sign out",
			linkSwitch: "Create account",
			forgetPw: "Forget password?",
			dialog: {
				fail: {
					title: "Failed to logout"
				}
			},
			placeholder: ["Email address", "Password"],
			forceToLogout: "Your device has been login on another phone, please login again.",
			sureToLogout: "Are you sure you want to logout? You will not be able to control your devices or receive any messages.",
			validator: ["User not found", "Unknow error"],
			emptyUsername:"Empty email is not allow.",
			emptyPassword:"Empty password is not allow.",
			emptyVerifyCode:"Empty verify code is not allow.",
			verifyCodeLen:"验证码需要输入8位数.",
			timeout:"Network Timeout",
			logoutFailed: '登出失败'
		},
		register: {
			PwdRequire:"Password requirements",
			error:"1. At least 6 characters<br />2. 1 uppercase letter<br />3. 1 lowercase letter<br />4. 1 number or symbol",
			title: "Create account",
			buttonText: "Sign up",
			linkSwitch: "The account has already existed",
			// buttonSendCaptcha: "Get verification code",
			buttonSendCaptcha: "Send",
			continue: 'By continuing you agree to the',
			termsOfservice: 'Terms of Service',
			termsOfService: 'Terms of service',
			privatePolicy: 'Privacy Policy',
			privatepolicy: 'Privacy policy',
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
			placeholder: ["Email address", "Password", "Confirm password", "Verification code"]
		},
		password: {
			changePassword: "Modify password",
			oldPassword: "Old password",
			newPassword: "New password",
			newPwdAgain: "Repeat Password",
			sumit: "Submit",
			errorTip: "Old password is error"
		},
		forgetPassword: {
			title: "Forgot password",
			send: "Send",
			resend: "Resend",
			Submit: "Submit",
			forgetPassword: "Forgot password.",
			emptyUsername:"Empty emial is not allow.",
			dialog: {
				desc: ["Your password has been successfully reset."],
				fail:["Wrong verification code, please enter right code."],
				exit:["This email hasn't been registered yet."]
			},
			dialogSuccess: "Change the password successfully, please log in again",
			placeholder: ["Email address", "Verification code", "New password", "Reenter password"]
		},
		modify: {
			title: "My center"
		},
		validator: [
			"Password or email address is incorrect",
			"Password requires 6 characters at least but can't excess 20 characters, 1 uppercase letter and number is a must.",
			"Two passwords do not match.",
			"Verification code must be 8 digits",
			"This email had been registered",
			"Verification code is null",
			"Verification code is wrong",
			"Either your email or Password or user name is incorrect",
			"You account already been lock since enter wrong password 3 times, please try again after 5 minutes.",
			"Verification has been expired",
			"Please enter nickname composed of 1 to 30 characters.",
			"Old password doesn't match.",
			"Password requires 6 characters at least but can't excess 20 characters, 1 uppercase letter and number is a must.",
			"Two passwords do not match.",
			"The network disconnected. Please check the network.",
			"Please enter nickname composed of 1 to 20 characters.",
		],
		sending: "sending",
		password: {
			changePassword: "Modify password",
			oldPassword: "Old password",
			newPassword: "New password",
			newPwdAgain: "Repeat Password",
			title: "Tip",
			success: "New password saved.",
			fail: "The password is fail to modify.！",
			sumit: "Submit"
		}
	},
	device: {
		title: "Device",
		subTitle: "My device",
		createGroupTip: "Create group to management",
		noDevice: "No device",
		noDeviceTip: "Please press '+' on top to add device.",
		deviceNotFound: 'Not found Device!',
		statusOpen: 'Open',
		statusClose: 'Close',
		statusTrigger: 'Active',
		statusUntrigger: 'Inactive',
		notFoundGatewayId: 'Not found hub.',
		saveChangeConfirm: "Save the change you've made?",
		remoteTitle:"Choose one or multiple devices that you want to control by remote.",
		dialog: {
			tip: [
				"Device cannot be removed when offline",
				"Remove this device will delete all of it's data.Are you sure to remove?",
				"Failed to delete",
				"Failed to update",
				"The device name has been exist."
			]
		},
		bleDevice: {
			openBlueToothTitle: "Reminder",
			openBlueToothTip: "When adding a Bluetooth device please be sure that Bluetooth is enabled on your phone or tablet.",
			tipButton: [
				"Cancel",
				"Open it now"
			]
		},
		on: "On",
		off: "Off",
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
			mode:"Use Mode",
			safeMode:"Safe mode",
			userMode:"User mode",
			deviceUpdate:"Device update",
			moreAbout:"More About",
			placeholder: ["Please enter device name"],
			validator: ["Empty name is not allowed", "Device name already exists", "Device name can't exceed 20 characters"],
			modelId:"Model ID",
			productUUID:"Product UUID",
			changePassword:"Change Password",
			resetToFactory:"Reset to factory",
			addedDevices:"Added Devices",
			alarmVolume:"Alarm Volume",
			workTime:"Work Time",
			sensitivity:"Sensitivity",
			offDelayTime:"Off delay time",
			allDay:"All day",
			high:"High",
			oneMin:"1 min",
			mac:"MAC address"
		},
		mode:{
			title:"Use Mode",
			safeDesc:"The plug always turn off when it powered on again every time.",
			userDesc:"Recovery the last status that it turned off."
		},
		countdown:{
			title:"Countdown",
			revise:"Revise"
		},
		help: {
			title: "Help",
			addDesc: "If it does flash does not flash, turn it on and off 6 times.  It should reset and flash indicating that it is ready for pairing. ",
			nextStep: "Next step",
		},
		add1: {
			title: "Adding bulb",
			desc: "Power on the light bulb.",
			addDesc: "It should flash twice to let you know it is in pairing mode and you can add it directly.",
			nextStep: "Yes, add the device now.",
			fail: "Is the bulb not pairing?",
			name:"Added Successfully",
			success:"Your device has been added successfully",
			doneBtn:"Done",
			continue:"Continue adding devices",
			help:"The bulb does not flash ?",
			dialog: {
				title: "Tip",
				tips: "Please connect to WiFi first."
			}
		},
		doorAdd1: {
			title: "Adding door/window sensor",
			desc: "Step 1",
			addDesc: "Confirm that your device is powered on.",
			nextStep: "Next step",
		},
		/*doorAdd2: {
			title: "Add Door/Window sensor",
			desc: "Step 2",
			addDesc: "Make sure your phone or tablet is connected to the same WIFI network as your gateway.",
			nextStep: "Next step",
		},*/
		doorAdd2: {
			title: "Adding door/window sensor",
			desc: "Step 2",
			addDesc: "The LED will begin to flash once per second letting you know the device is in pairing mode.",
			nextStep: "Next step",
			help:"LED does't flash in right status",
		},
		doorAdd3: {
			title: "Adding door/window sensor",
			desc: "Step 3",
			addDesc: "The LED will stop flashing once the device has paired sucessfully with the hub.",
			nextStep: "Next step",
		},
		doorAddhelp: {
			title: "Help",
			addDesc: "Insert a pin into the reset hole and hold it for 3 seconds,and the LED indicaton will start to flashing in red once per second.",
			nextStep: "Next step",
		},
		sirenAdd1: {
			title: "Adding siren",
			desc: "Step 1",
			addDesc: "Confirm that your device is powered on.",
			nextStep: "Next step",
		},
		/*sirenAdd2: {
			title: "Add Siren",
			desc: "Step 2",
			addDesc: "Make sure your phone or tablet is connected to the same WIFI network as your gateway.",
			nextStep: "Next step",
		},*/
		sirenAdd2: {
			title: "Adding siren",
			desc: "Step 2",
			addDesc: "Press SET button twice quickly to finish enroll.Red LED lights flashes quickly.",
			nextStep: "Next step",
		},
		sirenAdd3: {
			title: "Adding siren",
			desc: "Step 3",
			addDesc: "The LED will stop flashing once the device has paired sucessfully with the hub.",
			nextStep: "Next step",
		},
		sirenhubAdd1: {
			title: "Adding siren hub",
			addDesc: "Confirm that your siren hub is powered on.",
			nextStep: "Next step",
		},
		sirenhubAdd2: {
			title: "Adding siren hub",
			addDesc: "Press the button three times with in 3 seconds to let the device enter Ap mode.",
			nextStep: "Next step",
		},
		sirenhubAdd3: {
			title: "Adding siren hub",
			addDesc: "The led indicator will flash slowly once per second in green. Also you can hear one sound “ DI ”.",
			nextStep: "Next step",
		},
		sirenhubAddFail: {
			tips: 'Fail to add'
		},
		record: {
				title: "设备记录",
				empty:"无记录",
			    noData:"所有记录为空"
			},
		addFlow: {
			title: "Device list",
			gateway: 'Hub',
			lightBulb: 'Light bulb',
			zigbeeBulb: 'Bulb',
			remote: 'Remote',
			securityKit: 'Security kit',
			BLEBulb: 'BLE bulb',
			motionSensor: 'Motion sensor',
			doorSensor: 'Door / Window sensor',
			siren: 'Siren',
			plug:'Plug',
			camera:'Camera',
			remote:"Remote",
			typeGateway: 'Gateway',
			typeLighting: 'Lighting',
			typeSensorsSecurity: 'Sensors & Security',
			typeControl: 'Control',
			typeCamera:'Camera',
			typeBLELighting:'BLE Lighting',
			BLElightBulb: 'BLE Light bulb',
			typeWifiControl:'WiFi Control',
			wifiPlug:'WiFi Plug',
			blePlug: 'BLE plug',
			keyfob:'Keyfob',
			keypad: 'Keypad',
			sirenHub: 'Siren hub',
			BLEPlug: 'BLE plug',
			moreGatewayTips: 'One home can only support one hub, you can add new hub after creating a new home.',
			moreGatewayButton: 'OK, got it!',
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
			addDesc: "TThe light will flash 5 times, and restart automatically, which means that the bulb is restored to the factory settings.",
			nextStep: "Next",
			attentions: ["Attentions", "1.Ensure that the device,the phone and the router are close together", "2.Ensure that the password is correct", "3.Ensure that the network is available"],
		},
		connectWifi: {
			title: "Connect to Wi-Fi",
			pwds: "Password",
			nextStep: "Next",
			connecting: "Please wait,Connecting...",
			validate: {
				empty: "Please enter password",
				error: "Please enter correct password",
				less: "The password's length can't be less than 8 characters"
			},
			toWifi: {
				title: "Tips",
				tips: "Please connect to the WiFi",
			},
			setError: {
				title: "Tips",
				tips: "Please connect to the WiFi",
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
				button: ["Cancel", "Remove", "Reset"],
				tip: [
					"Device cannot be removed when offline",
					"Removing this device will delete all of it's data. Are you sure you want to remove?",
					"Failed to delete",
					"Failed to update",
					"The device name already exists"
				]
			},
		},
		selectroom:{
			title:"归属房间",
			promat:"请选择归属房间",
		},
		sirenVolume:{
			title:"Siren volume",
			showSettingInfo:["High","Medium","Low","Mute"],
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
				button: ["Cancel", "Remove", "Reset"],
				tip: [
					"Device cannot be removed when offline",
					"Removing this device will delete all of it's data. Are you sure you want to remove?",
					"Failed to delete",
					"Failed to update",
					"The device name already exists."
				]
			},
			
		},
		motionAdd1: {
			title: "Add Motion sensor",
			desc: "Step 1",
			addDesc: "Confirm that your device is powered on",
			nextStep: "Next step",
		},
		/*motionAdd2: {
			title: "Add Motion sensor",
			desc: "Step 2",
			addDesc: "Make sure your phone or tablet is connected to the same WIFI network as your gateway.",
			nextStep: "Next step",
		},*/
		motionAdd2: {
			title: "Adding Motion sensor",
			desc: "Step 2",
			addDesc: "The LED will begin to flash once per second letting you know the device is in pairing mode. ",
			nextStep: "Next step",
			help:"LED does't flash in right status",
		},
		motionAdd3: {
			title: "Adding Motion sensor",
			desc: "Step 3",
			addDesc: "The LED will stop flashing once the device has paired sucessfully with the hub.",
			nextStep: "Next step",
		},
		motionAddHelp: {
			title: "Help",
			addDesc: "Press the reset button and hold it for 3 seconds, and the LED indicaton will flash in red once by per second.",
			nextStep: "Next step",
		},
		plugAdd1: {
			title: "Adding Plug",
			desc: "Step 1",
			addDesc: "Confirm that your device is powered on and the LED indicator is blue.",
			nextStep: "Next step",
		},
		plugAdd2: {
			title: "Adding Plug",
			desc: "Step 2",
			addDesc: "The LED indicator light will flash once per second to let you know is in pairing mode. And you can add directly.",
			nextStep: "Next step",
			help:"LED does't flash in right status",
		},
		plugAdd3: {
			title: "Adding Plug",
			desc: "Step 3",
			addDesc: "The LED will stop flashing and turn red once the device has paired sucessfully with the hub.",
			nextStep: "Next step",
		},
		plugAddHelp: {
			title: "Help",
			desc: "Reset your plug",
			addDesc: "Hold press the rest button for 5 seconds and the LED indicator will flash slowly once two seconds to let you konw is been reset success.",
			nextStep: "Next step",
		},
		remoteAdd1: {
			title: "Adding remote",
			desc: "Step 1",
			addDesc: "Confirm that your device is powered on.",
			nextStep: "Next step",
		},
		remoteAdd2: {
			title: "Adding remote",
			desc: "Step 2",
			addDesc: "Open the cover of the remote first,then press the rest button for 1 second.The LED indicator will start to flash.",
			nextStep: "Next step",
			help:"LED does't flash in right status",
		},
		remoteAddHelp: {
			title: "Help",
			desc: "Reset your remote",
			addDesc: "Hold press the rest button for 3 seconds and the LED indicator will flash twice to let you konw is been reset success.",
			nextStep: "Next step",
		},
		gatewayDetail:{
			title:"Added devices ",
			gatewayName:"Hub",
			buttonName:"Add product",
			settingTitle:"Hub",
			resetTxt:"Reset to factory settings",
			tip:["Resetting to factory settings will clear all devices data, are you sure to reset?"]
		},
		sirenhubDetail:{
			title:"Added devices ",
			sirenhubName:"Siren Hub",
			buttonName:"Add product",
			settingTitle:"Hub",
			resetTxt:"Reset to factory settings",
			tip:["Resetting to factory settings will clear all devices data, are you sure to reset?"]
		},
		searchDevices: {
			needSelect: 'Please choose a device first.',
		},
		smartPlug: {
			parameter :["Power", "Electric", "Voltage"]
		},
		smartLinkPlug:{
			barTitle: "Adding Plug",
			desc:"Confirm that your device is powered on and the indicator is flashing slowly in green .",
			helpBarTitle:"Help",
			helpDesc:"Press the reset button and hold it for 10s and the LED indicator will start to flash in green once per second.",
			nextStep:"Next step"
		},
		apModePlug:{
			barTitle: "Adding Plug",
			desc:"Confirm that your device is powered on.Press the reset button and hold it for 5s to let the device enter AP mode.",
			desc2:"The LED indicator will flash slowly once per three seconds in green from bright to dim and then go out.",
			nextStep:"Next step"
		},
		sirenHub:{
			title:"Adding siren hub",
			desc:"Confirm that your device is powered on.",
			desc2:"Press the button three tiomes within 3 seconds to let the device enter Ap mode.",
			desc3:"The led indicator will flash slowly once per second in green. Also you can hear one sound 'DI'.",
			nextStep:"Next step"
		},
		keyfob:{
			title:"Adding keyfob",
			desc:"Confirm that your device is powered on and the indicator is flashing in red for 3 seconds.",
			desc2:"The network indicatior will begin to flash once per second in green letting you know the device is in pairing mode.",
			desc3:"Press the number “",
			desc4:"The LED will stop flashing once the device has paired sucessfully with the hub.",
			desc5:"” and “",
			desc6:"” in keypad and",
			desc7:"hold it for 3 seconds, the LED indicaton will start to flashing in green once per second.",
			help:"LED does't flash in right status",
			nextStep:"Next step"
		},
		keypad:{
			title:"Adding keypad",
			desc:"Confirm that your device is powered on",
			desc2:"The network indicaton will begin to flash once per second in green letting you know the device is in pairing mode.",
			desc3:"LED does't flash in right status",
			desc3:"Press the number “ 3 ” in keypad and hold it for 3 seconds, and the LED indicaton will start to flashing in green once per second.",
			desc4:"The LED will stop flashing once the device has paired sucessfully with the hub.",
			nextStep:"Next step"
		},
		setWifi:{
			placeholder: "Wi-Fi password",
		},
		selectWifi:{
			title:"Select Wi-Fi network"
		},
		plugAddFail:{
			title:"Adding plug",
			fail:"Fail to add",
			desc:"IF you fail to add, we will suggest you try ",
			linkTxt:" AP mode",
			smartLinkMode:" SmartLink Mode",
			tryAgain:"Try again"
		}
	},
	space: {
		title: "Group",
		noSpace: "No group",
		noSpaceTip: "Please press '+' to add group.",
		noDevice: "No device",
		failedToDel: "",
		validator: ["Please choose an icon", "Please input group name", "Please select device to add", "No device is selected"],
		dialog: {
			tip: ["Failed to create", "Failed to remove", "Failed to update", "The group name already exists"]
		},
		name: "Name",
		delete: "Remove group",
		edit: "Edit Group",
		add: "Add Group",
		updateIcon: "Room Icon"
	},
    room: {
        title: [
            "My Rooms",
            "Room icon"
		],
		NotDevice: 'No devices found in this room',
    },
    scene: {
		title: "Scene",
		sceneIcon:"Scene icon",
		sceneEmpty:"You haven't create any scenes yet.",
		sceneEmptySub:"You can set up a scene to enable a device to perform certain actions. Press \"+\" to create.",
		create: {
			title:"Create scene",
			listTitle:"Select devices to include in this scene"
		},
		delete:{
			sureDelete:"Are you sure you want to delete the scene？"
		},
		make:{
			title:"Make this happen",
		},
		createScene:{
			title:"Add scene",
			offlineTips:"Your device is offline.",
			sceneNameNull:"Empty name is not allowed",
			sceneNameToLong:"Scene name can't exceed 30 characters",
			iconNull:"Please choose an icon.",
			sceneUpper:"The scene you add can't excess 25.",
			sceneException:"Failed to set.",
			createSuccess:"Create success",
			editSuccess:"Edit success",
			sceneNameNonstandard:"Special characters and emojis are not allowed for scene names.",
			noneDeviceTips:"You don't have any devices yet!",
			noneDeviceTips2:"Please add first.",
			subTitle:"Select devices to include in this scene",
			allBulb:"All bulbs",
			saveChangeDialog:"Save the changes you made?",
			checkNetwork:"Please check the network."
		},
		editScene:{
			title:"Edit scene"
		},
		deleteScene:{
			deleteTimeOut:"Remonal has timed out.  Please try again.",
			success:"Aleady removed.",
			deleteFail:"Failed to remove."
		}
	},
	setting: {
		title: "Settings",
		version:"App Version：V",
		update: {
			title: "Firmware upgrade",
			ask: "Upgrade now？",
			desc: "The bulb will automatically turn off and will not be able to be controlled during upgrading.",
			buttonText: "Now",
			dialog: {
				success: {
					title: "Upgraded sucessfully",
					desc: "There is no device to upgrade"
				},
				fail: {
					title: "Upgrad failed",
					desc: "Connection "
				}
			}
		},
		about: {
			title: "About",
			appName: "WIFI bulb",
			appUpdate: "Version upgrade",
			appState: ["Lastest version", "Discover new version"],
			dialog: {
				success: {
					title: "Upgrade sucessful",
					desc: "Fixing some bugs"
				},
				fail: {
					title: "Upgrade failed",
					desc: "Current version is the most recent"
				}
			}
		},
		help:{
			title:"FAQ"
		},
		activity:{
			title:"活动记录",
			empty:"无记录",
			noData:"所有记录为空"
		},
		agreement: {
			title: "User agreement",
			content: ""
		}
	},
	refresh: {
		pull: "Pull down the page to load a new device",
		release: "Release to update",
		finish: "Finish",
		activate: "PullToRefresh"
	},

	
	automation: {
		title: "Automation",
		delect: "Delete",
		cancel: "Cancel",
		success:"Remove success.",		
		noAutomation: {
			title: "You haven't created any automation yet.",
			hint: 'You can set your devices to turn on or off, based on a specific time or event; such as the motion sensor being triggered... Press "+" to add automation.'
		},
		add: {
			title: "Add Automation",
			hint: "Set up automatic events based on time or slelect a new device",
			selectTimeItem: {
				title: "Time of day",
				hint: "Turn on my lights at 7 am on weekdays"
			},
			selectSensorItem: {
				title: "Product or sensor",
				hint: "Turn on my lights when my motion sensor detects motion"
			}
		},
		create: {
			title: "Create Automation",
			subTitle:["Auto Name","active","Effects"],
			labelText:["Choose the active device","choose the time","Make this happen"],
			backTip:"Are you sure you want to give up the changes you have just made?",
			tip:["Please enter a scenario name！",
			"Scene names should not contain special symbols and expressions!",
			"Do not name more than 10 Chinese characters or 20 English characters!",
			"Please select active！","Please set the cycle!","Please set Effects！",
			"Save the scene...","The scene name already exists!"],
		},
		during: {
			title: "During this time",
			name: ["Anytime", "Start","End", "Repeat"],
			picker:["Cancel", "Done","Time"],
			backTip:"Would you like to save the change you made?",
			saveTip:"You haven't choose a time.",

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
			selectDevices:"Make this happen",
			tip:["Please enter the scene name.","Special characters and emojis are not allowed for scene name.",
			"The name cannot exceed 20 characters.",
			"Please set up the time.","Please set up the period.","Please select the edvices.",
			"Saving....","This scene name already exists."]
		},repeat:
		{
			title:"Repeat",
			workday:"Working days",
			workdayAry:["Monday","Tuesday","Wednesday","Thursday","Friday"],
			weekday:"Weekend",
			weekdayAry:["Saturday","Sunday"],
			repeatTip:"You have't choose a repeat time.",
		},timeset:
		{
			title:"Time",
			sunrise:"Sunrise",
			sunset:"Sunset",
			locatioTitle:"Base on this location",
			before:"Before",
			after:"After",
			beforeOrAfter:"Before/After(optional)",
			picker:{
				am:'Before',
				pm:'After',
			},
			noWifiPlugTips:"The astronomy timer only work for plug.",
			locationTitle:"Change Location"
		},repeatSelectDevices:
		{
			title:"Make this happen",
			all:"All bulbs",
			tip:"添加设备不能超过25个"
			
		},
		triggerdevice:{
			title:"IF this device detects",
			tip:["You do not have any device yet!","Please add a device first."],
		},
		triggermotiondetail:{
			title:"Motion Sensor",
			motiontriggered:"Active",
			motionuninterrupted:"Inactive"
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
		apGateway: {
			title: 'Adding hub',
			tips: ['Confirm that your device is powered on.','Press the button three times within 3 seconds to let the device enter Ap mode.'],
		},
		title:'Adding',
		littleTitle:['Step 1','Power on your hub','Room name','Choose the icon'],
		nextstep:"Next step",
		dialog: {
			tip: ["Exit the application？"]
		},
		start:{
			tips:["Adding hub","wifi"]
		},
		settings:{
			title:"WLAN",
			step:['settings','Step 2','Connect your phone to"Leedarson-004"and return to the app','Settings']
		},
		foudWifi:{
			title:"Connect Wi-Fi",
			step:"Step 3",
			wait: "Waiting for connect...",
			tips: "Waiting for the siren hub to connect to wifi",
			plugTips: "Waiting for the wifi plug to connect to wifi"
		},
		connect:{
			tips:["WI-FI Password",'Enter WIFI Password','Please enter password']
		},
		adding:{
			load:["Adding...",'Place the hub, phone, and the device close to each other during pairing.']
		},
		fail:{
			tips:["Failed to Add",'Try again']
		},
		addsuccess:{
			tips:['Your device has been added successfully',
			'You can rename  your device',
			'Assign your product to a Room for easier control later',
			"Device name can't exceed 20 characters",
			"Server error",
			'Empty name is not allowed','Custom'],
			name:"Gateway",
			done:["Done",'Continue adding devices'],
			typename:['Default','Bedroom','Living room','Study','Bathroom','Dinning room','Outside','Basement','Custom'],
			error:"Please enter a custom name",
			success: 'Successfully saved',
			fail: 'Failed to save',
		},
		noGateway:{
			tips:['Devices cannot function without adding a hub first.','Adding hub'],
			title:"NO hub"
		},
		searchGateway:{
			tips:['Searching','Pull down to continue searching','No gateways found!','Please choose the hub you need first.'],
			button:["Try again","Done"]
		},
		failAdd:{
			tips:["Server exception",""]
		},
		customRoom:{
			title:"自定义房间"
		},
		gatewayReset:{
			text:"The hub already been add, please reset first and then add again.",
			buttonText:"Already reset"
		}
	},

	security: {
		stay: 'Stay',
		away: 'Away',
		sos: 'SOS',
		off: 'OFF',
		disarm: 'Disarm',
		stayModeEnable: 'Stay mode enable',
		awayModeEnable: 'Away mode enable',
		tip: {
			someSensorsActive: 'Some of your devices are not ready, are you sure to enter "{mode}" mode in this situation?',
			singleSensorActive: 'Your {device} still {status}, are you sure to enter "{mode}" mode in this situation?',
			loadSetting: 'Loading',
			noDevice: 'You don\'t have any device yet! Please add first',
			noSiren: 'You haven\'t added any siren.',
			deviceOffline: 'Your device already offline, please check.',
			disarmFailed: 'Disarm failed!',
			enableFailed: 'Enable {mode} mode failed',
			noModeEnable: 'Haven\'t enabled any mode yet',
			notSelectedDevice: 'Haven\'t selected any device yet',
			setModesFirst: 'Haven\'t set up any mode',
			pwdNotMatch: 'The new password do not match',
			reenterPwd: 'Reenter new password',
			enterPwd: 'Enter new password',
			curPwd: 'Please enter right current password',
			setSecurityPwd: 'For your home security,please enter 6-digital pin code.',
			setSecurityPwd2: 'Reenter 6 digital pin code again.',
			setSucess: 'success！',
			setFail: 'failed！',
			modifySucess: 'success！',
			modifyFail: 'failed！',
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
			sosMode: 'SOS Mode',
			effectiveTime: 'Alarm duration',
			record: 'Security record',
			setting: 'Setting',
			ledMode: 'LED mode',
			delayTime: 'Delay time',
			alarmVolume: 'Alarm volume',
		},
		selectTimeTip: 'Select the amount of time before the system alarms',
		activeStatus: 'actived',
		openStatus: 'opened',
		pm: 'PM',
		am: 'AM',
		back: 'Back',
		cancel: 'Cancel',
		offlineTips: 'Your device already offline, please check.',
		noDevice: 'NO DEVICE',
		currentPassword: 'Current password',
		countDownDesc: 'Enter {mode} mode after {duration} seconds.'
	},
	ipc:{
		timeZone:{
      title:"选择城市",
      bestMatch:'Best match',
			cityName:{
				A:{
					key:['安克雷奇 GMT-09:00','阿姆斯特丹 GMT+01:00','安曼 GMT+02:00','埃里温 GMT+04:00','阿拉木图 GMT+06:00','阿德莱德 GMT+10:30','奥克兰 GMT+13:00'],
					val:['Anchorage GMT-09:00','Amsterdam GMT+01:00','Amman GMT+02:00','Yerevan GMT+04:00','Almaty GMT+06:00','Adelaide GMT+10:30','Auckland GMT+13:00']
				},
				B:{
					key:['巴巴多斯 GMT-04:00','北京 GMT+08:00','波哥大 GMT-05:00','布宜诺斯艾利斯 GMT-03:00','贝尔格莱德 GMT+01:00','布鲁塞尔 GMT+01:00',
						'布拉扎维 GMT+01:00','贝鲁特 GMT+02:00','布里斯班 GMT+10:00','巴格达 GMT+03:00','巴库 GMT+04:00'],
					val:['Barbados GMT-04:00','Beijing GMT+08:00','Bogota GMT-05:00','Buenos Aires GMT-03:00','Belgrade GMT+01:00','Brussels GMT+01:00',
						'Brazawi GMT+01:00','Beirut GMT+02:00','Brisbane GMT+10:00','Baghdad GMT+03:00','Baku GMT+04:00']
				},
				D:{
					key:['丹佛 GMT-07:00','德黑兰 GMT+03:30','第比利斯 GMT+04:00','迪拜 GMT+04:00','东京 GMT+09:00','达尔文 GMT+09:30','东加塔布 GMT+14:00'],
					val:['Denver GMT-07:00','Tehran GMT+03:30','Tbilisi GMT+04:00','Dubai GMT+04:00','Tokyo GMT+09:00','Darwin GMT+09:30','East Ghatb GMT+14:00']
				},
				F:{
					key:['佛得角 GMT-01:00','符拉迪沃斯托克 GMT+11:00','斐济 GMT+12:00'],
					val:['Cape Verde GMT-01:00','Vladivostok GMT+11:00','Fiji GMT+12:00']
				},
				G:{
					key:['关岛 GMT+10:00','戈特霍布 GMT-03:00','哥斯达黎加 GMT-06:00'],
					val:['Guam GMT+10:00','Gotthorb GMT-03:00','Costa Rica GMT-06:00']
				},
				H:{
					key:['霍巴特 GMT+11:00','哈拉雷 GMT+02:00','赫尔辛基 GMT+02:00','哈利法克斯 GMT-04:00'],
					val:['Hobart GMT+11:00','Harare GMT+02:00','Helsinki GMT+02:00','Halifax GMT-04:00']
				},
				J:{
					key:['吉隆坡 GMT+08:00','加德满都 GMT+05:45','加尔各答 GMT+05:30','加拉加斯 GMT-04:00','基辅 GMT+02:00'],
					val:['Kuala Lumpur GMT+08:00','Kathmandu GMT+05:45','Calcutta GMT+05:30','Caracas GMT-04:00','Kiev GMT+02:00']
				},
				K:{
					key:['克拉斯诺亚尔斯克 GMT+07:00','科伦坡 GMT+05:30','卡拉奇 GMT+05:00','喀布尔 GMT+04:30','科威特 GMT+03:00','开罗 GMT+02:00','卡萨布兰卡 GMT+00:00'],
					val:['Krasnoyarsk GMT+07:00','Colombo GMT+05:30','Karachi GMT+05:00','Kabul GMT+04:30','Kuwait GMT+03:00','Cairo GMT+02:00','Casablanca GMT+00:00']
				},
				L:{
					key:['洛杉矶 GMT-08:00','里贾纳 GMT-06:00','伦敦 GMT+00:00'],
					val:['Los Angeles GMT-08:00','Regina GMT-06:00','London GMT+00:00']
				},
				M:{
					key:['马朱罗 GMT+12:00','马瑙斯 GMT-04:00','马加丹 GMT+11:00','墨西哥城 GMT-06:00','蒙得维的亚 GMT-03:00','明斯克 GMT+03:00','莫斯科 GMT+03:00','曼谷 GMT+07:00',' 米德韦 GMT-11:00'],
					val:['Majuro GMT+12:00','Manaus GMT-04:00','Magadan GMT+11:00','Mexico City GMT-06:00','Montevideo GMT-03:00','Minsk GMT+03:00','Moscow GMT+03:00','Bangkok GMT+07:00',' Midway GMT-11:00']
				},
				N:{
					key:['纽约 GMT-05:00','南乔治亚 GMT-02:00','内罗毕 GMT+03:00'],
					val:['New York GMT-05:00','South Georgia GMT-02:00','Nairobi GMT+03:00']
				},
				P:{key:['佩思 GMT+08:00'],val:['Perth GMT+08:00']},
				Q:{key:['奇瓦瓦 GMT-07:00'],val:['Chihuahua GMT-07:00']},
				S:{
					key:['首尔 GMT+09:00','萨格勒布 GMT+01:00','萨拉热窝 GMT+01:00','圣保罗 GMT-02:00','圣约翰 GMT-04:00','圣地亚哥 GMT-03:00'],
					val:['Seoul GMT+09:00','Zagreb GMT+01:00','Sarajevo GMT+01:00','Sao Paulo GMT-02:00','Saint John GMT-04:00','San Diego GMT-03:00']
				},
				T:{
					key:['檀香山 GMT-10:00','提华纳 GMT-08:00','台北 GMT+08:00'],
					val:['Honolulu GMT-10:00','Tijuana GMT-08:00','Taipei GMT+08:00']
				},
				W:{key:['乌拉尔 GMT+05:00','温得和克 GMT+02:00'],val:['Ural GMT+05:00','Windhoek GMT+02:00']},
				X:{key:['香港 GMT+08:00','悉尼 GMT+11:00'],val:['Hong Kong GMT+08:00','Sydney GMT+11:00']},
				Y:{
					key:['仰光 GMT+06:30','叶卡捷林堡 GMT+05:00','耶路撒冷 GMT+02:00','雅典 GMT+02:00','雅库茨克 GMT+09:00','亚述尔群岛 GMT-01:00','伊尔库茨克 GMT+08:00'],
					val:['Yangon GMT+06:30','Yekaterinburg GMT+05:00','Jerusalem GMT+02:00','Athens GMT+02:00','Yakutsk GMT+09:00','Azores GMT-01:00','Irkutsk GMT+08:00']
				},
        Z:{key:['芝加哥 GMT-06:00'],val:['Chicago GMT-06:00']}
			}
    },
    setName:{
      title: '修改名称',
      text:['名称'],
      tips:['名称不能空','最大长度为20个字符','数字,字母或下划线,不包含特殊字符或中文','设备名称已存在','最大长度为30个字符'],
      change:["提 示","是否保存修改 ?"]
    },
		deviceLanguage:{
			title:"设备语言",
			language:['英文',"中文"]
		},
		calendar:{
			tips:["取消","确定"]
		},
		pictureRotation:{
			title:"画面旋转",
			rotation:["不旋转","90°","180°","270°"]
		},
		deviceVolume:{
			title:"设备音量",
      text:'提示音音量',
      type:['静音','低','中','高','最大']
    },
    changePicture:{
      title:'选择设备'
    },
		detectionSensitivity:{
			title:"移动侦测",
			value:['高','中','低']
		},
		connectAPWiFi:{
			title:"连接设备Wi-Fi",
			tips:"将你的手机Wi-Fi连接到\"LDS-XXXXX\"后，返回APP",
			plugTitle:"Select Wi-Fi",
			plugTips:"Connect your phone to \“Leedarson_xxx\” and return to app.",
			currentwifi:"当前Wi-Fi:",
			nowifi:"Wi-Fi that is not set",
			towifisetting:"设置我的Wi-Fi",
			nextstep:"下一步"
		},
		wifiList:{
			title:"WLAN",
			tipTitle:"选择你的Wi-Fi",
			tips:"你现在连接到相机,请继续选择你想要的无线摄像头连接,并输入正确的密码",
			nowifi:"没有可用的网络",
			other:"其他…"
		},
		setWiFi:{
			title:"连接Wi-Fi",
			tips:"你现在连接到相机,请继续选择你想要的无线摄像头连接,并输入正确的密码",
			next:"下一步",
			placeholder:["WiFi SSID", "密码"],
			emptySSID:"Empty WiFi SSID is not allow.",
			emptyPassword:"Empty password is not allow."
		},
		bottomButtom:{
			name:["快照", "对讲", "录影", "返回直播", "重新连接"]
		},
		resolution:{
			menuName:["高清","标清"]
		},
		eventPlay:{
			tips:["开始时间必须小于结束时间","结束时间必须大于开始时间","没有事件文件列表","已经是最后一页"]
		},
		mainTxt:{
			txt:["想看更多吗 ?","订阅LDS了解最多一个月的活动。"]
		},
		nonCard:{
			txt:["摄像机还未插入存储卡","插入存储卡后未识别，请重新插拔存储卡"],
			btnName:"知道了"
		},
		setting:{
			title:"设备名称",
			camerName:"摄像机名称",
			camerNameExtra:"摄像机",
			locationName:"归属房间",
			locationExtra:"office",
			deviceInformation:"关于更多",
			firmwareUpdate:"固件更新",
			videoManagement:"录影管理",
			volume:"音量",
			language:"语言",
			timeZone:"时区",
			screenRotation:"画面旋转",
			screenRotationExtra:"不旋转",
			detection:"智能侦测报警",
			detectionExtra:"中",
			alarmNotice:"报警推送通知",
			stateLamp:"状态灯",
			activityRecord:"日志",
			memoryCard:"存储卡",
			memoryCardExtra:"存储卡正常",
			noMemoryCard:"未检测到SD卡",
			restoreFactory:"恢复出厂设置",
			rebootDevice:"重启设备",
			removeDevice:"移除设备",
			dialogrestoreHint:"确认恢复出厂设置，之前的数据不能保留",
			dialogrebootHint:"设备重启的过程需要一些时间，是否确认重启设备？",
			dialogremoveHint:"删除设备后，设备将从列表中删除。",
			dialogremovePlanHint:"删除设备后，设备将从列表中删除,并清空计划。",
      tips:["获取时区失败!","指示灯","关闭","开启","报警推送通知"],
      reboot:["设备重启中..."],
      reset:["恢复出厂设置中..."]
		},
		deviceInfo:{
			title:"设备信息",
			deviceid:"设备ID",
			devicemodel:"设备型号",
			softwarev:"设备软件版本",
			hardwarev:"设备硬件版本",
			mac:"MAC地址",
			supplier:"厂商信息",
		},
		videomanagement:{
			title:"云端录影管理",
			videoName:"录影计划名称",
			plannedCapacity:"计划容量",
			videoMode:"录影模式",
			bindingDevice:"绑定设备",
			videoSwitch:"录影开关",
			effectiveTime:"有效时间",
			videoTimer:"录影定时器",
			eventMode:"事件录影",
			fullTimeMode:"全时录影",
			renew:"即将过期，请续费",
			noRecord:"还未添加云端录影计划",
			quickChoice:'快捷选择',
			months: '个月',
			amountPayable:'应付金额',
			monthsPlaceholder:'请输入开通时长',
			pay:'支付',
			moneyFlag:'￥',
			purchase: '购买',
			addplan: '添加计划',
			monthTip:"Do not month more than 3 number!",
			tips:['7天/月','连续记录7天视频(事件触发标志)所有视频保存一个月的存储服务'],
			Monday: '一',
			Tuesday: '二',
			Wednesday: '三',
			Thursday: '四',
			Friday: '五',
			Saturday: '六',
			Sunday: '七',
			workday:'工作日',
			weekend:'周末',
			everyday: '每天',
			VideoTiming: '录影定时',
			startTime: '开始时间',
			endTime: '结束时间',
			unboundDevice:'未绑定设备',
		},
		sdmemory:{
			title:"存储记录",
			memoryCard:"存储卡",
			memory:"存储",
			memoryTotal:"总",
			formatCard:"存储卡格式化",
			dialogHint:"格式化后，存储卡内的数据会被清除，是否继续操作？",
			formatfail:"格式化失败",
			formatsuccessful:"格式化成功",
			formating:"正在格式化..",

		},
		sdstoremode:{
			title:"存储方式",
			modefulltime:"全时录影",
			modeevent:"事件录影"
		},
		addCamera:{
			title:"添加摄像机",
			step1:"摄像机接通电源，直到听到摄像机提示\"等待连接\"2s内使用插针短按摄像机Reset按键3下",
			step2:"按图示操作后，听到‘等待连接’提示音",
			cameraOver:'添加的摄像头不能超过16个!',
			next:"下一步"
		},
		addCamera1:{
			title:"添加摄像机",
			step1:"摄像机接通电源，直到听到摄像机提示'等待连接'",
			step2:"按图示操作后，听到‘等待连接’提示音",
			next:"下一步",
			tip:"什么也没听见"
		},
		addCamera2:{
			title:"添加摄像机",
			step1:"使用插针短按摄像机Reset按键，即重置成功",
			next:"下一步",
		},
		wifiFail:{
			title:"连接Wi-Fi",
			tips:[
				"添加失败",
				"设备已经被XX账号绑定，需要绑定的账号解绑设备，才能添加",
			],
			next:"返回主页",
		},
		addFail:{
			title:"连接Wi-Fi",
			tips:[
				"添加失败",
				"如果添加失败，我们建议您试试",
				"服务器错误",
				"AP 模式",
			],
			tryAgain:"再试一次",
		},
		ipcAddFail:{
			title:"连接Wi-Fi",
			tips:[
				"添加失败",
				"服务器错误",
			],
			tryAgain:"再试一次",
			quiteAdd:"退出添加设备",
		},
		ipcupdate:{
			title:"固件更新",
			versionTitle:"当前版本号:",
			versionTip:"当前已是最新版本",
			version:[
				"最新版本",
				"当前版本号"
			],
			tips:[
				"1.修复的问题",
				"2.修复了什么bug",
			],
			upgrade:"升级"
		},
		updateFail:{
			title:"固件更新",
			tips:[
				"升级失败",
				"升级失败，请重新尝试",
				"服务器错误"
			],
			tryAgain:"再试一次",
		},
		updateSuccess:{
			title:"固件更新",
			tips:[
				"更新成功",
				"当前版本：",
				"服务器错误"
			],
			tryAgain:"再试一次",
		},
		ipcCountDown:{
			title:"固件更新",
			tips:[
				"下载更新中…",
				"升级中，下载过程需要一些时间，请耐心等待",
				"正在升级中…",
				"在升级过程中，不要关闭电源，等待升级完成。"
			]
		},
		ipcSDCard:{
			title:['SD卡视频'],
			btnName:["选择","取消","全选"],
			confirm:"确定",
			infoMessage:["SD卡没有视频","这些视频将从存储列表中删除",'正在检测SD卡...','没有数据','今日无数据',"获取数据失败！"],
			deleteInfo:['删除成功!','删除失败！'],
			waitInfo:['加载中...','上拉可以刷新','删除中...']
		},
		selectWifi:{
			title:"连接Wi-Fi",
			tips:[
				"你现在连接到相机,请继续选择你想要的无线摄像头连接,并输入正确的密码",
				"目前没有设置的Wi-Fi，请先把手机连上Wi-Fi",
				"不支持5G网络"
			],
			wifiName:"目前没有设置Wi-Fi",
			placeholder:"Wi-Fi密码",
			next:"下一步",
		},
	
		ipcConnectWifi:{
			title:"连接Wi-Fi",
			tips:[
				"连接…",
				"等待摄像机连接Wi-Fi并上线"
			],
			},
			ipcWifiSuccess:{
				title:"连接Wi-Fi",
				tips:[
					"连接成功",
					"相机在线"
				],
			},eventList:{
				delete:"删除",
				event:"事件",
				tips:[
					"没有事件文件列表",
					
				]
			},
		videoPlayer:{
			tips:["没有视频文件","请求异常","tutk 不在线"]
		}
	},
	ota: {
		title: "Device update",
		latestTip: ["Current version", "is the latest."],
		newestTip: ["Discover the latest Firmware", "version", "1.Make sure you device is active before you update.","2.Device cannot update when the battery is low.","3.The device cannot work during updating."],
		updateNow: "Update now",
		updating: "Updating...",
		updateFail: "The device is fail to update.",
		updateSuccess: "Update completed.",
		tryAgain: "Try again",
		toast: "This device is offline, it must be online before updating.",
		newVersionTip: ['Firmware V',' is available, update now?']
	},
	kit: {
		title: "There are your devices for home security.",
		tips: "You can use them directly after powered on.",
		done: "Done",
	},
	system:{
		noNetwork:"You can't make use of this feature since the network is lost",
		noNetworkBtn:"Ok,got it"
	}
}