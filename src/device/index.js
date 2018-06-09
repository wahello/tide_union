import React, { Component } from 'react';
import Device from '../jssdk/device';
import './default/style.css';
import PageControl from './control';
import PageSelectroom from './selectroom';
import UpdateIcon from './updateIcon';
import SearchHub from './searchHub';
import PageEdit from './edit';
import SwitchChooseControlDevice from './switchChooseControlDevice';
// import SwitchDeviceDetail from './switchDeviceDetail';
// import SirenEdit from './sirenEdit';
import SirenVolume from './sirenVolume';
import DeviceRecord from './deviceRecord';
// import Refresh from './refresh';
import DeviceGuidePage from './deviceGuidePage';
import GuidePageTwo from './guidePageTwo';
import GuidePageThree from './guidePageThree';
import LightAdd from './lightAdd';
import LightAddHelp from './lightAddHelp';
import DoorAdd1 from './doorAdd1';
import DoorAdd2 from './doorAdd2';
import DoorAdd3 from './doorAdd3';
import DoorAddhelp from './doorAddhelp';
import PageMain from './main';
import MotionAdd1 from './motionAdd1';
import MotionAdd2 from './motionAdd2';
import MotionAdd3 from './motionAdd3';
import MotionAddHelp from './motionAddhelp';
import PlugAdd1 from './plugAdd1';
import PlugAdd2 from './plugAdd2';
import PlugAdd3 from './plugAdd3';
import PlugAddhelp from './plugAddhelp';
import RemoteAdd1 from './remoteAdd1';
import RemoteAdd2 from './remoteAdd2';
import RemoteAddhelp from './remoteAddhelp';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { showDialog } from '../action';
import LayoutMultilayer from '../layout/multilayer';
// import GatewayEdit from './gatewayEdit';
import AddResult from './addResult';
import PlugDetail from './plugDetail';
import WifiPlugAPGuide from './wifiPlugAPGuide';
import WifiPlugSLGuide from './wifiPlugSLGuide';
import SelectWifi from './selectWifi';
import SelectPlugApWifi from './selectPlugApWifi';
import PlugAddFail from './plugAddFail';
import WifiPlugDetail from './wifiPlugDetail';
import SirenHubAdd1 from './sirenHubAdd1';
import SirenHubAdd2 from './sirenHubAdd2';
import SirenHubAdd3 from './sirenHubAdd3';
import SirenHubDetail from './sirenhubDetail';
import SirenHubVolume from './sirenhubVolume';
import SelectSirenhubWifi from './selectSirenHubWifi';
import BLEAddDevice from './BLEAddDevice';
import BLEDeviceAdd from './BLEDeviceAdd';
import SearchBLEDevice from './searchBLEDevice';
import MoreAbout from './moreAbout';
import DeviceMode from './deviceMode';
import CountDown from './countDown';
import SetCountDown from './setCountDown';
import KeyfobAdd from './keyfobAdd';
import KeyfobAdd1 from './keyfobAdd1';
import KeyfobAdd2 from './keyfobAdd2';
import KeyfobAdd3 from './keyfobAdd3';
import SearchByAp from './searchByAp';
import KeypadAdd from './keypadAdd';
import RemoteDetail from './remoteDetail';
import AddSuccess from './addSuccess';
import DeviceUpdate from './ota';
import SecurityKit from './securityKit';
import ApAdding from './apAdding';

export default class extends Component {
  constructor(props) {
  	super(props);
    this.state = {};
	}
  
  render() {
    return (
			<LayoutMultilayer history={this.props.history} location={this.props.location}>
        <Route exact path="/device/control" component={PageControl} />
        <Route exact path="/device/edit/:devId" component={PageEdit} />
        <Route exact path="/device/deviceRecord" component={DeviceRecord} />
        {/* <Route exact path="/device/refresh" component={Refresh} /> */}
        <Route exact path="/device/selecticon" component={UpdateIcon} />
        <Route exact path="/device/selectroom/:devId" component={PageSelectroom} />
        <Route exact path="/device/switchChooseControlDevice" component={SwitchChooseControlDevice} />
        {/* <Route exact path="/device/switchDeviceDetail" component={SwitchDeviceDetail} /> */}
        {/* <Route exact path="/device/sirenEdit" component={SirenEdit} /> */}
        <Route exact path="/device/sirenVolume" component={SirenVolume} />
        <Route exact path="/device/deviceGuidePage" component={DeviceGuidePage} />
        <Route exact path="/device/guidePageTwo" component={GuidePageTwo} />
        <Route exact path="/device/guidePageThree" component={GuidePageThree} />
  			<Route exact path="/device/lightAdd" component={LightAdd} />
  			<Route exact path="/device/lightAddHelp/:type" component={LightAddHelp} />
  			<Route exact path="/device/doorAdd1" component={DoorAdd1} />
  			<Route exact path="/device/doorAdd2" component={DoorAdd2} />
  			<Route exact path="/device/doorAdd3" component={DoorAdd3} />
  			<Route exact path="/device/doorAddhelp" component={DoorAddhelp} />
  			<Route exact path="/device/motionAdd1" component={MotionAdd1} />
  			<Route exact path="/device/motionAdd2" component={MotionAdd2} />
  			<Route exact path="/device/motionAdd3" component={MotionAdd3} />
  			<Route exact path="/device/motionAddHelp" component={MotionAddHelp} />
  			<Route exact path="/device/plugAdd1/:type" component={PlugAdd1} />
  			<Route exact path="/device/plugAdd2/:type" component={PlugAdd2} />
  			<Route exact path="/device/plugAdd3/:type" component={PlugAdd3} />
  			<Route exact path="/device/plugAddhelp/:type" component={PlugAddhelp} />
  			<Route exact path="/device/remoteAdd1" component={RemoteAdd1} />
  			<Route exact path="/device/remoteAdd2" component={RemoteAdd2} />
  			<Route exact path="/device/remoteAddhelp" component={RemoteAddhelp} />
			<Route exact path="/device/searchHub/:type" component={SearchHub} />
  			{/* <Route exact path="/device/gatewayEdit" component={GatewayEdit} /> */}
			<Route exact path="/device/addResult" component={AddResult} />
			<Route exact path="/device/plugDetail" component={PlugDetail} />
			<Route exact path="/device/wifiPlugAPGuide" component={WifiPlugAPGuide} />
			<Route exact path="/device/wifiPlugSLGuide" component={WifiPlugSLGuide} />
			<Route exact path="/device/selectWifi" component={SelectWifi} />
			<Route exact path="/device/selectPlugApWifi" component={SelectPlugApWifi} />
			<Route exact path="/device/plugAddFail" component={PlugAddFail} />
			<Route exact path="/device/wifiPlugDetail" component={WifiPlugDetail} />
			<Route exact path="/device/BLEAddDevice" component={BLEAddDevice} />
			<Route exact path="/device/BLEDeviceAdd" component={BLEDeviceAdd} />
			<Route exact path="/device/searchBLEDevice/:type" component={SearchBLEDevice} />
			<Route exact path="/device/moreAbout" component={MoreAbout} />
			<Route exact path="/device/deviceMode" component={DeviceMode} />
			<Route exact path="/device/countDown" component={CountDown}/>
			<Route exact path='/device/setCountDown' component={SetCountDown}/>
			<Route exact path='/device/searchByAp/:type' component={SearchByAp}/>
			<Route exact path='/device/sirenHubAdd1' component={SirenHubAdd1}/>
			<Route exact path='/device/keyfobAdd' component={KeyfobAdd}/>
			<Route exact path='/device/keyfobAdd1' component={KeyfobAdd1}/>
			<Route exact path='/device/keyfobAdd2' component={KeyfobAdd2}/>
			<Route exact path='/device/keyfobAdd3' component={KeyfobAdd3}/>
			<Route exact path='/device/keypadAdd' component={KeypadAdd}/>
			<Route exact path='/device/sirenHubAdd2' component={SirenHubAdd2}/>
			<Route exact path='/device/sirenHubAdd3' component={SirenHubAdd3}/>
			<Route exact path="/device/remoteDetail" component={RemoteDetail} />
			  <Route exact path="/device/addSuccess" component={AddSuccess} />
			<Route exact path='/device/deviceUpdate/:devId' component={DeviceUpdate}/>
			<Route exact path='/device/sirenhubDetail' component={SirenHubDetail}/>
			<Route exact path='/device/sirenhubVolume' component={SirenHubVolume}/>
			<Route exact path='/device/selectSirenhubWifi' component={SelectSirenhubWifi}/>
			<Route exact path='/device/deviceUpdate' component={DeviceUpdate}/>
			<Route exact path='/device/securityKit' component={SecurityKit}/>
			<Route exact path='/device/apAdding/:type' component={ApAdding}/>
			</LayoutMultilayer>
    );
  }
}