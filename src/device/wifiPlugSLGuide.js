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

class WifiPlugSLGuide extends Component {
  constructor(props) {
    super(props);

    this.device = new Device;
    this.systemApi = new SystemApi;
    this.handleClickBack = this.handleClickBack.bind(this);
    this.handleOnNext = this.handleOnNext.bind(this);
    this.handleChangeApMode = this.handleChangeApMode.bind(this);
  }

  handleClickBack(event){
  	if (this.props.history.length > 2) {
  		this.props.history.push('/device/addFlow');
    } else {
      this.props.history.goBack();
    }
  	
  }
  
  componentDidMount(){
    this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
  }
  
  componentWillUnmount(){
  }
  
  handleOnNext(event){
  	console.log("handleOnNext click");
  	const path = {
			pathname: `/device/selectWifi`,
			searchType:'SmartLink'
		};
		window.globalState.deviceType = 'wifi_plug';
  	this.props.history.push(path);
  }
  
  handleChangeApMode(event){
  	console.log("handleChangeApMode click");
  	this.props.history.push(`/device/wifiPlugAPGuide`);
  }
  
  
  render() {
  	let guideDataList = [{
  		"barTitle":Lang.device.smartLinkPlug.barTitle,
  		"desc":Lang.device.smartLinkPlug.desc,
  		"background":"background-SL-Plug",
  		"help":"LED does't flash in right status"
  	}];
  	
  	let helpDataList = [{
  		"barTitle":Lang.device.smartLinkPlug.helpBarTitle,
  		"desc":Lang.device.smartLinkPlug.helpDesc,
  		"background":"background-SL-Plug2",
  	}]
  	
    return (
      <div className="device addLight">
        <GuideComponent onBack={this.handleClickBack} data={guideDataList} helpData={helpDataList}  onNext={this.handleOnNext}  nextStep={Lang.device.smartLinkPlug.nextStep} onApMode={this.handleChangeApMode} />
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

export default connect(mapStateToProps, mapDispatchToProps)(WifiPlugSLGuide);