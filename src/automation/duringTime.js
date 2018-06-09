import React, { Component } from 'react';
import './default/style.css';
import './default/style_2.css';
import Device from '../jssdk/device';
import BarTitle from '../component/barTitle';
import Switch from '../component/switch';
import Toast from 'antd-mobile/lib/toast';
import 'antd-mobile/lib/toast/style/css';
import { showDialog } from '../action';
import helper from '../public/helper';
import SystemApi from '../jssdk/system';
import{ Lang } from '../public';
import { Base64 } from 'js-base64';
import { connect } from 'react-redux';
import DatePicker from 'antd-mobile/lib/date-picker';
import 'antd-mobile/lib/date-picker/style/css';
import { bindActionCreators } from 'redux';
import { setCurAutoItem } from '../action/automation'

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
// GMT is not currently observed in the UK. So use UTC now.
const utcNow = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
// Make sure that in `time` mode, the maxDate and minDate are within one day.
let minDate = new Date(nowTimeStamp - 1e7);
const maxDate = new Date(nowTimeStamp + 1e7);
// console.log(minDate, maxDate);
if (minDate.getDate() !== maxDate.getDate()) {
	// set the minDate to the 0 of maxDate
	minDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
}
const dialogLang = Lang.public.dialog;
function formatDate(date) {
	/* eslint no-confusing-arrow: 0 */
	const pad = n => n < 10 ? `0${n}` : n;
	// const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
	const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
	// ${dateStr}
	return `${timeStr}`;
}
const CustomChildren = ({
	extra,
	onClick,
	children
}) => (
		<div onClick={onClick} style={{
			backgroundColor: '$color-line', height: '53px', lineHeight: '56px',
			padding: '0', border: "1px solid $color-line", borderRadius: '0.5rem', color: "$text-color", fontFamily: 'PingFangSC-Regular'
		}}>
			{children}
			<span className='arrowRight'></span>
			<span style={{ float: 'right', color: '$text-color', opacity: "0.5", marginRight: "2rem" }}>{extra}</span>
		</div>
	);
class DuringTime extends Component {
	constructor(props) {
		super(props);
		let { begin, end, week } = (this.props.curAutoData && this.props.curAutoData.if.valid) || {}
		this.state = {
			everyTime: this.props.curAutoData.everyTime === undefined ? (begin&&begin.length)?false:true  :this.props.curAutoData.everyTime,
			date: now,
			time: now,
			dpValue: null,
			beginTime: this.setAtTime(begin) || this.setAtTime("00:00"),
			endTime: this.setAtTime(end)|| this.setAtTime("23:59"),
			visible: false,
			week:(week&&week.length)?week:[0,1,2,3,4,5,6],
			weekDate: "Everyday",
			change:false
		};
		this.goNext = this.goNext.bind(this);
		this.setAtTime = this.setAtTime.bind(this);
		this.setWeekInfo = this.setWeekInfo.bind(this)
		this.handleClickBack = this.handleClickBack.bind(this);
		this.handleClickSave = this.handleClickSave.bind(this);
		this.handleClickSelectSwitch = this.handleClickSelectSwitch.bind(this);
		this.systemApi = new SystemApi;
	}

	handleClickBack() {
		const that = this;
		if(!this.state.change){
			that.props.history.goBack();
			return false;
		}
		that.handleClickSave();
		/*this.props.showDialog(dialogLang.title[0], Lang.automation.during.backTip, [{
			text: dialogLang.button[1],
			handleClick: function () {
				that.handleClickSave
				this.hide();
			}
		  },{
			text: dialogLang.button[0],
			handleClick: function () {
				that.props.history.goBack();
				this.hide();
			}
		}]);*/
	}
	handleClickSave() {
		if(!(this.state.beginTime && this.state.endTime && this.state.week.length)){
			Toast.info(Lang.automation.during.saveTip);
			return false
		}
		
		 //this.goNext("/automation/create")
		this.props.curAutoData.fromPage = this.props.location.pathname;
		this.props.curAutoData.everyTime = this.state.everyTime;
		this.props.curAutoData.if.valid.begin = this.state.beginTime && formatDate(this.state.beginTime);
		this.props.curAutoData.if.valid.end = this.state.endTime && formatDate(this.state.endTime)
		this.props.curAutoData.if.valid.week = this.state.week;
		this.props.actions.setCurAutoItem(this.props.curAutoData)
		this.props.history.goBack();
	}

	goNext(url) {
		this.props.curAutoData.fromPage = this.props.location.pathname;
		this.props.curAutoData.everyTime = this.state.everyTime;
		this.props.curAutoData.if.valid.begin = this.state.beginTime && formatDate(this.state.beginTime);
		this.props.curAutoData.if.valid.end = this.state.endTime && formatDate(this.state.endTime)
		this.props.curAutoData.if.valid.week = this.state.week;
		this.props.actions.setCurAutoItem(this.props.curAutoData)
		this.props.history.push(url)
	}
	componentDidMount() {
		this.setWeekInfo();
		this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
	}
	//setState是异步的，如果不利用setState的第二传参，传入一个回调(callback)函式，
	//则可以用这个生命周期函数
	//	componentDidUpdate() {
	//		console.log(this.state.checked);
	//	}
	handleClickSelectSwitch(event) {
		//	setState是异步的，可以利用setState的第二传参，传入一个回调(callback)函式
		this.setState({
			everyTime: !this.state.everyTime,
			change: true
		}, function () {
			let nowData = this.props.curAutoData.if.valid
			let timeData = this.state.everyTime ? { begin: "00:00", end: "23:59", week: [0, 1, 2, 3, 4, 5, 6] }:nowData;
			let { begin, end, week } = timeData;
			this.setState({ beginTime: this.setAtTime(begin), endTime: this.setAtTime(end), week }, function () {
				this.setWeekInfo();
			})
		});
	}

	setAtTime(queryAt) { 
		if (!(queryAt || this.props.autoMationRule)) return false;
		let at = queryAt || this.props.autoMationRule.if.trigger[0].at;
		let now = new Date();
		let timeStr = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate() + " " + at + ":00"
		return new Date(timeStr)
	}


	setWeekInfo() {
		if (this.state.week.length === 0) return false;
		let week = this.state.week;
		week.sort();
		let weekAbbr = ["Su","M", "Tu", "W", "Th", "F", "Sa"];
		var msg = this.getWeekMsg(week);
		if (!msg) {
			msg = [];
			week.forEach((item) => {
				msg.push(weekAbbr[item])
			});
			msg = msg.join(",")
		}
		this.setState({ weekDate: msg })
	}


	getWeekMsg(week){
		if(week.length=== 7) return "Everyday"
		let workday=0,weekday=0;
		week.forEach(item=>{
			if(item>0 && item < 6) {workday++}
			else{weekday++}
		})
		return   (workday === 5 && week.length=== 5  && "workday") || (weekday === 2&& week.length=== 2  && "weekend")
	}


	render() {
		return (
			<div className="during">
				<BarTitle onBack={this.handleClickBack} title={Lang.automation.during.title} />
				<div className="item" >
					<label>{Lang.automation.during.name[0]}</label>
					<Switch checked={this.state.everyTime} onClick={this.handleClickSelectSwitch}  ></Switch>
				</div>
				{this.state.everyTime?"":<div className="item" >
					<DatePicker mode="time"
						format="HH:mm"
						title={Lang.automation.during.picker[2]}
						disabled = {this.state.everyTime}
						value={this.state.beginTime}
						onChange={v => {this.setState({ beginTime: v, change:true});}}
						extra="new"
						okText={Lang.automation.during.picker[1]}
						dismissText={Lang.automation.during.picker[0]}
						onOk={date => this.setState({ dpValue: date, visible: false })}
						onDismiss={v => this.setState({ visible: false })}>
						<CustomChildren >{Lang.automation.timeofday.time.start}
						</CustomChildren>
					</DatePicker>
					
				</div>}
				{this.state.everyTime?"":<div className="item">
					<DatePicker
						mode="time"
						format="HH:mm"
						title={Lang.automation.during.picker[2]}
						disabled = {this.state.everyTime}
						value={this.state.endTime}
						onChange={v => this.setState({ endTime: v ,change:true})}
						extra="new"
						okText={Lang.automation.during.picker[1]}
						dismissText={Lang.automation.during.picker[0]}
						onOk={date => this.setState({ dpValue: date, visible: false })}
						onDismiss={v => this.setState({ visible: false })}
					>
						<CustomChildren >{Lang.automation.timeofday.time.end}
						</CustomChildren>
						
					</DatePicker>
						
				</div>}
				{this.state.everyTime?"":<div className="item" onClick={this.state.everyTime?"":this.goNext.bind(this, '/automation/repeat')}>
					<label>{Lang.automation.during.name[3]}</label>
					<span>{this.state.weekDate}</span>
					<i></i>
				</div>}
			</div>
		);
	}
}

//将state绑定到props
const mapStateToProps = (state) => {
	debugger;
	return {
		curAutoData: state.automation.autoItem,
	}
};
//将action的所有方法绑定到props上
const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			setCurAutoItem
		}, dispatch),
		showDialog: (...args) => dispatch(showDialog(...args))
	}
};
export default connect(mapStateToProps, mapDispatchToProps)(DuringTime);