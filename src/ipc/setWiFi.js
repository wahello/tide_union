import React, {
	Component
} from 'react';
import './default/style.css';
import { Lang } from '../public/resource';
import NavigationBar from '../component/NavigationBar';
import { connect } from 'react-redux';
import SystemApi from '../jssdk/system';
import { createForm } from 'rc-form';
import Toast from 'antd-mobile/lib/toast';
import Device from '../jssdk/device';
import { bindActionCreators } from 'redux';
import {saveWifiSetting} from '../action/ipc';
let ssid;
let secret;
let deviceIp;
class SetWiFi extends Component {
	constructor(props) {
        super(props);
        ssid = this.props.wifi.ssid;
        secret=this.props.wifi.secret;
        deviceIp=this.props.wifi.ip;
        console.log("~~~~~~~~~~~~~~~~~~"+ssid);
        console.log("~~~~~~~~~~~~~~~~~~"+deviceIp);
		this.state = {
            userName: ssid,
            passWord: '',
            isSecret: true
		}
		this.systemApi = new SystemApi;
		this.handleClickBack = this.handleClickBack.bind(this);
        this.nextPage = this.nextPage.bind(this);

        this.handleChangeSecret = this.handleChangeSecret.bind(this);
        this.onAccountBlur=this.onAccountBlur.bind(this);
        this.onAccountFocus=this.onAccountFocus.bind(this);
        this.onPasswordBlur=this.onPasswordBlur.bind(this);
        this.onPasswordFocus=this.onPasswordFocus.bind(this);
        this.onKeyDown=this.onKeyDown.bind(this);
        this.device=new Device();
    };
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
        var input = document.getElementById("nameInput");
        if(input){
            if(input.readOnly){

            }else{
                var editNameIconId = document.getElementById("username-clear-icon-id");
                if(editNameIconId){
                    editNameIconId.style.visibility = "visible";
            }
        }
            
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
    handleChangeSecret(event) {
        console.log("handleChangeSecret");
    this.setState({isSecret: !this.state.isSecret});
    }
    
	nextPage(event) {
        console.log("next");
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
                Toast.info(Lang.ipc.setWiFi.emptySSID, 3, null, false);
                return;
            }
        if (!passWord) {
            console.log("passWord = " ,passWord);
                Toast.info(Lang.ipc.setWiFi.emptyPassword, 3, null, false);
                return;
            }
            
            // this.device.setWifiReq({
            //     ip:deviceIp,
            //     port:"6667",
            //     payload:{
            //         ssid:userName,
            //         password:passWord,
            //         secret:"WPA2",
            //         timestamp: "2018-03-14 17:30:00",     
            //     }
            // },20000).then((res) => {
            //     console.log("setWifiReq suc");
            // }).catch(res => {
            //     console.log("setWifiReq fail");
            // });
            let c=this.props.wifi;
            c.ssid=userName;
            c.secret="WPA2";
            c['passWord']=passWord;
            this.props.actions.saveWifiSetting(c);
            console.log("%%%%%%%%"+this.props.wifi.ssid+"-"+this.props.wifi.passWord+"-"+this.props.wifi.ip+"-"+this.props.wifi.deviceId);
            let a= { ssid: userName, password:passWord,secret: 'WPA2', ip:deviceIp};
            let path = {
             pathname: "/ipc/connectWifi",
             query: a
            }
            this.props.history.push(path);
	};
	handleClickBack(event) {
		this.props.history.goBack();
    };
    
	componentDidMount() {
        this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
        // 定死页面高度。
        let setWiFi =  document.getElementsByClassName("setWiFi")
        setWiFi[0].style.cssText = "height:" +　window.getComputedStyle(setWiFi[0])["height"] 
        if(this.state.userName.length!=0){
        var input = document.getElementById("nameInput");
        if(input){
            input.readOnly="true";
        }
        var editNameIconId = document.getElementById("username-clear-icon-id");
        if(editNameIconId){
            editNameIconId.style.visibility = "hidden";
         }
        }
    }
	render() {
        let switchPwdInput = (this.state.isSecret ? "password" : "text");
        let switchPwdIcon = (this.state.isSecret ? "close" : "open");
        const { getFieldProps, getFieldError } = this.props.form;
		return(
			<div className='setWiFi'>
                <NavigationBar onBack={this.handleClickBack} title={Lang.ipc.setWiFi.title} />
                <div className="imgparent">
                     <div className="imgBg">
                     <div className='tipImg'></div>
                </div>
                </div>
                <p className='tip'>{Lang.ipc.setWiFi.tips}</p>

                <div className="box-account">
            <input id="nameInput" type="text"  onBlur={this.onAccountBlur} onFocus={this.onAccountFocus}
              placeholder={Lang.ipc.setWiFi.placeholder[0]}
              {...getFieldProps('userName', {
                onChange: this.handleEmailChange,
                initialValue: this.state.userName, 
                // rules: [{required: true, type: 'email', message: Lang.user.validator[0]}]
              })}/>
            <div id="username-clear-icon-id" >
            {this.props.form.getFieldValue('userName').length ? <a  className="clear-icon"  onClick={() => this.props.form.setFieldsValue({userName: ''})}></a> : ''}
            </div>
          </div>
          <div className="box-password">
            <input id="loginPwdInput" type={switchPwdInput}  onKeyDown={this.onKeyDown} onBlur={this.onPasswordBlur} onFocus={this.onPasswordFocus}
           placeholder={Lang.ipc.setWiFi.placeholder[1]}
           {...getFieldProps('passWord', {
             onChange: this.handlePwdChange,
             initialValue: this.state.passWord,
            //  rules: [{required: true, message: Lang.user.validator[1]}]
           })}/>
            <a className={switchPwdIcon}  onClick={this.handleChangeSecret}></a>
            {this.props.form.getFieldValue('passWord').length ? <a id="password-clear-icon-id"className="clear-icon"  onClick={() => this.props.form.setFieldsValue({passWord: ''})}></a> : ''}
          </div>
                <p className='bottom-tip'>{Lang.ipc.setWiFi.bottomTips}</p>
                <button onClick={this.nextPage} className="step-next">{Lang.ipc.setWiFi.next}</button>
            </div>
		)
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		wifi:state.ipc.wifi
	}
}

const mapDispatchToProps = dispatch => {
	return {
		actions: bindActionCreators({
            saveWifiSetting
		}, dispatch),
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(createForm()(SetWiFi));