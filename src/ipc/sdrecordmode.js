import React,{ Component } from 'react';
import './default/style.css';
import { Lang } from '../public/resource';
import BarTitle from '../component/barTitle';
import { connect } from 'react-redux';
import SystemApi from '../jssdk/system';
import {changeSDCardMode} from "../action/ipc";
import {  Toast } from 'antd-mobile';
import Cookies from 'universal-cookie';
import ipcMqtt from '../jssdk/ipcMqtt';
const cookies = new Cookies()
class Sdrecordmode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode:this.props.SDRecordConfig.recordMethod === "event",
            hasMode:this.props.SDRecordConfig.recordMethod.length
        }
        this.systemApi = new SystemApi;
        this.handleSwitch = this.handleSwitch.bind(this);
        this.handleClickBack = this.handleClickBack.bind(this);
        // this.state.recordMethod.length?(this.state.recordMethod === "full"?Lang.ipc.sdstoremode.modefulltime:Lang.ipc.sdstoremode.modeevent):""
    };

    handleClickBack(event){
        let dev = this.props.currentDevice;
        Toast.loading("保存中...",60)
        ipcMqtt.setSDRecordConfig({
			userId:cookies.get('userId'),
			password:this.props.password,
			recordEnable:true,
			devId:dev.devId,
			recordMethod:this.props.SDRecordConfig.recordMethod ||　this.state.recordMethod,
		}).then(res=>{
            Toast.hide();
            this.props.history.goBack();
        })
    };
    handleSwitch(type){
        let mode = this.state.mode
        if(this.state.hasMode){
            if((type === 'event') === mode){
                this.setState({hasMode:false})
                this.props.SDRecordConfig.recordMethod = ''
            }else{
                this.setState({mode:!mode});
                this.props.SDRecordConfig.recordMethod=type
            }
        }else{
            this.setState({hasMode:true,mode:type === 'event'})
            this.props.SDRecordConfig.recordMethod=type
        }
        this.props.changeSDCardMode(this.props.SDRecordConfig)
    }
    componentDidMount(){
        this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
    }

    render (){
        return (
            <div className='DeviceLanguage'>
                <BarTitle onBack={this.handleClickBack} title={Lang.ipc.sdstoremode.title} />
                <div className='language_main'>
                    <div className='english'>
                        <span className="language_text">{Lang.ipc.sdstoremode.modefulltime}</span>
                        <i className={this.state.hasMode?(this.state.mode?"check_lang check_lang_false":"check_lang check_lang_true"):"check_lang check_lang_false"} onClick={this.handleSwitch.bind(this,'full')}></i>
                    </div>
                    <div className='chinese'>
                        <span className='language_text'>{Lang.ipc.sdstoremode.modeevent}</span>
                        <i className={this.state.hasMode?(this.state.mode?"check_lang check_lang_true":"check_lang check_lang_false"):"check_lang check_lang_false"} onClick={this.handleSwitch.bind(this,'event')}></i>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    var devId = state.device.deviceItem.devId
	return {
        SDRecordConfig:state.ipc.SDRecordConfig,
        currentDevice: state.device.deviceItem,
        password:state.device.items[devId].password
	}
};
const mapDispatchToProps = (dispatch) => {
	return {
        changeSDCardMode: (...args) => dispatch(changeSDCardMode(...args)),
	}
};
export default connect(mapStateToProps,mapDispatchToProps)(Sdrecordmode)