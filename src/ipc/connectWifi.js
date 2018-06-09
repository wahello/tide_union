import React, { Component } from 'react';
import './default/style.css';
import { Lang } from '../public/resource';
import BarTitle from '../component/barTitle';
import { connect } from 'react-redux';
import CircularProgress from '../component/circularProgress';
import Device from '../jssdk/device';
import Cookies from 'universal-cookie';
import SystemApi from '../jssdk/system';
import { bindActionCreators } from 'redux';
import {saveWifiSetting} from '../action/ipc';

const delayTime = 100;
const Progress_bar = 1 / delayTime;
let countDownTimer;
let ssid;
let pwd;
let secret;
let deviceIp;
class ConnectWifi extends Component {
    constructor (props){
        super (props);
        console.log("%%%%%%%%ConnectWifi---"+this.props.wifi.ssid+"-"+this.props.wifi.passWord+"-"+this.props.wifi.ip+"-"+this.props.wifi.deviceId);
        ssid = this.props.wifi.ssid;
        secret=this.props.wifi.secret;
        deviceIp=this.props.wifi.ip;
        pwd=this.props.wifi.passWord;
        this.state = {
            progress: Progress_bar,
            time:0,
            pointR:4,
            name:"",
            devId:"",
            type:'',
            ip:"ip",
            model:""
        },
        this.handleClickBack = this.handleClickBack.bind(this);
        this.device = new Device;
        this.cookies = new Cookies;
        this.systemApi = new SystemApi;
    };

    componentDidMount(){
        console.log("id:"+ this.state.devId.devId +" " + "name:" + this.state.name.name + " " +'type:'+ this.state.type.type +" ip: " + this.state.ip.ip);
        let countDownTimer = setInterval(()=>{
            var _num = this.state.progress;
            var _time = this.state.time;
            _num+=Progress_bar;
            _time++;
            this.setState({
                progress: _num,
                time:_time
            },()=>{
                if(_time === delayTime){
                    clearInterval(countDownTimer);
                    let data = {
                        error:{
                            code:"-2",
                            desc:'request timeout'
                        }
                    };
                    let path = {
                        ///ipc/ipcAddFail
                        pathname: '/ipc/ipcAddFail',
                        query: data
                    }
                    this.props.history.push(path);
                }
            })
        },1000)
        this.device.setWifiReq({
          ip:deviceIp,
          port:"6667",
          payload:{
            ssid:ssid,
            password:pwd,
            secret:"WPA2",
            timestamp: "2018-03-14 17:30:00",     
        },
        time:20000,
        retryTimes:0
      }).then((res) => {
        console.log("setWifiReq suc");
      }).catch(res => {
        console.log("setWifiReq fail");
      });
    }

    handleClickBack(event){
      this.props.history.goBack();
    };

    goConnect(e){
        const target = e.target;
        console.log(e.target.innerHTML)
        this.props.history.push('/gateway/connect')
    };

    componentWillReceiveProps(nextProps){
        console.log("==========================");
        const { devBindNotif } = nextProps;
        if(devBindNotif !== null && devBindNotif !== this.props.devBindNotif) {
            if(devBindNotif.payload.devId === this.props.wifi.deviceId) {
               if (devBindNotif.ack.code == 200) {
                let path = {
                    pathname: '/ipc/addRoom',
                    query: this.props.location.query,
                }
                this.props.history.push(path);
                clearInterval(countDownTimer);
                return;
               }else{
                   console.log("网关绑定失败"+devBindNotif.ack.code);
                    let data = {
                        error:devBindNotif.ack
                    };
                    let path = {
                        //被其他账户绑定 ipc/wifiFail ipc/ipcAddFail
                        pathname:'/ipc/ipcAddFail',
                        query: data
                    }
                    this.props.history.push(path);
                    clearInterval(countDownTimer);
               }                
            }
        } 
    }

    render(){
        return(
            <div className='foudWifi adding'>
                <BarTitle onBack={this.handleClickBack} title= {Lang.ipc.ipcConnectWifi.title}/>
                <div className="adding_main">
                    <div className='wifi_list add_load'>
                        <span className="load_time"></span>
                        <CircularProgress r={95} progress={this.state.progress} pointR={this.state.pointR} className="time_clock"/>
                    </div>
                    <p className='wifi_search'>{Lang.ipc.ipcConnectWifi.tips[0]}</p>
                    <p className='wifi_search_text'>{Lang.ipc.ipcConnectWifi.tips[1]}</p>
                </div>
            </div>
        )
    }
}

  
const mapStateToProps = (state, ownProps) => {
	return {
    devBindNotif: state.device.devBindNotif,
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
export default connect(mapStateToProps, mapDispatchToProps)(ConnectWifi)