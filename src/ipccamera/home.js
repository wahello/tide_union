import React, {
	Component
} from 'react';
import './default/style.css';
import { connect } from 'react-redux';
import { Lang } from '../public';
import BarTitle from '../component/barTitle';
import { Route, Link } from 'react-router-dom';
import { Button, WhiteSpace } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import jsBridge from '../jssdk/JSBridge';
class IPCHome extends Component {
	constructor(props) {
		super(props);

		this.handleClickRecord = this.handleClickRecord.bind(this);
		this.handleClickPlay = this.handleClickPlay.bind(this);
		this.handleClickSetting = this.handleClickSetting.bind(this);
	}

	handleClickRecord(event) {
		this.props.history.push('./record');
	}
	handleClickPlay(event) {
		console.log("play==============");
		//获取设备id
		jsBridge.send({
			service: 'NavPush',
			action: 'WatchTV'
		}).then(res => {

		});
	}
	handleClickSetting(event) {
		this.props.history.push('./setting');
	}
	componentDidMount() {
		// debugger;
	}

	handleClickSave(event) {
		this.props.history.goBack();
		console.log('保存按钮被点击了');
	}
	render() {
		return(
			<div className="ipc home">
			 <BarTitle  title='Home' onDone={this.handleClickSave} />
			 <div className="content">
					<Button onClick={this.handleClickPlay}>watch tv</Button>
					<WhiteSpace size="xl" />
					<Button onClick={this.handleClickSetting}>Setting</Button>
					<WhiteSpace size="xl" />
					<Button onClick={this.handleClickRecord}>Record</Button>
				</div>
		</div>
		);
	}
}

export default(IPCHome)