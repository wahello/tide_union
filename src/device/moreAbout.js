import React, { Component } from 'react';
import Device from '../jssdk/device';
import BarTitle from '../component/barTitle';
import ScrollView from '../component/scrollView';
import { showDialog } from '../action';
import helper from '../public/helper';
import SystemApi from '../jssdk/system';
import { Lang } from '../public';
import { connect } from 'react-redux';
import './default/edit.css';
import Cookies from 'universal-cookie';

const dialogLang = Lang.public.dialog;
const deviceLang = Lang.device;
const cookies = new Cookies();

class MoreAbout extends Component {
  constructor(props) {
    super(props);
		
		this.state = {
			modelId: "",
			productId: "",
			macId: ""
		}
    this.device = new Device;
    this.systemApi = new SystemApi;
    this.handleClickBack = this.handleClickBack.bind(this);
  }

  handleClickBack(event){
  	this.props.history.goBack();
  }
  
  
  componentDidMount(){
    this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
    
    const { deviceItem } = this.props;
    this.device.getDevInfoReq({
    	payload: {
    		devId: deviceItem.devId 
    	},
    	userId: cookies.get('userId')
    }).then(res => {
    	this.setState({
    		modelId: res.payload.devModel,
    		macId: res.payload.mac,
    		productId: deviceItem.productId
    	});
    }).catch(err => {
    	console.log("getDevInfoReq=",err)
    });
  }
  
  componentWillUnmount(){
  }
  
  render() {
  	const {
			deviceItem
		} = this.props;
    return (
      <div className="device-info">
  	 		<BarTitle onBack={this.handleClickBack} title={Lang.device.edit.moreAbout} />
  	 		
  	 		<div
		          role="presentation"
		          className="device-info-row"
		          onKeyPress={() => { }}
		        >
          <span className="title">{Lang.device.edit.modelId}</span>
          <span className="name">{this.state.modelId}</span>
        </div>
        
        <div
		          role="presentation"
		          className="device-info-row"
		          onKeyPress={() => { }}
		        >
          <span className="title">{Lang.device.edit.productUUID}</span>
          <span className="name">{this.state.productId}</span>
        </div>
        
        <div
		          role="presentation"
		          className="device-info-row"
		          onKeyPress={() => { }}
		        >
          <span className="title">{Lang.device.edit.mac}</span>
          <span className="name">{this.state.macId}</span>
        </div>
  		</div>
    );
  }
}

//将state绑定到props
const mapStateToProps = (state) => {
  return {
  	deviceItem:state.device.deviceItem,
  }
};
//将action的所有方法绑定到props上
const mapDispatchToProps = (dispatch) => {
  return {
    showDialog: (...args) => dispatch(showDialog(...args))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(MoreAbout);