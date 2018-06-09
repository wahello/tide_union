import React, { Component } from 'react';
import './default/style.css';

export default class extends Component {
  constructor(props){
    super(props);
    console.log(this.props.onNext)
  }
  render() {
  	
    return (
    	<div onClick={this.props.onNext}  className="component bar-normal">
        {this.props.children}
	  		{this.props.onNext ? <a className="icon next"></a> : ''}
	  		{this.props.onCheck ? <a onClick={this.props.onCheckbox} className="icon checkbox"></a> : ''}
      </div>
    );
  }
}