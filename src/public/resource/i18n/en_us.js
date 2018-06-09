
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
		loading: 'Loading',
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
			forceToLogout: "Your account has been login on another phone, please login again.",
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
			title: "Adding Door/Window sensor",
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
			title: "Adding Door/Window sensor",
			desc: "Step 2",
			addDesc: "The LED will begin to flash once per second letting you know the device is in pairing mode.",
			nextStep: "Next step",
			help:"LED does't flash in right status",
		},
		doorAdd3: {
			title: "Adding Door/Window sensor",
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
			addDesc: "The led indicator will flash slowly once per second in green. Also you can hear one sound “ DI ”.",
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
				title: "Activity Record",
				empty:"No Record",
			    noData:"Event records are empty"
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
		selectWifi:{
			title:"Select Wi-Fi network"
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
			title:"Select Room",
			promat:"Please choose the installation location",
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
			nextStep:"Next"
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
			title:"Activity",
			empty:"No Record",
			noData:"Event records are empty"
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
				pm:'After'
			},
			noWifiPlugTips:"The astronomy timer only work for plug.",
			locationTitle:"Change Location"
		},repeatSelectDevices:
		{
			title:"Make this happen",
			all:"All bulbs",
		    tip:"No more than 25 devices can not be added"
			
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
			noSiren: 'Security system could\'t work without siren',
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
      title:"Select the city",
      bestMatch:'Best match',
			cityName:{
        A:{
          key:['Anchorage GMT-09:00','Azores GMT-01:00','Amsterdam GMT+01:00','Amman GMT+02:00','Athens GMT+02:00','Almaty GMT+06:00','Adelaide GMT+10:30','Auckland GMT+13:00'],
          val:['Anchorage GMT-09:00','Azores GMT-01:00','Amsterdam GMT+01:00','Amman GMT+02:00','Athens GMT+02:00','Almaty GMT+06:00','Adelaide GMT+10:30','Auckland GMT+13:00']
        },
				B:{
          key:['Bangkok GMT+07:00','Baku GMT+04:00','Baghdad GMT+03:00','Barbados GMT-04:00','Belgrade GMT+01:00','Beirut GMT+02:00','Beijing GMT+08:00','Brisbane GMT+10:00',
              'Brazzaville GMT+01:00','Brussels GMT+01:00','Belgrade GMT+01:00','Buenos Aires GMT-03:00','Bogota GMT-05:00'],
          val:['Bangkok GMT+07:00','Baku GMT+04:00','Baghdad GMT+03:00','Barbados GMT-04:00','Belgrade GMT+01:00','Beirut GMT+02:00','Beijing GMT+08:00','Brisbane GMT+10:00',
              'Brazzaville GMT+01:00','Brussels GMT+01:00','Belgrade GMT+01:00','Buenos Aires GMT-03:00','Bogota GMT-05:00']  
        },
				C:{
          key:['Cairo GMT+02:00','Casablanca GMT+00:00','Caracas GMT-04:00','Calcutta GMT+05:30','Cape Verde GMT-01:00','Chihuahua GMT-07:00',
              'Costa Rica GMT-06:00','Chicago GMT-06:00','Colombo GMT+05:30'],
          val:['Cairo GMT+02:00','Casablanca GMT+00:00','Caracas GMT-04:00','Calcutta GMT+05:30','Cape Verde GMT-01:00','Chihuahua GMT-07:00',
				      'Costa Rica GMT-06:00','Chicago GMT-06:00','Colombo GMT+05:30']
        },
        D:{
          key:['Darwin GMT+09:30','Dubai GMT+04:00','Denver GMT-07:00'],
          val:['Darwin GMT+09:30','Dubai GMT+04:00','Denver GMT-07:00']
        },
				F:{key:['Fiji GMT+12:00'],val:['Fiji GMT+12:00']},
				G:{key:['Godthab GMT-03:00','Guam GMT+10:00'],val:['Godthab GMT-03:00','Guam GMT+10:00']},
        H:{
          key:['Halifax GMT-04:00','Harare GMT+02:00','Helsinki GMT+02:00','Honolulu GMT-10:00','Hong Kong GMT+08:00','Hobart GMT+11:00'],
          val:['Halifax GMT-04:00','Harare GMT+02:00','Helsinki GMT+02:00','Honolulu GMT-10:00','Hong Kong GMT+08:00','Hobart GMT+11:00']
        },
				I:{key:['Irkutsk GMT+08:00'],val:['Irkutsk GMT+08:00']},
				J:{key:['Jerusalem GMT+02:00'],val:['Jerusalem GMT+02:00']},
        K:{
          key:['Katmandu GMT+05:45','Kabul GMT+04:30','Karachi GMT+05:00','Kuala Lumpur GMT+08:00','Krasnoyarsk GMT+07:00','Kuwait GMT+03:00','Kiev GMT+02:00'],
          val:['Katmandu GMT+05:45','Kabul GMT+04:30','Karachi GMT+05:00','Kuala Lumpur GMT+08:00','Krasnoyarsk GMT+07:00','Kuwait GMT+03:00','Kiev GMT+02:00']
        },
				L:{key:['London GMT+00:00','Los Angeles GMT-08:00'],val:['London GMT+00:00','Los Angeles GMT-08:00']},
        M:{
          key:['Magadan GMT+11:00','Manaus GMT-04:00','Majuro GMT+12:00','Mexico City GMT-06:00','Minsk GMT+03:00','Midway GMT-11:00','Moscow GMT+03:00','Montevideo GMT-03:00'],
          val:['Magadan GMT+11:00','Manaus GMT-04:00','Majuro GMT+12:00','Mexico City GMT-06:00','Minsk GMT+03:00','Midway GMT-11:00','Moscow GMT+03:00','Montevideo GMT-03:00']
        },
				N:{key:['Nairobi GMT+03:00','New York GMT-05:00'],val:['Nairobi GMT+03:00','New York GMT-05:00']},
				O:{key:['Oral GMT+05:00'],val:['Oral GMT+05:00']},
				P:{key:['Perth GMT+08:00','Phoenix GMT-07:00'],val:['Perth GMT+08:00','Phoenix GMT-07:00']},
				R:{key:['Rangoon GMT+06:30','Regina GMT-06:00'],val:['Rangoon GMT+06:30','Regina GMT-06:00']},
        S:{
          key:['Santiago GMT-03:00','Sao Paulo GMT-02:00','Sarajevo GMT+01:00','Seoul GMT+09:00','St John GMT-04:00','South Georgia GMT-02:00','Sydney GMT+11:00'],
          val:['Santiago GMT-03:00','Sao Paulo GMT-02:00','Sarajevo GMT+01:00','Seoul GMT+09:00','St John GMT-04:00','South Georgia GMT-02:00','Sydney GMT+11:00']
        },
        T:{
          key:['Taipei GMT+08:00','Tbilisi GMT+04:00','Tehran GMT+03:30','Tijuana GMT-08:00','Tokyo GMT+09:00','Tongatapu GMT+14:00'],
          val:['Taipei GMT+08:00','Tbilisi GMT+04:00','Tehran GMT+03:30','Tijuana GMT-08:00','Tokyo GMT+09:00','Tongatapu GMT+14:00']
        },
				V:{key:['Vladivostok GMT+11:00'],val:['Vladivostok GMT+11:00']},
				W:{key:['Windhoek GMT+02:00'],val:['Windhoek GMT+02:00']},
				Y:{key:['Yakutsk GMT+09:00','Yekaterinburg GMT+05:00'],val:['Yakutsk GMT+09:00','Yekaterinburg GMT+05:00']},
				Z:{key:['Zagreb GMT+01:00'],val:['Zagreb GMT+01:00']}
			}
    },
    setName:{
		title:'Modify name',
      text:['Name'],
      tips:['Name cannot be empty','Maximum length is 20 characters','Numbers, letters or underscores, do not contain special characters or Chinese','Device name already exists','Maximum length is 30 characters'],
      change:["Tips","Whether to save changes ?"]
    },
		deviceLanguage:{
			title:"Device Language",
			language:['English',"Chinese"]
		},
		calendar:{
			tips:["Cancel","Done"]
		},
		pictureRotation:{
			title:"Picture rotation",
			rotation:["Non rotation","90°","180°","270°"]
    },
    deviceVolume:{
			title:"Device volume",
      type:['Mute','Low','Medium','High','Maxium']
    },
    changePicture:{
      title:'Select device'
    },
		detectionSensitivity:{
			title:"Smart detection sensitivity",
			value:['High','Medium','Low']
		},
		connectAPWiFi:{
			title:"Connet Device WI-FI",
			tips:"Connect your phone to the camera \'AP\',with a name like\"LDS-XXXXX\"",
			plugTitle:"Select Wi-Fi",
			plugTips:"Connect your phone to \“Leedarson_xxx\” and return to app.",
			currentwifi:"CurrentWi-Fi：",
			nowifi:"Wi-Fi that is not set",
			towifisetting:"Take me to my WIFI settings",
			nextstep:"Next"
		},
		wifiList:{
			title:"WLAN",
			tipTitle:"Select your wifi network",
			tips:"You are now connected to the camera，please proceed to select the wifi you want the camera to connect ,and input the right password",
			nowifi:"No network is available",
			other:"Other…"
		},
		setWiFi:{
			title:"Connect Wi-Fi",
			tips:"You are now connected to the camera，please proceed to select the wifi you want the camera to connect ,and input the right password.",
			bottomTips:"5G network is not supported",
			next:"Next",
			placeholder:["WiFi SSID", "Password"],
			emptySSID:"Empty WiFi SSID is not allow.",
			emptyPassword:"Empty password is not allow."
		},
		bottomButtom:{
			name:["Screenshot", "Talk", "Record","Return to live", "Reconnect"]
		},
		resolution:{
			menuName:["HD","SD"]
		},
		eventPlay:{
			tips:["开始时间必须小于结束时间","结束时间必须大于开始时间","没有事件文件列表"]
		},
		mainTxt:{
			txt:["Want to see more ?","Subscribe to LDS Aware to see up to 1 month of activity."]
		},
		nonCard:{
			txt:["Non inserted memory card","After inserting the memory card, it is not recognized.Please insert the memory card again."],
			btnName:"OK"
		},
		setting:{
			title:"Device name",
			camerName:"Camera name",
			camerNameExtra:"Camera",
			locationName:"Location",
			locationExtra:"office",
			deviceInformation:"More about",
			firmwareUpdate:"Firmware update",
			videoManagement:"Video management",
			volume:"Volume",
			language:"Language",
			timeZone:"Time zone",
			screenRotation:"Screen rotation",
			screenRotationExtra:"not rotating",
			detection:"Intelligent detection alarm",
			detectionExtra:"medium",
			alarmNotice:"Alarm push notice",
			stateLamp:"State lamp",
			activityRecord:"Activity record",
			memoryCard:"SD card",
			memoryCardExtra:"SD normal",
			noMemoryCard:"SD card is not detected",
			restoreFactory:"Restore factory settings",
			rebootDevice:"Reboot device",
      removeDevice:"Remove device",
      dialogrestoreHint:"Confirm that restore factory settings, the data before can not be retained.",
			dialogrebootHint:"The restart process takes some time. Is it necessary to confirm the restart?",
			dialogremoveHint:"After deleting the device, the device will be removed from the list.",
			dialogremovePlanHint:"After deleting the device, the device will be removed from the list and planned to empty.",
      tips:["Getting time zone failure!","Indicator light","OFF","ON","Alarm push"],
      reboot:["Reboot of equipment..."],
      reset:["Restore the factory setting..."]
		},
		deviceInfo:{
			title:"More about",
			deviceid:"Device ID",
			devicemodel:"Device model",
			softwarev:"Software version",
			hardwarev:"Hardware version",
			mac:"MAC address",
			supplier:"Supplier",
		},videomanagement:{
			title:"Video management",
			videoName:"Video name",
			plannedCapacity:"Planned capacity",
			videoMode:"Video mode",
			bindingDevice:"Binding device",
			videoSwitch:"Video switch",
			effectiveTime:"Effective time",
			videoTimer:"Video timer",
			renew:"It has expired, please renew it.",
			noRecord: "No cloud recording plan has been added yet.",
			quickChoice: 'Quick choice',
			months:'months',
			amountPayable: 'Amount payable',
			monthsPlaceholder: 'Please enter the opening time',
			pay: 'Pay',
			moneyFlag: '￥',
			purchase:'Purchase now',
			addplan:'Add plan',
      		monthTip:"Do not month more than 3 number!",
			tips:['7Days/Mon',"Continuous record 7 days video (event trigger mark)All video stores a month's storage service."],
			Monday:'Mo',
			Tuesday:'Tu',
			Wednesday:'We',
			Thursday:'Th',
			Friday:'Fr',
			Saturday:'Sa',
			Sunday:'Su',
			workday:'Workday',
			weekend: 'Weekend',
			everyday:'Everyday',
			VideoTiming:'Video timing',
			startTime:'start time',
			endTime:'end time',
			unboundDevice: 'Unbound device',
			requestError:'Request error',
			  
		},sdmemory:{
			title:"Memory record",
			memoryCard:"Memory card",
			memory:"Memory",
			memoryTotal:"total",
			formatCard:"Format memory card",
			dialogHint:"After formatting, the data in the memory card will be cleared. Continue operation?",
			formatfail:"Formatted failure",
			formatsuccessful:"Formatted success",
			formatting:"formatting..."
		},
		addCamera:{
			title:"Add Camera",
			step1:"The camera turns on the power until the camera prompts 'wait for connection'.Use the insert pin in 2s to press the camera Resert button 3.",
			step2:"when you press the diagram,you hear the 'wait for connetion' hint",
			cameraOver:'The cameras you added can not over 16!',
			next:"Next"
		},
		addCamera1:{
			title:"Add Camera",
			step1:"The camera turns on the power until the camera prompts 'wait for connection'",
			step2:"when you press the diagram,you hear the 'wait for connetion' hint",
			next:"Next",
			tip:"What did not hear"
		},
		addCamera2:{
			title:"Add Camera",
			step1:"Use the pin to press the camera Resert button to Reset the success.",
			next:"Next",
		},
		wifiFail:{
			title:"Connect Wi-Fi",
			tips:[
				"fail to add",
				"the device has been bound by xx acount,and the account that needs to be bound is unbound to the device to be added.",
			],
			next:"Back Home Page",
		},
		addFail:{
			title:"Connect Wi-Fi",
			tips:[
				"fail to add",
				"IF you fail to add,we will suggest you try",
				"Abnormal server",
				"AP mode"
			],
			tryAgain:"Try again",
		},
		ipcAddFail:{
			title:"Connect Wi-Fi",
			tips:[
				"fail to add",
				"Abnormal server",
			],
			tryAgain:"Try again",
			quiteAdd:"Quit Adding Device",
		},
		ipcupdate:{
			title:"Firmware update",
			versionTitle:"Version number:",
			versionTip:"This is the latest version",
			version:[
				"Latest version",
				"Version number"
			],
			tips:[
				"1.Repair problems",
				"2.Fix the problem bug",
			],
			upgrade:"Upgrade"
		},
		updateFail:{
			title:"Fireware Update",
			tips:[
				"update fail",
				"Update failed,please try again",
				"Abnormal server"
			],
			tryAgain:"Try Again",
		},
		updateSuccess:{
			title:"Fireware Update",
			tips:[
				"Update success",
				"Latest version:",
				"Abnormal server"
			],
			tryAgain:"Try Again",
		},
		ipcCountDown:{
			title:"Fireware Update",
			tips:[
				"Download updates...",
				"During the update,the download process takes some time.Please wait patiently",
				"Upgraded...",
				"In upgrading,do not turn off the electricity and wait for the upgrade to be completed."
			]
		},
		ipcSDCard:{
			title:['SD card video'],
			btnName:["Select","Cancel","All"],
			confirm:"Confirm",
			infoMessage:["Video of SD card is empty","These videos will be removed from the storage list.","detecting SD...",'no data','No data today','Failed to get data!'],
			deleteInfo:['delete success!','delete failed!'],
			waitInfo:['loading...','Pull up to refresh','Deleting...']
		},
		selectWifi:{
			title:"Connect Wi-Fi",
			tips:[
				"You are now connected to the camera,  please proceed to select the wifi you want the camera to connect,and input the right password.",
				"Wi-Fi is not available at the moment. Please connect your phone to wi-fi first.",
				"Network is not supported 5G"
			],
			wifiName:"Wi-Fi that is not set",
			placeholder:"Wi-Fi password",
			next:"Next",
		},
		ipcConnectWifi:{
		title:"Connect Wi-Fi",
		tips:[
			"Connecting...",
			"Waiting for the camera to connect to wifi and come on-line"
		],
		},
		ipcWifiSuccess:{
			title:"Connect Wi-Fi",
			tips:[
				"Connecting Successfully",
				"The camera is on-line"
			],
		},
		eventList:{
			delete:"Delete",
			event:"events",
			tips:[
				"No video file",

			]
		},
		videoPlayer:{
			tips:["No video file", "Request exception", "tutk Off-line"]
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
		toast: ["This device is offline, it must be online before updating.","Hub or sirenhub is offline, it must be online before updating."],
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