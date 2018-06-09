import React, { Component } from 'react';
import Device from '../jssdk/device';
import BarTitle from '../component/barTitle';
import { showDialog } from '../action';
import helper from '../public/helper';
import { Lang } from '../public';
import { connect } from 'react-redux';
import './default/style.css';
import SystemApi from '../jssdk/system';
import { createForm } from 'rc-form';

class DeviceGuidePage extends Component {
	constructor(props){
		super(props);

        this.handleClickBack = this.handleClickBack.bind(this);
        this.handleClickSave = this.handleClickSave.bind(this);
	}
	
 handleClickBack(event){
  	this.props.history.goBack();
  }
  
  handleClickSave(){
  	
  }
  nextPage(event){
  	this.props.history.push('/device/guidePageTwo');
  }
  
    render(){
	return(
	<div className='way-step1'>
		<BarTitle onBack={this.handleClickBack} title={Lang.home.title}/>
                    <p className='little-title'>Step one</p>
                    <div className='way-getlist'>

                    </div>
                    <p className='power-tip'>{Lang.home.title}</p>
                    <button onClick={()=> this.nextPage()} className="step-next">{Lang.home.nextstep}</button>
                </div>
	);
}
   

}
export default connect()(createForm()(DeviceGuidePage))