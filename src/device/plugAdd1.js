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

class PlugAdd1 extends Component {
  constructor(props) {
    super(props);

    this.device = new Device;
    this.systemApi = new SystemApi;
    this.handleClickBack = this.handleClickBack.bind(this);
    this.handleClickToSet = this.handleClickToSet.bind(this);
  }

  handleClickBack(event){
  	this.props.history.goBack();
  }
  
  handleClickToSet({}){
  	let type = this.props.type;
  	if(type =="BLEplug"){
  		this.props.history.push('/device/plugAdd2/BLEplug');
  	}else if(type =="plug"){
  		this.props.history.push('/device/plugAdd2/plug');
  	}
  	console.log("wcb type : ",this.props.type);
  }  
  
  componentDidMount(){
    this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
  }
  
  componentWillUnmount(){
  }
  
  
  render() {
    return (
      <div className="device addLight">
        <BarTitle onBack={this.handleClickBack} title={Lang.device.plugAdd1.title} />
        <ScrollView>
        <div className="addWrap">
        	<div className="desc"></div>
        	<p className="addDesc">{Lang.device.plugAdd1.addDesc}</p>      	
        	<div className="nextStep background-Plug1"></div>
          <button className ="nextBtn" onClick={this.handleClickToSet}>{Lang.device.plugAdd1.nextStep}</button>
          
        </div>
        </ScrollView>
      </div>
    );
  }
}

//将state绑定到props
const mapStateToProps = (state, ownProps) => {
	const currentType = ownProps.match.params.type;
  return {
  	type:currentType
  }
};
//将action的所有方法绑定到props上
const mapDispatchToProps = (dispatch) => {
  return {
    showDialog: (...args) => dispatch(showDialog(...args))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(PlugAdd1);