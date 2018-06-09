import React,{ Component } from 'react';
import './default/style.css';
import BarTitle from '../component/barTitle';
import { Lang } from '../public/resource';
import { connect } from 'react-redux';


class GatewayReset extends Component {
    constructor (props){
        super(props);
        this.handleClickBack = this.handleClickBack.bind(this);
        this.nextPage = this.nextPage.bind(this);
    };
    handleClickBack(event){
        // this.props.history.goBack();
        this.props.history.goBack();
    };
    nextPage(){
        this.props.history.push('/gateway/addGateWay');
    }
    render(){
        return(
            <div className="gatewayReset">
                <BarTitle onBack={this.handleClickBack} title={Lang.gateway.title}></BarTitle>
                <div className="main">
                    <p className='tips'>{Lang.gateway.gatewayReset.text}</p>
                    <div className="reset-img"></div>
                    <button className='already_reset' onClick={ this.nextPage }>{Lang.gateway.gatewayReset.buttonText}</button>
                </div>
            </div>
        )
    }
}
export default connect()(GatewayReset)