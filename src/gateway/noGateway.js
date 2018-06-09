import React,{ Component } from 'react';
import './default/style.css';
import { Lang } from '../public/resource';
import BarTitle from '../component/barTitle';
import { connect } from 'react-redux';
import SystemApi from '../jssdk/system';

class NoGateway extends Component {
    constructor (props){
        super (props);
        this.state = {};
        this.systemApi = new SystemApi;
        this.handleClickBack = this.handleClickBack.bind(this);
    };
    handleClickBack(event){
        this.props.history.goBack();
    };
    nextPage(e){
        // this.props.history.go(-1)
        this.props.history.push('/gateway/addApGateway1');
    };
    componentDidMount(){
        this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
    }
    render(){
        return(
            <div className='no_gateway'>
                <BarTitle onBack={this.handleClickBack} title={Lang.gateway.noGateway.title}/>
                <div className='no_main'>
                    <p className='erro_text'>{Lang.gateway.noGateway.tips[0]}</p>
                    <button onClick={()=> this.nextPage()} className="no_add_gateway">{Lang.gateway.noGateway.tips[1]}</button>
                </div>
            </div>
        )
    }
}
export default connect()(NoGateway)