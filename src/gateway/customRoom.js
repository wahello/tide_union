import React, { Component } from 'react';
import './default/style.css';
import BarTitle from '../component/barTitle';
import ScrollView from '../component/scrollView';
import { Lang } from '../public';
import {selectRoomIcon} from '../action';
import { connect } from 'react-redux';
import SystemApi from '../jssdk/system';
import RoomIconClass from "../home/component/RoomIconClass";
import { createForm } from 'rc-form';
import roomApi from '../jssdk/room';
import Toast from 'antd-mobile/lib/toast';
import Cookies from 'universal-cookie';
import { fetchRoomList } from '../action/room';
import { bindActionCreators } from 'redux';

const ICONS = [
    'balcony',
    'basement',
    'bedroom',
    'bedroom2',
    'bedroom3',
    'bathroom2',
    'diningroom',
    'diningroom2',
    'kitchen',
    'living-room',
    'outside',
    'study',
    'study2',
    'fault'
];
const cookies = new Cookies();
var defaultRoomId = 0;

class CustomRoom extends Component {

    constructor(props) {
        super(props);
        const { dispatch } = props;
        
        if (this.props.location.query) {
            console.log("custom() devType = ", this.props.location.query.devType);
        }

        this.state = {
            currentIcon:"bedroom3",
            selectedRoomId: 0,
            name:""
	    }

	    this.systemApi = new SystemApi;
	    this.handleClick = this.handleClick.bind(this);
	    this.handleClickBack = this.handleClickBack.bind(this);
	    this.handleClickDone = this.handleClickDone.bind(this);
	    // 修改selectSpaceIcon就可以确认选中的图片
	    //this.props.selectSpaceIcon("bedroom3");
    }

    handleClick(objectIcon){
        this.props.selectRoomIcon(objectIcon);
    }

    handleClickBack(){
        if (this.props.location.query) {
            const data = {
                name: this.props.location.query.name,
                devId: this.props.location.query.devId,
                type: this.props.location.query.type,
                icon: this.props.location.query.icon,
                devType: this.props.location.query.devType,
            }
            const path = {
                pathname: "/gateway/addSuccess",
                query: data
            }
            console.log("======custom() data = ", data);
            console.log("======custom() defaultRoomId = ", defaultRoomId);
            this.props.history.push(path);
        }else{
            this.props.history.goBack();
        }
    }

    handleClickDone(event) {
        const form = this.props.form;
        const that = this;

		const roomName = form.getFieldValue('name');
		if (!roomName) {
			Toast.info(Lang.home.addRoom.emptyRoomName, 3, null, false);
			return;
		}
		
		let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
		    regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

		if(regEn.test(roomName) || regCn.test(roomName)) {
			Toast.info(Lang.home.addRoom.sceneNameNonstandard);
		    return;
		}
		
		let nameLength = this.getRoomNameLength(roomName);
		
		if(nameLength < 2 || nameLength > 30) {
			Toast.info(Lang.home.addRoom.roomNameLog, 3, null, false);
			return;
        }
        
        const { actions, selectedRoomIcon, currentHomeId } = this.props;
		const parameter = {
			icon: selectedRoomIcon || this.state.icon,
			cookieUserToken: '', // TODO
			cookieUserId: cookies.get('userId'),
			name: roomName,
			homeId: currentHomeId,
		};
		
		console.log("selectedRoomIcon : " ,selectedRoomIcon);
        console.log("currentHomeId : " ,currentHomeId);
            
		if (!parameter.icon) {
			console.log("parameter : " ,parameter);
			Toast.info(Lang.home.addRoom.emptyRoomIcon, 3, null, false);
			return;
		}
		
		this.setState({
			icon: selectedRoomIcon || this.state.icon
        })

        const { selectedRoomId } = this.state;

        roomApi.addRoom(parameter).then((res) => {
            if (res.code != 200) {
                Toast.info(res.desc || Lang.home.addRoom.saveFail, 3, null, false);
                return;
            }

            defaultRoomId = res.data.roomId;
            
            console.log('save room success: ' + res.data.roomId)
            console.log("======addRoom() defaultRoomId = ", defaultRoomId);

            this.getRoomData();
        })

    }

    getRoomData() {        
        // 获取当前家庭房间列表
        const { actions, currentHomeId } = this.props;
        actions.fetchRoomList({
          cookieUserId: cookies.get('userId'),
          cookieUserToken: '',
          pageSize: 100,
          offset: 0,
          homeId: currentHomeId
        }).then(() => {
            const { actions, rooms, selectedRoomIcon, totalCount, currentHomeId } = this.props;
            const { selectedRoomId } = this.state;
            console.log('房间列表：', rooms)
            console.log("======getRoomData() totalCount = ", totalCount);
            if (this.props.location.query) {
                const data = {
                    name: this.props.location.query.name,
                    devId: this.props.location.query.devId,
                    type: this.props.location.query.type,
                    icon: this.props.location.query.icon,
                    devType: this.props.location.query.devType,
                    defaultRoomId:defaultRoomId
                }
                const path = {
                    pathname: "/gateway/addSuccess",
                    query: data
                }
                console.log("======custom() data = ", data);
                console.log("======custom() defaultRoomId = ", defaultRoomId);
                this.props.history.push(path);
            }else{
                this.props.history.goBack();
            }
        });
    }

    getRoomNameLength(roomName){
		let len = 0;    
	    for (let i=0; i<roomName.length; i++) {    
	        if (roomName.charCodeAt(i)>127 || roomName.charCodeAt(i)==94) {    
	             len += 2;    
	         } else {    
	             len ++;    
	         }    
	     }    
	    return len;
	}

    componentDidMount(){
        this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
    }

    render() {
        let listItems = ICONS.map((type, i) => {
	      return <li key={i} className={this.props.selectedRoomIcon==type ? "icon-item-select" : "icon-item"} onClick={() => this.handleClick(type)}>
	              <RoomIconClass flag={'1'} type={type} />
	            </li>
        });

        const { getFieldProps, getFieldError } = this.props.form;

        return (
            <div className="custom-room">
                <BarTitle onBack={this.handleClickBack} title={Lang.gateway.customRoom.title} onDone={this.handleClickDone}/>
                <ScrollView>
                <p className='tip'>{Lang.gateway.littleTitle[2]}</p>
                    <div className="inputName">
                        <div className="input-eg"></div>
                        <input id="room-name-input" className="input-name" type="text" placeholder="" maxLength="30"
	                        {...getFieldProps('name', {
                                initialValue: "",
                                rules: [{required: true, max: 30, min: 6, message: Lang.room.roomTitle}]
                            })}/>
                        <div>
                        {this.props.form.getFieldValue('name') && this.props.form.getFieldValue('name').length ? <a className="clear-icon" href="javascript:;" 
                            onClick={() => this.props.form.setFieldsValue({name: ''})}></a> : ''}
                        </div>  
                    </div>
                    
                    <div className="room-icons">
                        <p className='tip2'>{Lang.gateway.littleTitle[3]}</p>
                        <ul className="icon-list">
                            {listItems}
                        </ul>
                    </div>
                </ScrollView>
            </div>
        );
    }
}

const mapStateToProps = state => {
    console.log(state)
    console.log("---cust-----")
  return {
       selectedRoomIcon: state.space.selectedRoomIcon,
       rooms: state.room.items,
       totalCount: state.room.totalCount,
       currentHomeId: state.family.currentId
  }
}

const mapDispatchToProps = dispatch => {
    return {
        selectRoomIcon: (...args) => dispatch(selectRoomIcon(...args)),
        actions: bindActionCreators({ fetchRoomList }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(CustomRoom));