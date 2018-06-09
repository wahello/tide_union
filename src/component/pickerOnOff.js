import React, { Component } from 'react';
import './default/style.css';
import helper from '../public/helper';

  
export default class extends Component {
  constructor(props) {
  	super(props);
	  this.maxR = helper.RemToPx("21.67rem") / 2;
  	this.minR = helper.RemToPx("4.73rem") / 2;
  	this.outMinR = helper.RemToPx("10.1rem") / 2;
  	this.barR = helper.RemToPx("2.67rem") / 2;
  	let barDisplay = "none";
  	let minR = this.minR;
  	let maxR = this.maxR;
  	let barR = this.barR;
  	//色调
  	if(props.defaultValue && typeof(props.defaultValue.color) !== "undefined"){
  		barDisplay = "block";
	  	let rgb = helper.unpack(props.defaultValue.color);
	  	let hsl = helper.RGBToHSL(rgb);
	  	let hue = hsl[0];
		  let angle = hue * 6.28;
  		let offset = (maxR - minR + barR)/2 ;
		  this.barLeft = Math.round(Math.sin(angle) * (maxR - offset) + (maxR - offset)) + offset - barR;
	  	this.barTop = Math.round(-Math.cos(angle) * (maxR - offset) + (maxR - offset)) + offset - barR;
  	}
  	//色温
  	if(props.defaultValue && typeof(props.defaultValue.colorTemp) !== "undefined"){
  		barDisplay = "block";
  		let offset = (maxR - minR);
  		let colorTemp = Math.max(2701, props.defaultValue.colorTemp);
		  this.barLeft = (colorTemp - 2700) / (6500 - 2700) * maxR * 2;
		  if(this.barLeft > offset && this.barLeft < (maxR + offset)){
	  		this.barTop = offset - barR;
		  }else{
	  		this.barTop = maxR;
		  }
  	}
    this.state = Object.assign({ barDisplay }, props.defaultValue);
		this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleClick = this.handleClick.bind(this);
	}
  
	_x = 0;
	_y = 0;
	
  handleTouchStart(event){
  	if(!this.props.defaultValue.OnOff){
  		return false;
  	}
  	let touche1 = (event.touches && event.touches[0]) || event;
  	this._x = touche1.clientX;
  	this._y = touche1.clientY;
  }
  
  handleTouchMove(event){
  	if(!this.props.defaultValue.OnOff){
  		return false;
  	}
	  let that = this;
  	let touche1 = (event.touches && event.touches[0]) || event;
  	let minR = this.minR;
  	let maxR = this.maxR;
  	let barR = this.barR;
  	let pLeft = this.bg.offsetLeft;
  	let pTop = this.bg.offsetTop;
  	let left = touche1.clientX - pLeft;
  	let top = touche1.clientY - pTop;
    let x1 = maxR;
    let y1 = maxR;
		//计算鼠标点的位置与圆心的距离  
    let len = Math.abs(Math.sqrt(Math.pow(left - x1, 2) + Math.pow(top - y1, 2)));
    let x2 = left + barR - maxR;
    let y2 = top + barR - maxR;
    let hue = Math.atan2(x2, -y2) / 6.28;
    if (hue < 0) hue += 1;
	  let angle = hue * 6.28;
  	if(len > maxR){
  		left = Math.round(Math.sin(angle) * maxR + maxR);
  		top = Math.round(-Math.cos(angle) * maxR + maxR);
  	}else if(len < minR){
  		let offset = (maxR - minR);
  		left = Math.round(Math.sin(angle) * minR + minR) + offset;
  		top = Math.round(-Math.cos(angle) * minR + minR) + offset;
  	}
  	//console.log(len + '||' + hue + '||' + angle + '||' + left + '||' + top);
	  len = Math.abs(Math.sqrt(Math.pow(left-x1,2)+Math.pow(top-y1,2)));
  	if(len < maxR && len > minR){
	  	this.bar.style.left = left + "px";
		  this.bar.style.top = top + "px";
		  //console.log(hue + '||' + (len / maxR) + '||' + 0.5);
	  	//let rgb = helper.HSLToRGB([hue, Math.max(1, len / maxR), 0.5]);
	  	//console.log(rgb);
	  	//let color = helper.pack(rgb);
	  	//console.log(color);
	  	if(!this.timerTouchMove){
		  	this.timerTouchMove = setTimeout(function(){
		  		that.timerTouchMove && clearTimeout(that.timerTouchMove);
		  		that.timerTouchMove = null;
		  		that.props.onChange && that.props.onChange([hue, Math.max(1, len / maxR), 0.5]);
		  	}, 200);
	  	}
	  	//this._x = touche1.clientX;
	  	//this._y = touche1.clientY;
  	}
  }

  handleTouchEnd(event){
		//todo
  }
  
  handleClick(event){
  	if(!this.props.defaultValue.OnOff){
  		return false;
  	}
//	let minR = this.minR;
		let minR = this.outMinR;
  	let maxR = this.maxR;
  	let barR = this.barR;
    let x1 = maxR;
    let y1 = maxR;
  	let pLeft = this.bg.offsetLeft;
  	let pTop = this.bg.offsetTop;
  	let left = event.clientX - pLeft;
  	let top = event.clientY - pTop;
	  let len = Math.abs(Math.sqrt(Math.pow(left-x1,2)+Math.pow(top-y1,2)));
    let x2 = left + barR - maxR;
    let y2 = top + barR - maxR;
  	let hue = Math.atan2(x2, -y2) / 6.28;
  	if(len < maxR && len > minR){
  		this.bar.style.left = left + "px";
	  	this.bar.style.top = top + "px";
	  	this.props.onChange && this.props.onChange([hue, Math.max(1, len / maxR), 0.5]);
	  }
  }
  
  render() {
  	let OnOff = this.props.defaultValue.OnOff;
  	let barR = this.barR;
  	let styles = {
  		bg: {
				position: "relative",
				margin: "0 auto",
				zIndex: "100",
				width: this.maxR * 2 + "px",
				height: this.maxR * 2 + "px",
				borderRadius: this.maxR + "px",
				overflow: "hidden"
  		},
  		switch: {
				position: "absolute",
				top: (this.maxR - this.minR) + "px",
				left: (this.maxR - this.minR) + "px",
				zIndex: "102",
				width: this.minR * 2 + "px",
				height: this.minR * 2 + "px",
				borderRadius: "50%"
			},
			mask:{
				position:"absolute",
				top: (this.maxR - this.outMinR) + "px",
				left: (this.maxR - this.outMinR) + "px",
				zIndex: "101",
				width: this.outMinR * 2 + "px",
				height: this.outMinR * 2 + "px",
				borderRadius: "50%",
				backgroundColor: "#3A4056"
			},
  		bar: {
  			display: this.state.barDisplay,
				position: "absolute",
  			top: this.barTop + 'px',
  			left: this.barLeft + 'px',
				zIndex: "99",
				width: this.barR * 2 + "px",
				height: this.barR * 2 + "px",
				marginLeft: - this.barR + "px",
				marginTop: - this.barR + "px",
				border: "solid 2px #FFFFFF",
				borderRadius: "50%",
				boxShadow: "0 4px 4px 0 rgba(0,0,0,0.24)",
  			cursor: "pointer"
  		}
  	};
  	
    return (
			<div className="bg" onClick={this.handleClick} style={styles.bg} ref={(ele) => { this.bg = ele; }}>
				<div className="bar" style={styles.bar} ref={(ele) => { this.bar = ele; }}
					onTouchStart={this.handleTouchStart}
					onTouchMove={this.handleTouchMove}
					onTouchEnd={this.handleTouchEnd}></div>
				<div className="switch" onClick={this.props.onClick.bind(this, !OnOff)} style={styles.switch} ref={(ele) => { this.switch = ele; }}></div>
				<div style={styles.mask}></div>
			</div>
    );
  }
}