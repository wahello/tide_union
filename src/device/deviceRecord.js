import React, {Component} from 'react';
import BarTitle from '../component/barTitle';
import ScrollView from '../component/scrollView';
import { showDialog ,selectTab} from '../action';
import SystemApi from '../jssdk/system';
import { Lang } from '../public';
import { connect } from 'react-redux';
import PullToRefresh from 'antd-mobile/lib/pull-to-refresh';
import 'antd-mobile/lib/pull-to-refresh/style/css';
import ListView from 'antd-mobile/lib/list-view';
import 'antd-mobile/lib/list-view/style/css';
import './default/style.css';
import './default/record.css';
import ReactDOM from 'react-dom';

const data = [
 
  {
    img: 'record-img-humiture',
    title: 'Away being opened',
    des: '19:00',
    type:0
  },
  {
    img: 'record-img-curtain',
    title: 'Light 1 turn on',
    des: '22:00',
      type:0
  },
  {
    des: '2018-3-7',
    type:1
  },
   {
    img: 'record-img-doorlock',
    title: 'Light 1 turn on',
    des: '22:00',
      type:0
  },
   {
    img: 'record-img-doorlock',
    title: 'Light 1 turn on',
    des: '22:00',
      type:0
  },
   {
    img: 'record-img-gateway',
    title: 'Light 1 turn on',
    des: '22:00',
      type:0
  },
   {
    des: 'Today',
    type:1
  },
];
const NUM_ROWS = 20;
let pageIndex = 0;

function genData(pIndex = 0) {
  const dataArr = [];
  for (let i = 0; i < NUM_ROWS; i++) {
    dataArr.push(`row - ${(pIndex * NUM_ROWS) + i}`);
  }
  return dataArr;
}

function GetDateStr(AddDayCount) { 
	var dd = new Date(); 
	dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期 
	var y = dd.getFullYear(); 
	var m = dd.getMonth()+1;//获取当前月份的日期 
	var d = dd.getDate(); 
	return y+"-"+m+"-"+d; 
	} 

var currentdate = GetDateStr(0);
var yesterday = GetDateStr(-1);
class DeviceRecord extends Component {
	constructor(props) {
		super(props);
		
		 
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {
      dataSource,
      refreshing: true,
      isLoading: true,
      height: document.documentElement.clientHeight,
      useBodyScroll: false,
    };
    
    
		this.handleDelete = this.handleDelete.bind(this);
		this.handleClickBack = this.handleClickBack.bind(this);
	}


  componentDidUpdate() {
    if (this.state.useBodyScroll) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
  }

  componentDidMount() {
    const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;

    setTimeout(() => {
      this.rData = genData();
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(genData()),
        height: hei,
        refreshing: false,
        isLoading: false,
      });
    }, 1500);
  }

  onRefresh = () => {
    this.setState({ refreshing: true, isLoading: true });
    // simulate initial Ajax
    setTimeout(() => {
      this.rData = genData();
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        refreshing: false,
        isLoading: false,
      });
    }, 600);
  };

  onEndReached = (event) => {
 if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    console.log('reach end', event);
    this.setState({ isLoading: true });
    setTimeout(() => {
      this.rData = [...this.rData, ...genData(++pageIndex)];
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        isLoading: false,
      });
    }, 1000);
  };

	handleClickBack(event) {
	  	this.props.history.goBack();
	}


handleDelete(event){
console.log("delete data")
 let that = this;
    that.props.showDialog(Lang.public.dialog.title[0], Lang.public.dialog.tip[0], [
      {
          text: Lang.public.dialog.button[0],
          handleClick: function(){
            this.hide();
          }
      },
      {
          text: Lang.public.dialog.button[1],
          className: "btn-split",
          handleClick: function(){
            this.hide();
            that.props.selectTab('device');
            that.setState({ data: [] });
          }
      }]);
  }
  
  
 
  render() {
  	const separator = (sectionID, rowID) => (
      <div key={`${sectionID}-${rowID}`}/>
    );
    let index = data.length - 1;
    const row = (rowData, sectionID, rowID) => {
      if (index < 0) {
        index = data.length - 1;
      }
      const obj = data[index--];

      return ( 
      	<div>
        <div   style={{display: (obj.type=== 1 ? "" :  "none")}}  className ='record-item' >
        <div style={{float:'left',marginTop:20,marginLeft:20,fontSize:20,color: '$text-color'}}>{obj.des == currentdate ? "Today" : (obj.des == yesterday ? "Yesterday" :obj.des)} </div> 
        </div>
        <div   style={{display: (obj.type === 0 ? "" :  "none")}}    className ='record-item' >
        <div    className ='cd-timeline-img' style={{float:'left',marginLeft:20,marginTop:22}}></div>
        <div style={{float:'left',marginLeft:20,marginTop:20,color: '$text-color'}}>{obj.title} </div> 
        <div  style={{float:'right',marginTop:20,marginRight:80,color: '$text-color'}} > {obj.des} </div>
        </div>
        </div>
);
    };

    return (<div>
    	<BarTitle onBack={this.handleClickBack}  onDelete={this.handleDelete}  title={Lang.device.record.title}/>
    	<div className="record-box">
      <ListView
        key={1}
        ref={el => this.lv = el}
        dataSource={this.state.dataSource}
        renderFooter={() => (<div style={{ padding: 80, textAlign: 'center' }}>
          {this.state.isLoading ? 'Loading...' : 'Loaded'}
        </div>)}
        renderRow={row}
        renderSeparator={separator}
        useBodyScroll={this.state.useBodyScroll}
        style={this.state.useBodyScroll ? {} : {
          height: this.state.height,
          margin: '5px 0',
        }}
        pullToRefresh={<PullToRefresh
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
         indicator={this.state.down ? {} : { deactivate: Lang.refresh.pull, finish: Lang.refresh.finish,activate: Lang.refresh.activate}}
        />}
        onEndReached={this.onEndReached}
        pageSize={5}
      />
      </div>
    </div>);
    
   
  }
}


//将state绑定到props
const mapStateToProps = (state) => {
  return {
  	  selectedTab: state.other.selectedTab
  }
};
//将action的所有方法绑定到props上
const mapDispatchToProps = (dispatch) => {
  return {
    selectTab: (...args) => dispatch(selectTab(...args)),
    showDialog: (...args) => dispatch(showDialog(...args))
  }
};
export default connect(mapStateToProps, mapDispatchToProps)(DeviceRecord);