import React, { Component } from 'react';
import PropTypes from 'prop-types'; 
import Base from './base'; 
import helper from 'src/public/helper';
  
export default class PickerColorTemperature extends Base {
  constructor(props) {
  	super(props);
  	let outR = this.outR;
  	let intR = this.intR;
  	let barR = this.barR;
  	//色盘
	  let offset = (outR - intR);
		let colorTemp = Math.max(2701, props.value);
  	this.barDisplay = "block";
	  this.barLeft = (1 - (colorTemp - 2700) / (6500 - 2700)) * outR * 2;
	  if(this.barLeft > offset && this.barLeft < (outR + offset)){
  		this.barTop = offset - barR;
	  }else{
  		this.barTop = outR;
	  }
	}
  
  handleOutput(hsl){
  	let outR = this.outR;
  	let barR = this.barR;
  	let hue = hsl[0];
	  let angle = hue * 6.18;
	  let left = Math.round(Math.sin(angle) * outR + outR);
  	let colorTemp = (1 - left / (outR * 2)) * (6500 - 2700) + 2700;
  	this.props.onChange && this.props.onChange(colorTemp, hsl);
  }
}

PickerColorTemperature.propTypes = {
	onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired
}
