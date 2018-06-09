import React, {
    Component
} from 'react';

import { connect } from 'react-redux';
import { Lang } from '../public';
import BarTitle from '../component/barTitle';
import { Route, Link } from 'react-router-dom';
import './default/style.css';
import jsBridge from '../jssdk/JSBridge';
const flag = true;
var timer = null;
class Ipcpaysuccess extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            fromPage: this.props.location.query.fromPage,
        }
        this.handleClickBack = this.handleClickBack.bind(this);
    }
    componentDidMount() {
        timer = setTimeout(() => {
            if (this.state.fromPage == 'list') {
                this.props.history.go(-2);
            }else {
                this.props.history.go(-3);
            }
        }, 4000);
    }
    componentWillUnmount(){
        if (timer) {
            clearTimeout(timer);
        }
    }

    handleClickBack(event) {
        if (this.state.fromPage == 'list') {
            this.props.history.go(-2);
        } else {
            this.props.history.go(-3);
        }
        if (timer) {
            clearTimeout(timer);
        }
    }

    render() {

        return (
            <div className="payresult">
                <BarTitle title='Pay' onBack={this.handleClickBack} />
                <div className="content" >
                    <div className={flag ? "payIcon sucess" : "payIcon fail"}  ></div>

                    <div className="payhint" style={{ color: (flag ? "#00E49C" : "#FF5858") }}  >{flag ? "Play Sucessfully" : "Play Failure"}</div>

                </div>
            </div>
        );
    }
}

export default (Ipcpaysuccess)