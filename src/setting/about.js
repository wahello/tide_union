import React, { Component } from 'react';
import './default/style.css';
import { showDialog } from '../action';
import { connect } from 'react-redux';
import { Lang } from '../public';
import BarTitle from '../component/barTitle';
import SystemApi from '../jssdk/system';

class About extends Component {
  constructor(props) {
  	super(props);
    this.state = {
      version: window.navigator.userAgent
    };
    const { dispatch } = props;
    this.dispatch = dispatch;
    this.systemApi = new SystemApi;
    
    this.handleClickBack = this.handleClickBack.bind(this);
    this.handleClickLI = this.handleClickLI.bind(this);
	}

  handleClickBack(event){
  	this.props.history.goBack();
  }
  
  handleClickLI(event){
  	this.dispatch(showDialog(Lang.public.dialog.title[0], Lang.setting.about.dialog.fail.desc));
  }

  componentDidMount(){
    this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
  }
  
  render() {
  	
    return (
      <div className="setting default">
        <div className="about">
          <BarTitle onBack={this.handleClickBack} title={Lang.setting.about.title}/>
          <div className="bodyer">
            <p className="logo"></p>
            <p className="name">{Lang.setting.about.appName} {this.state.version}</p>
            <ul>
              <li onClick={this.handleClickLI}>
                {Lang.setting.about.appUpdate}<span>{Lang.setting.about.appState[0]}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(About)