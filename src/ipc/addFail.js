import React,{ Component } from 'react';
import './default/style.css';
import { Lang } from '../public/resource';
import BarTitle from '../component/barTitle';
import { connect } from 'react-redux';
import SystemApi from '../jssdk/system';

class AddFail extends Component {
    constructor (props){
        super (props);
        this.state = {
            message:''
        },
        this.handleClickBack = this.handleClickBack.bind(this);
        this.firstUpperCase = this.firstUpperCase.bind(this);
        this.handleAPMode = this.handleAPMode.bind(this);
        this.systemApi = new SystemApi;
    };
    handleClickBack(event){
        this.props.history.go(-5);
    };
    nextPage(e){
        this.props.history.go(-5);
    };
    handleAPMode(){
        this.props.history.push("./addCamera");
    }
    firstUpperCase(str) {
        return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
    }

    componentDidMount(){
        let tips = {
            error:200,
        }
        let messageError = Lang.ipc.addFail.tips[0];
        if (tips.code == 500) {
            messageError = Lang.ipc.addFail.tips[2];
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
                <BarTitle onBack={this.handleClickBack} title={Lang.ipc.addFail.title}/>
                <div className="main_fail">
                    <div className = "fail_main">
                        <div className='fail_tips'></div>
                        <p className='fail_tips_text'>{Lang.ipc.addFail.tips[0]}</p>
                        <p className='fail_tips_sub_text'>{Lang.ipc.addFail.tips[1]} <p className="ap_mode" onClick={this.handleAPMode.bind(this)}>{Lang.ipc.addFail.tips[3]}.</p></p>
                    </div>
                    <button onClick={()=> this.nextPage()} className="try_again">{Lang.ipc.addFail.tryAgain}</button>
                </div>
            </div>
        )
    }
}
export default connect()(AddFail)