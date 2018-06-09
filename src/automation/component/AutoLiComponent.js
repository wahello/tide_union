import React, { Component } from 'react';
import '../default/automationStyle.css';


export default  class AutoLiComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			state: true,
			data: this.props.data,
		};
		this.handleSelect = this.handleSelect.bind(this);
		this.handleSwitchClick = this.handleSwitchClick.bind(this);
	}

	handleSelect(event) {
		this.props.data.sel = !this.props.data.sel
		this.props.makeDeviceSel(this.props.data);
	}
	handleSwitchClick() {
		//	setState是异步的，可以利用setState的第二传参，传入一个回调(callback)函式
		this.props.data.switch = !this.props.data.switch
		this.props.makeDevSwitch()
	}

	render() {
		return(
			<li >
	            	<label  className={this.props.data.sel ? "act":""}   onClick={this.handleSelect}></label>
	            	<div className={ this.props.data.switch ? ("auto-device-box"+"  " +this.props.data.type+ "-true") :("auto-device-box"+"  " + this.props.data.type+ "-false")} >
						<div className= {this.props.data.offline ?'line':'line off-line'}></div>
	            		<section>
	            			<h2>{this.props.data.title}</h2>
	            			<h3>{this.props.data.room}</h3>
	            		</section>
	            		<i >
							<a className={ this.props.data.switch ?"switch switch-on":"switch switch-off" } onClick={this.handleSwitchClick}></a>
							{/* <Switch checked = {this.props.data.switch} onClick={this.handleSwitchClick}  ></Switch> */}
						</i>
	            	</div>
	            </li>
		);
	}
}
