import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';
import Toast from 'antd-mobile/lib/toast';
import 'antd-mobile/lib/toast/style/css';
import familyApi from '../jssdk/family';
import { Lang } from '../public';
import BarTitle from '../component/barTitle';
import jsBridge from '../jssdk/JSBridge';
import './default/style.css';
import Scene from '../jssdk/scene';
import { bindActionCreators } from 'redux';
import { fetchFamilyList } from '../action/family';
import Device from '../jssdk/device';

class createHome extends React.Component {
  cookies = new Cookies();
  constructor(props) {
    super(props);
    const { dispatch } = props;
    this.dispatch = dispatch;
    this.onCreate = this.onCreate.bind(this);
    this.onSkip = this.onSkip.bind(this);
    
    this.state={
      name:''
    }
    
    this.sceneApi = new Scene;
    this.DeviceApi = new Device();
  }

  getRandStr(length,type){
    let RandStr = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    if(type == 'number'){
      possible = "0123456789";
    }

    for(let i=0; i < length; i++ )
      RandStr += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return RandStr;
  }

  onSave(familyName) {

    var that = this;
    const family = {
      icon: 'bg.png',
      // id: '',
      // locationId: '',
      // parentId: '',
      // position: '',
      // sort: 0,
      // tenantId: '',
      name: familyName || 'MyHome',
      // type: 'HOME',
      cookieUserId: this.cookies.get('userId'),
      cookieUserToken: '',
      defaultSpace: 1, // 是否是默认家
      currentMeshName: this.getRandStr(8,'str'),
      currentMeshPassword: this.getRandStr(6,'number'),
    };
    console.log('创建家', family);
    familyApi.createFamily(family).then((res) => {
      if (res.code != 200) {
        console.log('创建家失败', res.code);
        Toast.info(res.desc || 'Create failed', 2, null, false);
        return;
      }
      console.log('家创建成功！ID为', res.data.id);
      const { actions } = this.props;
      actions.fetchFamilyList({
        cookieUserId: this.cookies.get('userId'),
        cookieUserToken: '',
        pageSize: 100,
        offset: 0,
      });

      // 创建6个默认场景
      let homeId = res.data.id;
      console.log('家的ID', homeId);
      const atHomeParameter = {
  					cookieUserId:this.cookies.get('userId'),
	          name: 'At home',
	          icon: 'at_home',
	          homeId: homeId
	        };
	  	this.sceneApi.addScene(atHomeParameter);
	  	
	  	const goAwayParameter = {
  					cookieUserId:this.cookies.get('userId'),
	          name: 'Go away',
	          icon: 'go_away',
	          homeId: homeId
	        };
	  	this.sceneApi.addScene(goAwayParameter);
	  	
	  	const goodnightParameter = {
  					cookieUserId:this.cookies.get('userId'),
	          name: 'Goodnight',
	          icon: 'good_night',
	          homeId: homeId
	        };
	  	this.sceneApi.addScene(goodnightParameter);
	  	
	  	const goodMorningParameter = {
  					cookieUserId:this.cookies.get('userId'),
	          name: 'GoodMorning',
	          icon: 'good_morning',
	          homeId: homeId
	        };
	  	this.sceneApi.addScene(goodMorningParameter);
	  	
	  	const movieParameter = {
  					cookieUserId:this.cookies.get('userId'),
	          name: 'Movie',
	          icon: 'watch_movie',
	          homeId: homeId
	        };
	  	this.sceneApi.addScene(movieParameter);
	  	
	  	const readingParameter = {
  					cookieUserId:this.cookies.get('userId'),
	          name: 'Reading',
	          icon: 'reading_book',
	          homeId: homeId
	        };
	  	this.sceneApi.addScene(readingParameter);
      console.log('create family', res);

	  	// 创建默认场景结束
        this.props.history.replace('/home');
//    this.props.history.push('/family/setPwd');

      this.DeviceApi.startConnect({
        meshName: family.currentMeshName,
        meshPassword: family.currentMeshPassword
      });

    }).catch(function (res) {

      that.props.history.replace('/home');
      Toast.info(res.desc || Lang.home.saveFail, 2, null, false);
    });
  }

  onSkip(event) {
    this.onSave('MyHome');
  }

  onCreate(event) {
    const form = this.props.form;
    event.currentTarget.focus();
    const name = form.getFieldValue('name');
    let nameLength =  this.getRoomNameLength(name);
    console.log("wcb nameLength",nameLength);
    if (!nameLength) {
      Toast.info(Lang.home.nameIsRequired, 3, null, false);
      return;
    }
    
    if (nameLength < 1 || nameLength > 20) {
      Toast.info(Lang.user.validator[15], 3, null, false);
      return;
    }
    // if (!/^[0-9_a-zA-Z\s]+$/.test(name)) {
    //   Toast.info('必须是数字或字母', 3, null, false);
    //   return;
    // }
    
    this.onSave(name);
  }
	
	getRoomNameLength(name){
		let len = 0;    
	    for (let i=0; i<name.length; i++) {    
	        if (name.charCodeAt(i)>127 || name.charCodeAt(i)==94) {    
	             len += 2;    
	         } else {    
	             len ++;    
	         }    
	     }    
	    return len;
	}
	
  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    return (
      <div className="cerateHome">
        <div className="hiTitle">Hi！</div>
        <div className="tipTitle">Please name your home</div>
        <div className="inputName">
          <div className="input-image"></div>
          <div className="input-eg"></div>
           <input  className="input-name" type="text" placeholder="eg：MyHome" maxLength="30"
            {...getFieldProps('name', {
              initialValue: this.state.name, 
            })}
          /> 
          <div >
          {this.props.form.getFieldValue('name').length ? <a className="clear-icon" href="javascript:;" 
            onClick={() => this.props.form.setFieldsValue({name: ''})}></a> : <a className="clear-icon-hiden"  
            ></a>}
         </div>  
       </div>
        {
          this.props.form.getFieldValue('name').length ?
          <div className="createButton createButtonEnable" onClick={this.onCreate}>Create</div>
          :<div className="createButton createButtonDisable">Create</div>
        }
        <div className="skip" onClick={this.onSkip}>skip</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return state
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ fetchFamilyList }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps )(createForm()(createHome));


