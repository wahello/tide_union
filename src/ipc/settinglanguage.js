import React, { Component } from 'react';
import './default/style.css';
import { Lang } from '../public/resource';
import BarTitle from '../component/barTitle';
import { connect } from 'react-redux';
import SystemApi from '../jssdk/system';
// import RcCalendar from './component/calendar_rc';
import { bindActionCreators } from 'redux';
import { Toast } from 'antd-mobile';
import Cookies from 'universal-cookie';
// import Device from '../jssdk/device';
// import { saveLanguage } from '../action/ipc';
import { setDeviceAttr } from '../action/device';

let index_ = 0
class Settinglanguage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // showDate:false,
            language:this.getLang(),
            currLan:index_
        };
        this.systemApi = new SystemApi;
        // this.device = new Device();
        this.getLang = this.getLang.bind(this);
        this.handleClickBack = this.handleClickBack.bind(this);
        this.selectLangauge = this.selectLangauge.bind(this);
        // this.hidDateList = this.hidDateList.bind(this);
        // this.onDone = this.onDone.bind(this)
        
    };
    
    handleClickBack(event){
      const cookies = new Cookies();
      const { language , currLan } = this.state;
      Toast.loading(Lang.public.loading);
      // this.device.setDevAttrReq({
      //   parentId: this.props.devId,
      //   payload:{
      //     devId: this.props.devId,
      //     userId: cookies.get('userId'),
      //     // password:cookies.get("password"),
      //     password:'PG268aeDLvPI',
      //   attr:{
      //     Language:this.state.currLan
      //     }
      //   }
      // }).then(res => {
      //   Toast.hide();
      //   if (res.ack.code == 200 ) {
      //     this.props.actions.saveLanguage(language)
      //     this.props.history.goBack();
      //   } else {
      //     Toast.info(Lang.device.sirenVolume.dialog.tip[0]);
      //   }
      // }).catch(res => {
      //   Toast.info(Lang.device.dialog.tip[3]);
      // });
        
      const { actions } = this.props;
      const options = {
          parentId: this.props.devId,
          payload: {
            devId: this.props.devId,
            userId: cookies.get('userId'),
            password:this.props.password,
            attr: {
            Language:this.state.currLan
          },
        },
      };
      actions.setDeviceAttr(options).then(() => {
          Toast.hide();
          // this.props.actions.saveLanguage(language)
          // this.props.actions.saveLanguage(language)
          this.props.history.goBack();
      });
    };

    componentDidMount(){
        this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
        // console.log(this.props.parentId,this.props.devId,this.props.getLangugae)
    }

    getLang(){
        // debugger;
        const getLan = Lang.ipc.deviceLanguage.language[0];
        let lan_ = '';
        if(this.props.getLangugae == 1){
            lan_ = Lang.ipc.deviceLanguage.language[1]
        }else{
            lan_ = getLan
        }
        return lan_
    }

    selectLangauge(item,index){
        index_ = index;
        this.setState({
            language:item,
            // showDate:true,
            currLan:index_
        })
        console.log(item)
    }

    // hidDateList(){
    //     console.log('---取消---');
    //     this.setState({
    //         showDate:false
    //     })
    // }

    // onDone(){
    //     console.log("==== done =====");
    //     let data_ = this.refs.getDate.getSelectDate();
    //     this.setState({
    //         showDate:false
    //     })
    //     console.log("$$$$$$$$$",data_)
    // }

    render (){
        let Language = Lang.ipc.deviceLanguage.language;
        let _list = Language.map((item,index) =>
            <div className='english' key={index}>
                <span className="language_text">{ item }</span>
                <i className={ this.state.language === item ? "check_lang check_lang_true" : "check_lang check_lang_false"} onClick={ this.selectLangauge.bind(this,item,index)}></i>
            </div>
        )
        return (
            <div className='DeviceLanguage'>
                <BarTitle onBack={this.handleClickBack} title={Lang.ipc.deviceLanguage.title} />
                <div className='language_main'>
                    { _list }
                    {/* <RcCalendar onCancle={ this.hidDateList } showDate={ this.state.showDate } onDone={ this.onDone } ref="getDate" /> */}
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state, ownProps) => {
    // const devId = '896a7cb56c3e41dcac48a0f457783314';
    const devId = (state.device.fromPage === 'list' || state.device.recordAttr.devId === '') ? state.device.deviceItem.devId : state.device.recordAttr.devId;
    return {
      // getLangugae: state.ipc.getLangugae,
      devId:devId,
      getLangugae:state.device.items[devId].attr.Language,
      password:state.device.items[devId].password
    };
  };
  
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
          // saveLanguage,
          setDeviceAttr
        }, dispatch )
});
export default connect(mapStateToProps,mapDispatchToProps)(Settinglanguage)