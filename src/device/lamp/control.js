import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Device from 'src/jssdk/device';
import SystemApi from 'src/jssdk/system';
import BarTitle from 'src/component/barTitle';
import PickerColorBase from 'src/component/picker/color/base';
import PickerColorColour from 'src/component/picker/color/colour';
import PickerColorTemperature from 'src/component/picker/color/temperature';
import SwitchNormal from 'src/component/switch/normal';
import SliderBrightness from 'src/component/slider/normal';
import helper from 'src/public/helper';
import { Lang, Style } from '../resource';
import { fetchProductInfo } from 'src/action/home';
import { changeBackAction } from 'src/action';
import { saveDeviceItem, setRecordAttr } from 'src/action/device';

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
      Dimming: 50,
      RGBW: null,
    }

    if (fromPage === 'list' || recordAttr.devId === '') {
      if (!deviceItem.online) {
        deviceItem.attr.OnOff = 0;
      }
      attr = deviceItem.attr;
    } else {
      attr = recordAttr.attr;
    }

    let color = '#ae00ff';
    if (attr && attr.RGBW !== undefined) {
      color = helper.int2Rgb(attr.RGBW);
    }
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
      brightness: (attr && attr.Dimming !== undefined) ? (attr.Dimming - 0) : 50,
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
  }

  handleClickSave() {
    this.props.changeBackAction(true);
    const { fromPage, actions, devId, deviceItems } = this.props;
    const device = deviceItems[devId];
    if (fromPage !== 'list') {
      let attrObj = {
        OnOff: this.state.OnOff,
        CCT: this.state.Colortemp,
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

    this.props.history.goBack();
  }
  handleClickBack() {
    this.props.changeBackAction(false);
    this.props.history.goBack();
  }

  handleClickMore(event) {
    this.props.actions.saveDeviceItem(this.dataDetail);
    this.props.history.push(`/device/edit/${this.dataDetail.devId}`);
  }

  handleClickOnOff(value) {
    let that = this;
    value = (value === "on" ? 1 : 0);
    if (!this.state.isOnline) {
      return false;
    }
    this.setState({ OnOff: value });
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

  handleChangePickerColorValue(color, hsl) {
    this.setState({ Color: color });
    console.log("RGBW传值：", color);
    this.device.setDevAttrReq({
      parentId: this.dataDetail.parentId,
      payload: {
        devId: this.state.devId,
        attr: {
          "RGBW": color.replace('#', '0x') << 8
        }
      }
    }).then(res => {
      console.log("RGBW设置回传：", res);
      if (res && res.ack && res.ack.code != 200) {
      }
    });
  }

  handleChangePickerColorTemp(colorTemp, hsl) {
    this.setState({ Colortemp: parseInt(colorTemp) });
    console.log("CCT传值：", colorTemp);
    this.device.setDevAttrReq({
      parentId: this.dataDetail.parentId,
      payload: {
        devId: this.state.devId,
        attr: {
          "CCT": colorTemp
        }
      }
    }).then(res => {
      console.log("CCT设置回传：", res);
    });
  }

  handleChangeSliderBrightness(value) {
    this.setState({ brightness: value });
    console.log("Dimming传值：", value);
    this.device.setDevAttrReq({
      parentId: this.dataDetail.parentId,
      payload: {
        devId: this.state.devId,
        attr: {
          "Dimming": value
        }
      }
    }).then(res => {
      console.log("Dimming设置回传：", res);
    });
  }

  handleTabNavClick(index, item, event) {
    let indexOld = this.state.index;
    this.setState({ index, indexOld });
  }

  componentDidMount() {
    this.systemApi.offGoBack().onceGoBack(this.handleClickBack);

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
        this.setState({
          brightness: nextDevice.attr.Dimming - 0
        });
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
    const { fromPage, deviceItems, devId } = this.props;
    const currentDevice = deviceItems[devId];
    let color = this.state.Color;
    let colorTemp = this.state.Colortemp;
    const { brightness, OnOff } = this.state;
    let indexActive = this.state.index;
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
            <SliderBrightness defaultValue={{ OnOff, brightness }} onChange={this.handleChangeSliderBrightness} />
          </div>
        </div>
      )
    }, {
      title: Lang.device.control.colorTemp,
      className: "colorTemp",
      component: (
        <div style={{ overflow: "hidden" }}>
          <div className="picker-onoff">
            <PickerColorTemperature value={colorTemp} bgClass="lamp-cct bg"
              outR={helper.RemToPx("43.33rem") / 4}
              intR={helper.RemToPx("20.2rem") / 4}
              disabled={!OnOff}
              onChange={this.handleChangePickerColorTemp}>
              <SwitchNormal value={OnOff ? "on" : "off"} class="switch" onClick={this.handleClickOnOff} />
            </PickerColorTemperature>
          </div>
          <div className="set-value">{"Daylight " + this.state.Colortemp.toFixed(0) + 'k'}</div>
          <div className={"slider-brightness " + switchClassName}>
            <SliderBrightness defaultValue={{ OnOff, brightness }} onChange={this.handleChangeSliderBrightness} />
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
            <SliderBrightness defaultValue={{ OnOff, brightness }} onChange={this.handleChangeSliderBrightness} />
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
        <BarTitle onBack={this.handleClickBack} title={deviceName} onDone={fromPage != 'list' ? this.handleClickSave : null} >
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
  }
}

const mapDispatchToProps = dispatch => ({
  changeBackAction: (...args) => dispatch(changeBackAction(...args)),
  actions: bindActionCreators({
    fetchProductInfo,
    saveDeviceItem,
    setRecordAttr,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(DevicePage);
