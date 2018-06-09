import React,{ Component } from 'react';
import './default/style.css';
import { Lang } from '../public/resource';
import BarTitle from '../component/barTitle';
import { connect } from 'react-redux';
import SystemApi from '../jssdk/system';
import { bindActionCreators } from 'redux';
import { Toast } from 'antd-mobile';
import Cookies from 'universal-cookie';
import Device from '../jssdk/device';
import { saveMotionValue } from '../action/ipc';
import { setDeviceName } from '../action/device';
const classItem = [
  { parentClass:'picture_item',itemClass:'camera3'},
  { parentClass:'picture_item',itemClass:'camera'},
  { parentClass:'picture_item',itemClass:'camera2'}
]

class DetectionSensitivity extends Component {
    constructor(props) {
      super(props);
      this.state = {
        iconName:this.props.showPictrue
      }
      this.systemApi = new SystemApi;
      this.device = new Device;
      this.handleClickBack = this.handleClickBack.bind(this);
      this.selectPicture = this.selectPicture.bind(this);
    };

    handleClickBack(event){
      const { iconName } = this.state;
      const cookies = new Cookies();
      const { actions } = this.props
      if(iconName == this.props.showPictrue){
        this.props.history.goBack();
      }else{
        Toast.loading(Lang.public.loading);
        const options = {
          parentId: this.props.parentId,
          payload: {
            devId: this.props.devId,
            userId: cookies.get('userId'),
            icon: this.state.iconName,
            password: this.props.password,
            roomId: this.props.roomId,
            homeId: this.props.homeId,
            name:this.props.devName,
            roomName:this.props.roomName
          }
        }
        actions.setDeviceName(options).then(() => {
          Toast.hide();
          this.props.history.goBack();
        });
      }
    };

    componentDidMount(){
      this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
    }

    selectPicture(item){
      this.setState({
        iconName:item.itemClass
      })
    }
    
    render (){
      let cameraList = classItem.map((item, index) =>
        <span className={this.state.iconName == item.itemClass ? item.parentClass + ' item_cheched' : item.parentClass } style={{marginRight:"1.4rem"}} key={ index } onClick={ this.selectPicture.bind(this,item) }>
          <i className={ item.itemClass }></i>
        </span>
      )
        return (
          <div className='change_picture'>
              <BarTitle onBack={this.handleClickBack} title={Lang.ipc.changePicture.title} />
              <div className='picture_main'>
                <div className='select_p'>
                  { cameraList }
                </div>
              </div>
          </div>
        )
    }
}
const mapStateToProps = (state, ownProps) => {
    const devId = (state.device.fromPage === 'list' || state.device.recordAttr.devId === '') ? state.device.deviceItem.devId : state.device.recordAttr.devId;
    return {
        devId : devId,
        parentId:devId,
        showPictrue:state.device.items[devId].icon == 'default' ? 'camera' : state.device.items[devId].icon,
        devName:state.device.items[devId].name,
        password:state.device.items[devId].password,
        roomId:state.device.items[devId].roomId,
        homeId:state.device.items[devId].homeId,
        roomName:state.device.items[devId].roomName
    };
  };
  
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
          setDeviceName
        },
        dispatch )
});
export default connect(mapStateToProps,mapDispatchToProps)(DetectionSensitivity)