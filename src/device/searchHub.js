import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import { bindActionCreators } from 'redux';
import Device from '../jssdk/device';
import BarTitle from '../component/barTitle';
import { showDialog } from '../action';
import { Lang } from '../public/resource';
import SystemApi from '../jssdk/system';
import ScrollView from '../component/scrollView';
import './default/style.css';
import './default/searchStyle.css';
import SearchComponent from './component/SearchComponent';
import { initAddDevNotifyList, shouldUpdateDeviceList } from '../action/device';

class SearchHub extends Component {
  constructor(props) {
    super(props);
    this.state = {
      init: true,
      searching: false,
      error: false,
    };
    this.handleClickBack = this.handleClickBack.bind(this);
    this.device = new Device();
    this.cookies = new Cookies();
    this.handleClickToSet = this.handleClickToSet.bind(this);
    this.startSearchDevices = this.startSearchDevices.bind(this);
    this.tryAgain = this.tryAgain.bind(this);
  }

  componentDidMount() {
    this.startSearchDevices();
  }

  getDeviceIcon(devType) {
    const { searchType, } = this.props;
    let key = searchType.toLowerCase();

    if (devType) {
      key = devType.toLowerCase();
    }

    const iconObj = {
      light: 'lighting',
      gateway: 'multi_gateway',
      plug: 'plug',
      magnet: 'magnet',
      motion: 'motion',
      camera: 'camera',
      keyfob: 'keyfob',
      keypad: 'keypad',
      
//    light_colortemperature: 'lighting',
//    light_colourtemperature: 'lighting',
//    light_dimmable: 'lighting',
//    light_rgbw: 'lighting',

      sensor: 'door_lock',
      sensor_doorlock: 'door_lock',

      sensor_pir: 'motion',
      sensor_motion: 'motion',

      siren: 'siren',
      alarm_siren: 'siren',

      multi_gateway: 'gateway',
      smartplug_meter: 'plug',
    };

    if (iconObj[key] === undefined) {
      return 'default';
    }
  	  console.log('---------iconObj[key]： ',  iconObj[key]);
    return iconObj[key];
  }

  getName() {
      const { searchType, } = this.props;
      let key = searchType.toLowerCase();

      const typeObj = {
        motion: 'Motion sensor',
        door: 'door/window sensor',
      };

      if (typeObj[key] === undefined) {
        return searchType;
      }
  	  console.log('---------typeObj[key]： ',  typeObj[key]);
    return typeObj[key];
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
    };

    if (typeObj[key] === undefined) {
      return 'default';
    }
    console.log('---------typeObj[key]： ',  typeObj[key]);
    return typeObj[key];
  }

  tryAgain() {
    console.log(this.props.match.params.type)
    const type = this.props.match.params.type;
    if (!type) {
      this.startSearchDevices();
      this.setState({
        searching: true,
        error: false,
      });
      return;
    }

    switch(type.toLowerCase()) {
      case 'light':
        this.props.history.replace('/device/lightAdd');
        break;
      case 'motion':
        this.props.history.replace('/device/motionAdd1');
        break;
      case 'door':
        this.props.history.replace('/device/doorAdd1');
        break;
      case 'siren':
        this.props.history.replace('/device/sirenAdd1');
        break;
      case 'keypad':
        this.props.history.replace('/device/keypadAdd');
        break;
      case 'keyfob':
        this.props.history.replace('/device/keyfobAdd');
        break;
      default:
        this.props.history.replace('/device/addFlow');
        break;      
    }
  }

  handleClickBack() {
    const { addDevNotifyList, actions } = this.props;
    this.stopSearching();

    this.setState({
      refreshing: false,
      searching: false,
    });
    const devIds = [];
    if (addDevNotifyList.length) {
      addDevNotifyList.map((dev) => {
        devIds.push(dev.devId);
      });
      this.delDevForUnselect(devIds);
    }

    actions.initAddDevNotifyList();
    // this.props.history.goBack();
    this.props.history.replace('/home'); // 直接跳回首页
  }

  delDevForUnselect(devIds) {
    if (!devIds.length) {
      return;
    }
    const { directDevIds,items } = this.props;
    devIds.map((id) => {
      this.device.delDevReq({
        parentId: directDevIds.gateway[0],
        payload: {
          devId: id,
        },
      }).then(() => {
      });
    });
  }

  startSearchDevices() {
    if (this.state.searching) {
      return;
    }

    const { directDevIds } = this.props;
    this.setState({
      init: false,
      refreshing: true,
      searching: true,
    });

    this.device.addDevReq({
      devId: directDevIds.gateway[0],
      payload: {
        networkType: 'zigbee',
        devType: '',
      },
    }).then((res) => {
      console.log('device.addDevRsp ', res);
      this.setState({
        refreshing: false,
        searching: true,
      });
      setTimeout(() => {
        this.setState({
          searching: false,
        });
      }, 60000);

      if (res === undefined && !this.props.addDevNotifyList.length) {
        this.setState({
          searching: false,
          error: true,
        });
      }
    }).catch((res) => {
      console.log('addDevRsp', res);
      this.setState({
        refreshing: false,
        searching: false,
        error: true,
      });
    });
  }

  stopSearching() {
    const { directDevIds } = this.props;
    this.device.stopDevReq({
      parentId: directDevIds.gateway[0],
      payload: {
      },
    }).then(() => {
      console.log('停止搜索');
    }).catch((res) => {
      console.log(`停止搜索失败${res.CODE}`);
    });
  }

  handleClickToSet() {
    this.stopSearching();
    const { actions, searchType, directDevIds, currentHomeId, addDevNotifyList } = this.props;
    if (addDevNotifyList.length > 1) {
      addDevNotifyList.map((device) => {
      	//let str = "lds.gateway.g151"; 
      	let str = device.productId; 
      	let arr = str.split(".");
      	let devType =  arr[1];
      	console.log('---------device.productId： ',  str);
      	console.log('---------devType： ',  devType);
        // 多选 设置设备信息
        this.device.setDevInfoReq({
          parentId: directDevIds.gateway[0],
          payload: {
            devId: device.devId,
            userId: this.cookies.get('userId'),
            name: device.name,
            icon: this.getDeviceIcon(devType),
            homeId: currentHomeId,
            roomId: 0,
          },
        }).then(() => {
          this.props.history.push('/home');
          actions.initAddDevNotifyList();
          actions.shouldUpdateDeviceList();
        });
      });

    } else {
      const device = addDevNotifyList[0];
      //let str = "lds.gateway.g151"; 
  	  let str = device.productId; 
  	  let arr = str.split(".");
  	  let devType =  arr[1];
  	  console.log('---------device.productId： ',  str);
      console.log('---------devType： ',  devType);
      	
      const data = {
        name: device.name,
        devId: device.devId,
        type: searchType,
        icon: this.getDeviceIcon(devType),
        devType: devType,
      };
      const path = {
        pathname: '/gateway/addSuccess',
        query: data,
      };
      actions.initAddDevNotifyList();
      this.props.history.push(path);
    }
  }

  render() {
    const { addDevNotifyList, searchType } = this.props;
    const notFoundEle = () => {
      if (this.state.init || this.state.searching || this.state.refreshing || addDevNotifyList.length) {
        return null;
      }
      return <div className='not_foud'>{Lang.device.deviceNotFound}</div>;
    }
    const btnEle = () => {
      if (addDevNotifyList.length) {
        return <button className="doneBtn" onClick={this.handleClickToSet}>{Lang.public.done}</button>;
      }
      if (this.state.init || this.state.searching || this.state.refreshing) {
        return null;
      }
      return <button className="doneBtn" onClick={this.tryAgain}>{Lang.public.tryAgain}</button>;
    }
    return (
      <div className="searchHub" >
        <BarTitle onBack={this.handleClickBack} title={`Search ${this.getName()}`} />
        <div className="searchHub_main">
          {notFoundEle()}
          {(this.state.searching && !this.state.error) ?
            <div className="search">
              <span>{Lang.pullToRefresh.searching}</span>
              <i className={this.state.searching ? 'animation_list' : ''} />
            </div> : null}
          <ScrollView>
            {addDevNotifyList.map((item) => {
            	let str = item.productId; 
              let arr = str.split(".");
              let devType =  arr[1];
              devType = this.getDeviceType(devType);
              return (<SearchComponent
                data={item}
                key={item.devId}
                type={devType}
              />);
            })}
          </ScrollView>
          {btnEle()}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    // addDevNotifyList: process.env.NODE_ENV === 'development' ? [{
    // 	devId: 'BBBBBBB',
    // 	name: 'aaa1',
    // 	devType: 'remote',
    // 	productId: "lds.remote.g151",
    // 	deviceSelect: false,
    // }
    // , {
    // 	devId: 'CCCCCCC',
    // 	name: 'aaa2',
    // 	devType: 'gateway',
    // 	productId: "lds.gateway.g151",
    // 	deviceSelect: false,
    // }
    // , {
    // 	devId: 'd',
    // 	name: 'aaa3',
    // 	devType: 'plug',
    // 	productId: "lds.plug.g151",
    // 	deviceSelect: false,
    // }, {
    // 	devId: 'e',
    // 	name: 'aaa4',
    // 	devType: 'light',
    // 	productId: "lds.light.g151",
    // 	deviceSelect: false,
    // }, {
    // 	devId: 'f',
    // 	name: 'aaa5',
    // 	devType: 'remote',
    // 	productId: "lds.remote.g151",
    // 	deviceSelect: false,
    // }, {
    // 	devId: 'g',
    // 	name: 'aaa6',
    // 	devType: 'magnet',
    // 	productId: "lds.magnet.g151",
    // 	deviceSelect: false,
    // }, {
    // 	devId: 'h',
    // 	name: 'aaa7',
    // 	devType: 'motion',
    // 	productId: "lds.motion.g151",
    // 	deviceSelect: false,
    // }, {
    // 	devId: 'i',
    // 	name: 'aaa8',
    // 	devType: 'camera',
    // 	productId: "lds.camera.g151",
    // 	deviceSelect: false,
    // }, {
    // 	devId: 'j',
    // 	name: 'aaa9',
    // 	devType: 'keypad',
    // 	productId: "lds.keypad.g151",
    // 	deviceSelect: false,
    // }, {
    // 	devId: 'k',
    // 	name: 'aaa10',
    // 	devType: 'keyfob',
    // 	productId: "lds.keyfob.g151",
    // 	deviceSelect: false,
    // }
  // ] : state.device.addDevNotifyList || [],

    addDevNotifyList: state.device.addDevNotifyList,
    directDevIds: state.device.directDevIds,
    searchType: ownProps.match.params.type,
    currentHomeId: state.family.currentId,
    items: state.device.items,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showDialog: (title, tip, btns) => {
      dispatch(showDialog(title, tip, btns));
    },
    actions: bindActionCreators({
      initAddDevNotifyList,
      shouldUpdateDeviceList,
    }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchHub);
