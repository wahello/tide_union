import React, { Component } from 'react';
import './default/style.css';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import { bindActionCreators } from 'redux';
import { Lang } from '../public';
import { Route, Link } from 'react-router-dom';
import BarTitle from '../component/barTitle';
import Switch from '../component/switch';
import { PullToRefresh, Toast, SwipeAction, List } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import ScrollView from '../component/scrollView';
import { showDialog } from '../action';
// import SystemApi from '../jssdk/system';
import {
  getAutomationList,
  getAutoRuleResp,
  setCurAutoItem,
  delAutomation,
  delAutoRule,
  setAutoEnable,
  refreshAutoList,
  setAutoDevices,
} from '../action/automation';

const dialogLang = Lang.public.dialog;
class AutomaitonList extends Component {
  constructor(props) {
    super(props);
    console.log('-------------------------------------hjc enable -------------')
    console.log(this.props.data.enable)
    this.state = {
      enable: this.props.data.enable,
      refreshing: true,
      searching: true
    };
    this.handleClick = this.handleClick.bind(this)
    this.handleSwitchClick = this.handleSwitchClick.bind(this);
    this.handleDelectClick = this.handleDelectClick.bind(this);
    // this.setBackgroundImg = this.setBackgroundImg.bind(this);
  }

  handleClick(item) {
    this.props.handleClick(item);
  }

  handleSwitchClick() {
    const enable = this.state.enable ==1 ? 0 :1
    var autoId = this.props.data.id
    this.setState({ enable });
    // this.props.data.enable = enable;
    this.props.makeEnable({
      "payload": {
        autoId,
        enable
      }
    }).then((res) => {
      console.log('----------------------enable------------------')
      console.log(res)
      if (res === undefined) {
        Toast.info('Please reset it');
      }else if(res.ack){
        Toast.info(res.ack.desc);
      }else if(res.desc){
        Toast.info(res.desc);
      }
    })
  }
  componentWillReceiveProps(nextProps) {
     const enable = this.props.data.enable ==1 ? 1 :0
     this.setState({ enable });
  }
  handleDelectClick() {
    this.props.handleDelectClick()
  }
  render() {
    // const funcDelect = this.handleDelectClick
    return (

      <SwipeAction
        style={{ backgroundColor: '#035483', }}
        autoClose
        right={[

          {
            text: Lang.home.addRoom.remove,
            onPress: this.handleDelectClick,
            style: { backgroundColor: '#FF5858', color: 'white', borderRadius: '0.34rem', border: '0px solid #303548', margin: "7px 16px 7px 0px" },
          },
        ]}
        onOpen={() => console.log('global open')}
        onClose={() => console.log('global close')}
      >
        <List.Item >
          <div className="list-li" onClick={this.handleClick}>
            {this.props.data.type === "dev" ? <i className={this.state.enable ==1 ? 'icon-1 act' : 'icon-1'}></i> : ""}
            {this.props.data.type === "timer" ||  this.props.data.type === "sunrise" || this.props.data.type === "sunset" ? <i className={this.state.enable==1 ? 'icon-2 act' : 'icon-2'}></i> : ""}
            <p style={{ float: "left" }}>{this.props.data.name}</p>
            
            <Switch style={{ float: "right" }} onClick={this.handleSwitchClick} checked={this.state.enable ==1 ?true :false} />
            {/* <span>{Lang.automation.remove.txt}</span> */}
          </div>
        </List.Item>
      </SwipeAction>
    );
  }
}


const cookies = new Cookies;
class Automaiton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      second: 3,
      height: 560
    };
    this.getList = this.getList.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.dealEnableShowError = this.dealEnableShowError.bind(this);
    this.setBackgroundImg = this.setBackgroundImg.bind(this);
  }

  getList() {
    this.setState({
      refreshing: true
    });
    this.props.actions.refreshAutoList(false);
    this.props.actions.getAutomationList({
      "cookieUserId": cookies.get("userId"),
      "cookieUserToken": cookies.get("accessToken"),
      "homeId": this.props.currentHomeId
    }).then((res) => {
  
      this.setState({
        refreshing: false
      }
      , this.dealEnableShowError
    )
    }).catch(e => { console.log(e) })
  }


  dealEnableShowError() {
    console.log("dealEnableShowError")
    Object.keys(this.refs).forEach((i) => {
      console.log(this.refs[i].state.enable)
    })
  }

  componentDidMount() {
    this.getList();
    const hei = window.innerHeight - 176;
    setTimeout(() => this.setState({
      height: hei
    }), 0);
    
    const { currentHomeId, familyItems } = this.props;
	if (currentHomeId) {
		this.setBackgroundImg(familyItems[currentHomeId].icon);
	}
  }
  componentWillReceiveProps() {
    this.props.actions.setAutoDevices(this.props.deviceItem)
    this.props.refresh && this.getList();
  }
  handleClick(data) {
    this.props.actions.getAutoRuleResp({
      payload: { autoId: data.id }
    }).then((res) => {
//    var a = JSON.parse(JSON.stringify(res))
      // console.log("handleClick")
      // console.log(res)
      if(res&&res.ack&&res.ack.code ==200){
        let url = (data.type === "timer" ||  data.type === "sunrise" || data.type === "sunset") ? '/automation/timeofday' : '/automation/create';
        let dataObj = Object.assign({ ...res.payload }, { autoName: data.name, "type": "edit" })
        this.props.actions.setCurAutoItem(dataObj)
        this.props.history.push(url)

      }else{
        if(res&&res.ack){
          Toast.info(res.ack.desc);
        }else{
          Toast.info(res.desc);  
        }
      }
    
    }
      )
  }

  handleAddClick() {
    this.props.history.push('/automation/add');
  }
  bandDelectClick(item) {
    const that = this;
    this.props.showDialog(dialogLang.title[0], Lang.public.dialog.tip[0], [{
      text: dialogLang.button[0],
      handleClick: function () {
        this.hide();
      }
    }, {
      text: dialogLang.button[1],
      handleClick: function () {
        that.props.actions.delAutomation({
          "payload": {
            autoId: item.id
          }
        }).then((res) => {
          console.log("________delete_______res_______hjc_______")
          console.log(res)
          if(res&&res.ack){
            switch (res.ack.code) {
              case -1: {
                Toast.info(res.desc);
                break;
              }
              case -2: {
                Toast.info(res.desc);
                break;
              }
              case 200:
                Toast.info(Lang.automation.success);
                that.getList();
                break;
              default:
                break
            }
          }else{
            Toast.info(res.desc);
          }
          
        })
        this.hide();
      }
    }]);
  }
  
  setBackgroundImg(image) {
		if (image.substring(0, 1) == "#") {
			let backgroundImg = document.getElementById("automationMainId");
			if(backgroundImg){
				backgroundImg.style.backgroundColor = image;
				backgroundImg.style.backgroundImage = 'none';
			}
		} else if (image != '') {
			let backgroundImg = document.getElementById("automationMainId");
			if(backgroundImg){
				backgroundImg.style.backgroundImage = 'url('+require('../public/resource/image/a023/'+image)+')';
			}
		} else {
			let backgroundImg = document.getElementById("automationMainId");
			if(backgroundImg){
				backgroundImg.style.backgroundImage = 'url('+require('../public/resource/image/a023/bg.png')+')';
			}
		}
	}

  render() {
  	
  	const { currentHomeId, familyItems } = this.props;
	let familyName = '';
	if (currentHomeId) {
		familyName = familyItems[currentHomeId].name;
		this.setBackgroundImg(familyItems[currentHomeId].icon);	
	}
	
    return (
      <div id="automationMainId" className="automation main">
        <BarTitle onAdd={this.handleAddClick}>
          <Link to="/menu" className="icon menu"></Link>
          {/* <Link to="/ipccamera/home"><h1>IPC</h1></Link> */}
        </BarTitle>
        <p className="tit">{Lang.automation.title}</p>
        {
          this.props.autoMationList.length == 0 ?
            <div className="emptyInfo">
              <p className="title">{Lang.automation.noAutomation.title}</p>
              <p className="hint">{Lang.automation.noAutomation.hint}</p> 
            </div>
            :
            <div className="pull_refresh">
              <PullToRefresh
                // pageSize = {5}
                refreshing={this.state.refreshing}
                indicator={this.state.down ? {} : { deactivate: Lang.refresh.pull, finish: Lang.refresh.finish,activate: Lang.refresh.activate}}
                style={{
                  height: this.state.height,
                  overflow: 'auto',
                }}
                onRefresh={() => {
                  this.setState({
                    refreshing: true,
                    searching: true,
                  });
                  setTimeout(() => {
                    this.getList()
                  }, 1000);
                  setTimeout(() => {
                    this.setState({
                      refreshing: false,
                      searching: false,
                    });
                  }, 5000)
                }}
              >
                <List className="automation-list">
                  {
                    this.props.autoMationList.map((item, index) => {
                      console.log('---auto item----', item);
                      const cloneitem = {...item};
                      return <AutomaitonList 
                        data={cloneitem} 
                        ref={cloneitem.autoId} 
                        key={cloneitem.autoId} 
                        handleClick={this.handleClick.bind(this, cloneitem)} 
                        handleDelectClick={this.bandDelectClick.bind(this, cloneitem)} 
                        makeEnable={this.props.actions.setAutoEnable} />
                    })
                  }
                </List>
              </PullToRefresh>
            </div>
        }
      </div>
    );
  }
}


const mapStateToProps = (state, ownProps) => {

  // console.log(state.automation.autoMationList)
  // console.log('-----------------------------------autoMationList-------------------')
  return {
    autoMationList: state.automation.autoMationList,
    autoMationRule: state.automation.autoMationRule,
    refresh: state.automation.refreshAuto,
    currentHomeId: state.family.currentId,
    deviceItem: state.device.items,
    familyItems: state.family.items || null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showDialog: (title, tip, btns) => {
      dispatch(showDialog(title, tip, btns))
    },
    actions: bindActionCreators({
      getAutomationList,
      getAutoRuleResp,
      setCurAutoItem,
      delAutomation,
      delAutoRule,
      setAutoEnable,
      refreshAutoList,
      setAutoDevices
    },
      dispatch),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Automaiton);
