import React, { Component } from 'react';
import Device from '../jssdk/device';
import BarTitle from '../component/barTitle';
import ScrollView from '../component/scrollView';
import { showDialog } from '../action';
import helper from '../public/helper';
import SystemApi from '../jssdk/system';
import { Lang } from '../public';
import { connect } from 'react-redux';
import './default/style.css';
import GuideComponent from './component/guideComponent';


const dialogLang = Lang.public.dialog;
const deviceLang = Lang.device;

class SirenHubAdd1 extends Component {
  constructor(props) {
    super(props);

    this.device = new Device;
    this.systemApi = new SystemApi;
    this.handleClickBack = this.handleClickBack.bind(this);
    this.handleOnNext = this.handleOnNext.bind(this);
  }

  handleClickBack(event){
  	this.props.history.goBack();
  }
  
  
  componentDidMount(){
    this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
  }
  
  componentWillUnmount(){
  	
  }
  
  handleOnNext(event){
  	console.log("handleOnNext click");
  	//this.props.history.push(`/device/selectSirenhubWifi`);
  	const path = {
			pathname: `/device/selectWifi`,
			searchType: "AP"
		};
		window.globalState.deviceType = 'sirenhub';
  	this.props.history.push(path);
  }
    
  render() { 		
    return (
      <div className="device addSiren">
        <BarTitle onBack={this.handleClickBack} title={Lang.device.sirenhubAdd3.title} />
        <ScrollView>
	        <div className="addWrap">	        	
	        	<p className="addDesc">{Lang.device.sirenhubAdd3.addDesc}</p>      	
	        	<div className="nextStep backgroud-Siren-Hub3"></div>	                    
	        </div>
	        <button className ="nextBtn addSiren3" onClick={this.handleOnNext}>{Lang.device.sirenhubAdd3.nextStep}</button>	
        </ScrollView>
      </div>
    );
  }
}

//将state绑定到props
const mapStateToProps = (state) => {
  return {
  }
};
//将action的所有方法绑定到props上
const mapDispatchToProps = (dispatch) => {
  return {
    showDialog: (...args) => dispatch(showDialog(...args))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SirenHubAdd1);