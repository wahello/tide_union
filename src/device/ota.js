import React, {
	Component
} from 'react';
import helper from '../public/helper';
import SystemApi from '../jssdk/system';
import { Lang } from '../public';
import { connect } from 'react-redux';
import './default/style.css';
import SelectApWifi from '../component/selectApWiFi';
import Toast from 'antd-mobile/lib/toast';
import Device from '../jssdk/device';
import OTA from '../jssdk/ota';
import Cookies from 'universal-cookie';
import BarTitle from '../component/barTitle';
import CircularProgress from '../component/circularProgress';

const cookies = new Cookies();
class DeviceUpdate extends Component {

	constructor(props) {
		super(props);
		this.state = {
			oldVersion: "V4.1.2",
			newVersion: "V4.5.6",
			verList: [{
				"devId":" x.xxxxxxx01",
        "stage":4,
        "percent":50,
        "oldVersion":"1111",
        "newVersion":"2222",
        "fwType":0
			}],
			devId: this.props.location.devId,
			shouldUpdateStatus: false,
			updateResult: false,
			updateProgress: 0,
			beforeUpdate: false,
			updating: false,
			updated: false
		}
		
		this.cookies = new Cookies;
		this.device = new Device();
		this.ota = new OTA();
		this.systemApi = new SystemApi;
		this.handleClickBack = this.handleClickBack.bind(this);
	}

	handleClickBack(event) {
		this.props.history.goBack();
	}
	
	componentWillReceiveProps(nextProps) {
		const { deviceUpdateInfo } = nextProps;
		console.log("收到OTA升级状态通知",nextProps);
		if(deviceUpdateInfo){
			if(deviceUpdateInfo !== null && deviceUpdateInfo !== this.props.deviceUpdateInfo) {
				if(deviceUpdateInfo.devId === this.props.location.devId){
					Toast.hide();
					this.changeUpdateStatus([deviceUpdateInfo]);
				}
			}	
		}			
	}
	
	componentWillMount() {
		const {versionList} = this.props;
		Toast.loading();
		this.fetchDeviceVersion();
		
	}

	componentDidMount() {
	}

	componentWillUnmount() {

	}
	
	/**
	 * stage 设备上报的OTA状态
	 * 阶段  空闲==0     正在下载==1     下载完成==2    等待升级==3    正在安装==4     完成安装==5    升级失败==6    设备在忙==7
	 * 
	 */
	
	changeUpdateStatus(verList) {
		if(verList[0].stage == 0){
			if(verList[0].newVersion && verList[0].oldVersion != verList[0].newVersion){				
				this.setState({
					shouldUpdateStatus: true,
					beforeUpdate: true,
					updating: false,
					updated: false
				});
			}else {
				this.setState({
					shouldUpdateStatus: false,
					beforeUpdate: true,
					updating: false,
					updated: false
				});
			}
		}else if(verList[0].stage == 1 || verList[0].stage == 2 || verList[0].stage == 3 || verList[0].stage == 4 || verList[0].stage == 7){
			this.setState({
				shouldUpdateStatus: false,
				beforeUpdate: false,
				updating: true,
				updated: false,
				updateProgress: verList[0].percent
			});
		}else if(verList[0].stage == 5){
			this.setState({
				beforeUpdate: false,
				updating: false,
				updated: true,
				updateResult: true,
			});
		}else if(verList[0].stage == 6){
			this.setState({
				beforeUpdate: false,
				updating: false,
				updated: true,
				updateResult: false,
			});
		}
	}
	
	fetchDeviceVersion() {
		const {device} = this.props;
		this.ota.fetchVersionList({
			payload: {
				devId: [this.state.devId],
				productId: "",
				devType: "",
				homeId: "",
			},
			userId: cookies.get("userId"),
			device: device
		}).then(res => {
			Toast.hide();
			let verList = res.payload.verList;
			this.setState({
				verList: verList
			});
			this.changeUpdateStatus(verList);
		}).catch(err => {
			Toast.hide();
			console.log("-----------fetchlist error------------");
			console.log("err:",err);
		});
	}
	
	onUpdate() {
		const {device} = this.props;
		Toast.loading();
		this.ota.updateDevice({
			payload: {
				"devId": [this.state.devId],
				"timestamp": "2014-04-05T12:30:00-02:00"
			},
			device: device,
			newVersion: this.state.verList[0].newVersion,
			userId: cookies.get("userId")
		});
	}

	render() {
		let scale = (document.documentElement.clientWidth / 375).toFixed(2);
    scale = (scale > 1.4 ? 1 : scale);
    
    const whetherUpdateUI = () => {
    	if(!this.state.shouldUpdateStatus){
    		return (
    			<div>
						<div className="updateIcon"></div>
						<p className="updateTip">{`${Lang.ota.latestTip[0]} ${this.state.verList[0].oldVersion} ${Lang.ota.latestTip[1]}`}</p>
					</div>
				)
    	}else{
    		return (
    			<div>
						<div className="updateIcon"></div>
						<p className="updateTip">{Lang.ota.newestTip[0]}<br />{Lang.ota.newestTip[1]} {this.state.verList[0].newVersion}</p>
						<p className="updateNotice">{Lang.ota.newestTip[2]}<br />{Lang.ota.newestTip[3]}<br />{Lang.ota.newestTip[4]}</p>
						<div onClick={this.onUpdate.bind(this)} className="updateButton">{Lang.ota.updateNow}</div>
					</div>
    		)
    	}
    }
    
    const updatingProgressUI = (progressNum) => {
    	return <div className="updateProgress">
				<CircularProgress className="circular-progress" pointR={0} r={ 70 * scale } progress={progressNum/100} strokeWidth={5 * scale } />
				<p className="updateNumber">{progressNum + "%"}</p>
				<p className="updateProgressTip">{Lang.ota.updating}</p>
			</div>
    }
    
    const updateResultUI = () => {
    	return this.state.updateResult?
    	<div className="updateStatus success">
				<div></div>
				<p>{Lang.ota.updateSuccess}</p>
			</div>:
			<div>
				<div className="updateStatus fail">
					<div></div>
					<p>{Lang.ota.updateFail}</p>				
				</div>
				<div onClick={this.onUpdate.bind(this)} className="updateButton">{Lang.ota.tryAgain}</div>
			</div>
    }
    
		return(
			<div className="deviceUpdate">
				<BarTitle onBack={this.handleClickBack} title={Lang.ota.title}/>
				{
					this.state.beforeUpdate?whetherUpdateUI(this.state.updateProgress):''
				}	
				{
					this.state.updating?updatingProgressUI(this.state.updateProgress):''
				}	
				{
					this.state.updated?updateResultUI(this.state.updateProgress):''
				}	
			</div>
		);
	}
}

//将state绑定到props
const mapStateToProps = (state,ownProps) => {
	const currentDevId = ownProps.match.params.devId;
	return {
		versionList: state.ota.versionList,
		deviceUpdateInfo: state.ota.deviceUpdateInfo,
		device: state.device.items[currentDevId]
	}
};
//将action的所有方法绑定到props上
const mapDispatchToProps = (dispatch) => {
	return {
		
	}
};
export default connect(mapStateToProps, mapDispatchToProps)(DeviceUpdate);