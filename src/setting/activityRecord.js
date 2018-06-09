import React, {
	Component
} from 'react';
import BarTitle from '../component/barTitle';
import ScrollView from '../component/scrollView';
import { showDialog, selectTab } from '../action';
import SystemApi from '../jssdk/system';
import { Lang } from '../public';
import { connect } from 'react-redux';
import './default/record.css';
import './default/activitystyle.css';
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
	var dd = new Date(); 
	dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期 
	var y = dd.getFullYear(); 
	var m = dd.getMonth()+1;//获取当前月份的日期 
	var d = dd.getDate(); 
	return y+"-"+(m > 9?m : "0"+m)+"-"+(d > 9?d : "0"+d); 
	} 

var currentdate = GetDateStr(0);
var yesterday = GetDateStr(-1);
class ActivityRecord extends React.Component {

	cookies = new Cookies();
	constructor(props) {
		super(props);
		this.state = {
			refreshing: false,
			down: true,
			height: document.documentElement.clientHeight-100,
			newData: [],
			showNoData:false,
			showErrorResult:true,
		};
		this.systemApi = new SystemApi;
		this.handleDelete = this.handleDelete.bind(this);
		this.handleClickBack = this.handleClickBack.bind(this);
		console.log("执行-----constructor")	
	}
	getActivityRecord(offset){
		var request = {
			cookieUserId: this.cookies.get('userId'),
			cookieUserToken:this.cookies.get("accessToken"),
			pageSize:  15 ,
			offset:  offset ,
			// timestamp: getNowFormatDate()
  
		};

		const {
			actions
		} = this.props;
	
		actions.fetchAllDevActivity(request);
	

	}

	componentWillReceiveProps(nextProps){
		if(!nextProps.isFteaching){
			Toast.hide();
			if(nextProps.resultStatus){
				this.setState({
					showNoData:true
				})
			}else{
				if(this.state.showErrorResult){
					Toast.info("获取记录失败",2)
					this.setState({
						showErrorResult:false
					})
				}
			
			}
		}
	}
	componentWillMount() {
		Toast.loading("",10,()=>{
        this.setState({
			showErrorResult:false
		})
		});
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
			
				}
			},
			{
				text: Lang.public.dialog.button[1],
				className: "btn-split",
				handleClick: function() {
					this.hide();
					that.props.selectTab('device');
				
					var delRequest = {
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
		var data = [];
		console.log("newData开始长度"+this.state.newData.length)
		const {dataList, dataCount,currentPage,shouldUpdateActivityRecord} = this.props;
		console.log("dataList开始长度"+dataList.length)
		if(shouldUpdateActivityRecord){
			this.state.newData =dedupe( this.state.newData.concat(dataList));
		}
		console.log("newData后来长度"+this.state.newData.length)
		var timeArray = [];
		this.state.newData.map((item, index) =>
		timeArray.push(item.time.split(" ")[0])
		)
		var newTimeArr = dedupe(timeArray);
		for(var i = 0; i< newTimeArr.length; i++){
			var firstArray = [];
			var time= newTimeArr[i];
			data.push({type:1,des:time});
					
			this.state.newData.map((item, index) =>{
			var c =  item.time.split(" ")[0];
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
		{this.state.showNoData ? <div style = {{display: (this.state.newData.length === 0 ? "" : "none"),color:"#FFFFFF",paddingTop:"200px", textAlign:"center"}}>{Lang.setting.activity.empty}</div>  :""}
		
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
		isFteaching:state.device.isFteaching,
		resultStatus:state.device.resultStatus,
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