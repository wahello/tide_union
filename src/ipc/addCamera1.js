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

class AddCamera1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
    choose:false,
    }

    this.device = new Device;
    this.systemApi = new SystemApi;
    this.handleClickBack = this.handleClickBack.bind(this);
    this.handleClickToSet = this.handleClickToSet.bind(this);
    this.handleClickToChoose = this.handleClickToChoose.bind(this);
  }

  handleClickBack(event){
  	this.props.history.goBack();
  }
  
  handleClickToSet({}){
      let that = this;
      if (that.state.choose) {
        this.props.history.push('/ipc/addCamera2');
      }
    
  }  
  handleClickToChoose(){
    let state = this.state.choose;
    this.setState({
		choose:!state,
		
      });
  }
  componentDidMount(){
    this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
  }
  
  componentWillUnmount(){
  }
  
  
  render() {
    return (
      <div className="addCamera">
        <BarTitle onBack={this.handleClickBack} title={Lang.ipc.addCamera1.title} />
        <ScrollView>
        <div className="addWrap">
        	<p className="addDesc"></p>      	
        	<div className="nextStep backgroud-ap">{Lang.ipc.addCamera1.step1}</div>
          <div className ={"selectBtn"+" "+(this.state.choose?"choose":"unchoose")} onClick={this.handleClickToChoose}></div> 
          <p className = "chooseDesc">{Lang.ipc.addCamera1.step2}</p>
          <button className ={"nextBtn"+" "+(this.state.choose?"can":"cannot")} onClick={this.handleClickToSet}>{Lang.ipc.addCamera1.next}</button>
          <div className ="notHear">{Lang.ipc.addCamera1.tip}</div>
          
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

export default connect(mapStateToProps, mapDispatchToProps)(AddCamera1);