import React,{ Component } from 'react';
import Calendar from 'react-calendar-mobile';

class selectDate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date1: '',
            date2: '',
            month: '',
            week: ''
        };
    };

    onSelect1(value) {
        this.setState({
          date1: value
        });
    }

    onChange1(value) {
        this.setState({
          month: value
        })
    }

    onSelect2(value) {
        this.setState({
          date2: value
        })
    }

    onChange2(value) {
        this.setState({
          week: value
        })
    }

    formatDate(date) {
        if (typeof date === 'object') {
          return `${date.getFullYear()}-${`0${(date.getMonth() + 1)}`.slice(-2)}-${`0${(date.getDate())}`.slice(-2)}`;
        }
    }

    setDecorate() {
        const today = new Date();
        // const threeDays = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3);
        // const sixDays = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6);
        return {
          [this.formatDate(today)]: true,
        //   [this.formatDate(threeDays)]: true,
        //   [this.formatDate(sixDays)]: {},
        }
    }


    render (){
        return (
             <div className="row">
                <Calendar weekFormat="short" 
                    decorate={ this.setDecorate() } 
                    onSelectDate={ (v) => this.onSelect1(v) } 
                    onChange={ (v) => this.onChange1(v) }
                    yearFormat="numeric"
                ></Calendar>
                <div className="calendar__value">
                    <span className="title">选中的日期: </span>
                    <span className="value">{ this.formatDate(this.state.date1) }</span>
                </div>
                <span className="calendar_cancel">Cancel</span> <span className="calendar_done">Done</span>
            </div>
        )
    }
}
export default selectDate