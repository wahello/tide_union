import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SwipeAction from 'antd-mobile/lib/swipe-action';
import { Lang } from '../../public';
import helper from '../../public/helper';

class EventItem extends Component{
	constructor(props){
		super(props);
		this.state = {
			isPlay:false,
			isPause:false
		};
		
		this.handlePlayClick = this.handlePlayClick.bind(this);
		this.handlePauseClick = this.handlePauseClick.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		const { data } = this.props;
		if (typeof (nextProps) != 'undefined') {
			if(data.eventOddurTime == nextProps.playTime){
				this.setState({isPlay:true});
			}
			else{
				this.setState({isPlay:false});
			}
			if(data.eventOddurTime == nextProps.pauseTime){
				this.setState({isPause:true});
			}
			else{
				this.setState({isPause:false});				
			}
		}
	}
	
	handleDelectClick(){
		console.log('handleDelectClick')
	}
	handlePlayClick(time){
		const self = this;
		self.props.onPlayClick(time);
	}
	handlePauseClick(){
		const self = this;
		self.props.onPauseClick();
	}
	render(){
		const { data } = this.props;
		
		let headImgStyle = {
	        float:'left',
	        marginLeft:0,
	        marginTop:0,
	        backgroundImage: 'url(' + data.url + ')',
	        backgroundSize: 'contain',
	        backgroundRepeat:'no-repeat',
	      }
		return (
			<SwipeAction
	          style={{ backgroundColor: '#3A4056'}}
	          autoClose
	          right={[{
	              text: Lang.ipc.eventList.delete,
	              onPress: this.handleDelectClick,
	              style: { backgroundColor: '#FF5858', color: 'white', borderRadius: '0.34rem',border: '0px solid #303548', margin: "0.2rem 1.25rem 0px 0px",width:'6rem',height:'7.25rem' },
	            },]}
	          onOpen={() => console.log('global open')}
	          onClose={() => console.log('global close')}
	        >
		        <div className = {(this.state.isPlay || this.state.isPause) ? "event-item palying" : "event-item"}>
		        	<div className ='headImg' style={headImgStyle}>
		        		{/*<div className = "no_image" style={{display :(this.state.dataList.length?"none":"")}}></div>*/}
		        		{
		        			this.state.isPlay ?
		        			<a className="pause-btn" onClick={this.handlePauseClick}><i /></a> : 
		        			<a className="play-btn" onClick={this.handlePlayClick.bind(this, data.eventOddurTime)}><i /></a>
		        		}
		        	</div>
		        	<div className = "playTime">
		        		<h2>{helper.formatDate(new Date(data.eventOddurTime.replace(/-/g,"/")), 'hh:mm:ss')}</h2>
		        		<h3>{helper.formatDate(data.eventOddurTime, 'yyyy-MM-dd')}</h3>
		        	</div>
		        </div>
	        </SwipeAction>
		);
	}
}

//将state绑定到props
const mapStateToProps = (state) => {
  return {
  	playTime: state.ipc.playTime,
	pauseTime: state.ipc.pauseTime,
  }
};
//将action的所有方法绑定到props上
const mapDispatchToProps = (dispatch) => {
  return {
  	
  }
};
export default connect(mapStateToProps, mapDispatchToProps)(EventItem);
