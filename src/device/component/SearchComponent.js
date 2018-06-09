import React, { Component } from 'react';
import '../default/searchStyle.css';
import Device from '../../jssdk/device';
import Cookies from 'universal-cookie';
import '../default/style.css';

export default class SearchComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			state: true,
			data: this.props.data,
			type: this.props.type,
			mac:this.props.mac,
			// deviceSelect: this.props.data.deviceSelect,
		};
		console.log("Search Component data = ",this.state);
		// this.handleSelect = this.handleSelect.bind(this);
		this.handleClickToTest = this.handleClickToTest.bind(this);
		this.device = new Device();
		this.cookies = new Cookies;
	}

	// handleSelect(name) {
	// 	console.log(`checked: ${this.props.data.devId}`)
	// 	this.props.onSelect(this.props.data.devId, name, !this.state.deviceSelect);
	// 	this.setState({
	// 		deviceSelect: !this.state.deviceSelect
	// 	});
	// }

	handleClickToTest(){
		const { currentId, familyItems} = this.props;
		
		if(this.cookies.get("BLEIsConnect") != "1"){
			this.device.stopScan();
			this.device.startConnect({
			meshName: familyItems[currentId].currentMeshName,
			meshPassword: familyItems[currentId].currentMeshPassword
			});
			this.cookies.set("BLEIsConnect","1");

			setTimeout(() => {
			this.device.turnOff({devId:'ffff'});//全关
			}, 2000);
	
			setTimeout(() => {
			this.device.turnOn({devId:'ffff'});//全开
			}, 5000);
		}else{
			this.device.turnOff({devId:'ffff'});//全关

			setTimeout(() => {
				this.device.turnOn({devId:'ffff'});//全开
			}, 3000);
		}
		
  
	}

	render() {
		return (
			<div className="chooseDevice-cell">
				<div className="switchChooseDevice-icon">
				<div className={this.state.type}></div>
				</div>
				<div className="switchChooseDevice-text" style = {{color:"$text-second-color"}}>
					<span className="spanLine"><span className="txt-bold">{this.state.data.name || this.state.mac}</span></span><br />
					{/* <span className="spanLine">{this.state.data.belongRoomName}</span> */}
				</div>
				{/* <div onClick={()=> {
					this.handleSelect(`${this.state.type}_${this.state.data.name}`)
				}} className={this.state.deviceSelect ? "swithChooseDevice-ChooseState" : "swithChooseDevice-unchoose"} >
				</div> */}
			</div>
		);
	}
}
const mapStateToProps = (state, ownProps) => {
	return {
	  familyItems: state.family.items,
      currentId: state.family.currentId
	};
};