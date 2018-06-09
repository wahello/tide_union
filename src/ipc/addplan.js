import React from 'react';
import './default/ipcplan.css';
import 'antd-mobile/dist/antd-mobile.css';
import './default/style.css';
import { Button, WingBlank } from 'antd-mobile';
import BarTitle from '../component/barTitle';
import Cookies from 'universal-cookie';
import IpcPlanAPi from '../jssdk/ipcplan';
import { Link } from 'react-router-dom';
import { showDialog } from '../action';
import { connect } from 'react-redux';
import { Lang } from '../public';


class Addplan extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selectedItem:0
        };
        this.handleAddplan = this.handleAddplan.bind(this);
        this.handleClickBack = this.handleClickBack.bind(this);
    }

    componentDidMount(){
        var param = {

            deviceType: '03',
            pageNum: 1,
            pageSize: 10,
        };

        IpcPlanAPi.getVideoPackageList(param).then(res => {
            if (res.code==200&&res.data) {
                this.setState({ data: res.data.list });
            }
        })

    }
    componentWillUnmount(){

    }
    onChange = (val) => {
      this.setState({selectedItem:val})
    }

    handleClickBack(event) {
      this.props.history.goBack();
    }
    handleAddplan() {
        let data = {
            price: this.state.data[this.state.selectedItem].packagePrice,
            planName: this.state.data[this.state.selectedItem].packageName,
            planDesc: this.state.data[this.state.selectedItem].packageDesc,
            packageId: this.state.data[this.state.selectedItem].packageId,
            fromPage:'add',
        }
        let path = {
            pathname: '/ipc/selectplan',
            query: data
        }
        this.props.history.push(path);
    }
    render() {
      return (
        <div className="ipcplan">
            <BarTitle title={Lang.ipc.videomanagement.title} onBack={this.handleClickBack} />
            <div className="deviceIconBackground">
                <div className="deviceIcon"></div>
            </div>
            <WingBlank>
              { this.state.data.map((item,index) => (
                  <div className='customlist'>
                      <div className="item" onClick={() => this.onChange(index)}>
                          <span className="title">{item.packageName} </span>
                          <span className="name">
                          <img 
                          src={require(index==this.state.selectedItem ? './default/image/common_icon_the_radio.png' : './default/image/common_icon_checkbox_off.png')} 
                          style={{ width: '25px', height: '25px', paddingTop:'10px',marginRight:'10px'}} alt="" /></span>
                      </div>
                  </div>
                ))
              } 
            </WingBlank>
              <Button style={{
                  position: 'absolute',
                  bottom: '5rem',
                  right: '1.5rem',
                  left: '1.5rem'
              }} onClick={this.handleAddplan} >{Lang.ipc.videomanagement.purchase}</Button>
        </div>
      );
    }
}

//将state绑定到props
const mapStateToProps = (state, props) => {
    // console.log(props.locatoin.query);


    return {

    }
};
//将action的所有方法绑定到props上
const mapDispatchToProps = (dispatch) => {

    return {
        showDialog: (...args) => dispatch(showDialog(...args))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Addplan);
