
import React, { Component } from 'react';
import './default/style.css';
import LayoutMultilayer from '../layout/multilayer';
import PageAddGateWay from './addGateWay';
import Settings from './settings';
import FoudWifi from './foudWifi';
import Connect from './connect';
import InputPassword from './inputPassword';
import Adding from './adding';
import FailAdd from './failAdd';
import AddSuccess from './addSuccess';
import NoGateway from './noGateway';
import SearchGW from './searchGW';
import GatewayReset from './gatewayReset';
import CustomRoom from "./customRoom";
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import PageAddApGateway1 from './addApGateWay1';
import PageAddApGateway2 from './addApGateWay2';

export default class extends Component {
  constructor(props) {
  	super(props);
    this.state = {};
	}
  
  render() {
    return (
    	<LayoutMultilayer history={this.props.history} location={this.props.location}>
            <Route exact path="/gateway/" component={PageAddGateWay} />
            <Route exact path="/gateway/searchGW" component={SearchGW} />
            <Route exact path="/gateway/adding" component={Adding} />
            <Route exact path="/gateway/addSuccess" component={AddSuccess} />
            <Route exact path="/gateway/failadd" component={FailAdd} />
            <Route exact path="/gateway/settings" component={Settings} />
            <Route exact path="/gateway/foudWifi" component={FoudWifi} />
            <Route exact path="/gateway/connect" component={Connect} />
            <Route exact path="/gateway/inputPassword" component={InputPassword} />
            <Route exact path="/gateway/noGateway" component={NoGateway} />
            <Route exact path="/gateway/gatewayReset" component={GatewayReset} />
            <Route exact path="/gateway/customRoom" component={CustomRoom} />
            <Route exact path="/gateway/addApGateway1" component={PageAddApGateway1} />
            <Route exact path="/gateway/addApGateway2" component={PageAddApGateway2} />
      </LayoutMultilayer>
    );
  }
}