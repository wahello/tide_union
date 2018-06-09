import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import helper from '../public/helper';
import userApi from '../jssdk/User';
import { executeSQL } from '../jssdk/db';
import { showDialog } from '../action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';
import Toast from 'antd-mobile/lib/toast';
import 'antd-mobile/lib/toast/style/css';
import { Style } from './resource';
import { Lang } from '../public';
import { initFamilyData } from '../action/family';
import { initDeviceData } from '../action/device';
import { initSecurityData } from '../action/security';
import { initAutomationData } from '../action/automation';
import { initSceneData } from '../action/scene';

const ERR_DESC = {
  '-1000':Lang.user.login.timeout,
}
const accoutDueDate = 15;

class Login extends Component {
  cookies = new Cookies();
  
  constructor(props) {
    super(props);
    this.state = {
        userName: this.cookies.get('account') || '',
        passWord: '',
        buttonDisabled: false,
        isSecret: true,
        sendingVerifyCode: false,
        seconds: 120,
        isResend:false,
        showCaptcha: false,
        isShowPasswordClear: false,
        emailCheckDisabled:false,
    };
    const { dispatch } = props;
    this.dispatch = dispatch;
    
//  this.handleChangeSecret = this.handleChangeSecret.bind(this);
    this.clearName=this.clearName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.oldUserName = this.cookies.get('account');
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
    this.onKeyDown=this.onKeyDown.bind(this);
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
  }
  onKeyDown(event){
  	console.log("onKeyDown",event.keyCode);	
  	if(event.keyCode == 13){
  		var input = document.getElementById("loginPwdInput");
			input.blur();
  	}
  }
  clearName(event){
  	console.log("clearName");	
  	this.props.form.setFieldsValue({passWord: '' })
  }
  onAccountBlur(event){
  	console.log("onAccountBlur",event);
  	setTimeout(() => {
			var editNameIconId = document.getElementById("username-clear-icon-id");
  	if(editNameIconId){
  		editNameIconId.style.visibility = "hidden";
  			}
            }, 100);
  		
	}
  onAccountFocus(event){
  	console.log("onAccountFocus");
  		var editNameIconId = document.getElementById("username-clear-icon-id");
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
//handleChangeSecret(event) {
//		console.log("handleChangeSecret");
//  this.setState({isSecret: !this.state.isSecret});
//}
  handleClearInput(key){
    let obj = {};
    obj[key] = '';
    this.setState(obj);
    this.props.form.setFieldsValue(obj);
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
	    if(this.props.form.getFieldError('userName')){
	      console.log(this.props.form.getFieldError('userName'));
	      Toast.info(Lang.user.validator[0], 3, null, false);
	      return;
	    }
	    if(this.state.sendingVerifyCode){ 
	      return;
	    }
	    if(!window.system.networkStatus) {
	      console.log()
	      Toast.info(Lang.user.validator[14], 3, null, false);
	      return;
	    }
	    userApi.checkUserName({
	      venderCode: "00001", 
	      tenantId: '00001', 
	      userName: parameter.userName
	    }).then((res) => {
	      //用户不存在
	      if(res.code == 200){
	        throw res;
	      }
	
	      that.setState({sendingVerifyCode: true});
	      that.countDown();
	      userApi.sendPwdErrorVerifyCode({email: parameter.userName}).then(function(res){
	        if(res.code != 200){
	          throw res;
	        }
//	        that.props.actions.showDialog("", Lang.user.register.dialog.sendSuccess.desc[0]);
	         Toast.info(Lang.user.register.dialog.sendSuccess.desc[0], 3, null, false);
	      }).catch(function(res){
	        Toast.info(res.desc, 3, null, false);
	      });
	      
	    }).catch(res => {
	      Toast.info(res.desc, 3, null, false);
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
  	console.log("wcb this.state.emailCheckDisabled",this.state.emailCheckDisabled);
//	if(!this.state.emailCheckDisabled){
  		 	console.log("wcb 111111111111111111111111111");
  		    let that = this;
	    let form = this.props.form;
	    let formData = form.getFieldsValue();
	
	    event.currentTarget.focus();
	
	    if(!window.system.networkStatus) {
	      Toast.info(Lang.user.validator[14], 3, null, false);
	      return;
	    }
	
	    form.validateFields();
	    const passWord = form.getFieldValue('passWord');
	     const userName = form.getFieldValue('userName');
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
	        if(form.getFieldError('userName')){
	      Toast.info(form.getFieldError('userName')[0], 4, null, false);
	      return;
	    }
	
	    if(this.state.showCaptcha && form.getFieldError('verifyCode')){
	      Toast.info(form.getFieldError('verifyCode')[0], 3, null, false);
	      return;
	    }
	
	    //记住账号
	    let expires = new Date;
	    expires.setDate(expires.getDate() + 30);
	    this.cookies.set('account', formData.userName, {expires: expires});
	
	    if(form.getFieldError('passWord')){
	      Toast.info(form.getFieldError('passWord')[0], 4, null, false);
	      return;
	    }
	
	    formData.passWord = helper.md5(formData.passWord);
	    let parameter = {
	      ...formData,
	      terminalMark: 'app',
	      phoneId: this.cookies.get('phoneId'),
	      os: this.cookies.get('os'),
	    }
	    this.setState({ buttonDisabled: true,emailCheckDisabled: true});
	    userApi.login(parameter).then(function(res){
	    	console.log("success login resp  = ",res);
	      if(res.code != 200){
	 			
//	        that.props.actions.showDialog("", ERR_DESC[res.code] || res.desc);
	         Toast.info(ERR_DESC[res.code] || res.desc, 3, null, false);
	        that.setState(prevState => ({
	            buttonDisabled: false,
	            emailCheckDisabled: false
	        }));
	        if(res.code == '21049' || res.code == '21029'||res.code =="21028"){
	          that.setState(prevState => ({
	            showCaptcha : true
	          }));
	        }
	        return;
	      }
	      	console.log("code  = ",res.code );
	      let expires = new Date;
	      expires.setDate(expires.getDate() + accoutDueDate);
	      that.cookies.set('isLogined', '1', {expires});
	      that.cookies.set('userId', res.data.userId, {expires});
	      that.cookies.set('nickName', res.data.nickName, {expires});
	      that.cookies.set('password', parameter.passWord, {expires});
	      that.cookies.set('mqttPassword', res.data.mqttPassword, {expires});
	      that.cookies.set('accessToken', res.data.accessToken, {expires});
	      that.cookies.set('refreshToken', res.data.refreshToken, {expires});
	      localStorage.setItem('newLogin', '1');
	      that.cookies.set('locationId', res.data.defaultLocationId, {expires});
	      that.setState({ buttonDisabled: false });
	      //登陆账号变更，清除缓存
	      console.log('登陆账号变更，清除缓存', that.oldUserName, formData.userName);
	      
	      if(that.oldUserName != formData.userName){
	        that.clearCache();
	      }
	      that.props.history.replace('/');
	
	   }).catch(function(res){
	   	  	console.log("error login res  = ",res);
//	      that.props.actions.showDialog("", res.desc || Lang.user.login.validator[1]);
	      Toast.info(res.desc || Lang.user.login.validator[1], 3, null, false);
	       that.setState({ buttonDisabled: false,emailCheckDisabled: false });
	    });
	
	    return;
//	}else{
//		 	console.log("wcb 222222222222222222222222222");
//		 return;
//	}
  }

  clearCache(){
    const {
      initFamilyData,
      initDeviceData,
      initSecurityData,
      initAutomationData,
      initSceneData
    } = this.props.actions;
    initFamilyData();
    initDeviceData();
    initSecurityData();
    initAutomationData();
    initSceneData();
    executeSQL('DELETE * FROM tb_lds_cache');
  }

  componentDidMount() {
		var editNameIconId = document.getElementById("username-clear-icon-id");
  	if(editNameIconId){
  		editNameIconId.style.visibility = "hidden";
  	}
  }
  
  render() {
    let errors;
    const { getFieldProps, getFieldError } = this.props.form;
    
    return (
      <div className="user-login">
        <div className="bodyer">
          <div className="banner">{Lang.user.login.welcome}</div>
          <div className="box-account">
            <input type="text" maxLength="32" onBlur={this.onAccountBlur} onFocus={this.onAccountFocus}
              placeholder={Lang.user.login.placeholder[0]}
              {...getFieldProps('userName', {
                onChange: this.handleEmailChange,
                initialValue: this.state.userName, 
                rules: [{required: true, type: 'email', message: Lang.user.validator[0]}]
              })}/>
            <div id="username-clear-icon-id" >
            {this.props.form.getFieldValue('userName').length ? <a  className="clear-icon"  onClick={() => this.props.form.setFieldsValue({userName: ''})}></a> : ''}
            </div>
          </div>
          <div className="box-password">
            <input id="loginPwdInput" type={"password"} maxLength="20" onKeyDown={this.onKeyDown} onBlur={this.onPasswordBlur} onFocus={this.onPasswordFocus}
              placeholder={Lang.user.login.placeholder[1]}
              {...getFieldProps('passWord', {
                onChange: this.handlePwdChange,
                initialValue: this.state.passWord,
                rules: [{required: true, message: Lang.user.validator[1]}]
              })}/>
            {this.props.form.getFieldValue('passWord').length ? <a id="password-clear-icon-id"className="clear-icon"  onClick={() => this.props.form.setFieldsValue({passWord: ''})}></a> : ''}
          </div>
          <div className={ this.state.emailCheckDisabled ? 'userdisabled' : 'box-captcha'} style={{display: this.state.showCaptcha ? 'block' : 'none'}}>
            <input type="text" maxLength="8" onBlur={this.onverifyCodeBlur} onFocus={this.onverifyCodeFocus}
              placeholder={Lang.user.register.placeholder[3]}
              {...getFieldProps('verifyCode', {
                initialValue: "",
                onChange: this.handleChangeVerifyCode,
                rules: [{required: true, len: 8, pattern: /^[0-9]+$/, message: Lang.user.validator[3]}]
              })}/>
            <a className="link-send "  onClick={this.handleSendCaptcha}>
            {!this.state.sendingVerifyCode ?　this.state.isResend?Lang.user.forgetPassword.resend:Lang.user.forgetPassword.send  : `${this.state.seconds}s`}
            </a>
            {this.props.form.getFieldValue("verifyCode").length  ? <a id="verifyCode-clear-icon-id" className="clear-icon"  onClick={() => this.props.form.setFieldsValue({verifyCode: ""})}></a> : ''}
          </div>
          <div className="box-operate">
            <p className="link-forgetPw">
              <Link to="/user/forgetPassword">{Lang.user.login.forgetPw}</Link>
            </p>
            <button className={this.state.buttonDisabled|| this.state.emailCheckDisabled ? "btn-disabled":"btn"} onClick={this.handleSubmit} disabled={this.state.buttonDisabled|| this.state.emailCheckDisabled}>
              {Lang.user.login.buttonText + (this.state.buttonDisabled ? '…' : '')}
            </button>
             <p className="link-switch">
              <Link to="/user/register">{Lang.user.login.linkSwitch}</Link>
            </p> 
          </div>
        </div>  
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators({ 
      initFamilyData,
      initDeviceData,
      initSecurityData,
      initAutomationData,
      initSceneData,
      showDialog
    }, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(Login));
