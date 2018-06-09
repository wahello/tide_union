import React, {
	Component
} from 'react';
import './default/style.css';
import { connect } from 'react-redux';
import { Lang } from '../public';
import BarTitle from '../component/barTitle';
import { Route, Link } from 'react-router-dom';
import jsBridge from '../jssdk/JSBridge';

class IPCSetting extends Component {
	constructor(props) {
		super(props);

		this.handleClickBack = this.handleClickBack.bind(this);
		this.handleClickSave = this.handleClickSave.bind(this);
	}

	handleClickBack(event) {
		this.props.history.goBack();
				//获取设备id
		jsBridge.send({
			service: 'NavPop',
			action: 'WatchTV'
		}).then(res => {

		});
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
			<div >
			 <BarTitle onBack={this.handleClickBack} title='Setting' onDone={this.handleClickSave} />
			 <div className="content">
					fggdgdgdgdgdg
				</div>
		</div>
		);
	}
}

export default(IPCSetting)