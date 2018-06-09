import React, {
	Component
} from 'react';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import { bindActionCreators } from 'redux';
import Device from '../jssdk/device';
import BarTitle from '../component/barTitle';
import { showDialog } from '../action';
import { Lang } from '../public/resource';
import SystemApi from '../jssdk/system';
import ScrollView from '../component/scrollView';
import './default/style.css';
import './default/searchStyle.css';
import SearchComponent from './component/SearchComponent';
import { initAddDevNotifyList, shouldUpdateDeviceList, initBindDevNotify } from '../action/device';
import MQTTService, { TOPIC } from '../jssdk/MQTTService';
import { Toast } from 'antd-mobile';

const dialogLang = Lang.public.dialog;
class SearchByAp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			init: true,
			searching: false,
			error: false,
			mac: this.props.location.mac,
			ssid: this.props.location.ssid,
			passWord: this.props.location.passWord,
			ip: this.props.location.ip
		};
		
		this.systemApi = new SystemApi;

		this.handleClickBack = this.handleClickBack.bind(this);
		this.device = new Device();
		this.cookies = new Cookies();
		this.handleClickToSet = this.handleClickToSet.bind(this);
		this.startSearchDevices = this.startSearchDevices.bind(this);
		this.tryAgain = this.tryAgain.bind(this);
	}

	componentDidMount() {
		this.startSearchDevices();
	}
	
	//订阅设备广播主题
	subscribeDirectDev() {
    const { directDevIds } = this.props;
    let directDevIdTotal = directDevIds.gateway.concat(directDevIds.devices);
    if (directDevIdTotal.length) {
      directDevIdTotal.map((devId) => {
        console.log(`===============订阅主题：lds/v1/cb/${devId}/# =====================`);
        MQTTService.subscribe({
          topic: `${TOPIC.broadcastV1}/${devId}/#`,
        });
      });
    }
  }
	
	tryAgain() {
		this.startSearchDevices();
		this.setState({
			searching: true,
			error: false,
		});
	}

	handleClickBack() {
		const {
			addDevNotifyList,
			actions,
			devBindNotif
		} = this.props;
		this.stopSearching();

		this.setState({
			refreshing: false,
			searching: false,
		});
		const devIds = [];
		if(devBindNotif) {
			devIds.push(devBindNotif.payload.devId);
			this.delDevForUnselect(devIds);
		}

		actions.initAddDevNotifyList();
		actions.initBindDevNotify();
		this.props.history.goBack();
	}

	delDevForUnselect(devIds) {
		if(!devIds.length) {
			return;
		}
		const {
			directDevIds,
			items
		} = this.props;
		devIds.map((id) => {
			this.device.delDevReq({
				parentId: items[id].parentId?items[id].parentId:id,
				payload: {
					devId: id,
				},
			}).then(() => {});
		});
	}

	startSearchDevices() {
		if(this.state.searching) {
			return;
		}

		const {
			directDevIds
		} = this.props;
		this.setState({
			init: false,
			refreshing: true,
			searching: true,
		});

		this.setState({
			refreshing: false,
			searching: true,
		});

		// 60秒超时
		setTimeout(() => {
			this.setState({
				searching: false,
			});
		}, 60000);

		console.log("this.state.ip = ", this.state);
		if(this.state.ip) {
			this.searchApMode();
		} else {
			this.searchSmartLink();
		}
	}

	searchApMode() {
		var dataList = [];
		let that = this;
		let { showDialog } = this.props;
		this.device.setWifiReq({
			ip: this.state.ip,
			port: "6667",
			payload: {
				ssid: this.state.ssid,
				password: this.state.passWord,
				secret: "WPA2",
				timestamp: "2018-03-14 17:30:00",
			}
		}).then(res => {
			console.log("------setWifiResp:", res);
			if(res.ack.code == 200) {
				Toast.hide();
				const icon = <span className="warn-icon" />;
				
				showDialog(icon,"Please connect to the home router's WiFi", [{
					text: dialogLang.button[1],
					handleClick: function cancel() {
						that.systemApi.gotoWiFiSetting();
						this.hide();
					},
				}]);				
			}
		}).catch(res => {
			console.log("catch setWifi Error-----", res);
			this.setState({
				refreshing: false,
				searching: false,
				error: true,
			});
		});
	}

	searchSmartLink() {
		var dataList = [];
//		this.device.devDisconnect({
//			timestamp: "2018-03-14 17:30:00",
//		});
		
//		MQTTService.disconnect({});
        

		this.device.devDiscoveryReq({
			ip: "255.255.255.255",
			port: "6666",
			payload: {
				timestamp: "2018-03-14 17:30:00",
			}
		}).then(res => {
			console.log("------devDiscoveryReq:" + res.payload.devId + "-" + res.payload.ip + "-" + res.payload.mac + "-" + res.payload.model);
			console.log("this.state.mac", this.state.mac);
//			let noMac = this.state.mac.replaceAll(":","");
//			console.log("noMac = ", noMac);
			// 如果设备发现的Mac地址与进来的Mac一致，则判定发现到该设备
			if(res.payload.mac == this.state.mac) {
				console.log("一样的mac");
				let gmtHours = new Date().getTimezoneOffset() / 60;
			
				let timeZone = "GMT";
				if(gmtHours < 0){
					timeZone = timeZone+"+" + Math.abs(Number(gmtHours));
				} else if(gmtHours > 0){
					timeZone = timeZone+"-" + Math.abs(Number(gmtHours));
				}
				
				console.log("timeZone " + timeZone);
				
				this.device.setBindInfoReq({
					ip: res.payload.ip,
					port: "6667",
					payload: {
						timeZone: timeZone,
						userId: this.cookies.get('userId'),
						timestamp: "2018-03-14 17:30:00",
					}
				}, 5000).then((res) => {
					console.log("setBindInfoResp=======", res);
					if(res.ack.code != 200) {
						throw res;
					}

				}).catch(res => {
					console.log("setBindInfoResp Error----");
					this.setState({
						refreshing: false,
						searching: false,
						error: true,
					});

					this.props.history.push(`/device/plugAddFail`);
				});
			}
		}).catch(res => {
			console.log("-----");
			this.setState({
				refreshing: false,
				searching: false,
				error: true,
			});
		});
	}

	stopSearching() {
		const {
			directDevIds
		} = this.props;
//		this.device.stopDevReq({
//			parentId: directDevIds[0],
//			payload: {},
//		}).then(() => {
//			console.log('停止搜索');
//		}).catch((res) => {
//			console.log(`停止搜索失败${res.CODE}`);
//		});
	}

	handleClickToSet() {
		this.stopSearching();
		const {
			actions,
			searchType,
			directDevIds,
			currentHomeId,
			addDevNotifyList,
			devBindNotif
		} = this.props;
		const device = devBindNotif.payload;
		const data = {
			name: device.name || "WiFi Plug",
			devId: device.devId,
			type: searchType,
			icon: "plug",
			devType: searchType,
		};
		this.subscribeDirectDev();
		const path = {
			pathname: '/gateway/addSuccess',
			query: data,
		};

		actions.initAddDevNotifyList();
		actions.initBindDevNotify();

		this.props.history.push(path);
	}

	render() {
		const {
			addDevNotifyList,
			searchType,
			devBindNotif
		} = this.props;
		console.log("devBindNotif=",devBindNotif);
		const notFoundEle = () => {
			if(this.state.init || this.state.searching || this.state.refreshing || devBindNotif) {
				return null;
			}
			return <div className='not_foud'>{Lang.device.deviceNotFound}</div>;
		}

		const btnEle = () => {
			if(devBindNotif) {
				return <button className="doneBtn" onClick={this.handleClickToSet}>{Lang.public.done}</button>;
			}
			if(this.state.init || this.state.searching || this.state.refreshing) {
				return null;
			}
			return <button className="doneBtn" onClick={this.tryAgain}>{Lang.public.tryAgain}</button>;
		}
		return(
			<div className="searchHub" >
        <BarTitle onBack={this.handleClickBack} title={`Search ${searchType}`} />
        <div className="searchHub_main">
          {notFoundEle()}
          {(this.state.searching && !this.state.error) ?
            <div className="search">
              <span>{Lang.pullToRefresh.searching}</span>
              <i className={this.state.searching ? 'animation_list' : ''} />
            </div> : null}
          <ScrollView>
            {devBindNotif ? 
            	<SearchComponent
                data={devBindNotif}
                key={devBindNotif.payload.devId}
                type={searchType}
                mac={this.state.mac}
              />:""}
          </ScrollView>
          {btnEle()}
        </div>
      </div>
		);
	}
}
const mapStateToProps = (state, ownProps) => {
	return {
		// addDevNotifyList: process.env.NODE_ENV === 'development' ? [{
		// 	devId: 'BBBBBBB',
		// 	name: 'aaa1',
		// 	devType: 'Light_RGBW',
		// 	deviceSelect: false,
		// }, {
		// 	devId: 'CCCCCCC',
		// 	name: 'aaa2',
		// 	devType: 'Alarm_Siren',
		// 	deviceSelect: false,
		// }, {
		// 	devId: 'd',
		// 	name: 'aaa3',
		// 	devType: 'Alarm_Siren',
		// 	deviceSelect: false,
		// }, {
		// 	devId: 'e',
		// 	name: 'aaa4',
		// 	devType: 'Alarm_Siren',
		// 	deviceSelect: false,
		// }, {
		// 	devId: 'f',
		// 	name: 'aaa5',
		// 	devType: 'Alarm_Siren',
		// 	deviceSelect: false,
		// }, {
		// 	devId: 'g',
		// 	name: 'aaa6',
		// 	devType: 'Alarm_Siren',
		// 	deviceSelect: false,
		// }, {
		// 	devId: 'h',
		// 	name: 'aaa7',
		// 	devType: 'Alarm_Siren',
		// 	deviceSelect: false,
		// }, {
		// 	devId: 'i',
		// 	name: 'aaa8',
		// 	devType: 'Alarm_Siren',
		// 	deviceSelect: false,
		// }, {
		// 	devId: 'j',
		// 	name: 'aaa9',
		// 	devType: 'Alarm_Siren',
		// 	deviceSelect: false,
		// }, {
		// 	devId: 'k',
		// 	name: 'aaa10',
		// 	devType: 'Alarm_Siren',
		// 	deviceSelect: false,
		// }] : state.device.addDevNotifyList || [],

		addDevNotifyList: state.device.addDevNotifyList,
		directDevIds: state.device.directDevIds,
		searchType: ownProps.match.params.type,
		currentHomeId: state.family.currentId,
		devBindNotif: state.device.devBindNotif,
		items: state.device.items,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		showDialog: (title, tip, btns) => {
			dispatch(showDialog(title, tip, btns));
		},
		actions: bindActionCreators({
			initAddDevNotifyList,
			shouldUpdateDeviceList,
			initBindDevNotify,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchByAp);