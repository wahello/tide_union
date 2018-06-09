import React,{ Component } from 'react';
import './default/style.css';
import { Lang } from '../public/resource';
import NavigationBar from '../component/NavigationBar';
import { connect } from 'react-redux';
import SystemApi from '../jssdk/system';
import ScrollView from '../component/scrollView';

class ConnectAPWiFi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ssid:''
        }
        this.systemApi = new SystemApi;
        this.handleClickBack = this.handleClickBack.bind(this);
        this.towifisetting=this.towifisetting.bind(this);
        this.nextPage=this.nextPage.bind(this);
    };

    towifisetting(){
        console.log("towifisetting");
        this.systemApi.gotoWiFiSetting();
     };
    nextPage(){
       console.log("next");
       this.props.history.push('/ipc/wifiList');
    };
    handleClickBack(event){
        this.props.history.goBack();
    };
    componentDidMount(){

        this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
        this.systemApi.getWiFiSSID().then(res=>{
            console.log("getWiFiSSID:"+res.ssid);
            this.setState({
                ssid:res.ssid
            });
        });
        this.systemApi.onAppStatusChange(res=>{
            console.log("onAppStatusChange--------------"+res.state);
            if(res.state==0){
                this.systemApi.getWiFiSSID().then(res=>{
                    console.log("getWiFiSSID:"+res.ssid);
                    this.setState({
                        ssid:res.ssid
                    });
                });
            }
        });
        
        this.systemApi.onNetworkStatusChange(res=>{
            console.log("----onNetworkStatusChange:"+res.state);
            this.systemApi.getWiFiSSID().then(res=>{
                console.log("2222222getWiFiSSID:"+res.ssid);
                this.setState({
                    ssid:res.ssid
                });
            });
        });
    }
    render (){
        let currentwifi=this.state.ssid;
        return (
            <div className='connectAPWiFi'>
                <NavigationBar onBack={this.handleClickBack} title={Lang.ipc.connectAPWiFi.title} />
                <ScrollView>
                <div className='tipImg'></div>
                <p className='tip'>{Lang.ipc.connectAPWiFi.tips}</p>
                <div  className='currentwifi'><p>{Lang.ipc.connectAPWiFi.currentwifi}{currentwifi}</p></div>
                <button onClick={()=> this.towifisetting()} className="wifi-setting">{Lang.ipc.connectAPWiFi.towifisetting}</button>
                <button onClick={()=> this.nextPage()} className="step-next">{Lang.ipc.connectAPWiFi.nextstep}</button>
                </ScrollView>
            </div>
        )
    }
}
export default connect()(ConnectAPWiFi)