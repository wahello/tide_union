import React, { Component } from 'react';
import { Style, Lang } from './resource';

export default class NetworkAlert extends Component {
	render() {
		return (
			<div onClick={this.onClick} className="network-alert">
			<p>{this.props.children}</p>
			</div>
		);
	}
}