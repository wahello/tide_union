import React, { Component } from 'react';
import './default/style.css';
import BarTitle from '../component/barTitle';
import ScrollView from '../component/scrollView';
import { Lang } from '../public';
import SystemApi from '../jssdk/system';


const ICONS = [
 1,2,3,4,5,6,7,8,9
];
export default class extends Component {
    
  constructor(props) {
    super(props);

    this.systemApi = new SystemApi;
    this.handleClick = this.handleClick.bind(this);
    this.handleClickBack = this.handleClickBack.bind(this);
  }

  handleClick(icon){
    let deviceInfo = JSON.parse(localStorage.DeviceInfo);
    deviceInfo.deviceIcon = 'light' + icon;
    localStorage.DeviceInfo = JSON.stringify(deviceInfo);
    this.props.history.goBack();
  }

  handleClickBack(){
    this.props.history.goBack();
  }

  componentDidMount(){
    this.systemApi.offGoBack().onceGoBack(this.handleClickBack);

  }
  
  render() {
    let listItems = ICONS.map((type, i) => {
      return <li key={i} className="icon-item" onClick={() => this.handleClick(type)}>
              <div className={"devices-icon light" + type}></div>
            </li>
    });

    return (
      
      <div className="device-icons">
        <BarTitle 
          onBack={this.handleClickBack}
          title={Lang.space.updateIcon}
        />
        <ScrollView>
          <ul className="icon-list">
            {listItems}
          </ul>
        </ScrollView>
      </div>
    );
  }
}