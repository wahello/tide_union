import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class SceneIcon extends Component {
  render() {
  	if(this.props.isCheckRule){
  		if(this.props.ruleCount > 0){
	  		return (<div id={this.props.id} className={`scene_icon scene_icon_${this.props.type}`}></div>);
	  	} else{
	  		 return (<div id={this.props.id} className={`scene_icon scene_icon_${this.props.type}_white`}></div>);
	  	}
  	}else{
  		return (<div id={this.props.id} className={`scene_icon scene_icon_${this.props.type}`}></div>);
  	}
   
  }
}