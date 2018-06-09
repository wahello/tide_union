import React,{ Component } from 'react';
import './default/style.css';
import BarTitle from '../component/barTitle';
import { Lang } from '../public';
import { connect } from 'react-redux';


class Settings extends Component {
    constructor (props){
        super(props);
        this.handleClickBack = this.handleClickBack.bind(this);
        this.nextPage = this.nextPage.bind(this);
    };
    handleClickBack(event){
        // this.props.history.goBack();
        this.props.history.push('/gateway/addGateWay');
    };
    nextPage(){
        this.props.history.push('/gateway/foudWifi');
    }
    render(){
        return(
            <div className="settings">
                <BarTitle onBack={this.handleClickBack} title={Lang.gateway.settings.title}></BarTitle>
                <div className='main'>
                    <p className='set-step'>{Lang.gateway.settings.step[1]}</p>
                    <p className='set_tips'>{Lang.gateway.settings.step[2]}</p>
                    <div className="set-img"></div>
                    <button className='foud_wifi'>{Lang.gateway.settings.step[3]}</button>
                    <button onClick={()=>this.nextPage()} className='foud_wifi'>{Lang.gateway.nextstep}</button>
                </div>
            </div>
        )
    }
}
export default connect()(Settings )