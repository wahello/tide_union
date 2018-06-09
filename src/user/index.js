import React, { Component } from 'react';
import UserLogin from './login';
import UserRegister from './register';
import UserChangePwd from './changePwd';
import UserModify from './modify';
import UserForgetPassword from './forgetPassword';
import UserTermsOfservice from './termsOfservice';
import UserPrivatePolicy from './privatePolicy';
import { connect } from 'react-redux';
import {Route} from 'react-router-dom';
import LayoutMultilayer from '../layout/multilayer';

class User extends Component {
  
  constructor(props) {
  	super(props);
	}
  
  componentDidMount() {

  }
    
  render() {
    return (
  		<div className="user default">
  			<UserLogin history={this.props.history} location={this.props.location} />
        <LayoutMultilayer history={this.props.history} location={this.props.location}>
          <Route exact path="/user/register" component={UserRegister} />
          <Route exact path="/user/changePwd" component={UserChangePwd} />
          <Route exact path="/user/modify" component={UserModify} />
           <Route exact path="/user/termsOfservice" component={UserTermsOfservice} />
          <Route exact path="/user/privatePolicy" component={UserPrivatePolicy} />
          <Route exact path="/user/forgetPassword" component={UserForgetPassword} />
        </LayoutMultilayer>
      </div>
    );
  }
}

export default connect()(User)