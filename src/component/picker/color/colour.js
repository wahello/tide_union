import React, { Component } from 'react';
import PropTypes from 'prop-types'; 
import Base from './base'; 
import helper from 'src/public/helper';
  
export default class PickerColorColour extends Base {
  constructor(props) {
  	super(props);
  	let outR = this.outR;
  	let intR = this.intR;
  	let barR = this.barR;
  	//色盘
  	let rgb = helper.unpack(props.value);
  	let hsl = helper.RGBToHSL(rgb);
  	let hue = hsl[0];
	  let angle = hue * 6.28;
		let offset = (outR - intR + barR)/2;
  	this.barDisplay = "block";
	  this.barLeft = Math.round(Math.sin(angle) * (outR - offset) + (outR - offset)) + offset - barR;
  	this.barTop = Math.round(-Math.cos(angle) * (outR - offset) + (outR - offset)) + offset - barR;
	}
  
  handleOutput(hsl){
  	let rgb = helper.HSLToRGB(hsl);
  	let colorValue = helper.pack(rgb);
  	this.props.onChange && this.props.onChange(colorValue, hsl);
  }
}

PickerColorColour.propTypes = {
	onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
}
