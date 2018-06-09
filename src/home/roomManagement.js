import React, { Component } from 'react';
import Device from '../jssdk/device';
import ListItem from './component/listItem2';
import BarTitle from '../component/barTitle';
import { showDialog, devicesUpdatingDone } from '../action';
import { connect } from 'react-redux';
import { Lang } from '../public';
import './default/style.css';
import { Base64 } from 'js-base64';
import Cookies from 'universal-cookie';
import jsBridge from '../jssdk/JSBridge';
import { Link } from 'react-router-dom';
import PullToRefresh from 'antd-mobile/lib/pull-to-refresh';
import 'antd-mobile/lib/pull-to-refresh/style/css';
import ListView from 'antd-mobile/lib/list-view';
import 'antd-mobile/lib/list-view/style/css';
import { shouldUpdateDeviceList } from '../action/device';
import { bindActionCreators } from 'redux';
/** 引用页面 **/
import PageDeviceList from '../device/list';
import SystemApi from '../jssdk/system';

const dialogLang = Lang.public.dialog;
const deviceLang = Lang.device;
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
const cookies = new Cookies;

class RoomManagement extends Component {
    constructor(props) {
        super(props);
        this.communicator = jsBridge;
        this.state = {
            devices: [],
            empty: false,
            refreshing: true,
            cancelLongPress: false
        }
        this.setParentCancelLongPress = this.setParentCancelLongPress.bind(this);
//      this.device = new Device;
//      this.handleOnOff = this.handleOnOff.bind(this);
//      this.handleDel = this.handleDel.bind(this);
//      this.handleAdd = this.handleAdd.bind(this);
//      this.goToDeviceDetail = this.goToDeviceDetail.bind(this);
        this.handleClickBack = this.handleClickBack.bind(this);
        this.systemApi = new SystemApi;
    }

    setParentCancelLongPress() {
		this.setState({
			cancelLongPress: false
		})

    }
    
    handleClickBack(event) {
    	const { actions } = this.props;
    	actions.shouldUpdateDeviceList();//刷新数据
        this.props.history.replace('/home');
    }

    componentDidMount() {
		this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
	}

    render() {
        const { roomId, rooms } = this.props;
        let switchState = true;
        let uuid = 0;
        return (
            <div className="room main" onTouchStart={(e) => {
					if (e.target.className.indexOf('close') > -1) return;
					this.setState({
						cancelLongPress: true
					})
				}}>
                <BarTitle>
                    <a onClick={this.handleClickBack} className="icon back"></a>              
                    <Link to={`/room/editRoom/${roomId}`} className="icon setting"></Link>
				</BarTitle>

                <div className="switch-home">
                    <div className="view">
                        <span>{rooms[roomId].name}</span>
                    </div>
                </div>

                <PageDeviceList
                    history={this.props.history}
                    location={this.props.location}
                    pageFrom="room"
                    queryId={roomId} 
                    cancelLongPress={this.state.cancelLongPress}
					setParentCancelLongPress={this.setParentCancelLongPress}
                />
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        cacheUpdated: state.device.cacheUpdated,
        roomId: ownProps.match.params.roomId,
        rooms: state.room.items
    }
}

const mapDispatchToProps = dispatch => {
    return {
        cacheUpdatingDone: () => {
            dispatch(devicesUpdatingDone());
        },
        showDialog: (title, tip, btns) => {
            dispatch(showDialog(title, tip, btns))
        },
        actions: bindActionCreators({ 
			shouldUpdateDeviceList
		}, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomManagement)