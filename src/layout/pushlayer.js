import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Link, Switch } from 'react-router-dom';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import pathToRegexp from 'path-to-regexp';
import { Style, Lang } from './resource';

export default class Pushlayer extends Component {
  constructor(props) {
  	super(props);
    this.state = {};
	}
  
  render() {
  	let location = this.props.location;
  	let history = this.props.history;
  	let children = this.props.children;
  	let pathname = location.pathname;
  	let direction = "";
  	if(history.action !== "REPLACE"){
	  	if(history.action === "POP"){
	  		direction = "left";
	  	} else {
	  		direction = "left";
	  	}
  	}
  	let key = pathname;
    let hidden = true;
    let createComponent = function(item){
	  	let options = { 
	  		end: item.exact, 
	  		strict: item.strict, 
	  		sensitive: item.sensitive
	  	};
  		let reg = pathToRegexp(item.props.path, [], options);
      if(reg.exec(pathname)){
				//let ChildComponent = item.props.component;
				//component = <ChildComponent history={history} location={location} />;
	      hidden = false;
      }
    }
    if(children instanceof Array){
      children.map((item, index) => {
		  	createComponent(item);
      })
    }else{
	  	createComponent(children);
    }
  	
    return (
			<div className="layout pushlayer">
				<ReactCSSTransitionGroup
	        transitionName="pushlayer"
	        component="div"
			    className={direction}
	        transitionEnterTimeout={300}
	        transitionLeaveTimeout={300}>
					<div key={key} className="panel" style={{display: hidden ? 'none' :　'block'}}>
						<Switch location={location}>
							{children}
						</Switch>
			  	</div>
	      </ReactCSSTransitionGroup>
      </div>
    );
  }
}