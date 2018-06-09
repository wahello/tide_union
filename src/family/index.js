import React, { Component } from 'react';
import { connect } from 'react-redux';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import LayoutMultilayer from '../layout/multilayer';
import FamilySet from './set';
import SetPwd from './setPwd';
import FamilyCreate from './create';
import FamilyList from './list';
import FamilyWallpaper from './wallpaper';
import './default/style.css';

class Family extends Component {
  render() {
    return (
      <div>
          <LayoutMultilayer history={this.props.history} location={this.props.location}>
            <Route exact path="/family" component={FamilyList} />
            <Route exact path="/family/set/:familyId" component={FamilySet} />
            <Route exact path="/family/create" component={FamilyCreate} />
            <Route exact path="/family/wallpaper/:familyId" component={FamilyWallpaper} />
            <Route exact path="/family/setPwd" component={SetPwd} />
          </LayoutMultilayer>
          
          
      </div>
    );
  }
}

export default connect()(Family)
