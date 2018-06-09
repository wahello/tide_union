import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import BarTitle from '../component/barTitle';
import './default/style.css';
import { Lang } from '../public';
import { Toast } from 'antd-mobile';
import { setDeviceMode } from '../action/device';
import Device from '../jssdk/device';

class DeviceMode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectValue:this.props.deviceMode || 0
    }
    
    this.device = new Device();
    
    this.changeMode = this.changeMode.bind(this);
  }

  changeMode(item){

    this.setState({
      selectValue: item.value
    });
    // 选择了用户模式，需要提示用户
    if(item.value == 1){
    	Toast.info("User mode may cause accident,we will not responsible for that.")
    }
    
    this.device.setDevAttrReq({
		      parentId: this.props.location.devId,
		      payload: {
		        devId: this.props.location.devId,
		        attr: {
		        	Mode:item.value
		        }
		      }
		    }).then(res => {
		    	console.log("setDevAttrResp = ",res);
		    	this.props.setDeviceMode(item.value);
    			this.props.history.goBack();
		    }).catch(res => {
		      // this.setState({ OnOff: !that.state.OnOff });
		      this.props.history.goBack();
		    });
    
  }

  render() {
    return (
      <div>
        <BarTitle title={Lang.device.mode.title} onBack={() => this.props.history.goBack()} />
        <div className="device-mode">
        <ul>
		  		{
		  			VOLUME_LIST.map((item,index) => 
	  				 <li key={index} onClick={(ev) => this.changeMode(item)}>
		  					{item.title}
		  					<div>{item.desc}</div>
		  					<i className={this.state.selectValue == item.value ? "on" : "off"}></i>
              </li>
		  			)
		  		}		  		
		  	</ul>
          </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
  	deviceItem:state.device.deviceItem,
  	deviceMode:state.device.deviceMode,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
  	setDeviceMode: (...args) => dispatch(setDeviceMode(...args)),
  }
};

export default connect(mapStateToProps,mapDispatchToProps)(DeviceMode);
export const VOLUME_LIST = [
  {   title: Lang.device.edit.safeMode,
  		desc:Lang.device.mode.safeDesc,
      value: 0,
  },
  {   title: Lang.device.edit.userMode,
  		desc:Lang.device.mode.userDesc,
      value: 1,
  }
];