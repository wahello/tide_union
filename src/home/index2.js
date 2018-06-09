import React, { Component } from 'react';
import './default/style.css';
import { Lang } from '../public';
import { Route, Link, Switch } from 'react-router-dom';
import LayoutPushlayer from '../layout/pushlayer';
import PageMenuMain from './main';
import PageMenuAdd from './add';

export default class extends Component {
  constructor(props) {
  	super(props);
	}
  
  componentDidMount() {
  }
    
  render() {
    return (
			<LayoutPushlayer history={this.props.history} location={this.props.location}>
				<Route exact path="/menu" component={PageMenuMain} />
      	<Route exact path="/menu/add" component={PageMenuAdd} />
      </LayoutPushlayer>
    );
  }
}