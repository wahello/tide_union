import React from 'react';
import './default/style.css';
import './default/ipcplan.css';
import BarTitle from '../component/barTitle';
import Switch from '../component/switch';
import { DatePicker, WhiteSpace} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import { showDialog } from '../action';
import { connect } from 'react-redux';
import IpcPlanAPi from '../jssdk/ipcplan';
import Toast from 'antd-mobile/lib/toast';
import { Lang } from '../public';
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
// GMT is not currently observed in the UK. So use UTC now.
const utcNow = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
// Make sure that in `time` mode, the maxDate and minDate are within one day.
let minDate = new Date(nowTimeStamp - 1e7);
const maxDate = new Date(nowTimeStamp + 1e7);
// console.log(minDate, maxDate);
if (minDate.getDate() !== maxDate.getDate()) {
  // set the minDate to the 0 of maxDate
  minDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
}
var result = [];
function formatDate(date, type) {
  /* eslint no-confusing-arrow: 0 */

  const pad = n => n < 10 ? `0${n}` : n;
  const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  if (type == 1) {
    return `${timeStr}`;
  } else if (type == 2) {
    return `${dateStr}`;
  }
  else {
    return `${dateStr} ${timeStr}`;
  }
}

class Plantimer extends React.Component {
  constructor(props) {
      super(props);

      this.state = {

          date: now,
          time: now,
          dpValue: null,
          customChildValue: null,
          visible: false,
          beginTime: this.setAtTime("00:00"),
          endTime: this.setAtTime("23:59"),
          planId: this.props.location.query.planId||null,
          packageId: this.props.location.query.packageId || null,
          planCycle: this.props.location.query.planCycle || null,
          check: this.props.location.query.planStatus,
          dayRen: weekday,
          _bb:''
      };
      this.handleClick = this.handleClick.bind(this)
      this.handleClickBack = this.handleClickBack.bind(this);
      this.handleClickDone = this.handleClickDone.bind(this);
      this.handleSwitchClick = this.handleSwitchClick.bind(this);
  }
  componentDidMount(){
    this.savePlanStatus();
  }
  handleClick(item,index) {
      console.log(item);
      let oldResult = this.state.dayRen;
      const ele = this.state.dayRen[index];
      ele.selectDay = !ele.selectDay;
    oldResult[index] = ele;
    this.setState({ dayRen: oldResult});
      console.log(item.day)
  }
  handleClickBack(event) {
      this.props.history.goBack();
  }

  handleClickDone(event) {
    Toast.loading(Lang.public.loading);
    let changeDay = []
    this.state.dayRen.map((item,index) => {
      if(item.selectDay == true) {
        changeDay.push(item.day)
      }
    })
    // console.log(changeDay)
    let data = []
    if( changeDay.length > 1){
      changeDay.map((item,index) => {
        data.push({
          planId: this.state.planId,
          packageId: this.state.packageId,
          planCycle: this.state.planCycle,
          executeStartTime: formatDate(this.state.beginTime, 1),
          executeEndTime: formatDate(this.state.endTime, 1),
          planStatus: this.state.check,
          taskDate: item
        })
      })
    }else{
      data.push({
        planId:this.state.planId,
        packageId: this.state.packageId,
        planCycle: this.state.planCycle,
        executeStartTime: formatDate(this.state.beginTime,1),
        executeEndTime: formatDate(this.state.endTime,1),
        planStatus: this.state.check,
        taskDate: changeDay[0]
      })
    }
    IpcPlanAPi.updatePlanTask(data).then(res =>{
      Toast.hide();
      if (res && res.code === 200) {
        Toast.info("计划执行周期已更新",2);
        setTimeout(() =>{
          this.props.history.goBack();
        },2000)
      }else {
        Toast.info(res.desc, 2);
      }
    })
  }
  savePlanStatus() {
    Toast.loading(Lang.public.loading);
    console.log('plan',this.state.planId);
    
    let planId = this.state.planId;
    IpcPlanAPi.getVideoTaskList('planId=' + planId).then(res => {
      Toast.hide();
      let week = [];
      if (res.code == 200) {

        let data_ = res.data;
        let start_ = '00:00';
        let end_ = '23:59';
        let check_ = this.state.check;
        let packgeId_ = this.state.packageId;
        let planCycle_ = this.state.planCycle;
        if (res.data.length > 0) {
          start_ = data_[0].executeStartTime.slice(0, 5);
          end_ = data_[0].executeEndTime.slice(0, 5);
          check_ = data_[0].planStatus;
          packgeId_ = data_[0].packageId;
          planCycle_ = data_[0].planCycle;
          data_.map((item, index) => {
            week.push(item.taskDate)
          })
        }
        
        let _arr = []
        this.state.dayRen.map((item, index) => {
          _arr.push(item)
        })
        var result = [];
        for (var i = 0; i < _arr.length; i++) {
          var a = false;
          for (var j = 0; j < week.length; j++) {
            if (_arr[i].selected == week[j]) {
              a = true;
            }
          }
          if (a) {
            result.push({ selectDay: a, day: _arr[i].selected, num: _arr[i].daynum });
          }
          else {
            result.push({ selectDay: a, day: _arr[i].selected, num: _arr[i].daynum });
          }
        }
        console.log('dayren',result);
        
        this.setState({
          beginTime:this.setAtTime(start_),
          endTime: this.setAtTime(end_),
          check:check_,
          dayRen: result,
          packageId:packgeId_,
          planCycle:planCycle_
        })
        console.log('check11' + this.state.check);
        
      }else {
        Toast.info(res.desc);
      }
      
    })
  }
  setAtTime(queryAt) {
    if (!(queryAt || this.props.autoMationRule)) return false;
    let at = queryAt || this.props.autoMationRule.if.trigger[0].at;
    let now = new Date();
    let timeStr = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate() + " " + at + ":00"
    return new Date(timeStr)
  }
  handleSwitchClick() {
    let che = this.state.check;
    this.setState({
      check:che=='1'?'0':'1'
    })
  }
  render() {
    console.log('check22'+this.state.check);

    return (<div className="customlist">
      <BarTitle title={Lang.ipc.videomanagement.videoTimer} onBack={this.handleClickBack} onDone={this.handleClickDone}/>
        <div className="content">
            <div className="item">
          <span className="hintTxt">{Lang.ipc.videomanagement.VideoTiming}</span>
                <span className="name"><Switch onClick={ this.handleSwitchClick } checked={ this.state.check=='1'?true:false } /></span>
            </div>
        </div>
          {this.state.check=='1' ? <div className="content">
            <div className="planParentweek">
                { this.state.dayRen.map((item, index) =>
                  <div className="itemweek" onClick={() => this.handleClick(item,index)} key={index}>
                      <div className={item.selectDay == true ? "titleweekSelect" : "titleweek"}>{item.num}</div>
                  </div>
                )}
            </div>
            <WhiteSpace size="xl" /><WhiteSpace size="xl" /><WhiteSpace size="xl" /><WhiteSpace size="xl" />
            <WhiteSpace size="xl" />
        <div className="line" >{Lang.ipc.videomanagement.videoTimer}</div>
            <DatePicker
              mode="time"
              title='Time'
              format='HH:mm'
              value={this.state.beginTime}
          onChange={data => this.setState({ beginTime: data })}
              onDismiss={() => this.setState({ visible: false })}
            >
              <div className="item" >
            <span className="hintTxt">{Lang.ipc.videomanagement.startTime}</span><span className="arrow-span"></span>
            <span className="name">{formatDate(this.state.beginTime,1)}</span>
              </div>
            </DatePicker>
            <DatePicker
              mode="time"
              title='Time'
              format='HH:mm'
              value={this.state.endTime}
          onChange={data => this.setState({ endTime: data })}
              onDismiss={() => this.setState({ visible: false })}
            >
              <div className="item" >
                <span className="hintTxt">{Lang.ipc.videomanagement.endTime}</span><span className="arrow-span"></span>
            <span className="name">{formatDate(this.state.endTime,1)}</span>
              </div>
            </DatePicker> 
          </div>:""}
      </div>);
    }
}

//将state绑定到props
const mapStateToProps = (state, props) => {
  console.log(state)
  const plan = props.match.params.plan;
    return {
      plan: plan,
      // myplan: props.match.params.plan,
      // planList:state.ipc.getIpcdata,
      // renderCycle:state.ipc.getIpcCycle
    }
};
//将action的所有方法绑定到props上
const mapDispatchToProps = (dispatch) => {
    return {
        showDialog: (...args) => dispatch(showDialog(...args))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Plantimer)
let weekday = [
    {
        selected: 7, daynum: Lang.ipc.videomanagement.Sunday
    },
    {
      selected: 1, daynum: Lang.ipc.videomanagement.Monday
    },
    {
      selected: 2, daynum: Lang.ipc.videomanagement.Tuesday
    },
    {
      selected: 3, daynum: Lang.ipc.videomanagement.Wednesday
    },
    {
      selected: 4, daynum: Lang.ipc.videomanagement.Thursday
    },
    {
      selected: 5, daynum: Lang.ipc.videomanagement.Friday
    },
    {
      selected: 6, daynum: Lang.ipc.videomanagement.Saturday
  
    },
]