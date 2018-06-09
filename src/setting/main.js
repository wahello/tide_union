import React, { Component } from 'react';
import './default/style.css';
import { Lang } from '../public';
import BarTitle from '../component/barTitle';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import JSBridge from '../jssdk/JSBridge'
import { showDialog, selectTab } from '../action';
import { connect } from 'react-redux';
import Switch from '../component/switch'


class SetingMain extends Component {
  constructor(props) {
  	super(props);
    this.state = {
    		version: window.navigator.userAgent.match(/\/(\d+\.\d+\.\d+\.\d+)/)[1],
    		viewName: "main"
    }

    this.jsBridge = JSBridge;
    this.onLogout = this.onLogout.bind(this);
    this.handleClickBack = this.handleClickBack.bind(this);
    this.handleOnOff = this.handleOnOff.bind(this);
    this.clearCacheClick = this.clearCacheClick.bind(this);
    this.upgradeVersion = this.upgradeVersion.bind(this);
    
  }
  
  clearCacheClick(){

    let that = this;
    that.props.showDialog('' , 'Clear cache won\'t remove device data and personal info', [
      {
          text: 'Cancel',
          handleClick: function(){
            this.hide();
          }
      },
      {
          text: 'Clear Now',
          className: "btn-split",
          handleClick: function(){
            this.hide();
          }
      }]);

  }

  upgradeVersion(){

    let that = this;
    that.props.showDialog('' , 'Do you agree to upgrade to the latest version?', [
      {
          text: 'Diagree',
          handleClick: function(){
            this.hide();
          }
      },
      {
          text: 'Agree',
          className: "btn-split",
          handleClick: function(){
            this.hide();
          }
      }]);

  }


  handleOnOff(){
    
    
  }
  
  handleClickBack(){
  	this.props.history.goBack();
  }
  onLogout(){
    let that = this;
    that.props.showDialog(Lang.public.dialog.title[0], Lang.user.login.sureToLogout, [
      {
          text: Lang.public.dialog.button[0],
          handleClick: function(){
            this.hide();
          }
      },
      {
          text: Lang.public.dialog.button[1],
          className: "btn-split",
          handleClick: function(){
            this.hide();
            let cookies = new Cookies;
            cookies.remove('isLogined');
            cookies.remove('password');
            that.props.history.replace('/user/login');
            that.props.selectTab('device');
            that.jsBridge.send({
              url: 'send',
              data: {
                service: 'MQTT',
                action: 'disconnect'
              }
            });
          }
        }]);
  }

  componentDidMount(){
  }
  
  render() {
    return (
      <div className="setting default">
              
        <BarTitle onBack={this.handleClickBack.bind(this)} title = 'Setting'></BarTitle>
        <div className="main">
          <ul>
            <li>
              <div className="Receive-notifications">
                Receive notifications
                <Switch onClick={OnOff => this.handleOnOff}/>
                
              </div>
            </li>
            <Link to="/setting/Feedback">
              <li>
                Send feedback
                <div className="devRight"></div>
              </li>
            </Link>
            <li>
              <div onClick={this.clearCacheClick.bind(this)}>Clear cache （43.66M)</div>
              <div className="devRight"></div>  
            </li>
            <Link to="/setting/help">
            <li>
              <div>{Lang.setting.help.title}</div>
              <div className="devRight"></div>  
            </li>
            </Link>
          	{/*<li><Link to="/setting/agreement">{Lang.setting.agreement.title}</Link></li>*/}
          </ul>
          <a className="version">{Lang.setting.version} {this.state.version}</a>
		  
          <a className="version">{Lang.setting.version} {this.state.version}</a>
          {/* <a className="btn-logout" onClick={this.onLogout}>{Lang.user.login.signOut}</a> */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedTab: state.other.selectedTab
  }
}

const mapDispatchToProps = dispatch => {
  return {
    selectTab: (...args) => dispatch(selectTab(...args)),
    showDialog: (...args) => dispatch(showDialog(...args))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetingMain)