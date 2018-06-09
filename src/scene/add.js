import React, {
	Component
} from 'react';
import './default/style.css';
import { connect } from 'react-redux';
import { Lang } from '../public';
import { Route, Link } from 'react-router-dom';
import BarTitle from '../component/barTitle';
import Cookies from 'universal-cookie';
import helper from '../public/helper';
import ListView from 'antd-mobile/lib/list-view';
import ReactDOM from 'react-dom';
import SystemApi from '../jssdk/system';
import SceneIcon from './component/sceneIcon'
import { selectSceneIcon, editSceneName, changeSelectStatus, setSceneRuleItem, setControlDeviceId, showDialog, selectTab, setRefreshSceneList,changeIsAllChecked,changeIsAllOn,setEditRuleItems,changeFromPage,setAllBulbDeviceItems,clearIsTouchList} from '../action';
import Toast from 'antd-mobile/lib/toast';
import { createForm } from 'rc-form';
import Scene from '../jssdk/scene';
import {saveDeviceItem,setRecordAttr} from '../action/device';
import { fetchSceneList } from '../action/scene';
import { bindActionCreators } from 'redux';
import Device from '../jssdk/device';

function MyBody(props) {
	return(
		<div className="my-body" >
      <span style={{ display: 'none' }}>you can custom body wrap element</span>
      {props.children}
    </div>
	);
}

//const data = [
//{
//	deviceId:'1',
//  img: '$img-dir/sign_in_logo_wifi_lighting.png',
//  title: 'Bulb 1',
//  des: 'Bedroom',
//  selected: false,
//  devType:'RGBW',
//  isOnline:true
//},
//{
//	deviceId:'2',
//  img: "$img-dir/sign_in_logo_wifi_lighting.png",
//  title: 'Bulb 2',
//  des: 'Study',
//  selected: false,
//  devType:'RGBW',
//  isOnline:true
//},
//{
//	deviceId:'3',
//  img: "$img-dir/sign_in_logo_wifi_lighting.png",
//  title: 'Bulb 3',
//  des: 'Study',
//  selected: true,
//  devType:'RGBW',
//  isOnline:true
//},
//{
//	deviceId:'4',
//  img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
//  title: 'Bulb 4',
//  des: '',
//  selected: false,
//  devType:'CCT',
//  isOnline:false
//},
//];

let data = [];
let NUM_SECTIONS = 1;
let NUM_ROWS_PER_SECTION = data.length;
let pageIndex = 0;
let sceneRuleCount = 0;
// const dataBlobs = {'Section 0': "Section 0","cell1":"cell1","cell2":"cell2","cell3":"cell3"};
let sectionIDs = ["Section 0"];
// let rowIDs = [["cell1","cell2","cell3"],];
const dataBlobs = {};
// let sectionIDs = [];
let rowIDs = [];

let selectStatus = [];

function genData(pIndex = 0) {
	for(let i = 0; i < NUM_SECTIONS; i++) {
		const ii = (pIndex * NUM_SECTIONS) + i;
		const sectionName = `Section ${ii}`;
		// sectionIDs.push(sectionName);
		dataBlobs[sectionName] = sectionName;
		rowIDs[ii] = [];

		for(let jj = 0; jj < NUM_ROWS_PER_SECTION; jj++) {
			const rowName = `S${ii}, R${jj}`;
			rowIDs[ii].push(rowName);
			dataBlobs[rowName] = rowName;
		}
	}
	sectionIDs = [...sectionIDs];
	rowIDs = [...rowIDs];
}

class AddScene extends Component {
	cookies = new Cookies();

	constructor(props) {
		super(props);
		
		console.log('结果this.props.sceneRuleItem = ', this.props.sceneRuleItem);

		this.handleClick = this.handleClick.bind(this);
		this.systemApi = new SystemApi;

		const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
		const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];

		const dataSource = new ListView.DataSource({
			getRowData,
			getSectionHeaderData: getSectionData,
			rowHasChanged: (row1, row2) => row1 !== row2,
			sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
		});

		this.state = {
			dataSource,
			height: document.documentElement.clientHeight * 3 / 4,
			sceneName: this.props.editName || '',
			editSceneId: this.props.editSceneId || '',
			isModify: false,
			selectStatus: [],
			tempSelectStatus: {},
			editRuleItems:this.props.editRuleItems,
		};

		const {
			dispatch
		} = props;
		this.dispatch = dispatch;

		this.sceneApi = new Scene;
		this.device = new Device;

		sceneRuleCount = Number(localStorage.getItem('sceneRuleCount'));
		console.log("init sceneRuleCount = ", sceneRuleCount);
		this.handleDeleteScene = this.handleDeleteScene.bind(this);
		this.pushview = this.pushview.bind(this);
		this.onBack = this.onBack.bind(this);
		this.inputChange = this.inputChange.bind(this);
		this.clearInput = this.clearInput.bind(this);
		this.handleIconClick = this.handleIconClick.bind(this);
		this.handleClickSave = this.handleClickSave.bind(this);
		this.handleClickAllChecked = this.handleClickAllChecked.bind(this);
		this.handleClickOnOff = this.handleClickOnOff.bind(this);
	}
	
	/**
	 * 添加设备选中的规则
	 */
	addDeviceRule(deviceId){
		console.log('#######Before addDeviceRule：',this.props.editRuleItems);
		if(this.props.editRuleItems[deviceId] == undefined || this.props.editRuleItems[deviceId] == null) {
			// 如果在规则中有存在，则用原规则的配置
			if(this.props.sceneRuleItem != null && this.props.sceneRuleItem[deviceId] != undefined) {
				this.props.editRuleItems[deviceId] = { ...this.props.sceneRuleItem[deviceId].attr};
				
			} else{// 如果在规则中不存在，则用设备当前的状态值进行配置
				this.props.editRuleItems[deviceId] = { ...this.props.deviceItem[deviceId].attr};
			}
			
			this.props.setEditRuleItems(this.props.editRuleItems);
			this.setState({
					editRuleItems:this.props.editRuleItems
				});
		}
		console.log('#######addDeviceRule：',this.props.editRuleItems);
	}
	
	/**
	 * 删除设备的规则
	 */
	deleteDeviceRule(deviceId){
		if(this.props.editRuleItems[deviceId] != undefined) {
			delete this.props.editRuleItems[deviceId];
			this.props.setEditRuleItems(this.props.editRuleItems);
			this.setState({
					editRuleItems:this.props.editRuleItems
				});
		}
		
		console.log('#######deleteDeviceRule：',this.props.editRuleItems);
	}
	
	/**
	 * 处理All bulb的开关动作
	 */
	handleClickOnOff(event){
		let newIsAllOn = !this.props.isAllOn;
		console.log('handleClickOnOff = ', newIsAllOn);
		this.props.changeIsAllOn(newIsAllOn);
		if(this.props.isAllChecked){
			this.props.setAllBulbDeviceItems([]);
			data.map((data) => {
				// 设备在线，更新设备开关状态到全选所设定的开关状态
				if(this.props.deviceItem[data].online == 1){
					this.changeDevicesRule({
						deviceId:data,
						isOn:newIsAllOn
					});
					
					// 给每个设备发送控制指令
					this.controlDeviceOnOff({
						deviceId:data,
						isOn:newIsAllOn
					});
				}
			});
		}
	}
	
	/**
	 * 控制设备开关，主要用于All blub的开关处理
	 */
	controlDeviceOnOff(params){
	  	let that = this;
	  	let onOff = 0;
	  	if(params.isOn){
	  		onOff = 1;
	  	}
	  	
	  	this.props.allBulbItems.push(params.deviceId);
	  	this.props.setAllBulbDeviceItems(this.props.allBulbItems);
	  	console.log('设置this.props.allBulbItems：',this.props.allBulbItems);
	  	
	  	this.device.setDevAttrReq({
			parentId:that.props.deviceItem[params.deviceId].parentId || params.deviceId,
	  		payload:{
	  			devId:params.deviceId,
	  			attr:{
	  				"OnOff":onOff
	  			}
	  		}
	  	}).then(res => {
	    });
  	}
	
	changeDevicesRule(params){
		console.log('设置：'+this.props.deviceItem[params.deviceId].name + "为" + params.isOn);
		if(this.props.editRuleItems[params.deviceId] != undefined) {
			let onOff = 0;
		  	if(params.isOn){
		  		onOff = 1;
		  	}
	  	
			this.props.editRuleItems[params.deviceId].OnOff = onOff;
			this.props.setEditRuleItems(this.props.editRuleItems);
			this.setState({
					editRuleItems:this.props.editRuleItems
				});
		}
		console.log('#######changeDevicesRule：',this.props.editRuleItems);
	}
	
	handleClickAllChecked(event){
		let newCheckedStatus = !this.props.isAllChecked;
		console.log('newCheckedStatus = ', newCheckedStatus);
		console.log('Before this.props.isAllChecked = ', this.props.isAllChecked);
		this.props.changeIsAllChecked(newCheckedStatus);
		
		console.log('After this.props.isAllChecked = ', this.props.isAllChecked);
		this.props.setAllBulbDeviceItems([]);
		
		data.map((data) => {
			
			// 如果当前状态和All blub的选中状态不一致，则需要更新当前遍历设备的选中状态
			if(selectStatus[data] != newCheckedStatus && this.props.deviceItem[data].online == 1){
				selectStatus[data] = newCheckedStatus;
				
				// 如果是选中，则规则数+1
				if(newCheckedStatus){
					sceneRuleCount = sceneRuleCount + 1;
				} else{// 如果是未选中，则规则数-1
					sceneRuleCount = sceneRuleCount - 1;
				}
				
				
				localStorage.setItem('sceneRuleCount', sceneRuleCount);
		
				console.log('sceneRuleCount = ', sceneRuleCount);
				this.setState({
					selectStatus: selectStatus
				});
				
				console.log('selectStatus = ', this.state.selectStatus);
				console.log("data = ", data);
			}
			
			
			if(this.props.deviceItem[data].online == 1){
				if(newCheckedStatus){
					this.addDeviceRule(data);
				} else{
//					this.deleteDeviceRule(data);
				}
				
				// 修改设备规则到对应的状态
				this.changeDevicesRule({
						deviceId:data,
						isOn:this.props.isAllOn
					})
				
				// 选中全选的话就要发送控制指令
				if(newCheckedStatus){
					// 给每个设备发送控制指令
					this.controlDeviceOnOff({
						deviceId:data,
						isOn:this.props.isAllOn
					});
				}
			
			}
		});
	}
	
	checkeIsAllCheck(){
		let isAllCheck = true;
		console.log("sceneRuleItem = ", this.props.sceneRuleItem);
		// 遍历所有设备，如果所有设备都为选中状态，则判定为全选
		for(let i = 0; i < data.length; i++){
			if(this.props.deviceItem[data[i]].online == 1){
				if(this.props.selectStatus[data[i]] == undefined || !this.props.selectStatus[data[i]]){
					isAllCheck = false; 
					break;
				}
			}
		}
		
		console.log("isAllCheck = ", isAllCheck);
		this.props.changeIsAllChecked(isAllCheck);
		
		// 如果是全选，则需遍历所有设备的开关是否一样，如果一样则采用对应的开关状态设置All bulb的开关
		if(isAllCheck){
			let modifyAllOn=true;
			// 遍历第一个设备的开关状态
			let firstOnOff=0;
			
			for(let i = 0; i < data.length; i++){
				console.log("this.props.deviceItem[data[i]] = ", this.props.deviceItem[data[i]]);
				if(this.props.deviceItem[data[i]].online == 1){
					console.log("this.props.selectStatus[data[i]] = ", this.props.selectStatus[data[i]]);
					if(this.props.selectStatus[data[i]] != undefined && this.props.selectStatus[data[i]]){
						// 记录第一个设备的开关状态
						if(i == 0){
							firstOnOff = this.props.editRuleItems[data[i]].OnOff;
						}
						
						// 如果设备的开关状态和第一个设备不同，则代表全选的状态不相同，不变更All bulb的开关状态
						if(this.props.editRuleItems[data[i]].OnOff != firstOnOff){
							modifyAllOn=false;
							break;
						}
					}
				}
			}
			// 如果需要修改All bulb的开关状态，则根据第一个设备的开关状态进行配置
			if(modifyAllOn){
				if(firstOnOff == 1){
					this.props.changeIsAllOn(true);
				} else{
					this.props.changeIsAllOn(false);
				}
			}
		}
		
		return isAllCheck;
	}

	handleIconClick(event) {
		this.props.editSceneName(this.state.sceneName);
		this.props.changeSelectStatus(this.state.selectStatus);
		this.props.history.push('/scene/update/icon');
	}

	onBack(event) {
		let that = this;
		let isModify = false;
		console.log("this.state.isModify = ", isModify);
		if(this.props.editSceneId != '') {

			console.log("this.props.sceneItems = ", this.props.sceneItems);
			console.log("this.state.sceneName = " + this.state.sceneName + "   propName = " + this.props.sceneItems[this.props.editSceneId].name);
			console.log("this.props.selectedIcon = " + this.props.selectedIcon + "   propIcon = " + this.props.sceneItems[this.props.editSceneId].icon);
			console.log("sceneRuleCount = " + sceneRuleCount + "  ruleCount = " + this.props.sceneItems[this.props.editSceneId].ruleCount);
			// 名称和之前不一致
			if(this.state.sceneName != this.props.sceneItems[this.props.editSceneId].name) {
				this.setState({
					isModify: true
				});
				isModify = true;
			}

			// 图和之前不一致
			if(this.props.selectedIcon != this.props.sceneItems[this.props.editSceneId].icon) {
				this.setState({
					isModify: true
				});
				isModify = true;
			}

			// 当前勾选的规则数量和之前的不一致
			if(sceneRuleCount != this.props.sceneItems[this.props.editSceneId].ruleCount) {
				this.setState({
					isModify: true
				});
				isModify = true;
			} else { // 数量一致的话检测当前规则和之前的规则是否一致
				if(this.props.sceneRuleItem != null && this.props.sceneRuleItem != undefined){
					for(let i = 0; i < this.props.deviceList.length; i++) {
						// 与之前的规则不一致，则判定为有改变
						if(this.props.sceneRuleItem[this.props.deviceList[i]] != null && this.props.editRuleItems[this.props.deviceList[i]] != null && this.props.sceneRuleItem[this.props.deviceList[i]] != undefined && this.props.editRuleItems[this.props.deviceList[i]] != undefined ){
							if(!this.isObjectValueEqual(this.props.sceneRuleItem[this.props.deviceList[i]].attr.valueOf(),this.props.editRuleItems[this.props.deviceList[i]].valueOf())){
								isModify = true;
								break;
							}
						}
					}
				}
				
			}

		} else {
			console.log("this.state.sceneName = ", this.state.sceneName);
			console.log("this.props.selectedIcon = ", this.props.selectedIcon);
			console.log("sceneRuleCount = ", sceneRuleCount);
			if(this.state.sceneName != '' || this.props.selectedIcon != null || sceneRuleCount > 0) {
				console.log("有修改哦");
				this.setState({
					isModify: true
				});
				isModify = true;
			}
		}

		console.log("after this.state.isModify = ", isModify);

		if(isModify) {
			this.props.showDialog(Lang.public.dialog.title[0], Lang.scene.createScene.saveChangeDialog, [{
					text: Lang.public.dialog.button[0],
					handleClick: function() {
						this.hide();
						that.props.clearIsTouchList();
						that.props.setRefreshSceneList(false);
						that.props.history.goBack();
					}
				},
				{
					text: Lang.public.dialog.button[1],
					className: "btn-split",
					handleClick: function() {
						this.hide();
						that.handleClickSave(event);
					}
				}
			]);
		} else {
			this.props.setRefreshSceneList(false);
			this.props.clearIsTouchList();
			this.props.history.goBack();
		}
	}
	
	/**
	 * 用于判断两个规则配置是否一致
	 */
	isObjectValueEqual(a, b) {
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);

        if (aProps.length != bProps.length) {
            return false;
        }

        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];

            if (a[propName] !== b[propName]) {
                return false;
            }
        }

        return true;
    }
	
	checkAllBulbOver(){
		for(let i = 0; i < 100; i ++){
			if(this.props.allBulbItem == null || this.props.allBulbItem.length == 0){
				break;
			} 
		}
		console.log("成功");
	}
	
	/**
	 * 获取场景名称的长度，1个中文字符占2个长度
	 */
	getSceneNameLength(){
		let len = 0;    
	    for (let i=0; i<this.state.sceneName.length; i++) {    
	        if (this.state.sceneName.charCodeAt(i)>127 || this.state.sceneName.charCodeAt(i)==94) {    
	             len += 2;    
	         } else {    
	             len ++;    
	         }    
	     }    
	    return len;
	}
	
	/**
	 * 获取新的Attr(用于保存或编辑规则的时候)
	 */
	getNewAttr(oldAttr){
		let newAttr = {};
								
		newAttr.OnOff = oldAttr.OnOff;
		
		if(newAttr.OnOff){
			if(oldAttr.CCT){
				newAttr.CCT = oldAttr.CCT;
			}
			
			if(oldAttr.Dimming){
				newAttr.Dimming = oldAttr.Dimming;
			}
			
			if(oldAttr.RGBW){
				newAttr.RGBW = oldAttr.RGBW;
				// 如果有RGBW的值，则要删除掉CCT。（CCT和RGBW不能共存）
				if (newAttr.CCT !== undefined){
					delete newAttr.CCT;	
				}
			}
		}
		
		return newAttr;
	}

	handleClickSave(event) {
		if(this.checkNetwork()){
			return;
		}
		
		let that = this;
		//验证场景数量是否超过25个
		if(this.props.scenes.length >= 25 && this.props.editSceneId == '') {
			Toast.info(Lang.scene.createScene.sceneUpper);
			return;
		}
		// 验证是否有选择图标
		if(!this.props.selectedIcon) {
			Toast.info(Lang.scene.createScene.iconNull);
			return;
		}
		
		// 验证是否有输入场景名称
		if(!this.state.sceneName) {
			Toast.info(Lang.scene.createScene.sceneNameNull);
			return;
		}
		
		let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
		    regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
		    
		// 验证场景名称中是否有特殊符号
		if(regEn.test(this.state.sceneName) || regCn.test(this.state.sceneName)) {
			Toast.info(Lang.scene.createScene.sceneNameNonstandard);
		    return;
		}
		
		// 验证场景名称的长度是否超过30个字符
		if(this.getSceneNameLength() > 30) {
			Toast.info(Lang.scene.createScene.sceneNameToLong);
			return;
		}
		
		Toast.loading("", 0, null, true);
//		Toast.loading("", 30, function() {
//			Toast.hide();
//		}, true);
//		this.checkAllBulbOver();
		// 创建场景
		if(this.props.editSceneId == '') {
			
			const parameter = {
				cookieUserId: this.cookies.get('userId'),
				name: this.state.sceneName,
				icon: this.props.selectedIcon,
				homeId: this.props.currentHomeId
			};

			that.setState({
				tempSelectStatus: {}
			});
//			that.setState({
//				tempSelectStatus: that.props.editRuleItems
//			});

			this.handleAddScene(parameter);
		} else { // 编辑场景
			const parameter = {
				cookieUserId: this.cookies.get('userId'),
				sceneId: this.props.editSceneId,
				name: this.state.sceneName,
				icon: this.props.selectedIcon,
				homeId: this.props.currentHomeId
			};

			that.setState({
				tempSelectStatus: {}
			});
			
			this.handleEditScene(parameter);
		}
	}
	
	handleEditScene(parameter){
		let that = this;
		this.sceneApi.editScene(parameter).then(res => {
				if(res.code != 200) {
					throw res;
				}

				// 编辑大场景成功后开始修改规则
				let editSceneId = that.props.editSceneId;

				let isNoRule = true;
				let editRuleCount = 0;
				
				console.log("selectStatus.length = ", that.state.selectStatus);
				for(let i = 0; i < that.props.deviceList.length; i++) {
					console.log("that.state.selectStatus[that.props.deviceList[i]] = ", that.state.selectStatus[that.props.deviceList[i]]);
					if(that.state.selectStatus[that.props.deviceList[i]] !== undefined) {
						console.log("sceneRuleItem = " + that.props.sceneRuleItem[that.props.deviceList[i]]);
						let editIdx = 'null';
						if(that.props.sceneRuleItem[that.props.deviceList[i]] != undefined) {
							editIdx = that.props.sceneRuleItem[that.props.deviceList[i]].idx;
						}

						console.log("editIdx = ", editIdx);
						// 选中的则保存规则
						if(that.state.selectStatus[that.props.deviceList[i]]) {
							isNoRule = false;
							editRuleCount = editRuleCount + 1;
							console.log("11111111111111111");
							// 如果之前有IDX，证明为编辑规则，则调用编辑
							if(editIdx !== 'null' && editIdx !== '') {
								console.log("2222222222222222222222");
								let newAttr = that.getNewAttr(that.props.editRuleItems[that.props.deviceList[i]]);
								
								console.log("编辑新的规则 = ",newAttr);
								
								const editRuleAttr = {
									sceneId: editSceneId+"",
									idx: editIdx,
									thenType: "Dev",
									id: that.props.deviceList[i],
									attr: newAttr
								};
								let deviceItem =that.props.deviceItem[that.props.deviceList[i]];
								if(deviceItem.communicationMode =="BLE"){
									editRuleAttr.devType = deviceItem.devType;
								   }

								// 添加大场景成功后开始保存规则
								const editRuleParameter = {
									userId: that.cookies.get('userId'),
									payload: editRuleAttr
								};
								console.log("编辑前内容", that.props.sceneRuleItem[that.props.deviceList[i]].valueOf());
								console.log("编辑后内容", that.props.editRuleItems[that.props.deviceList[i]].valueOf());
								
								that.state.tempSelectStatus[that.props.deviceList[i]] = that.props.editRuleItems[that.props.deviceList[i]];
								that.setState({
									tempSelectStatus: that.state.tempSelectStatus
								});
								// 当前编辑后的值和之前规则的值不同时才发送编辑请求
								if(!that.isObjectValueEqual(that.props.sceneRuleItem[that.props.deviceList[i]].attr.valueOf(),that.props.editRuleItems[that.props.deviceList[i]].valueOf())){
									console.log("开始编辑", that.props.deviceList[i]);
									
								
									that.sceneApi.editSceneRuleReq(editRuleParameter).then(res => {
										console.log('-----------------------------editScencRule---------',res)
										if(res.ack.code != 200) {
											throw res;
										}
										editRuleCount = editRuleCount - 1;
										console.log("editRuleCount = ", editRuleCount);
										delete that.state.tempSelectStatus[res.payload.id];
										that.setState({
											tempSelectStatus: that.state.tempSelectStatus
										});
										//						        			that.setState({selectStatus: selectStatus});
										if(editRuleCount <= 0) {
											that.editSuccess();
											//						        				Toast.info("场景编辑成功");
											//						        				that.props.setRefreshSceneList(true);
											//				      							that.props.history.goBack();
										}
									}).catch(res => {
										editRuleCount = editRuleCount - 1;
										if(editRuleCount <= 0) {
											that.editTimeOut();
										}
									});
								} else{
									// 不需要更新，但是还是要把对应的规则数据本地删除
									setTimeout(() => {
										editRuleCount = editRuleCount - 1;
										console.log("不需要更新 = ", that.props.deviceList[i]);
										delete that.state.tempSelectStatus[that.props.deviceList[i]];
										that.setState({
											tempSelectStatus: that.state.tempSelectStatus
										});
										if(editRuleCount <= 0) {
											that.editSuccess();
										}
									}, 500);
									
								}
								
							} else { // 之前没有IDX，证明为新增的设备规则，则应该为保存
								console.log("3333333333333333333333");
								let newAttr = that.getNewAttr(that.props.editRuleItems[that.props.deviceList[i]]);
								
								console.log("保存新的规则 = ",newAttr);
								const addRuleAttr = {
									sceneId: editSceneId+"",
									idx:  Number((new Date().getTime() + '').substr(4, 9)),
									thenType: "Dev",
									id: that.props.deviceList[i],
									attr: newAttr
								};
								// 添加大场景成功后开始保存规则
								const addRuleParameter = {
									userId: that.cookies.get('userId'),
									payload: addRuleAttr
								};

								that.state.tempSelectStatus[that.props.deviceList[i]] = that.props.editRuleItems[that.props.deviceList[i]];
								that.setState({
									tempSelectStatus: that.state.tempSelectStatus
								});
								console.log("编辑中开始保存", that.props.deviceList[i]);
								that.sceneApi.addSceneRuleReq(addRuleParameter).then(res => {

									if(res.ack.code != 200) {
										throw res;
									}
									editRuleCount = editRuleCount - 1;
									console.log("editRuleCount = ", editRuleCount);
									delete that.state.tempSelectStatus[res.payload.id];
									that.setState({
										tempSelectStatus: that.state.tempSelectStatus
									});
									console.log("保存结果 = ", that.state.tempSelectStatus);
									if(editRuleCount <= 0) {
										that.editSuccess();
									}
								}).catch(res => {
									editRuleCount = editRuleCount - 1;
									if(editRuleCount <= 0) {
										that.editTimeOut();
									}
								});
							}

						} else { // 删除规则
							console.log("4444444444444444");
							if(editIdx !== 'null') {
								isNoRule = false;
								editRuleCount = editRuleCount + 1;
								const deleteRuleAttr = {
									sceneId: editSceneId+"",
									idx: editIdx,
									devId:that.props.deviceList[i]
								};
								// 添加大场景成功后开始保存规则
								const deleteRuleParameter = {
									userId: that.cookies.get('userId'),
									payload: deleteRuleAttr
								};
								
								that.state.tempSelectStatus[that.props.deviceList[i]] = that.props.editRuleItems[that.props.deviceList[i]];
								that.setState({
									tempSelectStatus: that.state.tempSelectStatus
								});

								console.log("开始删除", that.props.deviceList[i]);
								that.sceneApi.deleteRule(deleteRuleParameter).then(res => {
									if(res.ack.code != 200) {
										throw res;
									}
									editRuleCount = editRuleCount - 1;
									console.log("editRuleCount = ", editRuleCount);
									delete that.state.tempSelectStatus[res.payload.id];
									that.setState({
										tempSelectStatus: that.state.tempSelectStatus
									});
									//						        			that.setState({selectStatus: selectStatus});
									if(editRuleCount <= 0) {
										that.editSuccess();
										//						        				Toast.info("场景编辑成功");
										//						        				that.props.setRefreshSceneList(true);
										//				      							that.props.history.goBack();    
									}
								}).catch(res => {
									editRuleCount = editRuleCount - 1;
									if(editRuleCount <= 0) {
										that.editTimeOut();
									}
								});
							}

						}

					}

				}

				if(isNoRule) {
					that.editSuccess();
				} else {
					console.log("准备等待超时");
					setTimeout(() => {
						console.log("编辑超时，剩余" + editRuleCount);
						Toast.hide();
						if(editRuleCount > 0) {
							that.editTimeOut();
						}
					}, 15000);
				}
			}).catch(res => {
				console.log("出现异常 ",res);
				Toast.hide();
				if(res != null && res.desc != null){
					Toast.info(res.desc);
				}
			});
	}
	
	handleAddScene(parameter){
		let that = this;
		// 创建场景的逻辑
		this.sceneApi.addScene(parameter).then(res => {
			if(res.code != 200) {
				throw res;
			}
			let addSceneId = res.data.sceneId;

			let isNoRule = true;
			let addRuleCount = 0;
			console.log("selectStatus.length = ", that.state.selectStatus);
			for(let i = 0; i < that.props.deviceList.length; i++) {
				if(that.state.selectStatus[that.props.deviceList[i]] !== undefined) {
					// 选中的则保存规则
					if(that.state.selectStatus[that.props.deviceList[i]]) {
						isNoRule = false;
						addRuleCount = addRuleCount + 1;
						let newAttr = that.getNewAttr(that.props.editRuleItems[that.props.deviceList[i]]);
							
						console.log("保存新的规则 = ",newAttr);
						const addRuleAttr = {
							sceneId: addSceneId+"",
							idx: Number((new Date().getTime() + '').substr(4, 9)),
							thenType: "Dev",
							id: that.props.deviceList[i],
							attr: newAttr
						};
						let deviceItem =that.props.deviceItem[that.props.deviceList[i]];
						if(deviceItem.communicationMode =="BLE"){
						 addRuleAttr.devType = deviceItem.devType;
						}

						
						// 添加大场景成功后开始保存规则
						const addRuleParameter = {
							userId: that.cookies.get('userId'),
							payload: addRuleAttr
						};

						that.state.tempSelectStatus[that.props.deviceList[i]] = that.props.editRuleItems[that.props.deviceList[i]];
						that.setState({
							tempSelectStatus: that.state.tempSelectStatus
						});
						console.log("开始保存", that.props.deviceList[i]);
						that.sceneApi.addSceneRuleReq(addRuleParameter).then(res => {
							console.log('--------------------------------addSceneRule -----------hjc    -----',res)
							if(res.ack.code != 200) {
								throw res;
							}
							addRuleCount = addRuleCount - 1;
							console.log("addRuleCount = ", addRuleCount);
							delete that.state.tempSelectStatus[res.payload.id];
							that.setState({
									tempSelectStatus: that.state.tempSelectStatus
								});
							//						        			that.setState({selectStatus: selectStatus});
							console.log("保存结果 = ", this.state.tempSelectStatus);
							if(addRuleCount <= 0) {
								that.createSuccess();
							}
						}).catch(res => {
							addRuleCount = addRuleCount - 1;
							if(addRuleCount <= 0) {
								that.addTimeOut();
							}
						});
					}

				}

			}

			if(isNoRule) {
				that.createSuccess();
				//			      	Toast.info("场景创建成功");
				//			      	that.props.setRefreshSceneList(true);
				//			      	that.props.history.goBack();    
			} else {
				console.log("准备等待超时");
				setTimeout(() => {
					console.log("添加超时，剩余" + addRuleCount);
					Toast.hide();
					if(addRuleCount > 0) {
						that.addTimeOut();
					}
				}, 15000)
			}

		}).catch(res => {
			console.log("出现异常 ",res);
			Toast.hide();
			if(res != null && res.desc != null){
				Toast.info(res.desc);
			}
		});
	}

	editSuccess() {
		Toast.info(Lang.scene.createScene.editSuccess);
		this.props.clearIsTouchList();
		this.props.history.goBack();
		this.fetchList();
	}

	createSuccess() {
		Toast.info(Lang.scene.createScene.createSuccess);
		this.props.clearIsTouchList();
		this.props.history.goBack();
		this.fetchList();
	}

	fetchList() {
		const {
			actions
		} = this.props;
		actions.fetchSceneList({
			homeId: this.props.currentHomeId,
			cookieUserId: this.cookies.get('userId')
		});
	}
	
	checkNetwork(){
		console.log("window.system.networkStatus = ",window.system.networkStatus);
		if(window.system.networkStatus == 0){
			this.props.showDialog("", Lang.system.noNetwork, [{
					text: Lang.system.noNetworkBtn,
					handleClick: function() {
						this.hide();
					}
				}
			]);
			return true;
		}
		
		return false;
	}

	handleDeleteScene() {
		if(this.checkNetwork()){
			return;
		}
		
		if(this.state.isLoading == undefined){
			return;
		}
		let that = this;
		if(this.props.editSceneId != '') {

			that.props.showDialog("", Lang.scene.delete.sureDelete, [{
					text: Lang.public.dialog.button[0],
					handleClick: function() {
						this.hide();
					}
				},
				{
					text: Lang.public.dialog.button[1],
					className: "btn-split",
					handleClick: function() {
						this.hide();
						Toast.loading("", 0, null, true);

						const data = {
							sceneId: that.props.editSceneId
						};
						setTimeout(() => {
								that.deleteTimeOut(that.props.editSceneId);
							}, 60000);
							
						that.sceneApi.delete({
							userId: that.cookies.get('userId'),
							payload: data
						}).then(res => {
							if(res.ack.code != 200) {
								throw res;
							}

							Toast.info(that.state.sceneName + Lang.scene.deleteScene.success);
							that.setState({
								editSceneId: ''
							});
							that.props.clearIsTouchList();
							that.props.history.goBack();
							that.fetchList();

						}).catch(res => {
							Toast.info(Lang.scene.deleteScene.deleteFail);
						});
					}
				}
			]);
		}
	}
	
	deleteTimeOut(sceneId) {
		if(this.state.editSceneId != '' && this.props.sceneItems[sceneId] != undefined && this.props.sceneItems[sceneId] != null){
			Toast.info(Lang.scene.deleteScene.deleteTimeOut);
			this.props.clearIsTouchList();
			this.props.history.goBack();
			this.fetchList();
		}
	}

	addTimeOut() {
		let that = this;
		let unAddDevice = '';
		console.log("addTimeOut tempSelectStatus = ", this.state.tempSelectStatus);
		// 遍历获取未保存成功的设备
		for(let i = 0; i < this.props.deviceList.length; i++) {
			console.log("this.props.deviceList[i] = ", this.props.deviceList[i]);
			if(this.state.tempSelectStatus[this.props.deviceList[i]] != undefined) {
				unAddDevice = unAddDevice + this.props.deviceItem[this.props.deviceList[i]].name;
				if(i < this.props.deviceList.length - 1) {
					unAddDevice = unAddDevice + ",";
				}
			}
		}
		unAddDevice = unAddDevice.substring(0, unAddDevice.length - 1);
		Toast.hide();
		this.props.showDialog("", unAddDevice + Lang.scene.createScene.sceneException, [{
			text: Lang.public.dialog.button[1],
			className: "btn-split",
			handleClick: function() {
				this.hide();
				that.props.clearIsTouchList();
				that.props.history.goBack();
				that.fetchList();
			}
		}]);
	}

	editTimeOut() {
		let that = this;
		let unAddDevice = '';
		for(let i = 0; i < this.props.deviceList.length; i++) {
			if(this.state.tempSelectStatus[this.props.deviceList[i]] != undefined) {
				unAddDevice = unAddDevice + this.props.deviceItem[this.props.deviceList[i]].name;
				unAddDevice = unAddDevice + ",";
			}
		}
		unAddDevice = unAddDevice.substring(0, unAddDevice.length - 1);
		Toast.hide();
		this.props.showDialog("", unAddDevice + Lang.scene.createScene.sceneException, [{
			text: Lang.public.dialog.button[1],
			className: "btn-split",
			handleClick: function() {
				this.hide();
				that.props.clearIsTouchList();
				that.props.history.goBack();
				that.fetchList();
			}
		}]);
	}
	

	handleClick(event) {
		this.setState({
			effect: 'home-start hide-pull-left'
		});
	}

	handleClickBack(event) {
		this.props.clearIsTouchList();
		this.props.setRefreshSceneList(false);
		this.props.history.goBack();
	}

	inputChange(e) {
		this.setState({
			sceneName: e.target.value
		})
	}

	clearInput(e) {
		console.log("点击清除数据");
		this.setState({
			sceneName: '',
			isModify: true
		})
	}

	pushview(ev, data) {
		console.log("data.online = ", ev);
		if(ev.online == 0) {
			Toast.info(Lang.scene.createScene.offlineTips);
			return;
		}
		console.log(ev, data);
		this.goToDeviceDetail(ev);
		// body...
	}

	componentDidMount() {
		this.systemApi.offGoBack().onceGoBack(this.onBack);
		let that = this;
		console.log('结果that.props.deviceItem = ', that.props.deviceItem);
		const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
		this.props.changeIsAllChecked(false);
		data = [];
		// 遍历设备列表，筛选出所有的灯设备（目前只有灯能加入到场景中）
		for(let i = 0; i < this.props.deviceList.length; i++) {
			let devType = this.props.deviceItem[this.props.deviceList[i]].devType;
			
			// deviceType中包含Light的都是灯
			if(devType != undefined && (devType.indexOf('Light') > -1 || devType.indexOf('wifi_plug') > -1)) {
				data.push(this.props.deviceList[i]);
				console.log('this.props.deviceList[i] = ', this.props.deviceItem[this.props.deviceList[i]]);
			}
		}
		//  data = [];
		NUM_ROWS_PER_SECTION = data.length;
		// simulate initial Ajax
		selectStatus = this.props.selectStatus;
		that.setState({
			selectStatus: selectStatus
		});
		genData();

		console.log('this.props.controlDeviceId = ', this.props.controlDeviceId);
		console.log('this.props.isControlBackDone = ', this.props.isControlBackDone);
		// 如果有控制修改的设备，要修改最新的设备状态到规则中
		if(this.props.isControlBackDone) {
			if(this.props.controlDeviceId != null && this.props.controlDeviceId != '') {
				if(!selectStatus[this.props.controlDeviceId]) {
					sceneRuleCount = sceneRuleCount + 1;
					localStorage.setItem('sceneRuleCount', sceneRuleCount);
				}
				selectStatus[this.props.controlDeviceId] = true;
				that.setState({
					selectStatus: selectStatus
				});
			}
		}
		
		// editSceneId为空，代表是创建场景
		if(this.props.editSceneId == '') {
			this.props.setSceneRuleItem({});
			this.setState({
				dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
				isLoading: false,
				height: hei,
			});
			
			console.log('this.props.recordAttr = ', this.props.recordAttr);
			// 如果有控制修改的设备，要修改最新的设备状态到规则中
			if(this.props.isControlBackDone) {
				if(this.props.recordAttr.attr){
					this.props.editRuleItems[this.props.controlDeviceId] = {...this.props.recordAttr.attr};
					this.props.setEditRuleItems(this.props.editRuleItems);
				}
				
//				if(this.props.editRuleItems[this.props.controlDeviceId] != null && this.props.editRuleItems[this.props.controlDeviceId] != undefined){
//					if(this.props.deviceItem[this.props.controlDeviceId] != undefined){
//						this.props.editRuleItems[this.props.controlDeviceId] = {...this.props.deviceItem[this.props.controlDeviceId].attr};
//						this.props.setEditRuleItems(this.props.editRuleItems);
//					}
//				}
				this.setState({
							editRuleItems:this.props.editRuleItems
						});
						
				this.props.setControlDeviceId('');
			}
			
//			if(this.props.isControlBackDone) {
//				if(this.props.deviceItem[this.props.controlDeviceId] != undefined){
//					this.props.editRuleItems[this.props.controlDeviceId] = {...this.props.deviceItem[this.props.controlDeviceId].attr};
//					this.props.setEditRuleItems(this.props.editRuleItems);
//					this.setState({
//						editRuleItems:this.props.editRuleItems
//					});
//					
//					this.props.setControlDeviceId('');
//				}
//			}
			this.checkeIsAllCheck();
		} else {
			let sceneRuleItem = that.props.sceneRuleItem;
			console.log('结果sceneRuleItem = ', sceneRuleItem);
			// 如果编辑的时候已经存在规则数据了，证明之前已经获取过，不需要重新再刷新数据
			if(sceneRuleItem != null) {
				this.setState({
					dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
					isLoading: false,
					height: hei,
				});

				console.log('this.props.isControlBackDone = ', this.props.isControlBackDone);
//				if(this.props.isControlBackDone) {
//					if(this.props.deviceItem[this.props.controlDeviceId] != undefined){
//						this.props.editRuleItems[this.props.controlDeviceId] = {...this.props.deviceItem[this.props.controlDeviceId].attr};
//						this.props.setEditRuleItems(this.props.editRuleItems);
//						this.setState({
//							editRuleItems:this.props.editRuleItems
//						});
//						
//	//					if(sceneRuleItem[this.props.controlDeviceId] != null) {
//	//						sceneRuleItem[this.props.controlDeviceId].attr = this.props.deviceItem[this.props.controlDeviceId].attr;
//	//						this.props.setSceneRuleItem(sceneRuleItem);
//	//					}
//						this.props.setControlDeviceId('');
//					}
//					
//				}
				
				console.log('this.props.recordAttr = ', this.props.recordAttr);
			// 如果有控制修改的设备，要修改最新的设备状态到规则中
			if(this.props.isControlBackDone) {
				if(this.props.recordAttr.attr){
					this.props.editRuleItems[this.props.controlDeviceId] = {...this.props.recordAttr.attr};
					this.props.setEditRuleItems(this.props.editRuleItems);
				}
				
//				if(this.props.editRuleItems[this.props.controlDeviceId] != null && this.props.editRuleItems[this.props.controlDeviceId] != undefined){
//					if(this.props.deviceItem[this.props.controlDeviceId] != undefined){
//						this.props.editRuleItems[this.props.controlDeviceId] = {...this.props.deviceItem[this.props.controlDeviceId].attr};
//						this.props.setEditRuleItems(this.props.editRuleItems);
//					}
//				}
				this.setState({
							editRuleItems:this.props.editRuleItems
						});
						
				this.props.setControlDeviceId('');
			}
				
				this.checkeIsAllCheck();

			} else {
				const data = {
					sceneId: this.props.editSceneId
				};
				
//				Toast.loading('', 0);
				// 限制30秒请求超时
				Toast.loading("", 30, function() {
					Toast.hide();
					that.setState({
						dataSource: that.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
						isLoading: false,
						height: hei,
					});
				}, true);
				// 获取场景中的设备规则
				this.sceneApi.getSceneRuleReq({
					userId: this.cookies.get('userId'),
					payload: data
				}).then(res => {
					if(res.ack.code != 200) {
						throw res;
					}
					
					sceneRuleItem = {};
					that.props.setSceneRuleItem(sceneRuleItem);
					
					console.log("准备规则数据 = " , that.props.sceneRuleItem);
					// 验证获取到的规则场景ID是否和当前编辑的场景一致
					if(res.payload.sceneId == that.props.editSceneId) {
						console.log("res.payload.then.length = " , res.payload.then);
						sceneRuleCount = res.payload.then.length;
						localStorage.setItem('sceneRuleCount', sceneRuleCount);

						// 遍历规则，设置规则为选中状态
						for(let i = 0; i < res.payload.then.length; i++) {
							if(that.props.deviceItem[res.payload.then[i].id] != null) {
								sceneRuleItem[res.payload.then[i].id] = {...res.payload.then[i],attr:{...res.payload.then[i].attr}};
								that.props.setSceneRuleItem(sceneRuleItem);
								that.props.editRuleItems[res.payload.then[i].id] = {...res.payload.then[i].attr};
								that.props.setEditRuleItems(that.props.editRuleItems);
								that.setState({
									editRuleItems:this.props.editRuleItems
								});
								selectStatus[res.payload.then[i].id] = true;
							}
						}

						that.setState({
							selectStatus: selectStatus
						});
						console.log('111sceneRuleItem = ', that.props.sceneRuleItem);
					}
					that.setState({
						dataSource: that.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
						isLoading: false,
						height: hei,
					});

					console.log('after selectStatus = ', that.state.selectStatus);
					
					that.checkeIsAllCheck();
					
					Toast.hide();
				}).catch(res => {
					console.log('获取规则异常 = ', res);
					Toast.hide();
					if(res.desc){
						Toast.info(res.desc, 3, null, false);
					} else if(res.ack && res.ack.desc){
						Toast.info(res.ack.desc, 3, null, false);
					}
					
					that.setState({
						dataSource: that.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
						isLoading: false,
						height: hei,
					});
				});
			}
			
		}

		console.log('before selectStatus = ', this.state.selectStatus);
	}
	
	/**
	 * 收到Push上来的消息（这里主要对设备状态上报进行处理）
	 */
	componentWillReceiveProps(nextProps) {
	    if (nextProps.receivePushMessage != null) {
	    	console.log('componentWillReceiveProps = ',nextProps.receivePushMessage);
	    	if(nextProps.receivePushMessage.method != null && nextProps.receivePushMessage.method == 'setDevAttrNotif'){
	    		console.log('nextProps.receivePushMessage.payload.devId = ' + nextProps.receivePushMessage.payload.devId);
	    		console.log('11this.props.allBulbItems = ' , this.props.allBulbItems);
	    		// 如果全选的灯控制返回，则证明执行结果返回，删除该值
	    		if(this.props.allBulbItems != null && this.props.allBulbItems.length > 0){
	    			let deviceIndex = -1;
	    			for(let i = 0; i < this.props.allBulbItems.length; i++){
	    				if(this.props.allBulbItems[i] == nextProps.receivePushMessage.payload.devId){
	    					deviceIndex = i;
	    					break;
	    				}
	    			}
	    			
//	    			if(deviceIndex > -1){
//	    				this.props.allBulbItems.splice(deviceIndex,1);
//	    			}
	    			this.props.setAllBulbDeviceItems(this.props.allBulbItems);
	    			console.log('22this.props.allBulbItems = ', this.props.allBulbItems);
	    		}
	    		
	    	}
	    	
//	    	this.props.allBulbItems
	    }
	        
	    // if (nextProps.pageFrom === 'room' &&  nextProps.queryId == 0) {
	    //   this.fetchUnbindDevice();
	    // }
	  }
	

	imgClick(event, obj, imgid) {
		if(obj.online == 0) {
			Toast.info(Lang.scene.createScene.offlineTips);
			return;
		}

		// 选中设备
		if(this.state.selectStatus[obj.devId]) {
			selectStatus[obj.devId] = false;
			//	 	delete selectStatus[obj.devId];
			sceneRuleCount = sceneRuleCount - 1;
			localStorage.setItem('sceneRuleCount', sceneRuleCount);
			document.getElementById(imgid).setAttribute("class", "noselectImg");
			
//			this.deleteDeviceRule(obj.devId);
		} else { // 去勾选设备
			selectStatus[obj.devId] = true;
			sceneRuleCount = sceneRuleCount + 1;
			localStorage.setItem('sceneRuleCount', sceneRuleCount);
			document.getElementById(imgid).setAttribute("class", "selectedImg");
			
			this.addDeviceRule(obj.devId);
		}

		console.log('sceneRuleCount = ', sceneRuleCount);
		this.setState({
			selectStatus: selectStatus
		});
		console.log('set over selectStatus = ', this.state.selectStatus);
		
		this.checkeIsAllCheck();


		//   if(obj.selected){
		//    obj.selected = false;
		//    document.getElementById(imgid).setAttribute("class", "noselectImg");
		//   }else{
		//    obj.selected = true;
		//    document.getElementById(imgid).setAttribute("class", "selectedImg");
		//   }

	}
	
	goToDeviceDetail(dataDetail) {
		// if(process.env.NODE_ENV === 'development'){
		// 	localStorage.DeviceInfo = JSON.stringify(dataDetail);
		//    this.props.history.push('/device/lamp/control');
		//  }else{
		//    this.device.deviceDetail({deviceId: dataDetail.deviceId});
		//  }
		//离线设备不能控制
		if(dataDetail.online == 0) {
			return;
		}

		localStorage.DeviceInfo = JSON.stringify(dataDetail);
		this.props.editSceneName(this.state.sceneName);

		this.props.setControlDeviceId(dataDetail.devId);
		this.props.changeSelectStatus(this.state.selectStatus);

		
		this.props.saveDeviceItem(dataDetail);

	    this.props.changeFromPage('scene');
	    
	    let recordAttr = null;
	    let isChecked = false;
	    // 如果已有选中在规则中，则使用规则中的配置传递给控制页
	    if(this.props.editRuleItems[dataDetail.devId]){
	    	recordAttr = this.props.editRuleItems[dataDetail.devId];
	    	isChecked = true;
	    } else { // 如果没有保存在规则中，则用设备当前的状态保存在控制页
	    	recordAttr = dataDetail.attr;
	    }
	    
	    console.log('recordAttr = ', recordAttr);
	    console.log('dataDetail.devId = ', dataDetail.devId);
	    
	    this.props.setRecordAttr({
	    	devId:dataDetail.devId,
	    	attr:recordAttr,
	    	isCheck:isChecked
	    });
	    
	    if(dataDetail.devType.indexOf("wifi_plug") >= 0){
			this.props.history.push('/device/wifiPlugDetail');
		} else {
	    	this.props.history.push('/device/control');
	   	}
	}
	
	getCCTContent(cct){
		if(cct == undefined || cct == null){
			return cct;
		}
		
		if(cct >= 2000 && cct < 3000){
			return "Soft white";
		} else if(cct >= 3000 && cct < 5000){
			return "Bright white";
		} else if(cct >= 5000 && cct <= 6500){
			return "Daylight";
		} 
	}
	
	/**
	 * 为亮度增加%的显示
	 */
	getDimmingValue(devId){
		if(!devId){
			return "";
		}
		
		if(this.state.editRuleItems[devId] != null && this.state.editRuleItems[devId].Dimming){
			return this.state.editRuleItems[devId].Dimming + "%";
		} else if(this.state.editRuleItems[devId] == null && this.props.deviceItem[devId].attr.Dimming){
			return this.props.deviceItem[devId].attr.Dimming + "%";
		} else{
			return "";
		}
	}

	render() {
		const separator = (sectionID, rowID) => (
			<div
        key={`${sectionID}-${rowID}`}
        style={{
          // backgroundColor: '$bg-major-color',
          height: "1.25rem",          
        }}
      ></div>
		);
		let index = 0;
		const row = (rowData, sectionID, rowID) => {
			if(index >= data.length) {
				index = 0;
			}
			const obj = data[index++];
			const myindex = index;
			return(

				<div key={rowID} className="cellRow"  >
          <div id={"selectImg"+myindex} className={`${this.state.selectStatus[obj] ? 'selectedImg' : 'noselectImg'}`} onClick={e=>this.imgClick(e,this.props.deviceItem[obj],"selectImg"+myindex)}></div>
          
          <div className="deviceInfo" onClick={e => this.pushview(this.props.deviceItem[obj],rowData)}>
	          <div className={`devices-icon ${this.props.deviceItem[obj].icon == null ? 'default':this.props.deviceItem[obj].icon} ${this.props.deviceItem[obj].online == 0 || ((this.state.editRuleItems[obj] != null &&  !Number(this.state.editRuleItems[obj].OnOff) == 1) || (this.state.editRuleItems[obj] == null && !Number(this.props.deviceItem[obj].attr.OnOff) == 1)) ? 'off' : 'on'}`}>
	          	{this.props.deviceItem[obj].online?'':<div className='devOffline'></div>}
	          </div>
	          <div className="devRight"></div>
	          {this.state.selectStatus[obj]?
	          	<div className='attributeGroup'>
	          		{((this.state.editRuleItems[obj] != null && !Number(this.state.editRuleItems[obj].OnOff) == 1) || (this.state.editRuleItems[obj] == null && !Number(this.props.deviceItem[obj].attr.OnOff) == 1)) ? <div>Off</div> : ''}
	          		{this.state.editRuleItems[obj] != null && Number(this.state.editRuleItems[obj].OnOff) == 1 ? <div>{(this.state.editRuleItems[obj] != null && this.getCCTContent(this.state.editRuleItems[obj].CCT)) || (this.state.editRuleItems[obj] == null && this.getCCTContent(this.props.deviceItem[obj].attr.CCT)) || ''}</div> : ''}
	          		{this.state.editRuleItems[obj] != null && Number(this.state.editRuleItems[obj].OnOff) == 1 && this.state.editRuleItems[obj].RGBW && this.props.deviceItem[obj].devType == 'Light_RGBW' ? <div>RGB</div> : ''}
	          		{this.state.editRuleItems[obj] != null && Number(this.state.editRuleItems[obj].OnOff) == 1 ? <div>{this.getDimmingValue(obj)}</div> : ''}
	          	</div>:""
	          }
		          
	            <div className ="devName">{this.props.deviceItem[obj].name}
	            </div>
	            <div className ="attributionRoomDec">{this.props.roomItem[this.props.deviceItem[obj].roomId] == null? 'Everything else':this.props.roomItem[this.props.deviceItem[obj].roomId].name}
	            </div>
          </div>
        </div>
			);
		};
		const {
			getFieldProps,
			getFieldError
		} = this.props.form;
		return(
				<div className="addOrEideScene">
            <BarTitle onBack={this.onBack} title = {this.props.editSceneId == '' ? Lang.scene.createScene.title:Lang.scene.editScene.title} onDone={this.handleClickSave.bind(this)}></BarTitle>

        <div className="hiTitle">Scene Name</div>
        <div className="inputName">
        	
          <div className="input-image" onClick={this.handleIconClick}>
          	<SceneIcon type={this.props.selectedIcon} />
          </div>
          <input onChange={this.inputChange} value={this.state.sceneName} className="input-name" type="text"  maxLength="30" />
          {this.state.sceneName.length ? <a  className="clear-icon" onClick={this.clearInput}></a> : ''}

        </div>
        <div style={{marginLeft:'0rem'}}>
        	<div className="subtitle">{Lang.scene.createScene.subTitle}</div>
        	
        	{data.length <= 0 ? <div className='empty'>{Lang.scene.createScene.noneDeviceTips}<br/>{Lang.scene.createScene.noneDeviceTips2}</div>:''}
          <ListView
	          ref={el => this.lv = el}
	          dataSource={this.state.dataSource}
	          renderHeader={NUM_ROWS_PER_SECTION > 0? ()=>(
              <div>
			          <div className={`${this.props.isAllChecked ? 'selectedImg' : 'noselectImg'}`} onClick={this.handleClickAllChecked}></div>
			          
			          <div className="deviceInfo">
				          <div className={`devices-icon lighting ${this.props.isAllOn ? 'on' : 'off'}`}></div>
				          <a ref="switchOnOff" className={`device-switch ${this.props.isAllOn ? 'on' : 'off'}`} onClick={this.handleClickOnOff}></a>
					          
				          <div className ="headDevName">{Lang.scene.createScene.allBulb}</div>
			          </div>
			        </div>
			):
			''
	}
	renderFooter = {
		this.props.editSceneId != '' ? () => <div className="removeButton" onClick={this.handleDeleteScene.bind(this)}>Remove</div> : ''
	}
	renderBodyComponent = {
		() => <MyBody />
	}
	renderRow = {
		row
	}
	renderSeparator = {
		separator
	}
	style = {
		data.length > 0 ?
		{
			height: "calc(100vh - 15.08rem - 64px)",
			overflow: 'auto',
		}:{
			height: "8rem",
			overflow: 'auto',
		}
	}
	pageSize = {
		4
	}
	onScroll = {
		() => {
			console.log('scroll');
		}
	}
	scrollRenderAheadDistance = {
		500
	}
	/> <
	/div>

	<
	/div>

);
}
}

const mapStateToProps = state => {
	return {
		selectedIcon: state.scene.selectedIcon,
		editName: state.scene.editName,
		editSceneId: state.scene.editSceneId,
		deviceList: state.device.list,
		deviceItem: state.device.items,
		roomItem: state.room.items,
		selectStatus: state.scene.selectStatus,
		currentHomeId: state.family.currentId,
		sceneRuleItem: state.scene.sceneRuleItems,
		controlDeviceId: state.scene.controlDeviceId,
		selectedTab: state.other.selectedTab,
		scenes: state.scene.scenes,
		sceneItems: state.scene.sceneItems,
		isControlBackDone: state.device.backDone,
		isAllChecked:state.scene.isAllSelected,
		isAllOn:state.scene.isAllOn,
		editRuleItems:state.scene.editRuleItems,
		receivePushMessage:state.system.receivePushMessage,
		allBulbItems:state.scene.allBulbDeviceItems,
		recordAttr:state.device.recordAttr,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		selectSceneIcon: (...args) => dispatch(selectSceneIcon(...args)),
		editSceneName: (...args) => dispatch(editSceneName(...args)),
		changeSelectStatus: (...args) => dispatch(changeSelectStatus(...args)),
		setSceneRuleItem: (...args) => dispatch(setSceneRuleItem(...args)),
		setControlDeviceId: (...args) => dispatch(setControlDeviceId(...args)),
		showDialog: (...args) => dispatch(showDialog(...args)),
		selectTab: (...args) => dispatch(selectTab(...args)),
		setRefreshSceneList: (...args) => dispatch(setRefreshSceneList(...args)),
		actions: bindActionCreators({
			fetchSceneList
		}, dispatch),
		changeIsAllChecked: (...args) => dispatch(changeIsAllChecked(...args)),
		changeIsAllOn: (...args) => dispatch(changeIsAllOn(...args)),
		setEditRuleItems: (...args) => dispatch(setEditRuleItems(...args)),
		saveDeviceItem:(...args) => dispatch(saveDeviceItem(...args)),
		changeFromPage:(...args) => dispatch(changeFromPage(...args)),
		setAllBulbDeviceItems:(...args) => dispatch(setAllBulbDeviceItems(...args)),
		clearIsTouchList:(...args) => dispatch(clearIsTouchList(...args)),
		setRecordAttr:(...args) => dispatch(setRecordAttr(...args)),
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(createForm()(AddScene));