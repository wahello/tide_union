import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import LayoutMultilayer from '../layout/multilayer';
import './default/style.css';
import Setting from './Setting';
import Record from './Record';
import AlarmVolume from './AlarmVolume';
import AlarmDuration from './AlarmDuration';
import Mode from './Mode';
import DelayTime from './DelayTime';
import LEDMode from './LEDMode';
import ChangePassword from './ChangePassword';
import SensorList from './SensorList';
import ModifyPwd from './ModifyPwd';
import PageSecurityAlarm from './PageSecurityAlarm';

export default class Security extends Component {
  constructor(props) {
  	super(props);
	}
    
  render() {
    return (
		  <LayoutMultilayer
        history={this.props.history}
        location={this.props.location}
      >
        <Route path="/security/mode/:modeType?" component={Mode} />
        <Route exact path="/security/delayTime/:modeType?" component={DelayTime} />
        <Route exact path="/security/setting" component={Setting} />
        <Route exact path="/security/record" component={Record} />
        <Route exact path="/security/alarmVolume" component={AlarmVolume} />
        <Route exact path="/security/alarmDuration" component={AlarmDuration} />
        <Route exact path="/security/ledMode" component={LEDMode} />
        <Route exact path="/security/changePw" component={ChangePassword} />
        <Route exact path="/security/sensorList/:modeType?" component={SensorList} />
        <Route path="/security/alarm" component={PageSecurityAlarm} />
      </LayoutMultilayer>
    );
  }
}