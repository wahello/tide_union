import React, {
	Component
} from 'react';
import BarTitle from '../component/barTitle';
import ScrollView from '../component/scrollView';
import { showDialog, selectTab } from '../action';
import SystemApi from '../jssdk/system';
import { Lang } from '../public';
import { connect } from 'react-redux';
import '../setting/default/record.css';
import '../setting/default/activitystyle.css';
import { PullToRefresh, Button } from 'antd-mobile';
import ReactDOM from 'react-dom';
import { fetchAllDevActivity,deleteAllDevActivity,shouldUpdateActivityRecord} from '../action/device';
import Cookies from 'universal-cookie';
import { bindActionCreators } from 'redux';
import Device from '../jssdk/device';
import jsBridge from '../jssdk/JSBridge';
import Toast from 'antd-mobile/lib/toast';




function dedupe(array){
	  return Array.from(new Set(array)); 
	} 
function GetDateStr(AddDayCount) { 
	const dd = new Date(); 
	dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期 
	const y = dd.getFullYear(); 
	const m = dd.getMonth()+1;//获取当前月份的日期 
	const d = dd.getDate(); 
	return y+"-"+(m > 9?m : "0"+m)+"-"+(d > 9?d : "0"+d); 
	} 

const currentdate = GetDateStr(0);
const yesterday = GetDateStr(-1);
class ActivityRecord extends React.Component {

	cookies = new Cookies();
	constructor(props) {
		super(props);
		this.state = {
			refreshing: false,
			down: true,
			height: document.documentElement.clientHeight-100,
			newData: [],
		};
		this.systemApi = new SystemApi;
		this.handleDelete = this.handleDelete.bind(this);
		this.handleClickBack = this.handleClickBack.bind(this);
		console.log("执行-----constructor")	
	}
	getActivityRecord(offset){
		const request = {
			cookieUserId: this.cookies.get('userId'),
			cookieUserToken:this.cookies.get("accessToken"),
			pageSize:  15 ,
      offset:  offset ,
      type: 'SECURITY'
			// timestamp: getNowFormatDate()
  
		};

		const {
			actions
		} = this.props;
	
		actions.fetchAllDevActivity(request);
	

	}

	componentWillMount() {
		console.log("执行-----componentWillMount")	
		this.getActivityRecord(1)
		}
				
		componentDidMount(){
			this.systemApi.offGoBack().onceGoBack(this.handleClickBack);
		// 	const hei = this.state.height - ReactDOM.findDOMNode(this.ptr).offsetTop;
        //    setTimeout(() => this.setState({
        //       height: hei,
        //        }), 0);
		   }
					
	handleClickBack(event) {
		this.props.history.goBack();
		const {
			actions
		} = this.props;
	
		actions.shouldUpdateActivityRecord();
	
	}
	
	handleDelete(event) {
		console.log("delete data")
		const {dataList} = this.props;   
		let that = this;

		if(dataList.length == 0){
			Toast.info(Lang.setting.activity.noData,2);
			return;
		
		}
		that.props.showDialog(Lang.public.dialog.title[0], Lang.public.dialog.tip[0], [{
				text: Lang.public.dialog.button[0],
			
				handleClick: function() {
					this.hide();
					// var deviceInfo = {
					// 	//  userId:this.cookies.get('userId'),
					// 	userId:"00001000000004146qe47nw1k",
					// 	uid:"C1PA956WU1R4HG6GYHE1",
					// 	name:"admin",
					// 	password:"admin123",
					// 	deviceId:"000010000000101nr94lwi6nj",
					//   }
					  
					// //   jsBridge.send({
					// // 	service: 'LiveAndPlayBack',
					// // 	action: 'start',
					// // 	data: deviceInfo,
					// //   }).then(res => {
					
					// //   });
					  
					// that.props.history.push("../ipc");
			
				}
			},
			{
				text: Lang.public.dialog.button[1],
				className: "btn-split",
				handleClick: function() {
					this.hide();
					that.props.selectTab('device');
				
					const delRequest = {
						cookieUserId: that.cookies.get('userId'),
						cookieUserToken:that.cookies.get("accessToken"),
					};
					
					const {
						actions
					} = that.props;	

					actions.deleteAllDevActivity(delRequest);
					console.log("执行-----deleteAllDevActivity")	
					setTimeout(() => {
						that.getActivityRecord(1);
						this.setState({newData:[]},()=>{
							that.state.newData = []
							});
						  }, 1000);

					
				}
			}
		]);
	}

	render() {
		console.log("执行-----render")
		const data = [
		];
		console.log("newData开始长度"+this.state.newData.length)
		const {dataList, dataCount,currentPage,shouldUpdateActivityRecord} = this.props;
		console.log("dataList开始长度"+dataList.length)
		if(shouldUpdateActivityRecord){
			this.state.newData =dedupe( this.state.newData.concat(dataList));
		}
		console.log("newData后来长度"+this.state.newData.length)
		const timeArray = [];
		this.state.newData.map((item, index) =>
		timeArray.push(item.time.split(" ")[0])
		)
		const newTimeArr = dedupe(timeArray);
		for(let i = 0; i< newTimeArr.length; i++){
			const firstArray = [];
			const time= newTimeArr[i];
			data.push({type:1,des:time});
					
			this.state.newData.map((item, index) =>{
			const c =  item.time.split(" ")[0];
			if(c == time){
			firstArray.push(item)
			}
		}
		)	
		
		firstArray.map((item, index) =>{
			data.push({type:0,des:item.time.split(" ")[1],title:item.activity,icon:(item.icon == "door_lock"? "doorlock" : item.icon),last:(index == (firstArray.length-1) ? 1 : 0)});
		}
		
		)
	  }		

		return(
		<div><BarTitle onBack={this.handleClickBack}  onDelete={this.handleDelete}  title={Lang.setting.activity.title}/>
		<div className="list_main">
		<div style = {{display: (this.state.newData.length === 0 ? "" : "none"),color:"#FFFFFF",paddingTop:"200px", textAlign:"center"}}>{Lang.setting.activity.empty}</div>
       <PullToRefresh
        ref={el => this.ptr = el}
        style={{
          height: this.state.height,
					overflow: 'auto',
				}}
			
						indicator={{ activate: 'refresh', deactivate:'down', release: 'release', finish:'finish' }}
						direction= "up"
						refreshing={this.state.refreshing}
						onRefresh={() => {
					this.setState({ refreshing: true });
					console.log("get  data")
				if(currentPage< dataCount){
				
					this.getActivityRecord(currentPage+1);
				}
							setTimeout(() => {
					this.setState({ refreshing: false });
					console.log("finish ")
							}, 2000);
						}}
					>
        {data.map((item, index) => (
        <div key= {index} >
          <div   style={{display: (item.type=== 1 ? "" :  "none")}}  className ='activity-record-item' >
             <div className = "record-day" >{item.des == currentdate ? "Today" : (item.des == yesterday ? "Yesterday" :item.des)} </div> 
          </div>
          <div   style={{display: (item.type === 0 ? "flex" :  "none")}}    className ='activity-record-item' >
             <div  className ={"record-img-"+item.icon} style={{float:'left',marginTop:20}}></div>
             <div className = "record-title" >{item.title} </div> 
             <div  className = "record-des" > {item.des} </div>
          </div>
        </div>
        )
        )}
      </PullToRefresh>
	  </div>
    </div>);
	}
}

//将state绑定到props
const mapStateToProps = (state) => {
   console.log(state);
	return {
		selectedTab: state.other.selectedTab,
		dataList:state.device.allRecord,
		dataCount:state.device.allRecordCount,
		currentPage:state.device.allPageNum,
		shouldUpdateActivityRecord: state.device.shouldUpdateActivityRecord,
	}
};
//将action的所有方法绑定到props上
const mapDispatchToProps = (dispatch) => {
	
	return {
		actions: bindActionCreators({fetchAllDevActivity,deleteAllDevActivity,shouldUpdateActivityRecord}, dispatch),
		selectTab: (...args) => dispatch(selectTab(...args)),
		showDialog: (...args) => dispatch(showDialog(...args))
	}
	
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityRecord);