import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import BarTitle from '../component/barTitle';
import './default/style.css';
import Picker from 'antd-mobile/lib/picker';
import Toast from 'antd-mobile/lib/toast';
import { bindActionCreators } from 'redux';
import automation from '../jssdk/automation';
import { showDialog } from '../action';
import { 
	STAY_MODE,
	AWAY_MODE,
	editMode,
  setSirenTime,
  setSirenVolume
} from '../action/security'
import { Lang } from '../public';
import { EFFECTIVE_TIME_LIST } from './EffectiveTime';
import { VOLUME_LIST } from './Volume';

const langSecurity = Lang.security;

class siren extends React.Component {
  constructor(props) {
    super(props);
    this.goBackEvent = this.goBackEvent.bind(this);
    this.handleDoneClick = this.handleDoneClick.bind(this);

    this.automationApi = new automation;

  }

  goBackEvent(){
    const { showDialog } = this.props.actions;
    const dialogLang = Lang.public.dialog;
    const that = this;
    if(this.props.siren.modified) {
      showDialog('', Lang.device.saveChangeConfirm, [
        {
          text: dialogLang.button[0],
          handleClick: function () {
            this.hide();
            that.resetTimeAndVolume();
            that.props.history.goBack();
          }
        }, 
        {
          text: dialogLang.button[1],
          className: "btn-split",
          handleClick: function () {
            this.hide();
            that.handleDoneClick();
          }
        }
      ])
    } else {
      this.resetTimeAndVolume();
      this.props.history.goBack();
    }
    
  }

  resetTimeAndVolume(){
    const { setSirenTime, setSirenVolume } = this.props.actions;
    setSirenTime(undefined);
    setSirenVolume(undefined;
  }

  componentDidMount(){
    const { setSirenTime, setSirenVolume } = this.props.actions;
    const { siren, modes } = this.props;  

    if(typeof siren.time !== 'number'){
      let time = 60;
      try{
        let then = (modes[AWAY_MODE] || modes[STAY_MODE]).rule.then;
        time =  then[0].attr.WarningDuration;
      } catch(e){}
      setSirenTime(time);
      console.log('----------siren mount--------time', time, modes);
    }

    if(typeof siren.volume !== 'number'){
       let volume = 2;
      try{
        let then = (modes[AWAY_MODE] || modes[STAY_MODE]).rule.then;
        volume =  then[0].attr.SirenLevel || 2;
      } catch(e){}
      setSirenVolume(volume);
      console.log('----------siren mount--------volume', volume, modes);
    }

  }

  handleDoneClick(){

    const { modes } = this.props; 
    const { siren } = this.props; 

      Toast.loading('', 0);
      let promiseList = []; 
      let requestCount = Object.keys(modes).length;
      for(let modeType in modes){
        
        let rule = modes[modeType].rule;
        if(rule && rule.then && rule.then.length > 0) {
          let parameter = {
            ...rule,
            enable: !!modes[modeType].enable,
            then: rule.then.map(item => {
              return {
                 parentId: item.parentId,
                 idx: item.idx,
                 thenType: item.thenType,
                 id: item.id,
                 attr: {
                  WarningMode: 1,
                  Strobe: 1,
                  WarningDuration: siren.time,
                  SirenLevel: siren.volume
                 }
               }
            })
          };
          this.automationApi.editAutoRule({payload: parameter}).then(res => {
            requestCount = requestCount - 1;
            if(res.ack.code === 200){
              const { editMode } = this.props.actions;
              editMode(modeType, parameter);
            }

            if(requestCount === 0) {
              Toast.hide();
              this.resetTimeAndVolume();
              this.props.history.goBack();
            }
           }).catch(res =>{
             Toast.info(res.desc);
           });  
         }
     }

     if(requestCount === 0) {
      Toast.info(langSecurity.tip.no)
     }
  }

  render() {
 
    const { siren, modes } = this.props;  
    const list=[
        
        {   
          title:'Volume',              
        },
        {  
            title:'Effective time',         
        }
    ];
    const volume = VOLUME_LIST.filter(item => item.value === this.props.siren.volume)[0];
    const time = EFFECTIVE_TIME_LIST.filter(item => item.value === this.props.siren.time)[0]
    return (
      <div>
        <BarTitle title={langSecurity.pageTitle.siren} onBack={this.goBackEvent}  onDone={this.handleDoneClick}/>
        <div className="setttings">
          <ul>
	        		<li>
                <Link to={'/security/volume'} >{list[0].title}</Link>
                <div className="volume-content">{volume ? volume.title : ''}</div>
              </li>
              <li>
                <Link to={'/security/alarmDuration'} >{list[1].title}</Link>
                <div className="volume-content">{time ? time.title : ''}</div>
              </li>
          </ul>
          </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    siren: state.security.siren,
    modes: state.security.modes.list,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(
      {
				editMode,
        setSirenTime,
        setSirenVolume,
        showDialog
      }, 
      dispatch
    ),
  }
};

export default connect(mapStateToProps,mapDispatchToProps)(siren);