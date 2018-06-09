import React,{ Component } from 'react';
import './default/style.css';
import { Lang } from '../public/resource';
import BarTitle from '../component/barTitle';
import { connect } from 'react-redux';
import SystemApi from '../jssdk/system';

class FaliAdd extends Component {
    constructor (props){
        super (props);
        this.state = {
            message:''
        },
        this.handleClickBack = this.handleClickBack.bind(this);
        this.firstUpperCase = this.firstUpperCase.bind(this);
        this.systemApi = new SystemApi;
    };
    handleClickBack(event){
        this.props.history.replace('/home');
    };
    nextPage(e){
        this.props.history.replace('/home');
    };

    firstUpperCase(str) {
        return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
    }

    componentDidMount(){
        let tips = this.props.location.query.error;
        let messageError = Lang.device.sirenhubAddFail.tips;
        if (tips.code == 500) {
            messageError = "Abnormal server";
        }else{
            messageError = tips.desc;
        }
        this.setState({
            message:messageError,
        });
        this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
    }
    render(){
        return(
            <div className='fail_add'>
                <BarTitle onBack={this.handleClickBack} title={`${Lang.gateway.title} ${this.props.location.query.devType}`}/>
                <div className="main_fail">
                    <div className = "fail_main">
                        <div className='fail_tips'></div>
                        <p className='fail_tips_text'>{this.state.message}</p>
                    </div>
                    <button onClick={()=> this.nextPage()} className="try_again">{Lang.gateway.fail.tips[1]}</button>
                </div>
            </div>
        )
    }
}
export default connect()(FaliAdd)