import React, { Component } from 'react';
import { compose,bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { setLEDMode } from '../action/security';
import BarTitle from '../component/barTitle';
import './default/style.css';
import { Lang } from '../public';
import Scene from '../jssdk/scene';
import helper from '../public/helper';
import { showDialog, selectTab } from '../action';
import Cookies from 'universal-cookie';
import Toast from 'antd-mobile/lib/toast';
import SystemApi from '../jssdk/system';

const securityApi = new Scene();
const pwdLength = 6;

class PasswordInputing extends Component {
	
  cookies = new Cookies();
	
  constructor(props) {
    super(props);
    const { dispatch } = props;
    this.dispatch = dispatch;
    
    this.state = {
      inputs: [],
      inputPwd:"",
      currentPwd:"",
      newPwd:"",
      status:"current",
      msg:Lang.security.currentPassword,  
    }
   
    this.handleClickNumber = this.handleClickNumber.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  handleClickNumber(num) {
  	let that = this;
  	let pwd = this.state.inputPwd;  
  	const { currentHomeId } = this.props;
    this.setState({  
      inputPwd:pwd+""+num,  
    });  
    
	  let inputPwd = this.state.inputPwd;  
	  let status = this.state.status;  
	  let curPwd = pwd + "" + num;  
	  console.log("当前输入的密码为： ", curPwd);
	  
	  if("current" == status){
	  	if(curPwd.length == pwdLength){  
        setTimeout(()=>{  
          this.setState({  
          	status:"new",
          	currentPwd:curPwd,
          	msg:Lang.security.tip.enterPwd, 
          	inputPwd:"",
          });  
        },500);  
	  	}
	  }else if("new" == status){
	  	console.log("当前密码为： ", this.state.currentPwd);
	  	if(curPwd.length == pwdLength){
        // if(this.state.currentPwd == curPwd){
        //   this.setState({  
        //   	status:"new",
        //   	msg:Lang.security.tip.enterPwd, 
        //   	inputPwd:"",
        //   });  
        //   Toast.info(Lang.security.tip.oldAndNew, 3, null, false);
        // }else{
          setTimeout(()=>{  
            this.setState({  
              status:"newTwo",
              newPwd:curPwd,
              msg:Lang.security.tip.reenterPwd, 
              inputPwd:"",
            });
          },500);  
        // }      
	  	}
	  }else{
	  	let newPwd = this.state.newPwd;        
	  	console.log("新密码为： ", newPwd);
	  	if(curPwd.length == pwdLength){  
	      if(newPwd == curPwd){  
	        console.log("两次输入的新密码一致 ：", this.state.newPwd);
			   
          const setPwdAttr = {
            homeId: this.props.currentHomeId,
            oldPasswd: helper.md5(this.state.currentPwd),
            newPasswd: helper.md5(this.state.newPwd)
          };
          
          const setPwdParameter = {
            userId: that.cookies.get('userId'),
            payload: setPwdAttr
          };
			   
		      securityApi.setSecurityPasswd(setPwdParameter).then(res => {
			        if(res.ack.code != 200){
			        	 	console.log("res.ack.code = ", res);
			            throw res;
			        }
			        Toast.info(Lang.security.tip.modifySucess, 3, null, false);
					    this.handleBack();
			    }).catch(res => {
			    	 	console.log("res.ack.code2 = ", res);
			        	//this.props.showDialog("", ERR_DESC[res.code] || res.desc);
			        	Toast.info(res.ack.desc, 3, null, false);
				    //actions.showDialog('', ERR_DESC[res.code] || res.desc);
			    });
        } else {  
          this.setState({  
            msg:Lang.security.tip.pwdNotMatch,  
          });  
          setTimeout(()=>{  
            this.setState({  
              inputPwd:"",  
            });  
          },100);  
        }  
	  	}
	  }  
  }

  handleCancel() {
  	var pwd = this.state.inputPwd;  
    pwd = pwd.substring(0,pwd.length-1);  
    this.setState({  
      inputPwd:pwd,  
    }); 
  }
  
  handleBack() {
    this.props.onBack();
  } 

  render() {
    const dots = [];
    const { inputPwd } = this.state;
    
    for(var i = 0; i < 6; i++){
       dots.push(<li className={`PasswordInputing_dot ${ i < this.state.inputPwd.length ? 'PasswordInputing_dot-on' : ''}`}></li>);
    }
   
    const KeyPadNumber = (props) => {
      const number = props.children;
      return <li className="PasswordInputing_number" onTouchEnd={() => this.handleClickNumber(number)}>{number}</li>
    }
    return (
      <div className="PasswordInputing">
        <p className="PasswordInputing-title">{this.state.msg}</p>
        <ul className="PasswordInputing_row PasswordInputing_row-dots">
         {dots}
        </ul>
        <ul className="PasswordInputing_row">
          {
            [1, 2, 3].map(number => (
              <KeyPadNumber>{number}</KeyPadNumber>
            ))
          }
        </ul>
         <ul className="PasswordInputing_row">
          {
            [4, 5, 6].map(number => (
              <KeyPadNumber>{number}</KeyPadNumber>
            ))
          }
        </ul>
         <ul className="PasswordInputing_row">
          {
            [7, 8, 9].map(number => (
              <KeyPadNumber>{number}</KeyPadNumber>
            ))
          }
        </ul>
        <ul className="PasswordInputing_row">
              <KeyPadNumber>0</KeyPadNumber>
        </ul>
        <div className="PasswordInputing_footer">
        	  <a onClick={this.handleBack} className="PasswordInputing_back">{Lang.security.back}</a>
          <a onClick={this.handleCancel} className="PasswordInputing_cancel">{Lang.security.cancel}</a>
        </div>
      </div>
    )
  }
}

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);

	this.systemApi = new SystemApi;
	this.handleClickBack = this.handleClickBack.bind(this);
  }

  componentDidMount(){
  	const { 
      showDialog
    } = this.props.actions;
    this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
  }
  
  handleClickBack() {
    this.props.history.goBack();
  }

  render() {
  	const { currentHomeId } = this.props;
    return (
      <div className="security-changepw">
          <PasswordInputing currentHomeId={currentHomeId} onBack={() => {this.props.history.goBack();}} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ledMode: state.security.ledMode,
    currentHomeId: state.family.currentId
  }
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators({ 
      showDialog
    }, dispatch),
    setLEDMode: (...args) => dispatch(setLEDMode(...args))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);