import React, { Component } from 'react';
import './default/style.css';
import { connect } from 'react-redux';
import { Lang } from '../public';
import { Route, Link } from 'react-router-dom';
import BarTitle from '../component/barTitle';
import DeviceItem from '../component/deviceItem';
import Switch from '../component/switch';
import Picker from 'antd-mobile/lib/picker';
import { setDelay } from '../action/security';
import { bindActionCreators } from 'redux';
const langSecurity = Lang.security;

class SetTime extends Component {
  constructor(props) {  
    super(props);
    this.handleBackClick = this.handleBackClick.bind(this);
    this.changeDelayTime = this.changeDelayTime.bind(this);
  }
  
  componentDidMount() {
    
  }
  
  handleBackClick(){
    this.props.history.goBack();
 }
  
  changeDelayTime(value){  
    const { setDelay } = this.props.actions;
    setDelay(value);
    
    this.props.history.goBack();     
  }
    
  render() {
    const { delay } =this.props;
    
    return (
      <div className='security-delay'>
        <BarTitle title={langSecurity.pageTitle.delayTime} onBack={this.handleBackClick} />
        <ul>
          {
            DELAY_LIST.map((item,index) => 
              <li key={index} onClick={(ev) => this.changeDelayTime(item.value)}>
                {item.title}
                <i className={delay.duration == item.value ? "on" : "off"}></i>
              </li>
            )
          }         
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    delay: state.security.delay
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(
      {
        setDelay
      },
      dispatch
    )
  }
};

export default connect(mapStateToProps,mapDispatchToProps)(SetTime);
export const DELAY_LIST = [
    {
      title: '0s',
      value: 0,
    },
    {
      title: '30s',
      value: 30,
    },
    {
      title: '45s',
      value: 45,
    },
    {
      title: '1min',
      value: 1 * 60,
    },
    {
      title: '3min',
      value: 3 * 60,
    },
    {
      title: '5min',
      value: 5 * 60,
    }
];