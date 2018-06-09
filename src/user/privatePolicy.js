import React, { Component } from 'react';
import { connect } from 'react-redux';
import BarTitle from '../component/barTitle';
import Toast from 'antd-mobile/lib/toast';
import userApi from '../jssdk/User';
import { showDialog } from '../action';
import { createForm } from 'rc-form';
import Cookies from 'universal-cookie';
import helper from '../public/helper';
import { Lang } from '../public';

const ERR_DESC = {
  '-1000':Lang.user.login.timeout,
}

class PrivatePolicy extends Component {
  constructor(props) {
  	super(props);
  	this.state = {
    };
    
    const { dispatch } = props;
    this.dispatch = dispatch;
    
     this.handleClickBack = this.handleClickBack.bind(this);
	}
  
  
	 handleClickBack(event){
  	this.props.history.goBack();
  }
  
  
  
  render() {
  	const { getFieldProps, getFieldError } = this.props.form;
    return (
    	<div className="user">
     	<div className="user-forgetpassword">
        <BarTitle onBack={this.handleClickBack} title={Lang.user.register.privatepolicy} />
        <div className="bodyer "  >
        </div>
        <footer> 
        </footer>
      </div>
       </div>
    );
  }
}

export default connect()(createForm()(PrivatePolicy))