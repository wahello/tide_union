import React,{ Component } from 'react';
import './default/style.css';
import { Lang } from '../public';
import BarTitle from '../component/barTitle';
import { connect } from 'react-redux';

class Connect extends Component {
    constructor (props){
        super (props);
        this.state = {
            wifiname : this.props.location.query.wifiname,
            id : this.props.location.query.id
        },
        this.handleClickBack = this.handleClickBack.bind(this);
        this.inputPassword = this.inputPassword.bind(this);
        
    };

    componentDidMount(){
        console.log(this.props.location.query.wifiname);
        console.log(this.state.wifiname);
    }

    handleClickBack(event){
        // this.props.history.goBack();
        this.props.history.push('/gateway/foudWifi');
        
    };

    inputPassword(e){
        let data = this.state;
        let path = {
            pathname:"/gateway/inputPassword",
            query:data
        }
        this.props.history.push(path);
    };
    render(){
        
        return(
            <div className='connect'>
                <BarTitle onBack={this.handleClickBack} title={Lang.gateway.foudWifi.title}/>
                <p className='connect_step'>{Lang.gateway.connect.tips[0]}</p>
                <div className='get_wifi_name'>
                   <p className="wifi_name">{this.state.wifiname}</p>
                   <p className="wifi_name" style={{marginTop:"2rem"}} onClick={(e)=>this.inputPassword(e)}>
                      <span className="wifi-name">{Lang.gateway.connect.tips[1]}</span><span className="eye_icon"></span>
                   </p>
                </div>
                <button className="step-next">{Lang.gateway.nextstep}</button>
            </div>
        )
    }
}
export default connect()(Connect)