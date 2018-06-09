import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import Toast from 'antd-mobile/lib/toast';
import 'antd-mobile/lib/toast/style/css';
import Cookies from 'universal-cookie';
import BarTitle from '../component/barTitle';
import CircularProgress from '../component/circularProgress';
import { showDialog as showDialogAction } from '../action';
import MQTTService from '../jssdk/MQTTService';
import SystemApi from '../jssdk/system';
import {
  getSecurityStatus,
  fetchMode,
  deployMode,
  countDown,
  setStatus,
  stopCountingDown,
  STAY_MODE,
  AWAY_MODE,
  SOS_MODE,
  STATUS
} from '../action/security';
import './default/style.css';
import { Lang } from '../public';
import DeviceApi from '../jssdk/device';
import { bypass } from '../jssdk/Security';

const deviceApi = new DeviceApi();
const langSecurity = Lang.security;
const cookies = new Cookies();
const systemApi = new SystemApi();

class Security extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countDownDesc: '',
      securityStatus: -1,
    };
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleSettingClick = this.handleSettingClick.bind(this);
    this.handleDocClick = this.handleDocClick.bind(this);
    this.turnOff = this.turnOff.bind(this);
    this.onAppActive = this.onAppActive.bind(this);
  }

  componentDidMount() {
    const { currentHomeId } = this.props;
    // if(this.props.mqttSubscribed) {
      this.getSecurityStatus().then(res => {
        if(res && res.ack && res.ack.code === 200) {
          const { status } = res.payload;
          this.setState({
          	securityStatus: status
          });
          if([4, 5].indexOf(status) !== -1) {
            this.enterCountDown(status, res.payload.remaining);
          }
        }
      });
      fetchMode({
        homeId: currentHomeId,
        securityType: SOS_MODE
      });
      fetchMode({
        homeId: currentHomeId,
        securityType: AWAY_MODE
      });
      fetchMode({
        homeId: currentHomeId,
        securityType: STAY_MODE
      });
    // }

    this.handleSecurityStatusChange();
    systemApi.onAppStatusChange(this.onAppActive);
  }

  onAppActive(res) {
    if(Number(res.status) === 0) {
      this.getSecurityStatus();
    }
  }

  componentWillUnmount() {
    MQTTService.offMessageReceive(this.onMqttMsgReveive);
    systemApi.offAppStatusChange(this.onAppActive);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.mqttStatus !== this.props.mqttStatus && nextProps.mqttStatus === 1) {
      //this.getSecurityStatus();
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    if(nextProps.status !== this.props.status) {
      return true;
    }

    if(nextProps.progress !== this.props.progress) {
      return true;
    }

    return false;
  }

  getSecurityStatus() {
    const { showDialog } = this.props.actions;
    const { currentHomeId } = this.props;

    Toast.loading('');
    return this.props.actions.getSecurityStatus({
      homeId: currentHomeId
    }).then(res => {
      const that = this;

      if(! res || !res.ack) {
        //Toast.info(res.desc);
        return res;
      }

      Toast.hide();
      if(res.ack.code === 200) {
        const { status } = res.payload;
        this.setState({
          securityStatus: status
        });
        if([4, 5].indexOf(status) !== -1) {
          this.enterCountDown(status, res.payload.remaining);
        }

      }

      if(res.ack.code !== 200) {
        //Toast.info(res.ack.desc);
      }

      return res;
    });
  }

  handleSecurityStatusChange() {
    this.onMqttMsgReveive = (res) => {
      
        let response = null;
  
        if (res && typeof(res.message) === 'string') {
          response = JSON.parse(res.message)
        }
  
        if (res && typeof(res.message) === 'object') {
          response = res.message
        }
        if (response === null ) {
          return;
        }

      const { service, method } = response;
      if(service === 'security' && method === 'statusChangedNotif') {
        console.log('---------statusChangedNotif------------', response);
        const { modes, actions, currentHomeId } = this.props;
        const { status, remaining } = response.payload;
        const { countDown, setStatus, fetchMode, stopCountingDown } = actions;

        if(status === 6) {
          return;
        }

        stopCountingDown();
        setStatus(status);
        if([0, 1, 3].indexOf(status) !== -1) {
          return;
        }

        this.enterCountDown(status, remaining);
      }
    };

    MQTTService.onMessageReceive(this.onMqttMsgReveive);
    if(window.tcpToGateway) {
      window.tcpToGateway.onReceiveMessage(this.onMqttMsgReveive);
    }
  }
  
  enterCountDown(status, remaining = -1) {
    const { modes, actions, currentHomeId, progress } = this.props;
    const { countDown, setStatus, fetchMode } = actions;
    const afterCount = () => {
      setStatus(armMode === AWAY_MODE ? 3 : 1);
    };
    let armMode;
    if(status === 4) {
      armMode = AWAY_MODE;
    }

    if(status === 5) {
      armMode = STAY_MODE;
    }

    if (!modes[armMode]) {
      fetchMode({
        homeId: currentHomeId,
        securityType: armMode
      }).then(res => {
        if(res.ack.code === 200) {
          const { defer } = res.payload;
          if(progress > 0) {
            return;
          }
          countDown(defer, remaining >= 0 ? (defer - remaining) / defer : null ).then(afterCount);
        }
      });
      
      return;
    }

    const { defer } = modes[armMode];
    if(progress > 0) {
      return;
    }

    countDown(defer, remaining >= 0 ? (defer - remaining) / defer : null).then(afterCount);
  }

  handleMenuClick() {
    this.props.history.goBack();
  }

  handleSettingClick() {
    this.props.history.goBack();
  }

  handleDocClick() {
    this.props.history.push('/menu');
  }

  hasSettedSiren(modeName) {
    const rule = this.props.modes[modeName];
    if(!rule && !rule.then || rule.then.length === 0) {
      Toast.info(langSecurity.tip.noSiren);
      return false;
    }

    return true;
  }
  
  openMode(armMode) {
    const { fetchMode, deployMode, countDown, stopCountingDown, showDialog, setStatus } = this.props.actions;
    const { modes, currentHomeId, status, history } = this.props;
		
		console.log("111111111111111111111111111111=",status, STATUS[armMode]);
    if(this.state.securityStatus === STATUS[armMode]) {
      console.log("666666666666666666=",status, STATUS[armMode]);
      return;
    }
    
    this.setState({
    	securityStatus: STATUS[armMode]
    });
    
    setStatus(STATUS[armMode]);
    
    const deploy = () => {
      return deployMode({
        armMode,
        homeId: currentHomeId
      }).then(res => {
        const { ack, payload } = res;
        const { modes, devices } = this.props;

        Toast.hide();

        if(!ack) {
          Toast.info(res.desc);
          return;
        }

        if(ack.code !== 200) {
          Toast.info(ack.desc);
        } else {

          if(armMode === SOS_MODE) {
            return;
          }

          if(payload.status === 5) {
            const oneMoreActive = payload.trigger.length > 1;
            const dialogContent = oneMoreActive 
              ? langSecurity.tip.someSensorsActive.replace('{mode}', armMode) 
              : langSecurity.tip.singleSensorActive
              	.replace('{mode}', armMode)
              	.replace('{device}', devices[payload.trigger[0].devId].name)
              	.replace('{status}',devices[payload.trigger[0].devId].devType=='Sensor_Doorlock'?'open':'active');
            showDialog(Lang.public.dialog.title[0], dialogContent, [
              {
                  text: oneMoreActive ? 'Tell me more' : 'No',
                  handleClick: function(){
                    if(oneMoreActive) {
                      history.push(`/security/sensorList/${armMode}`, { trigger: payload.trigger });
                    }
                    this.hide();
                  }
              },
              {
                  text: Lang.public.dialog.button[1],
                  className: "btn-split",
                  handleClick: function(){
                    this.hide();
                    bypass({
                      homeId: currentHomeId
                    }).then(res => {
                      if(res.ack && res.ack.code === 200) {
                        //stopCountingDown();
                        //countDown(modes[armMode].defer);
                        return;
                      }
                      if (res.ack) {
                        Toast.info(res.ack.desc);
                      }else{
                        Toast.info(res.desc);
                      }
                      
                    });
                  }
              }
            ]);
            return;
          }

          if(payload.status === 4) {
            Toast.info(ack.desc);
            return;
          }
          console.log("我的modes====",modes);
          stopCountingDown();
          countDown(modes[armMode].defer);
        }
      });
    };
    
    Toast.loading('');
    if (!modes[armMode]) {
      fetchMode({
        homeId: currentHomeId,
        securityType: armMode
      }).then(res => {
        if(res.ack.code === 200) {
          if(!res.payload.securityId || (res.payload.then && res.payload.then.length === 0)) {
            this.props.history.push(`/security/mode/${armMode}`);
            Toast.hide();
          } else {
            deploy();
          }
        } else {
          Toast.info(res.ack.desc);
        }
      });
      
      return;
    }

    if(!modes[armMode].securityId || modes[armMode].then.length === 0) {
      this.props.history.push(`/security/mode/${armMode}`);
      Toast.hide();
      return;
    }

    deploy();
  }

  turnOff() {
    const { deployMode, stopCountingDown } = this.props.actions;
    const { modes, status, currentHomeId }  = this.props;
    let sirenId;

    if(status === STATUS.off){
      Toast.info(langSecurity.tip.noModeEnable);
      return;
    }
    
    this.setState({
    	securityStatus: 0,
    });

    const onError = function(err){
      console.log(err);
      Toast.info(langSecurity.tip.disarmFailed);
    };
    const onSuccess = function(res){
      if(!res.ack) {
        Toast.info(res.desc);
        return;
      }

      if(res.ack.code != 200) {
        Toast.info(res.ack.desc);
        return;
      }

      Toast.hide();
      stopCountingDown();
    };
    Toast.loading('', 0);
    deployMode({
      homeId: currentHomeId,
      armMode: 'off',
    }).then(onSuccess);
  }

  getCoundDownDesc(mode, delay) {
    return langSecurity.countDownDesc.replace('{mode}', mode.toLowerCase()).replace('{duration}', delay)
  }

  render() {
    const { modes, status } = this.props;
    const spinerItemHeight = '15px';
    const stayMode = modes && modes[STAY_MODE];
    const awayMode = modes && modes[AWAY_MODE];
    const stayModeEnable = (status === STATUS.stay || status === STATUS.stayDelay);
    const awayModeEnable = (status === STATUS.away || status === STATUS.awayDelay);
    // const sosModeEnable = status === STATUS.sos;
    const inStayMode = stayModeEnable && this.props.progress >= 1;
    const inAwayMode = awayModeEnable && this.props.progress >= 1;
    const modeOff = status === STATUS.off && this.props.progress === 0;
    const countDownDescs = {
      stayMode: stayModeEnable ? modes[STAY_MODE] &&  this.getCoundDownDesc(langSecurity.stay, modes[STAY_MODE].defer) : '',
      awayMode: awayModeEnable ? modes[AWAY_MODE] && this.getCoundDownDesc(langSecurity.away, modes[AWAY_MODE].defer) : '',
    }
    const countDownDesc = this.state.countDownDesc
      || countDownDescs.stayMode
      || countDownDescs.awayMode
      || '';
    const modeStatus = inAwayMode && langSecurity.awayModeEnable
      || (inStayMode && langSecurity.stayModeEnable)
      // || (sosModeEnable && 'SOS mode Enable')
      || (modeOff && langSecurity.disarm)
      || countDownDesc;
    // const modeStatus = '';
    // const countDownDesc = '';
    const progress = this.props.progress;
    let vw = document.documentElement.clientWidth;
    let scale = (vw / 375).toFixed(2);
    //console.log('progress r',  8 * 12 * scale, vw, window.devicePixelRatio)
    scale = (scale > 1.4 ? 1 : scale) * 12;

    const progress_r = 9; // rem
    const spiner_r = 11;
    // 转圈动画的竖条
    const spinerItems = [];
    for(let i = 0; i < 60; i++){
      spinerItems.push(
        <div 
          style={{
            transform: `rotate(${360 / 60 * i}deg)`,
            animationDelay: `${(60 - i) * -0.1}s`,
            transformOrigin: `${spiner_r * scale}px ${spiner_r * scale}px`,
          }}
          key={i}>
        </div>
        );
    }

    return (
      <div className="security-main">
        <BarTitle>
          <Link to="/menu" className="icon menu" />
          <Link to="/security/record" className="icon record" />
          <Link to="/security/setting" className="icon setting" />
        </BarTitle>
        <div>
          <i className={'status_icon ' + (this.props.progress >= 1 ? 'status_icon_success' : (modeOff ? 'status_icon_off' : 'status_icon_none'))}></i>
          <CircularProgress
            style={{
              top: `${64 + 36 + spiner_r * scale - progress_r * scale - 5}px`,
              left: `${vw / 2 - progress_r * scale - 5}px`
            }}
            className="circular-progress" 
            pointR={this.props.progress < 1 ? 5 : 0} 
            r={ progress_r * scale} 
            progress={this.props.progress} 
            strokeWidth={5} 
          />
          <div 
            className={'lds_spinner ' +　(progress > 0 ? 'lds_spinner_animation' : '')}
            style={{
              top: `${64 + 36}px`,
              left: `${vw / 2 - spiner_r * scale}px`
            }}
          >
            {spinerItems}
          </div>
          <div className="status_desc">
            <p>{modeStatus}</p>
          </div>

        </div>
       <footer>
        <div className="mode_btn">
          <a
            onClick={this.turnOff}
            className={'mode_icon mode_icon_off ' + ( modeOff ? 'mode_icon_on' : '')}
          ></a>
          <span className="mode_btn-text">{Lang.security.off}</span>
        </div>
        <div className="mode_btn">
          <a
            onClick={() => this.openMode(STAY_MODE)}
            className={'mode_icon mode_icon_stay ' + ( stayModeEnable ? 'mode_icon_on' : '')}
          ></a>
          <span className="mode_btn-text">{Lang.security.stay}</span>
        </div>
        <div className="mode_btn">
          <a
            onClick={() => this.openMode(AWAY_MODE)}
            className={'mode_icon mode_icon_away ' + ( awayModeEnable ? 'mode_icon_on' : '')}
          ></a>
          <span className="mode_btn-text">{Lang.security.away}</span>
        </div>
        <div className="mode_btn">
          <a
            onClick={() => this.openMode(SOS_MODE)}
            className='mode_icon mode_icon_sos'
          ></a>
          <span className="mode_btn-text">{Lang.security.sos}</span>
        </div>
       </footer>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    modes: state.security.modes.list,
    isFetching: state.security.modes.isFetching,
    status: state.security.modes.status,
    mqttStatus: state.system.mqttStatus,
    mqttSubscribed: state.system.mqttSubscribed,
    progress: state.security.modes.progress,
    devices: state.device.items,
    currentHomeId: state.family.currentId,
    receiveMqttMessage: state.system.receivePushMessage,
    directDevIds: state.device.directDevIds || {}
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(
      {
        fetchMode,
        getSecurityStatus,
        deployMode,
        setStatus,
        countDown,
        stopCountingDown,
        showDialog: showDialogAction
      },
      dispatch
    ),
  }
};

export default connect(mapStateToProps,mapDispatchToProps)(Security);
