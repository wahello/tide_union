import React, { Component } from 'react';
import BarTitle from '../component/barTitle';
import { Lang } from '../public';
import { connect } from 'react-redux';
import './default/style.css';

function DeviceList(props){
	const data = props.data;
	const listItems = data.map(item => 
		<li className={item.className} key={item.id.toString()}>{item.name}</li>
	);
	return (<ul>{listItems}</ul>);
}
class GatewayDetail extends Component{
	constructor(props){
		super(props);
		this.handleClickBack = this.handleClickBack.bind(this);
		this.handleClickSet = this.handleClickSet.bind(this);
		this.handleClickAdd = this.handleClickAdd.bind(this);
	}
	
	handleClickBack(){
		this.props.history.goBack();
	}
	handleClickAdd(){
		this.props.history.push("/device/addFlow");
	}
	handleClickSet(){
		const { deviceItem } = this.props;
		this.props.history.push(`/device/edit/${deviceItem.devId}`);
	}
	
	render(){
		const deviceList = [{
			id:1,
			name:"Bulb",
			className:"bulb"
		},
		{
			id:2,
			name:"Motion sensor",
			className:"motion"
		},
		{
			id:3,
			name:"Door / Window sensor",
			className:"door"
		},
		{
			id:4,
			name:"Switch",
			className:"switch"
		},
		{
			id:5,
			name:"Keypad",
			className:"keypad"
		}
		];
		const { deviceItem } = this.props;
		return(
			<div className="device gatewayDetail">
				<BarTitle onBack={this.handleClickBack} title={deviceItem.name} onDone={null} >
		        	<a className="set-btn" onClick={this.handleClickSet}></a>
		        </BarTitle>
		        <div className="bodyer">
		        	<div className="box-1">
		        		<span>{Lang.device.gatewayDetail.gatewayName}</span>
		        	</div>
		        	<div className="box-2">
		        		<DeviceList data={deviceList}/>
		        	</div>
		        	<button className="add-btn" onClick={this.handleClickAdd}>{Lang.device.gatewayDetail.buttonName}</button>
		        </div>
			</div>
		);
	}
}

//将state绑定到props
const mapStateToProps = (state) => {
  return {
  	deviceItem: state.device.deviceItem,
  }
};

//将action的所有方法绑定到props上
const mapDispatchToProps = (dispatch) => {
  return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(GatewayDetail);
