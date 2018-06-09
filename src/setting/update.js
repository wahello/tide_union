import React, { Component } from 'react';
import './default/style.css';
import { showDialog } from '../action';
import { connect } from 'react-redux';
import { Lang } from '../public';
import BarTitle from '../component/barTitle';
import SystemApi from '../jssdk/system';


class Update extends Component {
  constructor(props) {
  	super(props);
    this.state = {};
    const { dispatch } = props;
    this.dispatch = dispatch;
    this.systemApi = new SystemApi;

    this.handleClickBack = this.handleClickBack.bind(this);
    this.handleClickUpdate = this.handleClickUpdate.bind(this);
	}

  handleClickBack(event){
  	this.props.history.goBack(); //必须加上/main，否则会触发平滑切换
  }

  handleClickUpdate(event){
  	this.dispatch(showDialog(Lang.public.dialog.title[0], Lang.setting.update.dialog.success.desc));
  }

  componentDidMount(){
    this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
  }

  render() {
    return ( 
      <div className="update">
        <BarTitle onBack={this.handleClickBack} title={Lang.setting.update.title} />
        <div className="bodyer">
        	<p className="logo"></p>
        	<p className="ask">{Lang.setting.update.ask}</p>
        	<p className="desc">{Lang.setting.update.desc}</p>
        	<p className="operate">
        		<a href="javscript:;" onClick={this.handleClickUpdate}>{Lang.setting.update.buttonText}</a>
        	</p>
        </div>
      </div>
    );
  }
}

export default connect()(Update)