import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import BarTitle from '../component/barTitle';
import './default/style.css';
import { Lang } from '../public';
import Toast from 'antd-mobile/lib/toast';
import 'antd-mobile/lib/toast/style/css';
import {
  STAY_MODE,
  AWAY_MODE,
  SOS_MODE,
  fetchMode,
} from '../action/security';
const langSecurity = Lang.security;

class settings extends React.Component {
  constructor(props) {
    super(props);

    this.goToSettingPage = this.goToSettingPage.bind(this);
  }

  checkHasSiren(){
    let sirenArr = [];
    const { deviceItems } = this.props;
    console.log(deviceItems);
    for(let id in deviceItems){   
      let deviceType = deviceItems[id].devType; 
      
      if(deviceType.indexOf('Alarm_Siren') > -1){
        sirenArr.push(id)
      }
    }

    return sirenArr.length > 0;
  }

  goToSettingPage(modeType){
    const { currentHomeId } = this.props;
    const { fetchMode } = this.props.actions;
    Toast.loading('');
    fetchMode({
      homeId: currentHomeId,
      securityType: modeType
    }).then(res => {
      if(Number(res.ack.code) !== 200) {
        throw res;
      }

      Toast.hide();
      this.props.history.push(`/security/mode/${modeType}`);
    }).catch(e => {
      Toast.info(e.ack.desc);
    });
    
  }

  render() {
    return (
      <div>
        <BarTitle title={langSecurity.pageTitle.setting} onBack={() => this.props.history.goBack()} />
        <div className="setttings">
          <ul>
          	<li onClick={() => this.goToSettingPage(STAY_MODE)}>
              <a>Stay mode</a>
            </li>
            <li onClick={() => this.goToSettingPage(AWAY_MODE)}>
              <a>Away mode</a>
            </li>
            <li onClick={() => this.goToSettingPage(SOS_MODE)}>
              <a>SOS Mode</a>
            </li>
            <li>
              <Link to={`/security/changePw`}>Change password</Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

   
const mapStateToProps = state => {
  return {
    deviceItems:state.device.items,
    modes: state.security.modes.list,
    currentHomeId: state.family.currentId,
  }
};
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      fetchMode
    },
    dispatch,
  ),
});
export default connect(mapStateToProps, mapDispatchToProps)(settings);


