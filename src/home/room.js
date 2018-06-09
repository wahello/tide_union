import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createForm } from 'rc-form';
import Cookies from 'universal-cookie';
import Toast from 'antd-mobile/lib/toast';
import { Link } from 'react-router-dom';
import ListView from 'antd-mobile/lib/list-view';
import { Lang } from '../public';
import BarTitle from '../component/barTitle';
import ScrollView from '../component/scrollView';
import RoomIconClass from "./component/RoomIconClass";
import { showDialog, initRoomDefaultIcon } from '../action';
import { shouldUpdateDeviceList } from '../action/device';
import userApi from '../jssdk/User';
import Space from '../jssdk/space';
import roomApi from '../jssdk/room';
import Device from '../jssdk/device';
import { selectRoomIcon } from '../action';
import { addRoom, saveEditingRoom, updateRoom, initEditingRoom, deleteRoom } from '../action/room';

import './default/style.css';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
class RoomSetting extends Component {
	cookies = new Cookies();

	constructor(props) {
		super(props);
		this.state = {
			roomId: null,
			roomName: '',
			userAccount: this.cookies.get('account') || '',
			userId: this.cookies.get('userId'),
			isEdit: false,
			isCanSave: true,
			devices: [],
			editable: true,
			refreshing: true,
			empty: false,
		};
		this.device = new Device;
		this.space = new Space();
		const { dispatch } = props;
		this.dispatch = dispatch;
		this.onRemove = this.onRemove.bind(this);
		this.handleClickBack = this.handleClickBack.bind(this);
		this.onEditClick = this.onEditClick.bind(this);
		this.onInputClick = this.onInputClick.bind(this);
		this.handlerClearClick = this.handlerClearClick.bind(this);
		this.handleChangeSecret = this.handleChangeSecret.bind(this);
		this.handleClickCheck = this.handleClickCheck.bind(this);
		this.handleHeadClick = this.handleHeadClick.bind(this);
		this.handleClickDone = this.handleClickDone.bind(this);
		this.onBlur=this.onBlur.bind(this);
		this.onFocus=this.onFocus.bind(this);
	}
		
	onFocus(event){
			setTimeout(()=>{
			var userNameInput = document.getElementById("user-name-input");
			userNameInput.classList.add('input-empty');
			}, 100);
		}
	onBlur(event){
		setTimeout(() => {
		var editNameIconId = document.getElementById("edit-name-icon-id");
		editNameIconId.style.visibility = "visible";
		var clearIconId = document.getElementById("clear-icon-id");
		clearIconId.style.visibility = "hidden";
		var userNameInput = document.getElementById("user-name-input");
		userNameInput.classList.remove('input-empty');
		 }, 100);
	
	}
	handleHeadClick(event) {
		const { isEdit, devices, editable } = this.state;
		if (!editable) return;
		const { actions, selectedRoomIcon } = this.props;
		const form = this.props.form;
		const roomName = form.getFieldValue('roomName');
		const editingRoom = {
			name: roomName,
			devices: devices
		}
		actions.saveEditingRoom(editingRoom);
		this.props.history.push('/room/roomIcon');
	}

	handleClickCheck(item) {
		const { devices, editable } = this.state;
		if (!editable) {
			return;
		}

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
			Toast.info(Lang.home.addRoom.length, 3, null, false);
			return;
		}
		this.setState({
			devices: this.state.devices.map(val => {
				if (val === item) {
					val.checked = !val.checked;
				}
				return val;
			})
		});
	}

	onRemove(event) {
		const { form, roomId, actions, showDialog } = this.props;
		const that = this;
		const parameter = {
			roomId: roomId,
			cookieUserToken: '', // TODO
			cookieUserId: this.cookies.get('userId'),
		};

		showDialog(Lang.public.dialog.title[0], Lang.home.editRoom.sureDeleteRoom, [
			{
				text: Lang.public.dialog.button[0],
				handleClick: function () {
					this.hide();
				}
			},
			{
				text: Lang.public.dialog.button[1],
				className: "btn-split",
				handleClick: function () {
					this.hide();
					actions.deleteRoom(parameter).then(() => {
							that.props.history.replace('/home');
							actions.shouldUpdateDeviceList();
					});
				}
			}]);
	}

	handleChangeSecret(event) {
		this.setState({ isSecret: !this.state.isSecret });
	}

	handlerClearClick(event) {
		const { editable } = this.state;
		if (!editable) return;
		this.state.isCanSave = false;
		this.props.form.setFieldsValue({ roomName: '' })
	}

	getChangeDevices() {
		const { devices, isEdit } = this.state;
		if (!devices.length) {
			return {
				add: [],
				remove: [],
			};
		}
		const checkedDevices = devices.filter((device) => {
			return device.checked === true;
		});

		if (!isEdit) {
			return {
				add: checkedDevices,
				remove: [],
			};
		}

		const { deviceIds } = this.props;
		if (!deviceIds.length) {
			return {
				add: checkedDevices,
				remove: [],
			};
		}

		let addList = [];
		let removeList = []
		devices.map((device) => {
			const isCheck = device.checked;
			if (isCheck && deviceIds.indexOf(device.id) < 0) {
				addList.push(device);
			}
			if (!isCheck && deviceIds.indexOf(device.id) > -1) {
				removeList.push(device);
			}
		});

		return {
			add: addList,
			remove: removeList,
		};
	}

	handleClickBack(event) {
		const { editable } = this.state;
		const { isEdit } = this.state;
		const { showDialog, actions } = this.props;
		const changes = this.getChangeDevices();
		const roomId = this.props.match.params.roomId;
		const that = this;
		const form = this.props.form;
		const roomName = form.getFieldValue('roomName');
		let isModify = false;
		console.log("rooms = ", this.props.rooms);
		console.log("roomId = ", roomId);
		console.log("this.props.rooms[roomId] = ", this.props.rooms[roomId]);
//		if ((!changes.add.length && !changes.remove.length && roomName == this.props.rooms[roomId].name && this.props.selectedRoomIcon == this.props.rooms[roomId].icon ) || !editable )  {
//			console.log("1 = ", isModify);
//			isModify = false;
//			actions.initEditingRoom();
//			actions.initRoomDefaultIcon();
//			this.props.history.goBack();
//			return;
//		}
		if (!isEdit){
			//新增
			console.log("新增 开始 ");
				if(roomName != '' || this.props.selectedRoomIcon != "" ||changes.add.length ) {
					console.log("新增 有内容 ");
					this.setState({
					isModify: true
				});
				isModify = true;
				}
			console.log("roomName = ", roomName);
			console.log(" this.props.selectedRoomIcon = ",  this.props.selectedRoomIcon);
			console.log("isModify = ", isModify);
			console.log("新增 结束 ");
		}else{
			//修改
			//默认房间
		if(!editable){
			console.log("1 = ", isModify);
			this.setState({
					isModify: false
				});
				isModify = false;
		}
		//名称和之前不一致
		if(roomName != this.props.rooms[roomId].name){
			console.log("2 = ", isModify);
			this.setState({
					isModify: true
				});
				isModify = true;
		}
		//图和之前不一致
		if((this.props.selectedRoomIcon!== '' && this.props.selectedRoomIcon != this.props.rooms[roomId].icon)){
			console.log("3 = ", isModify);
			this.setState({
					isModify: true
				});
				isModify = true;
		}
		// 当前勾选的规则数量和之前的不一致
		if((changes.add.length || changes.remove.length) && editable){
			console.log("4 = ", isModify);
			this.setState({
					isModify: true
				});
				isModify = true;
		}
		console.log("this.props.rooms[roomId].selectedRoomIcon = ", this.props.rooms[roomId].selectedRoomIcon);
			console.log("this.props.rooms[roomId].name = ", this.props.rooms[roomId].name);
			console.log("isModify = ", isModify);
		
		}
		if(isModify){
			console.log("4 = ", isModify);
			showDialog("", 	Lang.home.addRoom.dialog.isModify[0],  [
			{
				text: Lang.public.dialog.button[0],
				handleClick: function () {
					if(roomId){
						this.hide();
					actions.initEditingRoom();
					actions.initRoomDefaultIcon();
						that.props.history.push(`/room/roomManagement/${roomId}`);
					}else{
						this.hide();
						actions.initEditingRoom();
					actions.initRoomDefaultIcon();
						that.props.history.push(`/home`);
					}
					
				}
			},
			{
				text: 'Save',
				className: "btn-split",
				handleClick: function () {
					this.hide();
					that.handleClickDone();
				}
			}]);
		}else{
			actions.initEditingRoom();
			actions.initRoomDefaultIcon();
			this.props.history.goBack();
			return;
			}
	}

	bindDevices2Room(roomId, cb) {
		const changes = this.getChangeDevices();
		const { currentHomeId, directDevIds } = this.props;
		const changeNum = changes.add.length + changes.remove.length;
		let feedbackNum = 0;

		if (!changeNum) {
			cb();
		}
		console.log("bindDevices2Room changes = " , changes);
		if (changes.add.length) {
			console.log("directDevIds  = " , directDevIds);
			changes.add.map((device) => {
				this.device.setDevInfoReq({
					parentId: directDevIds.gateway? directDevIds.gateway[0]:device.id,
					payload: {
						devId: device.id,
						icon: device.icon,
						name: device.name,
						userId: this.cookies.get('userId'),
						roomId: roomId,
						homeId: currentHomeId
					}
				}).then((res) => {
					console.log('add ...')
					if(res && res.ack && res.ack.code == 200) {
						this.props.deviceItems[device.id].roomId = roomId;
						let bindDeviceIndex = -1;
						for(let i = 0; i < this.props.unbindDeviceIds.length; i++){
							if(this.props.unbindDeviceIds[i] == device.id){
								bindDeviceIndex = i;
								break;
							}
						}
						if(bindDeviceIndex > -1){
							this.props.unbindDeviceIds.splice(bindDeviceIndex,1);
						}
						feedbackNum++;
					}
				});
			});
		}

		if (changes.remove.length) {
			changes.remove.map((device) => {
				this.device.setDevInfoReq({
					parentId: directDevIds.gateway[0] || device.id,
					payload: {
						devId: device.id,
						icon: device.icon,
						name: device.name,
						userId: this.cookies.get('userId'),
						roomId: 0,  // currentHomeId, // 移除时，roomId赋值为当前0
						homeId: currentHomeId
					}
				}).then((res) => {
					console.log('remove ...')
					if(res && res.ack && res.ack.code == 200) {
						this.props.deviceItems[device.id].roomId = 0;
						this.props.unbindDeviceIds.push(device.id);
						feedbackNum++;
					}
				});
			});
		}
		
		if (!changes.add.length && !changes.remove.length) {
			cb();
			return;
		}
		const { showDialog } = this.props;
		Toast.loading(Lang.home.addRoom.loading, 15, function() {
			console.log('feedbackNum: ' + feedbackNum);
			console.log('changeNum: ' + changeNum);		
			if (feedbackNum != changeNum) {
				showDialog (
					'',
					Lang.home.addRoom.dialog.result[0].replace('{feedbackNum}', feedbackNum).replace("{changeNum}", changeNum),
					[{
						text: Lang.public.dialog.button[1],
						className: "btn-split",
						handleClick: function () {
							this.hide();
							cb();
						}
					}]
				);
			} else {
				cb();
			}
		}, true)
	}
	
	getRoomNameLength(roomName){
		let len = 0;    
	    for (let i=0; i<roomName.length; i++) {    
	        if (roomName.charCodeAt(i)>127 || roomName.charCodeAt(i)==94) {    
	             len += 2;    
	         } else {    
	             len ++;    
	         }    
	     }    
	    return len;
	}
	

	handleClickDone(event) {
		const { roomCount } = this.props;
		const { isEdit } = this.state;
		if (roomCount >= 10 && !isEdit) {
			const { showDialog } = this.props;
			showDialog (
				'',
				Lang.home.addRoom.dialog.desc[0], 
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

		const form = this.props.form;
		const roomName = form.getFieldValue('roomName');
		if (!roomName) {
			Toast.info(Lang.home.addRoom.emptyRoomName, 3, null, false);
			return;
		}
		
		let regEn = /[`~!@#$%^&*()+<>?:"{},.\/;'[\]]/im,
		    regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
		
		var regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]|\ud83d[\ude80-\udeff]/g;
		if(roomName.match(regRule)) {
		   Toast.info(Lang.home.addRoom.sceneNameNonstandard);
		    return;
		}
		if(regEn.test(roomName) || regCn.test(roomName)) {
			Toast.info(Lang.home.addRoom.sceneNameNonstandard);
		    return;
		}
		
		let nameLength = this.getRoomNameLength(roomName);
		
		if(nameLength < 1 || nameLength > 20) {
			Toast.info(Lang.home.addRoom.roomNameLog, 3, null, false);
			return;
		}

		let haveOffline = false;
		const changes = this.getChangeDevices();
		let offlineDevices= []
		if (changes.add.length) {
			offlineDevices = changes.add.filter((device) => {
				return !device.online
			});
		}
		if (changes.remove.length) {
			let offlines = changes.add.filter((device) => {
				return !device.online
			});
			offlineDevices.concat(offlines);
		}
		if (offlineDevices.length) {
			Toast.info(Lang.home.addRoom.offline, 3, null, false);
		}

		const that = this;
		const { actions,roomId, selectedRoomIcon, currentHomeId } = this.props;
		const parameter = {
			icon: selectedRoomIcon || this.state.icon,
			cookieUserToken: '', // TODO
			cookieUserId: this.cookies.get('userId'),
			name: roomName,
			homeId: currentHomeId,
			roomId: roomId,
		};
		
			console.log("selectedRoomIcon : " ,selectedRoomIcon);
			console.log("this.state.icon : " ,this.state.icon);
		if (!parameter.icon || parameter.icon == 'default') {
			console.log("parameter : " ,parameter);
			Toast.info(Lang.home.addRoom.emptyRoomIcon, 3, null, false);
			return;
		}
		
		this.setState({
			icon: selectedRoomIcon || this.state.icon
		})
		
		const { devices } = this.state;
		if (!isEdit) {
			// 新增
			roomApi.addRoom(parameter).then((res) => {
				if (res.code != 200) {
					Toast.info(res.desc || Lang.home.addRoom.saveFail, 3, null, false);
					return;
				}
				console.log('save room success: ' + res.data.roomId)
				const roomId = res.data.roomId;
				actions.addRoom({
					roomId: roomId,
					name: parameter.name,
					icon: parameter.icon,
					devNum: 0
				});
				const that = this;
				this.bindDevices2Room(roomId, function() {
					actions.shouldUpdateDeviceList();
					that.props.history.push(`/room/roomManagement/${roomId}`);
				});
			})
		} else {
			// 修改

			roomApi.update(parameter).then((res) => {
				const roomId = this.props.match.params.roomId;
			const { rooms, actions } = this.props;
				if (res.code != 200) {
					Toast.info(res.desc || Lang.home.addRoom.saveFail, 3, null, false);
					return;
				}
				if ((selectedRoomIcon!== '' && selectedRoomIcon !== rooms[roomId].icon) || roomName !== rooms[roomId].name) {
				parameter.roomId = roomId;
				actions.updateRoom(parameter).then(() => {
				});
			}
			
			const that = this;
			this.bindDevices2Room(roomId, function() {
				actions.shouldUpdateDeviceList();
				that.props.history.push(`/room/roomManagement/${roomId}`);
			});
			})

		}

		actions.initEditingRoom();
		actions.initRoomDefaultIcon();
	}

	onInputClick() {
		const { editable } = this.state;
		
		if (!editable) return;

		var roomNameRoot = document.getElementById("user-name-root");
		var roomNameInput = document.getElementById("user-name-input");
		roomNameRoot.style.backgroundColor = "$bg-nav-top-color";
		var editNameIconId = document.getElementById("edit-name-icon-id");
		editNameIconId.style.visibility = "hidden";
		var clearIconId = document.getElementById("clear-icon-id");
		clearIconId.style.visibility = "visible";
		roomNameInput.readOnly = false;
		
	}
	

	onEditClick(event) {
		const { editable } = this.state;
		if (!editable) return;

		this.state.isCanSave = false;
		this.onInputClick();
	}

	componentDidMount() {
		const pathname = this.props.history.location.pathname;
		this.setState({
			isEdit: pathname !== '/room/addRoom'
		});
		
		const { unbindDeviceIds, deviceItems, editingRoom } = this.props;
		
		const { actions, selectedRoomIcon, currentHomeId } = this.props;
		const parameter = {
			icon: selectedRoomIcon || this.state.icon,
			cookieUserToken: '', // TODO
			cookieUserId: this.cookies.get('userId'),
			homeId: currentHomeId,
		};
		
			console.log("selectedRoomIcon : " ,selectedRoomIcon);
			console.log("this.state.icon : " ,this.state.icon);
		
		console.log('this.props.deviceItems = ',this.props.deviceItems);
		console.log('unbindDeviceIds = ',unbindDeviceIds);
		if (editingRoom !== null) {
			this.setState({
				roomName: editingRoom.name,
				devices: editingRoom.devices
			})
		} else {
			let roomId = this.props.match.params.roomId || '';
			const roomDevices = [];
			const deviceList = [];
			const { deviceIds, rooms } = this.props;
			let roomName = roomId ? rooms[roomId].name : '';
			const roomIcon = roomId ? rooms[roomId].icon : 'default';
			this.props.selectRoomIcon(roomIcon);
			if (unbindDeviceIds && unbindDeviceIds.length) {
				unbindDeviceIds.map(id => {
					deviceList.push({
						id: id,
						name: deviceItems[id] ? deviceItems[id].name : '',
						checked: false,
						icon: deviceItems[id] ? (deviceItems[id].icon || 'default') : 'default',
						online:  deviceItems[id] ? deviceItems[id].online : false,
					})
				});
			}
			if (pathname !== '/room/addRoom') {
				if (deviceIds.length) {
					deviceIds.map(id => {
						roomDevices.push({
							id: id,
							name: deviceItems[id] ? deviceItems[id].name : '',
							checked: true,
							icon: deviceItems[id] ? (deviceItems[id].icon || 'default') : 'default',
							online: deviceItems[id] ? deviceItems[id].online : false,
						})
					})
				}					
			}

			const { editable } = this.state;
			this.setState({
				devices: roomId == 0 ? deviceList : roomDevices.concat(deviceList),
				roomId: roomId,
				roomName: roomName,
				editable: roomId != 0 || roomId == '',
				icon: roomIcon
			})
			
			console.log('roomId = ',roomId);
		}
	}
	
		
	
	render() {
		let checkboxIcon = (this.state.isSecret ? "close" : "open");
		const { devices, isEdit, editable, icon } = this.state;
		let dataSource = ds.cloneWithRows(devices);
		let row = (device, sid, rid) => {
			return <div className="list-item" key={rid} >
				<div className="space-account">
					<span className={`devices-icon ${device.icon} on ${device.online ? '' : 'offline'}`}></span>
					<b>{device.name}</b>
					<p>{`${device.checked ? 'Added' : 'Everything else'}`}</p>
					<a className={device.checked ? "open" : "close"} href="javascript:;" onClick={e => this.handleClickCheck(device)}></a>
				</div>

			</div>
		};

		const { getFieldProps, getFieldError } = this.props.form;

		const renderDeviceList = (() => {
			console.log("device length = " ,devices.length);
			if ((!devices.length&&!editable)||(!devices.length&&!isEdit)) {
				return <div className="empty-device-tip">
					<p>You don't have any device yet!</p>
					<p>Please add first</p>
				</div>
			}else if(!devices.length&&isEdit && editable){
				return <div className="empty-device-tip">
					<p>You don't have any device yet!</p>
					<p>Please add first</p>
					<div className="removeButton1" onClick={this.onRemove.bind(this)}>{Lang.home.addRoom.remove}</div>
				</div>
			}
			return <ListView
				style={{ height: "calc(65vh - 1.16rem - 64px)" }}
				useBodyScroll={false}
				dataSource={dataSource}
				renderRow={row}
				renderFooter = {
		(isEdit && editable) ? () => <div className="removeButton" onClick={this.onRemove.bind(this)}>{Lang.home.addRoom.remove}</div> : ''
	}
			/>;
		}) 

		return (
			<div className="room">
				{editable && <BarTitle onBack={this.handleClickBack} title={isEdit ? Lang.home.editRoom.title : Lang.home.addRoom.title} onDone={this.handleClickDone}>
				</BarTitle>}
				{!editable && <BarTitle onBack={this.handleClickBack} title={isEdit ? Lang.home.editRoom.title : Lang.home.addRoom.title}>
				</BarTitle>}

				<ScrollView>
					<div className='addRoom-bodyer'>
						<div className='user-head-icon' onClick={this.handleHeadClick}>
							<div className="background-image">
								<RoomIconClass flag={'2'} type={this.props.selectedRoomIcon || icon} />
							</div>
						</div>
						<div className="name-root">
							<div id="user-name-root" className='user-name'>
								<input disabled={!editable} className='name-input' id="user-name-input"  type="text" onBlur={this.onBlur} onFocus={this.onFocus} placeholder="Room name" maxLength="20" onClick={this.onInputClick}  value={Lang.user.login.placeholder[0]}
									{...getFieldProps('roomName', {
										initialValue: this.state.roomName,
//										 rules: [{ required: true, max: 30, min: 2, message: Lang.user.validator[15] }]
									})} />

								{editable && <div className='edit-name-after'>
									<div id="edit-name-icon-id" className='edit-name-icon' onClick={this.onEditClick}></div>
								</div>}

								<div id="clear-icon-id" className='clear-icon-after'>
									{this.props.form.getFieldValue('roomName') && this.props.form.getFieldValue('roomName').length ? <a className="clear-icon" href="javascript:;" onClick={this.handlerClearClick}></a> : ''}
								</div>
							</div>
							<p className="room-title" >
								{isEdit ? Lang.home.editRoom.roomTitle : Lang.home.addRoom.roomTitle}
							</p>
						</div>
						<div className="space-list">
							{
								renderDeviceList()
							}
						</div>
					</div>
				</ScrollView>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		selectedTab: state.other.selectedTab,
		selectedRoomIcon: state.space.selectedRoomIcon,
		currentHomeId: state.family.currentId,
		unbindDeviceIds: state.device.unbindDevices || [],
		deviceItems: state.device.items, // state.room.deviceInfo.items,
		editingRoom: state.room.editing,
		deviceIds: state.room.deviceInfo.list || [],
		rooms: state.room.items,
		roomId: ownProps.match.params.roomId,
		roomCount: state.room.list.length,
		directDevIds: state.device.directDevIds || {},
	}
}

const mapDispatchToProps = dispatch => {
	return {
		showDialog: (...args) => dispatch(showDialog(...args)),
		selectRoomIcon: (...args) => dispatch(selectRoomIcon(...args)),
		actions: bindActionCreators({ 
			addRoom,
			saveEditingRoom,
			initEditingRoom,
			deleteRoom,
			initRoomDefaultIcon,
			updateRoom,
			shouldUpdateDeviceList
		}, dispatch),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(RoomSetting))