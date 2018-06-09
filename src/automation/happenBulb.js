import React, {
	Component
} from 'react';
import Device from '../jssdk/device';
import BarTitle from '../component/barTitle';
import { showDialog } from '../action';
import helper from '../public/helper';
import{ Lang } from '../public';
import { connect } from 'react-redux';
import './default/style.css';
import SystemApi from '../jssdk/system';
import ScrollView from '../component/scrollView';

const deviceSetting = [{
		triggerName: Lang.automation.happenbulb.turnOn,
		triggerSelect: true
	},
	{
		triggerName: Lang.automation.happenbulb.turnOff,
		triggerSelect: false
	}

]
class HappenBulb extends Component {

	constructor(props) {
		super(props);
		this.state = {
			selecteIndex: 0,
			newName: ""
		}
		this.setState({
			newName: localStorage.getItem("name"),
		});
	
		console.log(this.state.newName);
		this.handleClickBack = this.handleClickBack.bind(this);
		this.handleClickSave = this.handleClickSave.bind(this);
		this.systemApi = new SystemApi;
	}

	handleClickBack(event) {
		this.props.history.goBack();
	}
	handleClickSave(event) {
		this.props.history.goBack();
		console.log(this.state.newName, this.state.selecteIndex );
		localStorage.setItem(this.state.newName, this.state.selecteIndex === 0 ? "ON" : "OFF");
	}
	handleClickToChoose(item, index) {
		if(this.state.selecteIndex == index) {
			this.setState({
				selecteIndex: -1,
			});
		} else {
			this.setState({
				selecteIndex: index,
			});
		}

	}
	componentDidMount(){
		this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
	}

	render() {
		return(
			<div className="triggerdetail">
		<BarTitle onBack={this.handleClickBack} onDone={this.handleClickSave}  title={Lang.automation.happenbulb.title}/>
		 {
             deviceSetting.map((item,index) =>{
		    return (
        <div className = "triggerdetail-cell">
		<div className = "triggerdetail-text">{item.triggerName}</div>
		<div className = {index == this.state.selecteIndex?"triggerdetail-ChooseState":"triggerdetail-unchoose"} onClick={this.handleClickToChoose.bind(this,item,index)}>
		</div>
		</div>
           )
        }
        )
        };
		</div>);
	}
}

export default connect()(HappenBulb)