import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './default/style.css';


export default class ScrollView extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div style={this.props.style} className={`scroll-view ${this.props.className}`}>{this.props.children}</div>
    );
  }
}

ScrollView.propTypes = {
  className: PropTypes.string,
}

ScrollView.defaultProps = {
  className: '',
}