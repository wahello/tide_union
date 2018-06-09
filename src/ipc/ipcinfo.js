import React, {
	Component
} from 'react';
import './default/style.css';
import { connect } from 'react-redux';
import { Lang } from '../public';
import BarTitle from '../component/barTitle';
import { Route } from 'react-router-dom';
import 'antd-mobile/dist/antd-mobile.css';
import jsBridge from '../jssdk/JSBridge';
import Cookies from 'universal-cookie';
import ipcMqtt from '../jssdk/ipcMqtt';
import SystemApi from '../jssdk/system';
import { Toast } from 'antd-mobile';
class Ipcinfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
      devId:'',
      devModel:'',
      hwVersion:'',
      version:'',
      mac:'',
      supplier:''
    }
    this.handleClickBack = this.handleClickBack.bind(this);
    this.changePicture = this.changePicture.bind(this)
		this.systemApi = new SystemApi;
	}

	componentDidMount() {
    const cookies = new Cookies();
    Toast.loading(Lang.public.loading);
    const options = {
      userId: cookies.get('userId'),
      payload:{
        devId: this.props.devId,
        password:this.props.password,
        userId: cookies.get('userId')
      }
    };
		ipcMqtt.getDevInfoReq( options ).then((res) =>{
      Toast.hide();
			if(res.ack.code == 200 ){
        let devinfo = res.payload;
				this.setState({
					devId:devinfo.devId.replace(/([\s\S]{10})([\s\S]{12})/,"$1****"),
					devModel:devinfo.devModel,
					hwVersion:devinfo.hwVersion,
					version:devinfo.version,
					mac:devinfo.mac,
					supplier:devinfo.supplier
        })
			}
		}).catch((res) => {
        Toast.info(res && res.desc ? res.desc : Lang.device.dialog.tip[3]);
		});
		  this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
	}

	handleClickBack(event) {
		this.props.history.goBack();
  }
  
  changePicture(){
    this.props.history.push('/ipc/changePicture')
  }

	render() {
		return(
			<div className="ipcinfo">
		    <BarTitle  title={Lang.ipc.deviceInfo.title} onBack={this.handleClickBack} />
			<div className="content" >
			  <div className="deviceIconBackground">	
			    <div className={"deviceIcon " + this.props.icon} onClick = { this.changePicture }></div>
			  </div>
			  <div className="customlist" style={{marginTop: '2.3rem'}}>
				<div className="item" >
					<span className="title">{Lang.ipc.deviceInfo.deviceid}</span>
					<span  className="name">{this.state.devId}</span>
				</div>
				<div className="item">
					<span className="title">{Lang.ipc.deviceInfo.devicemodel}</span>
					<span  className="name">{this.state.devModel}</span>
				</div>
				<div className="item">
					<span className="title">{Lang.ipc.deviceInfo.softwarev}</span>
					<span  className="name">{this.state.version}</span>
				</div>
				<div className="item">
					<span className="title">{Lang.ipc.deviceInfo.hardwarev}</span>
					<span  className="name">{this.state.hwVersion}</span>
				</div>
				<div className="item">
					<span className="title">{Lang.ipc.deviceInfo.mac}</span>
					<span  className="name">{this.state.mac}</span>
				</div>
				<div className="item">
					<span className="title">{Lang.ipc.deviceInfo.supplier}</span>
					<span  className="name">{this.state.supplier}</span>
				</div>
				</div>
			</div>
		</div>
		);
	}
}
const mapStateToProps = (state, ownProps) => {
    const devId = (state.device.fromPage === 'list' || state.device.recordAttr.devId === '') ? state.device.deviceItem.devId : state.device.recordAttr.devId;
    return {
        devId : devId,
        password : state.device.items[devId].password,
        icon:state.device.items[devId].icon == 'default' ? "camera" : state.device.items[devId].icon
    };
};
export default connect(mapStateToProps)(Ipcinfo)