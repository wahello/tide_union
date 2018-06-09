import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { setSirenVolume } from '../action/security';
import BarTitle from '../component/barTitle';
import './default/style.css';
import { Lang } from '../public';
const langSecurity = Lang.security;

class AlarmValue extends React.Component {
  constructor(props) {
    super(props);
    this.changeVolume = this.changeVolume.bind(this);

  }

  changeVolume(item){
    const { setSirenVolume } = this.props;

    this.setState({
      selectValue: item.value
    });
    
    setSirenVolume(item.value);
    this.props.history.goBack();
   
  }

  render() {
    const { siren } =this.props;

    return (
      <div>
        <BarTitle title={langSecurity.pageTitle.alarmVolume} onBack={() => this.props.history.goBack()} />
        <div className="security-delay">
        <ul>
		  		{
		  			VOLUME_LIST.map((item,index) => 
	  				 <li key={index} onClick={(ev) => this.changeVolume(item)}>
		  					{item.title}
		  					<i className={siren.volume == item.value ? "on" : "off"}></i>
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
    setSirenVolume: (...args) => dispatch(setSirenVolume(...args))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(AlarmValue);
export const VOLUME_LIST = [
  {   title: 'High',
      value: 'high',
  },
  {   title: 'Medium',
      value: 'medium',
  },
  {   title: 'Low',
      value: 'low',
  }
];