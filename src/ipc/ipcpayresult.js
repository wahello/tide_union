import React, {
	Component
} from 'react';

import { connect } from 'react-redux';
import { Lang } from '../public';
import BarTitle from '../component/barTitle';
import { Route, Link } from 'react-router-dom';
import './default/style.css';
import jsBridge from '../jssdk/JSBridge';
const flag=true;
class Ipcpayresult extends Component {
	
	constructor(props) {
		super(props);
		this.handleClickBack = this.handleClickBack.bind(this);
	}
	componentDidMount() {
		// debugger;
	}

	handleClickBack(event) {
		this.props.history.goBack();
	}

	render() {
		
		return(
			<div className="payresult">
		    <BarTitle  title='Pay' onBack={this.handleClickBack} />
			<div className="content" >
			   <div className={flag  ? "payIcon sucess":"payIcon fail"}  ></div>
			 
			   <div className="payhint" style ={{color: (flag  ?  "#00E49C": "#FF5858" )}}  >{flag  ? "Play Sucessfully" :  "Play Failure"}</div>
			   
			</div>
		</div>
		);
	}
}

export default(Ipcpayresult)