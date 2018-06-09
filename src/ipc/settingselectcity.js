import React, { Component } from 'react';
import './default/style.css';
import { Lang } from '../public/resource';
import BarTitle from '../component/barTitle';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SystemApi from '../jssdk/system';
import ScrollView from '../component/scrollView';
import Cookies from 'universal-cookie';
import { Toast } from 'antd-mobile';
import Device from '../jssdk/device';
import { saveTimezone } from '../action/ipc';
import ipcMqtt from '../jssdk/ipcMqtt';

let city = [];
const initials = [];
const inss = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'];
let cityList = [];
let name_ = [];
let resultList = [];
class TimeZone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cityName: '',
      clean: false,
      searchList: [],
      getTimeZone: '',
    };
    this.systemApi = new SystemApi;
    this.searchCity = this.searchCity.bind(this);
    this.handleClickBack = this.handleClickBack.bind(this);
    this.scrollToAnchor = this.scrollToAnchor.bind(this);
    this.getTimezone = this.getTimezone.bind(this);
    this.rmText = this.rmText.bind(this);
    this.inputOnblur = this.inputOnblur.bind(this);
    this.getSearchName = this.getSearchName.bind(this);
  }

  handleClickBack(event) {
    Toast.loading(Lang.public.loading);
    const cookies = new Cookies();
    const { getTimeZone, postTimeZone } = this.state;
    let oldTimeZone = this.props.tz;
    if(postTimeZone === undefined || oldTimeZone === getTimeZone){
      this.props.history.goBack();
    }else{
      ipcMqtt.setDevTimezone({
        parentId: this.props.devId,
        payload: {
          devId: this.props.devId,
          userId: cookies.get('userId'),
          password:this.props.password,
          devTimezone:postTimeZone
        }
      }).then(res =>{
          console.log(res.ack.code);
          Toast.hide(); 
          this.props.actions.saveTimezone(getTimeZone);
          this.props.history.goBack();
      }).catch(res => {
          Toast.info('时区设置失败!!!!!!!', 2);
          this.props.history.goBack();
      })
    }
  }

  componentDidMount() {
    this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
  }

  searchCity(e) {
    const target = e.target;
    this.setState({
      [target.name]: target.value,
      clean: true,
    });
    setTimeout(() => {
      this.getSearchName();
    }, 100);
  }

  getSearchName() {
    name_ = this.state.cityName;
    console.log('gogoggogo>>>>', name_);
    console.log('//////', cityList);
    const getName = [];
    console.log('*************', getName);
    console.log('$$$$$$', resultList);
    if (name_ === '') {
      this.setState({
        searchList: [],
      });
    } else {
      // debugger;
      cityList.map((item, index) => {
        for (let i = 0; i < item.key.length; i++) {
          getName.push({key:item.key[i], val:item.val[i]});
        }
      });
      resultList = getName.filter(item => (item.key.match(name_)));
      this.setState({
        searchList: resultList,
      });
    }
  }

  scrollToAnchor(anchorName) {
    // 点击右侧字母列表 锚链接到相应位置
    if (anchorName) {
      const anchorElement = document.getElementById(anchorName);
      if (anchorElement) { anchorElement.scrollIntoView(true); }
    }
  }

  getTimezone(item, index,data) {
    console.log(item,data);
    this.setState({
      getTimeZone: item,
      postTimeZone:data
    });
  }

  rmText() {
    this.setState({
      cityName: '',
      clean: false,
      searchList: [],
    });
  }
  inputOnblur() { // input 失去焦点事件
    setTimeout(() => {
      this.setState({
        clean: false,
      });
    }, 100);
  }
  render() {
    // debugger;
    const _item = Lang.ipc.timeZone.cityName;
    city = inss.filter(item => _item[item]);
    initials = city.map(item => ({ id: item, key: _item[item].key,val: _item[item].val }));
    cityList = initials.map((item, index) => ({ key:item.key,val:item.val }));
    const list = initials.map((item, index) =>(
        <div key={index}>
          <p className="city_initials" name={item.id}><a id={item.id} className="inss_a">{item.id}</a></p>
          <ul style={{ padding: '0', margin: '0' }}>
            {item.key.map((key, index_) =>
                  (<li
                    className={ this.state.getTimeZone === key ? 'checked_name checked_name_click' : 'checked_name'}
                    key={index_}
                    data-value={item.val[index_]}
                    onClick={this.getTimezone.bind( this, key, index_, item.val[index_] )}
                  >{key}
                  </li>)
              )}
          </ul>
       </div>),
    );
    let initials = inss.map((item, index) =>
      <li className="city_initials_item" key={index}><a className="a_link" onClick={() => this.scrollToAnchor(item)}>{item}</a></li>
    );
    return (
      <div className="timeZone">
        <BarTitle onBack={this.handleClickBack} title={Lang.ipc.timeZone.title} />
        <div className="time_main">
          <div className="select_city">
            <i className="search_city_icon" />
            <input type="text"
              name="cityName"
              onChange={e => this.searchCity(e)}
              value={this.state.cityName}
              className="city_name"
              onBlur={this.inputOnblur}
            />
            <i className={this.state.clean ? 'search_city_remove' : ''} onClick={this.rmText} />
          </div>
          { this.state.searchList.length === 0　?
            <ScrollView>
              { list }
            </ScrollView> :
            <ScrollView>
             <div>
                <p className='time_best'>{ Lang.ipc.timeZone.bestMatch }</p>
                <ul style={{ padding: '0', margin: '0' }} >
                { this.state.searchList.map((item, index) => (
                  <li key={index}
                    className={this.state.getTimeZone === item.key ? 'checked_name checked_name_click' : 'checked_name'}
                    data-value={item.val}
                    onClick={ this.getTimezone.bind(this, item.key, index, item.val) }
                    style={{ borderBottom: '1px solid #4E5367' }}
                  >
                    {item.key}
                  </li>))
                }
                </ul>
              </div>
            </ScrollView>
          }
          <ul className="initials_text">
            { initials }
          </ul>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  const devId = (state.device.fromPage === 'list' || state.device.recordAttr.devId === '') ? state.device.deviceItem.devId : state.device.recordAttr.devId;
  return {
    devId:devId,
    parentId:devId,
    tz:state.ipc.getTimezone,
    password:state.device.items[devId].password
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
      {
        saveTimezone
          // setDeviceAttr
      },
      dispatch )
});
export default connect(mapStateToProps,mapDispatchToProps)(TimeZone);
