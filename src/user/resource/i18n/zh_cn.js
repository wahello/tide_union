export default {
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
			placeholder:["邮箱地址", "密码"],
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
			placeholder:["邮箱地址", "密码", "确认密码", "验证码"]
		},
		forgetPassword: {
			title:"Forget password",
			send: "Send",
			resend: "Resend",
			Submit:"Submit",
			forgetPassword:"忘记密码",
			dialog: {
				desc: ["更改密码成功,请重新登录"],
				fail:["Wrong certification code, please enter right code"],
				exit:["账号不存在"]
			},
			dialogSuccess:"更改密码成功,请重新登录",
			placeholder:["Email Address", "Verification Code", "New Password", "New password again"]
		},
		modify:{
			title:"个人中心"
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
	}
}