import React, { Component } from 'react';
import './default/style.css';
import BarTitle from '../component/barTitle';
import ScrollView from '../component/scrollView';
import { Lang } from '../public';
import {selectRoomIcon} from '../action';
import { connect } from 'react-redux';
import SystemApi from '../jssdk/system';
import RoomIconClass from "./component/RoomIconClass";

const ICONS = [
    'balcony',
    'basement',
    'bedroom',
    'bedroom2',
    'bedroom3',
    'bathroom2',
    'diningroom',
    'diningroom2',
    'kitchen',
    'living-room',
    'outside',
    'study',
    'study2',
    'fault'
];

class RoomIcon extends Component {

    constructor(props) {
        super(props);

        
        this.state = {
	    		currentIcon:"bedroom3"
	    }

	    this.systemApi = new SystemApi;
	    this.handleClick = this.handleClick.bind(this);
	    this.handleClickBack = this.handleClickBack.bind(this);
	    
	    // 修改selectSpaceIcon就可以确认选中的图片
	    //this.props.selectSpaceIcon("bedroom3");
    }

    handleClick(objectIcon){
        this.props.selectRoomIcon(objectIcon);
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
	      return <li key={i} className={this.props.selectedRoomIcon==type ? "icon-item-select" : "icon-item"} onClick={() => this.handleClick(type)}>
	              <RoomIconClass flag={'1'} type={type} />
	            </li>
        });

        return (
            <div className="room">
                <div className="room-icons">
                    <BarTitle
                        onBack={this.handleClickBack}
                        title={Lang.space.updateIcon}
                    />
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
  	 selectedRoomIcon: state.space.selectedRoomIcon
  }
}

const mapDispatchToProps = dispatch => {
    return {
        selectRoomIcon: (...args) => dispatch(selectRoomIcon(...args))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomIcon)