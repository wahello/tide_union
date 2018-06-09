import React, { Component } from 'react';
import { connect } from 'react-redux';
import './default/style.css';
import { Lang } from '../public';
import {
  STAY_MODE,
  AWAY_MODE,
} from '../action/security';
import DeviceItem from '../component/deviceItem';
import BarTitle from '../component/barTitle';
import ScrollView from '../component/scrollView'


const langSecurity = Lang.security;

class SensorList extends Component {
  constructor(props) {
    super(props);
    
    this.handleBackClick = this.handleBackClick.bind(this);
  }

  handleBackClick() {
    this.props.history.goBack();
  }

  render() {
    const { modeType } = this.props.match.params;
    const {rooms, devices, location } = this.props;
    const { trigger } = location.state;
    let activeSensors = [];
    console.log("11111========",trigger)
    trigger.forEach(item => {
      const devId = item.devId;
      let deviceitem;
      deviceitem = devices[devId] ? (
          <DeviceItem
            key={devId}
            parentName={rooms[devices[devId].roomId] == null ? 'Default' : rooms[devices[devId].roomId].name}
            deviceName={devices[devId].name}
            type={devices[devId].icon}
            online={devices[devId].online}
            deviceType={devices[devId].devType}>            
          </DeviceItem>
        ) : '';
      activeSensors.push(deviceitem);
      }
    );
		console.log("2222222=======",activeSensors)
    return (
      <div className="security-sensor-list">
        <BarTitle
          title={
            modeType === STAY_MODE
            ? `${langSecurity.stay} devices`
            : `${langSecurity.away} devices`
          }
          onBack={this.handleBackClick}
        />
        <ScrollView>
          <ul>
            {activeSensors}
          </ul>
        </ScrollView>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  devices: state.device.items,
  modes: state.security.modes.list,
  rooms: state.room.items,
});

export default connect(mapStateToProps)(SensorList);
