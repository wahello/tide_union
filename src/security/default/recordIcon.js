import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class RecordIcon extends Component {
  render() {
    return (<div className={`record_icon record_icon_${this.props.type}`}></div>);
  }
}