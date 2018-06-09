import React, {Component} from 'react';
import BarTitle from '../component/barTitle';
import ScrollView from '../component/scrollView';
import { showDialog ,selectTab} from '../action';
import SystemApi from '../jssdk/system';
import { Lang } from '../public';
import { connect } from 'react-redux';
import PullToRefresh from 'antd-mobile/lib/pull-to-refresh';
import 'antd-mobile/lib/pull-to-refresh/style/css';
import SwipeAction from 'antd-mobile/lib/swipe-action';
import ListView from 'antd-mobile/lib/list-view';
import 'antd-mobile/lib/list-view/style/css';
import './default/style.css';
import DatePicker from 'antd-mobile/lib/date-picker';
import ReactDOM from 'react-dom';
import Ipcplan from '../jssdk/ipcplan';

let NUM_ROWS = 0;
let pageIndex = 0;
let startTime = "2018-3-24 03:52:37";
let endTime = "2018-4-24 11:59:00";
//更新数据数量
function genData(pIndex = 0) {
  const dataArr = [];
  for (let i = 0; i < NUM_ROWS; i++) {
    dataArr.push(`row - ${(pIndex * NUM_ROWS) + i}`);
  }
  return dataArr;
}
//获取时间
function GetDateStr(AddDayCount) { 
	var dd = new Date(); 
	dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期 
	var y = dd.getFullYear(); 
	var m = dd.getMonth()+1;//获取当前月份的日期 
  var d = dd.getDate(); 
  var h = dd.getHours();
  var min = dd.getMinutes();
  var s = dd.getSeconds();
	return y+"-"+m+"-"+d+" "+h+":"+min+":"+s; 
  } 
  //比较时间
  function contrastTime(begin, end) {  
    var endDate = new Date(end.replace(/-/g, "/"));    
    var beginDate = new Date(begin.replace(/-/g, "/"));
    var difference = (Date.parse(endDate) - Date.parse(beginDate)) / 1000 / 60; //利用时间戳算出相差的分钟  
    console.log("时间差是：",difference)
    return difference; 
   } 
var currentdate = GetDateStr(0);
var yesterday = GetDateStr(-1);
class EventList extends Component {
	constructor(props) {
		super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {
      dataSource,
      refreshing: true,
      isLoading: true,
      height: document.documentElement.clientHeight-100,
      useBodyScroll: false,
      dataList:[],
      photoUrlList:[],
      photoUrlObj:{}
    };
    
    this.onRefresh = this.onRefresh.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
    this.handleClickBack = this.handleClickBack.bind(this);
    this.datePickerChoose = this.datePickerChoose.bind(this);
    this.getPhotoUrlList = this.getPhotoUrlList.bind(this);
    this.getVideoEventList = this.getVideoEventList.bind(this);
	}

  componentDidUpdate() {
    if (this.state.useBodyScroll) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
  }
 
  componentDidMount() {
    var that = this;
    NUM_ROWS = 0;
    startTime =   "2018-3-24 03:52:37";
    endTime = "2018-4-24 12:59:00";
    if (this.state.dataList.length) {
      setTimeout(() => {
        this.rData = genData();
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(genData()),
          refreshing: false,
          isLoading: false,
        });
      }, 1500);
    }
      let parameter = {
        planId:"12",
        startTime:"2018-3-24 03:52:37",
        endTime:endTime,
        pageNum:1,
        pageSize:10
      }
      this.getVideoEventList(parameter);
  }
 //弹出日历控制器
 datePickerChoose(){

}

getVideoEventList(parameter,callback){
  Ipcplan.getVideoEventList(parameter).then((result) => {
    NUM_ROWS = result.data.list.length+NUM_ROWS;
    this.rData = genData();
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.rData),
      refreshing: false,
      isLoading: false,
      dataList:result.data.list,
    });
   
    Promise.all(this.getPhotoUrlList(startTime,endTime,"12","12","12",result.data.list.length)).then(
      callback()
    );
  }).catch((err) => {
    setTimeout(() => {
      this.rData = genData();
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        refreshing: false,
        isLoading: false,
      });
    }, 600);
  });
}

  getPhotoUrlList(startTime,endTime,deviceId,plantId,eventCode,countNum){
    let photoParameter={
      pageNum:1,
      pageSize:100,
      planId:plantId,
      eventCode:eventCode,
      deviceId:deviceId,
      eventStartTime:startTime,
      eventEndTime:endTime
    }
    let promiseArr = []
    for (let index = 0; index < countNum/100; index++) {
     photoParameter.pageNum = index+1;
     let promiseItem = Ipcplan.getEventPhotoList(photoParameter).then((result) => {
      let photoObj = {}; 
      result.data.list.map((item)=>{
        let key = item.eventId;
        photoObj[key] = item;
      });
      this.setState({
        refreshing: false,
        isLoading: false,
        photoUrlObj:photoObj,
      },() => {
      });
    }).catch((err) => {
      console.log(err)
    });
    promiseArr.push(promiseItem)
    }

    return promiseArr
  }
   
  onRefresh(){
    startTime = "2018-4-24 11:59:00";
    endTime="2018-4-25 11:59:00";
    if (endTime == "") {
      return;
    }
    if (contrastTime(this.state.dataList[this.state.dataList.length-1].eventOddurTime,endTime)>0) {
      this.setState({ refreshing: true, isLoading: true });
      let parameter = {
        planId:"12",
        startTime: startTime,
        endTime:endTime,
        pageNum:1,
        pageSize:100
      }
      this.getVideoEventList(parameter,()=>{
        endTime = "";
      });
    }
  };

  onEndReached = (event) => {
//  if (this.state.isLoading && !this.state.hasMore) {
//       return;
//     }
//     console.log('reach end', event);
//     this.setState({ isLoading: true });
//     setTimeout(() => {
//       this.rData = [...this.rData, ...genData(++pageIndex)];
//       this.setState({
//         dataSource: this.state.dataSource.cloneWithRows(this.rData),
//         isLoading: false,
//       });
//     }, 1000);
  };
 
	handleClickBack(event) {
	  	this.props.history.goBack();
	}

  handleDelete(event){
  console.log("delete data")
  let that = this;
      that.props.showDialog(Lang.public.dialog.title[0], Lang.public.dialog.tip[0], [{
            text: Lang.public.dialog.button[0],
            handleClick: function(){
              this.hide();
            }
        },{
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
    let index = this.state.dataList.length - 1;
 
    const row = (rowData, sectionID, rowID) => {
      if (index < 0) {
        index = this.state.dataList.length - 1;
      }
      const obj = this.state.dataList[index--];
      let imgUrl =Object.keys(this.state.photoUrlObj).length?(this.state.photoUrlObj[obj.eventId] != undefined?this.state.photoUrlObj[obj.eventId].url:""):"";
      let headImgStyle = {
        float:'left',
        marginLeft:0,
        marginTop:0,
        backgroundImage: 'url(' + imgUrl + ')',
        backgroundRepeat:'no-repeat',
      }
      return ( 
        obj?
        <SwipeAction
          style={{ backgroundColor: '#3A4056'}}
          autoClose
          right={[{
              text: Lang.ipc.eventList.delete,
              onPress: this.handleDelectClick,
              style: { backgroundColor: '#FF5858', color: 'white', borderRadius: '0.34rem',border: '0px solid #303548', margin: "1.25rem 1.25rem 0px 0px",width:6*12,height:7.25*12 },
            },]}
          onOpen={() => console.log('global open')}
          onClose={() => console.log('global close')}
        >
        <div className = "bg">
          <div style={{display: (this.state.dataList? "" :  "none")}}    className = {'record-item'+" "+ (false?"playing":"") } >
          <div className ='headImg' style={headImgStyle}>
          <div className = "no_image" style={{display :(imgUrl.length?"none":"")}}></div> 
          <div className = "imagePlay" style={{display :(imgUrl.length?"none":"")}}>
          <div className = "imageIcon"style={{display :(imgUrl.length?"none":"")}}></div>
          </div>
          <div className = "playTime"></div>
          </div>
          <div className = "hourTime">{obj.eventOddurTime.substr(11,10)} </div> 
          <div className = "dateTime">{obj.eventOddurTime.substr(0,10)} </div> 
          </div>
          </div>
        </SwipeAction>:""
        );
    };
 
    return (
      
     <div>
      <div className="eventList">
      <div className = {this.state.dataList.length?"":"no_list_image"}></div>
      <div className = {this.state.dataList.length?"":"no_list_text"}>{this.state.dataList.length?"":Lang.ipc.eventList.tips[0]}</div>
      { this.state.dataList.length?
           <ListView
              ref={el => this.lv = el}
              dataSource={this.state.dataSource}
              renderFooter={() => (<div style={{ padding: 0, textAlign: 'center' }}>
                {/* {this.state.isLoading ? 'Loading...' : 'Loaded'} */}
              </div>)}
              renderRow={row}
              renderSeparator={separator}
              useBodyScroll={this.state.useBodyScroll}
              style={this.state.useBodyScroll ? {} : {
                height: this.state.height,
                overflow: 'auto',
              }}
                pullToRefresh={<PullToRefresh refreshing={this.state.refreshing} onRefresh={this.onRefresh.bind(this)}  direction='up'/>}
                onEndReached={this.onEndReached}
                pageSize={1}
            />:""
      }
      </div>
      </div>
    
    );   
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
export default connect(mapStateToProps, mapDispatchToProps)(EventList);