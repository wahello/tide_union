import React,  { Component } from 'react';
import ReactDOM from 'react-dom'
import { showDialog, objectsUpdatingDone, selectSpace } from '../action/index';
import { connect } from 'react-redux';
import Lang from '../i18n/index';
import Space from '../jssdk/space'
import Cookies from 'universal-cookie';
import 'antd-mobile/lib/pull-to-refresh/style/css';
import ListView from 'antd-mobile/lib/list-view';
import 'antd-mobile/lib/list-view/style/css';
import BarTitle from '../component/barTitle'
import './default/style.css';
import SceneWhiteIcon from "./component/sceneWhiteIcon";


const spaceLang = Lang.space;
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class RoomIcon extends Component {

    constructor(props) {
        super(props);

        let listCache = localStorage.getItem('spaceList');
        let space = listCache && JSON.parse(listCache) || [
            {sceneIcon:"at_home",checked:false},
    		{sceneIcon:"go_away",checked:false},
    		{sceneIcon:"good_morning",checked:false},
    		{sceneIcon:"good_morning2",checked:false},
    		{sceneIcon:"good_night",checked:false},
    		{sceneIcon:"good_night2",checked:false},
    		{sceneIcon:"watch_movie",checked:false},
    		{sceneIcon:"movie2",checked:false},
    		{sceneIcon:"reading_book",checked:false},
    		{sceneIcon:"reading_book2",checked:false},
    		{sceneIcon:"watch_movie2",checked:false}
        ]
        this.state = {
            space: space,
            refreshing: false,
            empty: false
        }

        this.space = new Space();

        this.goToDetail = this.goToDetail.bind(this);
        this.handleOnOff = this.handleOnOff.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleClickBack = this.handleClickBack.bind(this);
    }
    
    
	handleClickCheck(item){
	  	this.setState({space: this.state.space.map(val => {
	  		console.log("val = " + val.objectName + "  item = " + item.objectName);
	  		if(val === item){
	  			val.checked = !val.checked;
	  		} else{
	  			val.checked = false;
	  		}
	  		
	  		return val;
	  	})})
	  }

    handleClickBack(event){
        this.props.history.goBack();
    }

    goToDetail(e, item){
        e.stopPropagation();
        this.props.selectSpace(item);
        this.props.history.push('/space/detail');
    }

    handleRefresh(){
        this.setState({
            refreshing: true,
        });
        this.updateCache().catch(e => {
            this.setState({refreshing: false});
            this.props.cacheUpdatingDone();
        });
    }

    handleOnOff(spaceInfo){
        this.setState({space: this.state.space.map(item => {
                if(spaceInfo.objectId === item.objectId){
                    item.AllDeviceOnOff = !item.AllDeviceOnOff;
                }
                return item;
            })
        });

        this.space.objectControl({
            objectId: spaceInfo.objectId,
            desiredStatus: [{name: "OnOff", type: "boolean", data: spaceInfo.AllDeviceOnOff ? 1 : 0}]
        }).then(res => {
            if(!(res.CODE == 200 && res.MSG_BODY.result == 1)){
                this.setState({
                    space: this.state.space.map(item => {
                        if(spaceInfo.objectId === item.objectId){
                            item.AllDeviceOnOff = !item.AllDeviceOnOff;
                        }
                        return item;
                    })
                })
            }
        })
        // .catch(res => {
        //   this.props.dispatch(showDialog('关闭失败', '系统错误'));
        // })

    }

    fetchList(){
        const cookies = new Cookies();
        const timer = setTimeout(() => {
            this.fetchList();
        }, 1000 * 1);

        return this.space.queryList({
            userId: cookies.get('userId')

        }).then(res => {
            clearTimeout(timer);
            res = res.filter(item => {return !!item.parentObjectId;});

            localStorage.setItem('spaceList', JSON.stringify(res));
            if(!res.length){
                this.setState({empty: true});
            } else {
                this.setState({
                    space: res,
                    empty: false
                });
            }

        }).catch(e => {
            console.log(JSON.stringify(e));
        });
    }

    updateCache(){
        return this.space.updateObjectListCache().then(res => {
            this.props.cacheUpdatingDone();
            this.fetchList();
            this.setState({refreshing: false});
        });
    }


    componentDidMount(){
        this.updateCache().catch(err => {
            if(err.CODE == -1001){
                this.space.onceMQTTConnected(res => {
                    this.updateCache().catch(e => {});
                });
            }

        });

        if(this.props.selectedSpace){
            const spaceInfo =  this.props.selectedSpace;
            this.setState({
                space: this.state.space.map(item => (item.objectId == spaceInfo.objectId ? spaceInfo : item))
            });
        }

        //this.fetchList();
    }

    render() {
        let dataSource = ds.cloneWithRows(this.state.space);
        let row = (item, sid, rid) => {
            return <div className={item.checked ? "list-item":"list-item-selected"} key={rid} onClick={e => this.handleOnOff(item)}>
                <SceneWhiteIcon type={item.sceneIcon} />
            </div>
        };

        return (
            <div className="scene">
                <div className="scene-icons">
                    <BarTitle onBack={this.handleClickBack} title={Lang.room.title[1]} />
                     <div className="icon-list">
	                     <ListView
	                            key="1"
	                            style={{height: "calc(100vh - 4.08rem - 64px)"}}
	                            useBodyScroll={false}
	                            dataSource={dataSource}
	                            renderRow={row}
	                        />
                     </div>
                        
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        cacheUpdated: state.space.cacheUpdated,
        selectedSpace: state.space.selectedSpace
    }
}

const mapDispatchToProps = dispatch => {
    return {
        cacheUpdatingDone: () => dispatch(objectsUpdatingDone()),

        showDialog: (...args) => dispatch(showDialog(...args)),

        selectSpace: (...args) => dispatch(selectSpace(...args))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomIcon)