import React,{ Component } from 'react';
import './default/style.css';
import { Lang } from '../public/resource';
import BarTitle from '../component/barTitle';
import { connect } from 'react-redux';
import SystemApi from '../jssdk/system';

class EventItem extends Component {
    constructor (props){
        super (props);
        this.state = {
            message:''
        },
        this.handleClickBack = this.handleClickBack.bind(this);
        this.firstUpperCase = this.firstUpperCase.bind(this);
        this.systemApi = new SystemApi;
    };

    componentDidMount(){
        
    }
    render(){
        return(
            <div className='event_item'>

            <div className = "img_head">
            <div className = "img_time">30s </div>
            </div>
            <div className = "timeinfo">
            <div className = "hourTime">12：08：00</div>
            <div className = "dateTime">2018-04-01</div>
            </div>
            </div>
        )
    }
}
export default connect()(EventItem)