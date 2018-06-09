import React, { Component } from 'react';
import { connect } from 'react-redux';
import './default/style.css';
import { Lang } from '../public';
import DeviceApi from '../jssdk/device';
import SystemApi from '../jssdk/system';
import {
  STAY_MODE,
  AWAY_MODE,
  setTriggerList
} from '../action/security';

const systemApi = new SystemApi();
const deviceApi = new DeviceApi();
const langSecurity = Lang.security;

class AlarmPage extends React.Component {
  constructor(props) {
    super(props);
    this.disarm = this.disarm.bind(this);
    this.handleViewMore = this.handleViewMore.bind(this);
    this.state = {
      viewMore: false,
      records: [],
    };
  }
  
	componentWillReceiveProps(nextProps) {
		const { triggerList } = nextProps;				
		if(triggerList){
			//if(triggerList !== this.props.triggerList) {
				let list = triggerList
				let records = [];
				console.log("willrecord0===",triggerList)
				console.log(triggerList.length);

				triggerList.forEach((item) => {
					if (records.indexOf(item.devId) === -1) {
		        records.push(item.devId);
		      }
		    });
				console.log("willrecord1===",records)

				this.setState({ 
		    	records: records
		    });
		    
		    console.log("willrecord1===",this.state.records)
			//}	
		}			
	}

  componentDidMount() {
    const { devices, location, triggerList } = this.props;
    const triggers = location.state.trigger || [];
    let records = [];

    systemApi.offGoBack();
    systemApi.vibrate(60 * 60 * 1000);
    triggerList.forEach((item) => {
      if (records.indexOf(item.devId) === -1) {
        records.push(item.devId);
      }
    });

    this.setState({ records });
  }

  disarm() {
  	const emptyArr=[];
    systemApi.stopVibration();
    this.props.setTriggerList(emptyArr)
    deviceApi.setDevAttrReq({
      parentId: this.props.directDevIds.gateway[0],
      payload: {
        devId: this.props.directDevIds.gateway[0],
        attr: {
          warning_mode: 'off',
          strobe: 'off',
        },
      },
    });
    this.props.history.goBack();
  }

  handleViewMore() {
    this.props.history.push('/security/record');
  }

  render() {
    const {rooms, devices } = this.props;
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const { records, viewMore } = this.state;
    const recordsToShow = viewMore ? records : records.slice(0, 2);
    const triggeredDevices = recordsToShow.map(devId => (devices[devId] ? (
      <li className="notif-item" key={devId}>
        <i className={`trigger-icon ${devices[devId].devType.toLowerCase()}`} />
        <div className="notif-item_content">
          <p>{devices[devId].name || ''} {devices[devId].devType=='Sensor_Doorlock'?langSecurity.openStatus:langSecurity.activeStatus}</p>
          <span>{hours > 12 ? hours - 12 : hours}:{minutes < 10 ? `0${minutes}` : minutes} {hours > 12 ? langSecurity.pm : langSecurity.am}</span>
          <span>{rooms[devices[devId].roomId].name}</span>
        </div>
      </li>
    ) : ''));

    return (
      <div className="security-alarm">
        <div className="bell-bg-wrap">
          <i className="bell">{langSecurity.alarm}</i>
          <div className="bell-bg bell-bg1" />
          <div className="bell-bg bell-bg2" />
          <div className="bell-bg bell-bg3" />
        </div>
        {this.state.records.length ? <div className="notif-panel">
          <ul className="notif-list" style={this.state.listStyle}>
            {triggeredDevices}
          </ul>
          {
            this.state.records.length > 2
            ? <div className="view-more">
                {langSecurity.moreNotif}
                <button
                  onClick={this.handleViewMore}
                  className="vew-more-link"
                >
                  {langSecurity.viewMore}
                </button>
              </div>
            : ''
          }
          <button onClick={this.disarm} className="disarm-btn">{langSecurity.disarm}</button>
        </div> 
        : <button onClick={this.disarm} className="disarm-btn disarm-btn_os">{langSecurity.disarm}</button>}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  devices: state.device.items,
  modes: state.security.modes.list,
  rooms: state.room.items,
  directDevIds: state.device.directDevIds,
  triggerList: state.security.modes.triggerList,
});

const mapDispatchToProps = dispatch => {
  return {
    setTriggerList: (...args) => dispatch(setTriggerList(...args))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AlarmPage);
