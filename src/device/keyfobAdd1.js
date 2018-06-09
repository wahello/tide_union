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


const dialogLang = Lang.public.dialog;
const deviceLang = Lang.device;

class KeyfobAdd1 extends Component {
  constructor(props) {
    super(props);

    this.device = new Device;
    this.systemApi = new SystemApi;
    this.handleClickBack = this.handleClickBack.bind(this);
    this.handleClickToSet = this.handleClickToSet.bind(this);
    this.handleToHelp = this.handleToHelp.bind(this);
  }
  
  handleToHelp(event){
	this.props.history.push('/device/keyfobAdd2');
  }
  
  handleClickBack(event){
    this.props.history.goBack();
  }
  
  handleClickToSet({}){
    this.props.history.push('/device/keyfobAdd3');
  }  
  componentDidMount(){
    this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
  }
  
  componentWillUnmount(){
  }
  
  render() {
    return (
      <div className="device addLight">
        <BarTitle onBack={this.handleClickBack} title={Lang.device.keyfob.title} />
        <ScrollView>
        <div className="addWrap">
        	<div className="desc"></div>
        	<p className="addDesc">{Lang.device.keyfob.desc2}</p>      	
        	<div className="nextStep backgroud-keyfob2"></div>
          <button className ="nextBtn" onClick={this.handleClickToSet}>{Lang.device.doorAdd2.nextStep}</button>
          <div className="help" onClick={this.handleToHelp}>{Lang.device.keyfob.help}</div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(KeyfobAdd1);