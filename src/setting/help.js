import React, { Component } from 'react';
import './default/style.css';
import { showDialog } from '../action';
import { connect } from 'react-redux';
import { Lang } from '../public';
import BarTitle from '../component/barTitle';
import SystemApi from '../jssdk/system';


class Help extends Component {
  constructor(props) {
  	super(props);
    const { dispatch } = props;
    this.dispatch = dispatch;
    
    this.handleClickBack = this.handleClickBack.bind(this);
	}

  handleClickBack(event){
  	this.props.history.goBack();
  }
  
  render() {
  	
    return (
      <div className="setting default">
        <div className="help">
          <BarTitle onBack={this.handleClickBack} title={Lang.setting.help.title}/>
          
        </div>
      </div>
    );
  }
}

export default connect()(Help)