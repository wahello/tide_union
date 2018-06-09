import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink, Link, Switch } from 'react-router-dom';
import helper from '../public/helper';
import { SwitchNormal, PickerColorBase, PickerColorColour, PickerColorTemperature, SliderBrightness } from 'lds-rc';
import { Style } from './resource';

class Lamp extends Component {
  constructor(props) {
    super(props);
    this.state = {
			OnOff: false,
			attr: {
				OnOff: 1,
				PowerLow: 1,
			}
    };
    
    this.handleChangePicker = this.handleChangePicker.bind(this);
    this.handleClickSwitch = this.handleClickSwitch.bind(this);
    this.handleChangeSliderBrightness = this.handleChangeSliderBrightness.bind(this);
  }
  
	handleChangePicker(value){
		console.log(value);
	}
	
	handleClickSwitch(value) {
		value = (value === "on" ? true : false);
		this.setState({ OnOff: value });
		console.log(value);
	}
	
	handleChangeSliderBrightness(value) {
    console.log(value);
  }
	  
  render() {
  	let _propsDialog = this.state.dialog;
  	let _propsToast = this.state.toast;
  	let OnOff = this.state.OnOff;
  	let Brightness = this.state.Brightness;
  	let {location, history} = this.props;
  	let props = {location, history};
		let myLocation = Object.assign({}, location);
		
    return (
      <div className="lamp default">
        <div>
	        <h2 style={{margin: "20px auto 10px"}}>设备组件--灯控相关</h2>
	        <div style={{display: "inline-block", width: "50%"}}>
	        	<PickerColorBase bgClass="lamp-dim bg"  disabled={!OnOff}
	        		outR={helper.RemToPx("21.67rem") / 4}
	        		intR={helper.RemToPx("10.1rem") / 4}>
	        		<SwitchNormal value={OnOff ? "on" : "off"} class="switch2" onClick={this.handleClickSwitch} />
	        	</PickerColorBase>
	        </div>
	        <div style={{display: "inline-block", width: "50%"}}>
	        	<PickerColorColour value="#333333" bgClass="lamp-rgbw bg" disabled={!OnOff}
	        		outR={helper.RemToPx("21.67rem") / 3}
	        		intR={helper.RemToPx("10.1rem") / 3}
	        		barR={helper.RemToPx("2.67rem") / 3}
	        		onChange={this.handleChangePicker}>
	        		<SwitchNormal value={OnOff ? "on" : "off"} class="switch" onClick={this.handleClickSwitch} />
	        	</PickerColorColour>
	        </div>
	        <div style={{display: "inline-block", width: "50%"}}>
	        	<PickerColorTemperature value={4000} bgClass="lamp-cct bg" disabled={!OnOff}
	        		outR={helper.RemToPx("21.67rem") / 3}
	        		intR={helper.RemToPx("10.1rem") / 3}
	        		barR={helper.RemToPx("2.67rem") / 3}
	        		onChange={this.handleChangePicker}>
	        		<SwitchNormal value={OnOff ? "on" : "off"} class="switch" onClick={this.handleClickSwitch} />
	        	</PickerColorTemperature>
	        </div>
	        <div style={{display: "inline-block", width: "50%"}}>
	        	<PickerColorColour value="#333333" bgClass="lamp-rgbw bg" disabled
	        		outR={helper.RemToPx("21.67rem") / 4}
	        		intR={helper.RemToPx("10.1rem") / 4}
	        		barR={10}
	        		onChange={this.handleChangePicker}>
	        		<SwitchNormal value={OnOff ? "on" : "off"} disabled class="switch2" onClick={this.handleClickSwitch} />
	        	</PickerColorColour>
	        </div>
	        <div style={{display: "inline-block", width: "50%", paddingTop:"50px"}}>
            <SliderBrightness value={40} disabled={!OnOff} onChange={this.handleChangeSliderBrightness} />
	        </div>
        </div>
      </div>
    );
  }
}

export default Lamp;
