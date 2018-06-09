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
import BLEService from '../jssdk/BLEService';

const dialogLang = Lang.public.dialog;
const deviceLang = Lang.device;

class BLEAddDevice extends Component {
  constructor(props) {
    super(props);

    this.device = new Device;
    this.systemApi = new SystemApi;
    this.handleClickBack = this.handleClickBack.bind(this);
    this.handleClickStartScan = this.handleClickStartScan.bind(this);
    this.handleClickConnectService = this.handleClickConnectService.bind(this);
    this.handleClickOnlighting = this.handleClickOnlighting.bind(this);
    this.handleClickOfflighting = this.handleClickOfflighting.bind(this);

    this.BLEService = BLEService;
  }

  handleClickBack(event){
  	this.props.history.goBack();
  }
  
  handleClickStartScan({}) {
    this.device.BLEServiceStartScan();
  }  

  handleClickConnectService(){
    this.device.BLEServiceStopScan();
    this.device.BLEServiceStartConnect();
  }

  handleClickOnlighting(){
    this.device.BLEServiceOnLighting();
  }

  handleClickOfflighting(){
    this.device.BLEServiceOffLighting();
  }
  
  componentDidMount(){
    this.systemApi.offGoBack().onceGoBack(this.handleClickBack);

    this.BLEService.onDeviceNofify(res => {
        console.log('deviceNotify：'+res);
    });
    let that=this;
    this.BLEService.OnDevChange(res => {
        console.log("onDevChange :"+res);
        that.device.BLEServiceSetNewAddressAndMesh();
     });

  }
  
  componentWillUnmount(){

  }
  
  
  render() {
    return (
      <div className="device addLight">
        <BarTitle onBack={this.handleClickBack} title={Lang.device.add1.title} />

        <button style={{backgroundColor:'#5555aa',height:'30px',margin:'30px 20px 20px 20px',color:'#fff'}} onClick={this.handleClickStartScan}>start scan1</button>
        <button style={{backgroundColor:'#5555aa',height:'30px',margin:'30px 20px 20px 20px',color:'#fff'}} onClick={this.handleClickConnectService}>start Connect</button>
        <button style={{backgroundColor:'#5555aa',height:'30px',margin:'30px 20px 20px 20px',color:'#fff'}} onClick={this.handleClickOnlighting}>On lighting</button>
        <button style={{backgroundColor:'#5555aa',height:'30px',margin:'30px 20px 20px 20px',color:'#fff'}} onClick={this.handleClickOfflighting}>Off lighting</button>
      
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

export default connect(mapStateToProps, mapDispatchToProps)(BLEAddDevice);