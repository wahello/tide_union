import React, { Component } from 'react';
import Device from '../jssdk/device';
import BarTitle from '../component/barTitle';
import { showDialog } from '../action';
import helper from '../public/helper';
import { Lang } from '../public/resource';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PullToRefresh, Toast } from 'antd-mobile';
import SystemApi from '../jssdk/system';
import { createForm } from 'rc-form';
import Cookies from 'universal-cookie';
import ScrollView from '../component/scrollView';
import { initBindDevNotify } from '../action/device';
import './default/style.css';

import ListView from 'antd-mobile/lib/list-view';
import 'antd-mobile/lib/list-view/style/css';

var dataArr = [];
var GET_ = null;
let gateway = []

function getWifiList() {
	for (let i = 0; i < gateway.length; i++) {
		setTimeout(() => {
			if (!dataArr.length) {
				dataArr.push(gateway[i])
			} else {
				let hasArrs = dataArr.filter((d) => {
					return d.devId === gateway[i].devId;
				});
				if (!hasArrs.length) {
					dataArr.push(gateway[i])
				}
			}
			// dataArr.push(gateway[i])
		}, i * 1000);
	}
	return dataArr;
}

// class SearchComponent extends Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			key: this.props.num
// 		}
// 	}

// 	render() {
// 		return (
// 			<div className="gateway-cell">
// 				<i className="gateway_icon"></i>
// 				<span className="gateway_spanLine" >{this.props.data.name}</span>
// 				<span className={"gateway_check"} onClick={this.props.handleChecked.bind(this, { id: this.props.id }, { name: this.props.name }, { type: this.props.type }, { model: this.props.model }, { ip: this.props.ip })}></span>
// 			</div>
// 		);
// 	}
// }

const ds = new ListView.DataSource({
	rowHasChanged: (r1, r2) => r1 !== r2
});
class SearchGW extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searching: true,
			error: false,
			data: [],
			selectedGateway: null,
		};
		this.cookies = new Cookies;
		this.device = new Device;
		this.systemApi = new SystemApi;
		this.handleClickBack = this.handleClickBack.bind(this);
		this.handleClickToSet = this.handleClickToSet.bind(this);
		this.handleChecked = this.handleChecked.bind(this);
		this.tryAgain = this.tryAgain.bind(this);
		this.requestGateway = this.requestGateway.bind(this);
		this.onRefresh = this.onRefresh.bind(this);
	}

	handleChecked(item) {
		this.setState({
			selectedGateway: item,
		});
	}

	requestGateway() {
		const { actions } = this.props;
		actions.initBindDevNotify();
		
		var _time = new Date();
		dataArr = [];
		var currentTime = _time.getFullYear() + "-" + ((_time.getMonth() + 1) < '10' ? "0" + (_time.getMonth() + 1) : _time.getMonth() + 1) + "-" + _time.getDate() + " " + _time.getHours() + ":" + _time.getMinutes() + ":" + _time.getSeconds();
		console.log(currentTime);
		gateway = []
		GET_ = null;
		this.setState({
			searching: true
		});
		this.device.devDiscoveryReq({
			ip: "255.255.255.255",
			port: "6666",
			payload: {
				timestamp: helper.dateFormat(new Date, 'yyyy-dd-mm hh:MM:ss'),
			}
		}).then(res => {
			var gateway = [{
				name: res.payload.mac,
				devId: res.payload.devId,
				model: res.payload.model,
				ip: res.payload.ip
			}];
			gateway.map((item, index) => {
				let hasArrs = dataArr.filter((d) => {
					return d.devId === item.devId
				});
				if (!hasArrs.length) {
					dataArr.push({ name: item.name, devId: item.devId, model: item.model, type: "Gateway", ip: item.ip });
				}
			});
			
			this.setState(preState => ({
				data: dataArr
			}));
			// for (var i = 1; i <= gateway.length; i++) {
			// 	setTimeout(() => this.setState({
			// 		data: dataArr
			// 	}), i * 1000);
			// };
			// this.setState({
			// 	searching: false
			// });
		}).catch(res => {
			console.log('devDiscoveryReq', res);
			this.setState({
				error: true,
				searching: false
			})
		});

		// for (var i = 0; i < 3; i++) {
		// 	setTimeout(() => this.setState({
		// 		data: getWifiList(),
		// 	}), i * 1000);
		// }
	}

	componentDidMount() {
		this.requestGateway();
		this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
	}

	handleClickBack(event) {
		//this.props.history.goBack();
		const { selectedGateway } = this.state;
		if (selectedGateway === null) {
			this.props.history.goBack();
		}else if(this.state.error === true){
			this.props.history.push("/home");
		} else {
			let path = {
				pathname: "/gateway/adding",
				query: selectedGateway
			}
			this.props.history.push(path);
		}
	}

	handleClickToSet(event) {
		const { selectedGateway } = this.state;
		if (selectedGateway === null) {
			Toast.info(Lang.gateway.searchGateway.tips[3], 2);
		} else {
			let path = {
				pathname: "/gateway/adding",
				query: selectedGateway
			}
			this.props.history.push(path);
		}
		// this.props.history.push('/gateway/adding');
	}

	tryAgain() {
		this.setState({
			error: false,
			searching: true
		});
		this.requestGateway();
	}

	onRefresh() {
		this.setState({
			refreshing: true,
			searching: true,
		});
		setTimeout(() => {
			this.setState({
				data: getWifiList(),
			});
		}, 1000);
		setTimeout(() => {
			this.setState({
				refreshing: false,
				searching: false,
			});
		}, 3000);
	}

	render() {
		const dataSource = ds.cloneWithRows(this.state.data);
		const row = (item, sid, rid) => {
			return <div className="gateway-cell">
				<i className="gateway_icon"></i>
				<span className="gateway_spanLine" >{item.name}</span>
				<span className={`${this.state.selectedGateway && item.devId === this.state.selectedGateway.devId ? 'gateway_checked' : 'gateway_check'}`} onClick={() => {
					this.handleChecked(item);
				}}></span>
			</div>
		};

		return (
			<div className="search_gateway" >
				<BarTitle onBack={this.handleClickBack} title='Search Gateway' />
				<div className='foud_gateway'>
					<div className="gate_search" style={{ display: (this.state.error ? "none" : " ") }} >
						{Lang.gateway.searchGateway.tips[0]}
						<div className={this.state.searching ? "_animation" : ''}></div>
					</div>
					{!this.state.error ? <ListView
						key="1"
						style={{height: "calc(100vh - 10rem - 64px)"}}
						useBodyScroll={false}
						dataSource={dataSource}
						renderRow={row}
						// pullToRefresh={
						// <PullToRefresh
						// 	distanceToRefresh={35}
						// 	refreshing={this.state.refreshing}
						// 	onRefresh={this.onRefresh}
						// 	/>}
					/> : (<div>
							<div className='not_foud' style={{ display: (this.state.error ? "block" : "none") }} >{Lang.gateway.searchGateway.tips[2]}</div>
							<button className="try_again_no" onClick={this.tryAgain}>{Lang.gateway.searchGateway.button[0]}</button>
						</div>)
					}
					<div className="btnBack" >
						{(this.state.data.length && !this.state.error) ? <button className="doneBtn" onClick={this.handleClickToSet} >{Lang.gateway.searchGateway.button[1]}</button> : null}
					</div>
				</div>
				
			</div>
		);
	}
}
  
const mapStateToProps = state => {
	return state
}

const mapDispatchToProps = dispatch => {
	return {
		actions: bindActionCreators({
		initBindDevNotify
		}, dispatch),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(SearchGW))