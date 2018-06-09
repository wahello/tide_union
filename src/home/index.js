import React, { Component } from 'react';
import './default/style.css';
import '../device/default/style.css';
import { Lang } from '../public';
import { Route, Link, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { showDialog, setComponent } from '../action';
import LayoutMultilayer from '../layout/multilayer';
import PageMain from './main';
import PageDeviceMain from '../device/main';
import FamilyList from '../family/list';
import FamilyCreate from '../family/create';
import FamilySet from '../family/set';
import FamilyWallpaper from '../family/wallpaper';
import PageDeviceEdit from '../device/edit';


import PageActivityRecord from '../setting/activityRecord';
import PageDeviceRecord from '../device/deviceRecord';
import PageDeviceSelectroom from '../device/selectroom';
import IpcMain from '../ipc/main';
//asml
import IpcSetting from '../ipc/ipcsetting';

import RoomSetting from './room';

// import UserAddRoom from './addRoom';
// import UserEditRoom from './editRoom';

// import SwitchDeviceDetail from '../device/switchDeviceDetail';
import SwitchChooseControlDevice from '../device/switchChooseControlDevice';
// import SirenEdit from '../device/sirenEdit';
import SirenVolume from '../device/sirenVolume';
import PageDeviceAddFlow from '../device/addFlow';
import RoomManagement from "./roomManagement";
import RoomIcon from "./roomIcon";
import DoorAdd1 from '../device/doorAdd1';
import DoorAdd2 from '../device/doorAdd2';
import DoorAdd3 from '../device/doorAdd3';
import SirenAdd1 from '../device/sirenAdd1';
import SirenAdd2 from '../device/sirenAdd2';
import SirenAdd3 from '../device/sirenAdd3';
import MotionAdd1 from '../device/motionAdd1';
import MotionAdd2 from '../device/motionAdd2';
import MotionAdd3 from '../device/motionAdd3';
import PlugAdd1 from '../device/plugAdd1';
import PlugAdd2 from '../device/plugAdd2';
import PlugAdd3 from '../device/plugAdd3';
import PageGateway from '../gateway/addGateWay';
import GatewayDetail from '../device/gatewayDetail';
import Nogateway from '../gateway/noGateway';

import DevActivity from '../device/refresh';
class Home extends Component {
  constructor(props) {
  	super(props);
    this.state = {};
	}
  
  render() {
    return (
			<LayoutMultilayer history={this.props.history} location={this.props.location}>
        <Route exact path="/device/lamp/control" component={this.props.component.LampControl} />
        <Route exact path="/device/lamp/add" component={this.props.component.LampAdd} />
        <Route exact path="/device/lamp/addHelp" component={this.props.component.LampAddHelp} />
        
        
				<Route exact path="/device" component={PageDeviceMain}/>
				<Route exact path="/device/edit/:devId" component={PageDeviceEdit} />
				<Route exact path="/device/deviceRecord" component={PageDeviceRecord} />
				<Route exact path="/device/selectroom/:devId" component={PageDeviceSelectroom} />
				<Route exact path="/device/addFlow" component={PageDeviceAddFlow} />
				<Route exact path="/device/gatewayDetail" component={GatewayDetail} />
				{/* <Route exact path="/device/switchDeviceDetail" component={SwitchDeviceDetail} /> */}
				<Route exact path="/device/switchChooseControlDevice" component={SwitchChooseControlDevice} />
				<Route exact path="/room/roomManagement/:roomId" component={RoomManagement} />
				<Route exact path="/room/roomIcon" component={RoomIcon} />
		    	<Route exact path="/room/editRoom/:roomId" component={RoomSetting} />
 				<Route exact path="/room/addRoom" component={RoomSetting} />
				{/* <Route exact path="/device/sirenEdit" component={SirenEdit} /> */}
				<Route exact path="/device/sirenVolume" component={SirenVolume} />
				<Route exact path="/device/doorAdd1" component={DoorAdd1} />
				<Route exact path="/device/doorAdd2" component={DoorAdd2} />
				<Route exact path="/device/doorAdd3" component={DoorAdd3} />
				<Route exact path="/device/sirenAdd1" component={SirenAdd1} />
				<Route exact path="/device/sirenAdd2" component={SirenAdd2} />
				<Route exact path="/device/sirenAdd3" component={SirenAdd3} />
				<Route exact path="/device/motionAdd1" component={MotionAdd1} />
				<Route exact path="/device/motionAdd2" component={MotionAdd2} />
				<Route exact path="/device/motionAdd3" component={MotionAdd3} />
				<Route exact path="/device/plugAdd1" component={PlugAdd1} />
	  			<Route exact path="/device/plugAdd2" component={PlugAdd2} />
	  			<Route exact path="/device/plugAdd3" component={PlugAdd3} />
				<Route exact path="/gateway/addGateWay" component={PageGateway} />
				<Route exact path="/gateway/noGateWay" component={Nogateway} />
				<Route path="/device/refresh/:devId?" component={DevActivity} />
			</LayoutMultilayer>
    );
  }
}

//将state绑定到props
const mapStateToProps = (state) => {
  return {
		component: state.component
  }
};
//将action的所有方法绑定到props上
const mapDispatchToProps = (dispatch) => {
  return {
    setComponent: (...args) => dispatch(setComponent(...args))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);