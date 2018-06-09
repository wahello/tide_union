import React, {
	Component
} from 'react';
import BarTitle from '../component/barTitle';
import { Lang } from '../public';
import { connect } from 'react-redux';
import Device from '../jssdk/device';
import SystemApi from '../jssdk/system';
import './default/style.css';
import { bindActionCreators } from 'redux';
import { fetchProductInfo } from '../action/home';
import { changeBackAction } from '../action';
import { saveDeviceItem, setRecordAttr } from '../action/device';
import { setDeviceMode } from '../action/device';
import ListView from 'antd-mobile/lib/list-view';
import Toast from 'antd-mobile/lib/toast';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
class RemoteDetail extends Component {
	constructor(props) {
		super(props);

		this.device = new Device();
		this.systemApi = new SystemApi;

		const {
			devId,
			deviceItems,
			fromPage,
			recordAttr
		} = this.props;

		const deviceItem = deviceItems[devId];
		let attr = {
			OnOff: 0
		}

		console.log("plug deviceItem = ", deviceItem);
		console.log("plug deviceItems = ", deviceItems);

		if(fromPage === 'list' || recordAttr.devId === '') {
			if(!deviceItem.online) {
				deviceItem.attr.OnOff = 0;
			}
			attr = deviceItem.attr;
		} else {
			attr = recordAttr.attr;
		}
		
		let devices = Object.values(deviceItems);
		let data = [];
		// 遍历设备列表，筛选出所有的非遥控器设备
		for(let i = 0; i < devices.length; i++) {
			let devType = devices[i].devType;
			
			// deviceType中包含Light的都是灯
			if(devType != undefined && devType.indexOf('remote') < 0) {
				data.push(devices[i]);
			}
		}
		
		
		this.state = {
			isOnline: deviceItem.online,
			OnOff: attr && attr.OnOff !== undefined ? (attr.OnOff - 0) : 0,
			hasCountDown: true,
			devId: devId,
			devType: deviceItem.devType,
			devices: data,
			groupDevices:{},
		}
		
		

		this.dataDetail = deviceItem;

		this.handleClickBack = this.handleClickBack.bind(this);
		this.handleClickSet = this.handleClickSet.bind(this);
		this.handGoToCountDown = this.handGoToCountDown.bind(this);
		this.handGoToSetCountDown = this.handGoToSetCountDown.bind(this);
		this.handleClickCheck = this.handleClickCheck.bind(this);
		this.handleChangeSecret = this.handleChangeSecret.bind(this);
//		this.handleChangeSwitch = this.handleChangeSwitch.bind(this);
	}
	handleChangeSecret(event) {
		this.setState({ isSecret: !this.state.isSecret });
	}
	handleClickCheck(item) {
		const {
			deviceItems,
			devId
		} = this.props;
		const { devices, editable } = this.state;
		const currentDevice = deviceItems[devId];
		if (!item.online) {
			const { showDialog } = this.props;
			showDialog (
				'',
				Lang.home.addRoom.dialog.offline[0], 
				[{
					text: Lang.public.dialog.button[1],
					className: "btn-split",
					handleClick: function () {
						this.hide();
					}
				}]
			);
			return;
		}

		const dvs = devices.filter((device) => {
			return device.checked;
		});
		if (dvs.length == 50) {
			Toast.info(Lang.home.addRoom.length, 2, null, false);
			return;
		}
		
		let groupDevices = this.state.groupDevices;
		
		if(groupDevices[item.devId]){
			console.log("wcb 把灯从遥控器中删除",item);
			this.device.delDeviceFromeGroup({devId:item.devId,groupId:currentDevice.remoteId});//
			this.device.deleteDeviceToGroupDb({devId:item.devId,groupId:currentDevice.remoteId});//
			
			delete groupDevices[item.devId];
			
			this.setState({
				groupDevices:groupDevices,
			});
		}else{
			console.log("wcb 添加灯到遥控器分组",item);
			this.device.addDeviceToGroup({devId:item.devId,groupId:currentDevice.remoteId});//
			this.device.addDeviceToGroupDb({devId:item.devId,groupId:currentDevice.remoteId})
			
			groupDevices[item.devId] = true;
			
			this.setState({
				groupDevices:groupDevices,
			});
		}
					
//		this.setState({
//			devices: this.state.devices.map(val => {
//				console.log("wcb item:",item);
//				if (val === item) {
//					console.log("wcb val:",val);
//					if(groupDevices[val.devId]){
//						console.log("wcb 把灯从遥控器中删除",val);
//						this.device.delDeviceFromeGroup({devId:val.devId,groupId:val.groupId});//
//						this.device.deleteDeviceToGroupDb({devId:val.devId,groupId:currentDevice.remoteId});//
//						
//						delete groupDevices[val.devId];
//						
//						this.setState({
//          				groupDevices:groupDevices,
//          			});
//					}else{
//						console.log("wcb 添加灯到遥控器分组",val);
//						this.device.addDeviceToGroup({devId:val.devId,groupId:val.groupId});//
//						this.device.addDeviceToGroupDb({devId:val.devId,groupId:currentDevice.remoteId})
//						
//						groupDevices[val.devId] = true;
//						
//						this.setState({
//          				groupDevices:groupDevices,
//          			});
//					}
//					
//					val.checked = !val.checked;
//				}
//				return val;
//			})
//		});
	}
	handGoToCountDown() {
//		this.props.history.push(`/device/countDown`);
	}

	handGoToSetCountDown() {
//		this.props.history.push(`/device/setCountDown`);
	}

	handleClickBack() {
		this.props.history.goBack();
	}

	handleClickSet() {
		this.props.actions.saveDeviceItem(this.dataDetail);
		if(this.dataDetail.attr){
			this.props.setDeviceMode(this.dataDetail.attr.Mode);
		}
		this.props.history.push(`/device/edit/${this.state.devId}`);
	}

//	handleChangeSwitch(value) {
//		const {
//			deviceItems,
//			devId
//		} = this.props;
//		const currentDevice = deviceItems[devId];
//		if(!currentDevice.online) {
//			return false;
//		}
//
//		this.setState({
//			OnOff: value
//		});
//
//		if(currentDevice.devType === 'Smartplug_Meter_Wifi') {
//			this.switchByWifi(currentDevice, value);
//		}else if(currentDevice.communicationMode == "BLE"){
//			console.log("wcb 群控分组：",currentDevice);
//			if(value == 1){
//				console.log("wcb 群控分组value：",value);
//				this.device.turnGroupOn({remoteId:currentDevice.remoteId});//开
//	    	}else if(value == 0){
//	    		console.log("wcb 群控分组value：",value);
//				this.device.turnGroupOff({remoteId:currentDevice.remoteId});//关
//	    	}
//		}
//	}

	switchByWifi(currentDevice, value) {
		let that = this;
		this.device.setDevAttrReq({
			parentId: currentDevice.parentId,
			payload: {
				devId: currentDevice.devId,
				attr: {
					"OnOff": 0 + value
				}
			}
		}).then(res => {
			console.log("OnOff回传：", res);
			if(res && res.ack && res.ack.code == 200) {} else {
				that.setState({
					OnOff: !that.state.OnOff
				});
			}
		}).catch(res => {
			that.setState({
				OnOff: !that.state.OnOff
			});
		});
	}

	componentDidMount() {
		this.systemApi.offGoBack().onceGoBack(this.handleClickBack);

		const {
			deviceItems,
			devId
		} = this.props;
		const currentDevice = deviceItems[devId];
		// 1、获取遥控器的分组ID  2、写删除遥控器下设备
		let remoteGroupId = 1;
		this.device.getGroupDevList({groupId:currentDevice.remoteId}).then(res => {
			console.log("getGroupDevList res = ", res);
			if(res && res.ack && res.ack.code == 200) {
				let groupDevices = {};
				res.payload.data.map((item) => {
					groupDevices[item.device_id] = true;
            	});
            	
            	this.setState({
            		groupDevices:groupDevices,
            	});
            	console.log("groupDevices = ", groupDevices);
			} 
		}).catch(res => {
		});
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.receivePushMessage) {
			if(nextProps.receivePushMessage.method !== null) {
				// 上报电量信息
				if(nextProps.receivePushMessage.method === 'updateEnergyReq') {

				} else if(nextProps.receivePushMessage.method === 'updateRuntimeReq') { // 上报运行时间

				}
			}
		}
	}

	getTime(value) {
		let theTime = parseInt(value); // 秒
		let theTime1 = 0; // 分
		let theTime2 = 0; // 小时
		if(theTime >= 60) {
			theTime1 = parseInt(theTime / 60);
			theTime = parseInt(theTime % 60);
			if(theTime1 >= 60) {
				theTime2 = parseInt(theTime1 / 60);
				theTime1 = parseInt(theTime1 % 60);
			}
		}

		let result = "";
		console.log("theTime = ", theTime);
		if(theTime1 > 0) {
			if((parseInt(theTime1) + 1) < 10) {
				result = "0" + (parseInt(theTime1) + 1);
			} else {
				result = "" + (parseInt(theTime1) + 1);
			}
		} else {
			if(theTime <= 0) {
				result = "00";
			} else {
				result = "01";
			}

		}

		if(theTime2 > 0) {
			result = "" + parseInt(theTime2) + "." + result;
		} else {
			result = "0." + result;
		}

		console.log("result = ", result);
		return result;
	}

	render() {
		const {
			fromPage,
			deviceItems,
			devId
		} = this.props;
		const currentDevice = deviceItems[devId];
		let iconState = !this.state.OnOff ? ' off' : '';
		let btnState = !this.state.OnOff ? ' off' : '';
		let checkboxIcon = (this.state.isSecret ? "close" : "open");
		const { devices, isEdit, editable, icon } = this.state;
		let dataSource = ds.cloneWithRows(devices);
		let row = (device, sid, rid) => {
			return <div className="list-item" key={rid} >
				<div className="space-account">
					<span className={`devices-icon ${device.icon} on ${device.online ? '' : 'offline'}`}></span>
					<b>{device.name}</b>
					<p>{`${device.checked ? 'Added' : 'Default Room'}`}</p>
					<a className={this.state.groupDevices[device.devId] ? "open" : "close"} href="javascript:;" onClick={e => this.handleClickCheck(device)}></a>
				</div>

			</div>
		};
		const renderDeviceList = (() => {
			console.log("device length = " ,devices.length);
			if (!devices.length) {
				return <div className="empty-device-tip">
					<p>You don't have any device yet!</p>
					<p>Please add first</p>
				</div>
			}
			return <ListView
				style={{ height: "calc(40vh - 1.16rem - 64px)" }}
				useBodyScroll={false}
				dataSource={dataSource}
				renderRow={row}
			/>;
		})
		
		return(
			<div className="device remoteDetail">
				<BarTitle onBack={this.handleClickBack} title={currentDevice.name} onDone={null} >
		        	<a className="set-btn" onClick={this.handleClickSet}></a>
		        </BarTitle>
		        <div className="bodyer">
		        	<div className='plug_icon_div'>
			        	<div className={'plug_icon_bg' + iconState}></div>
				        <div className={'plug-icon' + iconState} >
		                </div>
		        	</div>
		        	<div className="remote_tittle">{Lang.device.remoteTitle}</div>
		        	<div className="container">
		            	<div className="space-list">
							{
								renderDeviceList()
							}
						</div>
		        	</div>
		        	
		        	
		        	
		        </div>
			</div>
		)
	}
}

//将state绑定到props
const mapStateToProps = (state) => {
	const devId = (state.device.fromPage === 'list' || state.device.recordAttr.devId === '') ? state.device.deviceItem.devId : state.device.recordAttr.devId;
	console.log("plug DevId = " + devId);
	return {
		recordAttr: state.device.recordAttr,
		devId: devId,
		deviceItems: state.device.items,
		fromPage: state.device.fromPage,
	}
};

//将action的所有方法绑定到props上
const mapDispatchToProps = dispatch => ({
	changeBackAction: (...args) => dispatch(changeBackAction(...args)),
	actions: bindActionCreators({
		fetchProductInfo,
		saveDeviceItem,
		setRecordAttr,
	}, dispatch),
	setDeviceMode: (...args) => dispatch(setDeviceMode(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RemoteDetail);