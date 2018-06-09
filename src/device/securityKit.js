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

class SecurityKit extends Component {
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
    
  }
  
  componentWillUnmount(){
  }
  
  handleOnNext(event){
  	this.props.history.push('/home');
  }
    
  render() {
    return (
      <div className="security-kit">
        <p className="kit-title">{Lang.kit.title}</p>
        <p className="kit-tips">{Lang.kit.tips}</p>
        <div className="kit-img"></div>
        <div onClick={this.handleOnNext} className="kit-button">{Lang.kit.done}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(SecurityKit);