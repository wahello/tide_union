import React, {
	Component
} from 'react';
import './default/style.css';
import { connect } from 'react-redux';
import BarTitle from '../component/barTitle';
import{ Lang } from '../public';
import SystemApi from '../jssdk/system';

class DevSwitch extends Component{
    constructor(props) {
        super(props);
        this.state = {
            index:this.props.match.params.index,
            query: this.props.location.query || {},
            curObj: {},
            title:""
        }
        this.handleClickBack = this.handleClickBack.bind(this)
        this.handleClickSave = this.handleClickSave.bind(this)
        this.switchBtn = this.switchBtn.bind(this)
        this.systemApi = new SystemApi
    }
    handleClickBack(){
        let  path = {
			pathname:'/automation/timeofday',
			query:this.props.location.query,
		  }
		this.props.history.goBack();
		this.props.history.replace(path);
    }
    handleClickSave(){
        let arr = (this.props.location.query && this.props.location.query.seldev)|| [];
        let index = this.state.index;
        arr[index].switch = this.state.curObj.switch
        let  path = {
			pathname:'/automation/timeofday',
			query:this.props.location.query,
		  }
		this.props.history.goBack();
		this.props.history.replace(path);
    }
    switchBtn(){
        var obj = this.state.curObj
        obj.switch = !obj.switch;
        this.setState({curObj:obj})
    }
    componentDidMount(){
        let index = this.state.index;
        let {...curObj} = this.state.query.seldev ? this.state.query.seldev[index] : {}
        let title = curObj.title || ""
        this.setState({curObj,title});
        this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
    }
    render(){
        return (
            <div  className="devSwitch">
                <BarTitle onBack={this.handleClickBack} title={this.state.title} onDone={this.handleClickSave} />
				<div className="content">
                    <div className="Item">
                        <span>{"Triggered"}</span>
                        <div onClick = {this.switchBtn} className={this.state.curObj.switch?"turnOn":"turnOff"}></div>
                    </div>
                    <div className="Item">
                        <span>{"Untriggered"}</span>
                        <div onClick = {this.switchBtn} className={!this.state.curObj.switch?"turnOn":"turnOff"}></div>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect()(DevSwitch)