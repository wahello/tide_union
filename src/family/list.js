import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Cookies from 'universal-cookie';
import { fetchFamilyList } from '../action/family';
import { Lang } from '../public';
import { Link } from 'react-router-dom';
import BarTitle from '../component/barTitle';
import './default/style.css';

class FamilyList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { actions } = this.props;
    const cookies = new Cookies();
    actions.fetchFamilyList({
      cookieUserId: cookies.get('userId'),
      cookieUserToken: '',
      pageSize: 100,
      offset: 0,
    });
  }
  
  render() {
    const { ids, items } = this.props;
    return (
      <div>
        <BarTitle onBack={() => this.props.history.goBack()} title={Lang.home.homeSettingTitle} />
        <div  className="home-list">
          <div className="header">{Lang.home.homes}</div>
          <ul className="list">
            {ids.map((id, index) =>
	        		<li key={index}>
                <Link to={`/family/set/${id}`}>{items[id].name}</Link>
              </li>
	        	)}
            <li>
              <Link to={`/family/set/0`}>{Lang.home.addHome}</Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    ids: state.family.list,
    items: state.family.items
  }
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ fetchFamilyList }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(FamilyList);
