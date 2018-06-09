import React, {
	Component
} from 'react';
import './default/style.css';
import { connect } from 'react-redux';
import { compose } from 'redux';
import BarTitle from '../component/barTitle';
import { Lang } from '../public';
import { Route, Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import PageDeviceList from '../device/list';
import MQTTService from '../jssdk/MQTTService';
import Device from '../jssdk/device';

// import { fetchProductInfo } from '../action/home';
import Cookies from 'universal-cookie';



class HomeMain extends Component {

	cookies = new Cookies();
	constructor(props) {
		super(props);
		this.setParentCancelLongPress = this.setParentCancelLongPress.bind(this);
		this.state = {
			cancelLongPress: false
		}

		this.Device = new Device();
		
	}

	setParentCancelLongPress() {
		this.setState({
			cancelLongPress: false
		})
	}

	setBackgroundImg(image) {
		if (image.substring(0, 1) == "#") {
			let backgroundImg = document.getElementById("homeMainId");
			if(backgroundImg){
				backgroundImg.style.backgroundColor = image;
				backgroundImg.style.backgroundImage = 'none';
			}
		} else if (image != '') {
			let backgroundImg = document.getElementById("homeMainId");
			if(backgroundImg){
				backgroundImg.style.backgroundImage = 'url('+require('../public/resource/image/a023/'+image)+')';
			}
		} else {
			let backgroundImg = document.getElementById("homeMainId");
			if(backgroundImg){
				backgroundImg.style.backgroundImage = 'url('+require('../public/resource/image/a023/bg.png')+')';
			}
		}
	}

	componentDidMount() {
		const { currentHomeId, familyItems } = this.props;
		console.log("=====加载首页");
		if (currentHomeId) {
			this.setBackgroundImg(familyItems[currentHomeId].icon);
			console.log("=====连接蓝牙");
			/*this.Device.startConnect({
				meshName: familyItems[currentHomeId].currentMeshName,
				meshPassword: familyItems[currentHomeId].currentMeshPassword
			});*/
			if(!familyItems[currentHomeId].isSecurityPwd){
//				this.props.history.push('/family/setPwd');
			}
		}
	}

	render() {
		const { ids, items } = this.props;
		const { currentHomeId, familyItems } = this.props;
		let familyName = '';
		if (currentHomeId) {
			familyName = familyItems[currentHomeId].name;
			this.setBackgroundImg(familyItems[currentHomeId].icon);	
		}

		return (
			<div id="homeMainId" className="home main" onTouchStart={(e) => {
				if (e.target.className.indexOf('close') > -1) return;
				this.setState({
					cancelLongPress: true
				})
			}}>
				<BarTitle>
					<Link to="/menu" className="icon menu"></Link>
					<Link to="/setting/activityRecord" className="icon notice"></Link>
					<Link to="/device/addFlow" className="icon add"></Link>
				</BarTitle>
				<Link to={`/family/set/${currentHomeId}`}  >
				{currentHomeId ? <div className="switch-home">
					<div className="view">
						<span>{familyName}</span>
						<i className="icon arrow down"></i>
					</div>
				</div> : null }
				</Link>
				<PageDeviceList
					history={this.props.history}
					location={this.props.location}
					pageFrom="home"
					queryId={currentHomeId}
					cancelLongPress={this.state.cancelLongPress}
					setParentCancelLongPress={this.setParentCancelLongPress}
				/>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		currentHomeId: state.family.currentId,
		familyItems: state.family.items || null,
		ids: state.home.list,
	}
};

// const mapDispatchToProps = dispatch => ({
// 	actions: bindActionCreators({
// 		fetchProductInfo
// 	}, dispatch),
// });

export default connect(mapStateToProps)(HomeMain)