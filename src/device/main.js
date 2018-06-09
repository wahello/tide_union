import React, { Component } from 'react';
import Device from '../jssdk/device';
import ListItem from './component/listItem';
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
import { Toast } from 'antd-mobile';
import 'antd-mobile/lib/toast/style/css';
import Ipcplan from '../jssdk/ipcplan';

const dialogLang = Lang.public.dialog;
const deviceLang = Lang.device;
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const cookies = new Cookies;

class DeviceList extends Component {
    
  constructor(props) {
    super(props);

    this.communicator = jsBridge;
    //let listCache = window.localStorage.getItem('deviceList');
    this.state = {
      devices:  Device.all(),
      empty: false,
      refreshing: true
    }

    this.device = new Device;
    this.handleOnOff = this.handleOnOff.bind(this);
    this.handleDel = this.handleDel.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.goToDeviceDetail = this.goToDeviceDetail.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  handleOnOff(deviceInfo, e){
    if(!deviceInfo.isOnline){
      return;
    }

    e.stopPropagation();
    
    let updateDeviceOnOff = (cb) => {
      this.setState({devices: this.state.devices.map(item => {
        if(item.deviceId === deviceInfo.deviceId && deviceInfo.isOnline){
          cb(item);
        }
        return item;
      })});
    }
   
    this.device.deviceControl({
      deviceId: deviceInfo.deviceId,
      isLocalOnline: deviceInfo.isLocalOnline,
      isCloudOnline: deviceInfo.isCloudOnline,
      deviceType: deviceInfo.deviceType,
      commType: deviceInfo.commType,
      desiredStatus: [{"name":"OnOff","type":"boolean","data": !deviceInfo.OnOff}]
    }).then(res => {
      if(Number(res.CODE) != 200){
        updateDeviceOnOff(function(item){
          item.OnOff = deviceInfo.OnOff;
        });
      }
    }).catch(res => {
      updateDeviceOnOff(function(item){
          item.OnOff = deviceInfo.OnOff;
        });
    });

    updateDeviceOnOff(function(item){
      item.OnOff = !item.OnOff;
    });
  
  }


  handleDel(dataDetail, e){
  	console.log("wcb main delete");
    var that = this;
    var target = e.currentTarget;
    let hideDelButton = function(){
      target.parentNode.querySelector('.list-item').style.left = 0;
    }

    if(!dataDetail.isOnline){
      this.props.showDialog(dialogLang.title[0], deviceLang.dialog.tip[0], [{
          text: dialogLang.button[1],
          handleClick: function(){
            this.hide();
            hideDelButton();
          }
        }]);
      return;
    }
	console.log("断开网络删除设备提示用户网络断开");
    this.props.showDialog(dialogLang.title[0], deviceLang.dialog.tip[1], [
        {
          text: dialogLang.button[0],
          handleClick: function(){
            this.hide();
            hideDelButton();
          }
        },
        {
          text: dialogLang.button[1],
          className: "btn-split",
          handleClick: function() {
          	if(!window.system.networkStatus) {
			      console.log("wcb networkStatus");
			      Toast.info(Lang.user.validator[14], 3, null, false);
			      return;
			    }else{
					 const devices = that.state.devices.filter(v => v.deviceId !== dataDetail.deviceId);
		            that.setState({devices: devices});
		
		            if(!devices.length){
		              that.setState({empty: true});
		            }
		
		            that.device.delDeviceFromDirectDevice({
		              deviceId: dataDetail.deviceId,
		              deviceVCode: dataDetail.deviceVCode
		            }).then(res => {
		              console.log('delete success' + res);
		              if(res.CODE != 200){
		                //alert deleting failed!
		                that.setState({
		                  devices: that.state.devices.concat(dataDetail),
		                  empty: false
		                });
		
		              } else {
		                window.localStorage.setItem('deviceList', JSON.stringify(that.state.devices));
		              }
		            }).catch(res => {
		                console.log('deleting failed', res)
		                that.setState({
		                  devices: that.state.devices.concat(dataDetail),
		                  empty: false
		                });
		            });
			    }
            this.hide();
          }
        }
    ]);
  }

  handleAdd(){
    
		// if(process.env.NODE_ENV === 'development'){
	    this.props.history.push('/device/add');
	 //  }else{
    	// this.device.addNew();
    // }
    let parameter = {
      planId:"12",
      startTime: "2018-03-24 03:52:37",
      endTime:"2018-04-24 19:52:37"
    }
    Ipcplan.getVideoEventList(parameter).then((result) => {
      console.log("======================= 获取到的数据是："+result);
    }).catch((err) => {
      console.log("======================= 获取到的数据是："+err);
    });
  }

  goToDeviceDetail(deviceInfo){
		// if(process.env.NODE_ENV === 'development'){
		// 	localStorage.DeviceInfo = JSON.stringify(deviceInfo);
	 //    this.props.history.push('/device/lamp/control');
	 //  }else{
	 //    this.device.deviceDetail({deviceId: deviceInfo.deviceId});
	 //  }

    localStorage.DeviceInfo = JSON.stringify(deviceInfo);
    this.props.history.push('/device/lamp/control');
  }

  fetchList(){
    const data = {
      deviceType: '',
      properties: [],
      pageSize: 100,
      offset: 0
    };

    // const timer = setTimeout(() => {
    //   this.fetchList();
    // }, 1000 * 1);

    return this.communicator.send({"service":"DataBase","action":"querySQL", "data":{"sql":'SELECT value FROM tb_lds_cache WHERE name="devices"'}}).then(res => {
      const result = res.data;
      let devices = result[0] && result[0].value ? JSON.parse(result[0].value) : [];
      devices = devices.map(item => {
        item = {...item};
        item.isOnline = item.onlinestatus === 'connected' || item.isLocalOnline;
        item.deviceName = Base64.decode(item.deviceName);
        return item;
      });


      // clearTimeout(timer);

      localStorage.setItem('deviceList', JSON.stringify(devices));
      console.log('deviceList');
      if(!devices.length){
        this.setState({empty: true});
      } else {
        this.setState({
          devices: devices,
          empty: false
        });
      }
    }).catch(e => {});
  }

  updateCache(){
    // let callback = () => {
    //   this.props.cacheUpdatingDone();
    //   this.fetchList();
    //   this.setState({refreshing: false});
    // }
    // return this.device.updateDeviceCache().then(callback);

    const data = {
      deviceType: '',
      properties: [],
      pageSize: 100,
      offset: 0
    };

    // const timer = setTimeout(() => {
    //   this.fetchList();
    // }, 1000 * 1);

    return this.device.queryDeviceList(data).then(res => {
      this.communicator.send({"service":"DataBase","action":"executeSQL", "data":{"sql": "DELETE FROM tb_lds_cache WHERE name='devices'"}});
      this.communicator.send({"service":"DataBase","action":"executeSQL", "data":{"sql":`INSERT INTO tb_lds_cache(name, value) VALUES('devices','${JSON.stringify(res.MSG_BODY.devices)}')`}});
      this.fetchList();
      this.setState({refreshing: false});
    });
  }

  componentDidMount(){
    this.updateCache().catch(err => {
      if(Number(err.CODE) === -1001){
        this.device.onceMQTTConnected(res => {
          this.updateCache().catch(e => {});
        });
      } else {
        this.props.cacheUpdatingDone();
      }
      
    });


    this.device.onUpdateDeviceState(res => {
      res = {
        ...res,
        isOnline: res.isCloudOnline || res.isLocalOnline,
        deviceName: Base64.decode(res.deviceName)
      };

      this.setState({
        devices: this.state.devices.map((item)=>{
          if(item.deviceId == res.deviceId){
            return res;
          }

          return item;
        })
      });
    });

    if(localStorage.DeviceInfo){
      const deviceInfo = JSON.parse(localStorage.DeviceInfo);
      this.setState({
        devices: this.state.devices.map(item => (item.deviceId == deviceInfo.deviceId ? deviceInfo : item))
      });
      localStorage.DeviceInfo = '';
    }



    // this.device.onAddNewDeviceToList(item => {
    //   this.setState({'devices': this.state.devices.concat(item)});
    // })

  }

  handleRefresh(){
    this.setState({refreshing: true});
    this.fetchList().then(res => {
      this.setState({refreshing: false});
    })
    // .catch(e => {
    //   this.setState({refreshing: false});
    // });
    // this.device.queryDeviceList(data).then(res => {
    //   this.setState({refreshing: false});
    // });
    // this.updateCache().catch(e => {
    //   this.setState({refreshing: false});
    // });
  }
  
  render() {
    let switchState = true;
    let uuid = 0;
    let row = dataDetail => (
        <ListItem
          key={dataDetail.deviceId}
          dataDetail={dataDetail}
          handleDel={this.handleDel}
          handleOnOff={this.handleOnOff}
          goToDeviceDetail={this.goToDeviceDetail}></ListItem>
    );
    let dataSource = ds.cloneWithRows(this.state.devices);

    return (
      <div className="device">
        <div className="main">
          <BarTitle onAdd={this.handleAdd} title={deviceLang.title} />
          <p className="link-switch">
          <Link to="/user/modify">修改个人信息</Link>
        </p>
          {!this.state.empty ? 
           <ListView
            style={{height: "calc(100vh - 4.08rem - 64px)"}}
            useBodyScroll={false}
            dataSource={dataSource}
            renderRow={row} 
            renderHeader={()=>(
              <div>
                {/*<p className="tip">{deviceLang.createGroupTip}</p>
                <h2 className="sub-title">{deviceLang.subTitle}</h2>*/}
              </div>
            )}
            pullToRefresh={
              <PullToRefresh
                distanceToRefresh={35}
                indicator={this.state.down ? {} : { deactivate: Lang.refresh.pull, finish: Lang.refresh.finish,activate: Lang.refresh.activate}}
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}
                />}
            />
            :
            <div>
              <div className="empty">
                <h2 className="empty-title">{deviceLang.noDevice}</h2>
                <p className="empty-desc">{deviceLang.noDeviceTip}</p>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    cacheUpdated: state.device.cacheUpdated
  }
}

const mapDispatchToProps = dispatch => {
  return {
    cacheUpdatingDone: () => {
      dispatch(devicesUpdatingDone());
    },

    showDialog: (title, tip, btns) => {
      dispatch(showDialog(title, tip, btns))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceList)