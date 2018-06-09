import React, {
	Component
} from 'react';
import './default/style.css';
import SystemApi from '../jssdk/system';
import { connect } from 'react-redux';

import BarTitle from '../component/barTitle';
import { Lang } from '../public';
import { bindActionCreators } from 'redux';
import {setCurAutoItem} from '../action/automation'
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import Toast from 'antd-mobile/lib/toast';
const workdayAry = Lang.automation.repeat.workdayAry;
const weekdayAry = Lang.automation.repeat.weekdayAry;

class PageRepeat extends Component {
	constructor(props) {
		super(props);
		let {workAll,weekAll,arrChecked} = this.setRepeatPre()
		this.state = {
			workAllChecked: workAll,
			weekAllChecked: weekAll,
			arrChecked:  arrChecked||[]
		}
		this.systemApi = new SystemApi;
		this.handleClickBack = this.handleClickBack.bind(this);
		this.handleClickSave = this.handleClickSave.bind(this);
		this.setRepeatPre = this.setRepeatPre.bind(this);
		this.handleClickCheckbox = this.handleClickCheckbox.bind(this);
		this.handleClickWorkkAll = this.handleClickWorkkAll.bind(this);
		this.handleClickWeekkAll = this.handleClickWeekkAll.bind(this);
	}
	handleClickBack(event) {
		this.props.history.goBack();
	}
	setRepeatPre(){
		var autoData = this.props.curAutoData || {}
		var workAll=0,weekAll=0,[...arrChecked] = (autoData.fromPage === "/automation/timeofday") ?
								 autoData.if.trigger[0].repeat : 
								 this.props.curAutoData.if.valid.week;
		arrChecked.forEach(item => {
			if(item>0 && item <6){++workAll}
			else{++weekAll}
		});
		workAll = workAll === 5;
		weekAll = weekAll === 2;
		return {workAll,weekAll,arrChecked};
	}
	handleClickSave() {
		this.props.curAutoData.change =true;
		let auto = this.props.curAutoData
		if(this.state.arrChecked.length<=0){
			Toast.info(Lang.automation.repeat.repeatTip)
			  return;
		}
		if(auto.fromPage === "/automation/timeofday") {
			auto.if.trigger[0].repeat = this.state.arrChecked
		} else {
			auto.if.valid.week = this.state.arrChecked
		}
		this.props.actions.setCurAutoItem(auto);
		this.props.history.goBack();
	}
	//子选项点击事件
	handleClickCheckbox(index, event) {
		let arrChecked = this.state.arrChecked;
		let pos = arrChecked.indexOf(index);
		if(pos === -1){
			arrChecked.push(index); //选中
		} else {
			arrChecked.splice(pos, 1); //取消选中
		}
		arrChecked.sort();
		this.setState({ workAllChecked: (arrChecked.join(',').indexOf("1,2,3,4,5") !== -1) }); //工作日是否全选
		this.setState({ weekAllChecked: (arrChecked.join(',').indexOf("6") !== -1) && (arrChecked.join(',').indexOf("0") !== -1) }); //周未是否全选
		this.setState({ arrChecked });
		event.preventDefault()
	}
	
	//工作日全选项点击事件
	handleClickWorkkAll(event) {
		let workCk = this.state.workAllChecked;
		let arrChecked = this.state.arrChecked;
		arrChecked = workCk ? arrChecked.filter((item) => {return (item >5||item==0)}) 
					: [ ... new Set(arrChecked.concat([1,2,3,4,5]))].sort()
		this.setState({ workAllChecked: !workCk,arrChecked });
		event.preventDefault()
	}
	
	//周未全选项点击事件
	handleClickWeekkAll(event) {
		let weekCK = this.state.weekAllChecked;
		let arrChecked = this.state.arrChecked;
		arrChecked = weekCK ? arrChecked.filter((item) => {return (item < 6 && item >0)}) 
					:  [ ... new Set(arrChecked.concat([0,6]))].sort()
		this.setState({ weekAllChecked: !weekCK,arrChecked });
		event.preventDefault()
	}
	componentDidMount() {
		// this.setRepeatPre()
		this.systemApi.offGoBack().onceGoBack(this.handleClickBack)
	}

	checkWeek(index){
		let ind = workdayAry.length + index +1;
		if (ind == 7) ind =0
		return ind
	}

	render() {
		let arrChecked = this.state.arrChecked;
		let checkWeek = this.checkWeek
		let workItems = workdayAry.map((item, index) =>
			<li key={index}>
				<span className="time">{item}</span>
				<label onClick={this.handleClickCheckbox.bind(this, index+1)} className={ arrChecked.indexOf(index+1) !== -1 ? "ck on" : "ck"}>
					<input type="checkbox" className="cell" checked={ arrChecked.indexOf(index) !== -1 ? true : false } />
				</label>
			</li>
		);
		let weekItems = weekdayAry.map((item, index) =>
			<li key={index}>
				<span className="time">{item}</span>
				<label onClick={this.handleClickCheckbox.bind(this,checkWeek(index))} className={  arrChecked.indexOf(checkWeek(index)) !== -1 ? "ck on" : "ck"}>
					<input type="checkbox" className="cell" checked={ arrChecked.indexOf(workdayAry.length + index) !== -1 ? true : false } />
				</label>
			</li>
		);
		return(
			<div className="repeat_html">
	  	 		<BarTitle onBack={this.handleClickSave} title={Lang.automation.repeat.title} />
				<div className="content">
				 	<ul className="checkboxGroup1">
						<li>
							<span className="time">{Lang.automation.repeat.workday}</span>
							<label onClick={this.handleClickWorkkAll} className={ this.state.workAllChecked ? "ck on" : "ck"}>
								<input type="checkbox" />
							</label>
						</li>
			   			{workItems}
				 	</ul>
					<ul className="checkboxGroup2">
						<li>
							<span className="time">{Lang.automation.repeat.weekday}</span>
							<label onClick={this.handleClickWeekkAll} className={ this.state.weekAllChecked ? "ck on" : "ck"} >
								<input type="checkbox" />
							</label>
						</li>
						{weekItems}
					</ul>
				</div>
			</div>
		);
	}
}
const mapStateToProps = (state, ownProps) => {
	return {
		curAutoData: state.automation.autoItem,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		actions: bindActionCreators({
			setCurAutoItem
		}, dispatch),
	}
}
export default connect(mapStateToProps,mapDispatchToProps)(PageRepeat)