import React, {
	Component
} from 'react';
import './default/style.css';
import { connect } from 'react-redux';
import { Lang } from '../public';
import { Route, Link } from 'react-router-dom';
import PullToRefresh from 'antd-mobile/lib/pull-to-refresh';
import 'antd-mobile/lib/pull-to-refresh/style/css';
import ListView from 'antd-mobile/lib/list-view';
import 'antd-mobile/lib/list-view/style/css';
import BarTitle from '../component/barTitle';
import SceneIcon from './component/sceneIcon'
import { showDialog, selectTab } from '../action';
import Toast from 'antd-mobile/lib/toast';
import Scene from '../jssdk/scene';
import Cookies from 'universal-cookie';
import { selectSceneIcon, editSceneName, changeSceneListEdit, changeDeleteSceneIds, changeEditSceneId, changeSelectStatus, setSceneRuleItem, setSceneList, setSceneItems, setControlDeviceId, setRefreshSceneList, changeIsAllOn, setEditRuleItems, setIsTouchList, clearIsTouchList } from '../action';
import { fetchSceneList } from '../action/scene';
import 'antd-mobile/lib/toast/style/css';
import { bindActionCreators } from 'redux';

const ds = new ListView.DataSource({
	rowHasChanged: (r1, r2) => r1 !== r2
});
let moveStartX = 0;
let moveStartY = 0;
let moveEndY = 0;
let moveEndX = 0;

let timeOutEvent = 0;
let isTouch = 0;

class SceneStart extends Component {
	cookies = new Cookies();

	constructor(props) {
		super(props);

		this.state = {
			effect: 'home-start',
			second: 3,
			sceneList: this.props.scenes,
			refreshing: this.props.isRefreshList || true,
			empty: false,
			isEdit: this.props.isEdit,
			isVisibility: false,
			executeSceneName: '',
		}

		const {
			dispatch
		} = props;
		this.dispatch = dispatch;

		this.sceneApi = new Scene;

		this.handleClick = this.handleClick.bind(this);
		this.handleAddClick = this.handleAddClick.bind(this);
		this.handleEditClick = this.handleEditClick.bind(this);
		this.handleRefresh = this.handleRefresh.bind(this);
		this.removeEditState = this.removeEditState.bind(this);
		this.handleOnTouchStart = this.handleOnTouchStart.bind(this);
		this.handleOnTouchMove = this.handleOnTouchMove.bind(this);
		this.handleOnTouchEnd = this.handleOnTouchEnd.bind(this);
		this.setBackgroundImg = this.setBackgroundImg.bind(this);
	}

	handleRefresh(event) {
		console.log("main handleRefresh 触发 ");
		//	this.setState({refreshing: true});
		//	this.props.setRefreshSceneList(true);
		this.fetchList();
	}

	handleAddClick(event) {
//			let i = 0;
//			setInterval(()=>{
//				i++;
//				this.sceneApi.test({
//					num:i
//				});
//			},10);
			
		this.props.setIsTouchList();
		console.log("handleAddClick", this.props.isTouchList);

		this.props.selectSceneIcon(null);
		this.props.editSceneName('');
		this.props.changeEditSceneId('');
		this.props.changeSelectStatus([]);
		this.props.setSceneRuleItem(null);
		this.props.setControlDeviceId('');
		this.props.changeIsAllOn(true);
		this.props.setEditRuleItems({});
		localStorage.setItem('sceneRuleCount', 0);
		this.props.history.push('/scene/add');

		this.setState({
			isEdit: false
		});
		this.props.changeSceneListEdit(false);
	}

	handleEditClick(event) {
		// 已是编辑状态，修改为非编辑状态
		if(this.state.isEdit) {
			this.setState({
				isEdit: false
			});
			this.props.changeSceneListEdit(false);
		} else {
			this.setState({
				isEdit: true
			});
			this.props.changeSceneListEdit(true);
		}
	}

	removeEditState() {
		console.log("removeEditState", this.props.isTouchList);
		console.log("removeEditState state.isEdit = ", this.state.isEdit);
		console.log("removeEditState props.isEdit = ", this.props.isEdit);
		console.log("this.props.match=", this.props.match);

		if(isTouch) {
			isTouch = 0;
			return;
		}
		// 已是编辑状态，修改为非编辑状态
		if(this.state.isEdit && !this.props.isTouchList) {
			console.log("取消编辑模式");
			this.setState({
				isEdit: false
			});
			this.props.changeSceneListEdit(false);
		}
	}

	componentDidMount() {
		this.props.clearIsTouchList();
		this.setState({
			isEdit: false
		});
		this.props.changeSceneListEdit(false);
		console.log("main componentDidMount 触发 ");
		this.fetchList();
		
		const { currentHomeId, familyItems } = this.props;
		if (currentHomeId) {
			this.setBackgroundImg(familyItems[currentHomeId].icon);
		}
	}

	fetchList() {
		const {
			actions
		} = this.props;
		actions.fetchSceneList({
			homeId: this.props.currentHomeId,
			cookieUserId: this.cookies.get('userId'),
		});
	}

	handleClick(event) {
		this.setState({
			effect: 'home-start hide-pull-left'
		});
	}

	handleDeleteScene(event, sceneInfo) {
		console.log("handleDeleteScene sceneInfo = ", sceneInfo);
		event.stopPropagation(); //阻止事件冒泡，不触发父级容器的 removeEditState 事件

		if(window.system.networkStatus == 0) {
			Toast.info(Lang.scene.createScene.checkNetwork);
			return;
		}
		let that = this;
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
					Toast.loading("", 10, null, true);

					const data = {
						sceneId: sceneInfo.sceneId
					};
					console.log("要删除的SceneId = ", sceneInfo.sceneId);
					setTimeout(() => {
						that.deleteTimeOut(sceneInfo.sceneId);
					}, 60000);
					that.sceneApi.delete({
						userId: that.cookies.get('userId'),
						payload: data
					}).then(res => {
						if(res.ack.code != 200) {
							throw res;
						}
						that.deleteSuccess(res.payload.sceneId);
						//						let idx = res.payload.idx;
						//						// 如果没有规则数据，则直接判定为删除成功
						//						if(idx == null || idx.length <= 0) {
						//							that.deleteSuccess(res.payload.sceneId);
						//						} else { // 有规则，则需规则全部删除后才算删除成功
						//							const items = {};
						//							items[res.payload.sceneId] = idx;
						//
						//							that.props.changeDeleteSceneIds(items);
						//
						//							for(let i = 0; i < idx.length; i++) {
						//								const deletRuleData = {
						//									sceneId: sceneInfo.sceneId,
						//									idx: idx[i]
						//								};
						//								console.log("要删除idx[i]  = " + idx[i]);
						//								that.sceneApi.deleteRule({
						//									userId: that.cookies.get('userId'),
						//									payload: deletRuleData
						//								}).then(res => {
						//									let deleteIdx = that.props.deleteSceneIds[res.payload.sceneId];
						//									for(let j = 0; j < deleteIdx.length; j++) {
						//										if(deleteIdx[j] == res.payload.idx) {
						//											deleteIdx.splice(j, 1);
						//										}
						//									}
						//
						//									const deleteItems = {};
						//									deleteItems[res.payload.sceneId] = deleteIdx;
						//									that.props.changeDeleteSceneIds(deleteItems);
						//
						//									// 如果已没有可删除的设备规则，则判定该场景删除成功
						//									if(deleteIdx == null || deleteIdx.length <= 0) {
						//										that.deleteSuccess(res.payload.sceneId);
						//									}
						//
						//								}).catch(res => {
						//									Toast.info(res.ack.desc || res.desc);
						//								});
						//							}
						//
						//							setTimeout(() => {
						//								that.deleteTimeOut(res.payload.sceneId);
						//							}, 10000)
						//						}

					}).catch(res => {
						Toast.info(Lang.scene.deleteScene.deleteFail);
					});
				}
			}
		]);
	}

	deleteTimeOut(sceneId) {
		//		let deleteIdx = this.props.deleteSceneIds[sceneId]
		//		// 如果已没有可删除的设备规则，则判定该场景删除成功
		//		if(deleteIdx == null || deleteIdx.length <= 0) {
		//			return;
		//		}
		//		this.props.deleteSceneIds[sceneId];
		if(this.props.sceneItems[sceneId] != undefined && this.props.sceneItems[sceneId] != null) {
			Toast.info(Lang.scene.deleteScene.deleteTimeOut);
			this.fetchList();
		}

	}

	/**
	 * 删除成功的处理
	 */
	deleteSuccess(sceneId) {
		console.log("deleteSuccess sceneId = " + sceneId);
		let dataSource = this.props.scenes;
		for(let i = dataSource.length - 1; i >= 0; i--) {
			console.log("dataSource[i].sceneId = " + dataSource[i].sceneId);
			if(dataSource[i].sceneId == sceneId) {
				console.log("第" + i + "个场景被删除");
				Toast.info(dataSource[i].name + Lang.scene.deleteScene.success);
				delete this.props.sceneItems[dataSource[i].sceneId];
				this.props.setSceneItems(this.props.sceneItems);
				dataSource.splice(i, 1);
			}
		}
		this.setState({
			sceneList: dataSource
		});

		console.log(JSON.stringify(dataSource));

		localStorage.setItem('sceneList', JSON.stringify(dataSource));
	}

	handleSceneClick(event, sceneInfo) {
		// 编辑状态，进入编辑界面
		if(this.state.isEdit) {
			event.stopPropagation(); //阻止事件冒泡，不触发父级容器的 removeEditState 事件

			this.props.setIsTouchList();
			console.log("handleAddClick", this.props.isTouchList);

			this.props.selectSceneIcon(sceneInfo.icon);
			this.props.editSceneName(sceneInfo.name);
			this.props.changeEditSceneId(sceneInfo.sceneId);
			this.props.changeSelectStatus([]);
			this.props.setSceneRuleItem(null);
			this.props.setControlDeviceId('');
			this.props.changeIsAllOn(true);
			this.props.setEditRuleItems({});
			localStorage.setItem('sceneRuleCount', 0);
			this.props.history.push('/scene/add');
			this.setState({
				isEdit: false
			});
			this.props.changeSceneListEdit(false);
		} else { // 非编辑状态，执行场景

			if(this.state.isVisibility) {
				return;
			}
			let that = this;
			const executeData = {
				sceneId: sceneInfo.sceneId,
			};

			if(sceneInfo.ruleCount <= 0) {
				event.stopPropagation(); //阻止事件冒泡，不触发父级容器的 removeEditState 事件
				this.props.setIsTouchList();
				console.log("handleAddClick", this.props.isTouchList);

				this.props.selectSceneIcon(sceneInfo.icon);
				this.props.editSceneName(sceneInfo.name);
				this.props.changeEditSceneId(sceneInfo.sceneId);
				this.props.changeSelectStatus([]);
				this.props.setSceneRuleItem(null);
				this.props.setControlDeviceId('');
				this.props.changeIsAllOn(true);
				this.props.setEditRuleItems({});
				localStorage.setItem('sceneRuleCount', 0);
				this.props.history.push('/scene/add');
				this.setState({
					isEdit: false
				});
				this.props.changeSceneListEdit(false);
			} else {
				that.setState({
					executeSceneName: sceneInfo.name
				});
				that.showExecuteAnim(sceneInfo);
				this.sceneApi.execute({
					userId: this.cookies.get('userId'),
					payload: executeData
				}).then(res => {
					
				}).catch(res => {
					if(res && res.desc) {
						Toast.info(res.desc);
					} else if(res && res.ack && res.ack.desc) {
						Toast.info(res.ack.desc);
					}
					//					Toast.info(res.ack.desc || res.desc);
				});
			}

			//		if(this.state.isVisibility){
			//			this.hideExecuteDiv();
			//		} else {
			//			this.showExecuteDiv();
			//		}

		}

	}

	/**
	 *  开始执行的动画
	 */
	showExecuteAnim(scene) {
		let that = this;
		var sceneBg = document.getElementById("sceneBg_" + scene.sceneId);
		var sceneIcon = document.getElementById("sceneIcon_" + scene.sceneId);
		sceneIcon.classList.add('scene_icon_anim');
		sceneBg.classList.add('sceneBg_anim');
		console.log("showExecuteAnim scene.sceneId = " + scene.sceneId);
		this.setState({
			isVisibility: true
		});

		setTimeout(() => {
			that.closeExecuteAnim(scene);
		}, 3000);
	}

	/**
	 * 关闭执行的动画
	 */
	closeExecuteAnim(scene) {
		console.log("closeExecuteAnim scene.sceneId = " + scene.sceneId);
		var sceneBg = document.getElementById("sceneBg_" + scene.sceneId);
		var sceneIcon = document.getElementById("sceneIcon_" + scene.sceneId);
		if(sceneBg != null && sceneBg.classList != null) {
			sceneBg.classList.remove('sceneBg_anim');
		}

		if(sceneIcon != null && sceneIcon.classList != null) {
			sceneIcon.classList.remove('scene_icon_anim');
		}

		this.setState({
			isVisibility: false
		});
	}

	showExecuteDiv() {
		var executeDiv = document.getElementById("executeDiv");
		executeDiv.classList.add('show');
		executeDiv.classList.remove('hide');
		this.setState({
			isVisibility: true
		});
		setTimeout(this.hideExecuteDiv, 3000);
		//	setTimeout(() => {
		//		this.hideExecuteDiv()
		//	}, 300)
	}

	hideExecuteDiv() {
		var executeDiv = document.getElementById("executeDiv");
		if(executeDiv != null && executeDiv.classList != null) {
			executeDiv.classList.add('hide');
			executeDiv.classList.remove('show');
		}

		//	this.setState({isVisibility: false});
	}

	handleOnTouchStart(event, sceneInfo) {
		moveStartX = event.touches[0].pageX;
		moveStartY = event.touches[0].pageY;
		timeOutEvent = setTimeout(() => {
			this.handleLongPress(event);
		}, 1000);
		console.log("handleOnTouchStart moveStartX = " + moveStartX + "  moveStartY = " + moveStartY);
		console.log("handleOnTouchStart timeOutEvent = " + timeOutEvent);
		console.log("handleOnTouchStart", this.props.isTouchList);
	}

	handleOnTouchMove(event, sceneInfo) {
		moveEndX = event.touches[0].pageX;
		moveEndY = event.touches[0].pageY;

		let xDistance = 0;
		let yDistance = 0;
		if(moveEndX > moveStartX) {
			xDistance = moveEndX - moveStartX;
		} else {
			xDistance = moveStartX - moveEndX;
		}

		if(moveEndY > moveStartY) {
			yDistance = moveEndY - moveStartY;
		} else {
			yDistance = moveStartY - moveEndY;
		}
		console.log("handleOnTouchMove moveEndX = " + moveEndX + "  moveEndY = " + moveEndY);
		console.log("handleOnTouchMove timeOutEvent = " + timeOutEvent);
		if(xDistance >= 3 || yDistance >= 3) {
			clearTimeout(timeOutEvent);
			timeOutEvent = 0;
		}

	}

	handleOnTouchEnd(event, sceneInfo) {
		console.log("handleOnTouchEnd timeOutEvent = " + timeOutEvent);
		clearTimeout(timeOutEvent);
		if(timeOutEvent != 0) {
			this.handleSceneClick(event, sceneInfo);
		}

		//		this.props.clearIsTouchList();
		console.log("handleOnTouchEnd", this.props.isTouchList);

		isTouch = 1;
	}

	handleLongPress(event) {
		timeOutEvent = 0;
		this.handleEditClick();
		console.log("handleLongPress 触发");
	}
	
	setBackgroundImg(image) {
		if (image.substring(0, 1) == "#") {
			let backgroundImg = document.getElementById("sceneMainId");
			if(backgroundImg){
				backgroundImg.style.backgroundColor = image;
				backgroundImg.style.backgroundImage = 'none';
			}
		} else if (image != '') {
			let backgroundImg = document.getElementById("sceneMainId");
			if(backgroundImg){
				backgroundImg.style.backgroundImage = 'url('+require('../public/resource/image/a023/'+image)+')';
			}
		} else {
			let backgroundImg = document.getElementById("sceneMainId");
			if(backgroundImg){
				backgroundImg.style.backgroundImage = 'url('+require('../public/resource/image/a023/bg.png')+')';
			}
		}
	}


	render() {
		let dataSource = ds.cloneWithRows(this.props.scenes);
		let row = (item, sid, rid) => {
			return <div className="list-item"
      			  key={rid}
      			  >
      					{this.state.isEdit?<div className="delete_icon" onClick={e => this.handleDeleteScene(e,item)}></div>:""}
      					<div className="list-item-child" onTouchStart={e => this.handleOnTouchStart(e,item)}  onTouchMove={e => this.handleOnTouchMove(e,item)} onTouchEnd={e => this.handleOnTouchEnd(e,item)}>
      							<div id={'sceneBg_' + item.sceneId} className="sceneBg"/>
		      					<SceneIcon id={'sceneIcon_' + item.sceneId} type={item.icon} />
		      					
		              	<p className="scene-name">{item.name}</p>
		              	{this.state.isEdit?<div className="arrow"></div>:""}
	      				</div>
             </div>
		};
		
		const { currentHomeId, familyItems } = this.props;
		let familyName = '';
		if (currentHomeId) {
			familyName = familyItems[currentHomeId].name;
			this.setBackgroundImg(familyItems[currentHomeId].icon);	
		}

		return(
			<div id="sceneMainId" className="scene scene_bg" onClick={this.removeEditState}>
    		<div id="executeDiv" className="executeScene">
    				<div className="wrapper">
					     <div className="line1"></div>
					     <div className="line2"></div>
					     <div className="line3"></div>
					     <div className="line4"></div>
					     <div className="line5"></div>
					     <div className="line6"></div>
					     <div className="line7"></div>
					     <div className="line8"></div>
					     <div className="line9"></div>
					     <div className="line10"></div>
					     <div className="line11"></div>
					     <div className="line12"></div>
					</div>
	    			<span>
	    				The {this.state.executeSceneName} scene is being executed.
	    			</span>
		    	</div>
    		<BarTitle onAdd={this.handleAddClick} onEdit={this.handleEditClick}>
    			<Link to="/menu" className="icon menu"></Link>
    		</BarTitle>
    		
    		<div className="main">
    			
    			<span className="title">{Lang.scene.title}</span>
    			
    			{
    				this.props.scenes.length || this.props.isRefreshList ?
    				<ListView
		                  key="1"
		                  style={{height: "calc(100vh - 10rem - 64px)"}}
		                  useBodyScroll={false}
		                  dataSource={dataSource}
		                  renderRow={row}
		                  pullToRefresh={
		                    <PullToRefresh
		                      distanceToRefresh={35}
		                      refreshing={this.props.isRefreshList}
		                      indicator={this.state.down ? {} : { deactivate: Lang.refresh.pull, finish: Lang.refresh.finish,activate: Lang.refresh.activate}}
		                      onRefresh={this.handleRefresh}
		                      />}
		                />
    				:
    				<div className="empty-root">
	    				<div className="empty-tip">
	    					<div className="empty-title">{Lang.scene.sceneEmpty}</div>
	    					<span className="empty-content"><br />{Lang.scene.sceneEmptySub}</span>
	    				</div>
    				</div>
    				
    			}
    			
    		</div>
    	</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		selectedTab: state.other.selectedTab,
		selectedIcon: state.scene.selectedIcon,
		editName: state.scene.editName,
		isEdit: state.scene.sceneListEdit,
		currentHomeId: state.family.currentId,
		deleteSceneIds: state.scene.deleteSceneIds,
		editSceneId: state.scene.editSceneId,
		scenes: state.scene.scenes,
		sceneItems: state.scene.sceneItems,
		isRefreshList: state.scene.isRefreshList,
		isTouchList: state.scene.isTouchList,
		familyItems: state.family.items || null
	}
}

const mapDispatchToProps = dispatch => {
	return {
		selectTab: (...args) => dispatch(selectTab(...args)),
		showDialog: (...args) => dispatch(showDialog(...args)),
		selectSceneIcon: (...args) => dispatch(selectSceneIcon(...args)),
		editSceneName: (...args) => dispatch(editSceneName(...args)),
		changeSceneListEdit: (...args) => dispatch(changeSceneListEdit(...args)),
		changeDeleteSceneIds: (...args) => dispatch(changeDeleteSceneIds(...args)),
		changeEditSceneId: (...args) => dispatch(changeEditSceneId(...args)),
		changeSelectStatus: (...args) => dispatch(changeSelectStatus(...args)),
		setSceneRuleItem: (...args) => dispatch(setSceneRuleItem(...args)),
		setSceneList: (...args) => dispatch(setSceneList(...args)),
		setSceneItems: (...args) => dispatch(setSceneItems(...args)),
		setControlDeviceId: (...args) => dispatch(setControlDeviceId(...args)),
		setRefreshSceneList: (...args) => dispatch(setRefreshSceneList(...args)),
		actions: bindActionCreators({
			fetchSceneList
		}, dispatch),
		changeIsAllOn: (...args) => dispatch(changeIsAllOn(...args)),
		setEditRuleItems: (...args) => dispatch(setEditRuleItems(...args)),
		setIsTouchList: (...args) => dispatch(setIsTouchList(...args)),
		clearIsTouchList: (...args) => dispatch(clearIsTouchList(...args)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SceneStart)