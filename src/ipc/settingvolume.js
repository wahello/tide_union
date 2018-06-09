import React, {
	Component
} from 'react';
import './default/style.css';
import { connect } from 'react-redux';
import { Lang } from '../public';
import BarTitle from '../component/barTitle';
import { Route, Link } from 'react-router-dom';
import { Radio, List } from 'antd-mobile';
import { Slider, WingBlank, WhiteSpace } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import jsBridge from '../jssdk/JSBridge';
import SystemApi from '../jssdk/system';
import { bindActionCreators } from 'redux';
// import { saveVolume } from '../action/ipc';
import { setDeviceAttr } from '../action/device';
// import Device from '../jssdk/device';
import { Toast } from 'antd-mobile';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
class Settingvolume extends Component {
	constructor(props) {
		super(props);
		this.state = {
			postVal:this.initValue()
		}
		// this.device = new Device
		this.systemApi = new SystemApi;
		this.initValue = this.initValue.bind(this);
    this.selectCurrent = this.selectCurrent.bind(this);
    this.handleClickBack = this.handleClickBack.bind(this);
	}


	componentDidMount() {
		this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
		console.log('这是改动的值>>>>>>',this.state.getVolumeVaule)
	}

	handleClickBack(event) {
		const { actions } = this.props;
		const { getVolumeVaule,postVal } = this.state;
		Toast.loading(Lang.public.loading);
		// this.device.setDevAttrReq({
		// 	parentId: this.props.parentId,
		// 	payload:{
		// 		devId:this.props.devId,
		// 	attr:{
		// 		SoundLevel:getVolumeVaule
		// 		}
		// 	}
		// }).then(res => {
		// 	Toast.hide();
		// 	if (res.ack.code == 200 ) {
		// 		this.props.actions.saveVolume(getVolumeVaule)
		// 		this.props.history.goBack();
		// 		console.log("设备更新设备信息成功");
		// 	} else {
		// 		Toast.info(Lang.device.sirenVolume.dialog.tip[0]);
		// 		// console.log("设备更新失败，其他原因");
		// 	}
		// }).catch(res => {
		// 	Toast.info(Lang.device.dialog.tip[3]);
		// });

		const options = {
			parentId: this.props.parentId,
			payload: {
				devId:this.props.devId,
        userId: cookies.get('userId'),
        password:this.props.password,
			attr: {
					SoundLevel:postVal
				},
			},
		};
		actions.setDeviceAttr(options).then(() => {
			Toast.hide();
			// this.props.actions.saveVolume(getVolumeVaule)
			this.props.history.goBack();
		});
	}

	selectCurrent(index, item){
    this.setState({
      getVolumeVaule:item,
      postVal:index
    })
    // this.props.actions.saveVolume(index)
	}

	initValue(){
    let currVol = this.props.getVolumeVaule
    let text = Lang.ipc.deviceVolume;
    let showText = ''
    if(currVol == undefined ||  currVol == '0'){
      showText = '0'
    } else if(currVol == 2){
      showText = '2'
    }else if(currVol == 1){
      showText = '1'
    }else if(currVol == 3){
      showText = '3'
    }else{
      showText = '4'
    }
    return showText
	}

	render() {
    let _list = Lang.ipc.deviceVolume.type;
    let itemList = _list.map((item,index) =>
      <li className='rotation_lsit' key={index}>
          <span className="rotation_text">{ item }</span>
          <i className={ this.state.postVal == index ? "check_rotation check_rotation_true" : "check_rotation check_rotation_false"} onClick={ this.selectCurrent.bind(this,index,item)}></i>
      </li>
    )
    return (
        <div className='PictureRotation'>
            <BarTitle onBack={this.handleClickBack} title={Lang.ipc.deviceVolume.title} />
            <div className='rotation_main'>
                <ul>
                  { itemList }
                </ul>
            </div>
        </div>
    )
  }
}
const mapStateToProps = (state, ownProps) => {
  // const devId = '896a7cb56c3e41dcac48a0f457783314';
  const devId = (state.device.fromPage === 'list' || state.device.recordAttr.devId === '') ? state.device.deviceItem.devId : state.device.recordAttr.devId;
	return {
		devId : devId,
      parentId : devId,
      getVolumeVaule:state.device.items[devId].attr.SoundLevel,
      password:state.device.items[devId].password
	}
}

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
		// saveVolume,
		setDeviceAttr
	}, dispatch)
})
export default connect(mapStateToProps,mapDispatchToProps)(Settingvolume)