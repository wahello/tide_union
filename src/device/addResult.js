import React,{ Component } from 'react';
import './default/style.css';
import { Lang } from '../public';
import BarTitle from '../component/barTitle';
import { connect } from 'react-redux';

class AddResult extends Component {
    constructor (props){
        super (props);
        this.state = {},
        this.handleClickBack = this.handleClickBack.bind(this);
    };
    handleClickBack(event){
        this.props.history.goBack();
    };
    done(e){
        this.props.history.push('../home')
    };
    continue(e){
        this.props.history.push('/gateway/addGateWay')
    };
    render(){
        return(
            <div className='success_add'>
                <BarTitle onBack={this.handleClickBack} title={Lang.device.add1.name}/>
                <div className='success_tips'></div>
                <p className='success_tips_text'>{Lang.device.add1.success}</p>
                <button onClick={()=> this.done()} className="success_done">{Lang.device.add1.doneBtn}</button>
                <button onClick={()=> this.continue()} className="success_continue">{Lang.device.add1.continue}</button>
            </div>
        )
    }
}
export default connect()(AddResult)