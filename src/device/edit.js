import React, {
	Component
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Toast } from 'antd-mobile';
import 'antd-mobile/lib/toast/style/css';
import Cookies from 'universal-cookie';
import BarTitle from '../component/barTitle';
import { Lang } from '../public';
import SystemApi from '../jssdk/system';
import Device from '../jssdk/device';
import { showDialog, changeFromPage } from '../action';
import { saveDeviceItem, setEditingName, shouldUpdateDeviceList } from '../action/device';
import './default/edit.css';
import ScrollView from '../component/scrollView';
import OTA from '../jssdk/ota';
import { getVersionList } from '../action/ota';

const dialogLang = Lang.public.dialog;
const deviceLang = Lang.device;
const cookies = new Cookies();
class DeviceEdit extends Component {
	constructor(props) {
		super(props);

		this.device = new Device();
		this.systemApi = new SystemApi();
		this.ota = new OTA();

		const {
			device,
			editingName
		} = this.props;
		this.state = {
			name: editingName || (device ? (device.name || '') : ''),
			version: '',
			securityStatus: -1,
			devId: this.props.match.params.devId || ''
		};

		this.onBack = this.onBack.bind(this);
		this.onSave = this.onSave.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onSelectRoom = this.onSelectRoom.bind(this);
		this.onRecord = this.onRecord.bind(this);
		this.onReset = this.onReset.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onSelectMode = this.onSelectMode.bind(this);
		this.onDeviceUpdate = this.onDeviceUpdate.bind(this);
		this.onMoreAbout = this.onMoreAbout.bind(this);
	}

	componentDidMount() {
		this.systemApi.offGoBack().onceGoBack(this.onBack);
		this.fetchDeviceVersion();
	}

	componentWillMount() {

	}
	
	componentWillUnmount() {

	}
	
	componentWillReceiveProps(nextProps) {
		const { updateVersionNotifyList,actions } = nextProps;
		let that = this;
		let devId = this.state.devId;
		if(updateVersionNotifyList){
			for(var i=0;i<updateVersionNotifyList.length;i++){
				if(updateVersionNotifyList[i].devId == devId){
					actions.showDialog(`${Lang.ota.newVersionTip[0]}${updateVersionNotifyList[i].version} ${Lang.ota.newVersionTip[1]}`, null, [{
						text: dialogLang.button[0],
						handleClick: function onHandle() {
							this.hide();
						},
					}, {
						text: dialogLang.button[4],
						className: 'btn-split',
						handleClick: function onHandle() {
							this.hide();
							const path = {
								pathname: `/device/deviceUpdate`,
								devId: devId,
							};
							that.props.history.push(path);
						},
					}, ]);
				}
			}
		}
	}
	
	handleUpdateNotify() {
		let that = this;
		let devId = this.state.devId;
		let { updateVersionNotifyList,actions } = this.props;
		if(updateVersionNotifyList){
			for(var i=0;i<updateVersionNotifyList.length;i++){
				if(updateVersionNotifyList[i].devId == devId){
					actions.showDialog(`${Lang.ota.newVersionTip[0]}${updateVersionNotifyList[i].version} ${Lang.ota.newVersionTip[1]}`, null, [{
						text: dialogLang.button[0],
						handleClick: function onHandle() {
							this.hide();
						},
					}, {
						text: dialogLang.button[4],
						className: 'btn-split',
						handleClick: function onHandle() {
							this.hide();
							const path = {
								pathname: `/device/deviceUpdate`,
								devId: devId,
							};
							that.props.history.push(path);
						},
					}, ]);
				}
			}
		}
	}
	
	fetchDeviceVersion() {		
		const { device,actions } = this.props;

		if (!device) {
			this.props.history.replace('/home');
			return;
		}

		let that = this;
		this.ota.fetchVersionList({
			payload: {
				devId: [this.state.devId] || "",
				productId: device.productId || "",
				devType: device.devType || "",
				homeId: device.homeId || "",
			},
			userId: cookies.get("userId"),
			device: device
		}).then(res => {
			console.log("查询到版本列表：",res);
			let verList = res.payload.verList || [{
	  		oldVersion: "V.old",
	  		newVersion: "V.new",
	  	}];
			this.props.getVersionList(verList);
			if (verList.length == 1) {
				if(verList[0].stage == 0){
					that.setState({
						version: (verList[0].newVersion && verList[0].oldVersion!=verList[0].newVersion)?"new":('V'+verList[0].oldVersion),
					});
				}else if(verList[0].stage == 5){
					that.setState({
						version: ('V'+verList[0].newVersion),
					});
				}
				
				if(verList[0].newVersion && verList[0].oldVersion!=verList[0].newVersion && verList[0].stage == 0 ){
					actions.showDialog(`${Lang.ota.newVersionTip[0]}${verList[0].newVersion} ${Lang.ota.newVersionTip[1]}`, null, [{
						text: dialogLang.button[0],
						handleClick: function onHandle() {
							this.hide();
						},
					}, {
						text: dialogLang.button[4],
						className: 'btn-split',
						handleClick: function onHandle() {
							this.hide();
							const path = {
								pathname: `/device/deviceUpdate`,
								devId: that.state.devId,
							};
							that.props.history.push(path);
						},
					}, ]);
				}
			}	
		}).catch(err => {
			console.log("-----------fetchlist error------------");
			console.log("err=", err)
			
		});
	}

	onBack() {
		const {
			name
		} = this.state;

		const {
			device,
			actions
		} = this.props;

		actions.changeFromPage('list');

		if (!device) {
			this.props.history.replace('/home');
			return;
		}

		if(device.name === name) {
			this.resetData();
			this.props.history.goBack();
			return;
		}

		//存在修改，点击返回时，直接保存
		this.onSave();
		/*const that = this;
		actions.showDialog(deviceLang.saveChangeConfirm, null, [{
			text: dialogLang.button[0],
			handleClick: function onHandle() {
				this.hide();
				that.resetData();
				that.props.history.goBack();
			},
		}, {
			text: dialogLang.button[1],
			className: 'btn-split',
			handleClick: function onHandle() {
				this.hide();
				that.onSave();
			},
		}, ]);*/
	}

	onSave() {
		const {
			device,
			actions
		} = this.props;

		const {
			name
		} = this.state;

		if (!device) {
			this.props.history.replace('/home');
			return;
		}

		if(!name.trim()) {
			Toast.info(Lang.device.edit.validator[0]);
			return;
		}

		if(name.trim().length > 20) {
			Toast.info(Lang.device.edit.validator[2]);
			return;
		}

		const cookies = new Cookies();
		Toast.loading(Lang.public.loading);
		this.device.setDevInfoReq({
			parentId: device.parentId?device.parentId:device.devId,
			payload: {
				devId: device.devId,
				userId: cookies.get('userId'),
				name: name.trim(),
				icon: device.icon,
				homeId: device.homeId,
				roomId: device.roomId,
			},
		}).then((res) => {
			Toast.hide();
			if(res.ack && (res.ack.code - 0) === 200) {
				actions.shouldUpdateDeviceList();
				actions.changeFromPage('list');
				this.resetData();
				this.props.history.goBack();
			} else {
				const msg = res.ack ? res.ack.desc : '';
				Toast.info(msg || Lang.device.dialog.tip[3]);
			}
		}).catch((res) => {
			Toast.info(res && res.desc ? res.desc : Lang.device.dialog.tip[3]);
		});
	}

	onChange(e) {
		this.setState({
			name: e.target.value
		});
	}

	onSelectRoom() {
		const {
			device,
			actions
		} = this.props;
		actions.setEditingName(this.state.name);
		this.props.history.push(`/device/selectroom/${device.devId}`);
	}

	onSelectMode() {
		const {device} = this.props;
		const path = {
			pathname: `/device/deviceMode`,
			devId: device.devId,
		};
		this.props.history.push(path);
	}

	onSelectWorkTime() {
		this.props.history.push('/device/deviceMode');
	}

	onSelectSensitivity() {
		this.props.history.push('/device/deviceMode');
	}

	onSelectOffDelayTime() {
		this.props.history.push('/device/deviceMode');
	}

	onDeviceUpdate() {
		const { device } = this.props;
		if (!device) {
			this.props.history.replace('/home');
			return;
		}

		const path = {
			pathname: `/device/deviceUpdate/${device.devId}`,
			devId: device.devId,
		};
		this.props.history.push(path);
	}

	onMoreAbout() {
		this.props.history.push('/device/moreAbout');
	}

	onRecord() {
		const {
			device,
			actions
		} = this.props;

		if (!device) {
			this.props.history.replace('/home');
			return;
		}

		if(device.devType !== 'Multi_Gateway' || device.devType !== 'Siren_Hub') {
			actions.saveDeviceItem(device); // TODO: 传devId
			this.props.history.push('/device/refresh');
			return;
		}

		const icon = <span className="warn-icon" />; // eslint-disable-line
		actions.showDialog(icon, Lang.device.gatewayDetail.tip[0], [{
				text: dialogLang.button[0],
				handleClick: function onHandle() {
					this.hide();
				},
			},
			{
				text: dialogLang.button[2],
				handleClick: function onHandle() {
					this.hide();
				},
			},
		]);
	}

	onReset() {
		const {
			device,
			actions
		} = this.props;

		const icon = <span className="warn-icon" />; // eslint-disable-line
		actions.showDialog(icon, Lang.device.gatewayDetail.tip[0], [{
				text: dialogLang.button[0],
				handleClick: function onHandle() {
					this.hide();
				},
			},
			{
				text: dialogLang.button[2],
				handleClick: function onHandle() {
					this.hide();
				},
			},
		]);
	}
	
	onSelectVolume() {
		this.props.history.push('/device/sirenhubVolume');
	}

	onDelete() {
		console.log("wcb edit delete");
		const {
			device,
			actions
		} = this.props;
		
		if (!device) {
			this.props.history.replace('/home');
			return;
		}

		if(device.devType !== 'Multi_Gateway' && device.communicationMode != "BLE" && device.devType !== 'Siren_Hub' && device.devType !== 'wifi_plug' && device.parentId === '') {
			Toast.info(deviceLang.dialog.tip[2]);
			return;
		}

		if(!device.online && device.communicationMode != "BLE") {
			actions.showDialog(deviceLang.dialog.tip[0], [{
				text: dialogLang.button[1],
				handleClick: function cancel() {
					this.hide();
				},
			}]);
			return;
		}

		const that = this;
		   console.log("断开网络删除设备提示用户网络断开");
		actions.showDialog(deviceLang.dialog.tip[1], null, [{
			text: dialogLang.button[0],
			handleClick: function cancel() {
				this.hide();
			},
		}, {
			text: dialogLang.button[3],
			className: 'btn-split',
			handleClick: function onHandle() {
				Toast.loading(Lang.public.loading, 0);
				 if(!window.system.networkStatus) {
			      console.log("wcb networkStatus");
			      Toast.info(Lang.user.validator[14], 3, null, false);
			      return;
			    }else{
				    let method = 'delDevReq';
					let options = {
						parentId: device.parentId || device.devId,
						payload: {
							devId: device.devId,
						},
					};

					/**
					 * 如果是ble遥控器先将灯全部剔除再删除遥控器
					 */
					if(device.devType === 'remote'&& device.communicationMode ==="BLE") {
						console.log("wcb，如果是ble遥控器先将灯全部剔除再删除遥控器");
						that.device.delDeviceFromeGroupAll({groupId:device.remoteId});//
						that.device.delDeviceFromeGroupAllDB({groupId:device.remoteId});//
					}
	
					if(device.devType === 'Multi_Gateway' || device.devType === 'wifi_plug' || device.devType === 'Siren_Hub') {
						method = 'devUnbindReq';
						const cookies = new Cookies();
						options = {
							payload: {
								unbindDevId: device.devId,
								unbindUserId: cookies.get('userId'),
								userId: cookies.get('userId'),
								timestamp: ((new Date()).valueOf()).toString(),
							},
						};
					}
	
					that.device[method](options).then((res) => {
						Toast.hide();
						if(res.ack && (res.ack.code - 0) === 200) {
							actions.shouldUpdateDeviceList();
							that.props.history.replace('/home');
						} else {
							const msg = res.ack && res.ack.desc ? res.ack.desc : '';
							Toast.info(msg || Lang.device.dialog.tip[2]);
						}
					}).catch(() => {
						Toast.info(Lang.device.dialog.tip[2]);
					});
					this.hide();
			    }
			},
		}, ]);
	}
	
	toAddedDevice() {
		this.props.history.push('/device/sirenhubDetail');
	}

	/**
	 * 收到Push上来的消息（这里主要对安防状态上报进行处理）
	 */
	componentWillReceiveProps(nextProps) {
		if (nextProps.receivePushMessage != null) {
			console.log('componentWillReceiveProps = ',nextProps.receivePushMessage);
			if(nextProps.receivePushMessage.method != null && nextProps.receivePushMessage.method == 'statusChangedNotif'){
				console.log('安防状态nextProps.receivePushMessage.payload.status = ' + nextProps.receivePushMessage.payload.status);
				this.setState({  
					securityStatus:nextProps.receivePushMessage.payload.status 
				});  
			}
		}
	}

	getStatusEls() {
		const {
			device
		} = this.props;
		let statusEls = <div className="device-info-status" />;
		
		switch(device.devType) {
			case 'Sensor_PIR':
			case 'Sensor_Motion':
				statusEls = (
					<div className="device-info-status">
            <span className="left">
              {device.online ?
                Lang.device.switchDeviceDetail.deviceStatus[0] :
                Lang.device.switchDeviceDetail.deviceStatus[1]}
            </span>
            <span className="seperate">|</span>
            <span className="right">
              {(device.attr
                && device.attr.Occupancy !== undefined && device.attr.Occupancy - 0 === 1) ?
                Lang.device.statusTrigger : Lang.device.statusUntrigger}
            </span>
          </div>
				);
				break;
			case 'Sensor_Doorlock':
					statusEls = (
						<div className="device-info-status">
							<span className="left">
								{device.online ?
									Lang.device.switchDeviceDetail.deviceStatus[0] :
									Lang.device.switchDeviceDetail.deviceStatus[1]}
							</span>
							<span className="seperate">|</span>
							<span className="right">
								{(device.attr
									&& device.attr.Door !== undefined && device.attr.Door - 0 === 1) ?
									Lang.device.statusOpen : Lang.device.statusClose}
							</span>
						</div>
					);
					break;
			case 'Keypad':
			case 'Keyfob':
				statusEls = (
					<div className="device-info-status">	
						{device.online ?
							Lang.device.switchDeviceDetail.deviceStatus[0] :
							Lang.device.switchDeviceDetail.deviceStatus[1]}
					</div>
				);
				break;
			case 'Multi_Gateway':
			case 'SirenHub':
				statusEls = (
					<div className="device-info-status">
            {device.online ?
              Lang.device.switchDeviceDetail.deviceStatus[0] :
              Lang.device.switchDeviceDetail.deviceStatus[1]}
          </div>
				);
				break;
			default:
				statusEls = (
					<div className="device-info-status">
						{device.online ?
							Lang.device.switchDeviceDetail.deviceStatus[0] :
							Lang.device.switchDeviceDetail.deviceStatus[1]}
					</div>
				);
				break;
		}
		return statusEls;
	}

	getPowerEls() {
		const {
			device
		} = this.props;
		switch(device.devType) {
			case 'Sensor_PIR':
			case 'Sensor_Doorlock':
			case 'Sensor_Motion':
				if(device.attr && device.attr.PowerLow !== undefined && device.attr.PowerLow - 0 === 1) {
					return <div className="device-info-power" />;
				}
				break;
			default:
				break;
		}
		return null;
	}

	getPlugSetting() {
		const {
			device
		} = this.props;
		if(device.devType == 'Smartplug_Meter_Wifi' || device.devType == 'Smartplug_Meter'){
			let moreAboutView = (
				<div
					role="presentation"
					className="device-info-row arrow"
					onClick={this.onMoreAbout}
					onKeyPress={() => { }}
				>
				<span className="title long">{Lang.device.edit.moreAbout}</span>
				<span className="name" />
			  	</div>);
			if(device.communicationMode == "BLE"){
				moreAboutView=null;
			}

			return(
				<div>
					<div
						role="presentation"
						className="device-info-row arrow"
						onClick={this.onSelectMode}
						onKeyPress={() => { }}
					>
						<span className="title">{Lang.device.edit.mode}</span>
						<span className="name">{Lang.device.edit.safeMode}</span>
					</div>
					{moreAboutView}
				</div>

			)
		}
		return null;
	}

	getRecord(){
		const {
			device
		} = this.props;
		if(device.communicationMode != "BLE" && device.devType != 'SirenHub'){
			return (<div
				role="presentation"
				className="device-info-row arrow"
				onClick={this.onRecord}
				onKeyPress={() => { }}
			  >
				<span className="title long">{device.devType !== 'Multi_Gateway' ? Lang.device.edit.record : Lang.device.gatewayDetail.resetTxt}</span>
				<span className="name" />
			  </div>);
		}
		return null;
	}
	
	getRemoteSetting() {
		const {
			device
		} = this.props;
		switch(device.devType) {
			case 'remote':
				return(
					<div>
				       	 
				       	<div
				          role="presentation"
				          className="device-info-row arrow"
				          onClick={this.onDeviceUpdate}
				          onKeyPress={() => { }}
				        >
				          <span className="title long">{Lang.device.edit.deviceUpdate}</span>
				          <span className="name" />
				        </div>
					        
		        	</div>

				);
				break;
			default:
				break;
		}
		return null;
	}

	resetData() {
		const {
			actions
		} = this.props;
		actions.setEditingName('');
	}

	render() {
		const {
			device
		} = this.props;
		if(!device) {
			return(
				<div className="device-info">
          <BarTitle onBack={this.onBack} />
        </div>
			);
		}

		return(
			<div className="device-info">
        <BarTitle onBack={this.onBack} title={device.name} />
        
        <ScrollView>
        
        	<div>
        	 	{this.getPowerEls()}
		        <div className={`device-info-logo ${device.devType}`} />
		        {this.getStatusEls()}
		        <div className="device-info-row">
		          <label className="title" htmlFor="name">{Lang.device.edit.name}</label>
		          <input
		            type="text"		            
		            name="name"
		            value={this.state.name}
		            onChange={this.onChange}
		            onKeyDown={(e) => {
		              if (e.keyCode !== 13) return;
		              e.target.focus();
		              e.target.blur();
		            }}
		            maxLength="20"
		          />
		        </div>

		        <div
		          role="presentation"
		          className="device-info-row arrow"
		          onClickCapture={this.onSelectRoom}
		          onKeyPress={() => { }}>
		          <span className="title">{Lang.device.edit.room}</span>
		          <span className="name">{device.roomName}</span>
		        </div>

						{device.devType=='Sensor_Motion' ? <div
								role="presentation"
								className="device-info-row arrow"
								onClickCapture={this.onSelectWorkTime.bind(this)}
								onKeyPress={() => { }}>
								<span className="title">{Lang.device.edit.workTime}</span>
								<span className="name">{Lang.device.edit.allDay}</span>
						</div> : null}

						{device.devType=='Sensor_Motion' ? <div
								role="presentation"
								className="device-info-row arrow"
								onClickCapture={this.onSelectSensitivity.bind(this)}
								onKeyPress={() => { }}>
								<span className="title">{Lang.device.edit.sensitivity}</span>
								<span className="name">{Lang.device.edit.high}</span>
						</div> : null}

						{device.devType=='Sensor_Motion' ? <div
								role="presentation"
								className="device-info-row arrow"
								onClickCapture={this.onSelectOffDelayTime.bind(this)}
								onKeyPress={() => { }}>
								<span className="title">{Lang.device.edit.offDelayTime}</span>
								<span className="name">{Lang.device.edit.oneMin}</span>
						</div> : null}

						{device.devType=='Multi_Gateway'||device.devType=='Siren_Hub' ? <div
								role="presentation"
								className="device-info-row arrow"
								onClickCapture={this.onSelectVolume.bind(this)}
								onKeyPress={() => { }}>
								<span className="title">{Lang.device.edit.alarmVolume}</span>
								<span className="name">{device.attr.warning_mode == 'off'?'mute':device.attr.siren_level}</span>
						</div> : null}

						{false ? <div
								role="presentation"
								className="device-info-row arrow"
								onClickCapture={this.toAddedDevice.bind(this)}
								onKeyPress={() => { }}>
								<span className="title">{Lang.device.edit.addedDevices}</span>
								<span className="name"/>
						</div> : null}

						{/*{device.devType=='SirenHub' ? <div
								role="presentation"
								className="device-info-row arrow"
								onClickCapture={this.onReset}
								onKeyPress={() => { }}>
								<span className="title long">{Lang.device.edit.resetToFactory}</span>
								<span className="name"/>
						</div> : null}*/}      

						<div
							role="presentation"
							className="device-info-row arrow"
							onClickCapture={this.onDeviceUpdate}
							onKeyPress={() => { }}>
							<span className="title long">{Lang.device.edit.deviceUpdate}</span>
							<span className="name">
								{this.state.version}
							</span>
						</div>
							
		        
		        {this.getRecord()}
		        {this.getPlugSetting()}
				{this.getRemoteSetting()}

		        <div className="device-info-row operate">
		          <button onTouchEnd={this.onDelete}>{Lang.public.delete}</button>
						</div>

        	</div>
        </ScrollView>
       
      </div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const currentDevId = ownProps.match.params.devId;
	return {
		devId: currentDevId,
		device: state.device.items[currentDevId],
		editingName: state.device.editingName,
		deviceMode: state.device.deviceMode,
		versionList: state.ota.versionList,
		updateNofifyList: state.ota.updateVersionNotifyList,
	};
};

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
			saveDeviceItem,
			setEditingName,
			shouldUpdateDeviceList,
			changeFromPage,
			showDialog,
		},
		dispatch,
	),
	getVersionList: (...args) => dispatch(getVersionList(...args)),
});

DeviceEdit.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	actions: PropTypes.object.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	device: PropTypes.object.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	history: PropTypes.object.isRequired,
	editingName: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceEdit);