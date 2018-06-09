import React, {
	Component
} from 'react';
import './default/style.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Lang } from '../public';
import BarTitle from '../component/barTitle';
import { Route, Link } from 'react-router-dom';
import { Button, WhiteSpace, List, WingBlank ,PullToRefresh} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import jsBridge from '../jssdk/JSBridge';
import Switch from '../component/switch';
import Cookies from 'universal-cookie';
import IpcPlanAPi from '../jssdk/ipcplan';
import ScrollView from '../component/scrollView';
import { showDialog } from '../action';
import Toast from 'antd-mobile/lib/toast';
import {  saveIpcCycle } from '../action/ipc';

const Item = List.Item;
const cookies = new Cookies();
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
function getWeekdayOfplan(plan){
	var plantimer = '';
	let isday = [0, 0, 0, 0, 0, 0, 0];
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
	isday.map((value, index) => {
		console.log('value  +++'+value,index);
		
		num = num + value;
		if (num == 0 && index == 4) {
			maybeWeek = true;
		}
		if (maybeWeek && num == 2) {
			weekend = true;
		}
		if (num == 5 && index == 4) {
			work = true;
		}
		if (num == 7) {
			work = true;
			weekend = true;
		}
		if (num > 5 && work == true && num<7) {
			work = false;
		}
	});
	if (work && weekend) {
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
class VideoListManage extends Component {
	constructor(props) {
    super(props);
    this.state = {
      planList:null,
		startLoad: true,
		error: false,
		}
		this.handleClickBack = this.handleClickBack.bind(this);
		// this.handlePlanRenew = this.handlePlanRenew.bind(this);
        // this.handleVideoSwitch = this.handleVideoSwitch.bind(this);
        //  this.savePlanStatus = this.savePlanStatus.bind(this);
        this.onAccountBlur = this.onAccountBlur.bind(this);
		this.onAccountFocus = this.onAccountFocus.bind(this);
		this.getPlanlist= this.getPlanlist.bind(this);
	}
	componentDidMount() {
		this.getPlanlist();
	}
    onAccountBlur(plan){
   
    }
    onAccountFocus(event){

	}
	getPlanlist(){
		Toast.loading(Lang.public.loading,0);
		var par = {
			pageNum: 1,
			pageSize: 16,
			show: true,
		};
		const that = this
		this.setState({startLoad:true})
		IpcPlanAPi.getPlanList(par).then(res => {
			Toast.hide();
			if (res && res.code === 200) {
				
				if (res.data && res.data.list.length > 0) {

					console.log('===============res' + JSON.stringify(res.data.list));
					that.setState({
						planList: res.data.list, startLoad: false
					})
				} else {
					this.setState({ planList: null ,startLoad:false})
				}
			} else {
				Toast.info(res.desc);
				this.setState({ planList: null, startLoad: false,error:true})
			}

		})
	}
	handleClickBack(event) {
		this.props.history.goBack();
		
	}
	handleModifyName(plan){
	 console.log("===============",plan.planName);
	let path = {
        pathname: "/ipc/setPlanName",
        query: plan
    }
	this.props.history.push(path);
	
	}
	handleBindingDevice(plan){
		if (plan.deviceName==''||plan.deviceName==null) {
			let path = {
				pathname: "/ipc/planBindDevice",
				query: plan
			}
			this.props.history.push(path);
		}
	}
	handlePlanRenew(plan) {
		console.log('plan',plan);
		let that = this;
		if (plan.renewRemindFlag==1) {
			let data = {
				price: plan.packagePrice,
				planName: plan.packageName,
				planDesc: plan.desc,
				packageId: plan.packageId,
				planId: plan.planId,
				fromPage:'list'
			}
			let path = {
				pathname: '/ipc/selectplan',
				query: data
			}

			that.props.history.push(path);
			
		} else {
			
		}
  }

	handleVideoSwitch(plan,self){

		let planExec = plan.planExecStatus=='1' ? 0 : 1;
		console.log("==============planExec", planExec);
		Toast.loading(Lang.public.loading);
		let planId = plan.planId
		let planExecStatus = planExec
		let tips = planExec === 1 ? '开启' : '关闭'
		IpcPlanAPi.updatePlanExecStatus('planId=' + planId, 'planExecStatus=' + planExecStatus).then(res => {
			Toast.hide();
			if (res && res.code === 200) {
				Toast.info('录影计划已 ' + tips);
				plan.planExecStatus = planExec;
				// this.setState({plan});
			}
		})
	}
  
  handlePlantimer(plan){
	  console.log('push/ipc/plantimer/ ',plan);
	  let path = {
		  pathname: "/ipc/plantimer",
		  query: {
			  planId:plan.planId,
			  planCycle:plan.planCycle,
			  packageId:plan.packageId,
			  planStatus: plan.planStatus
		  }
	  }
	  this.props.history.push(path);
  }
	render() {
		return(
			<div className="customlist">
		    <BarTitle  title={Lang.ipc.videomanagement.title} onBack={this.handleClickBack} />
            {/* <PullToRefresh
                ref={el => this.ptr = el}
                style={{
                height: this.state.height,
                overflow: 'auto',
                }}
                indicator={this.state.down ? {} : { deactivate: '上拉可以刷新' }}
                direction={'up'}
                refreshing={this.state.refreshing}
                onRefresh={() => {
                    console.log("=============刷新了")
                // this.setState({ refreshing: true });
                // setTimeout(() => {
                //     this.setState({ refreshing: false });
                // }, 1000);
        }}> */}
           {
					this.state.startLoad ? "" :
					 <ScrollView>
						{this.state.planList ?
							this.state.planList.map((plan, item) => {
								return (
									<div className="content_bg" >
										<div className="deviceIconBackground">
											<div className="deviceIcon"></div>
										</div>
										<div className="item item-top">
											<span className="title">{Lang.ipc.videomanagement.videoName}</span>
											{/* <input className="input" type="text"  onBlur={this.onAccountBlur(plan)} onFocus={this.onAccountFocus}
						 placeholder={Lang.ipc.setWiFi.placeholder[0]} value = {plan.planName}/> */}
											<div className="input" onClick={this.handleModifyName.bind(this, plan)}>{plan.planName}</div>
											<span className="line"></span>
										</div>
										{plan.packageType=='1'?
											<div className="item item-list" >
												<span className="title">{Lang.ipc.videomanagement.plannedCapacity}</span>
												<span className="name">{plan.eventOrFulltimeAmount}</span>
												<span className="line"></span>
											</div>
											:''
										}
										<div className="item item-list">
											<span className="title">{Lang.ipc.videomanagement.videoMode}</span>
											<span className="name">{plan.packageType == 1 ? Lang.ipc.videomanagement.eventMode : Lang.ipc.videomanagement.fullTimeMode}</span>
											<span className="line"></span>
										</div>
										<div className="item item-list" onClick={this.handleBindingDevice.bind(this, plan)}>
											<span className="title" >{Lang.ipc.videomanagement.bindingDevice}</span>
											<span className="name" style={{ color: (!plan.deviceName ? "#F59C24" : "#C8C8C8") }}>{plan.deviceName || Lang.ipc.videomanagement.unboundDevice}</span>
											<span className="line"></span>
										</div>
										<div className="item item-list">
											<span className="title">{Lang.ipc.videomanagement.videoSwitch}</span>
											<span className="name"><Switch ref='switch' onClick={this.handleVideoSwitch.bind(this, plan)} checked={plan.planExecStatus=='1'?true:false} /></span>
											<span className="line"></span>
										</div>
										<div className="item item-list" onClick={this.handlePlanRenew.bind(this, plan)}>
											<span className="title">{Lang.ipc.videomanagement.effectiveTime}</span>
											<span className="name" style={{ color: (plan.renewRemindFlag == 1 ? "#F59C24" : "#C8C8C8") }} >{plan.renewRemindFlag == 1 ? Lang.ipc.videomanagement.renew : stringToDate(plan.planStartTime) + '-' + stringToDate(plan.planEndTime)}   </span>
											<span className="line"></span>
										</div>
										<div className="item item-bottom" onClick={this.handlePlantimer.bind(this, plan)}>
											<span className="title">{Lang.ipc.videomanagement.videoTimer}</span>
											<span className="arrow-span" ></span>
											<span className="name" >{getWeekdayOfplan(plan)}</span>

										</div>
										<Button style={{
											marginTop: '5rem',
											right: '1.5rem',
											left: '1.5rem',
											display: item == this.state.planList.length - 1 ? '' : "none"
										}}
											onClick={() => {
												this.props.history.push("/ipc/addplan")
											}}>{Lang.ipc.videomanagement.addplan}</Button>

									</div>)
							})

								: <div className='default-module'>
									<div className='updateIcon_a' ></div>
									<div style={{ position: 'absolute', left: '3rem', right: '3rem', fontSize: '1.4rem', textAlign: 'center' }}>{Lang.ipc.videomanagement.noRecord}</div>
									{this.state.error ? '' : <Button style={{
										position: 'absolute',
										bottom: '5rem',
										right: '1.5rem',
										left: '1.5rem'
									}}
										onClick={() => {
											this.props.history.push("/ipc/addplan")
										}}>{Lang.ipc.videomanagement.addplan}
									</Button>}
								</div>
						}

					</ScrollView>	
		   }
                    {/* </PullToRefresh> */}
		</div>
		);
	}
}
//将state绑定到props
const mapStateToProps = (state) => {
	return {
    planList:state.ipc.getIpcdata
	}
};
const mapDispatchToProps = (dispatch) => {
	return {
		showDialog: (...args) => dispatch(showDialog(...args)),
  actions: bindActionCreators(
      {
        saveIpcCycle
      },dispatch )
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(VideoListManage)


