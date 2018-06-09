import React, { Component } from 'react';
import Device from '../jssdk/device';
import BarTitle from '../component/barTitle';
import { showDialog } from '../action';
import helper from '../public/helper';
import { Lang } from '../public';
import { connect } from 'react-redux';
import './default/style.css';
import SystemApi from '../jssdk/system';
import ScrollView from '../component/scrollView';
import { bindActionCreators } from 'redux';
import {setTriChooseTmp ,setCurSensorItem} from '../action/automation'


const deviceSetting = [
	{ triggerName: Lang.automation.triggermotiondetail.motionuninterrupted, triggerSelect: false },
	{ triggerName: Lang.automation.triggermotiondetail.motiontriggered, triggerSelect: true }
]
class TriggerMotionDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selecteIndex: this.props.curSensor.value
		}
		this.handleClickBack = this.handleClickBack.bind(this);
		this.handleClickSave = this.handleClickSave.bind(this);
		this.systemApi = new SystemApi;
	}

	componentDidMount(){
		this.systemApi.offGoBack().onceGoBack(this.handleClickBack)
	}

	handleClickBack(event) {
		this.props.history.goBack();
	}
	handleClickSave(event) {
		this.props.curSensor.value = this.state.selecteIndex + ""
		debugger

		let tri =this.props.triChooseTmp

		if(tri.length ==0){
			tri.push(Object.assign(this.props.curSensor))
			this.props.actions.setTriChooseTmp(tri)
		}else{
			let flag =false
			this.props.triChooseTmp.map((device,index)=>{
				if(device.devId ==this.props.curSensor.devId){
					tri.splice(index, 1,this.props.curSensor)
					flag =true
					this.props.actions.setTriChooseTmp(tri)
				}
			})
			if(!flag){
			      tri.push(Object.assign(this.props.curSensor))
			      this.props.actions.setTriChooseTmp(tri)
			}
		}
		// this.props.actions.setTriChooseTmp(this.props.triChooseTmp)
		this.props.history.goBack();
	}
	handleClickToChoose(item, index) {
		this.setState({
			selecteIndex: index,
		});
	}
	render() {
		return (
			<div className="triggerdetail">
				<BarTitle onBack={this.handleClickSave} title={Lang.automation.triggermotiondetail.title} />
				{
					deviceSetting.map((item, index) => {
						return (
							<div className="triggerdetail-cell">
								<div className="triggerdetail-text">{item.triggerName}</div>
								<div className={index == this.state.selecteIndex ? "triggerdetail-ChooseState" : "triggerdetail-unchoose"} onClick={this.handleClickToChoose.bind(this, item, index)}>
								</div>
							</div>
						)
					}
					)
				}
			</div>);
	}
}


//将state绑定到props
const mapStateToProps = (state) => {
	return {
		triChooseTmp:state.automation.triChooseTmp,
		curSensor:state.automation.curSensor
	}
};
//将action的所有方法绑定到props上
const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			setTriChooseTmp,
			setCurSensorItem
		}, dispatch),
		showDialog: (...args) => dispatch(showDialog(...args))
	}
};
export default connect(mapStateToProps, mapDispatchToProps)(TriggerMotionDetail)