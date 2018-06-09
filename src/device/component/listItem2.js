import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setDeviceAttr } from '../../action/device';
import { Lang } from '../../public';

let moveStartX = 0;
let moveStartY = 0;
let moveEndY = 0;
let moveEndX = 0;
const delBtnWidth = '6rem';

class ListItem extends Component {
	constructor(props) {
		super(props);
		const { attr } = props.dataDetail;
		this.state = {
			switchState: false,
			online: true,
			OnOff: ((attr && attr.OnOff) || false) - 0
		}
		this.handleTouchStart = this.handleTouchStart.bind(this);
		this.handleTouchMove = this.handleTouchMove.bind(this);
		this.handleTouchEnd = this.handleTouchEnd.bind(this);
		this.handleClickOnOff = this.handleClickOnOff.bind(this);
		this.handleClickDel = this.handleClickDel.bind(this);
		this.cancelLongPress = false;
		this.moving = false;
		this.touchStartTime = null;
	}
	_isLongPress = false;
	handleTouchStart(e) {
		if (e.target === this.refs.switchOnOff || e.target === this.refs.delBtn) {
			return;
		}
		if (this.moving) {
			return;
		}
	
		// e.preventDefault();
		// e.stopPropagation();
		moveStartX = e.touches[0].pageX;
		moveStartY = e.touches[0].pageY;

		// this.touchStartTime = new Date().getTime();

		let _startTS = new Date().getTime();
		let _endTS = 0;
		let isLongPress = this.props.isLongPress;
		if (!isLongPress) {
			this.oInterLongPress && clearTimeout(this.oInterLongPress);
			this.oInterLongPress = setTimeout(() => {
				_endTS = new Date().getTime();
				if (!this.props.isFetching && !this.moving) {
					_startTS = null;
					this.oInterLongPress && clearTimeout(this.oInterLongPress);
					this.props.handleLongPress(true);
					this._isLongPress = true;
				}
			}, 500);
		}
	}

	handleTouchMove(e) {
		this.moving = true;
		// e.preventDefault();
		// e.stopPropagation();
		moveEndX = e.touches[0].pageX;
		moveEndY = e.touches[0].pageY;
	}

	onItemClick(e) {
		this.moving = false;
		if (e.target === this.refs.switchOnOff || e.target === this.refs.delBtn) {
			return;
		}
		if (this.cancelLongPress) {
			return;
		}
		this.props.goToDeviceDetail(this.props.dataDetail);
	}

	handleTouchEnd(dataDetail, e) {
		if (e.target === this.refs.switchOnOff || e.target === this.refs.delBtn) {
			return;
		}
		this.oInterLongPress && clearTimeout(this.oInterLongPress);
		if(this.moving) {
			this.moving = false;
			return;
		}
		let isLongPress = this.props.isLongPress;
		if (isLongPress) {
			this.cancelLongPress = true;
			if (!this._isLongPress) {
				this.props.handleLongPress(false);
			}
		} else {
			this.cancelLongPress = false;
		}
		this._isLongPress = false;
	}

	handleClickOnOff(e) {
		e.stopPropagation();
		const { dataDetail } = this.props;
		console.log('开关之前设备信息1：', dataDetail);
		this.oInterLongPress && clearTimeout(this.oInterLongPress);
		this.props.handleLongPress(false);
		if (!dataDetail.online) {
			return;
		}
		if(dataDetail.communicationMode=="BLE"){
			const { actions } = this.props;
			const isOnOff = (dataDetail.attr.OnOff === 0 || dataDetail.attr.OnOff === '0') ? 1 : 0;
			if(dataDetail.attr.OnOff == 1){
				this.device.turnOn({devId:dataDetail.devId});//开
	    	}else if(dataDetail.attr.OnOff == 0){
				this.device.turnOff({devId:dataDetail.devId});//关
	    	}
		}else{
			const { actions } = this.props;
			const isOnOff = (dataDetail.attr.OnOff === 0 || dataDetail.attr.OnOff === '0') ? 1 : 0;
			const options = {
				parentId: dataDetail.parentId,
				payload: {
					devId: dataDetail.devId,
					attr: {
						OnOff: isOnOff
					}
				}
			}
			console.log('开关请求参数：', options);
			actions.setDeviceAttr(options).then((rec) => {
				this.setState({
					OnOff: (!this.state.OnOff) - 0
				})
			});
		}
		
	}

	handleClickDel(dataDetail) {
		this.oInterLongPress && clearTimeout(this.oInterLongPress);
		this.props.handleDel(dataDetail);
	}

	componentDidMount() {
		const { dataDetail } = this.props;
		if (dataDetail.attr && dataDetail.devType && dataDetail.attr.OnOff != undefined && (dataDetail.devType.toLowerCase().indexOf('light') > -1 || dataDetail.devType.toLowerCase().indexOf('smartplug') > -1)) {
			this.setState({
				OnOff: dataDetail.attr.OnOff - 0
			});
		}
	}

	componentWillReceiveProps(nextProps) {
		const nextDevice = nextProps.dataDetail;
		if (nextDevice.attr && nextDevice.attr.OnOff !== undefined) {
			this.setState({
				OnOff: nextDevice.attr.OnOff - 0
			});
		}
	}

	render() {
		const { dataDetail, rooms, roomIds } = this.props;

		// let OnOff = (dataDetail.attr && dataDetail.attr.OnOff !== undefined) ? dataDetail.attr.OnOff : this.state.OnOff;
		// if (typeof(OnOff) === 'string') {
		// 	OnOff = OnOff - 0;
		// }
		const { OnOff } = this.state;

		let isLongPress = this.props.isLongPress;
		let switchState = true;
		let uuid = 0;
		let iconClassName = ["devices-icon"];
		iconClassName.push(dataDetail.icon);
		if (dataDetail.attr && dataDetail.attr.OnOff != undefined) {
			iconClassName.push(OnOff ? "on" : "off");
		} else {
			iconClassName.push('on');
		}

		// 是否可控开关		
		let hasOnOff = false;
		// attr 有可能还没返回
		// if (dataDetail.attr && dataDetail.devType && dataDetail.devType.toLowerCase().indexOf('light') > -1 && dataDetail.attr.OnOff != undefined) {
		if (dataDetail.devType && (dataDetail.devType.toLowerCase().indexOf('light') > -1 || dataDetail.devType.toLowerCase().indexOf('smartplug') > -1)) {
			hasOnOff = true;
		}
		// 是否有低电量报警
		let hasBatteryAlarm = false;
		if (dataDetail.attr && dataDetail.attr.PowerLow !== undefined && (dataDetail.attr.PowerLow === true || dataDetail.attr.PowerLow === 1 || dataDetail.attr.PowerLow === '1')) {
			hasBatteryAlarm = true;
		}
		if (roomIds.length && dataDetail.roomId && rooms[dataDetail.roomId]) {
			dataDetail.roomName = dataDetail.roomName || rooms[dataDetail.roomId].name
		}

		// 不同设备显示不同状态
		const getDeviceStatus = () => {
			// console.log('devType:', dataDetail.devType)
			let status = dataDetail.online ? Lang.device.onLine : Lang.device.offLine;
			if (!dataDetail.devType) {
				return status;
			}
			switch(dataDetail.devType.toLowerCase()) {
				case 'sensor_doorlock': {					
					if (dataDetail.attr && dataDetail.attr.Door && dataDetail.attr.Door - 0) {
						status = Lang.device.statusOpen;
					} else {
						status =  Lang.device.statusClose;
					}
					break;
				}
				case 'sensor_pir':
				case 'sensor_motion': {
					if (dataDetail.attr && dataDetail.attr.Occupancy !== undefined && dataDetail.attr.Occupancy !== null) {
						if((dataDetail.attr.Occupancy - 0) === 1){
							status =  Lang.device.statusTrigger;
						} else{
							status =  Lang.device.statusUntrigger;
						}
					} else {
						status = dataDetail.online ? Lang.device.onLine : Lang.device.offLine;
					}
					break;
				}
				default:
					break;
			}
			return status;
		}

		return (
			<div
				ref="deviceItem"
				className="list-item"				
				key={dataDetail.devId}
				onTouchStart={this.handleTouchStart}
				onTouchMove={this.handleTouchMove}
				onTouchEnd={this.handleTouchEnd.bind(this, dataDetail)}
				onClick={this.onItemClick.bind(this)}
			>
				<table width="100%">
					<tbody>
						<tr>
							<td width="50%">
								<span className={iconClassName.join(" ")}></span>
							</td>
							<td width="50%" align="right">
								{/* <span className="device-status">{dataDetail.online ? Lang.device.onLine : Lang.device.offLine}</span> */}
								<span className="device-status">{getDeviceStatus()}</span>
								{hasOnOff && <a ref="switchOnOff" className={`device-switch ${OnOff ? 'on' : 'off'}`} onClick={this.handleClickOnOff}></a>}
							</td>
						</tr>
						<tr>
							<td colSpan="2" className="ellipsis">
								<span className="device-name">{dataDetail.name}</span>
							</td>
						</tr>
						<tr>
							<td colSpan="2" className="ellipsis">
								<div className="space-line">
									<span className="space-name">{dataDetail.roomName}</span>
									{hasBatteryAlarm && <span className="battery-status"></span>}
								</div>
							</td>
						</tr>
					</tbody>
				</table>
				<div className="mask" style={{ display: (dataDetail.online ? "none" : "block") }}></div>
				<a ref="delBtn" className="icon close" style={{ display: (!isLongPress ? "none" : "block") }} onClick={() => { this.handleClickDel(dataDetail) }}></a>
			</div>
		);
	}
}



const mapStateToProps = (state, ownProps) => {
	return {
		rooms: state.room.items,
		roomIds: state.room.list,
		isFetching: state.device.isFetching,
	}
}

const mapDispatchToProps = dispatch => {
	return {
	  actions: bindActionCreators({
		setDeviceAttr,
	  }, dispatch),
	}
  }
export default connect(mapStateToProps, mapDispatchToProps)(ListItem);