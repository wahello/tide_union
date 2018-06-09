import React,{ Component } from 'react';
import './default/style.css';
import { Lang } from '../public/resource';
import BarTitle from '../component/barTitle';
import { connect } from 'react-redux';
import SystemApi from '../jssdk/system';
import userApi from '../jssdk/User';
import ScrollView from '../component/scrollView';
import { showDialog } from '../action';
import { bindActionCreators } from 'redux';
import MQTTService, { TOPIC } from '../jssdk/MQTTService';
import MQTTBasic from '../jssdk/MQTTBasic';

const dialogLang = Lang.public.dialog;
class SelectApWiFi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ssid:'',
        }
      	this.mqttBasic = new MQTTBasic();
        this.systemApi = new SystemApi;
        this.towifisetting=this.towifisetting.bind(this);
    };

    towifisetting(){
        console.log("towifisetting");
        userApi.notifyOffline();

//				this.mqttBasic.disconnect({});
				
        this.systemApi.gotoWiFiSetting();
       
    };
    nextPage(){
//    console.log("next",this.props.onNext);
//     this.props.history.push(this.props.onNext);
    };
    componentDidMount(){
    	const {
				actions
			} = this.props;			
			
        this.systemApi.getWiFiSSID().then(res=>{
            console.log("getWiFiSSID:"+res.ssid);
            this.setState({
                ssid:res.ssid
            });
            
            this.props.onSSIDChange(res.ssid);
        });
        this.handleAppBecomeActive = res=>{
            console.log("onAppStatusChange--------------"+res.state);
            let that = this;
            if(res.state==0){
            		
                this.systemApi.getWiFiSSID().then(res=>{
                    console.log("getWiFiSSID:"+res.ssid);
                    console.log("LDS index = ",res.ssid.indexOf("LDS"));
                    this.setState({
                        ssid:res.ssid
                    });
                    
                    this.props.onSSIDChange(res.ssid);
                    //判断是否是Leedarson开头的设备
                    if(res.ssid != window.globalState.wifiAccount){
                    	this.props.onNext();
                    }else {                    	
                    	userApi.notifyOnline();
                    	actions.showDialog(`Please connect to the hub's wifi`,null, [{
												text: dialogLang.button[1],
												handleClick: function cancel() {
													this.hide();
													that.systemApi.gotoWiFiSetting();
												},
											}]);
											return;
                    }                                                          
                });
            }
        };
        this.systemApi.onAppStatusChange(this.handleAppBecomeActive);
        this.handleNetworkChange = (res) => {
            console.log("----onNetworkStatusChange:"+res.state);
            this.systemApi.getWiFiSSID().then(res=>{
                console.log("2222222getWiFiSSID:"+res.ssid);
                this.setState({
                    ssid:res.ssid
                });
                
                this.props.onSSIDChange(res.ssid);
            });
        };
        this.systemApi.onNetworkStatusChange(this.handleNetworkChange);
    }
    
    componentWillUnmount() {
    	this.systemApi.offAppStatusChange(this.handleAppBecomeActive);
    	this.systemApi.offNetworkStatusChange(this.handleNetworkChange);
    }
    
    render (){
        let currentwifi=this.state.ssid;
        return (
            <div className='selectApWiFi'>
                <BarTitle onBack={this.props.OnBack} title={this.props.title} />
                <ScrollView>
	                <div className='tipImg'></div>
	                <p className='tip'>{this.props.tips}</p>
	                <div className='currentwifi'><p>{Lang.ipc.connectAPWiFi.currentwifi}{currentwifi}</p></div>
	                <button onClick={()=> this.towifisetting()} className="wifi-setting">{Lang.ipc.connectAPWiFi.towifisetting}</button>
                </ScrollView>
            </div>
        )
    }
}
//将state绑定到props
const mapStateToProps = (state) => {
  return {
  }
};
//将action的所有方法绑定到props上
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
			showDialog,
		},
		dispatch,
	),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectApWiFi)