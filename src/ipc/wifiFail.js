import React,{ Component } from 'react';
import './default/style.css';
import { Lang } from '../public/resource';
import BarTitle from '../component/barTitle';
import { connect } from 'react-redux';
import SystemApi from '../jssdk/system';

class WifiFail extends Component {
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
        this.props.history.go(-5);
    };
    nextPage(e){
        this.props.history.go(-5);
    };

    firstUpperCase(str) {
        return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
    }

    componentDidMount(){
        let tips = this.props.location.query.error;
        console.log("###"+tips.code+"--"+tips.desc);
        let messageError = "add fail";
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
                <BarTitle onBack={this.handleClickBack} title={Lang.ipc.wifiFail.title}/>
                <div className="main_fail">
                    <div className = "fail_main">
                        <div className='fail_tips'></div>
                        <p className='fail_tips_text'>{Lang.ipc.wifiFail.tips[0]}</p>
                        <p className='fail_tips_sub_text'>{this.state.message}</p>
                    </div>
                    <button onClick={()=> this.nextPage()} className="try_again">{Lang.ipc.wifiFail.next}</button>
                </div>
            </div>
        )
    }
}
export default connect()(WifiFail)