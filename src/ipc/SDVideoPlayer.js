import React, {
  Component
} from 'react';
import './default/style.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Lang } from '../public';
import { Route, Link } from 'react-router-dom';
import BarTitle from '../component/barTitle';
import { Toast, Flex } from 'antd-mobile';
import { link } from 'fs';
import { showDialog } from '../action';
import jsBridge from '../jssdk/JSBridge';

const dialogLang = Lang.public.dialog;
class SDVideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.handleClickBack = this.handleClickBack.bind(this);
  }
  componentDidMount() {
    var that = this;
    jsBridge.on('SDCard.pop', function (res) {
			that.props.history.goBack();
		});
   
  }
	componentWillUnmount() {
    jsBridge.off('SDCard.pop');
  }
  handleClickBack(){
    this.props.history.goBack()
    jsBridge.send({
      service: 'SDCard',
      action: 'pop',
    }).then(res => {

    });
  }
  render() {
    return (
      <div className="ipcSDPlayer">
        <BarTitle title='SD card video' onBack={this.handleClickBack}></BarTitle>
        <div className="playerContend">

        </div>
      </div>
    );
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showDialog: (...args) => dispatch(showDialog(...args)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SDVideoPlayer)