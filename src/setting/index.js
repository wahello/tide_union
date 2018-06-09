import React, { Component } from 'react';
import './default/style.css';
import PageUpdate from './update';
import PageAbout from './about';
import ActivityRecord from './activityRecord';
import PageAgreement from './agreement';
import PageFeedback from './Feedback';
import PageMain from './main';
import PageHelp from './help';
import {Route } from 'react-router-dom';
import LayoutMultilayer from '../layout/multilayer';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
		  <LayoutMultilayer history={this.props.history} location={this.props.location}>
        <Route exact path="/setting/main" component={PageMain}/>
        <Route exact path="/setting/update" component={PageUpdate}/>
        <Route exact path="/setting/about" component={PageAbout}/>
        <Route exact path="/setting/activityRecord" component={ActivityRecord}/>
        <Route exact path="/setting/agreement" component={PageAgreement}/>
        <Route exact path="/setting/Feedback" component={PageFeedback}/>
        <Route exact path="/setting/help" component={PageHelp}/>
      </LayoutMultilayer>
    );
  }
}