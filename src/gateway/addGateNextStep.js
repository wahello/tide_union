import React,{ Component } from 'react';
import './default/style.css';
import { Lang } from '../public';

class addGateNextStep extends Component {
    render (){
        return(
            <div className='home-next'>
                <button className='step-next' onClick={this.props.nextStep}>{Lang.home.nextstep}</button>
            </div>
        )
    }
}
export default addGateNextStep