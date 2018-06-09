import React, { Component } from 'react';
import './default/style.css';
import { showDialog } from '../action';
import { connect } from 'react-redux';
import { Lang } from '../public';
import BarTitle from '../component/barTitle';
import SystemApi from '../jssdk/system';


class Feedback extends Component {
  constructor(props) {
  	super(props);
    
    const { dispatch } = props;
    this.dispatch = dispatch;
    this.systemApi = new SystemApi;
    
    this.handleClickBack = this.handleClickBack.bind(this);
    this.SubmitClick = this.SubmitClick.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
	}

  handleClickBack(event){
  	this.props.history.goBack();
  }
  SubmitClick(event){

}
 handleAddClick(event){
    
}
  
  componentDidMount(){
    /*this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
    this.systemApi.getVersion().then(res => {
      this.setState({
        version: res.version
      });
    })*/
    
  }
  
  render() {
  	
    return (
      <div className="setting default">           
          <BarTitle onBack={this.handleClickBack} title="Feedback"/>
            <div className="Feedback">
              <div className="textareaContainer"><textarea className="inputName" onChange={this.inputChange} maxlength="300" cols="50" rows="10" placeholder="Describe your issue"></textarea></div>
              <a className="btn-Submit" onClick={this.SubmitClick}>Submit</a>

            </div>
      </div>
    );
  }
}

export default connect()(Feedback)