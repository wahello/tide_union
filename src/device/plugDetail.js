import React, { Component } from 'react';
import BarTitle from '../component/barTitle';
import { Lang } from '../public';
import { connect } from 'react-redux';
import Device from '../jssdk/device';
import SystemApi from '../jssdk/system';
import './default/style.css';

class plugDetail extends Component{
	constructor(props){
		super(props);
		const { deviceItem } = this.props;
		this.device = new Device;
		this.systemApi = new SystemApi;
		this.state = {
			OnOff:deviceItem.attr.OnOff
		}
		this.handleClickBack = this.handleClickBack.bind(this);
		this.handleClickSet = this.handleClickSet.bind(this);
		this.handleChangeSwitch = this.handleChangeSwitch.bind(this);
	}
	
	handleClickBack(){
		this.props.history.goBack();
	}
	
	handleClickSet(){
		const { deviceItem } = this.props;
		this.props.history.push(`/device/edit/${deviceItem.devId}`);
	}
	
	handleChangeSwitch(value){
		let that = this;
		const { deviceItem } = this.props;
		if (!deviceItem.online) {
			return false;
		}

		this.setState({ OnOff: value });
		this.device.setDevAttrReq({
			parentId: deviceItem.parentId,
			payload: {
				devId: deviceItem.devId,
				attr: {
					"OnOff": 0 + value
				}
			}
		}).then(res => {
			console.log("OnOff回传：", res);
			if (res && res.ack && res.ack.code == 200) {
			} else {
				that.setState({ OnOff: !that.state.OnOff });
			}
		}).catch(res => {
			that.setState({ OnOff: !that.state.OnOff });
		});
	}
	
	componentDidMount(){
		this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
	}
	
	render(){
		let iconState = !this.state.OnOff ? ' off' : '';
		let btnState = !this.state.OnOff ? ' off' : '';
		const { deviceItem } = this.props;
		return (
			<div className="device plugDetail">
				<BarTitle onBack={this.handleClickBack} title={deviceItem.name}  >
		        	<a className="set-btn" onClick={this.handleClickSet}></a>
		        </BarTitle>
		        <div className="bodyer">
		        	{deviceItem.attr.PowerLow && <i className="battery-icon"></i>}
			        <div className={'plug-icon' + iconState} onClick={this.handleChangeSwitch.bind(this, !this.state.OnOff)}>
	                </div>
		        </div>
			</div>
		)
	}
}

//将state绑定到props
const mapStateToProps = (state) => {
  const devId = (state.device.fromPage === 'list' || state.device.recordAttr.devId === '') ? state.device.deviceItem.devId : state.device.recordAttr.devId;
  return {
  	recordAttr: state.device.recordAttr,
	devId:devId,
	deviceItem:state.device.items[devId]
  }
};

//将action的所有方法绑定到props上
const mapDispatchToProps = (dispatch) => {
  return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(plugDetail);

