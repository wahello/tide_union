import React, { Component } from 'react';
import './default/style.css';

export default function DeviceItemBar(props) {
		let status;
		if(props.deviceType == 'Sensor_PIR'){
			status = 'Active';
		}else if(props.deviceType == 'Sensor_Doorlock'){
			status = 'Open';
		}
		
    return (
  		<li className="device-list-item">
  		  {
					
					props.deviceName&&props.parentName ? 
  		  	<div className={props.type ? "item-content " + props.type:"item-content"}>
				  	<div  className ={props.online ? " " :"offline"}></div>
	  				<p className="item-name">{props.deviceName}</p>
	  				<p className="item-belong">{props.parentName}</p>		
	  				<p className="item-status">{status}</p>
	  			</div> : 
	  			''
  		  }  			
  			{props.children}
  		</li>  	
    );
  }