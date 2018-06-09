import React, { Component } from 'react';
import './default/style.css';
import { Lang } from '../public/resource';
import BarTitle from '../component/barTitle';
import { connect } from 'react-redux';
import CircularProgress from '../component/circularProgress';
import Device from '../jssdk/device';
import Cookies from 'universal-cookie';
import SystemApi from '../jssdk/system';

const delayTime = 120;
const Progress_bar = 1 / delayTime;
let countDownTimer;
class Adding extends Component {
    constructor (props){
        super (props);
        // debugger;
        let name = this.props.location.query.name;
        let devId = this.props.location.query.devId;
        let type = this.props.location.query.type;
        let ip = this.props.location.query.ip;
        var model = this.props.location.query.model;
        this.state = {
            progress: Progress_bar,
            time:0,
            pointR:4,
            name:name,
            devId:devId,
            type:type,
            ip:ip,
            model:model
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
                            desc:'request timeout',
                            devType: 'gateway'
                        }
                    };
                    let path = {
                        pathname: '/gateway/failAdd',
                        query: data
                    }
                    this.props.history.push(path);
                    // this.props.history.push('/gateway/failAdd');
                }
            })
        },1000);
        
        //获取timezone
        let gmtHours = new Date().getTimezoneOffset() / 60;
			
				let timeZone = "GMT";
				if(gmtHours < 0){
					timeZone = timeZone+"+" + Math.abs(Number(gmtHours));
				} else if(gmtHours > 0){
					timeZone = timeZone+"-" + Math.abs(Number(gmtHours));
				}
				
        this.device.setBindInfoReq({
            ip:this.state.ip,
            port:"6667",
            payload:{
                timeZone:timeZone,
                userId:this.cookies.get('userId'),
                timestamp: "2018-03-14 17:30:00",     
            }
        },5000).then((res) => {
            // debugger;
        })/*.catch(res=>{
            // console.log('devDiscoveryReq===='+res.CODE);
            console.log("失败!!!!" + res.CODE);
            this.props.history.push('/gateway/failAdd');
        })*/;
        

        console.log("绑定信息发送"+this.state.name+"--"+this.state.devId);

        // this.device.addDevReq({
        //     devId:"000010000000136h70z2382vj",
        //     payload:{ 
        //     networkType:"zigbee",
        //     devType:"Light"   
        //     }
            
        // }).then(res=>{
        //     console.log("device.addDevReq"+"==="+JSON.stringify(res));
        // }).catch(res=>{
        //     console.log('addDevReq===='+res.CODE);
        // });
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
        const { devBindNotif } = nextProps;
        if(devBindNotif !== null && devBindNotif !== this.props.devBindNotif) {
            if(devBindNotif.payload.devId === this.props.location.query.devId) {
               if (devBindNotif.ack.code == 200) {
                let path = {
                    pathname: '/gateway/addSuccess',
                    query: this.props.location.query,
                }
                this.props.history.push(path);
                clearInterval(countDownTimer);
                
                return;
               }else{
                   console.log("网关绑定失败"+devBindNotif.ack.code);
                    let data = {
                        error:devBindNotif.ack,
                        devType: 'gateway'
                    };
                    let path = {
                        pathname: '/gateway/failAdd',
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
                <BarTitle onBack={this.handleClickBack} title={Lang.gateway.title}/>
                <div className="adding_main">
                    <div className='wifi_list add_load'>
                        <span className="load_time">{this.state.time}s</span>
                        <CircularProgress r={95} progress={this.state.progress} pointR={this.state.pointR} className="time_clock"/>
                    </div>
                    <p className='wifi_search'>{Lang.gateway.adding.load[0]}</p>
                    <p className='wifi_search_text'>{Lang.gateway.adding.load[1]}</p>
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
export default connect(mapStateToProps, mapDispatchToProps)(Adding)