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

class lightAddHelp extends Component {
  constructor(props) {
    super(props);

    this.device = new Device;
    this.systemApi = new SystemApi;
    this.handleClickBack = this.handleClickBack.bind(this);
    this.handleClickToSet = this.handleClickToSet.bind(this);
    this.handleToHelp = this.handleToHelp.bind(this);
  }
	handleToHelp(event){
			console.log("handleToHelp event",this.state);
		}
  handleClickBack(event){
  	this.props.history.goBack();
  }
  
  handleClickToSet({}) {
    const { searchType } = this.props;
    if(searchType == "BLELighting"){
      this.props.history.push('/device/SearchBLEDevice/BLELighting');
    }else{
      this.props.history.push('/device/searchHub/light');
    }
  }  
  
  componentDidMount(){
    this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
  }
  
  componentWillUnmount(){
  }
  
  
  render() {
    return (
      <div className="device addLight">
        <BarTitle onBack={this.handleClickBack} title={Lang.device.help.title} />
        <ScrollView>
        <div className="addWrap">
        	<p className="addDesc">{Lang.device.help.addDesc}</p>      	
        	<div className="nextStep backgroud-Light2"></div>
          <button className ="nextBtn" onClick={this.handleClickToSet}>{Lang.device.help.nextStep}</button>
        </div>
        </ScrollView>
      </div>
    );
  }
}

//将state绑定到props
const mapStateToProps = (state,ownProps) => {
  return {
    searchType: ownProps.match.params.type,
  }
};
//将action的所有方法绑定到props上
const mapDispatchToProps = (dispatch) => {
  return {
    showDialog: (...args) => dispatch(showDialog(...args))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(lightAddHelp);