import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class SceneWhiteIcon extends Component {
  render() {
    return (<div className={`scene_icon scene_icon_${this.props.type}_white`}></div>);
  }
}