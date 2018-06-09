import React, { Component } from 'react';
import './default/style.css';
import { Lang } from '../public';
import { Route } from 'react-router-dom';
import { LayoutMultilayer } from 'lds-rc';
import Setting from './Setting';
import Record from './Record';
import Siren from './Siren';
import Volume from './Volume';
import EffectiveTime from './EffectiveTime';
import Mode from './Mode';
import SetDelayTime from './SetDelayTime'

export default class Security extends Component {
  constructor(props) {
  	super(props);
	}
    
  render() {
    return (
		  <LayoutMultilayer
        history={this.props.history}
        location={this.props.location}
      >
        <Route path="/security/mode/:mode?" component={Mode} />
        <Route exact path="/security/delay/:mode?" component={SetDelayTime} />
        <Route exact path="/security/set" component={Setting} />
        <Route exact path="/security/record" component={Record} />
        <Route exact path="/security/volume" component={Volume} />
        <Route exact path="/security/effectiveTime" component={EffectiveTime} />
        <Route exact path="/security/siren" component={Siren} />
      </LayoutMultilayer>
    );
  }
}