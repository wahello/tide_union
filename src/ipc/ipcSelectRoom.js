import React, { Component } from 'react';
import BarTitle from '../component/barTitle';
import Device from '../jssdk/device';
import Space from '../jssdk/space'
import Cookies from 'universal-cookie';
import { Lang } from '../public';
import { showDialog } from '../action';
import { connect } from 'react-redux';
import './default/style.css';
import RoomApi from '../jssdk/room';
import Toast from 'antd-mobile/lib/toast';
import { bindActionCreators } from 'redux';
import SystemApi from '../jssdk/system';
// import { saveIpcRoomname } from '../action/ipc';
import { setDeviceName } from '../action/device';
const dialogLang = Lang.public.dialog;
const deviceLang = Lang.device;
var spaces = [];
var roomId = '';
class selectroom extends Component {
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
    this.systemApi = new SystemApi;
	}
  componentDidMount(){
    this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
  }

	handleClickBack(event) {
		this.props.history.goBack();
  }
    
	handleClickDone(event) {
    const cookies = new Cookies();
    Toast.loading(Lang.public.loading);
    const { room_id, icon, name } =  this.state;
    const { actions } = this.props;
    let oldRoomName = this.props.deviceItem.roomName;
    let old_roomid = this.props.deviceItem.roomId;
    let new_id = room_id == 0 ? "0" : room_id                                                                                                                                                                                               ;
    if(room_id === undefined && icon === undefined && name === undefined ){
      this.props.history.goBack();
    }else if(oldRoomName === name && old_roomid === room_id){
      this.props.history.goBack();
    }else{
      const options = {
        parentId:this.props.parentId,
        payload:{
          devId: this.props.devId,
          userId: cookies.get('userId'),
          homeId: this.props.deviceItem.homeId,
          roomId:new_id,
          roomName:this.state.name,
          password:this.props.password,
          icon: this.props.deviceItem.icon,
          name: this.props.deviceItem.name
        }
      };
      actions.setDeviceName(options).then(() => {
        Toast.hide();
        this.props.history.goBack();
      });
    }
  }
    
	handleClickCheck(item) {
		this.setState({
			spaces: spaces.map(val => {
        roomId = item.roomId;
				return val;
      }),
      room_id:item.roomId,
      icon:item.icon,
      name:item.name
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
				<BarTitle onBack={this.handleClickBack} title={Lang.device.selectroom.title} >	<a className="txt txt-done" onClick={this.handleClickDone} > {Lang.public.txtDone} </a> </BarTitle >
				<div className="promat" style={{ paddingTop: "1.7rem", paddingLeft: "1.7rem" }}> {Lang.device.selectroom.promat} </div>
				<div className="roomlist" style={{ marginTop: "54px" }} >
					<ul style={{borderBottom:"none"}}> {items} </ul>
				</div >
			</div>
		);
	}
}


const mapStateToProps = (state, ownProps) => {
  console.log(ownProps)
  const devId = (state.device.fromPage === 'list' || state.device.recordAttr.devId === '') ? state.device.deviceItem.devId : state.device.recordAttr.devId;
	return {
    parentId:devId,
    devId:devId,
    currentRoomId: state.device.items[devId].roomId,
		roomIds: state.room.list,
		rooms: state.room.items,
		totalCount: state.room.totalCount,
		currentHomeId: state.family.currentId,
		unbindDevices: state.device.unbindDevices || [],
		deviceItem: state.device.items[devId],
    directDevIds: state.device.directDevIds || [],
    password:state.device.items[devId].password
	}
};
const mapDispatchToProps = (dispatch) => {
	return {
    actions: bindActionCreators({
      setDeviceName
    }, dispatch)
	}
};
export default connect(mapStateToProps, mapDispatchToProps)(selectroom);