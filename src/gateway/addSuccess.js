import React, { Component } from 'react';
import Device from '../jssdk/device';
import './default/style.css';
import Cookies from 'universal-cookie';
import { Lang } from '../public/resource';
import BarTitle from '../component/barTitle';
import { connect } from 'react-redux';
import { createForm } from 'rc-form';
import Toast from 'antd-mobile/lib/toast';
import 'antd-mobile/lib/toast/style/css';
import { bindActionCreators } from 'redux';
import ScrollView from '../component/scrollView';
import { fetchRoomList } from '../action/room';
import roomApi from '../jssdk/room';
import SystemApi from '../jssdk/system';
import { shouldUpdateDeviceList, initAddDevNotifyList } from '../action/device';
import { showDialog, changeFromPage } from '../action';
// let itemList = [];
const cookies = new Cookies();
var defaultId = 0;
const pageShowList = [
    { type: 'gateway', Navtitle: 'Add Gateway' },
    { type: 'lighting', Navtitle: 'Light Bulb' },
    { type: 'motion', Navtitle: 'Add Motion sensor' },
    { type: 'sensor', Navtitle: 'Add Sensor' },
    { type: 'siren', Navtitle: 'Add Siren' },
    { type: 'plug',  Navtitle: 'Add Plug'},
    { type: 'sirenhub',  Navtitle: 'Add Siren hub'},
    { type: 'keyfob',  Navtitle: 'Add Keyfob'},
    { type: 'keypad',  Navtitle: 'Add Keypad'}
];
const dialogLang = Lang.public.dialog;
const deviceLang = Lang.device;
class AddSuccess extends Component {
    cookies = new Cookies();
    constructor(props) {
        super(props);
         this.device = new Device();
        // let type = this.props.location.query.type;
        let name = '';
        let roomId = '';
        let homeId = '';
        let parentId = '';
        let devId = '';
        let icon = '';
        let agreement = '';
        if (this.props.location.query) {
            name = this.props.location.query.name;
            roomId = this.props.location.query.roomId;
            homeId = this.props.location.query.homeId;
            parentId = this.props.location.query.parentId;
            devId = this.props.location.query.devId;
            icon = this.props.location.query.icon;
            agreement =this.props.location.query.agreement;
        }
        this.state = {
            click: false,
            placename: '',
            clear: false,
            editvalue: name,
            focus: false,
            navText: '',
            imgIcon: '',
            selectedRoomId: 0,
        	roomId:roomId,
        	homeId:homeId,
        	parentId:parentId,
        	devId:devId,
        	icon:icon,
        	agreement:agreement,
        }
        this.systemApi = new SystemApi;
        this.removeText = this.removeText.bind(this);
        this.changeState = this.changeState.bind(this);
        this.handleClickBack = this.handleClickBack.bind(this);
        this.doDone = this.doDone.bind(this);
        this.inputOnblur = this.inputOnblur.bind(this);
        this.inputOnFocus = this.inputOnFocus.bind(this);
    };

    componentDidMount() {
        if (this.props.location.query) {
            const type = this.props.location.query.type;
            let devType = this.props.location.query.devType;
            console.log("wcb devType",this.props.location.query.devType);
            devType = this.getDeviceType(devType);
            const defaultRoomId = this.props.location.query.defaultRoomId;
            this.setState({imgIcon: devType,})
            if(defaultRoomId){
                this.setState({
                    selectedRoomId: defaultRoomId
                });
            }
            console.log("======componentDidMount() defaultRoomId = ", defaultRoomId);
            for (var i = 0; i < pageShowList.length; i++) {
                if (type === pageShowList[i].type) {
                    this.setState({
                        navText: pageShowList[i].Navtitle,
                        imgIcon: devType || pageShowList[i].type.toLowerCase().replace(/\s+/g, ""),
                        placename: pageShowList[i].type
                    })
                } else {
                    this.setState({
                        imgIcon: devType || type
                    })
                }
            }
        }

        this.refs.deviceName.focus();
        this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
    }

    getDeviceType(devType) {
        let key;
        if (devType) {
          key = devType.toLowerCase();
        }
  
        const typeObj = {
          light: 'light',
          gateway: 'multi_gateway',
          plug: 'plug',
          magnet: 'magnet',
          motion: 'motion',
          keyfob: 'keyfob',
          keypad: 'keypad',
  
          sensor: 'door_lock',
          sensor_doorlock: 'door_lock',
  
          sensor_pir: 'motion',
          sensor_motion: 'motion',
  
          siren: 'siren',
          alarm_siren: 'siren',
  
          multi_gateway: 'gateway',
          smartplug_meter: 'plug',
          remote: 'remote',
        };
  
        if (typeObj[key] === undefined) {
          return 'default';
        }
          console.log('---------typeObj[key]： ',  typeObj[key]);
      return typeObj[key];
    }  

    nextPage() {
        this.props.history.push('/device/addFlow');
    };

    handleClickBack(event) {
    	const {
			device,
			actions
		} = this.props;
    	let temName = this.props.location.query.name;
    	const {
			editvalue,
			} = this.state;
    	if(temName==editvalue){
    		//刷新数据
    		actions.shouldUpdateDeviceList();
    		this.props.history.push('/home')
    		 return;
    	}
    	const that = this;
        actions.showDialog(deviceLang.saveChangeConfirm, null, [{
			text: dialogLang.button[0],
			handleClick: function onHandle() {
//				this.props.history.push('/home')
				that.cancelEditName();
				this.hide();
			},
		}, {
			text: dialogLang.button[1],
			className: 'btn-split',
			handleClick: function onHandle() {
				that.editName(); 
				this.hide();
			},
		}, ]);
        // this.props.history.goBack();
        // this.props.history.push('/gateway/addFlow');
        // let data = {
        //     wifiname : this.props.location.query.wifiname,
        //     id : this.props.location.query.id,
        // }
        // let path = {
        //     pathname : '/gateway/inputPassword',
        //     query:data
        // }
        // this.props.history.push(path);

//      this.props.history.go(-2);//原版本返回
        // this.props.history.replace('/gateway/searchGW');

    };
	cancelEditName(){
		const {
			device,
			actions
		} = this.props;
		actions.shouldUpdateDeviceList();//刷新数据
		this.props.history.push('/home')
	}
    stateChange(e) {
        const target = e.target;
        this.setState({
            [target.name]: target.value,
            click: true,
            clear: true
        })

        if (target.value.length === 20) {
            Toast.info(Lang.gateway.addsuccess.tips[3],2);
        }
    };

    removeText(e) {
        e.stopPropagation();
        this.setState({
            placename: this.state.placename,
            editvalue: '',
            click: false,
            clear: false
        })
    };

    changeState(item) {
        this.setState({
            selectedRoomId: item.roomId
        });
        Toast.info("Add to  " + item.name, 2);
    };

    custom(){
        if (this.props.location.query) {
            const data = {
                name: this.props.location.query.name,
                devId: this.props.location.query.devId,
                type: this.props.location.query.type,
                icon: this.props.location.query.icon,
                devType: this.props.location.query.devType
            }
            const path = {
                pathname: "/gateway/customRoom",
                query: data
            }
            console.log("custom() data = ", data);
            console.log("custom() devType = ", this.props.location.query.devType);
            this.props.history.push(path);
        }else{
            const data = {
                name: '',
                devId: '',
                type: '',
                icon: '',
                devType: ''
            }
            const path = {
                pathname: "/gateway/customRoom",
                query: data
            }
            console.log("custom() data = ", data);
            console.log("custom() devType = ", this.props.location.query.devType);
            this.props.history.push(path);
        }
    };

    componentDidUpdate(prevProps, prevState) {

    }

    inputOnblur() {  // input 失去焦点事件
        setTimeout(() => {
			this.setState({
                focus: false
            });
        }, 100);
        let focus = this.state.focus;
    }

    inputOnFocus() { // input 获得焦点事件
        this.setState({
            focus: true
        })
        let focus = this.state.focus;
    }

    doDone(next) {
    	let agreement = this.state.agreement;
    	if(agreement=="BLE"){
    			this.editName(next);
    	}else{
	        if (!this.props.location.query.devId) {
	            Toast.info(Lang.gateway.addsuccess.tips[4],2);
	            return;
	        }
	        this.device = new Device;
	        const { editvalue } = this.state;
	        if (!editvalue) return Toast.info(Lang.gateway.addsuccess.tips[5], 2);
	
	        if (editvalue.length > 20) {
	            Toast.info(Lang.device.edit.validator[2]);
	            return;
	        }
	
	        const payload = {
	            devId: this.props.location.query.devId,
	            userId: this.cookies.get('userId'),
	            name: editvalue,
	            icon: this.props.location.query.icon || '',
	            homeId: this.props.currentHomeId,
	            roomId: this.state.selectedRoomId || 0
	        }
	        const { directDevIds } = this.props;
	        Toast.loading('', 60);
	        this.device.setDevInfoReq({
	            parentId: this.props.location.query.type.toLowerCase().indexOf('gateway') > -1 ||  this.props.location.query.type.toLowerCase().indexOf('wifi_plug') > -1 || this.props.location.query.type.toLowerCase().indexOf('sirenhub') > -1  ? this.props.location.query.devId : directDevIds[0], 
	            payload
	        }).then(res => {
	            Toast.hide();
	            console.log("设置设备属性设备（setDevInfoReq）返回信息： ", res);
	            if (res && res.ack && res.ack.code == 200) {
	                Toast.info(Lang.gateway.addsuccess.success, 2);
	                this.props.shouldUpdateDeviceList();
	                this.props.initAddDevNotifyList();
	                if (next === 'done') {
	                    this.props.history.push('/home');
	                } else {
	                    this.props.history.push('/device/addFlow');
	                }
	            } else {
	                let msg = res && res.ack && res.ack.desc ? res.ack.desc : '';
	                Toast.info(msg || Lang.gateway.addsuccess.fail, 2);
	            }
	        }).catch(res => {
	            Toast.hide();
	            let msg = res && res.desc ? res.desc : '';
	            Toast.info(msg || Lang.gateway.addsuccess.fail, 2);
	        });
    	}
    }
    
    editName(next){
    	const {
			device,
			actions
		} = this.props;
		const {
			editvalue,
			roomId,
			homeId,
			parentId,
			imgIcon,
			devId,
			icon,
		} = this.state;
		if(!editvalue.trim()) {
			Toast.info(Lang.device.edit.validator[0]);
			return;
		}
		if(editvalue.trim().length > 20) {
			Toast.info(Lang.device.edit.validator[2]);
			return;
		}

        if (editvalue.length > 20) {
            Toast.info(Lang.device.edit.validator[2]);
            return;
        }

        const payload = {
            devId: this.props.location.query.devId,
            userId: this.cookies.get('userId'),
            name: editvalue,
            icon: this.props.location.query.icon || '',
            homeId: this.props.currentHomeId,
            roomId: this.state.selectedRoomId || "0"
        }
        const { directDevIds } = this.props;
        Toast.loading('', 60);
        this.device.setDevInfoReq({
            parentId: parentId, 
            payload
        }).then(res => {
            Toast.hide();
            console.log("设置设备属性设备（setDevInfoReq）返回信息： ", res);
            if (res && res.ack && res.ack.code == 200) {
            	console.log("设置设备属性设备 200： ", res);
                Toast.info(Lang.gateway.addsuccess.success, 2);
                console.log("设置设备属性设备 2001111111111111111111111： ");
               actions.shouldUpdateDeviceList();
                console.log("设置设备属性设备 2002222222222222222222222： ");
                if (next === 'done') {
                    this.props.history.push('/home');
                } else {
                    this.props.history.push('/device/addFlow');
                }
            } else {
            	console.log("设置设备属性设备 非200： ", res);
                let msg = res && res.ack && res.ack.desc ? res.ack.desc : '';
                console.log("设置设备属性设备 非200 msg： ", msg);
                Toast.info(msg || Lang.gateway.addsuccess.fail, 2);
            }
        }).catch(res => {
        	console.log("设置设备属性设备 异常： ", res);
            Toast.hide();
            let msg = res && res.desc ? res.desc : '';
             console.log("设置设备属性设备 异常 msg： ", msg);
            Toast.info(msg || Lang.gateway.addsuccess.fail, 2);
        });
    }

    render() {
        const { roomIds, rooms, totalCount, unbindDevices } = this.props;
        const { selectedRoomId } = this.state;
        console.log('房间对象：', rooms)
        const roomsList = roomIds.map((id, index) =>
            <div className="left" style={{ borderRight: (index + 1) % 3 === 0 ? "none" : '1px solid #4E5367' }} key={index}>
                <div className={`success_icon ${id === defaultId ? 'default' : rooms[id].icon}${id===selectedRoomId ? '_s' : ''}`} onClick={(e) => this.changeState(rooms[id])}></div>
                <p className={`type_name ${id === selectedRoomId ? 'selected' : ''}`}>{rooms[id].name}</p>
            </div>
        )

        return (
            <div className='add_success'>
                <BarTitle onBack={this.handleClickBack} title={this.state.navText} />
                <ScrollView>
                    <div className='fiexd'>
                        <div className='success_fixed'>
                            <div className='success_img'></div>
                            <p className='success_text'>{Lang.gateway.addsuccess.tips[0]}</p>
                            {/* <p className='success_tips'>{Lang.gateway.addsuccess.tips[1]}</p> */}
                        </div>
                    </div>
                    <div className='gateway_main'>
                        <p className='success_tips'>{Lang.gateway.addsuccess.tips[1]}</p>
                        <div className="box-imgtext" >
                            <span className={"img_icon" + " " + this.state.imgIcon}></span>
                            <input ref="deviceName" className={`${this.state.focus ? 'edit_name' : 'gateway_name'}`} type='text' name="editvalue" placeholder={this.state.placename} value={this.state.editvalue}
                                onChange={(e) => this.stateChange(e)} maxLength='20' onFocus={this.inputOnFocus} onBlur={this.inputOnblur}/>
                            {/* removeText 会受onBlur影响而无效 */}
                            <i className={this.state.editvalue.length && this.state.focus ? 'del_icon' : 'hid_del_icon'} onClick={(e) => {this.removeText(e)}}></i>
                        </div>
                        <p className='success_tips' style={{ marginTop: "1.3rem" }}>{Lang.gateway.addsuccess.tips[2]}</p>
                        <div className='type_icon'>
                                {roomsList}
                                <div className="left" style={{ borderRight: (rooms.length) % 3 === 0 ? "none" : '1px solid #4E5367' }} key={rooms.length}>
                                    <div className={`success_icon custom`} onClick={(e) => this.custom()}></div>
                                    <p className={`type_name`}>{Lang.gateway.addsuccess.tips[6]}</p>
                                </div>
                        </div>
                        <div className='add_button'>
                            <button onClick={() => this.doDone('done')} className="done">{Lang.gateway.addsuccess.done[0]}</button>
                            <button onClick={() => this.doDone('continue')} className="add_device">{Lang.gateway.addsuccess.done[1]}</button>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}

const mapStateToProps = state => {
    console.log(state)
    console.log("---w-----")
    return {
        directDevIds: state.device.directDevIds || {},
        roomIds: state.room.list,
        rooms: state.room.items,
        totalCount: state.room.totalCount,
        currentHomeId: state.family.currentId,
        unbindDevices: state.device.unbindDevices || [],
    }
};
	const mapDispatchToProps = dispatch => ({
//const mapDispatchToProps = (dispatch) => {
//  return {
//    shouldUpdateDeviceList: (...args) => dispatch(shouldUpdateDeviceList(...args)),
//    initAddDevNotifyList: (...args) => dispatch(initAddDevNotifyList(...args)),
//  }
	actions: bindActionCreators({
				shouldUpdateDeviceList,
				changeFromPage,
				showDialog,
			},
			dispatch,
		),
  });

export default connect(mapStateToProps, mapDispatchToProps)(AddSuccess);