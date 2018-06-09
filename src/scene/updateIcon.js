import React, { Component } from 'react';
import './default/style.css';
import BarTitle from '../component/barTitle';
import SceneWhiteIcon from './component/sceneWhiteIcon';
import ScrollView from '../component/scrollView';
import { Lang } from '../public';
import {selectSceneIcon,editSceneName } from '../action';
import { connect } from 'react-redux';
import SystemApi from '../jssdk/system';


const ICONS = [
  "at_home",
  "go_away",
  "good_morning",
  "good_morning2",
  "good_night",
  "good_night2",
  "watch_movie",
  "movie2",
  "reading_book",
  "reading_book2"
  ];

class UpdateSceneIcon extends Component {
    
  constructor(props) {
    super(props);
    
    this.state = {
    	currentIcon:"go_away"
    }

    this.systemApi = new SystemApi;
    this.handleClick = this.handleClick.bind(this);
    this.handleClickBack = this.handleClickBack.bind(this);
  }

  handleClick(objectIcon){
    this.props.selectSceneIcon(objectIcon);
    this.props.history.goBack();
  }

  handleClickBack(){
    this.props.history.goBack();
  }

  componentDidMount(){
    this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
  }
  
  render() {
    let listItems = ICONS.map((type, i) => {
      return <li key={i} className={this.props.selectedIcon == type ? "icon-item-select" : "icon-item"} onClick={() => this.handleClick(type)}>
               <SceneWhiteIcon type={type} />
            </li>
    });

    return (
      <div className="scene">
        <BarTitle 
          onBack={this.handleClickBack}
          title={Lang.scene.sceneIcon}
        />
        <div className="scene-icons">
	        <ScrollView>
	          <ul className="icon-list">
	            {listItems}
	          </ul>
	        </ScrollView>
        </div>
        
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
  	 selectedIcon: state.scene.selectedIcon
  }
}

const mapDispatchToProps = dispatch => {
  return {
    selectSceneIcon: (...args) => dispatch(selectSceneIcon(...args))
    
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateSceneIcon)