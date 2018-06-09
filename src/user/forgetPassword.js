import React, { Component } from 'react';
import { connect } from 'react-redux';
import BarTitle from '../component/NavigationBar';
import Toast from 'antd-mobile/lib/toast';
import userApi from '../jssdk/User';
import { showDialog } from '../action';
import { createForm } from 'rc-form';
import Cookies from 'universal-cookie';
import helper from '../public/helper';
import { Lang } from '../public';

const ERR_DESC = {
  '-1000':Lang.user.login.timeout,
}

class ForgetPassword extends Component {
  constructor(props) {
  	super(props);
  	this.state = {
        buttonDisabled: false,
        verifyCode: '',
        isSecret: true,
        isSecret2: true,
        sendingVerifyCode: false,
        seconds: 120,
        isResend:false,
        emailCheckDisabled:false,
    };
    
    const { dispatch } = props;
    this.dispatch = dispatch;
    
    this.handleClick = this.handleClick.bind(this);
     this.handleClickBack = this.handleClickBack.bind(this);
     this.handleSendCaptcha = this.handleSendCaptcha.bind(this);
       this.handleSubmit = this.handleSubmit.bind(this);
      /**
     *用户名 验证码 新密码 确认新密码 四个输入框失去焦点获取焦点时 隐藏显示清除按钮 
     */
    this.onAccountBlur=this.onAccountBlur.bind(this);
    this.onAccountFocus=this.onAccountFocus.bind(this);
    this.onPasswordBlur=this.onPasswordBlur.bind(this);
    this.onPasswordFocus=this.onPasswordFocus.bind(this);
    this.onPassword2Blur=this.onPassword2Blur.bind(this);
    this.onPassword2Focus=this.onPassword2Focus.bind(this);
    this.onverifyCodeBlur=this.onverifyCodeBlur.bind(this);
    this.onverifyCodeFocus=this.onverifyCodeFocus.bind(this);
     /**
     * 检测邮箱是否符合规则，不然就sign up 按钮不可点击
     */
    this.handleEmailChange=this.handleEmailChange.bind(this);
	}
  
  handleEmailChange(event){
  	setTimeout(() => {
  		if(this.props.form.getFieldError('userName')){
  			this.setState({ emailCheckDisabled: true });
	   } else{
	   	this.setState({ emailCheckDisabled: false });
	   }
			console.log("handleEmailChange",this.props.form.getFieldValue('userName'));
            }, 100);
      console.log("wcb handleEmailChange emailCheckDisabled",this.state.emailCheckDisabled);
  }
  
  onAccountBlur(event){
  	console.log("onAccountBlur",event);
  	setTimeout(() => {
			var editNameIconId = document.getElementById("userName-clear-icon-id");
  	if(editNameIconId){
  		editNameIconId.style.visibility = "hidden";
  			}
            }, 100);
  		
	}
  onAccountFocus(event){
  	console.log("onAccountFocus");
  		var editNameIconId = document.getElementById("userName-clear-icon-id");
  		if(editNameIconId){
  	editNameIconId.style.visibility = "visible";
  	}
  }
  onPasswordBlur(event){
	console.log("onPasswordBlur");
	setTimeout(() => {
			var editPasswordIconId = document.getElementById("password-clear-icon-id");
		if(editPasswordIconId){
			editPasswordIconId.style.visibility = "hidden";
		}
            }, 100);
	}
  onPasswordFocus(event){
		console.log("onPasswordFocus");
		var editPasswordIconId = document.getElementById("password-clear-icon-id");
		if(editPasswordIconId){
			editPasswordIconId.style.visibility = "visible";
		}
		
  }
  onPassword2Blur(event){
	console.log("onPasswordBlur");
	setTimeout(() => {
			var editPassword2IconId = document.getElementById("password2-clear-icon-id");
		if(editPassword2IconId){
			editPassword2IconId.style.visibility = "hidden";
		}
            }, 100);
	}
  onPassword2Focus(event){
		console.log("onPasswordFocus");
		var editPassword2IconId = document.getElementById("password2-clear-icon-id");
		if(editPassword2IconId){
			editPassword2IconId.style.visibility = "visible";
		}
		
  }
  
   onverifyCodeBlur(event){
	console.log("onverifyCodeBlur");
	setTimeout(() => {
			var editverifyCodeIconId = document.getElementById("verifyCode-clear-icon-id");
		if(editverifyCodeIconId){
			editverifyCodeIconId.style.visibility = "hidden";
		}
            }, 100);
	}
  onverifyCodeFocus(event){
		console.log("onverifyCodeFocus");
		var editverifyCodeIconId = document.getElementById("verifyCode-clear-icon-id");
		if(editverifyCodeIconId){
			editverifyCodeIconId.style.visibility = "visible";
		}
		
  }
  
	 handleClickBack(event){
  	this.props.history.goBack();
  }
  handleClick(event) {
		this.setState({effect: 'home-start hide-pull-left'});
	}
  handleSendCaptcha(event) {
  	console.log("wcb handleSendCaptcha this.state.emailCheckDisabled:",this.state.emailCheckDisabled)
    if(this.state.emailCheckDisabled ){
    	return
    }else{
    	   const form = this.props.form;
		    const that = this;
		    console.log("window.system.networkStatus = " ,window.system.networkStatus); 
		    if(!window.system.networkStatus) {
		      Toast.info(Lang.user.validator[14], 3, null, false);
		      return;
		    }
		
		    const parameter = {
		      venderCode: "00001",
		      tenantId: '00001',
		      verifyCode: "12345678",
		      userName: this.props.form.getFieldValue("userName")
		    };
		 		const userName = this.props.form.getFieldValue('userName');
		     if (!userName) {
		    	console.log("userName = " ,userName); 
					Toast.info(Lang.user.forgetPassword.emptyUsername, 3, null, false);
					return;
				}
		    if(this.props.form.getFieldError('userName')){
		      console.log(this.props.form.getFieldError('userName'));
		      Toast.info(Lang.user.validator[0], 3, null, false);
		      return;
		    }
		
		    if(this.state.sendingVerifyCode){
		      return;
		    }
		 		if(!window.system.networkStatus) {
		      Toast.info(Lang.user.validator[14], 3, null, false);
		      return;
		    }
		 		if(form.getFieldError('userName')){
		      Toast.info(form.getFieldError('userName')[0], 3, null, false);
		      return;
		    }
		    userApi.checkUserName({venderCode: "00001", tenantId: '00001', userName: parameter.userName}).then((res) => {
		     if(res.code != 21001){
		        throw res;
		      }
		      that.setState({sendingVerifyCode: true});
		      that.countDown();
		      userApi.sendResetPwdVerifyCode({email: parameter.userName}).then(function(res){
		        if(res.code != 200){
		          throw res;
		        }
		        var input1 = document.getElementById("user-name-input");
		        input1.blur();
		        var input2 = document.getElementById("user-verifyCode-input");
		        input2.blur();
		        var input3 = document.getElementById("user-newPassWord-input");
		        input3.blur();
		        var input4 = document.getElementById("user-passWord2-input");
		        input4.blur();
		        that.dispatch(showDialog( "",Lang.user.register.dialog.sendSuccess.desc[0]));
		      }).catch(function(res){
		        that.dispatch(showDialog("",Lang.user.register.dialog.sendFail.title));
		        that.setState({sendingVerifyCode: false});
		      });
		      
		    }).catch(res => {
		    	console.log("wcb error res :",res);
		    	if(res.code==200){
		    		 Toast.info(Lang.user.forgetPassword.dialog.exit[0], 3, null, false);
		    	}else{
		    		that.dispatch(showDialog("",res.desc));
		    	}
		      
		    });
    }
 
  }
  
  countDown(){
    this.interval = setInterval(() => {
      this.setState(prevState => ({
          seconds: prevState.seconds - 1
      }));

      if(this.state.seconds === 0){
        clearInterval(this.interval);
        this.setState({
          seconds: 120,
          sendingVerifyCode: false,
          isResend:true
        })
      }
    }, 1000);
  }
  
  handleSubmit(event) {
  	const that = this;
    
    const form = this.props.form;

    event.currentTarget.focus();
    
     if(window.system.networkStatus == 0) {
      Toast.info(Lang.user.validator[14], 3, null, false);
      return;
    }
    form.validateFields();
    const userName = form.getFieldValue('userName');
     if (!userName) {
    	console.log("userName = " ,userName); 
			Toast.info(Lang.user.forgetPassword.emptyUsername, 3, null, false);
			return;
		}
    if(form.getFieldError('userName')){
      Toast.info(form.getFieldError('userName')[0], 3, null, false);
      return;
    }

    if(form.getFieldError('newPassWord')){
      Toast.info(form.getFieldError('newPassWord')[0], 3, null, false);
      return;
    }

    if(form.getFieldError('passWord2')){
      Toast.info(form.getFieldError('passWord2')[0], 3, null, false);
      return;
    }

    if(form.getFieldError('verifyCode')){
      Toast.info(form.getFieldError('verifyCode')[0], 3, null, false);
      return;
    }

    const parameter = {
      venderCode: '00001',
      tenantId: '00001',
      userName: form.getFieldsValue().userName
    };

    userApi.checkUserName(parameter).then(res => {
      if(res.code != 21001){
        throw res;
      }
      submit();
    }).catch(res => {
      Toast.info(res, 3, null, false);
    });

    function submit(){
    	
      let formData = form.getFieldsValue();
      formData.newPassWord = helper.md5(formData.newPassWord);
 		  formData.passWord2 = helper.md5(formData.passWord2);
      const parameter = {
        ...formData,
        venderCode: "00001",
        tenantId: '00001',
        verifyCode: formData.verifyCode,
      };

      that.setState({ buttonDisabled: true,emailCheckDisabled: true });
      userApi.forgetPassword(parameter).then(function(res){
        if(res.code != 200){
          throw res;
        }
        that.dispatch(showDialog( "",  Lang.user.forgetPassword.dialog.desc[0],[
            {
                text: Lang.public.dialog.button[1],
                className: "btn-split",
                handleClick: function(){
                    this.hide();
                    let cookies = new Cookies;
                    cookies.remove('isLogined');
                    cookies.remove('password');
                    that.props.history.replace('/user/login');
                    // that.jsBridge.send({url: 'appUserLogout', data: null});
                }
            }]));
        console.log("更改密码成功");
        }).catch(function(res){
      	 that.dispatch(showDialog( "",ERR_DESC[res.code] || res.desc));
         that.setState({ buttonDisabled: false,emailCheckDisabled: false });
      });

    }
  }
  
  render() {
  	const { getFieldProps, getFieldError } = this.props.form;
    return (
    	<div className="user">
     	<div className="user-forgetpassword">
        <BarTitle onBack={this.handleClickBack} title={Lang.user.forgetPassword.title} />
        <div className="bodyer "  >
        <div className="forget-account">
            <input id="user-name-input" type="text" maxLength="32" onBlur={this.onAccountBlur} onFocus={this.onAccountFocus} placeholder={Lang.user.forgetPassword.placeholder[0]}
            {...getFieldProps('userName', {
                initialValue: "", 
                 onChange: this.handleEmailChange,
                rules: [
                {required: true, type: 'email', message: Lang.user.validator[0]}
                ]
              })}
             />
             {this.props.form.getFieldValue("userName")  ? <span id="userName-clear-icon-id" className="clear-icon" href="javascript:;" onClick={() => {this.props.form.setFieldsValue({userName: ""})}}></span> : ''}
          </div>
         <div   className={ this.state.emailCheckDisabled ? 'disabled' : 'forget-captcha'} >
         		<div className="captcha-line"/>
            <input id="user-verifyCode-input" type="text" maxLength="32"onBlur={this.onverifyCodeBlur} onFocus={this.onverifyCodeFocus} placeholder={Lang.user.forgetPassword.placeholder[1]}
            {...getFieldProps('verifyCode', {
                initialValue: "",
                onChange: this.handleChangeVerifyCode,
                rules: [{required: true, len: 8, patter: /^[0-9]+$/, message: Lang.user.validator[3]}]
              })}
            />
            
            <span    href="javascript:;" onClick={this.handleSendCaptcha} >
             {!this.state.sendingVerifyCode ?　this.state.isResend?Lang.user.forgetPassword.resend:Lang.user.forgetPassword.send : `${this.state.seconds}s`}
            </span>
               {this.props.form.getFieldValue("verifyCode")  ? <span id="verifyCode-clear-icon-id" className="clear-icon" href="javascript:;" onClick={() => this.props.form.setFieldsValue({verifyCode: ""})}></span> : ''}
          </div>
           <div className="forget-password ">
            <input id="user-newPassWord-input" type="passWord" maxLength="32" onBlur={this.onPasswordBlur} onFocus={this.onPasswordFocus} placeholder={Lang.user.forgetPassword.placeholder[2]}
             {...getFieldProps('newPassWord', {
                initialValue: "",
                 rules: [
                  {validator: (rule, value, callback, source, options) => {
                    const errors = [];
                    if(!value || value.length < 6 || value.length > 20 || !/[A-Z]+/.test(value) || !/^[0-9_a-zA-Z]+$/.test(value)|| !/[a-z]+/.test(value)|| !/[0-9]+/.test(value)){
                      console.log(value)
                      errors.push(Lang.user.validator[1]);
                      callback(errors);
                      return;
                    }
                  }}
                ]
              })}
             />
              {this.props.form.getFieldValue("newPassWord")  ? <span id="password-clear-icon-id" className="clear-icon" href="javascript:;" onClick={() => this.props.form.setFieldsValue({newPassWord: ""})}></span> : ''}
          </div>
           <div className="forget-password ">
            <input id="user-passWord2-input"type="password" maxLength="32"  onBlur={this.onPassword2Blur} onFocus={this.onPassword2Focus} placeholder={Lang.user.forgetPassword.placeholder[3]}
            {...getFieldProps('passWord2', {
                initialValue: "",
                rules: [
                  {validator: (rule, value, callback, source, options) => {
                    const errors = [];
                    if(this.props.form.getFieldValue('newPassWord') != value || !value){
                      errors.push(Lang.user.validator[2]);
                      callback(errors);
                      return;
                    }
                    if(!value || value.length < 6 || value.length > 20 || !/[A-Z]+/.test(value) || !/^[0-9_a-zA-Z]+$/.test(value)|| !/[a-z]+/.test(value)|| !/[0-9]+/.test(value)){
                      console.log(value)
                      errors.push(Lang.user.validator[1]);
                      callback(errors);
                      return;
                    }
                    
                  }}
                ]
              })}
             />
              {this.props.form.getFieldValue("passWord2")  ? <span id="password2-clear-icon-id" className="clear-icon" href="javascript:;" onClick={() => this.props.form.setFieldsValue({passWord2: ""})}></span> : ''}
          </div>
          <div className="forget-operate">
          <button  className={this.state.buttonDisabled|| this.state.emailCheckDisabled ? "btn-disabled":"btn"}  onClick={this.handleSubmit} disabled={this.state.buttonDisabled|| this.state.emailCheckDisabled}>
           {Lang.user.forgetPassword.Submit + (this.state.buttonDisabled ? '…' : '')}
          </button>
          </div>
        </div>
        <footer> 
          <p></p>
        </footer>
      </div>
       </div>
    );
  }
}

export default connect()(createForm()(ForgetPassword))
