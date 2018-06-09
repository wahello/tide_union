import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import helper from '../public/helper';
import userApi from '../jssdk/User';
import { showDialog } from '../action';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';
import Toast from 'antd-mobile/lib/toast';
import 'antd-mobile/lib/toast/style/css';
import NavigationBar from '../component/NavigationBar';
import { Lang } from '../public';

const ERR_DESC = {
	 '-1000':Lang.user.login.timeout,
} 
const accoutDueDate = 15;

class Register extends Component {
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
    
    this.handleChangeSecret = this.handleChangeSecret.bind(this);
    this.handleChangeSecret2 = this.handleChangeSecret2.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSendCaptcha = this.handleSendCaptcha.bind(this);
    /**
     *用户名 验证码 密码  三个输入框失去焦点获取焦点时 隐藏显示清除按钮 
     */
     this.onAccountBlur=this.onAccountBlur.bind(this);
    this.onAccountFocus=this.onAccountFocus.bind(this);
    this.onPasswordBlur=this.onPasswordBlur.bind(this);
    this.onPasswordFocus=this.onPasswordFocus.bind(this);
    this.onverifyCodeBlur=this.onverifyCodeBlur.bind(this);
    this.onverifyCodeFocus=this.onverifyCodeFocus.bind(this);
    /**
     * 检测邮箱是否符合规则，不然就sign up 按钮不可点击
     */
    this.handleEmailChange=this.handleEmailChange.bind(this);
    this.showPwdRequireDialog = this.showPwdRequireDialog.bind(this);
  }
  showPwdRequireDialog(event){
  	const that = this;
  	 that.dispatch(showDialog("Password requirements", Lang.user.register.error));
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
  handleChangeSecret(event) {
    this.setState({isSecret: !this.state.isSecret});
  }
  
  handleChangeSecret2(event) {
    this.setState({isSecret2: !this.state.isSecret2});
  }
  
  handleSendCaptcha(event) {
  	if(this.state.emailCheckDisabled){
  		return
  	}else{
  		 const that = this;
    const parameter = {
      tenantId: '00001',
      userName: this.props.form.getFieldValue('userName')
    };
      const passWord = this.props.form.getFieldValue('passWord');
     const userName = this.props.form.getFieldValue('userName');
     if (!userName) {
    	console.log("userName = " ,userName); 
			Toast.info(Lang.user.login.emptyUsername, 3, null, false);
			return;
		}
    if (!passWord) {
    	console.log("passWord = " ,passWord);
			Toast.info(Lang.user.login.emptyPassword, 3, null, false);
			return;
		}
    
    if(this.props.form.getFieldError('userName')){
      console.log(this.props.form.getFieldError('userName'));
      Toast.info(Lang.user.validator[0], 3, null, false);
      return;
    }
	if(this.props.form.getFieldError('passWord')){
  	  console.log("weizhongbin passWord = " ,this.props.form.getFieldError('passWord')[0]);
      that.dispatch(showDialog("Password requirements", this.props.form.getFieldError('passWord')[0]));
      return;
    }
    if(this.state.sendingVerifyCode){
      return;
    }

    if(!window.system.networkStatus) {
      Toast.info(Lang.user.validator[14], 3, null, false);
      return;
    }


    userApi.checkUserName(parameter).then((res) => {
      if(res.code != 200){
        throw res;
      }

      that.dispatch(showDialog('', Lang.user.register.dialog.sendSuccess.desc[0], [
        {
            text: Lang.public.dialog.button[1],
            className: "btn-split",
            handleClick: function(){
                this.hide();
                that.setState({sendingVerifyCode: true});
                that.countDown.call(that);
                userApi.sendRegistVerifyCode({email: parameter.userName}).then(function(res){
                  if(res && res.code != 200){
                    that.setState({sendingVerifyCode: false});
                    throw res;
                  }
                  var input1 = document.getElementById("user-name-input");
                  input1.blur();
                  var input2 = document.getElementById("user-verifyCode-input");
                  input2.blur();
                  var input3 = document.getElementById("user-newPassWord-input");
                  input3.blur();
               }).catch(function(res){
                 Toast.info(res.desc, 3, null, false);
                 that.setState({sendingVerifyCode: false});
               });
            }
        }]));
    }).catch(res => {
    	  console.log("res : ", res);
      Toast.info(res.desc, 3, null, false);
    });
  	}
   
  }
    
  handleSubmit(event) {
    const that = this;
    const form = this.props.form;
		debugger;
    event.currentTarget.focus();
    
    form.validateFields();
    const passWord = form.getFieldValue('passWord');
    const userName = form.getFieldValue('userName');
    const verifyCode = form.getFieldValue('verifyCode');
    if (!userName) {
    	console.log("userName = " ,userName); 
			Toast.info(Lang.user.login.emptyUsername, 3, null, false);
			return;
		}
    if (!passWord) {
    	console.log("passWord = " ,passWord);
			Toast.info(Lang.user.login.emptyPassword, 3, null, false);
			return;
    }
    if (!verifyCode) {
    	console.log("verifyCode = " ,verifyCode);
			Toast.info(Lang.user.login.emptyVerifyCode, 3, null, false);
			return;
    }
    if (verifyCode.length < 8) {
    	console.log("verifyCode = " ,verifyCode);
			Toast.info(Lang.user.login.verifyCodeLen, 3, null, false);
			return;
		}
    if(form.getFieldError('userName')){
      Toast.info(form.getFieldError('userName')[0], 3, null, false);
      return;
    }

    if(form.getFieldError('passWord')){
    	console.log("weizhongbin passWord = " ,form.getFieldError('passWord')[0]);
    	that.dispatch(showDialog("Password requirements", form.getFieldError('passWord')[0]));
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
      if(res.code != 200){
        throw res;
      }

      submit();
    }).catch(res => {
      Toast.info(res.desc, 3, null, false);
    });

    function submit(){
      let formData = form.getFieldsValue();
      formData.passWord = helper.md5(formData.passWord);
      
      const parameter = {
        ...formData,
        venderCode: "00001",
        tenantId: '00001',
        verifyCode: formData.verifyCode,
        nickname:"My name"
      };

      that.setState({ buttonDisabled: true,emailCheckDisabled: true});
      userApi.register(parameter).then(function(res){
        if(res.code != 200){
          throw res;
        }
        
        const cookies = new Cookies();
        that.setState({ buttonDisabled: false ,emailCheckDisabled: false});

        const loginParameter = {
          userName: parameter.userName,
          passWord: parameter.passWord,
          venderCode: "00001",
  			 	lastIp: "192.168.1.111",
    			lastLogin: "2017-12-07 10:30:40"
        }

        userApi.login(loginParameter).then(function(res){
          if(res.code != 200){
            throw res;
          }

          let expires = new Date;
          expires.setDate(expires.getDate() + accoutDueDate);
          cookies.set('userId', res.data.userId, {maxAge: expires});
          cookies.set('nickname', res.data.nickName, {expires});
          cookies.set('mqttPassword', res.data.mqttPassword, {expires});
          cookies.set('accessToken', res.data.accessToken, {expires});
          cookies.set('refreshToken', res.data.refreshToken, {expires});
          cookies.set('isLogined', 1, {maxAge: expires});
          cookies.set('account', parameter.userName,{expires: expires});
          localStorage.setItem('newLogin', 1);
          localStorage.removeItem("deviceList");
          localStorage.removeItem("spaceList");
          // that.props.history.replace('/');
          that.props.history.replace('/family/create');
        }).catch(function(res){
          that.props.history.replace('/user/login');
        });
      }).catch(function(res){
        Toast.info(res.desc);
        that.setState({ buttonDisabled: false,emailCheckDisabled: false });
      });

    }
  }

  countDown(){
    this.interval && clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.setState(prevState => ({
          seconds: prevState.seconds - 1
      }));

      if(this.state.seconds === 0){
    		this.interval && clearInterval(this.interval);
        this.setState({
          seconds: 120,
          sendingVerifyCode: false,
          isResend:true
        })
      }
    }, 1000);
  }

  componentDidMount(){
    
  }
  

  render() {
    let switchPwdInput = (this.state.isSecret ? "password" : "text");
    let switchPwdIcon = (this.state.isSecret ? "close" : "open");
    let switchPwdInput2 = (this.state.isSecret2 ? "password" : "text");
    let switchPwdIcon2 = (this.state.isSecret2 ? "close" : "open");
    const { getFieldProps, getFieldError } = this.props.form;
        
    return (
    	<div className="user">
      <div className="user-register">
        <NavigationBar onBack={()=>{this.props.history.goBack()}} title={Lang.user.register.title} />
        <div className="bodyer">
          <div className="box-account">
            <input id="user-name-input" type="text" maxLength="32" onBlur={this.onAccountBlur} onFocus={this.onAccountFocus}
              placeholder={Lang.user.register.placeholder[0]}
              {...getFieldProps('userName', {
                initialValue: "", 
                onChange: this.handleEmailChange,
                rules: [
                {required: true, type: 'email', message: Lang.user.validator[0]}
                ]
              })}/>
             <div id="userName-clear-icon-id" >
            {this.props.form.getFieldValue("userName")  ? <a className="clear-icon" href="javascript:;" onClick={() => {this.props.form.setFieldsValue({userName: ""})}}></a> : ''}
            </div>
          </div>
          <div className="box-password">
            <input id="user-newPassWord-input" type={switchPwdInput} maxLength="20" onBlur={this.onPasswordBlur} onFocus={this.onPasswordFocus}
              placeholder={Lang.user.register.placeholder[1]}
              {...getFieldProps('passWord', {
                initialValue: "",
                rules: [
                  {validator: (rule, value, callback, source, options) => {
                    const errors = [];
                    if(!value || value.length < 6 || value.length > 20 || !/[A-Z]+/.test(value) || !/[a-z]/.test(value)|| !/[0-9]/.test(value)){
                      console.log(value)
                      errors.push(Lang.user.register.error);
                      callback(errors);
                      return;
                    }
                  }}
                ]
              })}/>
            <span className={switchPwdIcon} onClick={this.handleChangeSecret}></span>
            {this.props.form.getFieldValue("passWord")  ? <a id="password-clear-icon-id" className="clear-icon" href="javascript:;" onClick={() => this.props.form.setFieldsValue({passWord: ""})}></a> : ''}
          </div>
         	{/* <div className="box-password2">
            <input type={switchPwdInput2} maxLength="32"
              placeholder={Lang.user.register.placeholder[2]}
              {...getFieldProps('passWord2', {
                initialValue: "",
                rules: [
                 {type: "string", max: 32, min: 6, patter: /[0-9_a-zA-Z]+/, message: Lang.user.validator[2]},
                 {validator: (rule, value, callback, source, options) => {
                    const errors = [];
                    if(this.props.form.getFieldValue('passWord') != value || !value){
                      errors.push(Lang.user.validator[2]);
                      callback(errors);
                      return;
                    }
                  }}
                ]
              })}/>
            <a className={switchPwdIcon2} href="javascript:;" onClick={this.handleChangeSecret2}></a>
            {this.props.form.getFieldValue("passWord2").length ? <a className="clear-icon" href="javascript:;" onClick={() => this.props.form.setFieldsValue({passWord2: ""})} /> : ""}
          </div>*/}
          <div className={ this.state.emailCheckDisabled ? 'userdisabled' : 'box-captcha'}>
            <input id="user-verifyCode-input" type="text" maxLength="8" onBlur={this.onverifyCodeBlur} onFocus={this.onverifyCodeFocus}
              placeholder={Lang.user.register.placeholder[3]}
              {...getFieldProps('verifyCode', {
                initialValue: "",
                onChange: this.handleChangeVerifyCode,
                rules: [{required: true, len: 8, pattern: /^[0-9]+$/, message: Lang.user.validator[3]}]
              })}/>
            <a className="link-send" href="javascript:void(0);" onClick={this.handleSendCaptcha}>
            	{!this.state.sendingVerifyCode ?　this.state.isResend?Lang.user.forgetPassword.resend:Lang.user.forgetPassword.send  : `${this.state.seconds}s`}
            </a>
            {this.props.form.getFieldValue("verifyCode").length ? <a id="verifyCode-clear-icon-id" className="clear-icon" href="javascript:;" onClick={() => this.props.form.setFieldsValue({verifyCode: ""})}></a> : ''}
          </div>
          <div className="box-operate">
          <p className="link-forgetPw" >
          		<a onClick = {this.showPwdRequireDialog}>{Lang.user.register.PwdRequire}</a>
            </p>
            <button className={this.state.buttonDisabled|| this.state.emailCheckDisabled ? "btn-disabled":"btn"} onClick={this.handleSubmit} disabled={this.state.buttonDisabled || this.state.emailCheckDisabled}>
              {Lang.user.register.buttonText + (this.state.buttonDisabled ? '…' : '')}
            </button>
          </div>

           <footer className="footer">
            <p className="to_continue">{Lang.user.register.continue}</p>
	           <p className="terms">
		            <Link to="/user/termsOfservice" className="link">{Lang.user.register.termsOfservice}</Link>
		            <Link to="/user/privatePolicy" className="link link_policy">{Lang.user.register.privatePolicy}</Link>
	            </p>
        </footer>
        </div>
      </div>
      </div>
    );
  }
}

export default connect()(createForm()(Register))
