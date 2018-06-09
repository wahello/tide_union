import React , { Component } from 'react';
import Calendar from 'rc-calendar';
import 'rc-calendar/assets/index.css';
import '../default/canlendae.css';
import { Lang } from '../../public/resource';

const format = 'YYYY-MM-DD';
const now = new Date();
// const timePickerElement = <TimePickerPanel defaultValue={moment('00:00:00', 'HH:mm:ss')} />;
function getFormat(time) {
  // return time ? format : 'YYYY-MM-DD';
  return time = "2018-05-08";
}

// function onStandaloneChange(value) {
//     console.log('onStandaloneChange');
//     console.log(value && value.format(format));
// }

// function onStandaloneSelect(value) {
//     console.log('onStandaloneSelect');
//     console.log(value && value.format(format));
// }

class Rccalendar extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectDate:'',
            // showTime: true,
        }
        this.onStandaloneChange = this.onStandaloneChange.bind(this);
        this.getSelectDate = this.getSelectDate.bind(this);
    }

    onStandaloneChange(value) {
        this.setState({
            selectDate:value.format(format)
        })
        // console.log('当前选中的时间:');
        // console.log(value && value.format(format));
    }

    getSelectDate(){
        // console.log('done时间:');
        console.log(this.state.selectDate)
        return this.state.selectDate
    }

    render (){
        return (
            <div className='camera_calendar' style={{ display  : ( this.props.showDate ? "block" : "none" )}}>
                <Calendar
                    formatter={getFormat(true)}
                    showOk={true}
                    onChange={ this.onStandaloneChange }
                    // timePicker={this.state.showTime ? timePickerElement : null}
                />
                { this.props.onCancle ? <span className="re_cancel" onClick={this.props.onCancle} >{Lang.ipc.calendar.tips[0]}</span> : '' }
                { this.props.onDone ? <span className='re_done' onClick={ this.props.onDone }>{Lang.ipc.calendar.tips[1]}</span> : '' }
            </div>
        )
    }
}
export default Rccalendar