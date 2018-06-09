import React,{ Component } from 'react';
import './default/style.css';
import { Lang } from '../public/resource';
import BarTitle from '../component/barTitle';
import { connect } from 'react-redux';
import SystemApi from '../jssdk/system';
import { bindActionCreators } from 'redux';
import { Toast } from 'antd-mobile';
import Cookies from 'universal-cookie';
// import Device from '../jssdk/device';
// import { saveMotionValue } from '../action/ipc';
import { setDeviceAttr } from '../action/device';
// let _NUM = 0;
class DetectionSensitivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            motionText:this.getMotionVal()
        }
        this.systemApi = new SystemApi;
        // this.device = new Device;
        this.handleClickBack = this.handleClickBack.bind(this);
        this.selectCurrent = this.selectCurrent.bind(this);
        this.getMotionVal = this.getMotionVal.bind(this);
    };

    handleClickBack(event){
        // this.props.history.goBack();
        const { motionText } = this.state;
        let postNum;
        if(motionText == Lang.ipc.detectionSensitivity.value[2]){
            postNum = 0
        }else if(motionText == Lang.ipc.detectionSensitivity.value[1]){
            postNum = 1
        }else if(motionText == Lang.ipc.detectionSensitivity.value[0]){
            postNum = 2
        }
        this.setState({
            posNum:postNum
        });
        const { posNum } = this.state;
        Toast.loading(Lang.public.loading);

        setTimeout(() =>{
          const cookies = new Cookies()
          const { posNum, motionText } = this.state;
          // this.device.setDevAttrReq({
          //     parentId: this.props.devId,
          //     payload:{
          //         devId:this.props.devId,
          //         userId: cookies.get('userId'),
          //         password:'PG268aeDLvPI',
          //     attr:{
          //           MotionDetection:posNum
          //       }
          //     }
          // }).then(res => {
          //     Toast.hide();
          //     if (res.ack.code == 200 ) {
          //         this.props.actions.saveMotionValue( motionText )
          //         this.props.history.goBack();
          //     } else {
          //         Toast.info(Lang.device.sirenVolume.dialog.tip[0]);
          //     }
          // }).catch(res => {
          //     Toast.info(Lang.device.dialog.tip[3]);
          // });

          const { actions } = this.props;
          const options = {
            parentId: this.props.devId,
            payload: {
              devId: this.props.devId,
              userId: cookies.get('userId'),
            // password:cookies.get("password"),
              password:this.props.password,
              attr: {
                MotionDetection:posNum
              },
            },
          };
          actions.setDeviceAttr(options).then(() => {
              Toast.hide();
              // this.props.actions.saveMotionValue( motionText )
              this.props.history.goBack();
          });

        },100)
    };

    componentDidMount(){
      this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
    }

    selectCurrent(index,item){
        // _NUM = index;
        this.setState({
          motionText:item
        })
        // console.log(item)
    }

    getMotionVal(){
        // let text = Lang.ipc.detectionSensitivity.value[2];
        // let currText = this.props.getMotionNum === '' ? text : this.props.getMotionNum;
        let currText = '';
        let get_Motion = this.props.getMotionNum
        console.log('get====num')
        console.log(get_Motion)
        if( get_Motion == '' || get_Motion == '0'){
          currText = Lang.ipc.detectionSensitivity.value[2]
        } else if( get_Motion == 1 ){
          currText = Lang.ipc.detectionSensitivity.value[1]
        }else{
          currText = Lang.ipc.detectionSensitivity.value[0]
        }
        return currText
    }

    render (){
        let _list = Lang.ipc.detectionSensitivity.value;
        let itemList = _list.map((item,index) =>
            <li className='rotation_lsit' key={index}>
                <span className="rotation_text">{ item }</span>
                <i className={ this.state.motionText === item ? "check_rotation check_rotation_true" : "check_rotation check_rotation_false"} onClick={ this.selectCurrent.bind(this,index,item)}></i>
            </li>
        )
        return (
            <div className='PictureRotation'>
                <BarTitle onBack={this.handleClickBack} title={Lang.ipc.detectionSensitivity.title} />
                <div className='rotation_main'>
                    <ul>
                      { itemList }
                    </ul>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state, ownProps) => {
    const devId = (state.device.fromPage === 'list' || state.device.recordAttr.devId === '') ? state.device.deviceItem.devId : state.device.recordAttr.devId;
    return {
        devId : devId,
        // getMotionNum: state.ipc.getMotionValue
        getMotionNum:state.device.items[devId].attr.MotionDetection,
        password:state.device.items[devId].password
    };
  };
  
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            // saveMotionValue,
            setDeviceAttr
        },
        dispatch )
});
export default connect(mapStateToProps,mapDispatchToProps)(DetectionSensitivity)