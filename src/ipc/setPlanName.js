import React, { Component } from 'react';
import './default/style.css';
import { Lang } from '../public/resource';
import BarTitle from '../component/barTitle';
import { connect } from 'react-redux';
import SystemApi from '../jssdk/system';
import { bindActionCreators } from 'redux';
import { Toast } from 'antd-mobile';
import Cookies from 'universal-cookie';
import Device from '../jssdk/device';
// import { saveCamerName } from '../action/ipc';
import IpcPlanAPi from '../jssdk/ipcplan';
import { stringify } from 'querystring';
import { showDialog } from '../action';
// const testName = /^[0-9_a-zA-Z]+$/
const testName = /^[a-zA-Z0-9_\u4e00-\u9fa5\" "]{2,30}$/
class SetPlanName extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cameraName:this.props.location.query.planName,
            isShow:false,
            isChange:false
        };
        this.systemApi = new SystemApi;
        this.device = new Device();
        this.handleClickBack = this.handleClickBack.bind(this);
        this.setCameraName = this.setCameraName.bind(this);
        this.inputOnblur = this.inputOnblur.bind(this);
        this.rmText = this.rmText.bind(this);
        this.onSave = this.onSave.bind(this);
        this.isRequest = this.isRequest.bind(this);
        this.getNameLength = this.getNameLength.bind(this);
    };

    handleClickBack(event){
        let that = this;
        const { isChange } = this.state;
        if(isChange){
          this.props.showDialog( Lang.ipc.setName.change[0], Lang.ipc.setName.change[1], [{
            text: Lang.public.dialog.button[0],
            handleClick: function() {
              this.hide();
              that.props.history.goBack();
            }
          }, {
            text: Lang.public.dialog.button[1],
            handleClick: function() {
              let self  = this;
              this.hide()
              that.isRequest()
            }
          }]);
        }else {
          this.props.history.goBack();
        }
    };
    onSave(){
        const { isChange } = this.state;
        if(isChange){
          this.isRequest()
        }else {
          this.props.history.goBack();
        }
    };
    
    getNameLength(str){
      return str.replace(/[\u0391-\uFFE5]/g,"aa").length;  //先把中文替换成两个字节的英文，在计算长度
    }

    isRequest(){
        const { cameraName, isChange } = this.state;
        let reg = /\s{2,}/g
        let newName = cameraName;
        let oldName = this.props.current_name;
        const { device, actions } = this.props;
        const cookies = new Cookies();
        if (!cameraName) {
            Toast.info(Lang.ipc.setName.tips[0],2);
            return false;
        }
        if (this.getNameLength( cameraName ) > 30) {
            Toast.info(Lang.ipc.setName.tips[4],2);
            return false;
        }
        this.getNameLength( cameraName )
        if(!testName.test(cameraName)){
          Toast.info(Lang.ipc.setName.tips[2],2);
          return false;
        }
        if(isChange === false){
          this.props.history.goBack();
        }else if(isChange && newName === oldName){
          Toast.info(Lang.ipc.setName.tips[3],2);
          return false;
        }else{
          Toast.loading(Lang.public.loading);
          var par = {
              planId: this.props.location.query.planId,
              planName:cameraName
          };
          
          IpcPlanAPi.updatePlanName( par ).then(res => {
              Toast.hide();
            //   console.log("=================res",res);
              if (res.code && (res.code -0) === 200) {
                this.props.history.goBack();
              } else {
                const msg = res.code ? res.code : '';
                Toast.info(msg || Lang.device.dialog.tip[3]);
              }
      }).catch((res) => {
          Toast.info(res && res.code ? res.code : Lang.device.dialog.tip[3]);
        });
        }
    }
    componentDidMount(){
        this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
    }

    setCameraName(e){
        let target = e.target;
        this.setState({
            cameraName:target.value,
            isShow:true,
            isChange:true
        })
    }

    inputOnblur() { // input 失去焦点事件
        setTimeout(() => {
          this.setState({
            isShow: false,
          });
        }, 100);
    }

    rmText(){
        this.setState({
            cameraName:""
        })
    }

    render (){
        return (
            <div className="setName">
                <BarTitle onBack={this.handleClickBack} title={Lang.ipc.setName.title} onDone = { this.onSave }/>
                <div className='camera_main'>
                    <h2 className="set_name_title">{Lang.ipc.setName.text}</h2>
                    <div className="setName_set">
                        <input type="text" name="cameraName" maxLength="30"
                            className="set_name" 
                            onChange={ e => this.setCameraName(e) }
                            onBlur={ this.inputOnblur }
                            value={ this.state.cameraName }
                        />
                        <i className="rem_icon" style={{display:(this.state.isShow ? 'block' : 'none')}} onClick={ this.rmText }></i>
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state, ownProps) => {
    // const currentDevId = ownProps.match.params.devId;
    const devId = (state.device.fromPage === 'list' || state.device.recordAttr.devId === '') ? state.device.deviceItem.devId : state.device.recordAttr.devId;
    return {
        devId : devId,
        parentId : devId,
        // getCameraName: state.ipc.cameraName,
        current_name:state.device.deviceItem.name,
    };
  };
  
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {},
        dispatch ),
        showDialog: (...args) => dispatch(showDialog(...args)),
});
export default connect(mapStateToProps,mapDispatchToProps)(SetPlanName)