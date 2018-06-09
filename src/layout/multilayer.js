import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import pathToRegexp from 'path-to-regexp';
import { Style, Lang } from './resource';

export default class LayoutMultilayer extends Component {
  constructor(props) {
  	super(props);
    this.state = Object.assign({}, props);
	}
    
  componentWillReceiveProps(nextProps){
  	this.setState(nextProps);
  }
  
  render() {
  	let {location, history, children} = this.props;
  	let pathname = location.pathname;
  	let direction = "";
  	if(history.action !== "REPLACE"){
	  	if(history.action === "POP"){
	  		direction = "right";
	  	} else {
	  		direction = "left";
	  	}
  	}
  	let key = pathname;
    let hidden = true;
    if(!(children instanceof Array)){
      children = [children];
    }
    for(let i=0; i<children.length; i++){
    	let item = children[i].props;
    	let options = { 
	  		end: item.exact, 
	  		strict: item.strict, 
	  		sensitive: item.sensitive
	  	};
  		let reg = pathToRegexp(item.path, [], options);
      if(reg.exec(pathname)){
        hidden = false;
      }
    }
    let styles = {
    	panel:{
    		position: "fixed",
    		display: (hidden ? 'none' : 'block'),
				top: 0,
				left: 0,
			  width: "100vw",
			  height: "100vh",
				zIndex: 201,
				overflow: "hidden",
				backgroundColor: "#3A4056"
    	}
    }
  	let transitionName = this.state.transitionName || "multilayer";
  	let panelClass= this.state.panelClass || "";
  	
    return (
			<div style={styles.layout}>
				<ReactCSSTransitionGroup
	        transitionName={transitionName}
	        component="div"
			    className={direction}
	        transitionEnterTimeout={300}
	        transitionLeaveTimeout={300}>
					<div key={key} className={panelClass} style={styles.panel}>
						<Switch location={location}>
							{children}
						</Switch>
			  	</div>
	      </ReactCSSTransitionGroup>
      </div>
    );
  }
}

LayoutMultilayer.propTypes = {
	location: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	children: PropTypes.array.isRequired,
	transitionName: PropTypes.string,
  panelClass: PropTypes.string
}