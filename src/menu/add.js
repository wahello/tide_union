import React, { Component } from 'react';
import './default/style.css';
import { connect } from 'react-redux';
import { Lang } from '../public';
import { Route, Link } from 'react-router-dom';

class HomeStart extends Component {
  constructor(props) {
  	super(props);
    this.state = {
        effect: 'home-start',
        second: 3,
    };
    this.handleClick = this.handleClick.bind(this);
	}
  
  componentDidMount() {
    let that = this;
    let second = that.state.second;
    this.interTick = setInterval(function(){
    	that.setState({second: second--});
    	if(second < 0){
    		that.interTick && clearInterval(that.interTick);
				that.setState({effect: 'home-start hide-pull-left'});
    	}
    }, 1000);
  }
  
  handleClick(event) {
		this.setState({effect: 'home-start hide-pull-left'});
	}
  
  render() {
    return (
      <div className="menu-add">
      	<div className="menu-add-bottom"></div>
      	<div className="menu-add-content">
      		<ul className="menu-add-list">
	      		<li className="menu-add-item">
	      			<Link to="/menu">My home</Link>
	      		</li>
	      		<li className="menu-add-item">
	      			<Link to="/menu">My parents home</Link>
	      		</li>
	      	</ul>
	      	<Link to="/menu" className="menu-add-cancel">返回</Link>
      	</div>
      	
      </div>
    );
  }
}

export default connect()(HomeStart)