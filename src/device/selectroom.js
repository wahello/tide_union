import React, {
	Component
} from 'react';
import BarTitle from '../component/barTitle';
import Device from '../jssdk/device';
import Space from '../jssdk/space'
import Cookies from 'universal-cookie';
import { Lang } from '../public';
import {
	showDialog
} from '../action';
import {
	connect
} from 'react-redux';
import './default/style.css';
import './default/style2.css';
import RoomApi from '../jssdk/room';
import { saveDeviceItem } from '../action/device';
import Toast from 'antd-mobile/lib/toast';
import { shouldUpdateDeviceList } from '../action/device';

const dialogLang = Lang.public.dialog;
const deviceLang = Lang.device;
var spaces = [];
var roomId = '';
class selectroom extends Component {
	cookies = new Cookies();

	constructor(props) {
		super(props);
		const { currentRoomId } = this.props;
		this.space = new Space;
		roomId = currentRoomId;
		// this.deviceInfo = JSON.parse(localStorage.DeviceInfo);
		const { deviceItem } = this.props;
		this.device = new Device;
		this.state = {
			list: []
		};
		this.mountedDevices = [] //[{deviceName: "1", deviceId: 1}];
		this.unMountedDevices = [] //[{deviceName:"2", deviceId: 2}];
		this.oldDevices = [] //[{deviceName: "1", deviceId: 1}];

		this.handleClickBack = this.handleClickBack.bind(this);
		this.handleClickCheck = this.handleClickCheck.bind(this);
		this.handleClickDone = this.handleClickDone.bind(this);
	}

	handleClickBack(event) {
		this.props.history.goBack();
	}
	handleClickDone(event) {
		Toast.loading(Lang.public.loading);
		this.device.setDevInfoReq({
			parentId: this.props.directDevIds.gateway?(this.props.directDevIds.gateway[0] || ''):'',
			payload: {
				devId: this.props.deviceItem.devId,
				icon: this.props.deviceItem.icon,
				userId: this.cookies.get('userId'),
				name: this.props.deviceItem.name,
				homeId: this.props.deviceItem.homeId,
				roomId: roomId
			}
		}).then((res) => {
			Toast.hide();
			this.props.shouldUpdateDeviceList();
			if (res.ack.code == 200) {
				this.props.history.goBack();
			}
		}).catch((err) => {
			let msg = deviceLang.dialog.tip[3];
			if (err && err.desc) {
				msg = err.desc;
			}
			Toast.info(msg, 2, null, false)
		});
	}
	handleClickCheck(item) {
		this.setState({
			spaces: spaces.map(val => {
				roomId = item.roomId;
				return val;
			})
		})
	}
	render() {
		const { roomIds, rooms, totalCount, unbindDevices, currentRoomId } = this.props;
		spaces = [];

		roomIds.map((item, index) =>
			spaces.push(rooms[item])
		)

		let items = spaces.map((item, index) =>
			<li key={index} onClick={() => { this.handleClickCheck(item) }} style={{ borderRight: ((index + 1) % 3 === 0 ? "none" : "0.5px solid #4E5367") }} >
				<div className={item.icon + '-' + (item.roomId == roomId)} style={{ margin: "0 auto", marginTop: "30px" }} > </div>
				<div className={"li-item " + (item.roomId == roomId)} > {item.name} </div>
			</li >
		)

		return (
			<div className="selectroom" >
				<BarTitle onBack={this.handleClickDone} title={Lang.device.selectroom.title} > </BarTitle >
				<div className="promat" style={{ paddingTop: "1.7rem", paddingLeft: "1.7rem" }}> {Lang.device.selectroom.promat} </div>
				<div className="roomlist" style={{ marginTop: "54px" }} >
					<ul > {items} </ul>
				</div >
			</div>
		);
	}
}


const mapStateToProps = (state, ownProps) => {
	const devId = ownProps.match.params.devId;
	return {
		currentRoomId: state.device.items[devId].roomId,
		roomIds: state.room.list,
		rooms: state.room.items,
		totalCount: state.room.totalCount,
		currentHomeId: state.family.currentId,
		unbindDevices: state.device.unbindDevices || [],
		deviceItem: state.device.items[devId], //state.device.deviceItem,
		directDevIds: state.device.directDevIds || [],
	}
};


const mapDispatchToProps = (dispatch) => {
	return {
		shouldUpdateDeviceList: (...args) => dispatch(shouldUpdateDeviceList(...args)),
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(selectroom);