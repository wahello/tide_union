import React, { Component } from 'react';
import { connect } from 'react-redux';
import BarTitle from '../component/barTitle';
import SystemApi from '../jssdk/system';
import { createForm } from 'rc-form';
import { showDialog, selectTab } from '../action';
import Cookies from 'universal-cookie';
import helper from '../public/helper';
import { Link } from 'react-router-dom';
import Toast from 'antd-mobile/lib/toast';
import 'antd-mobile/lib/toast/style/css';
import userApi from "../jssdk/User";
import { Lang } from '../public';

const ERR_DESC = {
  21004: Lang.user.validator[11],
  21047: Lang.user.validator[8],
  400: Lang.user.validator[14],
  1003: Lang.user.validator[14],
  '-1000':Lang.user.login.timeout,
}

class ChangePwd extends Component {
  cookies = new Cookies();

  constructor(props) {
  	super(props);
    this.state = {
      version: '0.0.2'
    };
    const { dispatch } = props;
    this.dispatch = dispatch;
    this.systemApi = new SystemApi;
    
    this.handleClickBack = this.handleClickBack.bind(this);
    this.handleClickLI = this.handleClickLI.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
 
    this.onAccountBlur=this.onAccountBlur.bind(this);
    this.onAccountFocus=this.onAccountFocus.bind(this);
    this.onPasswordBlur=this.onPasswordBlur.bind(this);
    this.onPasswordFocus=this.onPasswordFocus.bind(this);
    this.onPassword2Blur=this.onPassword2Blur.bind(this);
    this.onPassword2Focus=this.onPassword2Focus.bind(this);
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
	
  handleClickBack(event){
  	this.props.history.goBack();
  }
  
  handleClickLI(event){
  	this.dispatch(showDialog(Lang.public.dialog.title[0], Lang.setting.about.dialog.fail.desc));
  }

  handleSubmit(event) {
    let that = this;
    let form = this.props.form;
    let hasError = false;

    event.currentTarget.focus();
	  if(!window.system.networkStatus) {
      Toast.info(Lang.user.validator[14], 3, null, false);
      return;
    }

    form.validateFields();

    const passWord = form.getFieldValue('passWord');
    const passWord2 = form.getFieldValue('passWord2');
    const passWord3 = form.getFieldValue('passWord3');

    if (!passWord) {
    	console.log("passWord = " ,passWord);
			Toast.info(Lang.user.login.emptyPassword, 3, null, false);
			return;
    }
    
    if (!passWord2) {
    	console.log("passWord2 = " ,passWord2);
			Toast.info(Lang.user.login.emptyPassword, 3, null, false);
			return;
    }
    
    if (!passWord3) {
    	console.log("passWord3 = " ,passWord3);
			Toast.info(Lang.user.validator[2], 3, null, false);
			return;
		}

    if(form.getFieldError('passWord')){
    	console.log("1");
        Toast.info(form.getFieldError('passWord')[0], 3, null, false);
        return;
    }

    console.log('oldPassword:' ,form.getFieldsValue().passWord);

    if(form.getFieldError('passWord2')){
    	console.log("2");
        Toast.info(form.getFieldError('passWord2')[0], 3, null, false);
        return;
    }

    if(form.getFieldError('passWord3')){
    	console.log("3");
        Toast.info(form.getFieldError('passWord3')[0], 3, null, false);
        return;
    }

    console.log('newPassword:' ,form.getFieldsValue().passWord3);

    var parameter = {
        userId:this.cookies.get('userId'),
        tenantId: '00001',
        oldPassword: helper.md5(form.getFieldsValue().passWord),
        newPassword: helper.md5(form.getFieldsValue().passWord3)
    };

    userApi.changePwd(parameter).then(res => {
        if(res.code != 200){
        	 console.log("res.code = ", res);
            throw res;
        }
        that.dispatch(showDialog('', Lang.user.password.success, [
            {
                text: Lang.public.dialog.button[1],
                className: "btn-split",
                handleClick: function(){
                    this.hide();
                    let cookie = new Cookies;
                    let expires = new Date;
                    cookie.set('password', parameter.newPassword, {expires});
                   	that.props.history.goBack();
                }
            }]));
    }).catch(res => {
    	 console.log("res.code2 = ", res);
        that.dispatch(showDialog("", ERR_DESC[res.code] || res.desc));
    });
 }
  
  render() {
    let errors;
    const { getFieldProps, getFieldError } = this.props.form;
  	
    return (
            <div className="modifypwd">
                <BarTitle onBack={this.handleClickBack} title={Lang.user.password.changePassword} />
                <div className="modifypwd bodyer">
                    <div className="modifypwd box-change-password">
                        <input type={"password"} maxLength="20" onBlur={this.onAccountBlur} onFocus={this.onAccountFocus}
                               placeholder={Lang.user.password.oldPassword}
                               {...getFieldProps('passWord', {
                                   initialValue: "",
                                   rules: [
					                  {validator: (rule, value, callback, source, options) => {
					                    const errors = [];
					                    if(!value || value.length < 6 || value.length > 20 || !/[A-Z]+/.test(value) || !/^[0-9_a-zA-Z]+$/.test(value)|| !/[a-z]+/.test(value)|| !/[0-9]+/.test(value)){
					                      console.log(value)
					                      errors.push(Lang.user.validator[11]);
					                      callback(errors);
					                      return;
					                    }
					                  }}
					                ]
                               })}/>
                        {this.props.form.getFieldValue("passWord")  ? <a id="userName-clear-icon-id" className="clear-icon" href="javascript:;" onClick={() => this.props.form.setFieldsValue({passWord: ""})}></a> : ''}
                    </div>
                    <div className="modifypwd box-change-password2">
                        <input type={"password"} maxLength="20" onBlur={this.onPasswordBlur} onFocus={this.onPasswordFocus}
                               placeholder={Lang.user.password.newPassword}
                               {...getFieldProps('passWord2', {
                                   initialValue: "",
                                   rules: [
					                  {validator: (rule, value, callback, source, options) => {
					                    const errors = [];
					                    if(!value || value.length < 6 || value.length > 20 || !/[A-Z]+/.test(value) || !/^[0-9_a-zA-Z]+$/.test(value)|| !/[a-z]+/.test(value)|| !/[0-9]+/.test(value)){
					                      console.log(value)
					                      errors.push(Lang.user.validator[12]);
					                      callback(errors);
					                      return;
					                    }
					                  }}
					                ]
                               })}/>
                        {this.props.form.getFieldValue("passWord2")  ? <a  id="password-clear-icon-id" className="clear-icon" href="javascript:;" onClick={() => this.props.form.setFieldsValue({passWord2: ""})}></a> : ''}
                    </div>
                    <div className="modifypwd box-change-password3">
                        <input type={"password"} maxLength="20" onBlur={this.onPassword2Blur} onFocus={this.onPassword2Focus}
                               placeholder={Lang.user.password.newPwdAgain}
                               {...getFieldProps('passWord3', {
                                   initialValue: "",
                                   rules: [
					                  {validator: (rule, value, callback, source, options) => {
					                    const errors = [];
					                    if(this.props.form.getFieldValue('passWord2') != value || !value){
					                      console.log(value)
					                      errors.push(Lang.user.validator[2]);
					                      callback(errors);
					                      return;
					                    }
					                  }}
					                ]
                               })}/>
                        {this.props.form.getFieldValue("passWord3").length ? <a id="password2-clear-icon-id" className="clear-icon" href="javascript:;" onClick={() => this.props.form.setFieldsValue({passWord3: ""})} /> : ""}
                    </div>
                    <div className="modifypwd pwd-submit">
                        <button type="button" onClick={this.handleSubmit}>
                            {Lang.user.password.sumit}
                        </button>
                    </div>
                </div>
            </div>
    );
  }
}

export default connect()(createForm()(ChangePwd))