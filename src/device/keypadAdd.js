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

class KeypadAdd extends Component {
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
      this.props.history.push('/device/searchHub/keypad');
  }
    
  render() {
    let guideDataList = [
        {
          "barTitle":Lang.device.keypad.title,
          "desc":Lang.device.keypad.desc,
          "background":"backgroud-keypad1"
        },{
          "barTitle":Lang.device.keypad.title,
          "desc":Lang.device.keypad.desc2,
          "background":"backgroud-keypad2",
          "help":Lang.device.keyfob.help
        },{
          "barTitle":Lang.device.keypad.title,
          "desc":Lang.device.keypad.desc4,
          "background":"backgroud-keypad3"
        }
      ];

      let helpDataList = [{
        "barTitle":Lang.device.help.title,
        "desc":Lang.device.keypad.desc3,
        "background":"backgroud-keypad4"
      },{
        "barTitle":Lang.device.keypad.title,
        "desc":Lang.device.keypad.desc4,
        "background":"backgroud-keypad3"
      }];
  	
    return (
      <div className="device addLight">
        <GuideComponent onBack={this.handleClickBack} data={guideDataList} helpData={helpDataList} onNext={this.handleOnNext}  nextStep={Lang.device.apModePlug.nextStep}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(KeypadAdd);