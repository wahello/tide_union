import React, {
	Component
} from 'react';
import './default/style.css';
import { Lang } from '../public';
import { Route, Link, Switch } from 'react-router-dom';
import LayoutMultilayer from '../layout/multilayer';
import Ipcsetting from './ipcsetting';
import Settinglanguage from './settinglanguage';
import Settingmemory from './settingmemory';
import Settingangle from './settingangle';
import Settingmotion from './settingmotion';
import Settingselectcity from './settingselectcity';
import IpcselectRoom from './ipcSelectRoom';
import AddRoom from './addRoom';
import SetName from './setName';
import ChangePicture from './changePicture';
import Settingvolume from './settingvolume';
import Ipcupdate from './ipcupdate';
import Ipcinfo from './ipcinfo';
import Ipcmanage from './ipcmanage';
import Addplan from "./addplan";
import Selectplan from "./selectplan";
import Plantimer from "./plantimer";
// import Ipcpayresult from './ipcpayresult';
import Ipcpaysuccess from './ipcpaysuccess';
import Ipcpayfail from './ipcpayfail'
import Sdrecordmode from './sdrecordmode';
import IpcCountDown from './ipcCountDown';
import UpdateFail from './updateFail';
import UpdateSuccess from './updateSuccess';
import IpcAddFail from './ipcAddFail';
import WifiFail from './wifiFail';
import ConnectWifi from './connectWifi';
import AddCamera1 from './addCamera1';
import AddCamera2 from './addCamera2';
import AddCamera from './addCamera';
import SDVideoAll from './SDVideoAll';
import SDVideoOfDay from './SDVideoOfDay';
import SDVideoPlayer from './SDVideoPlayer';

import ConnectAPWiFi from './connectAPWiFi';
import WiFiList from './wifiList';
import SetWiFi from './setWiFi';
import LayoutNavigation from '../layout/navigation';
import IpcMain from './main';
import ipcpayfail from './ipcpayfail';
import SelectWifi from './selectWifi';
import AddFail from './addFail';
import WifiSuccess from './wifiSuccess';
import VideoListManage from './videoListManage';
import SetPlanName from './setPlanName'
import PlanBindDevice from './planBindDevice'
export default class extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {}

	render() {
		return(
			<LayoutMultilayer history={this.props.history} location={this.props.location}>
				<Route exact path="/ipc" component={IpcMain} />
                <Route exact path="/ipc/ipcsetting" component={Ipcsetting} />
                <Route exact path="/ipc/settinglanguage" component={Settinglanguage} />
                <Route exact path="/ipc/settingangle" component={Settingangle} />
                <Route exact path="/ipc/settingmemory" component={Settingmemory} />
                <Route exact path="/ipc/settingmotion" component={Settingmotion} />
                <Route exact path="/ipc/settingselectcity" component={Settingselectcity} />
                <Route exact path="/ipc/addRoom" component={AddRoom} />
                <Route exact path="/ipc/setName" component={SetName} />
                <Route exact path='/ipc/changePicture' component={ChangePicture} />
                <Route exact path="/ipc/ipcSelectRoom" component={IpcselectRoom} />
                <Route exact path="/ipc/settingvolume" component={Settingvolume} />
                <Route exact path="/ipc/ipcupdate" component={Ipcupdate} />
                <Route exact path="/ipc/ipcinfo" component={Ipcinfo} />
                <Route exact path="/ipc/ipcmanage" component={Ipcmanage} />
                <Route exact path="/ipc/addplan" component={Addplan} />
                <Route exact path="/ipc/selectplan" component={Selectplan} />
                <Route exact path="/ipc/plantimer" component={Plantimer} />
                {/* <Route exact path="/ipc/ipcpayresult" component={Ipcpayresult} />  */}
                <Route exact path="/ipc/ipcpayfail" component={Ipcpayfail} /> 
                <Route exact path="/ipc/ipcpaysuccess" component={Ipcpaysuccess} />   
                <Route exact path="/ipc/sdrecordmode" component={Sdrecordmode} />   
                <Route exact path="/ipc/ipcCountDown" component={IpcCountDown} />
                <Route exact path="/ipc/updateFail" component={UpdateFail} />
                <Route exact path="/ipc/updateSuccess" component={UpdateSuccess} />
                <Route exact path="/ipc/ipcAddFail" component={IpcAddFail} />
                <Route exact path="/ipc/wifiFail" component={WifiFail} />
                <Route exact path="/ipc/connectWifi" component={ConnectWifi} />
                <Route exact path="/ipc/addCamera1" component={AddCamera1} />
                <Route exact path="/ipc/addCamera2" component={AddCamera2} />
                <Route exact path="/ipc/addCamera" component={AddCamera} />
                <Route exact path="/ipc/connectAPWiFi" component={ConnectAPWiFi} />
                <Route exact path="/ipc/wifiList" component={WiFiList} />
                <Route exact path="/ipc/setWiFi" component={SetWiFi}/>  

                <Route exact path='/ipc/SDVideoAll' component={SDVideoAll} />
                <Route exact path='/ipc/SDVideoOfDay' component={SDVideoOfDay} />
                <Route exact path='/ipc/SDVideoPlayer' component={SDVideoPlayer} />
                <Route exact path='/ipc/selectWifi' component={SelectWifi} />
                <Route exact path='/ipc/addFail' component={AddFail} />
                <Route exact path='/ipc/wifiSuccess' component={WifiSuccess} />
                <Route exact path='/ipc/videoListManage' component={VideoListManage} />
                <Route exact path='/ipc/setPlanName' component={SetPlanName} />
                <Route exact path='/ipc/planBindDevice' component={PlanBindDevice} />
            </LayoutMultilayer>
		);
	}
}