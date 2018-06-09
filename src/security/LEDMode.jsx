import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { setLEDMode } from '../action/security';
import BarTitle from '../component/barTitle';
import './default/style.css';
import { Lang } from '../public';
const langSecurity = Lang.security;

class LEDMode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: LED_MODES[0].value
    }
    this.changeValue = this.changeValue.bind(this);

  }

  changeValue(item){
    const { setLEDMode } = this.props;

    this.setState({
      selectedValue: item.value
    });
    
    setLEDMode(item.value);
    this.props.history.goBack();
   
  }

  render() {
    const { ledMode } = this.props;

    return (
      <div>
        <BarTitle title={langSecurity.pageTitle.ledMode} onBack={() => this.props.history.goBack()} />
        <div className="security-delay">
        <ul>
          {
            LED_MODES.map((item,index) => 
             <li key={index} onClick={(ev) => this.changeValue(item)}>
                {item.title}
                <i className={ledMode.value == item.value ? "on" : "off"}></i>
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
    ledMode: state.security.ledMode 
    
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLEDMode: (...args) => dispatch(setLEDMode(...args))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(LEDMode);
export const LED_MODES = [
  {   title: 'LED not work',
      value: 'off',
  },
  {   title: 'Flash',
      value: 'on',
  }
];