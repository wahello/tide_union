import React, { Component } from 'react';
import PropTypes from 'prop-types'; 
import helper from 'src/public/helper';

export default class PickerColorBase extends Component {
  constructor(props) {
  	super(props);
  	this.outR = props.outR || helper.RemToPx("21.67rem") / 2; //外圆半径
		this.intR = props.intR || helper.RemToPx("10.1rem") / 2; //内圆半径
		this.barR = props.barR || helper.RemToPx("2.67rem") / 2; //拖动圆半径

    this.state = Object.assign({
    	disabled: false
    }, props);
		this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleClick = this.handleClick.bind(this);
	}
  
  componentWillReceiveProps(nextProps){
  	this.setState(Object.assign({
    	disabled: false
    }, nextProps));
  }
  
	_x = 0;
	_y = 0;
	
	fnTouch(event){
	  let that = this;
  	let touche1 = (event.touches && event.touches[0]) || event;
  	let intR = this.intR;
  	let outR = this.outR;
  	let barR = this.barR;
  	let pLeft = this.bg.offsetLeft;
  	let pTop = this.bg.offsetTop;
  	let left = touche1.clientX - pLeft;
  	let top = touche1.clientY - pTop;
    let x1 = outR;
    let y1 = outR;
		//计算鼠标点的位置与圆心的距离  
    let len = Math.abs(Math.sqrt(Math.pow(left - x1, 2) + Math.pow(top - y1, 2)));
    let x2 = left + barR - outR;
    let y2 = top + barR - outR;
    let hue = Math.atan2(x2, -y2) / 6.28;
    if (hue < 0) hue += 1;
	  let angle = hue * 6.28;
  	if(len > outR){
  		left = Math.round(Math.sin(angle) * outR + outR);
  		top = Math.round(-Math.cos(angle) * outR + outR);
  	}else if(len < intR){
  		let offset = (outR - intR);
  		left = Math.round(Math.sin(angle) * intR + intR) + offset;
  		top = Math.round(-Math.cos(angle) * intR + intR) + offset;
  	}
  	//console.log(len + '||' + hue + '||' + angle + '||' + left + '||' + top);
	  len = Math.abs(Math.sqrt(Math.pow(left-x1,2)+Math.pow(top-y1,2)));
  	if(len < outR && len > intR){
	  	this.bar.style.left = left + "px";
		  this.bar.style.top = top + "px";
		  //console.log(hue + '||' + (len / outR) + '||' + 0.5);
	  	//let rgb = helper.HSLToRGB([hue, Math.max(1, len / outR), 0.5]);
	  	//console.log(rgb);
	  	//let color = helper.pack(rgb);
	  	//console.log(color);
	  	if(!this.timerTouchMove){
		  	this.timerTouchMove = setTimeout(() => {
		  		this.timerTouchMove && clearTimeout(this.timerTouchMove);
		  		this.timerTouchMove = null;
	  			this.handleOutput && this.handleOutput([hue, Math.max(1, len / outR), 0.5]);
		  	}, 200);
	  	}
	  	//this._x = touche1.clientX;
	  	//this._y = touche1.clientY;
  	}
	}
	
  handleTouchStart(event){
  	if(this.state.disabled){
  		return false;
  	}
  	let touche1 = (event.touches && event.touches[0]) || event;
  	this._x = touche1.clientX;
  	this._y = touche1.clientY;
  }
  
  handleTouchMove(event){
  	if(this.state.disabled){
  		return false;
  	}
  	this.fnTouch(event);
  	this.touches = event.touches;
  	event.preventDefault();
  }

  handleTouchEnd(event){
	  let that = this;
	  event.touches = this.touches;
		this.timerTouchMove && clearTimeout(this.timerTouchMove);
		this.timerTouchMove = null;
  	this.fnTouch(event);
  }
  
  handleClick(event){
  	if(this.state.disabled){
  		return false;
  	}
  	let intR = this.intR;
  	let outR = this.outR;
  	let barR = this.barR;
    let x1 = outR;
    let y1 = outR;
  	let pLeft = this.bg.offsetLeft;
  	let pTop = this.bg.offsetTop;
  	let left = event.clientX - pLeft;
  	let top = event.clientY - pTop;
	  let len = Math.abs(Math.sqrt(Math.pow(left-x1,2)+Math.pow(top-y1,2)));
    let x2 = left + barR - outR;
    let y2 = top + barR - outR;
  	let hue = Math.atan2(x2, -y2) / 6.28;
  	if(len < outR && len > intR){
  		this.bar.style.left = left + "px";
	  	this.bar.style.top = top + "px";
	  	this.handleOutput && this.handleOutput([hue, Math.max(1, len / outR), 0.5]);
	  }
  }
  
  handleOutput(hsl){
  	this.props.onChange && this.props.onChange(hsl);
  }
  
  render() {
  	let children = this.props.children;
  	let bgClass = this.state.bgClass || "";
  	let barClass = this.state.barClass || "";
  	if(this.state.disabled) {
  		bgClass += ' disabled';
  		barClass += ' disabled';
  	}
  	let styles = {
  		bg: {
				position: "relative",
				margin: "0 auto",
				zIndex: "100",
				width: this.outR * 2 + "px",
				height: this.outR * 2 + "px",
				borderRadius: this.outR + "px",
				overflow: "hidden"
  		},
			mask:{
				position:"absolute",
				top: (this.outR - this.intR) + "px",
				left: (this.outR - this.intR) + "px",
				zIndex: "101",
				width: this.intR * 2 + "px",
				height: this.intR * 2 + "px",
				borderRadius: "50%",
				backgroundColor: "#3A4056"
			},
  		bar: {
  			display: this.barDisplay || "none",
				position: "absolute",
  			top: this.barTop + 'px',
  			left: this.barLeft + 'px',
				zIndex: "101",
				width: this.barR * 2 + "px",
				height: this.barR * 2 + "px",
				marginLeft: - this.barR + "px",
				marginTop: - this.barR + "px",
				border: "solid 2px " + (this.state.disabled ? "rgba(0,0,0,.24)" : "#fff"),
				borderRadius: "50%",
				boxShadow: "0 4px 4px 0 rgba(0,0,0,0.24)",
  			cursor: "pointer"
  		}
  	};
  	
    return (
			<div className={bgClass} onClick={this.handleClick} style={styles.bg} ref={(ele) => { this.bg = ele; }}>
				<div className={barClass} style={styles.bar} ref={(ele) => { this.bar = ele; }}
					onTouchStart={this.handleTouchStart}
					onTouchMove={this.handleTouchMove}
					onTouchEnd={this.handleTouchEnd}></div>
				<div style={styles.mask}>
					{children}
				</div>
			</div>
    );
  }
}

PickerColorBase.propTypes = {
	disabled: PropTypes.bool,
  outR: PropTypes.number.isRequired,
  intR: PropTypes.number.isRequired,
  barR: PropTypes.number
}