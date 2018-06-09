import React, {
	Component
} from 'react';
import Device from '../jssdk/device';
import BarTitle from '../component/barTitle';
import ScrollView from '../component/scrollView';
import { showDialog } from '../action';
import helper from '../public/helper';
import SystemApi from '../jssdk/system';
import SmartLinkApi from '../jssdk/SmartLink';
import { Lang } from '../public';
import { connect } from 'react-redux';
import './default/style.css';
import { createForm } from 'rc-form';
import Toast from 'antd-mobile/lib/toast';

const dialogLang = Lang.public.dialog;
const deviceLang = Lang.device;

class SelectWifi extends Component {
	constructor(props) {
		super(props);
		console.log("search = ",this.props.location.searchType);
		this.state = {
			mac: this.props.location.mac || "",
			ip: this.props.location.ip || "",
			passWord: '',
			ssid: '',
			isSecret: true,
			searchType: this.props.location.searchType,
		};

		this.device = new Device;
		this.systemApi = new SystemApi;
		this.smartLinkApi = new SmartLinkApi;

		this.handleClickBack = this.handleClickBack.bind(this);
		this.handleChangeSecret = this.handleChangeSecret.bind(this);
		this.handleOnNext = this.handleOnNext.bind(this);
		this.handleChangeWifi = this.handleChangeWifi.bind(this);
	}

	handleClickBack(event) {
		this.props.history.goBack();
	}

	componentDidMount() {
		this.systemApi.offGoBack().onceGoBack(this.handleClickBack);

		this.systemApi.getWiFiSSID().then(res => {
			console.log("getWiFiSSID:" + res.ssid);
			this.setState({
				ssid: res.ssid
			});
			window.globalState.wifiAccount = res.ssid
		});
		
		this.systemApi.onAppStatusChange(res => {
			console.log("onAppStatusChange--------------" + res.state);
			if(res.state == 0) {
				this.systemApi.getWiFiSSID().then(res => {					
					this.setState({
						ssid: res.ssid
					});
				});
			}
		});

//		this.systemApi.onAppStatusChange(res => {
//			console.log("onAppStatusChange--------------" + res.state);
//			if(res.state == 0) {
//				this.systemApi.getWiFiSSID().then(res => {
//					console.log("getWiFiSSID:" + res.ssid);
//					console.log("this.state.ssid:" + this.state.ssid);
//					if(this.state.ssid != res.ssid) {
//						this.props.form.setFieldsValue({passWord: ''});
//					}
//					this.setState({
//						ssid: res.ssid
//					});
//				});
//			}
//		});
//
//		this.systemApi.onNetworkStatusChange(res => {
//			console.log("----onNetworkStatusChange:" + res.state);
//			this.systemApi.getWiFiSSID().then(res => {
//				console.log("2222222getWiFiSSID:" + res.ssid);
//				console.log("this.state.ssid:" + this.state.ssid);
//				if(this.state.ssid != res.ssid) {
//					this.props.form.setFieldsValue({passWord: ''});
//				}
//				
//				this.setState({
//					ssid: res.ssid
//				});
//			});
//		});
	}

	componentWillUnmount() {
		this.systemApi.offAppStatusChange(res => {
			console.log("onAppStatusChange--------------" + res.state);
			if(res.state == 0) {
				this.systemApi.getWiFiSSID().then(res => {					
					this.setState({
						ssid: res.ssid
					});
				});
			}
		});
	}

	handleOnNext(event) {
		let form = this.props.form;
		let formData = form.getFieldsValue();
		const passWord = formData.passWord;

		if(!passWord) {
			Toast.info("请输入Wifi密码");
			return;
		}
		console.log("ssid = " + this.state.ssid + ", password = " + passWord);
		window.globalState.wifiAccount = this.state.ssid;
		window.globalState.wifiPassword = passWord;
		
		if(this.state.searchType == "SmartLink") {
//			this.sendSmartLinkConfig({
//				ssid: this.state.ssid,
//				password: passWord
//			});
			
			const path = {
				pathname: `/device/apAdding/wifi_plug`,
				ssid:this.state.ssid,
				passWord:passWord
			};
			this.props.history.push(path);
		} else {
			const path = {
				ssid: this.state.ssid,
				passWord: passWord,
			};
			console.log("window.globalState.deviceType=",window.globalState.deviceType)
			//先写个if判断路由，后面再优化
			if(window.globalState.deviceType == 'sirenhub' || window.globalState.deviceType == 'gateway') {
				path.pathname = "/device/selectSirenhubWifi";
			}else if(window.globalState.deviceType == 'wifi_plug') {
				path.pathname = "/device/selectPlugApWifi";
			}
			this.props.history.push(path);
//			const path = {
//				pathname: `/device/searchByAp`,
//				mac: this.state.mac,
//				ssid: this.state.ssid,
//				ip: this.state.ip,
//				passWord: passWord
//			};
//			this.props.history.push(path);
		}
	}

//	sendSmartLinkConfig(data) {
//		Toast.loading("", 0, null, true);
//		this.smartLinkApi.config(data).then(res => {
//			if(res.code != 200) {
//				throw res;
//			}
//			console.log("----on config:", res);
//			Toast.hide();
//			const path = {
//				pathname: `/device/apAdding/wifi_plug`,
//				mac: res.data.mac,
//			};
//			this.props.history.push(path);
//		}).catch(res => {
//			Toast.hide();
//			this.props.history.push(`/device/plugAddFail`);
//		});
//	}

	handleChangeSecret(event) {
		this.setState({
			isSecret: !this.state.isSecret
		});
	}

	handleChangeWifi(event) {
		this.systemApi.gotoWiFiSetting();
	}

	render() {
		let switchPwdInput = (this.state.isSecret ? "password" : "text");
		let switchPwdIcon = (this.state.isSecret ? "close" : "open");
		const {
			getFieldProps,
			getFieldError
		} = this.props.form;

		return(
			<div className="set_wifi">
        <BarTitle onBack={this.handleClickBack} title={Lang.gateway.foudWifi.title} />
        <div className="wifi_icon_bg">
        	<div className="wifi_icon"></div>
        </div>
        
        <div className="box_div">
        	<div className="box-wifi-ssid" onClick={this.handleChangeWifi}>
        		<input value={this.state.ssid} readOnly="true"/>
        	</div>
        
        
        	<div className="box-password">
            <input id="loginPwdInput" type={switchPwdInput} maxLength="20" onKeyDown={this.onKeyDown} onBlur={this.onPasswordBlur} onFocus={this.onPasswordFocus}
              placeholder={Lang.device.setWifi.placeholder}
              {...getFieldProps('passWord', {
                onChange: this.handlePwdChange,
                initialValue: this.state.passWord,
                rules: [{required: true, message: Lang.user.validator[1]}]
              })}/>
            <a className={switchPwdIcon}  onClick={this.handleChangeSecret}></a>
            {this.props.form.getFieldValue('passWord').length ? <a id="password-clear-icon-id"className="clear-icon"  onClick={() => this.props.form.setFieldsValue({passWord: ''})}></a> : ''}
          </div>
          
          <button className ="nextBtn" onClick={this.handleOnNext}>Next</button>
        </div>
        
       
      </div>
		);
	}
}

//将state绑定到props
const mapStateToProps = (state) => {
	return {}
};
//将action的所有方法绑定到props上
const mapDispatchToProps = (dispatch) => {
	return {
		showDialog: (...args) => dispatch(showDialog(...args))
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(SelectWifi));