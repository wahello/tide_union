import React, { Component } from 'react';
import PropTypes from 'prop-types'; 
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { Route, Link, NavLink, Switch } from 'react-router-dom';
import pathToRegexp from 'path-to-regexp';
import { Style, Lang } from './resource';

let myPathName = null;
export default class LayoutNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({
    	contentClass: "",
    	navClass: "",
    	navTpl: '(item) => `<span class="icon ${item.iconClass}"></span><span class="title">${item.title}</span>`'
    }, props);
  }
  
  componentWillReceiveProps(nextProps){
  	this.setState(nextProps);
  }
  
  render() {
  	let {location, history, children} = this.props;
  	let pathname = location.pathname;
    let data = this.state.data;
		let fnNavTpl = (item) => `<span class="icon ${item.iconClass}"></span><span class="title">${item.title}</span>`;
		let contentClass = this.state.contentClass || "";
		let navClass = this.state.navClass || "";
    let isMatch = false;
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
        isMatch = true;
      }
    }
    let myLocation = Object.assign({}, location);
    if(isMatch){
    	myPathName = location.pathname;
    }else{
    	myLocation.pathname = myPathName;
    }
    let styles = {
    	content: {
    		width: "100%",
    		height: "100%"
    	},
    	nav: {
    		link: {
    			display: "inline-block",
    			width: (100 / children.length) + "%"
    		},
	    	position: "fixed",
	    	zIndex: 101,
				width: "100%",
				height: "auto",
				left: 0,
				bottom: 0,
				textAlign: "center",
				background: "rgba(0,0,0,0.88)"
    	}
    }
		
    return (
			<div style={styles.layout}>
				<div className={contentClass} style={styles.content}>
					<Switch location={myLocation}>
						{children}
					</Switch>
				</div>
				<div className={navClass} style={styles.nav}>
				  {children.map((item, index) => 
        		<NavLink replace to={item.props.path} activeClassName="active" key={index} style={styles.nav.link}
        			dangerouslySetInnerHTML={{__html: fnNavTpl(item.props)}}>
    				</NavLink>
          )}
			  </div>
			</div>
    );
  }
}

LayoutNavigation.propTypes = {
	children: PropTypes.array.isRequired,
	navTpl: PropTypes.string,
  contentClass: PropTypes.string,
  navClass: PropTypes.string
}