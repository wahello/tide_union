import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import Toast from 'antd-mobile/lib/toast';
import 'antd-mobile/lib/toast/style/css';
import { bindActionCreators } from 'redux';
import './default/style.css';
import BarTitle from '../component/barTitle';
import DeviceItem from '../component/deviceItem';
import Switch from '../component/switch';
import automation from '../jssdk/automation';
import { setSecurityRule } from '../jssdk/Security';
import ScrollView from '../component/scrollView';
import {
  STAY_MODE,
  AWAY_MODE,
  SOS_MODE,
  fetchMode,
  editMode,
  addMode,
  setCurrentModes,
  setLEDMode,
  setDelay,
  setSirenTime,
  setSirenVolume,
} from '../action/security';
import { showDialog } from '../action';
import { Lang } from '../public';
import { DELAY_LIST } from './DelayTime';
import AlarmVolume, { VOLUME_LIST } from './AlarmVolume';
import { ALARM_DURATION_LIST } from './AlarmDuration';
import { LED_MODES } from './LEDMode';


const langSecurity = Lang.security;

class Mode extends Component {
  constructor(props) {
    super(props);
    const { modeType } = this.props.match.params;
    this.state = {
      modeType,
      checked: [],
      data: [],
      sirenArr: []
    };
    this.cookies = new Cookies();
    this.noDevice = true;
    this.handleBackClick = this.handleBackClick.bind(this);
    this.handleDoneClick = this.handleDoneClick.bind(this);
    this.handleSwitchClick = this.handleSwitchClick.bind(this);
    this.handleSetDelay = this.handleSetDelay.bind(this);
    this.handleSetLedMode = this.handleSetLedMode.bind(this);
    this.handleSetAlarmVolume = this.handleSetAlarmVolume.bind(this);
    this.handleSetAlarmDuration = this.handleSetAlarmDuration.bind(this);
    this.automationApi = new automation();
  }

  componentDidMount() {
    this.init();
  }

  init() {
    const { delay, siren, ledMode, modes } = this.props;
    const { setCurrentModes, setSirenTime, setSirenVolume, setLEDMode } = this.props.actions;

    setCurrentModes(this.state.checked);
    if (typeof delay.duration !== 'number') {
      let delayTime;
      try {
        delayTime = modes[this.state.modeType].defer;
      } catch (e) {
        delayTime = DELAY_LIST[3].value;
      }
      this.props.actions.setDelay(delayTime >= 0 ? delayTime : DELAY_LIST[3].value);
    }

    if (typeof ledMode.value !== 'string') {
      let value;
      try {
        let then = modes[this.state.modeType].then;
        value = then[0].attr.strobe;
      } catch (e) {
        value = 'off';
      }

      setLEDMode(value);
    }

    if(typeof siren.time !== 'number'){
      let time;
      try{
        let then = modes[this.state.modeType].then;
        time =  then[0].attr.warning_duration;
      } catch(e){
        time = ALARM_DURATION_LIST[3].value;
      }

      setSirenTime(time >= 0 ? time : ALARM_DURATION_LIST[3].value);
    }

    if(typeof siren.volume !== 'string'){
       let volume;
      try{
        let then = modes[this.state.modeType].then;
        volume =  then[0].attr.SirenLevel || VOLUME_LIST[1].value;
      } catch(e){
        volume = VOLUME_LIST[1].value;
      }

      setSirenVolume(volume);
    }


    if (delay.modelChecked.length > 0) {
      this.setState({
        checked: delay.modelChecked,
      });
    } else {
      try {
        this.setState({
          checked: this.props.modes[this.state.modeType].if.trigger.map(item => item.devId),
        });
      } catch (e) {
        // do nothing
      }
    }

    const sensors = [];
    for (let i = 0; i < this.props.deviceList.length; i += 1) {
      const deviceType = this.props.deviceItem[this.props.deviceList[i]].devType;

      if (deviceType.toLowerCase().indexOf('sensor') > -1) {
        this.noDevice = false;
        sensors.push(this.props.deviceList[i])
      }
    }
    
    this.setState({
      data: sensors
    });
  }


  handleSwitchClick(checked, id) {
    if (checked && this.state.checked.indexOf(id) === -1) {
      this.triggerChanged = true;
      this.setState(prevState => ({
        checked: [...prevState.checked, id],
      }));
    } else if (!checked && this.state.checked.indexOf(id) !== -1) {
      this.triggerChanged = true;
      this.setState(preState => ({
        checked: preState.checked.filter(v => v !== id),
      }));
    }
  }

  handleSetDelay() {
    const { setCurrentModes } = this.props.actions;
    setCurrentModes(this.state.checked);
    this.props.history.push('/security/delayTime');
  }

  handleSetLedMode() {
    this.props.history.push('/security/ledMode');
  }

  handleSetAlarmVolume() {
    this.props.history.push('/security/alarmVolume');
  }

  handleSetAlarmDuration() {
    this.props.history.push('/security/alarmDuration');
  }

  handleBackClick() {
    const that = this;
    const dialogLang = Lang.public.dialog;
    const { showDialog } = this.props.actions;
    const {delay, ledMode, siren} = this.props;
    if (delay.modified || ledMode.modified || this.triggerChanged || siren.modified) {
      showDialog('', Lang.device.saveChangeConfirm, [
        {
          text: dialogLang.button[0],
          handleClick() {
            this.hide();
            that.resetData();
            that.props.history.goBack();
          },
        },
        {
          text: dialogLang.button[1],
          className: 'btn-split',
          handleClick() {
            this.hide();
            that.handleDoneClick();
          },
        },
      ]);
    } else {
      that.resetData();
      that.props.history.goBack();
    }
  }

  resetData() {
    const { setCurrentModes, setDelay, setSirenTime, setSirenVolume, setLEDMode } = this.props.actions;
    setCurrentModes([]);
    setDelay(undefined);
    setSirenTime(undefined);
    setSirenVolume(undefined);
    setLEDMode(undefined);
  }

  handleDoneClick() {
    const modeData = this.props.modes && this.props.modes[this.state.modeType];

    if(this.state.modeType !== SOS_MODE) {
      if (this.noDevice) {
        Toast.info(langSecurity.tip.noDevice);
        return;
      }

      if (!this.state.checked.length) {
        Toast.info(langSecurity.tip.notSelectedDevice);
        return;
      }
    }

     Toast.loading('', 0);
      const parameter = {
        cookieUserId: this.cookies.get('userId'),
        cookieUserToken: this.cookies.get('userToken'),
        name: this.state.modeType,
        homeId: this.props.currentHomeId,
        type: 'dev',
        enable: false,
      };

      this.saveMode(modeData.securityId, parameter.enable, true);
   }


  saveMode(autoId, enable, isNew) {
    const { editMode } = this.props.actions;
    const { delay, ledMode, siren, modes, gateWayId } = this.props;
    const idx = 1;

    const triggerArr = [];
    this.state.checked.forEach((item) => {
      if (!this.props.deviceItem[item]) {
        return;
      }

      const dev = this.props.deviceItem[item];
      if (!dev.online) {
        Toast.info(langSecurity.offlineTips, 4);
        return;
      }
      const triggerDev = {
        idx: idx + 1,
        parentId: this.props.deviceItem[item].parentId,
        trigType: 'dev',
        devId: item,
        compOp: '==',
        value: '1',
        attr: dev.devType === 'Sensor_Doorlock' ? 'Door' : 'Occupancy',
      };
      triggerArr.push(triggerDev);
    });

    const thenSiren = [];
    const attr = {
      warning_mode: 'fire',
      warning_duration: siren.time,
      siren_level: siren.volume,
      strobe: ledMode.value,
      strobe_level: 'high'
    }
    console.log('------gatewayid------', this.props.gateWayId)
    const thenDev = {
      idx: idx + 1,
      thenType: 'dev',
      id: `${gateWayId}`,
      attr,
    };
    thenSiren.push(thenDev);

    const delayTime = delay.duration;
    const payload = {
      securityId: `${autoId}`, // res.data.autoId
      defer: delayTime,
      securityType: this.state.modeType,
      enabled: enable ? 1 : 0,
      if: {
        trigger: triggerArr,
      },
      then: thenSiren,
    };


    editMode(payload).then((res) => {
      console.log(this.props.actions);
      if (res.ack.code === 200) {
        this.resetData();
        this.props.history.goBack();
        Toast.hide();
      } else {
        Toast.info(res.ack.desc);
      }
    }).catch((res) => {
      Toast.info(res.desc);
    });
  }

  render() {
    const delayTime = DELAY_LIST.filter(item => item.value === this.props.delay.duration)[0];
    const alarmVolume = VOLUME_LIST.filter(item => item.value === this.props.siren.volume)[0];
    const alarmDuration = ALARM_DURATION_LIST.filter(item => item.value === this.props.siren.time)[0];
    const ledMode = LED_MODES.filter(item => item.value === this.props.ledMode.value)[0];
    const title = {
      [STAY_MODE]: langSecurity.pageTitle.stayMode,
      [AWAY_MODE]: langSecurity.pageTitle.awayMode,
      [SOS_MODE]: langSecurity.pageTitle.sosMode,
    }
    return (
      <div className="security-mode">
        <BarTitle
          title={title[this.state.modeType]}
          onBack={this.handleBackClick}
          onDone={this.handleDoneClick}
        />
        <ScrollView>
          <h2>
            General settings
          </h2>
          { this.state.modeType === SOS_MODE ? '' :　<div
            role="button"
            tabIndex="0"
            onClick={this.handleSetDelay}
            className="security-set-time">
            <span>Delay Time</span>
            <span>{delayTime ? delayTime.title : ''}</span>
          </div>}
          <div
            role="button"
            tabIndex="0"
            onClick={this.handleSetAlarmVolume}
            className="security-set-time">
            <span>Alarm volume</span>
            <span>{alarmVolume ? alarmVolume.title : ''}</span>
          </div>
          <div
            role="button"
            tabIndex="0"
            onClick={this.handleSetLedMode}
            className="security-set-time">
            <span>LED mode</span>
            <span>{ledMode ? ledMode.title : ''}</span>
          </div>
          <div
            role="button"
            tabIndex="0"
            onClick={this.handleSetAlarmDuration}
            className="security-set-time">
            <span>Alarm duration</span>
            <span>{alarmDuration ? alarmDuration.title : ''}</span>
          </div>
          { this.state.modeType !== SOS_MODE ? <Fragment>
            <h2>
              Devices
            </h2>
            <ul>
              {
                this.state.data.length > 0
                ? this.state.data.map((item) => (
                  <DeviceItem
                    key={item}
                    checkStatus={this.state.checked.indexOf(item) !== -1}
                    parentName={this.props.roomItem[this.props.deviceItem[item].roomId] == null ? 'Default' : this.props.roomItem[this.props.deviceItem[item].roomId].name}
                    deviceName={this.props.deviceItem[item].name}
                    type={this.props.deviceItem[item].icon}
                    online={this.props.deviceItem[item].online}>
                    <Switch
                      onClick={checked => this.handleSwitchClick(checked, item)}
                      checked={this.state.checked.indexOf(item) !== -1}
                      disabled={!this.props.deviceItem[item].online}
                    />
                  </DeviceItem>))
                 : <div style={{ color: 'rgba(255,255,255,0.50)', textAlign: 'center' }}>{langSecurity.noDevice}</div>
              }
            </ul>
          </Fragment> : null}
        </ScrollView>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  delay: state.security.delay,
  siren: state.security.siren,
  ledMode: state.security.ledMode,
  currentHomeId: state.family.currentId,
  deviceList: state.device.list,
  deviceItem: state.device.items,
  roomItem: state.room.items,
  modes: state.security.modes.list,
  gateWayId: state.device.directDevIds.gateway[0],
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      editMode,
      addMode,
      setCurrentModes,
      setDelay,
      setSirenTime,
      setSirenVolume,
      setLEDMode,
      showDialog,
    },
    dispatch,
  ),
});
export default connect(mapStateToProps, mapDispatchToProps)(Mode);
