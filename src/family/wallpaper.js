import React, { Component } from 'react';
import './default/style.css';
import Cookies from 'universal-cookie';
import helper from '../public/helper';
import userApi from '../jssdk/family';
import { showDialog } from '../action';
import { connect } from 'react-redux';
import { Lang } from '../public';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';
import Toast from 'antd-mobile/lib/toast';
import 'antd-mobile/lib/toast/style/css';
import BarTitle from '../component/barTitle';

import testImg from './default/image/choose_wallpaper_icon_default_image.png'
import bg1 from './default/image/bg@2x.png'
import bg2 from './default/image/bg2@2x.png'
import rightIcon from './default/image/automation_icon_right_arrow@3x.png'

class chooseWallpaper extends Component {  

  constructor(props) {
    super(props);
    const { dispatch } = props;
    this.selectedImg = '';
    this.dispatch = dispatch;
    // this.getQueryString = this.getQueryString.bind(this);
    this.handleClickSet = this.handleClickSet.bind(this);
  }

  handleClickBack(event) {
    this.props.history.goBack();
  }

  // getQueryString(name){
  //   const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  //   const r = this.props.location.search.substr(1).match(reg);
  //   if (r != null) return unescape(r[2]);
  //   return null;
  // }

  handleClickImg(type,image,event){

    if(type == "img"){
      var previewImg = document.getElementById("previewImg");
      previewImg.src = require('../public/resource/image/a023/'+image);
      previewImg.style.display='block';

      var previewView = document.getElementById("previewView");
      previewView.style.display='block';
      
    }else if(type == "color"){
      
      var previewView = document.getElementById("previewViewContent");
      previewView.style.backgroundColor = image;

      var previewImg = document.getElementById("previewImg");
      previewImg.style.display='none';

      var previewView = document.getElementById("previewView");
      previewView.style.display='block';

    }
    this.selectedImg = image;
     //console.log(image);
  }

  handleClickCancel(){
    var previewView = document.getElementById("previewView");
    previewView.style.display='none';

  }

  handleClickSet(){
//    var previewView = document.getElementById("previewView");
//    previewView.style.display='none';

    
    const { familyId } = this.props;
    let family = {
      name: '',
      icon: ''
    };

    if (familyId != 0 && this.props.familyItems) {
      family = this.props.familyItems[familyId];
      console.log(this.props.familyItems[familyId]);
    }

    family.icon = this.selectedImg;
    
    this.props.history.goBack();
  }
  
  render() {
    

    return (
      <div className='choosewallpaper'>

        <div id="previewView" className="previewView">
          <div id="previewViewContent" style={{width:'100%',height:'100%'}}>
            <img id="previewImg" src=''/>
          </div>
          <div style={{width:'100%',height:'4rem',position:'fixed',bottom:'0'}}>
            <input type="button" className="right-border" value="Cancel" onClick={this.handleClickCancel}/>
            <input type="button" className="right-border-hide" value="Set"  onClick={this.handleClickSet}/>
          </div>
        </div>

        <BarTitle onBack={this.handleClickBack.bind(this)} title={Lang.home.chooseWallpaper}></BarTitle>
      
        <span className='choosewallpaper-title'>{Lang.home.homeWallpaper}</span>

        <div className='choosewallpaper-list'>
          <ul>
            <li><img src={require('../public/resource/image/a023/bg.png')} onClick={this.handleClickImg.bind(this,'img','bg.png')} /></li>
            <li><img src={require('../public/resource/image/a023/bg2.png')} onClick={this.handleClickImg.bind(this,'img','bg2.png')} /></li>
            <li  style={{backgroundColor:'#3C66BE'}} onClick={this.handleClickImg.bind(this,'color',"#3C66BE")}></li>
          </ul>
        </div>
  
        <span className='choosewallpaper-title'>{Lang.home.photos}</span>

        <div className='choosewallpaper-camera'>
          <img className='choosewallpaper-camera-img' src={testImg}/>
          <div>
            <span className='choosewallpaper-camera-title'>Camera Roll</span>
            <br/>
            <span className='choosewallpaper-camera-desc'>1,200</span>
          </div>
          <img className='choosewallpaper-camera-right' src={rightIcon}/>
        </div>

      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    familyItems: state.family.items,
    familyId: ownProps.match.params.familyId,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    showDialog: (...args) => dispatch(showDialog(...args))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(chooseWallpaper));