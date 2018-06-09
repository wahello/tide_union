import React, { Component } from 'react';
import { connect } from 'react-redux';
import NetworkAlert from '../layout/networkalert';
import MQTTService from '../jssdk/MQTTService';
import './default/style.css';
import { Link } from 'react-router-dom';


class BarTitle extends Component {
  render() {
    const { networkStatus, mqttStatus } = this.props;
    return (
      <React.Fragment>
	    	<div className="component bar-title">
	    		<div className="bar-content">
			  		{this.props.title ? <span className="title">{this.props.title}</span> : ''}
			  		{this.props.children}
			  		{this.props.onAdd ? <a onClick={this.props.onAdd} className="icon add"></a> : ''}
			  		{this.props.onBack ? <a onClick={this.props.onBack} className="icon back"></a> : ''}
			  		{this.props.onDelete ? <a onClick={this.props.onDelete} className="icon delete"></a> : ''}
			  		{this.props.onSave ? <a onClick={this.props.onSave} className="txt save">Save</a> : ''}
			  		{this.props.onDone ? <a onClick={this.props.onDone} className="txt done">{this.props.doneTitle?this.props.doneTitle:'Done'}</a> : ''}
			  		{this.props.onApMode ? <a onClick={this.props.onApMode} className="txt save">Ap mode</a> : ''}
			  		{this.props.onSmartLinkMode ? <a onClick={this.props.onSmartLinkMode} className="txt save">Smart link</a> : ''}
			  		{this.props.onRevise ? <a onClick={this.props.onRevise} className="txt save">Revise</a> : ''}
			  		{this.props.onEdit ? <a onClick={this.props.onEdit} className="icon edit"></a> : ''}
			  		{this.props.onMenu ? <a onClick={this.props.onMenu} className="icon menu"></a> : ''}
			  		{this.props.onSet ? <a onClick={this.props.onSet} className="icon setting"></a> : ''}
			  		{this.props.onRecord ? <a onClick={this.props.onRecord} className="icon record"></a> : ''}
		  		</div>
	      </div>
	      {
	        ((window.globalState.isLocal == 0) && (networkStatus === 0 || mqttStatus === 0)) ?
	          // <NetworkAlert>
	          //   {networkStatus === 0 ? 'The network disconnected. Please Check.' : <span>
	          //   		The mqtt disconnected 
	          //   		<a style={{color: "rgb(255, 175, 66)"}} onClick={()=>MQTTService.reconnect()}> reconenct </a>
	          //   		or
	          //   		<Link onClick={()=> { MQTTService.destroy();MQTTService.disconnect();}} style={{color: "rgb(255, 175, 66)"}} to="/user/login"> relogin </Link>
          	// 		</span>}
	          // </NetworkAlert>
						<NetworkAlert onClick={()=>MQTTService.reconnect()}>
	            Network disconnected
	          </NetworkAlert> : ''
	      }
	    </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    networkStatus: state.system.networkStatus,
    mqttStatus: state.system.mqttStatus,
  }
}

export default connect(mapStateToProps)(BarTitle);