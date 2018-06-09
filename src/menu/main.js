import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import Cookies from 'universal-cookie';
import { fetchRoomList } from '../action/room';
import { Lang } from '../public';
import './default/style.css';
import SystemApi from '../jssdk/system';

const cookies = new Cookies();
class MenuMain extends Component {
  constructor(props) {
  	super(props);
		this.state = {
			 userName: cookies.get('nickName') || 'My name',
			 fileUri: cookies.get('photoUri') || "",
		};
		console.log("wcb this.cookies.get('fileUri')：",cookies.get('photoUri'));
		this.systemApi = new SystemApi;
    this.handleClick = this.handleClick.bind(this);
    this.handleHeadClick = this.handleHeadClick.bind(this);
    this.handleRoomClick = this.handleRoomClick.bind(this);
		this.handleDeviceClick = this.handleDeviceClick.bind(this);
		this.handleVideoClick = this.handleVideoClick.bind(this);
	}
  
  componentDidMount() {
		const { actions, currentHomeId } = this.props;
		const request= {
			cookieUserId: cookies.get('userId'),
			cookieUserToken: '',
			pageSize: 100,
			offset: 0,
			homeId: currentHomeId
		}
		actions.fetchRoomList(request);
		this.systemApi.offGoBack().onceGoBack(this.handleClick);
  }
  
  handleHeadClick(event){
  	this.props.history.push('/user/modify');
  }
  
  handleRoomClick(roomId){
  	this.props.history.push(`/room/roomManagement/${roomId}`);
  }
  
  handleDeviceClick(event){
  	this.props.history.push('/home');
	}
  handleVideoClick(event){
		this.props.history.push('/ipc/videoListManage');
	}
  
  handleClick(event) {
  	// 临时注释掉，以增加个人信息的临时入口，之后宝伙要统一处理--杜杰
		this.props.history.goBack();
	}
  
  render() {
		const { roomIds, rooms, totalCount, unbindDevices, deviceIds } = this.props;
		console.log("wcb this.state.userName",this.state.userName);
		console.log("wcb this.state.fileUri",this.state.fileUri);
    return (
      <div className="menu main">
      	<div className="menu-bottom" onClick={this.handleClick}></div>
      	<div className="menu-content">
      		<div className="menu-box">
	      		<Link to="/setting/main" className="menu-setting"></Link>
	      		<div className="menu-icon" style={this.state.fileUri !=="" ?{backgroundImage: `url(${this.state.fileUri})`}:{}} onClick={this.handleHeadClick}></div>
						<p className="menu-name">{this.state.userName || 'My name'}</p>
						<div className="menu-list">
							<div className="menu-device">
								<div onClick={this.handleDeviceClick} className="menu-list-item">
									<p>My Devices</p>
									<span>{deviceIds.length}</span>
								</div>
							</div>
							<div className="menu-device">
							<div onClick={this.handleVideoClick} className="menu-list-item">
									<p>Video management</p>
									<span></span>
								</div>
							</div>
							<p className="menu-list-title">
								My rooms
							</p>
							<div className="menu-rooms">
								{roomIds ? roomIds.map((id, index) =>
									<div key={index} className="menu-list-item" onClick={ () => { this.handleRoomClick(id) } }>
										<p>{rooms[id].name}</p>
										<span>{id === 0 ? unbindDevices.length : rooms[id].devNum}</span>
									</div>
								) : 
								<div className="menu-list-item">
										<p>Everything else</p>
										<span>{unbindDevices.length}</span>
								</div>
								}
							</div>							
	      		</div>
	      		
						<Link to="/room/addRoom" className="menu-add-item">Create a room</Link>
      		</div>
      	</div>
      </div>
    );
  }
}

// export default connect()(MenuMain)

const mapStateToProps = state => {
	console.log(state)
  return {
    roomIds: state.room.list,
		rooms: state.room.items,
		totalCount: state.room.totalCount,
		currentHomeId: state.family.currentId,
		unbindDevices: state.device.unbindDevices || [],
		deviceIds: state.device.list
  }
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ fetchRoomList }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuMain);