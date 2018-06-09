//import React, { Component } from 'react';
//import { connect } from 'react-redux';
//import BarTitle from '../component/barTitle';
//import SystemApi from '../jssdk/system';
//import { createForm } from 'rc-form';
//import { showDialog, selectTab } from '../action';
//import Cookies from 'universal-cookie';
//import helper from '../public/helper';
//import { Link } from 'react-router-dom';
//import Toast from 'antd-mobile/lib/toast';
//import 'antd-mobile/lib/toast/style/css';
//import userApi from "../jssdk/User";
//import { Lang } from '../public';
//
//import {  
//AppRegistry,  
//Text,  
//View,  
//Modal,  
//TouchableOpacity,  
//TouchableHighlight,  
//StyleSheet,  
//} from 'react-native';  
//var Dimensions = require('Dimensions');  
//var {height,width} = Dimensions.get('window'); 
//
//const ERR_DESC = {
//21004: Lang.user.password.error,
//21047: Lang.user.validator[8],
//400: Lang.user.validator[14],
//1003: Lang.user.validator[14],
//'-1000':Lang.user.login.timeout,
//}
//
//class ModifyPwd extends Component {
//  cookies = new Cookies();
//
//constructor(props) {
//	super(props);
//  this.state = {
//    version: '0.0.2',
//    
//    showModal:true,  
//    inputPwd:"",  
//    msg:"请输入密码",  
//    locked:true,  
//  };
//  const { dispatch } = props;
//  this.dispatch = dispatch;
//  this.systemApi = new SystemApi;
//  
//  this.handleClickBack = this.handleClickBack.bind(this);
//  this.handleClickLI = this.handleClickLI.bind(this);
//  this.handleSubmit = this.handleSubmit.bind(this);
// 
//  this.onAccountBlur=this.onAccountBlur.bind(this);
//  this.onAccountFocus=this.onAccountFocus.bind(this);
//  this.onPasswordBlur=this.onPasswordBlur.bind(this);
//  this.onPasswordFocus=this.onPasswordFocus.bind(this);
//  this.onPassword2Blur=this.onPassword2Blur.bind(this);
//  this.onPassword2Focus=this.onPassword2Focus.bind(this);
//}
//
//onAccountBlur(event){
//	console.log("onAccountBlur",event);
//	setTimeout(() => {
//			var editNameIconId = document.getElementById("userName-clear-icon-id");
//	if(editNameIconId){
//		editNameIconId.style.visibility = "hidden";
//			}
//          }, 100);
//		
//	}
//onAccountFocus(event){
//	console.log("onAccountFocus");
//	var editNameIconId = document.getElementById("userName-clear-icon-id");
//	if(editNameIconId){
//		editNameIconId.style.visibility = "visible";
//	}
//}
//onPasswordBlur(event){
//	console.log("onPasswordBlur");
//	setTimeout(() => {
//			var editPasswordIconId = document.getElementById("password-clear-icon-id");
//		if(editPasswordIconId){
//			editPasswordIconId.style.visibility = "hidden";
//		}
//          }, 100);
//	}
//onPasswordFocus(event){
//		console.log("onPasswordFocus");
//		var editPasswordIconId = document.getElementById("password-clear-icon-id");
//		if(editPasswordIconId){
//			editPasswordIconId.style.visibility = "visible";
//		}
//		
//}
//onPassword2Blur(event){
//	console.log("onPasswordBlur");
//	setTimeout(() => {
//			var editPassword2IconId = document.getElementById("password2-clear-icon-id");
//		if(editPassword2IconId){
//			editPassword2IconId.style.visibility = "hidden";
//		}
//          }, 100);
//	}
//onPassword2Focus(event){
//	console.log("onPasswordFocus");
//	var editPassword2IconId = document.getElementById("password2-clear-icon-id");
//	if(editPassword2IconId){
//		editPassword2IconId.style.visibility = "visible";
//	}	
//}
//	
//handleClickBack(event){
//	this.props.history.goBack();
//}
//
//handleClickLI(event){
//	this.dispatch(showDialog(Lang.public.dialog.title[0], Lang.setting.about.dialog.fail.desc));
//}
//
//handleSubmit(event) {
//  let that = this;
//  let form = this.props.form;
//  let hasError = false;
//
//  event.currentTarget.focus();
//	if(!window.system.networkStatus) {
//    Toast.info(Lang.user.validator[14], 2, null, false);
//    return;
//  }
//  form.validateFields();
//  if(form.getFieldError('passWord')){
//  	console.log("1");
//      Toast.info(form.getFieldError('passWord')[0], 2, null, false);
//      return;
//  }
//
//  if(form.getFieldError('passWord2')){
//  	console.log("2");
//      Toast.info(form.getFieldError('passWord2')[0], 2, null, false);
//      return;
//  }
//
//  if(form.getFieldError('passWord3')){
//  	console.log("3");
//      Toast.info(form.getFieldError('passWord3')[0], 2, null, false);
//      return;
//  }
//
//  var parameter = {
//      userId:this.cookies.get('userId'),
//      tenantId: '00001',
//      oldPassword: helper.md5(form.getFieldsValue().passWord),
//      newPassword: helper.md5(form.getFieldsValue().passWord3)
//  };
//
//  userApi.changePwd(parameter).then(res => {
//      if(res.code != 200){
//      	 console.log("res.code = ", res);
//          throw res;
//      }
//      that.dispatch(showDialog(Lang.user.password.title, Lang.user.password.success, [
//          {
//              text: Lang.public.dialog.button[1],
//              className: "btn-split",
//              handleClick: function(){
//                  this.hide();
//                  let cookie = new Cookies;
//                  let expires = new Date;
//                  cookie.set('password', parameter.newPassword, {expires});
//                 	that.props.history.goBack();
//              }
//          }]));
//  }).catch(res => {
//  	 console.log("res.code2 = ", res);
//      that.dispatch(showDialog("", ERR_DESC[res.code] || res.desc));
//  });
// }
//
//render() {
//  let errors;
//  const { getFieldProps, getFieldError } = this.props.form;
//	
//  return (
//      <div className="modifypwd">
//          <BarTitle onBack={this.handleClickBack} title={Lang.user.password.changePassword} />
//          <div className="modifypwd bodyer">
//            <View style={{flex:1,backgroundColor:'white'}}>  
//		        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>  
//		          {this.renderView()}  
//		        </View>  
//		        <Modal visible={this.state.showModal}   
//		          transparent={true}  
//		          animationType='fade'   
//		          onRequestClose={() => {}}  
//		          style={{flex:1}}  
//		          ref="pwdmodal"  
//		          >  
//		          <View style={{flex:1,justifyContent:'center',alignItems:'center',  
//		             
//		            backgroundColor:'#2A3740',paddingLeft:30,paddingRight:30}}>  
//		            <View style={{justifyContent:'center',alignItems:'center',marginTop:20}}>  
//		              <Text style={{fontSize:16,color:'#fff'}}>{this.state.msg}</Text>  
//		            </View>  
//		            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',height:60}}>  
//		              {this.renderPwd()}  
//		            </View>  
//		            <View style={{width:width-60,}}>  
////		              <View style={styles.row}>  
////		                <NumComp num="1" pressNum={()=>this.pressNum(1)}/>  
////		                <NumComp num="2" pressNum={()=>this.pressNum(2)}/>  
////		                <NumComp num="3" pressNum={()=>this.pressNum(3)}/>  
////		              </View>  
////		              <View style={styles.row}>  
////		                <NumComp num="4" pressNum={()=>this.pressNum(4)}/>  
////		                <NumComp num="5" pressNum={()=>this.pressNum(5)}/>  
////		                <NumComp num="6" pressNum={()=>this.pressNum(6)}/>  
////		              </View>  
////		              <View style={styles.row}>  
////		                <NumComp num="7" pressNum={()=>this.pressNum(7)}/>  
////		                <NumComp num="8" pressNum={()=>this.pressNum(8)}/>  
////		                <NumComp num="9" pressNum={()=>this.pressNum(9)}/>  
////		              </View>  
////		              <View style={styles.row}>  
////		                <NumComp num="取消" textStyle={{fontSize:16}} style={{borderWidth:0}} pressNum={()=>this.cancel()}/>  
////		                <NumComp num="0" pressNum={()=>this.pressNum(0)}/>  
////		                <NumComp num="删除" textStyle={{fontSize:16}} style={{borderWidth:0}} pressNum={()=>this.deleteNum()}/>  
////		              </View>  
//		            </View>  
//		          </View>  
//		        </Modal>  
//		      </View>  
//          </div>
//      </div>
//  );
//}
//}
//
//export default connect()(createForm()(ModifyPwd))