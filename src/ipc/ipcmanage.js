import React, {
	Component
} from 'react';
import './default/style.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeFromPage } from '../action';
import { Lang } from '../public';
import BarTitle from '../component/barTitle';
import { Route, Link } from 'react-router-dom';
import { Button,WhiteSpace} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import jsBridge from '../jssdk/JSBridge';
import Switch from '../component/switch';
import Cookies from 'universal-cookie';
import IpcPlanAPi from '../jssdk/ipcplan';
import { showDialog } from '../action';
import Toast from 'antd-mobile/lib/toast';
import { saveIpcdata, saveIpcCycle } from '../action/ipc';
const flag=true;
Date.prototype.Format = function (fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份   
		"d+": this.getDate(), //日   
		"h+": this.getHours(), //小时   
		"m+": this.getMinutes(), //分   
		"s+": this.getSeconds(), //秒   
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度   
		"S": this.getMilliseconds() //毫秒   
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

function stringToDate(timeStr) {
	if (timeStr==null) {
		return '0000/00/00'
	}
	var date = new Date(timeStr).Format('yyyy/MM/dd');
	
	
	return date.toString();
}
function isInArray(arr, value) {
	for (var i = 0; i < arr.length; i++) {
		if (value === arr[i]) {
			return true;
		}
	}
	return false;
}
function getWeekdayOfplan(plan) {
	var plantimer = '';
	let isday=[0,0,0,0,0,0,0];
	if (isInArray(plan.dayIndex, '1')) {
		plantimer = plantimer + Lang.ipc.videomanagement.Monday + ',';
		isday[0] = 1;
	}
	if (isInArray(plan.dayIndex, '2')) {
		plantimer = plantimer + Lang.ipc.videomanagement.Tuesday + ',';
		isday[1] = 1;
	}
	if (isInArray(plan.dayIndex, '3')) {
		plantimer = plantimer + Lang.ipc.videomanagement.Wednesday + ',';
		isday[2] = 1;
	}
	if (isInArray(plan.dayIndex, '4')) {
		plantimer = plantimer + Lang.ipc.videomanagement.Thursday + ',';
		isday[3] = 1;
	}
	if (isInArray(plan.dayIndex, '5')) {
		plantimer = plantimer + Lang.ipc.videomanagement.Friday + ',';
		isday[4] = 1;
	}

	if (isInArray(plan.dayIndex, '6')) {
		plantimer = plantimer + Lang.ipc.videomanagement.Saturday + ',';
		isday[5] = 1;
	}
	if (isInArray(plan.dayIndex, '7')) {
		plantimer = plantimer + Lang.ipc.videomanagement.Sunday;
		isday[6] = 1;
	} 
	
	let work = false;
	let weekend = false;
	let maybeWeek = false;
	let num = 0;
	isday.map((value,index)=>{
		num = num+value;
		if (num==0&index==4) {
			maybeWeek = true;
		}
		if (maybeWeek&&num==2) {
			weekend = true;
		}
		if (num==5 & index ==4) {
			work = true;
		}
		if (num==7) {
			work = true;
			weekend = true;
		}
		if (num>5&work==true) {
			work = false;
		}
	});
	if (work&weekend) {
		return Lang.ipc.videomanagement.everyday;
	}
	if (work) {
		return Lang.ipc.videomanagement.workday;
	}
	if (weekend) {
		return Lang.ipc.videomanagement.weekend;
	}
	return plantimer;
}

class Ipcmanage extends Component {
	constructor(props) {
    super(props);
    this.state = {
			plan:null,
			startload:true,
			error:false,
		}
		this.handleClickBack = this.handleClickBack.bind(this);
		this.handlePlanRenew = this.handlePlanRenew.bind(this);
    this.handleVideoSwitch = this.handleVideoSwitch.bind(this);

	}
	componentDidMount() {
		this.getPlanlist();
		console.log('startLoad');
		
	}

	getPlanlist(){
		Toast.loading(Lang.public.loading,0);
		const { deviceItem } = this.props;
		console.log('devid', this.props);

		var par = {
			deviceId: deviceItem.devId
		};
		const that = this
		console.log('getplanList' + par);
		this.setState({startload:true});
		IpcPlanAPi.getPlanInfoByDevId(par).then(res => {
			Toast.hide();
	
			if (res && res.code === 200) {
				if (res.data) {//有计划
					let checkSt = res.data.planExecStatus === '1' ? true : false;
					that.setState({
						plan: res.data,
						startload:false,
					})
					this.props.actions.saveIpcdata(res.data)

				} else {
					this.setState({ plan: null ,startload:false})
				}
			} else {
				Toast.info(res.desc)
				this.setState({ plan: null, startload: false,error:true})
			}
		})
	}

	handleClickBack(event) {
		this.props.history.goBack();
	}
	handlePlanRenew () {
		
		if (this.state.plan.renewRemindFlag==1) {
			const { actions, } = this.props;
			actions.changeFromPage('list');
			let data = {
				price: this.state.plan.packagePrice,
				planName: this.state.plan.packageName,
				planDesc: this.state.plan.desc,
				packageId: this.state.plan.packageId,
				planId: this.state.plan.planId,
			}
			let path = {
				pathname: '/ipc/selectplan',
				query: data
			}

			this.props.history.push(path);
			
		} else {
			
		}
  }

	handleVideoSwitch(e){

		let planExec = this.state.plan.planExecStatus=='1' ? 0 : 1;
		Toast.loading(Lang.public.loading,0);

		let planId = this.state.plan.planId
		let planExecStatus = planExec
		let tips = planExec === 1 ? '开启' : '关闭'
		IpcPlanAPi.updatePlanExecStatus('planId=' + planId, 'planExecStatus=' + planExecStatus).then(res => {
			Toast.hide();
			if (res && res.code === 200) {
				Toast.info('录影计划已 ' + tips);
				var plan = this.state.plan;
				plan.planExecStatus = planExec==1?'1':'0';
				this.setState({ plan });
			}else{
				Toast.info(res.desc);
			}
		})
	}

	handlePlantimer(plan) {
		let path = {
			pathname: "/ipc/plantimer",
			query: {
				planId: plan.planId,
				planCycle: plan.planCycle,
				packageId: plan.packageId,
				planStatus: plan.planStatus
			}
		}
		this.props.history.push(path);
	}
	render() {
		return(
			<div className="customlist">
		    <BarTitle  title={Lang.ipc.videomanagement.title} onBack={this.handleClickBack} />
				{this.state.startload ? "" : this.state.plan && this.state.plan.planId ? <div className="content" >
					<div className="deviceIconBackground">
						<div className="deviceIcon"></div>
					</div>

					<div className="item" >
						<span className="title">{Lang.ipc.videomanagement.plannedCapacity}</span>
						<span className="name">{this.state.plan.planName}</span>
					</div>
					<div className="item">
						<span className="title">{Lang.ipc.videomanagement.videoMode}</span>
						<span className="name">{this.state.plan.packageType == 1 ? Lang.ipc.videomanagement.eventMode : Lang.ipc.videomanagement.fullTimeMode}</span>
					</div>
					<div className="item">
						<span className="title">{Lang.ipc.videomanagement.bindingDevice}</span>
						<span className="name">{this.state.plan.deviceName ? this.state.plan.deviceName : ""}</span>
					</div>
					<div className="item">
						<span className="title">{Lang.ipc.videomanagement.videoSwitch}</span>
						<span className="name"><Switch onClick={(e) => this.handleVideoSwitch(e)} checked={this.state.plan.planExecStatus=='1'?true:false} /></span>
					</div>
					<div className="item" onClick={this.handlePlanRenew}>
						<span className="title">{Lang.ipc.videomanagement.effectiveTime}</span>
						<span className="name" style={{ color: (this.state.plan.renewRemindFlag == 1 ? "#F59C24" : "#C8C8C8") }} >{this.state.plan.renewRemindFlag == 1 ? Lang.ipc.videomanagement.renew : stringToDate(this.state.plan.planStartTime) + '-' + stringToDate(this.state.plan.planEndTime)}   </span>
					</div>
					<div className="item" onClick={this.handlePlantimer.bind(this, this.state.plan)}>

						<span className="title">{Lang.ipc.videomanagement.videoTimer}</span>
						<span className="arrow-span" ></span>
						<span className="name" >{getWeekdayOfplan(this.state.plan)}</span>
					</div>
					<WhiteSpace size="lg" />
				</div> : <div className='default-module'>
									<div className='updateIcon_a' ></div>
						<div style={{ position: 'absolute', left: '3rem', right: '3rem', fontSize: '1.4rem', textAlign: 'center' }}>{this.state.error ? Lang.ipc.videomanagement.requestError: Lang.ipc.videomanagement.noRecord}</div>
						{this.state.error ? '' : <Button style={{
							position: 'absolute',
							bottom: '5rem',
							right: '1.5rem',
							left: '1.5rem'
						}}
							onClick={() => {
								const { actions, } = this.props;
								actions.changeFromPage('list');
								this.props.history.push("/ipc/addplan")
							}}>{Lang.ipc.videomanagement.addplan}</Button>

						}
					</div>}
	
		</div>
		);
	}
}
//将state绑定到props
const mapStateToProps = (state) => {
	const devId = (state.device.fromPage === 'list' || state.device.fromPage === 'ipcItem' || state.device.recordAttr.devId === '') ? state.device.deviceItem.devId : state.device.recordAttr.devId;
	return {
		devId: devId,
		deviceItem: state.device.items[devId],
		planList:state.ipc.getIpcdata
		
	}
};
const mapDispatchToProps = (dispatch) => {
	return {
		showDialog: (...args) => dispatch(showDialog(...args)),
  actions: bindActionCreators(
      {
        saveIpcdata,
				saveIpcCycle,
				changeFromPage
      },dispatch )
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Ipcmanage)
