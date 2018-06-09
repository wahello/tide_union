import React, { Component } from 'react';
import './default/style.css';
import { Lang } from '../public';
import BarTitle from '../component/barTitle';

export default class extends Component {
  constructor(props) {
  	super(props);
    this.state = {};
    
    this.handleClickBack = this.handleClickBack.bind(this);
	}

  handleClickBack(event){
  	this.props.history.goBack(); //必须加上/main，否则会触发平滑切换
  }
  
  render() {
    return ( 
      <div className="agreement">
        <BarTitle onBack={this.handleClickBack} title={Lang.setting.agreement.title} />
      	<p>{Lang.setting.agreement.content}</p>
      </div>
    );
  }
}