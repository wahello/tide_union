export default {
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
			placeholder: ["Email address", "Password", "Confirm password", "Verification code"]
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
			placeholder: ["Email Address", "Verification Code", "New Password", "New password again"]
		},
		modify: {
			title: "My center"
		},
		validator: [
			"Please enter right email address",
			"Please enter password composed of 6 to 32 digit, character and underline",
			"Two input password inconsistencies",
			"Verification code must be 8 digits",
			"This email had been registered",
			"Verification code is null",
			"Verification code is wrong",
			"Password is wrong",
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
	}
}