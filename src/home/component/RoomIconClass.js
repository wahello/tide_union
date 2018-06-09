import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class RoomIconClass extends Component {
    render() {
        return (<i className={`room-icon${this.props.flag} room-icon-${this.props.type}`}></i>);
    }
}