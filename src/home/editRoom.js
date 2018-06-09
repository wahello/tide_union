import React, { Component } from 'react';
import './default/style.css';
import { connect } from 'react-redux';
import { Lang } from '../public';
import BarTitle from '../component/barTitle';
import { showDialog, selectTab } from '../action';
import { createForm } from 'rc-form';
import Cookies from 'universal-cookie';
import Toast from 'antd-mobile/lib/toast';
import 'antd-mobile/lib/toast/style/css';
import userApi from '../jssdk/User';

import { Link } from 'react-router-dom';
import Space from '../jssdk/space'
import ListView from 'antd-mobile/lib/list-view';
import 'antd-mobile/lib/list-view/style/css';
import PullToRefresh from 'antd-mobile/lib/pull-to-refresh';
import 'antd-mobile/lib/pull-to-refresh/style/css';
import roomApi from '../jssdk/room';
import RoomIconClass from "./component/RoomIconClass";
import {selectRoomIcon } from '../action';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class EditRoom extends Component {
  cookies = new Cookies();
	
  constructor(props) { 
  	super(props);
  	
  	let listCache = localStorage.getItem('spaceList');
    let space = listCache && JSON.parse(listCache) || [
    	{objectName:"test",room:"beadroom",checked:false},
    	{objectName:"test2",room:"beadroom",checked:false},
    	{objectName:"test3",room:"beadroom",checked:false},
    	{objectName:"test4",room:"beadroom",checked:false},
    	{objectName:"test5",room:"beadroom",checked:false},
    	{objectName:"test6",room:"beadroom",checked:false}
    ]
  	
    this.state = {
        userName: this.cookies.get('nickName') || 'My name',
        userAccount:this.cookies.get('account') || '',
        userId:this.cookies.get('userId'),
        isEdit: false,
        isCanSave:true,
        space: space,
      refreshing: true,
      empty: false
    };
    
      this.space = new Space();
    const { dispatch } = props;
    this.dispatch = dispatch;
    
    this.handleClickBack = this.handleClickBack.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onEditClick = this.onEditClick.bind(this);
    this.onInputClick = this.onInputClick.bind(this);
    this.handleClickRoot = this.handleClickRoot.bind(this);
    this.handlerClearClick = this.handlerClearClick.bind(this);
     this.handleChangeSecret = this.handleChangeSecret.bind(this);
     this.handleClickCheck = this.handleClickCheck.bind(this);
     this.handleHeadClick =this.handleHeadClick.bind(this)
     this.handleClickDone = this.handleClickDone.bind(this);
  }
  
  handleHeadClick(event){
  	this.props.history.push('/room/roomIcon');
  }
  
  handleClickCheck(item){
  	this.setState({space: this.state.space.map(val => {
  		console.log("val = " + val.objectName + "  item = " + item.objectName);
  		if(val === item){
  			val.checked = !val.checked;
  		} 
  		
  		return val;
  	})})
  }
  
   handleChangeSecret(event) {
    this.setState({isSecret: !this.state.isSecret});
  }
  
  handlerClearClick(event){
  	this.state.isCanSave = false;
  	this.props.form.setFieldsValue({userName: ''})
  }
  
  handleClickBack(event) {
  		this.state.isEdit = false;
		this.props.history.goBack();
	}
  
   handleClickDone(event) {
  	const form = this.props.form;
    const that = this;
    var userNameInput = document.getElementById("user-name-input");
    const parameter = {
      tenantId: '00001',
      icon:"living.png",
      roomId : "00001",
  		cookieUserToken: "ROOM",
  		cookieUserId: this.cookies.get('userId'),
      name : this.cookies.get('account')
    };
    roomApi.update(parameter).then(function(res){
        if(res.code != 200){
          throw res;
        }
				console.log("res.code = " + res.code);
        that.countDown();
      }).catch(function(res){
        that.setState({sendingVerifyCode: false});
      });
	}
  
  handleClickRoot(event){
  	if(this.state.isEdit && this.state.isCanSave){
  		let that = this;
  		let form = this.props.form;
  		let formData = form.getFieldsValue();
  		
  		event.currentTarget.focus();
    
    	form.validateFields();
    	
    	if(form.getFieldError('userName')){
    		Toast.info(form.getFieldError('userName')[0], 3, null, false);
      		return;
    	}
    	
    	const modifyNameParameter = {
          nickName: formData.userName,
          userId: this.state.userId,
        };
    	
    	userApi.modifyUserName(modifyNameParameter).then(res => {
	      if(res.code != 200){
	        throw res;
	      }
	      
	      var userNameRoot = document.getElementById("user-name-root");
			  userNameRoot.style.backgroundColor= "transparent";
			
			  var editNameIconId = document.getElementById("edit-name-icon-id");
			  editNameIconId.style.visibility = "visible";
			
			  var clearIconId = document.getElementById("clear-icon-id");
			  clearIconId.style.visibility = "hidden";
			  
			  var userNameInput = document.getElementById("user-name-input");
			  userNameInput.readOnly = true; 
			  
			   //记住账号
	      let expires = new Date;
	      expires.setDate(expires.getDate() + 30);
			  this.cookies.set('nickName', formData.userName, {expires});
			  this.state.isEdit =false;
	    }).catch(res => {
	    	that.dispatch(showDialog( res.desc))
	    });
  	}
  	
  	this.state.isCanSave = true;
  }
  
  onInputClick(){
  	this.state.isEdit = true;
  	
  	var userNameRoot = document.getElementById("user-name-root");
  	var userNameInput = document.getElementById("user-name-input");
		
		userNameRoot.style.backgroundColor= "$bg-nav-top-color";
		
		var editNameIconId = document.getElementById("edit-name-icon-id");
		editNameIconId.style.visibility = "hidden";
		
		var clearIconId = document.getElementById("clear-icon-id");
		clearIconId.style.visibility = "visible";
		
		userNameInput.readOnly = false;
  }
  
  
  onEditClick(event){
  	this.state.isCanSave = false;
  	
  	this.onInputClick();
  }
  
  /*
   * 删除房间
   */
  onRemove(event){
    const form = this.props.form;
    const that = this;
    var userNameInput = document.getElementById("user-name-input");
    const parameter = {
      roomId : '00001',
      cookieUserToken:"0001",
  		cookieUserId: this.cookies.get('userId'),
    };
    roomApi.deleteRoom(parameter).then(function(res){
        if(res.code != 200){
          throw res;
        }
        
        that.props.showDialog(Lang.public.dialog.title[0], Lang.home.editRoom.sureDeleteRoom, [
      {
          text: Lang.public.dialog.button[0],
          handleClick: function(){
            this.hide();
          }
      },
      {
          text: Lang.public.dialog.button[1],
          className: "btn-split",
          handleClick: function(){
            this.hide();
            that.props.history.replace('/home');
            that.props.selectTab('device');
          }
      }]);
      
				console.log("res.code = " + res.code);
        that.countDown();
      }).catch(function(res){
        that.setState({sendingVerifyCode: false});
      });
  }
  
  render() {
  	  let checkboxIcon = (this.state.isSecret ? "close" : "open");
  	 let dataSource = ds.cloneWithRows(this.state.space);
    let row = (item, sid, rid) => {
      return <div className="list-item" key={rid} >
     					 	<div className ="space-account">
     					 	<span></span>
     						<b>{item.objectName}</b>
              	<p>{item.room}</p>
     					 	<a className={item.checked ? "close" : "open"} href="javascript:;" onClick={e => this.handleClickCheck(item)}></a>
              	</div>
              	
            </div>
    };

  	const { getFieldProps, getFieldError} = this.props.form;
    return (
    	<div className="room" onClick={this.handleClickRoot}>
    		<BarTitle onBack={this.handleClickBack} title={Lang.home.editRoom.title}  onDone={this.handleClickDone}>
    		</BarTitle>
    		<div className='addRoom-bodyer'>
	        	<div className='user-head-icon' onClick = {this.handleHeadClick}>
	        			<div className="background-image">
	        				<RoomIconClass flag={'2'}  type={this.props.selectedRoomIcon} />
	        			</div>
	        	</div>
	        	<div className="name-root">
		          <div id="user-name-root" className='user-name'>
		          	<input id="user-name-input" type="text" maxLength="20" onClick={this.onInputClick} readOnly="true" value={Lang.user.login.placeholder[0]}
		              {...getFieldProps('userName', {
		                initialValue: this.state.userName,
		                rules: [{required: true, max: 30, min: 6, message: Lang.room.roomTitle}]
		              })} />
		          	
		          	<div className='edit-name-after'>
		          		<div id="edit-name-icon-id" className='edit-name-icon' onClick={this.onEditClick}></div>
		          	</div>
		          	
		          	<div id="clear-icon-id" className='clear-icon-after'>
		          		{this.props.form.getFieldValue('userName').length ? <a  className="clear-icon" href="javascript:;" onClick={this.handlerClearClick}></a> : ''}
		          	</div>
		          </div>
		          <p className="room-title" >
	          {Lang.home.editRoom.roomTitle}
	          	</p>
	          	</div>
	          	
	          	<div className="space-list">
	           <ListView
                  key="1"
                  style={{height: "calc(100vh - 1.16rem - 64px)"}}
                  useBodyScroll={false}
                  dataSource={dataSource}
                  renderRow={row} 
                />
	          </div>
	          
	          
	           	<button type="button" onClick={this.onRemove} >
	           		{Lang.home.addRoom.remove}
	           	</button>
	        </div>
    	</div>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedTab: state.other.selectedTab,
    selectedRoomIcon: state.space.selectedRoomIcon
  }
}

const mapDispatchToProps = dispatch => {
  return {
    selectTab: (...args) => dispatch(selectTab(...args)),
    showDialog: (...args) => dispatch(showDialog(...args)),
    selectRoomIcon: (...args) => dispatch(selectRoomIcon(...args))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(createForm()(EditRoom))