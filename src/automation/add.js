import React, {
	Component
} from 'react';
import './default/style.css';
import { connect } from 'react-redux';
import { Lang } from '../public';
import BarTitle from '../component/barTitle';
import { Route, Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import {setCurAutoItem,saveAutomation,saveAutoRule,setAutoDevices} from '../action/automation'
import SystemApi from '../jssdk/system';

const dataObj = {
	"autoName": "",
	"if": {
		"logic": "or",
		"valid": {
			"begin":"00:00",
			"end":"23:59",
			"week":[0,1,2,3,4,5,6]
		},
		"trigger": []
	},
	"then": [],
	"type":"add",
}


const timerObj = [{
	"idx": 0,
	"trigType": "timer",
	"at": null,
	"repeat": [0,1,2,3,4,5,6]
}]
const devObj = [
	// {
	// "idx":  0,
	// "trigType": "dev",
	// "devId": "",
	// "attr": "",
	// "compOp": "== ",
	// "value":  "1",
	// }
]


class PageAutomationAdd extends Component {
	constructor(props) {
		super(props);
		this.state = {
			effect: 'home-start',
			second: 3,
		};
		this.goNext = this.goNext.bind(this)
		this.handleClickBack = this.handleClickBack.bind(this);
		this.systemApi = new SystemApi;
	}
	
	handleClickBack(event){
		this.props.history.goBack();
	}
  
	componentDidMount() {
		// debugger;
		this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
	}
	componentWillReceiveProps(){
		this.props.actions.setAutoDevices(this.props.deviceItem)
	}
	goNext(url){

		dataObj.if.trigger = url.indexOf("time") > 0  ? timerObj : devObj;
		this.props.actions.setCurAutoItem(JSON.parse(JSON.stringify(dataObj)))
		let query = {fromPage:this.props.location.pathname}
		let  path = {
			pathname:url,
			query,
		}
		this.props.history.push(path)
	}

	render() {
		return(
			<div className="automation add">
			 <BarTitle onBack={this.handleClickBack} title={Lang.automation.add.title} />
			 <div className="content">
					<h3 style={{fontWeight:"100"}}> {Lang.automation.add.hint}</h3>
					<ul>
						<li className="item"  onClick={this.goNext.bind(this,"/automation/timeofday")}>
							<div className="timeofdayImg"/>
							<div className="txt">
								<span className="title">{Lang.automation.add.selectTimeItem.title}</span>
								<span className="hint">{Lang.automation.add.selectTimeItem.hint}</span>
							</div>
							<div className="arrowRight" />
						</li>
						<li className="item"  onClick={this.goNext.bind(this,"/automation/create")}>
						  <div className="sensorImg"/>
							<div className="txt">
								<span className="title">{Lang.automation.add.selectSensorItem.title}</span>
								<span className="hint">{Lang.automation.add.selectSensorItem.hint}</span>
							</div>
							<div className="arrowRight" />
						</li>
					</ul>
				</div>
		</div>
		);
	}
}


const mapStateToProps = (state, ownProps) => {
	return {
		curAutoData: state.automation.autoItem,
		deviceItem: state.device.items
	}
}

const mapDispatchToProps = dispatch => {
	return {
		actions: bindActionCreators({
			setCurAutoItem,
			saveAutomation,
			saveAutoRule,
			setAutoDevices
		}, dispatch),
	}
}
export default connect(mapStateToProps,mapDispatchToProps)(PageAutomationAdd)