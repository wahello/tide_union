import React,{ Component } from 'react';
import './default/style.css';
import { Lang } from '../public/resource';
import BarTitle from '../component/barTitle';
import { connect } from 'react-redux';
import SystemApi from '../jssdk/system';

class UpdateSuccess extends Component {
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
        this.props.history.go(-2);
    };
    nextPage(e){
        this.props.history.go(-2);
    };

    firstUpperCase(str) {
        return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
    }

    componentDidMount(){
         this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
    }
    render(){
        return(
            <div className='fail_add'>
                <BarTitle onBack={this.handleClickBack} title={Lang.ipc.updateSuccess.title}/>
                <div className="main_fail">
                    <div className = "fail_main">
                        <div className='suceess_tips'></div>
                        <p className='success_tips_text'>{Lang.ipc.updateSuccess.tips[0]}</p>
                        <p className='fail_tips_sub_text'>{Lang.ipc.updateSuccess.tips[1] +this.props.location.query.version}</p>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect()(UpdateSuccess)