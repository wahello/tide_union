import React, { Component } from 'react';
import { connect } from 'react-redux';
import { saveDeviceItem } from '../../action/device';
import { bindActionCreators } from 'redux';
import '../default/style.css';
import jsBridge from '../../jssdk/JSBridge';
import ipcHttp from '../../jssdk/ipcplan';
import Cookies from 'universal-cookie';
import { changeFromPage } from '../../action';
class DeviceIPCItem extends Component{
  cookies = new Cookies();
  constructor(props) {
    super(props);
    this.state = {
      item : this.props.deviceItems[this.props.devId],
      // p2pId:this.props.deviceItems[this.props.devId].p2pId
      videoStyle:{},
      mqttStatus:this.props.mqttStatus
    };
    this.preventDefault = false;
    this.reconfig = this.reconfig.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    if(this.preventDefault){
      this.preventDefault = false;return;
    }
    let devItem = this.props.deviceItems[this.props.devId];
    this.props.actions.saveDeviceItem(devItem);
    this.props.changeFromPage('ipcItem');
    
    var deviceInfo = {
      userId:this.cookies.get('userId'),
      uid:devItem.p2pId,
    //   uid:"D5KAB57MLNRC1HPGU1NJ",
      name:"admin",
      password:"admin123",
      deviceId:devItem.devId,
      deviceName:devItem.name,
      online:devItem.online,
    }
  
    jsBridge.send({
      service: 'LiveAndPlayBack',
      action: 'start',
      data: deviceInfo,
    }).then(res => {

    });
  
    this.props.history.push("/ipc");
  }

  componentDidMount(){
    let videoStyle = {},p2pId = this.props.deviceItems[this.props.devId].p2pId;
    if(p2pId === undefined ){
      videoStyle = {
        backgroundImage: 'url('+require('../default/image/ipc_icon_no_record.png')+')',
        backgroundSize:`6rem`,
      };
    }else{
      videoStyle = {
        // background:'url(/static/media/'+p2pId+'_tempPhoto.jpg) no-repeat center/cover,url(' + require('../default/image/ipc_icon_no_record.png') + ')  no-repeat center/6rem',
        backgroundImage: 'url(/static/media/'+p2pId+'_tempPhoto.jpg),url(' + require('../default/image/ipc_icon_no_record.png') + ')',
        backgroundSize:`cover,6rem`,
      };
    }
    this.setState({
      videoStyle
    })
  }

  componentWillReceiveProps(nextProps){
    let videoStyle = {},p2pId = nextProps.deviceItems[nextProps.devId].p2pId,stateObj = {}
    if(p2pId === undefined ){
      videoStyle = {
        backgroundImage: 'url('+require('../default/image/ipc_icon_no_record.png')+')',
        backgroundSize:`6rem`,
      };
    }else{
      videoStyle = {
        backgroundImage: 'url(/static/media/'+p2pId+'_tempPhoto.jpg),url(' + require('../default/image/ipc_icon_no_record.png') + ')',
        backgroundSize:`cover,6rem`,
        // backgroundSize:`6rem`,
      };
    }
    stateObj.videoStyle = videoStyle
    stateObj.item = nextProps.deviceItems[nextProps.devId]
    if(this.state.mqttStatus !== nextProps.mqttStatus){stateObj.mqttStatus= nextProps.mqttStatus}
    this.setState(stateObj)
  }

  reconfig(){
    this.preventDefault = true
    console.log("reconfig")
    this.props.history.push("/ipc/addCamera");
    // event.stopPropagation();
    // event.cancelable();
    // event.preventDefault();
  }

  render(){
    return (
      <div className='deviceIPCItem' onClick={this.handleClick}>
        <div className='header'>
          <div className="leftTip">{this.state.item.name}</div>
          <div className="rightTip">
            {
              this.state.item.online ?
              <div className="topMessage">
                <span className={'icon onlineIcon'}></span>
                <span>Online</span>
              </div> :
              <div className="topMessage">
                <span className={'icon offlineIcon'}></span>
                <span>Offline</span>
              </div> 
            }
            <div className='topRoomName'>{this.state.item.roomName}</div>
          </div>
        </div>
        <div className="videoContend" style={this.state.videoStyle}>
          {
           　this.state.item.online ? "" : <a className="reconifg" onClick={this.reconfig}>{'Reconfig Wi-Fi'}</a>
          }
        </div>
      </div>
    )
  }
} 

//将state绑定到props
const mapStateToProps = state => {

	return{
    deviceItems: state.device.items,
	}
};
const mapDispatchToProps = (dispatch) => {
	return {
		changeFromPage: (...args) => dispatch(changeFromPage(...args)),
		actions: bindActionCreators({
			saveDeviceItem
		}, dispatch),
	}
};
export default  connect(mapStateToProps, mapDispatchToProps)(DeviceIPCItem);
