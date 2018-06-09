import React, { Component } from 'react';
import './default/style.css';
import { Lang } from '../public';
import { Route, Link, Switch } from 'react-router-dom';
import LayoutMultilayer from '../layout/multilayer';
import PageMain from './main';
import PageSceneAdd from './add';
import IconSelect from './icon';
import UpdateIcon from './updateIcon';
import CreateScene from './createScene';

export default class extends Component {
  constructor(props) {
  	super(props);
	}
  
  componentDidMount() {
  }
    
  render() {
    return (
		  <LayoutMultilayer history={this.props.history} location={this.props.location}>
        <Route exact path="/scene/add" component={PageSceneAdd} />
        <Route exact path="/scene/icon" component={IconSelect} />
        <Route exact path="/scene/update/icon" component={UpdateIcon} />
        <Route exact path="/scene/createScene" component={CreateScene} />
    
      </LayoutMultilayer>
    );
  }
}