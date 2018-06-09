import React, { Component } from 'react';
import { createForm } from 'rc-form';
import { setSirenTime } from '../action/security';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import BarTitle from '../component/barTitle';
import './default/style.css';
import Picker from 'antd-mobile/lib/picker';
import { Lang } from '../public';
const langSecurity = Lang.security;

class AlarmDuration extends React.Component {
  constructor(props) {
    super(props);
    this.changeTime = this.changeTime.bind(this);
  }

  changeTime(item){
    this.setState({selectValue:item.value});

    const { setSirenTime } = this.props
    setSirenTime(item.value)

    this.props.history.goBack();

  }


  render() {
    const { siren } =this.props;
    return (
      <div>
        <BarTitle title={langSecurity.pageTitle.effectiveTime} onBack={() => this.props.history.goBack()} />
        <div className="security-delay">
          <ul>
  		  		{
  		  			ALARM_DURATION_LIST.map((item,index) =>
  		  				<li key={index} onClick={(ev) => this.changeTime(item)}>
  		  					{item.title}
  		  					<i className={siren.time == item.value ? "on" : "off"}></i>
                </li>
              )
  		  		}
	  	    </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    siren: state.security.siren

  }
};

const mapDispatchToProps = (dispatch) => {
  return {
      setSirenTime: (...args) => dispatch(setSirenTime(...args))
  }
};

export default connect(mapStateToProps,mapDispatchToProps)(AlarmDuration);
export const ALARM_DURATION_LIST = [
  {
    title: '0s',
    value: 0,
  },
  {
    title: '10s',
    value: 10,
  },
  {
    title: '20s',
    value: 20,
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
    value: 60,
  },
  {
    title: '3min',
    value: 3 * 60,
  },
  {
    title: '5min',
    value: 5 * 60,
  },
  {
    title: '10min',
    value: 10 * 60,
  },
  {
    title: '30 min',
    value: 30 * 60,
  }
];
