import React, { Component } from 'react';
import './default/style.css';
import { hideDialog } from '../action';
import { connect } from 'react-redux';

class Dialog extends Component {
		
  constructor(props) {
  	super(props);
    this.state = props;
	}
  
  hide(){
    const { dispatch } = this.props;
    dispatch(hideDialog());
  }
  
  render() {
  	let dataState = this.props.dialog;
  	dataState.buttons = dataState.buttons || [];
  	
    return ( 
      <div className="modal" style={{display: dataState.display}}>
      	<div className="backdrop"></div>
      	<div className="dialog">
	        <h4 className="title">{dataState.title}</h4>
	        <div className="content" dangerouslySetInnerHTML={{__html: dataState.content}}></div>
	        <div className="operate">
						{dataState.buttons.map((item, index) =>
	        		<a key={index} className={item.className} href="javascript:;" onClick={item.handleClick.bind(this)}>{item.text}</a>
	        	)}
	        </div>
        </div>
      </div>
    );
  }
}

export default connect(state => state)(Dialog)