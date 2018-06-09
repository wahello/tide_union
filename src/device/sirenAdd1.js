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

class SirenAdd1 extends Component {
  constructor(props) {
    super(props);

    this.device = new Device;
    this.systemApi = new SystemApi;
    this.handleClickBack = this.handleClickBack.bind(this);
    this.handleClickToSet = this.handleClickToSet.bind(this);
  }

  handleClickBack(event){
    // this.props.history.goBack();
    this.props.history.replace('/device/addFlow');  // 未搜索到结果，按try again 会会退到第一步，此时按后台需要直接退回到addFlow
  }
  
  handleClickToSet({}){
    this.props.history.push('/device/sirenAdd2');
  }  
  
  componentDidMount(){
    this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
  }
  
  componentWillUnmount(){
  }
  
  
  render() {
    return (
      <div className="device addLight">
        <BarTitle onBack={this.handleClickBack} title={Lang.device.sirenAdd1.title} />
        <ScrollView>
        <div className="addWrap">
        	<div className="desc"></div>
        	<p className="addDesc">{Lang.device.sirenAdd1.addDesc}</p>      	
        	<div className="nextStep backgroud-Siren1"></div>
          <button className ="nextBtn" onClick={this.handleClickToSet}>{Lang.device.sirenAdd1.nextStep}</button>
          
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

export default connect(mapStateToProps, mapDispatchToProps)(SirenAdd1);