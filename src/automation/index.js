import React, {
	Component
} from 'react';
import './default/style.css';
import{ Lang } from '../public';
import { Route, Link, Switch } from 'react-router-dom';
import LayoutMultilayer from '../layout/multilayer';
import PageAutomationAdd from './add';
import PageAutomationCreate from './create';
import PageRepeat from './repeat';
import PageTimeOfDay from './timeofday';
import PageDevSwitch from './devSwitch';
import PageSelectDevices from './selectdevices';
import TriggerDeviceList from './triggerDeviceList';
import TriggerMotionDetail from './triggerMotionDetail';
import TriggerDoorDetail from './triggerDoorDetail';
import HappenBulb from './happenBulb';
import MakeHappen from './makeHappen';
import DuringTime from './duringTime';
import TimeSet from './timeSet';

export default class extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
    }

	render() {
		return(
            <LayoutMultilayer history={this.props.history} location={this.props.location}>
                <Route exact path="/automation/add" component={PageAutomationAdd}/>
                <Route exact path="/automation/create" component={PageAutomationCreate}/>
                <Route exact path="/automation/timeofday" component={PageTimeOfDay}/>
                <Route exact path="/automation/devSwitch/:index" component={PageDevSwitch} />
                <Route exact path="/automation/repeat" component={PageRepeat} />
                <Route exact path="/automation/triggerDeviceList" component={TriggerDeviceList} />
                <Route exact path="/automation/triggerMotionDetail" component={TriggerMotionDetail} />
                <Route exact path="/automation/triggerDoorDetail" component={TriggerDoorDetail} />
                <Route exact path="/automation/makeHappen" component={MakeHappen} />
                <Route exact path="/automation/duringTime" component={DuringTime} />
                <Route exact path="/automation/selectdevices" component={PageSelectDevices} />
                <Route exact path="/automation/happenBulb" component={HappenBulb} />
                <Route exact path="/automation/timeSet" component={TimeSet} />
            </LayoutMultilayer>
		);
	}
}