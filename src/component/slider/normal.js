import React, { Component } from 'react';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

export default class extends Component {
  constructor(props) {
  	super(props);
    this.state = {
    	value: props.defaultValue.brightness
    };
    
    this.handleChange = this.handleChange.bind(this);
	}
  
  handleChange(value, event){
  	let that = this;
		this.timerTouchMove && clearTimeout(this.timerTouchMove);
		this.timerTouchMove = null;
  	if(!this.timerTouchMove){
	  	this.timerTouchMove = setTimeout(function(){
	  		that.timerTouchMove && clearTimeout(that.timerTouchMove);
	  		that.timerTouchMove = null;
	  		that.props.onChange && that.props.onChange(value);
  			that.setState({value});
	  	}, 200);
  	}
  	that.setState({value});
	}
  
  render() {
  	let {value} = this.state;
  	let OnOff = this.props.defaultValue.OnOff;
		let brightness = this.props.defaultValue.brightness;
		console.log('component brightness： ', brightness);
  	let styles = {
  		root: {
  			position: "relative",
  			height: "2rem",
  			lineHeight: "2rem",
  			vAlign: "middle"
  		},
  		slider: {
  			display: "inline-block",
  			width: "calc(100% - (2rem + .58rem) * 2)",
        height: "2rem",
  			margin: "0 .58rem",
        padding: "0.66rem 0 0",
  			background: "transparent"
  		},
  		rail: {
  			height: ".5rem",
  			background: "#eee"
  		},
  		track: {
  			width: ".5rem",
  			height: ".5rem",
  			background: (OnOff ? "#F59C24" : "$color-major")
  		},
  		handle: {
  			width: "1.33rem",
  			height: "1.33rem",
  			marginLeft: "calc((1.33rem - 0.5rem) / -2)",
    		marginTop: "calc((1.33rem - 0.5rem) / -2)",
    		borderRadius: ".625rem",
				border: "1px solid #F6F6F6", 
				boxShadow: "0 2px 4px 0 rgba(0, 0, 0, .17)"
  		},
  		weak: {
  			display: "inline-block",
  			width: "2rem",
  			height: "2rem"
  		},
  		strong: {
  			display: "inline-block",
  			width: "2rem",
  			height: "2rem"
  		},
  		tip:{
  			position: "absolute",
  			display: "inline-block",
  			top: "calc(-5.29rem * .5 )",
  			left: 'calc(-7.33rem * .5 + ' + value + '%)',
  			width: "calc(7.33rem * .5)",
  			height: "calc(5.29rem * .5)",
				color: "#ffffff"
  		}
  	};
  	
    return (
    	<div style={styles.root}>
    		<span className="weak" style={styles.weak}></span>
				<Slider style={styles.slider} disabled={!OnOff}
					railStyle={styles.rail}
					trackStyle={styles.track}
					handleStyle={styles.handle}
					onChange={this.handleChange}
					defaultValue={brightness}/>
    		<span className="strong" style={styles.strong}></span>
    		<div className="tip-wrap">
    			<span className="tip" style={styles.tip}>{value + "%"}</span>
    		</div>
			</div>
    );
  }
}