import React,{ Component } from 'react';
import './default/style.css';
import { Lang } from '../public/resource';
import BarTitle from '../component/barTitle';
import { connect } from 'react-redux';
import SystemApi from '../jssdk/system';
import { bindActionCreators } from 'redux';
// import Device from '../jssdk/device';
// import { saveAngle } from '../action/ipc';
import { setDeviceAttr } from '../action/device';
import { Toast } from 'antd-mobile';
import Cookies from 'universal-cookie';
let Angle = 0;
const cookies = new Cookies();
class PictureRotation extends Component {
    constructor(props) {
        super(props);
        this.state = {
          angleNum:this.getAngleNum()
        }
        this.systemApi = new SystemApi;
        // this.device = new Device;
        this.handleClickBack = this.handleClickBack.bind(this);
        this.selectAngle = this.selectAngle.bind(this);
        this.getAngleNum = this.getAngleNum.bind(this);
    };

    handleClickBack(event){
      // debugger;
      const { angleNum, num_ } = this.state;
      Toast.loading(Lang.public.loading);
      let postAngle = '';
      if(num_ == "0"){
          postAngle = '0'
      }else{
          postAngle = angleNum
      }
      // this.device.setDevAttrReq({
      //   parentId: this.props.devId,
      //   payload:{
      //     devId:this.props.devId,
      //     password:'cF5nhhYgOqLi',
      //     userId: cookies.get('userId'),
      //   attr:{
      //         VideoAngle:postAngle
      //     }
      //   }
      // }).then(res => {
      //   Toast.hide();
      //   if (res.ack.code == 200 ) {
      //     this.props.actions.saveAngle(angleNum)
      //     this.props.history.goBack();
      //   }
      // }).catch(res => {
      //   Toast.info(Lang.device.dialog.tip[3]);
      // });

      const { actions } = this.props;
      const options = {
        parentId:this.props.devId,
        payload: {
          devId: this.props.devId,
          userId: cookies.get('userId'),
          password:this.props.password,
          attr: {
            VideoAngle:postAngle
          },
        },
      };
      actions.setDeviceAttr(options).then(() => {
        Toast.hide();
        // this.props.actions.saveAngle(angleNum)
        this.props.history.goBack();
      });
    };

    componentDidMount(){
      this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
    }

    selectAngle(index,item){
      Angle = index;
      this.setState({
        angleNum:item,
        num_:index
      })
      console.log(item)
    }

    getAngleNum(){
        // debugger;
        let angle_ = Lang.ipc.pictureRotation;
        let currAngle = this.props.get_angle;
        let renAngle = '';
        if( currAngle == '0' || currAngle == undefined ){
          renAngle = angle_.rotation[0];
        }else if( currAngle == '90' || currAngle == '90°'){
          renAngle = angle_.rotation[1]
        } else if( currAngle == '180' || currAngle == '180°'){
          renAngle = angle_.rotation[2]
        }else{
          renAngle = angle_.rotation[3]
        }
        return renAngle
    }
    render (){
        let angle = Lang.ipc.pictureRotation.rotation;
        let angleList = angle.map((item,index) =>
          <li className='rotation_lsit' key={index}>
              <span className="rotation_text">{item}</span>
              <i className={ this.state.angleNum === item ? "check_rotation check_rotation_true" : "check_rotation check_rotation_false" } onClick={ this.selectAngle.bind(this,index,item)}></i>
          </li>
        )
        return (
            <div className='PictureRotation'>
                <BarTitle onBack={this.handleClickBack} title={Lang.ipc.pictureRotation.title} />
                <div className='rotation_main'>
                    <ul>
                        { angleList }
                    </ul>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state, ownProps) => {
    // const devId = '896a7cb56c3e41dcac48a0f457783314';
    const devId = (state.device.fromPage === 'list' || state.device.recordAttr.devId === '') ? state.device.deviceItem.devId : state.device.recordAttr.devId;
    return {
        devId : devId,
        // get_angle: state.ipc.getAngle,
        get_angle:state.device.items[devId].attr.VideoAngle,
        password:state.device.items[devId].password
    };
  };
  
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
          // saveAngle,
          setDeviceAttr
        },
        dispatch )
});
export default connect(mapStateToProps,mapDispatchToProps)(PictureRotation)