import React, {
	Component
} from 'react';
import helper from '../public/helper';
import SystemApi from '../jssdk/system';
import { Lang } from '../public';
import { connect } from 'react-redux';
import './default/style.css';
import SelectApWifi from '../component/selectApWiFi';
import Toast from 'antd-mobile/lib/toast';
import Device from '../jssdk/device';
import Cookies from 'universal-cookie';
import MQTTService, { TOPIC } from '../jssdk/MQTTService';

// 暂时先定义的假数据
let currentIp = "192.168.1.1";
let newSsid = "";
let currentMac = "E4:A3:B3:A4";
let currentDevId = "";

class SelectPlugApWifi extends Component {

	constructor(props) {
		super(props);
		
		this.state = {
			macNum: "",
		}
		this.cookies = new Cookies;
		this.device = new Device();
		this.systemApi = new SystemApi;
		this.handleClickBack = this.handleClickBack.bind(this);
		this.handleClickNext = this.handleClickNext.bind(this);
	}

	handleClickBack(event) {
		this.props.history.goBack();
	}

	componentWillMount() {
//		this.systemApi.onAppStatusChange(res => {
//			console.log("onAppStatusChange--------------" + res.state);
//			if(res.state == 0) {
//				this.systemApi.getWiFiSSID().then(res => {					
//					this.setState({
//						macNum: res.ssid.split('-')[3].toLocaleLowerCase() || ""
//					});
//				});
//			}
//		});
	}

	componentDidMount() {
		this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
		
		
		//Toast.loading("", 0, null, true);
//		this.device.devDisconnect({
//			timestamp: "2018-03-14 17:30:00",
//		});
//		MQTTService.disconnect({});

	}

	onSSIDChange(ssid) {
		newSsid = ssid;
		console.log("newSsid = " + newSsid);
	}

	componentWillUnmount() {

	}

	handleClickNext(event) {
		console.log("handleClickNext");
		let that = this;
		let rightSsid = "Ap-" + currentMac;
//		if(newSsid == rightSsid) {
//			console.log("网络正确，可以跳转到下一页");
//		}
		Toast.loading("", 0, null, true);
		var dataList = [];

		// 15秒超时
		setTimeout(() => {
			Toast.hide();
		}, 15000);
		
		this.device.devDiscoveryReq({
			ip: "255.255.255.255",
			port: "6666",
			payload: {
				timestamp: "2018-03-14 17:30:00",
			}
		}).then(res => {
			console.log("------devDiscoveryReq:" + res.payload.devId + "-" + res.payload.ip + "-" + res.payload.mac + "-" + res.payload.model);
			currentIp = res.payload.ip;
			currentMac = res.payload.mac;
			currentDevId = res.payload.devId;
			let gmtHours = new Date().getTimezoneOffset() / 60;
			
			let timeZone = "GMT";
			if(gmtHours < 0){
				timeZone = timeZone+"+" + Math.abs(Number(gmtHours));
			} else if(gmtHours > 0){
				timeZone = timeZone+"-" + Math.abs(Number(gmtHours));
			}
			
			//if(this.state.macNum && currentMac.toLocaleLowerCase().indexOf(this.state.macNum) > -1 ){
				console.log("开始绑定：",res.payload.ip)
				
				this.device.setBindInfoReq({
					ip: res.payload.ip,
					port: "6667",
					payload: {
						timeZone: timeZone,
						userId: this.cookies.get('userId'),
						timestamp: "2018-03-14 17:30:00",
					}
				}, 5000).then((res) => {
					console.log("setBindInfoResp=======", res);
					if(res.ack.code != 200) {
						throw res;
					}
					Toast.hide();
					//绑定设备成功之后跳转
					const path = {
						pathname: `/device/apAdding/sirenhub`,
						mac: currentMac,
						ssid: window.globalState.wifiAccount,
						ip: currentIp,
						passWord: window.globalState.wifiPassword,
						devId: currentDevId,
					};
					Toast.hide();
					that.props.history.push(path);
	//				const path = {
	//					pathname: `/device/selectWifi`,
	//					mac: currentMac,
	//					ip: currentIp,
	//					searchType: "AP"
	//				};
	//				
	//				that.props.history.push(path);
				}).catch(res => {
					console.log("setBindInfoResp Error----");
					console.log("err=",res);
				});
			//}
			
			
		}).catch(res => {
			console.log("discover device error-----");
		});
		
//		const path = {
//			pathname: `/device/searchByAp`,
//			mac: currentMac,
//			ssid: window.globalState.wifiAccount,
//			ip: currentIp,
//			passWord: window.globalState.wifiPassword,
//		};
//		that.props.history.push(path);
	}

	render() {
		return(
			<SelectApWifi OnBack={this.handleClickBack} onSSIDChange={this.onSSIDChange} title={Lang.ipc.connectAPWiFi.plugTitle} tips={Lang.ipc.connectAPWiFi.plugTips} onNext={this.handleClickNext} />
		);
	}
}

//将state绑定到props
const mapStateToProps = (state) => {
	return {

	}
};
//将action的所有方法绑定到props上
const mapDispatchToProps = (dispatch) => {
	return {

	}
};
export default connect(mapStateToProps, mapDispatchToProps)(SelectPlugApWifi);