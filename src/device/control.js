import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SwitchNormal, PickerColorBase, PickerColorColour, PickerColorTemperature } from 'lds-rc'
import Device from '../jssdk/device';
import SystemApi from '../jssdk/system';
import BarTitle from '../component/barTitle';
import SliderBrightness from '../component/sliderBrightness';
import helper from '../public/helper';
import { Lang } from '../public';
import { Style } from './resource';
import { fetchProductInfo } from '../action/home';
import { changeBackAction } from '../action';
import { saveDeviceItem, setRecordAttr ,shouldUpdateDeviceList} from '../action/device';
import './default/style.css';
import { setDeviceCCT } from '../action/device';
import {saveChooseArr} from '../action/automation'

let isChange = false;
let brightnessTouchTimer;
let isShowOver = false;

class DevicePage extends Component {
  constructor(props) {
    super(props);
    this.device = new Device();
    this.systemApi = new SystemApi();
    const { devId, deviceItems, fromPage, recordAttr } = this.props;

    const deviceItem = deviceItems[devId];
    let attr = {
      OnOff: 0,
      CCT: 4000,
      Dimming: 100,
      RGBW: null,
    }
     let color = '#ae00ff';
     console.log(deviceItem);
    let temporary = deviceItem.attr.RGBW;
        temporary =temporary+"";
   			temporary = temporary.substring(0,1);
   			console.log("wcb temporary",temporary);
   			if(temporary=="#"){
   				color = deviceItem.attr.RGBW;
   				console.log("wcb ############Color",color);
   			}else {
   				 console.log("wcb 十进制 开始",color);
   				 color = helper.int2Rgb(deviceItem.attr.RGBW);
   				 console.log("wcb 十进制 结束",color);
   			}
   			
    if (fromPage === 'list' || recordAttr.devId === '') {
      if (!deviceItem.online) {
        deviceItem.attr.OnOff = 0;
      }
      attr = deviceItem.attr;
    } else {
      attr = recordAttr.attr;
    }

   
//  if (attr && attr.RGBW !== undefined) {
//  	console.log("wcb attr",attr);
//    color = helper.int2Rgb(attr.RGBW);
//    console.log("wcb attr color",color);
//  }
    let tabIndex = 0;
    if (deviceItem.devType === 'Light_RGBW') {
      tabIndex = attr && attr.RGBW !== undefined ? 0 : 1
    }

    this.state = {
      index: tabIndex,
      isOnline: true,
      OnOff: attr && attr.OnOff !== undefined ? (attr.OnOff - 0) : 0,
      Color: color,
      Colortemp: (attr && attr.CCT !== undefined) ? (attr.CCT - 0) : 4000,
      brightness: (attr && attr.Dimming !== undefined) ? (attr.Dimming - 0) : 100,
      devId: devId,
      devType: deviceItem.devType
    };
    this.dataDetail = deviceItem;
    this.handleClickBack = this.handleClickBack.bind(this);
    this.handleClickMore = this.handleClickMore.bind(this);
    this.handleClickOnOff = this.handleClickOnOff.bind(this);
    this.handleChangeSliderBrightness = this.handleChangeSliderBrightness.bind(this);
    this.handleChangePickerColorValue = this.handleChangePickerColorValue.bind(this);
    this.handleChangePickerColorTemp = this.handleChangePickerColorTemp.bind(this);
    this.handleClickSave = this.handleClickSave.bind(this);
    this.onSliderChange = this.onSliderChange.bind(this);
  }

  handleClickSave() {
    this.props.changeBackAction(true);
    const { fromPage, actions, devId, deviceItems } = this.props;
    const device = deviceItems[devId];
    if (fromPage !== 'list') {
      let attrObj = {
        OnOff: this.state.OnOff,
        CCT: Number(this.state.Colortemp.toFixed(0)),
        Dimming: this.state.brightness,
        RGBW: this.state.Color.replace('#', '0x') << 8
      };

      if (device.devType === 'Light_Dimmable') {
        delete attrObj.RGBW;
        delete attrObj.CCT;
      }
      if (device.devType === 'Light_ColorTemperature' || device.devType === 'Light_ColourTemperature') {
        delete attrObj.RGBW;
      }
      if (device.devType === 'Light_RGBW') {
        if (this.state.index === 0) {
          delete attrObj.CCT
        }
        if (this.state.index === 1) {
          delete attrObj.RGBW
        }
      }

      actions.setRecordAttr({
        devId: devId,
        attr: attrObj
      });
    }

    let seldev = this.props.chooseDeviceArr
    // let {attr,devId,devType} = device;
    if(seldev.length>0){
      let flag =false;
      seldev.map((item,index) =>{
      if(item.devId === device.devId){
        flag =true;
      }
      })
      if(flag ==false){
        seldev.push(Object.assign(device,{thenType:device.devType}));
      }
    }else{
      seldev.push(Object.assign(device,{thenType:device.devType}));
    }
	
    this.props.actions.saveChooseArr(seldev)

    this.props.history.goBack();
  }
  handleClickBack() {
  	const {
			device,
			actions
		} = this.props;
  	actions.shouldUpdateDeviceList();//刷新数据
    this.props.changeBackAction(false);
    console.log("back recordAttr = ",this.props.recordAttr);
    if (this.props.fromPage !== 'list' && this.props.recordAttr && this.props.recordAttr.devId != '' && this.props.recordAttr.isCheck) {
    		if(this.props.recordAttr.attr.CCT){
    			this.props.recordAttr.attr.CCT = Number(this.props.recordAttr.attr.CCT);
    			if(this.props.recordAttr.attr.CCT < 2700 || this.props.recordAttr.attr.CCT > 6500){
    				delete this.props.recordAttr.attr.CCT
    			} 
    		}
    		
    		if(this.props.recordAttr.attr.OnOff){
    			this.props.recordAttr.attr.OnOff = Number(this.props.recordAttr.attr.OnOff);
    		}
    		
    		if(this.props.recordAttr.attr.OnOff == 0){
    			delete this.props.recordAttr.attr.CCT;
    			delete this.props.recordAttr.attr.RGBW;
    			delete this.props.recordAttr.attr.Dimming;
    		}
    		
    		if(this.props.recordAttr.attr.Dimming){
    			this.props.recordAttr.attr.Dimming = Number(this.props.recordAttr.attr.Dimming);
    		}
    		
    		if(this.props.recordAttr.attr.RGBW){
    			this.props.recordAttr.attr.RGBW = Number(this.props.recordAttr.attr.RGBW);
    		}
    		
    		
    	 	this.device.setDevAttrReq({
		      parentId: this.dataDetail.parentId,
		      payload: {
		        devId: this.props.recordAttr.devId,
		        attr: this.props.recordAttr.attr
		      }
		    }).then(res => {
		      if (res && res.ack && res.ack.code == 200) {
		      } else {
		      }
		    }).catch(res => {
		      // this.setState({ OnOff: !that.state.OnOff });
		    });
    }
   
    this.props.history.goBack();
  }

  handleClickMore(event) {
    this.props.actions.saveDeviceItem(this.dataDetail);
    this.props.history.push(`/device/edit/${this.dataDetail.devId}`);
  }
/**
 * wcb 该代码要合到大一统
 */
  handleClickOnOff(value) {
  	const { fromPage, deviceItems, devId } = this.props;
    const currentDevice = deviceItems[devId];
    let communicationMode = currentDevice.communicationMode;
    console.log("handleClickOnOff currentDevice = ",currentDevice);
  	if(!isShowOver){
			return;
		}
    let that = this;
    value = (value === "on" ? 1 : 0);
    if (!this.state.isOnline) {
      return false;
    }
    this.setState({ OnOff: value });
   		//如果是ble设备走ble协议
     if(communicationMode=="BLE"){
    	if(value == "1"){
    		 this.setState({ OnOff: !that.state.OnOff });
					this.device.turnOn({devId:currentDevice.devId});//开
					 
    	}else if(value == "0"){
    		this.setState({ OnOff: !that.state.OnOff });
					this.device.turnOff({devId:currentDevice.devId});//关
					  
    	}
    }else{
	    	 this.device.setDevAttrReq({
	      parentId: this.dataDetail.parentId,
	      payload: {
	        devId: this.state.devId,
	        attr: {
	          OnOff: value
	        }
	      }
	    }).then(res => {
	      console.log("OnOff回传：", res);
	      if (res && res.ack && res.ack.code == 200) {
	      } else {
	        // this.setState({ OnOff: !that.state.OnOff });
	      }
	    }).catch(res => {
	      // this.setState({ OnOff: !that.state.OnOff });
	    });
    }
  }

  handleChangePickerColorValue(color, hsl) {
  	const { fromPage, deviceItems, devId } = this.props;
    const currentDevice = deviceItems[devId];
    let communicationMode = currentDevice.communicationMode;
  	if(!isShowOver){
			return;
		}
  	if(Number(this.state.OnOff) == 0){
  		return;
  	}
    this.setState({ Color: color });
    console.log("RGBW传值：", color);
    //颜色发生改变增加记录
     this.device.changeDeviceAttr({
	        deviceTableId:currentDevice.devId,
	        attrList:[{
	        	  attrName:'rgbw',
              attrValue: color
	        }]
	      });
      if(communicationMode=="BLE"){
      	color = color.slice(1,7)
      	this.device.setRgbColor({devId:currentDevice.devId,rgbValue:color});//
      }else{
		      	this.device.setDevAttrReq({
		      parentId: this.dataDetail.parentId,
		      payload: {
		        devId: this.state.devId,
		        attr: {
              "RGBW": color.replace('#', '0x') << 8,
              OnOff: 1
		        }
		      }
		    }).then(res => {
		      console.log("RGBW设置回传：", res);
		      if (res && res.ack && res.ack.code != 200) {
		      }
		    });
      }
  }

  handleChangePickerColorTemp(colorTemp, hsl) {
  	console.log("CCT传值：", colorTemp);
  	const { fromPage, deviceItems, devId } = this.props;
    const currentDevice = deviceItems[devId];
    let communicationMode = currentDevice.communicationMode;
    if(!isShowOver){
			return;
    }
    if(Number(this.state.OnOff) == 0){
  		return;
  	}
    this.setState({ Colortemp: parseInt(colorTemp) });
    if(colorTemp){
    	this.props.cctNumber[devId] = colorTemp;
			this.props.setDeviceCCT(this.props.cctNumber);
		}
    if(communicationMode=="BLE"){
    	/*
    	 *色温是百分比0到100，需要16进制，且是色温是2000-6500， 
    	 */
	    	let numTemp=(colorTemp-2000)/45;
	    	colorTemp=parseInt(numTemp).toString(16)
      	this.device.setCt({devId:currentDevice.devId,ctValue:colorTemp});//
      	  this.setState({ Colortemp: parseInt(numTemp)});
    }else{
	    	this.device.setDevAttrReq({
	      parentId: this.dataDetail.parentId,
	      payload: {
	        devId: this.state.devId,
	        attr: {
            "CCT":  Number(colorTemp.toFixed(0)),
            OnOff: 1
	        }
	      }
	    }).then(res => {
	      console.log("CCT设置回传：", res);
	    });
	     this.setState({ Colortemp: parseInt(colorTemp) });
    }
   
  }

  onSliderChange(value) {
    if(value < 5) {
      value = 5;
    }
    this.setState({ brightness: value });
  }

  handleChangeSliderBrightness(value) {
  		const { fromPage, deviceItems, devId } = this.props;
  	 const currentDevice = deviceItems[devId];
    let communicationMode = currentDevice.communicationMode;
  	if(!isShowOver){
			return;
		}
  	
  	if(Number(this.state.OnOff) == 0){
  		return;
  	}
  	isChange = true;
//	let that = this;
//	that.brightnessTouchTimer && clearTimeout(that.brightnessTouchTimer);
  	
//	this.brightnessTouchTimer = setTimeout(function(){
//	  		that.brightnessTouchTimer && clearTimeout(that.brightnessTouchTimer);
//	  		that.brightnessTouchTimer = null;
//	  		console.log("333333333333333change before isChange",isChange);
//	  		isChange = false;
//	  		console.log("333333333333333change after isChange",isChange);
//	  	}, 3000);
//  this.setState({ brightness: value });
    if(value<=5){
    	value = 5;
    	this.setState({ brightness: 5 });
//  	console.log("wcb brightness",this.state.brightness);
    }else{
    	this.setState({ brightness: value });
//  	console.log("wcb brightness2",this.state.brightness);
    }
//    console.log("Dimming传值：", value);
    if(communicationMode=="BLE"){
    	this.device.setLum({devId:currentDevice.devId,lumValue:value});//开
    }else{
	    	 this.device.setDevAttrReq({
	      parentId: this.dataDetail.parentId,
	      payload: {
	        devId: this.state.devId,
	        attr: {
	          "Dimming": value,
            OnOff: 1
	        }
	      }
	    }).then(res => {
//	      console.log("Dimming设置回传：", res);
	    });
    }
  }

  handleTabNavClick(index, item, event) {
    let indexOld = this.state.index;
    this.setState({ index, indexOld });
  }

  componentDidMount() {
  	// 默认为false，1秒后改为true，解决首页点击进入该页后出发开关
		isShowOver = false;
		
    this.systemApi.offGoBack().onceGoBack(this.handleClickBack);

		setTimeout(()=>{
				isShowOver = true;
				console.log("isShowOver = ",isShowOver);
			}, 200);
    // const { deviceItem } = this.props;
    // if (deviceItem.attr && deviceItem.attr.Dimming !== undefined) {
    // 	this.setState({
    // 		brightness: deviceItem.attr.Dimming - 0
    // 	});
    // }
    // if (deviceItem.attr && deviceItem.attr.OnOff !== undefined) {
    // 	this.setState({
    // 		OnOff: deviceItem.attr.OnOff - 0
    // 	});
    // }
    // if (deviceItem.attr && deviceItem.attr.CCT !== undefined) {
    // 	this.setState({
    // 		Colortemp: deviceItem.attr.CCT - 0
    // 	});
    // }
  }

  componentWillReceiveProps(nextProps) {
    const nextDevice = nextProps.deviceItems[this.props.devId];
    if (nextProps.fromPage === 'list') {
      if (nextDevice && nextDevice.attr && nextDevice.attr.Dimming !== undefined) {
      	if(isChange && this.state.brightness == nextDevice.attr.Dimming - 0){
      		this.setState({
	          brightness: nextDevice.attr.Dimming - 0
	        });
	        isChange = false;
      	} else if(!isChange){
      		this.setState({
	          brightness: nextDevice.attr.Dimming - 0
	        });
      	}
//    	if(!isChange){
//    		this.setState({
//	          brightness: nextDevice.attr.Dimming - 0
//	        });
//    	}
      }
      if (nextDevice && nextDevice.attr && nextDevice.attr.OnOff !== undefined) {
        this.setState({
          OnOff: nextDevice.attr.OnOff - 0
        });
      }
      if (nextDevice && nextDevice.attr && nextDevice.attr.CCT !== undefined) {
        this.setState({
          Colortemp: nextDevice.attr.CCT - 0
        });
      }
    }
  }

  render() {
    const { fromPage, deviceItems, devId,cctNumber } = this.props;
    const currentDevice = deviceItems[devId];
    
   			let  color = this.state.Color;
		
		console.log("wcb cctNumber[devId]",cctNumber[devId]);
		console.log("wcb this.state.Colortemp",this.state.Colortemp);
//  let color = currentDevice.attr.RGBW?currentDevice.attr.RGBW:"#ffffff";
//  let colorTemp = this.state.Colortemp;
		let colorTemp = cctNumber[devId] || this.state.Colortemp;
		console.log("wcb colorTemp",colorTemp);
//  let numTemp = parseInt((colorTemp*45+2000)/100)*100;
		/*	let numTemp ="";
		if(colorTemp<101){
			numTemp = parseInt(colorTemp*45)+2000
		}else{
			numTemp = colorTemp;
		}*/
//  console.log('wcb numTemp:',numTemp);
    //以下代码从大一统合并过来冲突，待解决-wcb
    // console.log("wcb brightness3",this.state.brightness);
    // console.log("wcb currentDevice",currentDevice);
    // let color = this.state.Color;
    // let colorTemp = currentDevice.attr.CCT||this.state.Colortemp;
    // console.log("wcb colorTemp",colorTemp);
    const { brightness, OnOff } = this.state;
    let indexActive = this.state.index;
    let numTempName ="";
    let numTemp = this.state.Colortemp;
    if(numTemp >= 5000){
    	 numTempName ="Daylight " + numTemp.toFixed(0) + 'k';
    }else if(3000 <= numTemp&& numTemp <5000){
    	 numTempName ="Bright white " + numTemp.toFixed(0) + 'k';
    }else if(numTemp < 3000){
    	 numTempName ="Soft white " + numTemp.toFixed(0) + 'k';
    }
    let getClassName = function (className, index) {
      if (Math.abs(index - indexActive) <= 1) {
        switch (index - indexActive) {
          case 0:
            className += " active ";
            break;
        }
      }
      return className;
    };
    let switchClassName = (OnOff ? "open" : "close");
    let dataNav = [{
      title: Lang.device.control.color,
      className: "color",
      component: (
        <div style={{ overflow: "hidden" }}>
          <div className="picker-onoff">
            <PickerColorColour value={color} bgClass="lamp-rgbw bg"
              outR={helper.RemToPx("43.33rem") / 4}
              intR={helper.RemToPx("20.2rem") / 4}
              disabled={!OnOff}
              onChange={this.handleChangePickerColorValue}>
              <SwitchNormal value={OnOff ? "on" : "off"} class="switch" onClick={this.handleClickOnOff} />
            </PickerColorColour>
          </div>
          <div className="set-value"></div>
          <div className={"slider-brightness " + switchClassName}>
            <SliderBrightness defaultValue={{ OnOff, brightness }} onAfterChange={this.handleChangeSliderBrightness} onSliderChange={this.onSliderChange} />
          </div>
        </div>
      )
    }, {
      title: Lang.device.control.colorTemp,
      className: "colorTemp",
      component: (
        <div style={{ overflow: "hidden" }}>
          <div className="picker-onoff">
            <PickerColorTemperature value={numTemp} bgClass="lamp-cct bg"
              outR={helper.RemToPx("43.33rem") / 4}
              intR={helper.RemToPx("20.2rem") / 4}
              disabled={!OnOff}
              onChange={this.handleChangePickerColorTemp}>
              <SwitchNormal value={OnOff ? "on" : "off"} class="switch" onClick={this.handleClickOnOff} />
            </PickerColorTemperature>
          </div>
          <div className="set-value">{numTempName}</div>
          <div className={"slider-brightness " + switchClassName}>
            <SliderBrightness defaultValue={{ OnOff, brightness }} onAfterChange={this.handleChangeSliderBrightness} onSliderChange={this.onSliderChange} />
          </div>
        </div>
      )
    }, {
      title: "",
      className: "",
      component: (
        <div style={{ overflow: "hidden" }}>
          <div className="picker-onoff">
            <PickerColorBase bgClass="lamp-dim bg"
              outR={helper.RemToPx("43.33rem") / 4}
              intR={helper.RemToPx("20.2rem") / 4}
              disabled={!OnOff}>
              <SwitchNormal value={OnOff ? "on" : "off"} class="switch" onClick={this.handleClickOnOff} />
            </PickerColorBase>
          </div>
          <div className="set-value"></div>
          <div className={"slider-brightness " + switchClassName}>
            <SliderBrightness defaultValue={{ OnOff, brightness }} onAfterChange={this.handleChangeSliderBrightness} onSliderChange={this.onSliderChange} />
          </div>
        </div>
      )
    }];
    switch (this.state.devType.toUpperCase()) {
      case "LIGHT_COLORTEMPERATURE": //可以调色温、亮度
        dataNav = dataNav.slice(1, 2);
        break;
      case "LIGHT_DIMMABLE": //仅可亮度
        dataNav = dataNav.slice(2, 3);
        break;
      case "LIGHT_RGBW": //可以调颜色、色温、亮度
        dataNav = dataNav.slice(0, 2);
        break;
        deafult:
        dataNav = dataNav.slice(0, 2);
        break;
    }
    let styles = {
      tab: {
        width: 100 / dataNav.length + '%'
      },
      light: {
        opacity: brightness / 100,
        backgroundColor: color
      },
      light2: {
        opacity: brightness / 100,
        backgroundColor: colorTemp
      }
    };

    let deviceName = '';
		if (currentDevice) {
			deviceName = currentDevice.name;
		}

    return (
      <div className="device lamp control" ref={(div) => { this.control = div; }}>
        <BarTitle onBack={fromPage != 'list' ? this.handleClickSave : this.handleClickBack} title={deviceName}  >
          {(fromPage == 'list') && (<a className="set-btn" onClick={this.handleClickMore}></a>)}
        </BarTitle>
        <div className="bodyer switchhover">

          {(dataNav.length > 1) && (
            <div className="sh-wrap">
              <ul className="sh-nav clearfix">
                {dataNav.map((item, index) =>
                  <li key={index}
                    className={getClassName(item.className, index)}
                    onClick={this.handleTabNavClick.bind(this, index, item)}>
                    <div className="title-nav">{item.title}</div>
                  </li>
                )}
              </ul>
            </div>
          )}

          <div className="sh-content">
            {dataNav.map((item, index) =>
              <div key={index}
                className={getClassName("sh-panel", index)}>
                {item.component}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    recordAttr: state.device.recordAttr,
    // deviceItem: state.device.deviceItem,
    devId: (state.device.fromPage === 'list' || state.device.recordAttr.devId === '') ? state.device.deviceItem.devId : state.device.recordAttr.devId,
    deviceItems: state.device.items,
    fromPage: state.device.fromPage,
    cctNumber:state.device.cctNumber,
    directDevIds: state.device.directDevIds || [],
    chooseDeviceArr:state.automation.chooseDeviceArr,
  }
}

const mapDispatchToProps = dispatch => ({
  changeBackAction: (...args) => dispatch(changeBackAction(...args)),
  actions: bindActionCreators({
  	shouldUpdateDeviceList,
    fetchProductInfo,
    saveDeviceItem,
    setRecordAttr,
    saveChooseArr,
  }, dispatch),
  setDeviceCCT: (...args) => dispatch(setDeviceCCT(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DevicePage);
