import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';
import { showDialog } from '../action';
import { Lang } from '../public';
import BarTitle from '../component/barTitle';
import helper from '../public/helper';
import ScrollView from '../component/scrollView';
import familyApi from '../jssdk/family';
import './default/style.css';
import Toast from 'antd-mobile/lib/toast';
import { fetchFamilyList } from '../action/family';
import { bindActionCreators } from 'redux';
import bg1 from './default/image/bg@2x.png'

class homeSet extends React.Component {
	cookies = new Cookies();
  constructor(props) {
    super(props);
    this.handleClickBack = this.handleClickBack.bind(this);
    this.onRemove = this.onRemove.bind(this);
    const { dispatch } = props;
    this.dispatch = dispatch;
    this.family = {
      name: '',
      icon: ''
    };
    
    this.onSave = this.onSave.bind(this);
  }

  // getQueryString = (name) => {
  //   const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  //   const r = this.props.location.search.substr(1).match(reg);
  //   if (r != null) return unescape(r[2]);
  //   return null;
  // };
	
	getNameLength(name){
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
	
	getNameLength(name){
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

	onSave(){
		const form = this.props.form;
    const name = form.getFieldValue('name');
    if (!name) {
      Toast.info(Lang.home.nameIsRequired, 3, null, false);
      return;
    }
    let nameLength = this.getNameLength(name);
    if (nameLength < 1 || nameLength > 20) {
      Toast.info(Lang.user.validator[15], 2, null, false);
      return;
    }

    const { familyId, familyItems } = this.props;
    if (familyId != 0 && familyItems) {
      this.family = familyItems[familyId];
    }
    
    console.log("修改家信息，name:"+this.family.name+"  homeId:"+this.family.homeId);
		const family = {
      icon: this.family.icon,
      name: name,
      cookieUserId: this.cookies.get('userId'),
      cookieUserToken: '',
      homeId:this.family.homeId,
      defaultSpace: 1 // 是否是默认家
    };
    familyApi.editHome(family).then((res) => {
	    if (res.code != 200) {
	        Toast.info(res.desc || Lang.home.editFamily.editFailed, 3, null, false);
	        console.log("编辑失败："+res.desc);
	        return;
	    }
      	const { actions } = this.props;
		actions.fetchFamilyList({
	        cookieUserId: this.cookies.get('userId'),
	        cookieUserToken: '',
	        pageSize: 100,
	    	offset: 0,
	    });
      	Toast.info(Lang.home.editFamily.editSuccessed, 3, null, false);
		this.props.history.goBack();
    }).catch(function (res) {
      	Toast.info(res.desc || Lang.home.saveFail, 3, null, false);
    });
	}

  handleClickBack(event) {
    const { familyId, familyItems } = this.props;
    if (familyId != 0 && familyItems) {
      this.family = familyItems[familyId];
    }

    const form = this.props.form;
    const name = form.getFieldValue('name');
    if(this.family.name != name){
      this.onSave();
    }else{
      this.props.history.goBack();
    }
  }

  onRemove() {
    let that = this;
    const { familyId } = this.props;
    let name = '';
    if (this.props.familyItems) {
      name = this.props.familyItems[familyId].name;
    }
    this.props.showDialog((Lang.home.addHome).replace('{name}', name), Lang.home.removeHomeTip, [
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
           
          }
        }])
  }

  showBackgroundImg(image){
      if(image.substring(0,1) == "#"){

        var backgroundImg = document.getElementById("backgroundImgId");
        backgroundImg.style.display='none';
        var backgroundDiv = document.getElementById("backgroundDivId");
        backgroundDiv.style.backgroundColor = image;

      }else if(image != ''){
        var backgroundImg = document.getElementById("backgroundImgId");
        backgroundImg.src = require('../public/resource/image/a023/'+image);
        backgroundImg.style.display='block';
      }else{
       /* var backgroundImg = document.getElementById("backgroundImgId");
        console.log(backgroundImg);
        backgroundImg.style.display='none';     */
        var backgroundImg = document.getElementById("backgroundImgId");
        backgroundImg.src = require('../public/resource/image/a023/bg.png');;
        backgroundImg.style.display='block';
      }
  }

  componentDidMount(){
    const { familyId, familyItems } = this.props;

    if (familyId != 0 && familyItems) {
      this.family = familyItems[familyId];
    }
    this.showBackgroundImg(this.family.icon);
  }

  render() {
    const { familyId, familyItems, directDevIds, deviceItems } = this.props;
    const { getFieldProps, getFieldError } = this.props.form;
    // if (familyId != 0 && familyItems) {
    //   this.family = familyItems[familyId];
    // }
    let familyname = this.props.familyItems[familyId] ? this.props.familyItems[familyId].name : '';
    let gatewayName = '';

    if (directDevIds.gateway != undefined && directDevIds.gateway.length) {
      const directId = directDevIds.gateway[0];
      gatewayName = deviceItems[directId].name;
    }

    return (
      <div>
        <BarTitle onBack={this.handleClickBack} title={Lang.home.setting}/>
        <ScrollView>
          <div className="home-setting">
            <div className="title">{Lang.home.homeName}</div>
            {/* <div className="content2"> {familyItems[familyId].name} </div> */}
            <div className="family-Name" >
                  <input  className="input-name"  type="text" maxLength="20"
                  {...getFieldProps('name', {
                  initialValue: familyname, 
                  })}
                    /> 
                  <div >
                    {this.props.form.getFieldValue('name').length ? <a className="clear-icon" href="javascript:;" 
                    onClick={() => this.props.form.setFieldsValue({name: ''})}></a> : <a className="clear-icon-hiden"  
                    ></a>}
                  </div>  
              </div>
            {
              gatewayName.length ?
              <div className="title">{Lang.home.gateway}</div>
              : null
            }
            {
              gatewayName.length ? <div className="content2">
                <div className="gateway">{gatewayName}</div>
              </div> : null
            }
            <div className="title">{Lang.home.homeWallpaper}</div>
            <div className="content2 take-photo">{Lang.home.takePhoto}</div>
            <div className="content2 album">
              <Link to={`/family/wallpaper/${familyId}`}>
                {Lang.home.chooseAlbum}
              </Link>
            </div>
            <div className="currentbackground">
              <div id="backgroundDivId" className="img">
                <img id="backgroundImgId" src='' style={{width:'100%',height:'100%'}}/>
              </div>
            </div>
            <div>
              {familyId!=0 && <div className="remove" onClick={this.onRemove}>{Lang.home.removeHome} </div>}
            </div>
          </div>
        </ScrollView>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    familyItems: state.family.items,
    familyId: ownProps.match.params.familyId,
    directDevIds: state.device.directDevIds || {},
    deviceItems: state.device.items,
    currentHomeId: state.family.currentId,
    familyIcon: state.family.icon,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    showDialog: (...args) => dispatch(showDialog(...args)),
    actions: bindActionCreators({ fetchFamilyList }, dispatch),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(homeSet));
