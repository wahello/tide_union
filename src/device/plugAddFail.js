import React,{ Component } from 'react';
import './default/style.css';
import { Lang } from '../public';
import BarTitle from '../component/barTitle';
import { connect } from 'react-redux';

class PlugAddFail extends Component {
    constructor (props){
        super (props);
        this.state = {
        	isSmartLink:this.props.location.isSmartLink
        },
        this.handleClickBack = this.handleClickBack.bind(this);
    };
    handleClickBack(event){
        if(this.state.isSmartLink){
    		this.props.history.push('/device/wifiPlugSLGuide');
    	} else {
    		this.props.history.push('/device/wifiPlugAPGuide');
    	}
    };
    done(e){
        this.props.history.push('../home');
    };
    continue(e){
    	if(this.state.isSmartLink){
    		this.props.history.push('/device/wifiPlugSLGuide');
    	} else {
    		this.props.history.push('/device/wifiPlugAPGuide');
    	}
        
    };
    handleChangeAP(e){
    	if(this.state.isSmartLink){
    		this.props.history.push('/device/wifiPlugAPGuide');
    	} else {
    		this.props.history.push('/device/wifiPlugSLGuide');
    	}
    }
    
    render(){
        return(
            <div className='fail_plug_add'>
                <BarTitle onBack={this.handleClickBack} title={Lang.device.plugAddFail.title}/>
                <div className='fail_tips'></div>
                <p className='fail_tips_text'>{Lang.device.plugAddFail.fail}</p>
                <div className='fail_desc_text'>
                	{Lang.device.plugAddFail.desc}
                	<div className='fail_link' onClick={() => this.handleChangeAP()}>{this.state.isSmartLink?Lang.device.plugAddFail.linkTxt:Lang.device.plugAddFail.smartLinkMode}</div>.
                </div>
                
                <button onClick={()=> this.continue()} className="try_again">{Lang.device.plugAddFail.tryAgain}</button>
            </div>
        )
    }
}
export default connect()(PlugAddFail)