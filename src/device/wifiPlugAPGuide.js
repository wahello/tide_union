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

class WifiPlugApGuide extends Component {
  constructor(props) {
    super(props);

    this.device = new Device;
    this.systemApi = new SystemApi;
    
    this.handleClickBack = this.handleClickBack.bind(this);
    this.handleOnNext = this.handleOnNext.bind(this);
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
			searchType:'ap'
		};
		window.globalState.deviceType = 'wifi_plug';
  	this.props.history.push(path);
//	this.props.history.push(`/device/selectWifi`);
  }
    
  render() {
  	let guideDataList = [{
  		"barTitle":Lang.device.apModePlug.barTitle,
  		"desc":Lang.device.apModePlug.desc,
  		"background":"background-AP-Plug"
  	},{
  		"barTitle":Lang.device.apModePlug.barTitle,
  		"desc":Lang.device.apModePlug.desc2,
  		"background":"background-AP-Plug2"
  	}];
  	
    return (
      <div className="device addLight">
        <GuideComponent onBack={this.handleClickBack} data={guideDataList} onNext={this.handleOnNext}  nextStep={Lang.device.apModePlug.nextStep}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(WifiPlugApGuide);