import React, { Component } from 'react';

class TalkAnimation extends Component{
	constructor(props){
		super(props);
	}
	render(){
		return(
			<div className="talk-circle">
				<div className="talk-circle-3"></div>
				<div className="talk-circle-2"></div>
				<div className="talk-circle-btn" onClick={this.props.handleClickClose}></div>
			</div>
			// style={{marginTop:this.props.position.y + 'rem'}}
		);
	}
}

export default (TalkAnimation)
