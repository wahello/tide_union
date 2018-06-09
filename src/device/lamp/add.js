import React, { Component } from 'react';
import Device from 'src/jssdk/device';
import BarTitle from 'src/component/barTitle';
import ScrollView from 'src/component/scrollView';
import { showDialog } from 'src/action';
import helper from 'src/public/helper';
import SystemApi from 'src/jssdk/system';
import { Lang, Style } from '../resource';
import { connect } from 'react-redux';


const dialogLang = Lang.public.dialog;
const deviceLang = Lang.device;

class LightAdd extends Component {
  constructor(props) {
    super(props);

    this.device = new Device;
    this.systemApi = new SystemApi;
    this.handleClickBack = this.handleClickBack.bind(this);
    this.handleClickToSet = this.handleClickToSet.bind(this);
     this.handleToHelp = this.handleToHelp.bind(this);
  }
	handleToHelp(event){
		 this.props.history.push('/device/lamp/addHelp');
		}
  handleClickBack(event){
  	this.props.history.goBack();
  }
  
  handleClickToSet({}) {
    this.props.history.push('/device/searchHub/Lighting');
  }  
  
  componentDidMount(){
    this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
  }
  
  componentWillUnmount(){
  }
  
  
  render() {
    return (
      <div className="device lamp add">
        <BarTitle onBack={this.handleClickBack} title={Lang.device.add1.title} />
        <ScrollView>
	        <div className="addWrap">
	        	<div className="desc">{Lang.device.add1.desc}</div>
	        	<p className="addDesc">{Lang.device.add1.addDesc}</p>      	
	        	<div className="nextStep backgroud-Light"></div>
	          <button className ="nextBtn" onClick={this.handleClickToSet}>{Lang.device.add1.nextStep}</button>
	          <div className="help" onClick={this.handleToHelp}>{Lang.device.add1.help}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(LightAdd);