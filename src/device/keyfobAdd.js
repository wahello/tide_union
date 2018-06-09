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

class KeyfobAdd extends Component {
  constructor(props) {
    super(props);

    this.device = new Device;
    this.systemApi = new SystemApi;
    this.handleClickBack = this.handleClickBack.bind(this);
    this.handleOnNext = this.handleOnNext.bind(this);
  }

  handleClickBack(event){
    // this.props.history.goBack();
    this.props.history.replace('/device/addFlow');  // 未搜索到结果，按try again 会会退到第一步，此时按后台需要直接退回到addFlow
  }
  
  
  componentDidMount(){
    this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
  }
  
  componentWillUnmount(){
  }
  
  handleOnNext(event){
      console.log("handleOnNext click");
      this.props.history.push('/device/keyfobAdd1');
  }
    
  render() {
  	let guideDataList = [
      {
        "barTitle":Lang.device.keyfob.title,
        "desc":Lang.device.keyfob.desc,
        "background":"backgroud-keyfob1"
      }
//    ,{
//      "barTitle":Lang.device.keyfob.title,
//      "desc":Lang.device.keyfob.desc2,
//      "background":"backgroud-keyfob2",
//      "help":Lang.device.keyfob.help
//    },{
//      "barTitle":Lang.device.keyfob.title,
//      "desc":Lang.device.keyfob.desc4,
//      "background":"backgroud-keyfob3"
//    }
    ];

//  let helpDataList = [{
//    "barTitle":Lang.device.help.title,
//    "desc":Lang.device.keyfob.desc3,
//    "background":"backgroud-keyfob4"
//  },{
//    "barTitle":Lang.device.keyfob.title,
//    "desc":Lang.device.keyfob.desc4,
//    "background":"backgroud-keyfob3"
//  }];
  	
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

export default connect(mapStateToProps, mapDispatchToProps)(KeyfobAdd);