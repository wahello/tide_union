import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'remote-redux-devtools';
import { DialogNormal } from 'lds-rc';
import registerServiceWorker from './registerServiceWorker';
import reducer from './reducer';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css';
import User from './user';
import Login from './user/login';
import App from './App.cloud';
import { hideDialog,showDialog,showProgressDialog } from './action';
import jsBridge from './jssdk/JSBridge';
import Cookies from 'universal-cookie';
import Setting from './setting';
import Toast from 'antd-mobile/lib/toast';

import SystemApi from './jssdk/system';
import AppUpgradeApi from './jssdk/appUpgrade';

const cookies = new Cookies;
const systemApi = new SystemApi;
const appupgradeApi = new AppUpgradeApi;
let progress = 1;
let isCheckUpdateOver = false;
//全局状态
window.globalState = {
	wifiAccount: 0,
	wifiPassword: 0,
	deviceType: '',
	isLocal: 0,
};
//系统状态
window.system = {
	networkStatus: 1,
	mqttStatus: 0,
	isLocal: 0
};

//统一监听原生回调
jsBridge.listen();

//获取设备id
systemApi.getDeviceId().then(res => {
	cookies.set('clientId', res.deviceId);
	if (res.phoneId) {
		cookies.set('phoneId', res.phoneId);
	}
	if (res.os) {
		cookies.set('os', res.os);
	}
});


//监听网络变化
systemApi.onNetworkStatusChange(function(res){
  window.system.networkStatus = parseInt(res.state);
});

// const store = createStore(
// 	reducer,
// 	composeWithDevTools(
// 		applyMiddleware(thunk)
// 	),
// );

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk),
  // other store enhancers if any
);

//const store = createStore(
//	reducer,
//	composeWithDevTools(
//		applyMiddleware(thunk)
//	),
//);

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  compose(applyMiddleware(thunk)),
);
  
//隐藏弹窗
let handleHideDialog = ({dispatch}) => {
  dispatch(hideDialog());
};

//隐藏弹窗
let handleShowDialog = ({dispatch}) => {
  dispatch(showDialog());
};

let Dialog = connect(state => state.dialog)(DialogNormal);

const rootElement = (
	<Provider store={store}>
	 <Fragment>
	  	<Router>
	  		<Switch>
					<Route path="/user" render={ props => <User {...props} />} />
					<Route render={ props => <App {...props} />} />
			</Switch>
		  </Router>
	  	<Dialog onHide={handleHideDialog}/>
   </Fragment>
  </Provider>
);

ReactDOM.render(rootElement, document.getElementById('root'),() => {
	console.log("isCheckUpdateOver = " + isCheckUpdateOver);
	if(!isCheckUpdateOver){
		appupgradeApi.checkUpdateH5({
			url:"http://192.168.6.116/pack/readme.txt"
		}).then(res =>{
			isCheckUpdateOver = true;
			if(res.versionDiff <= 0){
				return;
			}
			console.log("ssssssssssssssssssssssssssssssssssssssssss",res);
			let updateType = 0;
			let newVersion = res.newVersion;
			// 全包
			if(res.versionDiff >= 2){
				updateType = 1;
			}
			
			store.dispatch(showDialog("Discovery new version",res.updateInfo,
							[{
								text: "Cancel",
								handleClick: function cancel() {
									this.hide();
								},
							},
							{
								text: "Update",
								handleClick: function cancel() {
									this.hide();
									
									appupgradeApi.startUpdateH5({
										type:updateType,
										url:updateType == 0?"http://192.168.6.116/pack/patch.zip":"http://192.168.6.116/pack/all.zip",
										version:newVersion
									});
									
									appupgradeApi.onUpdateProgressNotify(function(res){
											console.log("onUpdateProgressNotify",res);
											if(res.code == 200){
												if(res.value >= 100){
													store.dispatch(hideDialog());
													Toast.info("Update success");
												} else {
													store.dispatch(showProgressDialog("",res.value,null));
												}
											} else {
												store.dispatch(hideDialog());
												Toast.info("Update failed");
											}
										});
								},
							}]));
		});
	}
	
	
});
registerServiceWorker();
