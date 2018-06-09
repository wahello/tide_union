import React, { Component } from 'react';
import './default/style.css';
import { connect } from 'react-redux';
import { Lang } from '../public';
import { Route, Link } from 'react-router-dom';
import BarTitle from '../component/barTitle';
import ScrollView from '../component/scrollView';

class HomeStart extends Component {
  constructor(props) {
  	super(props);
    this.state = {
        effect: 'home-start',
        second: 3,
    };
    this.handleClickBack = this.handleClickBack.bind(this);
    this.handleClickSave = this.handleClickSave.bind(this);
    this.handleUpdateIcon = this.handleUpdateIcon.bind(this);
    this.handleClickControl = this.handleClickControl.bind(this);
	}
  
  handleClickBack(){
  	this.props.history.goBack();
  }
  handleClickSave(){
  	alert('save');
  }
  handleUpdateIcon(){
  	this.props.history.push('/scene/update/icon');
  }
  handleClickControl(){
  	this.props.history.push('../device/lamp/control');
  }
  handleSelect(event){
  	let e = event.target;
  	if(e.getAttribute("class") == 'act'){
  		e.className = "";
  	}
  	else{
  		e.className = "act";
  	}
  	
  	
  }
  componentDidMount() {
    let that = this;
    let second = that.state.second;
    this.interTick = setInterval(function(){
    	that.setState({second: second--});
    	if(second < 0){
    		that.interTick && clearInterval(that.interTick);
				that.setState({effect: 'home-start hide-pull-left'});
    	}
    }, 1000);
  }
  
  
  render() {
  	let sceneListData = [
  	{
  		title:"Light bulb 1",
  		content:"Bedroom",
  		imgClass:""
  	},
  	{
  		title:"Light bulb 2",
  		content:"Study",
  		imgClass:""
  	},
  	{
  		title:"Light bulb 3",
  		content:"Study",
  		imgClass:""
  	},
  	{
  		title:"All bulbs",
  		content:"",
  		imgClass:""
  	}
  	];
    return (
      <div className="scene add">
        <BarTitle onBack={this.handleClickBack} title={Lang.scene.create.title} onDone={this.handleClickSave}>
        </BarTitle>
      	<div className="bodyer">
      		<p className="add-txt">Scene Name</p>
      		<div className="input-name">
      			<label onClick={this.handleUpdateIcon}></label>
      			<input type="text" maxlength="30" />
      			<a></a>
      		</div>
      		<p className="add-txt">{Lang.scene.create.listTitle}</p>
      		
      			<ul className="scene-list">
      			{sceneListData.map((item,index) =>
    					<li>
	            	<label onClick={this.handleSelect}></label>
	            	<div className="scene-box" onClick={this.handleClickControl}>
	            		<p>
	            			<h2>{item.title}</h2>
	            			<h3>{item.content}</h3>
	            		</p>
	            		<i></i>
	            	</div>
	            </li>
      			
      			)}
	          </ul>
      		
      	</div>
      </div>
    );
  }
}

export default connect()(HomeStart)