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

class KeyfobAdd2 extends Component {
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
        <BarTitle onBack={this.handleClickBack} title={Lang.device.help.title} />
        <ScrollView>
        <div className="addWrap">
	        <p className="desc"></p>
	        	<div className="addDesc">
	        		<div className="txt1">{Lang.device.keyfob.desc3}</div>
	        		<div className="icon1 backgroud-keyfob5"></div>
	        		<div className="txt2">{Lang.device.keyfob.desc5}</div>
	        		<div className="icon2 backgroud-keyfob6"></div>
	        		<div className="txt3">{Lang.device.keyfob.desc6}</div>
	        		<div className="txt4">{Lang.device.keyfob.desc7}</div>
	        	</div>
	        	<div className="nextStep backgroud-keyfob4"></div>
            <button className ="nextBtn" onClick={this.handleClickToSet}>{Lang.device.doorAddhelp.nextStep}</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(KeyfobAdd2);