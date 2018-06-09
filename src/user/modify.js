import React, { Component } from 'react';
import { connect } from 'react-redux';
import BarTitle from '../component/NavigationBar';
import { showDialog } from '../action';
import { createForm } from 'rc-form';
import Cookies from 'universal-cookie';
import Toast from 'antd-mobile/lib/toast';
import userApi from '../jssdk/User';
import { Link } from 'react-router-dom';
import MQTTService from '../jssdk/MQTTService'
import { Lang } from '../public';
import { initDeviceData } from '../action/device';
import { initFamilyData } from '../action/family';
import { initSecurityData } from '../action/security';
import { bindActionCreators } from 'redux';
import SystemApi from '../jssdk/system';

const systemApi = new SystemApi;
const accoutDueDate = 15;
class Modify extends Component {
  cookies = new Cookies();
	
  constructor(props) {
  	super(props);
    this.state = {
        userName: this.cookies.get('nickName') || 'My name',
        userAccount:this.cookies.get('account') || '',
        userId:this.cookies.get('userId'),
        isEdit: false,
        isCanSave:true,
        isVisibility: false,
        fileName:"",
        fileUri: this.cookies.get('photoUri') || "",
    };
    console.log("wcb-------1------userAccount:",this.cookies.get('account'));
    console.log("wcb-------1------photoUri:",this.cookies.get('photoUri'));
    const { dispatch } = props;
    this.dispatch = dispatch;
    this.systemApi = new SystemApi;
    this.handleClickBack = this.handleClickBack.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.onEditClick = this.onEditClick.bind(this);
    this.onInputClick = this.onInputClick.bind(this);
    this.handleClickRoot = this.handleClickRoot.bind(this);
    this.handlerClearClick = this.handlerClearClick.bind(this);
    this.showActionSheet = this.showActionSheet.bind(this);
    this.hideActionSheet = this.hideActionSheet.bind(this);
    this.takePhotoClick = this.takePhotoClick.bind(this);
    this.choicePhotoClick = this.choicePhotoClick.bind(this);
  }
  takePhotoClick(event){
  	let that = this;
  	let expires = new Date;
  	let url="/static/media/";
  	setTimeout(() =>{
  		this.setState({
	  		fileName:(new Date().getTime() + '').substr(4, 9)+".png"
	  	});
	  	console.log("1  fileName = " + this.state.fileName);
	  	systemApi.takePhoto({
  					scale:0.5,
  					fileName:that.state.fileName
  				}).then(res => {
  							console.log("22222  takePhotoClick uri",res);
  							console.log("3333  fileName uri",that.state.fileName);
  							that.setState({
//									fileUri:res.data.uri
										fileUri:("/static/media/"+that.state.fileName)
//									fileUri:res.data.uri.substring(46)
//									fileUri:"/static/media/devices_icon_curtain_s.b0e0d0f6.png"
  							});
  							console.log("4444  cookies.fileUri = ",that.cookies.get('photoUri'));
				 		});
  	},0);
  	
  }
  choicePhotoClick(event){
  	let that = this;
  	setTimeout(() =>{
  		this.setState({
	  		fileName:(new Date().getTime() + '').substr(4, 9)+".png"
	  	});
	  	console.log("1  choicePhotoClick fileName = " + this.state.fileName);
	  	systemApi.choicePhoto({
  					scale:0.5,
  					fileName:that.state.fileName
  				}).then(res => {
  						console.log("22222  choicePhotoClick uri",res);
  						console.log("3333  fileName uri",that.state.fileName);
  						that.setState({
//									fileUri:res.data.uri
										fileUri:("/static/media/"+that.state.fileName)
//									fileUri:res.data.uri.substring(46)
//									fileUri:"/static/media/devices_icon_curtain_s.b0e0d0f6.png"
  							});
								console.log("4444  cookies.fileUri = ",that.cookies.get('photoUri'));
				 		});
  	},0);
  }
  showActionSheet(event){
  	console.log("dialogdiv");
  	var dialogdiv = document.getElementById("dialogdiv");
  	var backgrounddiv = document.getElementById("backgrounddiv");
		dialogdiv.classList.add('show');
		dialogdiv.classList.remove('hide');
		backgrounddiv.style.visibility = "visible";
  }
  
  hideActionSheet() {
  	console.log("hideActionSheet");
		var dialogdiv = document.getElementById("dialogdiv");
		var backgrounddiv = document.getElementById("backgrounddiv");
		if(dialogdiv != null && dialogdiv.classList != null) {
			dialogdiv.classList.add('hide');
			dialogdiv.classList.remove('show');
			backgrounddiv.style.visibility = "hidden";
		}
	}
  
  handlerClearClick(event){
  	this.setState({isCanSave: false});
  	this.state.isCanSave = false;
  	this.props.form.setFieldsValue({userName: ''})
  	console.log("handlerClearClick userName = ",this.props.form.getFieldsValue());
  	console.log("handlerClearClick isCanSave  = ",this.state.isCanSave);
  	
  	this.onInputClick();
		var userNameInput = document.getElementById("user-name-input");
	  userNameInput.focus(); 
  }

  componentDidMount() {
	this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
  }
  
  handleClickBack(event) {
  	this.setState({isEdit: false});
	this.props.history.goBack();
  }
  
  handleClickRoot(event){
  	console.log("handleClickRoot  = ",this.state.isEdit);
  	console.log("this.state.isCanSave  = ",this.state.isCanSave);
  	if(this.state.isEdit && this.state.isCanSave){
  		let that = this;
  		let form = this.props.form;
  		let formData = form.getFieldsValue();
  		
  		event.currentTarget.focus();
    	form.validateFields();
    	
    	if(formData.userName == ""){
    		var userNameRoot = document.getElementById("user-name-root");
			  userNameRoot.style.backgroundColor= "transparent";
			
			  var clearIconId = document.getElementById("clear-icon-id");
			  clearIconId.style.visibility = "hidden";
			  
			  var userNameInput = document.getElementById("user-name-input");
			  
			  userNameInput.style.paddingLeft = 0;
			  userNameInput.style.paddingRight = 0;
//			  userNameInput.readOnly = true; 
			  this.props.form.setFieldsValue({userName: this.cookies.get('nickName')})
			  console.log("wcb-----------cookies",this.cookies.get('nickName'));
    	} else {
    		if(form.getFieldError('userName')){
	    		Toast.info(form.getFieldError('userName')[0], 3, null, false);
	      	return;
	    	}
	    	
	    	const modifyNameParameter = {
	          nickname: formData.userName,
	          userId: this.state.userId,
	        };
	    	console.log("wcb-----------else",formData.userName);
	    	userApi.modifyUserName(modifyNameParameter).then(res => {
		      if(res.code != 200){
		        throw res;
		      }
		      
		      var userNameRoot = document.getElementById("user-name-root");
				  userNameRoot.style.backgroundColor= "transparent";
				
				  var clearIconId = document.getElementById("clear-icon-id");
				  clearIconId.style.visibility = "hidden";
				  
				  var userNameInput = document.getElementById("user-name-input");
				  userNameInput.style.paddingLeft = 0;
				  userNameInput.style.paddingRight = 0;
//				  userNameInput.readOnly = true; 
				  
				   //记住账号
		      let expires = new Date;
		      expires.setDate(expires.getDate() + 30);
				  this.cookies.set('nickName', formData.userName, {expires});
				  this.setState({isEdit: false});
		    }).catch(res => {
//		    	that.dispatch(showDialog(Lang.user.password.title, res.desc))
		    });
    	}
    	
  	}
  	
		this.setState({isCanSave: true});
  }
  
  onInputClick(){
  	this.setState({isEdit: true});
  	this.setState({isCanSave: false});
  	this.state.isCanSave = false;
  	
  	var userNameRoot = document.getElementById("user-name-root");
  	var userNameInput = document.getElementById("user-name-input");
		
		userNameRoot.style.backgroundColor= "$bg-nav-top-color";
		
		var clearIconId = document.getElementById("clear-icon-id");
		clearIconId.style.visibility = "visible";
		
		userNameInput.style.paddingLeft = "2.5rem";
		userNameInput.style.paddingRight = "2.5rem";
//		userNameInput.readOnly = false;
  }
  
  
  onEditClick(event){
  	this.setState({isCanSave: false});
  	
  	this.onInputClick();
  }
  
  /*
   * 登出账号
   */
  onLogout(event){

    const that = this;
    that.props.showDialog("", Lang.user.login.sureToLogout, [
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
						const cookies = new Cookies;
						this.hide();

						userApi.logout({
							userId: cookies.get('userId'),
						}).then((res) => {
							Toast.hide();
							if(res.code == 200) {
								const { actions, history } = that.props;
                actions.initDeviceData();
                actions.initFamilyData();
								actions.initSecurityData();
								MQTTService.destroy();
                userApi.clearAuthorityInfo();
								history.replace('/user/login');

							} else {
								Toast.info(Lang.user.login.logoutFailed);
							}
							
              this.hide();
						}).catch(err => {
							Toast.info(Lang.user.login.logoutFailed);
						});
          }
      }]);
  }
  
  render() {
  	const { getFieldProps, getFieldError} = this.props.form;
  			let expires = new Date;
	      expires.setDate(expires.getDate() + accoutDueDate);
  			console.log("wcb-------2------this.state.fileUri",this.state.fileUri);
  	 		console.log("wcb this.state.fileUri",this.state.fileUri);
  	 		this.cookies.set('photoUri', `${this.state.fileUri}`);
				console.log("55555",this.cookies.get('photoUri'),{expires});
    return (
    	<div className="user-modify" onClick={this.handleClickRoot}>
    	<div id="backgrounddiv" className='modify-background' onClick={this.hideActionSheet}>
    				
    	</div>
    	
    	<div id="dialogdiv" className = "modify-dialog">
	           				<div className = "modify-choose">
				           			<div className = "modify-camera" onClick={this.takePhotoClick}>Take Photo</div>
				           			<div className = "modify-Line"></div>
				           			<div className = "modify-Photo" onClick={this.choicePhotoClick}>Choose from album</div>
				           	</div>
				           			<div className="modify-cancel" onClick={this.hideActionSheet}>cancel</div>
		           			
	           	</div>
    		<BarTitle onBack={this.handleClickBack} title={Lang.user.modify.title}>
    		</BarTitle>
    		<div className='modify-bodyer'>
	        	<div className='user-head-icon' style={this.state.fileUri !=="" ?{backgroundImage: `url(${this.state.fileUri})`}:{}} onClick={this.showActionSheet}></div>
	        	<div className="name-root"> 
		          <div id="user-name-root" className='user-name'>
		          	<input id="user-name-input" className="name_input" type="text" maxLength="30" placeholder="My name" onClick={this.onInputClick}   value={this.state.userName}
		              {...getFieldProps('userName', {
		                initialValue: this.state.userName,
		                rules: [{required: true, max: 30, min: 1, message: Lang.user.validator[10]}]
		              })} />
		          	
		          	
		          	
		          	<div id="clear-icon-id" className='clear-icon-after'>
		          		{this.props.form.getFieldValue('userName').length ? <a  className="clear-icon" href="javascript:;" onClick={this.handlerClearClick}></a> : ''}
		          	</div>
		          </div>
	          	</div>
	          
		        <div className='account-box'>
		          <span className='title-span'>Account</span>
		          <span className='account-span'>{this.state.userAccount}</span>
		        </div>
	          
	          	<Link to="/user/changePwd">
		          <div className='modify-password-box' >
		          	<span className='title-span'>Modify password</span>
		          	<div className='arrow-span'></div>
		          </div>
	          	</Link>
	          
	           	<button type="button" onClick={this.onLogout} >
	           		Log Out
	           	</button>
	           	
	        </div>
    	</div>
    );
  }
}

const mapStateToProps = state => {
  return {
  }
}

const mapDispatchToProps = dispatch => {
  return {
		showDialog: (...args) => dispatch(showDialog(...args)),
		actions: bindActionCreators({
			initDeviceData,
			initFamilyData,
			initSecurityData
		}, dispatch),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(createForm()(Modify))