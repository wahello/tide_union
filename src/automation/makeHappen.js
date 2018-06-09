import React, {
	Component
} from 'react';
import Device from '../jssdk/device';
import BarTitle from '../component/barTitle';
import { showDialog } from '../action';
import { Lang } from '../public';
import { connect } from 'react-redux';
import './default/style.css';
import './default/automationStyle.css';
import SystemApi from '../jssdk/system';
import { createForm } from 'rc-form';
import ScrollView from '../component/scrollView';
import { bindActionCreators } from 'redux';

const deviceList = [{
		deviceName: 'Light',
		belongRoomName: 'room',
		deviceSelect: true,
		type: 'curtain',
		state: 'off'
	},
	{
		deviceName: 'Light2',
		belongRoomName: 'haha',
		deviceSelect: true,
		type: 'camera',
		state: 'on'
	},
	{
		deviceName: 'Light3',
		belongRoomName: 'weg',
		deviceSelect: false,
		type: 'siren',
		state: 'off'
	},
	{
		deviceName: 'Light4',
		belongRoomName: 'check',
		deviceSelect: false,
		type: 'waterLeak',
		state: 'on'
	},
	{
		deviceName: 'Light5',
		belongRoomName: '',
		deviceSelect: false,
		type: 'waterLeak',
		state: 'on'
	}
]

class MakeHappen extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			name:""
		}
		this.handleClickBack = this.handleClickBack.bind(this);
		this.handleClickToChoose = this.handleClickToChoose.bind(this);
		this.systemApi = new SystemApi;
	}

	componentDidMount(){
		this.systemApi.offGoBack().onceGoBack(this.handleClickBack)
	}

	handleClickBack(event) {
		this.props.history.goBack();
	}

	handleClickToChoose(deviceData) {
		
		this.setState({
			name: deviceData.deviceName,
		}, function() {
				localStorage.setItem("name",this.state.name);
				  console.log(this.state.name);
		});
	
		this.props.history.push('/automation/happenBulb');
	}

	render() {
		return(
			<div className="make-happen-style">
		<BarTitle onBack={this.handleClickBack}  title={Lang.scene.make.title} />
		<ScrollView>
		{ deviceList.map(
			(deviceData) =>{
		    return (
	        <div className = "makeHappen-cell" >
				<div className =  {"makeHappen-icon" +" "+deviceData.type}></div>
				<div className = "makeHappen-text"  style ={{display: (deviceData.belongRoomName == '' ? "none" :  "")}} >
		        <span className = "spanLine"><span className="txt-bold">{deviceData.deviceName}</span></span>
		        <br/>
		        <span className = "spanLine" style = {{color: '$text-second-color'}}>{deviceData.belongRoomName}</span>
				</div>
				<div className = "makeHappen-text" style ={{display: (deviceData.belongRoomName ==''  ? "" :  "none")}}  >
		        <span className = "spanLine" style = {{paddingTop:'10px'}}><span className="txt-bold" >{deviceData.deviceName}</span></span>
				</div>
				<span>{localStorage.getItem(this.state.name)}</span>
				<div className = "makeHappen-next" onClick={this.handleClickToChoose.bind(this,deviceData)}></div>
			</div>
           )
		}
		)};
		</ScrollView>
		</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
	  autoMationRule:state.automation.autoMationRule,
	  devIds:state.device.writeableIds,
	  devData:state.device.items
	}
}
  
const mapDispatchToProps = dispatch => {
	return {}
}

export default connect(mapStateToProps,mapDispatchToProps)(createForm()(MakeHappen))