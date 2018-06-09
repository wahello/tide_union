import React, {
	Component
} from 'react';
import './default/style.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Lang } from '../public';
import { Route, Link } from 'react-router-dom';
import BarTitle from '../component/barTitle';

class Ipccamera extends Component {
	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
		this.handleAddClick = this.handleAddClick.bind(this);
	}
	componentDidMount() {

	}

	handleClick(data) {

	}

	handleAddClick() {
		this.props.history.push('./ipccamera/setting');
	}
	render() {
		return(
			<div className="ipc main">
      	<BarTitle onAdd={this.handleAddClick}>
    		</BarTitle>
				<h1>go to watch tv</h1>
    
       dffffffffffffffffffffffff
      </div>
		);
	}
}

export default(Ipccamera)