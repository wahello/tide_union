import React, { Component } from 'react';
import Device from '../jssdk/device';
import BarTitle from '../component/barTitle';
import ScrollView from '../component/scrollView';
import { showDialog } from '../action';
import helper from '../public/helper';
import SystemApi from '../jssdk/system';
import { Lang } from '../public';
import { connect } from 'react-redux';
import { Route, Link, Switch } from 'react-router-dom';
import { Toast} from 'antd-mobile';
import './default/style.css';
import './default/style2.css';
import MQTTService, { TOPIC } from '../jssdk/MQTTService';
import { bindActionCreators } from 'redux';

const dialogLang = Lang.public.dialog;
const deviceLang = Lang.device;

class DeviceAddFlow extends Component {
	constructor(props) {
		super(props)
		this.state = {};
		this.goNext = this.goNext.bind(this);
		this.handleClickBack = this.handleClickBack.bind(this);
		this.detectionHowManyIPC = this.detectionHowManyIPC.bind(this);
		this.handleClickSearchType = this.handleClickSearchType.bind(this);
		this.systemApi = new SystemApi;
		this.deviceApi = new Device;
	
	}

	handleClickBack(event) {
			this.props.history.goBack();
		
	}
	goNext(path){
//		if(path.indexOf("SL") >= 0){
//			MQTTService.devDisconnect({});
//		}else if(path.indexOf("noGateWay") >= 0){
//			MQTTService.devConnect({});
//		} else{
//			typeof path  === "string" ? this.props.history.push(path) :path();
//		}
		
		typeof path  === "string" ? this.props.history.push(path) :path();
	}
	handleClickSearchType(event, path){
		if(path == "/device/BLEDeviceAdd" ||
		   path == "/device/plugAdd1/BLEplug" ||
		   path == "/device/remoteAdd1"){
			let that = this;
			this.deviceApi.getBuleToothStatus().then(res=>{
				if(res.status == 0){
					const {actions}=that.props;
					actions.showDialog(Lang.device.bleDevice.openBlueToothTitle,Lang.device.bleDevice.openBlueToothTip, [
					{
						text: Lang.device.bleDevice.tipButton[0],
						handleClick: function () {
							this.hide();
						}
					},{
						text: Lang.device.bleDevice.tipButton[1],
						handleClick: function () {
							that.deviceApi.openBuletoothSetting();
							this.hide();
						}
					}]);
				}else{
					that.props.history.push(path);
				}
			});
		} else {
			typeof path  === "string" ? this.props.history.push(path) :path();
		}
	}
  componentDidMount() {
    this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
    console.log("#### :" + navigator.userAgent);
    // TODO: 这个代码只是取网关id，具体请放到响应的代码中
    const { directDevIds } = this.props;
	    if(directDevIds.gateway){
	    	if (!directDevIds.gateway.length) {
	      console.log("------");
	    } else {
	      console.log("======" + directDevIds);
			}
	    }
	}
	
  detectionHowManyIPC(){
    let deviceItems = this.props.deviceItems;
    let keyArr = Object.keys(deviceItems);
    return (keyArr.filter(item=>{
      return deviceItems[item].devType === "IPC"
    }).length > 16)
  }

	detectionHowManyGateway() {
		let deviceItems = this.props.deviceItems;
		let keyArr = Object.keys(deviceItems);
    return (keyArr.filter(item=>{
      return deviceItems[item].devType === "Siren_Hub" || deviceItems[item].devType === "Multi_Gateway"
    }).length)
	}

	
	render() {
		let that = this;
		let dataListFlow = [
			{
			type: Lang.device.addFlow.typeGateway,
			children: [{
				"flowIcon": "gateway",
				"flowName": Lang.device.addFlow.gateway,
				"link": this.detectionHowManyGateway()?
				function(){
					const {actions}=that.props;
					actions.showDialog(Lang.device.addFlow.moreGatewayTips,null, [{
						text: 'OK,got it.',
						handleClick: function cancel() {
							this.hide();
						},
					}]);
				} : "/gateway/addApGateway1",
				'gatewayID': this.props.directDevIds.gateway,
				'noGateWay': '/gateway/addApGateway1'
			},{
				"flowIcon": "gateway2",
				"flowName": Lang.device.addFlow.sirenHub,
				"link": this.detectionHowManyGateway()?
				function(){
					const {actions}=that.props;
					actions.showDialog(Lang.device.addFlow.moreGatewayTips,null, [{
						text: 'OK,got it.',
						handleClick: function cancel() {
							this.hide();
						},
					}]);
				} : "/device/sirenHubAdd1",
				'gatewayID': this.props.directDevIds.gateway,
				'noGateWay': '/device/sirenHubAdd1'
			}]
		}, {
			type: Lang.device.addFlow.typeLighting,
			children: [{
				"flowIcon": "zigbee_lighting",
				"flowName": Lang.device.addFlow.zigbeeBulb,
				"link": "/device/lightAdd",
				'gatewayID': this.props.directDevIds.gateway,
				'noGateWay': '/gateway/noGateWay'
			}
		]
		}, {
			type: Lang.device.addFlow.typeSensorsSecurity,
			children: [{
				"flowIcon": "motion1",
				"flowName": Lang.device.addFlow.motionSensor,
				"link": "/device/motionAdd1",
				'gatewayID': this.props.directDevIds.gateway?this.props.directDevIds.gateway.length:0,
				'noGateWay': '/gateway/noGateWay'
			}, {
				"flowIcon": "door_lock",
				"flowName": Lang.device.addFlow.doorSensor,
				"link": "/device/doorAdd1",
				'gatewayID': this.props.directDevIds.gateway?this.props.directDevIds.gateway.length:0,
				'noGateWay': '/gateway/noGateWay'
			},{
				"flowIcon": "siren",
				"flowName": Lang.device.addFlow.siren,
				"link": "/device/sirenAdd1",
				'gatewayID': this.props.directDevIds.gateway?this.props.directDevIds.gateway.length:0,
				'noGateWay': '/gateway/noGateWay'
			}, {
				"flowIcon": "keypad",
				"flowName": Lang.device.addFlow.keypad,
				"link": "/device/keypadAdd",
				'gatewayID': this.props.directDevIds.gateway?this.props.directDevIds.gateway.length:0,
				'noGateWay': '/gateway/noGateWay'
			}, {
				"flowIcon": "keyfob",
				"flowName": Lang.device.addFlow.keyfob,
				"link": "/device/keyfobAdd",
				'gatewayID': this.props.directDevIds.gateway?this.props.directDevIds.gateway.length:0,
				'noGateWay': '/gateway/noGateWay'
			}]
		}, {
			type: Lang.device.addFlow.typeControl,
			children: [
			//暂不支持 BLE是Location版，不支持带云的功能
//			{
//				"flowIcon": "remote1",
//				"flowName": Lang.device.addFlow.remote,
//				"link": "/device/remoteAdd",
//				'gatewayID': this.props.directDevIds.gateway,
//				'noGateWay': '/device/remoteAdd'
//			},
			{
				"flowIcon": "wifi_plug",
				"flowName": Lang.device.addFlow.wifiPlug,
				"link": "/device/wifiPlugSLGuide",
				'gatewayID': this.props.directDevIds.gateway,
				'noGateWay': '/device/wifiPlugSLGuide'
			}]
		}, {
			type: Lang.device.addFlow.typeCamera,
			children: [{
				"flowIcon": "camera",
				"flowName": Lang.device.addFlow.camera,
				// Toast.info(Lang.ipc.addCamera.cameraOver)
				"link":  this.detectionHowManyIPC() ? function(){Toast.info(Lang.ipc.addCamera.cameraOver)} :"/ipc/addCamera",
				'noGateWay': '/ipc/addCamera'
			}]
		},
		{
			type: Lang.device.addFlow.securityKit,
			children: [{
				"flowIcon": "security-kit",
				"flowName": Lang.device.addFlow.securityKit,
				"link": this.detectionHowManyGateway()?
				function(){
					const {actions}=that.props;
					actions.showDialog(Lang.device.addFlow.moreGatewayTips,null, [{
						text: 'OK,got it.',
						handleClick: function cancel() {
							this.hide();
						},
					}]);
				} : "/device/sirenHubAdd1",
				"gatewayID": this.props.directDevIds.gateway,
				"noGateWay": "/device/sirenHubAdd1"
			}]
		}
		];

		//临时处理，local模式只显示蓝牙设备
		if(window.globalState.isLocal == 1){
			dataListFlow = [
				{
					type: Lang.device.addFlow.typeLighting,
					children: [{
						"flowIcon": "lighting",
						"flowName": Lang.device.addFlow.BLElightBulb,
						"link": "/device/BLEDeviceAdd",
						"gatewayID": "",
						"noGateWay": "/device/BLEDeviceAdd"
					}]
				},{
					type: Lang.device.addFlow.typeControl,
					children: [{
						"flowIcon": "plug",
						"flowName": Lang.device.addFlow.BLEPlug,
						"link": "/device/plugAdd1/BLEplug",
						"gatewayID": "",
						"noGateWay": "/device/plugAdd1/BLEplug"
					},{
						"flowIcon": "remote",
						"flowName": Lang.device.addFlow.remote,
						"link": "/device/remoteAdd1",
						'gatewayID': "",
						'noGateWay': '/device/remoteAdd1'
					}]
				}
			];
		}

		let Component = function (props) {
			const { children, end, that } = props;
			let len = children.length;
			let eles = [];
			for (let i = 0; i < Math.ceil(len / 3); i++) {
				eles.push(
					<tr key={i}>
						{(() => {
							let elesSub = [];
							for (let j = 0; j < 3; j++) {
								let indexSub = i * 3 + j;
								let itemSub = children[indexSub];
								if (indexSub >= len) {
									elesSub.push(
										<td key={j} style={{borderRight:"0 none"}}>&nbsp;</td>
									)
								} else {
									elesSub.push(
										<td key={j} style={end ? { borderBottom: "solid 0.04rem #4E5367" } : {}}>
											{/* <Link to={itemSub.gatewayID == '' ? itemSub.noGateWay : itemSub.link}>  */}
											<a onClick={e=>that.handleClickSearchType(e,itemSub.gatewayID == '' ? itemSub.noGateWay : itemSub.link)}>
												<div className={"flow-icon " + itemSub.flowIcon + " white"}></div>
												<div className="flow-name">{itemSub.flowName}</div>
											</a>
											{/* </Link> */}
										</td>
									)
								}
							}
							return elesSub;
						})()}
					</tr>
				)
			}
			return (
				<table border="0" cellPadding="0" cellSpacing="0">
					<tbody>{eles}</tbody>
				</table>
			);
		}

		return (
			<div className="device add-flow">
				<BarTitle onBack={this.handleClickBack} title={Lang.device.addFlow.title} />
				<ScrollView>
					<ul className="flow-list">
						{dataListFlow.map((item, index) =>
							<li className="flow-item" key={item.type.toString()}>
								<div className="flow-type">{item.type}</div>
								<div className="flow-children">
									<Component children={item.children} that={this} end={index == dataListFlow.length - 1 ? true : false} />
								</div>
							</li>
						)}
					</ul>
				</ScrollView>
			</div>
		);
	}
}

//将state绑定到props
const mapStateToProps = (state) => {
  return {
		directDevIds: state.device.directDevIds || {},
		deviceItems: state.device.items
  }
};
//将action的所有方法绑定到props上
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
			showDialog,
		},
		dispatch,
	),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeviceAddFlow);
