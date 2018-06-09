import React from 'react';
import './default/ipcplan.css';
import 'antd-mobile/dist/antd-mobile.css';
import { Button } from 'antd-mobile';
import BarTitle from '../component/barTitle';
import Toast from 'antd-mobile/lib/toast';
import 'antd-mobile/lib/toast/style/css';
import Cookies from 'universal-cookie';
import IpcPlanAPi from '../jssdk/ipcplan';
import { showDialog } from '../action';
import { connect } from 'react-redux';
import ScrollView from '../component/scrollView';
import { stat } from 'fs';
import { Lang } from '../public';
import jsBridge from '../jssdk/JSBridge';
import { changeFromPage } from '../action';
import { bindActionCreators } from 'redux';

const data2 = [{
		month: 1,
		money: 10
	},
	{
		month: 2,
		money: 19.9
	},
	{
		month: 3,
		money: 30
	},
	{
		month: 5,
		money: 49.99
	},
	{
		month: 6,
		money: 59.98
	},
	{
		month: 12,
		money: 96.87
	},
];
const numberRexg = /^[1-9]\d{0,2}$/g;
class Selectplan extends React.Component {

	constructor(props) {
		super(props);
		let myplanName = this.props.location.query.planName ? this.props.location.query.planName : Lang.ipc.videomanagement.tips[0];
		let myprice = this.props.location.query.price ? this.props.location.query.price : 11.00;
    let plandesc = this.props.location.query.planDesc ? this.props.location.query.planDesc : Lang.ipc.videomanagement.tips[1];
		let packageId = this.props.location.query.packageId ? this.props.location.query.packageId : null;
		let planId = this.props.location.query.planId ? this.props.location.query.planId : null;
		let fromPage = this.props.location.query.fromPage ? this.props.location.query.fromPage : null;
		this.state = {
			data: data2,
			planName: myplanName,
			price: myprice,
			plandesc: plandesc,
			// monthCount: 1,
			month: 1,
      isShow: false,
			packageId:packageId,
			planId: planId,
			fromPage: fromPage
		};
		this.handleSelectplan = this.handleSelectplan.bind(this);
		this.handleClickBack = this.handleClickBack.bind(this);
		this.handleBuyplan = this.handleBuyplan.bind(this);
		this.setMonth = this.setMonth.bind(this)
		this.inputOnblur = this.inputOnblur.bind(this)
		this.rmText = this.rmText.bind(this)
		this.resetData = this.resetData.bind(this)
	}
	
	componentDidMount() {
		var that = this;
		jsBridge.on('Paypal.pay',function(res) {
			console.log('=========== res', that);
			let data = {
				fromPage: that.state.fromPage,
			}
			let path ;

			if (res.result == 0) {
				path = {
					pathname: '/ipc/ipcpaysuccess',
					query: data
				}				
				that.props.history.push(path)
			} else if (res.result == 1) {
				path = {
					pathname: '/ipc/ipcpayfail',
					query: data
				}
				that.props.history.push(path)
			} else if (res.result == 2) {
			}
			
		});
	}

	componentWillUnmount(){
		jsBridge.off('Paypal.pay');
		const { actions, } = this.props;

		actions.changeFromPage('');
		Toast.hide();
	}

	handleClickBack(event) {
		this.props.history.goBack();
	}

	handleSelectplan(index) {
		this.setState({
			// monthCount: this.state.data[index].month,
			month: this.state.data[index].month
		});

	}

	handleBuyplan() {
		const { deviceItem } = this.props;
		if(this.state.month < 1) {
      		Toast.info(Lang.ipc.videomanagement.monthsPlaceholder,2)
			return;
		}
    	Toast.loading('',0);
    // const { packageId } = this.state;
		IpcPlanAPi.buyVideoPlan({

			planId: this.state.planId,
			deviceId: deviceItem ? deviceItem.devId:null,
			cancelUrl: 'http://localhost:6565/ipc/selectplan',
			successUrl: 'http://localhost:6565/ipc/ipcpaysuccess',
			errorUrl: 'http://localhost:6565/ipc/ipcpayfail',
			counts: this.state.month,
			currency: "USD",
			packageId: this.state.packageId, 

			payPrice: this.state.month * this.state.price,
		}).then(res => {
			console.log('添加计划' + res);

			Toast.hide();
			if (res.code!=200) {
				Toast.info(res.desc,2);
			}
		})

	}
	setMonth(e) {
		let target = e.target;
    this.setState({
      month: target.value,
      isShow: true
    })
	}

	inputOnblur() { // input 失去焦点事件
		setTimeout(() => {
			this.setState({
				isShow: false,
			});
		}, 100);
	}

	rmText() {
		this.setState({
			month: ""
		})
	}

	resetData() {
		const {
			actions
		} = this.props;
		actions.setEditingName(this.state.cameraName);
	}

	render() {
		const {
			price
		} = this.state;
		return(
			<div className="ipcplan">
			<BarTitle title={Lang.ipc.videomanagement.addplan} onBack={this.handleClickBack} />
        <div className="content">
          <ScrollView>
            <div className="eventType" >{this.state.planName}</div>
					  <div className='hintTxt' style={{ marginTop: '1.5rem' }} >{this.state.plandesc}</div>
            <div className="line"></div>
					  <div className="planSubTitle">{Lang.ipc.videomanagement.quickChoice}</div>
            <div className="planParent">
              {data2.map((item,index)=>
                <div className={item.month == this.state.month ? 'cellSelect':'cell'} onClick={()=>this.handleSelectplan(index)}>
                  <div className="title">{item.month + Lang.ipc.videomanagement.months}</div>
                  <div className="subTitle">{'￥' + item.month * price}</div>
                </div>
              )}
            </div>
			      <div className="bottomParent">
						 <div className="setMonth_set">
              <input type="text" name="cameraName" maxLength="3"
                type="number" 
                className="set_month" 
                onChange={ e => this.setMonth(e) }
                onBlur={ this.inputOnblur }
                value={ this.state.month } placeholder={Lang.ipc.videomanagement.monthsPlaceholder} 
                onChange={e => {
                  var mobi = e.currentTarget.value;
                  this.setState({ month: mobi ,isShow:true});
                }}
              />
              <i className="rem_icon" style={{display:(this.state.isShow ? 'block' : 'none')}} onClick={ this.rmText }></i>
            </div>
						<span className="totalMoney">{Lang.ipc.videomanagement.moneyFlag+this.state.month * price}</span>
						<span className="payHint">{Lang.ipc.videomanagement.amountPayable}</span>
						<Button className="playBtn" onClick={this.handleBuyplan}>{Lang.ipc.videomanagement.pay}</Button>
			    </div>
	        </ScrollView>
        </div>
     </div>
		);
	}
}

//将state绑定到props
const mapStateToProps = (state, props) => {
	// console.log(props.locatoin.query);
	const devId = (state.device.fromPage === 'list' || state.device.fromPage === 'ipcItem') ? state.device.deviceItem.devId : null;
	return {
		recordAttr: state.device.recordAttr,
		devId: devId,
		deviceItem: devId ? state.device.items[devId]:null,
		playType: state.ipc.playType,
		dataState: state.ipc.dataState,
	}
};
//将action的所有方法绑定到props上
const mapDispatchToProps = (dispatch) => {
	
	return {
		showDialog: (...args) => dispatch(showDialog(...args)),
		actions: bindActionCreators(
			{
				changeFromPage
			},
			dispatch)
	}
};
export default connect(mapStateToProps, mapDispatchToProps)(Selectplan);