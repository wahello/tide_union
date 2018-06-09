import React, { Component } from 'react';
import PropTypes from 'prop-types';
  
export default class SwitchNormal extends Component {
  constructor(props) {
  	super(props);
    this.state = Object.assign({
    	disabled: false
    }, props);
    
    this.handleClick = this.handleClick.bind(this);
	}
    
  componentWillReceiveProps(nextProps){
		this.setState(Object.assign({
    	disabled: false
    }, nextProps));
  }

  handleClick(event){
  	if(this.state.disabled){
  		return false;
  	}
  	this.setState((preState) => {
  		let value = (preState.value === "on" ? "off" : "on");
  		this.props.onClick && this.props.onClick(value);
  		return { value };
  	})
  }
  
  render() {
  	let value = this.state.value;
  	let className = this.state.class;
  	className += " " + value;
  	if(this.state.disabled) {
  		className += ' disabled';
  	}
  	let styles = {
  		switch: {
				width: "100%",
				height: "100%",
				borderRadius: "50%"
			}
  	};
  	
    return (
			<div className={className} onClick={this.handleClick} style={styles.switch}></div>
    );
  }
}


SwitchNormal.propTypes = {
	disabled: PropTypes.bool,
	onClick: PropTypes.func.isRequired,
  value: PropTypes.oneOf(['on', 'off']).isRequired
}