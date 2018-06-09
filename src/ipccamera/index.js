import React, {
	Component
} from 'react';
import './default/style.css';
import { Lang } from '../public';
import { Route, Link, Switch } from 'react-router-dom';
import LayoutMultilayer from '../layout/multilayer';
import IPCSetting from './setting';
import IPCHome from './home';
import IPCRecord from './record';

export default class extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {}

	render() {
		return(
		
			<LayoutMultilayer history={this.props.history} location={this.props.location}>
                <Route exact path="/ipccamera/setting" component={IPCSetting}/>
                 <Route exact path="/ipccamera/home" component={IPCHome}/>
                   <Route exact path="/ipccamera/record" component={IPCRecord}/>
            </LayoutMultilayer>

		);
	}
}