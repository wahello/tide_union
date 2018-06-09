import React, { Component } from 'react';
import { Lang } from '../../public';

let moveStartX = 0;
let moveStartY = 0;
let moveEndY = 0;
let moveEndX = 0;
const delBtnWidth = '6rem';

export default class extends Component {
		
  constructor(props) {
  	super(props);
    this.state = {
      switchState: false,
      online: true
    }

    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
	}


  handleTouchStart(e){
    e.preventDefault();
    e.stopPropagation();
    moveStartX = e.touches[0].pageX;
    moveStartY = e.touches[0].pageY;
  }

  handleTouchMove(e){
    e.preventDefault();
    e.stopPropagation();
    moveEndX = e.touches[0].pageX;
    moveEndY = e.touches[0].pageY;
  }

  handleTouchEnd(e){
    e.preventDefault();
    e.stopPropagation();
    let $target = e.target;
    let xDistance = 0;

    xDistance = moveEndX - moveStartX;

    if(!$target.classList.contains('list-item')){
      $target = $target.parentNode;
    }

    if(Math.abs(xDistance) > 50 && Math.abs(moveStartY - moveEndY) < 50) {
      if(xDistance < 0) {
        $target.style.left = '-' + delBtnWidth;
      } else{
        $target.style.left = 0;
      }
    } else if(xDistance === 0){
      $target.style.left = 0;
    }
  }
  
  render() {
  	let switchState = true;
    let uuid = 0;
    let dataDetail = this.props.dataDetail;
    let iconClassName = ["devices-icon"];
    iconClassName.push(dataDetail.deviceIcon);
    iconClassName.push(dataDetail.isOnline ? "on" : "off");
    	
    return (
			<li key={dataDetail.deviceId}>
				<div 
		      className="list-item"
		      onTouchStart={this.handleTouchStart}
		      onTouchMove={this.handleTouchMove}
		      onTouchEnd={this.handleTouchEnd}
		      onClick={() => {this.props.goToDeviceDetail(dataDetail)}}>
          
          <div className={iconClassName.join(' ')}></div>
				  <p className="device-name">{dataDetail.deviceName}</p>
				  <p className="device-desc">{dataDetail.isOnline ? Lang.device.onLine : Lang.device.offLine}</p>
				  <a className={'device-switch ' + (dataDetail.OnOff ? 'device-switch-on' : 'device-switch-off')} onClick={e => {this.props.handleOnOff(dataDetail, e);}}></a>
				</div>
				<a className="del-btn" onClick={e => {this.props.handleDel(dataDetail, e)}}>
				  <span className="del-btn-txt">{Lang.public.delete}</span>
				</a>
			</li>
    );
  }


}