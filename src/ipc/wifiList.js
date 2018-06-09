import React,{ Component } from 'react';
import './default/style.css';
import { Lang } from '../public/resource';
import NavigationBar from '../component/NavigationBar';
import { connect } from 'react-redux';
import SystemApi from '../jssdk/system';
import { ListView } from 'antd-mobile';
import Device from '../jssdk/device';
import Cookies from 'universal-cookie';
import { Toast } from 'antd-mobile';
import { bindActionCreators } from 'redux';
import {saveWifiSetting} from '../action/ipc';

function MyBody(props) {
    return (
      <div className="am-list-body">
      </div>
    );
  }

  const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
});
let deviceIp;
let deviceId;
class WiFiList extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            lists:[]
        }
        this.systemApi = new SystemApi;
        this.device=new Device();
        this.cookies=new Cookies();
        this.handleClickBack = this.handleClickBack.bind(this);
        this.itemClick=this.itemClick.bind(this);
        this.footerClick=this.footerClick.bind(this);
        this.getWiFiList=this.getWiFiList.bind(this);
    };
    handleClickBack(event){
        this.props.history.goBack();
    };
    componentDidMount(){
        this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
        this.getWiFiList();
    }
    componentWillUnmount(){
        Toast.hide();
    }
    itemClick(item){
        console.log("itemClick:"+item.ssid+"---"+item.ip);
        
        item['deviceId'] = deviceId;
        this.props.actions.saveWifiSetting(item)
        console.log("-------"+this.props.wifi.ssid+"---"+this.props.wifi.ip+"-"+this.props.wifi.deviceId);
        // this.props.wifi  ==== item
        let path = {
            pathname: "/ipc/setWiFi",
            query: item
        }
        this.props.history.push(path);
    }
    footerClick(){
        // console.log("footerClick");
       let a= { ssid: '', secret: '', rssi: '',ip:deviceIp,deviceId:deviceId};
       this.props.actions.saveWifiSetting(a)
       let path = {
        pathname: "/ipc/setWiFi",
        query: a
    }
    this.props.history.push(path);
    }
    getWiFiList(){
        var dataList=[];
        var that = this;
        Toast.loading(Lang.public.loading,0);
        that.device.devDiscoveryReq({
			ip: "255.255.255.255",
			port: "6666",
			payload: {
				timestamp: "2018-03-14 17:30:00",
            },
            time:5000,
            retryTimes:0
		}).then(res => {
            console.log("------devDiscoveryReq:"+res.payload.devId+"-"+res.payload.ip+"-"+res.payload.mac+"-"+res.payload.model);
            deviceIp=res.payload.ip;
            deviceId=res.payload.devId;
            that.device.setBindInfoReq({
                ip:res.payload.ip,
                port:"6667",
                payload:{
                    timeZone:"Beijing GMT+08:00",
                    userId:that.cookies.get('userId'),
                    timestamp: "2018-03-14 17:30:00",     
                },
                time:5000,
                retryTimes:0
            }).then((res) => {
                console.log("setBindInfoReq=======");
                that.device.wifiListReq({
                    ip:deviceIp,
                    port:"6667",
                    payload:{
                        timestamp: "2018-03-14 17:30:00"    
                    },
                    time:21000,
                    retryTimes:0
                }).then((res) => {
                    Toast.hide();
                    console.log("wifiListReq=======suc");
                    //{"ssid":"1234","secret":"WPA2","rssi":100}
                    res.payload.wifiList.map((item, index) => {
                        let hasArrs = dataList.filter((d) => {
                            return d.ssid === item.ssid
                        });
                        if (!hasArrs.length) {
                            dataList.push({ ssid: item.ssid, secret: item.secret, rssi: item.rssi,ip:deviceIp});
                        }  
                    });
                    console.log("dataList length:"+dataList.length);
                    that.setState({
                        lists: dataList
                    });
                    
                }).catch(res => {
                    Toast.info("get wifi Fail!");
                    console.log("wifiListReq Fail===============");
                });
            }).catch(res => {
                Toast.info("get wifi Fail!");
                console.log("setBindInfoReq Fail==================");
            });
            
            
		}).catch(res => {
            Toast.info("get wifi Fail!");
            console.log("devDiscoveryReq Fail==================");
		});
    }
    
    render (){
        const dataSource = ds.cloneWithRows(this.state.lists);

        const row= (item, sid, rid) => {
			return <div key={rid} className='listview-item' onClick={()=> this.itemClick(item)}>
                <div className='item-text'>{item.ssid}</div>
                <div className='item-imginfo'></div>
                <div className='item-imgwifi'></div>
                <div className='item-imglock'></div>
            </div>};
        return (
            <div className='wifiList'>
                <NavigationBar onBack={this.handleClickBack} title={Lang.ipc.wifiList.title} />
                <p className='little-title'>{Lang.ipc.wifiList.tipTitle}</p>
                <p className='power-tip'>{Lang.ipc.wifiList.tips}</p>
                <ListView
                key="1"
                style={{height: "calc(100vh - 15rem - 64px)",background: '#4E5367',margin: '0 auto',width: '87.2%',borderRadius: '8px'}}
                useBodyScroll={false}
                dataSource={dataSource} 
                renderFooter={() => (<div className='item-footer' onClick={()=> this.footerClick()}>{Lang.ipc.wifiList.other}</div>)}
                renderRow={row}
                />
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
	return {
		wifi:state.ipc.wifi
	}
}

const mapDispatchToProps = dispatch => {
	return {
		actions: bindActionCreators({
            saveWifiSetting
		}, dispatch),
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(WiFiList)