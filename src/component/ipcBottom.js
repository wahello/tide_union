import React, { Component } from 'react';
import './default/style.css';
import { Lang } from '../public';

class IpcBottom extends Component{
	constructor(props){
		super(props);
		this.state = {
			screenshot:true,
			talk:true,
			record:true,
			returnToLive:false,
			reconnect:false,
			state_disable:{}
		};
	}
	
	componentDidMount(){
		this.props.onRef(this);
	}
	
	getHeight(){
		return this.cpn.offsetHeight;
	}
	
	componentWillReceiveProps(nextProps){
		if(typeof(nextProps) != 'undefined'){
			if(nextProps.onTalk){
				this.setState({talk:true,returnToLive:false,reconnect:false});
			}
			if(nextProps.onReturnToLive){
				this.setState({returnToLive:true,talk:false,reconnect:false});
			}
			if(nextProps.onReconnect){
				this.setState({reconnect:true,talk:false,returnToLive:false})
			}
		}
	}
	render(){
		const { onScreenshot, onTalk, onRecord, onReturnToLive, onReconnect, disable, recordState } = this.props;
		let screenshotClass = 'screenshot',
			screenshotTxtClass = '',
			talkClass = 'talk',
			talkTxtClass = '',
			backClass = 'back',
			backTxtClass = '',
			reconnectClass = 'reconnect',
			reconnectTxtClass = '',
			recordClass = 'record',
			recordTxtClass = '';
		
		if(disable.onScreenshot){
			screenshotClass += ' disable';
			screenshotTxtClass = 'disable';
		}
		else{
			screenshotClass = 'screenshot';
			screenshotTxtClass = '';
		}
		if(disable.onTalk){
			talkClass += ' disable';
			talkTxtClass = 'disable';
		}
		else{
			talkClass = 'talk';
			talkTxtClass = '';
		}
		if(disable.onReturnToLive){
			backClass += ' disable';
			backTxtClass = 'disable';
		}
		else{
			backClass = 'back';
			backTxtClass = '';
		}
		if(disable.onReconnect){
			reconnectClass += ' disable';
			reconnectTxtClass = 'disable';
		}
		else{
			reconnectClass = 'reconnect';
			reconnectTxtClass = '';
		}
		if(recordState){
			recordClass += " action"
		}
		else{
			if(disable.onRecord){
				recordClass = "record disable";
			}
			else{
				recordClass = "record";
			}
			
		}
		
		return (
			<div className="component ipc-bottom" ref={cpn => this.cpn = cpn}>
				{this.props.children}
				{this.state.screenshot && 
					<div className="menu-item">
						<a className={screenshotClass} onClick={onScreenshot}></a>
						<p className={screenshotTxtClass}>{Lang.ipc.bottomButtom.name[0]}</p>
					</div>
				}
				{this.state.talk &&
					<div className="menu-item">
						<a className={talkClass} onClick={onTalk}></a>
						<p className={talkTxtClass}>{Lang.ipc.bottomButtom.name[1]}</p>
					</div>
				}
				{this.state.returnToLive &&
					<div className="menu-item">
						<a className={backClass} onClick={onReturnToLive}></a>
						<p className={backTxtClass}>{Lang.ipc.bottomButtom.name[3]}</p>
					</div>
				}
				{this.state.reconnect &&
					<div className="menu-item">
						<a className={reconnectClass} onClick={onReconnect}></a>
						<p className={reconnectTxtClass}>{Lang.ipc.bottomButtom.name[4]}</p>
					</div>
				}
				{this.state.record &&
					<div className="menu-item">
						<a className={recordClass} onClick={() => onRecord(!this.props.recordState)}></a>
						<p className={recordTxtClass}>{Lang.ipc.bottomButtom.name[2]}</p>
					</div>
				}
			</div>
		)
	};
}

export default (IpcBottom);
