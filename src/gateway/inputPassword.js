import React,{ Component } from 'react';
import './default/style.css';
import { Lang } from '../public';
import BarTitle from '../component/barTitle';
import { connect } from 'react-redux';
import Toast from 'antd-mobile/lib/toast';
import 'antd-mobile/lib/toast/style';

class InputPassword extends Component {
    constructor (props){
        super (props);
        this.state = {
            wifiName : this.props.location.query.wifiname,
            id : this.props.location.query.id,
            password:'',
            click:false,
            clear:false
        },
        this.handleClickBack = this.handleClickBack.bind(this);
        this.changeType = this.changeType.bind(this);
        this.clearInput = this.clearInput.bind(this);
    };

    componentDidMount(){
        // console.log(this.props.location.query);
    }

    handleClickBack(event){
        // this.props.history.goBack();
        let data = {
            wifiname : this.state.wifiName,
            id : this.state.id
        }
        let path = {
            pathname:'/gateway/connect',
            query : data
        }
        // this.props.history.push('/gateway/connect')
        this.props.history.push(path)
    };

    stateChange(e){
        const target = e.target;
        this.setState({
            [target.name]:target.value,
            clear:true
        })
    };

    joinWifi(e){
        const {
			wifiName,
			password
		} = this.state;
        if(!password) return Toast.info('密码不能为空 !!!', 2);
        let data = {
            wifiname : this.state.wifiName,
            id : this.state.id
        }
        let path = {
            pathname:'/gateway/adding',
            query : data
        }
        this.props.history.push(path)
    };

    changeType(){
        this.setState({
            click:!this.state.click
        })
    }

    clearInput(){
        this.setState({
            password:'',
            clear:false
        })
    }
    render(){
        return(
            <div className='inputPassword'>
                <BarTitle onBack={this.handleClickBack} title={Lang.gateway.foudWifi.title}/>
                <p className='input_step'>{Lang.gateway.connect.tips[0]}</p>
                <div className='input_pws'>
                    <p className="wifi_name" name='wifiName'>{this.state.wifiName}</p>
                    <p className="wifi_name wifi_password" style={{marginTop:"2rem"}} onChange={(e)=>this.stateChange(e)}>
                        <input className="wifi_psw" type={this.state.click === false ? "password" : "text"} placeholder={Lang.gateway.connect.tips[2]} name='password'value={this.state.password} />
                        <i className={this.state.click === false ? "eye_icon" : "eye_open"} onClick={()=>this.changeType()}></i>
                        <i className={this.state.clear === false ? 'hid_del_icon' : 'del_icon'} onClick={(e)=>this.clearInput(e)}></i>
                    </p>
                </div>
                <button className="step-next" onClick={(e)=>this.joinWifi(e)}>{Lang.gateway.nextstep}</button>
            </div>
        )
    }
}
export default connect()(InputPassword)