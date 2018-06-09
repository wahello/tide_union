import React, { Component } from 'react';
import './default/style.css';
import { Lang } from '../public/resource';
import BarTitle from '../component/barTitle';
import { connect } from 'react-redux';
import CircularProgress from '../component/circularProgress';
import Device from '../jssdk/device';
import Cookies from 'universal-cookie';
import SystemApi from '../jssdk/system';
import MQTTService from '../jssdk/MQTTService';

const delayTime = 10;
const Progress_bar = 1 / delayTime;
let countDownTimer;
class IpcCountDown extends Component {
    constructor (props){
        super (props);
        // debugger;
        // let name = this.props.location.query.name;
        // let devId = this.props.location.query.devId;
        // let type = this.props.location.query.type;
        // let ip = this.props.location.query.ip;
        // var model = this.props.location.query.model;
        this.state = {
            progress: 0,
            pointR:4,
            devId:"",
            type:0,
            ip:"ip",
        },
        this.handleClickBack = this.handleClickBack.bind(this);
        this.handleUpdateFunc =  this.handleUpdateFunc.bind(this);
        this.device = new Device;
        this.cookies = new Cookies;
        this.systemApi = new SystemApi;
    };

    componentDidMount(){
        MQTTService.offMessageReceive().onMessageReceive(res => {
            try{
                var data = JSON.parse(res.message).payload
            }catch(e){
                var data = JSON.parse(res.message)
            }
            this.handleUpdateFunc(data)
		})
    }

    handleUpdateFunc(data){
        switch(data.stage){
            case 1: 
                this.setState({progress:data.percent});
                break;
            case 2: 
            case 3:
            case 4:
                this.setState({type:1});
                break;
            case 5: this.props.history.push({pathname:'/ipc/updateSuccess',query:{version:data.version}});
                break;
            case 6: this.props.history.push({pathname:'/ipc/updateFail',query:{version:data.version}});
                break;
        }
        (data.stage === 1) &&  this.setState({progress:data.percent})
        if(data.percent === 100) {
            // 转入安装阶段
            // this.setState({type:1})
            // var path = {
            //     pathname:'/ipc/updateSuccess',
            //     query:{version:data.version}
            // }
        }
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
        // const { devBindNotif } = nextProps;
        // if(devBindNotif !== null && devBindNotif !== this.props.devBindNotif) {
        //     if(devBindNotif.payload.devId === this.props.location.query.devId) {
        //        if (devBindNotif.ack.code == 200) {
        //         let path = {
        //             pathname: '/gateway/addSuccess',
        //             query: this.props.location.query,
        //         }
        //         this.props.history.push(path);
        //         clearInterval(countDownTimer);
                
        //         return;
        //        }else{
        //            console.log("网关绑定失败"+devBindNotif.ack.code);
        //             let data = {
        //                 error:devBindNotif.ack,
        //                 devType: 'IPC'
        //             };
        //             let path = {
        //                 pathname: '/gateway/failAdd',
        //                 query: data
        //             }
        //             this.props.history.push(path);
        //             clearInterval(countDownTimer);
        //        }                
        //     }
        // } 
    }

    render(){
        return(
            <div className='foudWifi adding'>
                <BarTitle onBack={this.handleClickBack} title= {Lang.ipc.ipcCountDown.title}/>
                <div className="adding_main">
                    <div className='wifi_list add_load'>
                        <span className="load_time">{this.state.progress}%</span>
                        <CircularProgress r={95} progress={this.state.progress/100} pointR={this.state.pointR} className="time_clock"/>
                    </div>
                    {
                        this.state.type ?　<div><p className='wifi_search'>{Lang.ipc.ipcCountDown.tips[2]}</p>
                        <p className='wifi_search_text'>{Lang.ipc.ipcCountDown.tips[3]}</p></div>:
                        <div><p className='wifi_search'>{Lang.ipc.ipcCountDown.tips[0]}</p>
                        <p className='wifi_search_text'>{Lang.ipc.ipcCountDown.tips[1]}</p></div>　 
                    }
                  
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
	return {
		devBindNotif: state.device.devBindNotif
	}
  };
  
const mapDispatchToProps = (dispatch) => {
	return {
	}
};
export default connect(mapStateToProps, mapDispatchToProps)(IpcCountDown)