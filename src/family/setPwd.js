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
import { showDialog } from '../action';
import Cookies from 'universal-cookie';
import Toast from 'antd-mobile/lib/toast';

const securityApi = new Scene();
const pwdLength = 6;

class PasswordInputing extends Component {
	
  cookies = new Cookies();
	
  constructor(props) {
    super(props);

    this.state = {
      inputs: [],
      inputPwd:"",
      inputNewPwd:"",
      status:"current",
      msg:Lang.security.tip.setSecurityPwd,  
    }
   
    this.handleClickNumber = this.handleClickNumber.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleToHome = this.handleToHome.bind(this);
  }

  handleClickNumber(num) {
  	let that = this;
  	const { currentHomeId } = this.props;
  	var pwd = this.state.inputPwd;  
    this.setState({  
      inputPwd:pwd+""+num,  
    });  
     
	  let status = this.state.status;
	  var inputPwd = this.state.inputPwd;  
	  let curPwd = pwd + "" + num;  
	  console.log("当前输入的密码为： ", curPwd);
	  console.log("当前 currentHomeId 22222 = ", currentHomeId);
	  
	  if("current" == status){
	  	if(curPwd.length == pwdLength){  
        setTimeout(()=>{  
          this.setState({  
            status:"new",
            currentPwd:curPwd,
            msg:Lang.security.tip.setSecurityPwd2, 
            inputPwd:"",
          });  
        },500);   
	  	}
	  }else if("new" == status){
	  	if(curPwd.length == pwdLength){  
	  		let currentPwd = this.state.currentPwd;  
	        if(currentPwd == curPwd){  
	           console.log("两次输入的新密码一致 ：", curPwd);
			   
			   const setPwdAttr = {
			        homeId: this.props.currentHomeId,
			        oldPasswd: "",
			        newPasswd: helper.md5(currentPwd)
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
			        this.handleToHome();
			        	Toast.info(Lang.security.tip.setSucess, 2, null, false);
			    }).catch(res => {
			    	 	console.log("res.code2 = ", res);
			        	Toast.info(res.ack.desc, 3, null, false);
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
  
  handleToHome() {
    this.props.onToHome();
  }

  handleCancel() {
  	var pwd = this.state.inputPwd;  
    pwd = pwd.substring(0,pwd.length-1);  
    this.setState({  
      inputPwd:pwd,  
    }); 
  }
  
  deleteNum(){  
 	var pwd = this.state.inputPwd;  
    pwd = pwd.substring(0,pwd.length-1);  
    this.setState({  
      inputPwd:pwd,  
    });  
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
          <a onClick={this.handleCancel} className="PasswordInputing_cancel">{Lang.security.cancel}</a>
        </div>
      </div>
    )
  }
}

class SetPwd extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
  	const { 
      showDialog
    } = this.props.actions;
    
    const { currentHomeId } = this.props;
    
    console.log("当前 currentHomeId= ", currentHomeId);
  }
  
  render() {
  	const { currentHomeId } = this.props;
    return (
      <div className="set-pwd">
          <PasswordInputing currentHomeId={currentHomeId} onToHome={() => {this.props.history.replace('/home');}}/>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
  	currentHomeId: state.family.currentId
  }
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators({
      showDialog
    }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetPwd);