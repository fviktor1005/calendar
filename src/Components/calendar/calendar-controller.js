import React, {Component} from 'react';
import {connect} from 'react-redux';
import {format, addDays, addMonths, parse} from 'date-fns';
import { createStructuredSelector } from 'reselect';
import Calendar from "./calendar";
import { colors } from "./calendar-constants";
import {ACTIONS} from "./calendar-actions";
import {getEventsByDate} from "./calendar-selectors";

class CalendarController extends Component {
    state = {
        selectedDate: null,
        selectedMonth: new Date(),
        selectedEvent: null,
        days: [],
    };

    componentDidMount() {
        this.getDays();
        this.props.getEvents();
    }

    render() {
        return (
            <Calendar
                {...this.props}
                {...this.state}
                events={this.props.events}
                onLeftClick={this.onLeftClick}
                onRightClick={this.onRightClick}
                onDayClick={this.onDayClick}
                onEventClick={this.onEventClick}
                onDeleteClick={this.onDeleteClick}
                onChangeColor={this.onChangeColor}
                onKeyPress={this.onKeyPress}
                onTimeClick={this.onTimeClick}
                onTimeBlur={this.onTimeBlur}
                onTextBlur={this.onTextBlur}
            />
        );
    }

    onTimeBlur = (e) => {
        const {id, value} = e.target;
        const newDate = parse(value);
        if (!(newDate instanceof Date && !isNaN(newDate))) {
            e.target.value = e.target.defaultValue;
            return alert('Invalid date')
        }
        this.props.updateEvent(id, {date: newDate});
        this.setState({selectedEvent: null})
    };

    onTextBlur = e => {
        const {id, value} = e.target;
        this.props.updateEvent(id, {text: value});
    };

    onTimeClick = id => () => {
        this.setState({selectedEvent: id});
    };

    onKeyPress = e => {
        if (e.key !== 'Enter') return;

        const {id, value} = e.target;

        if (e.target.name === "value") {
            this.props.updateEvent(id, {text: value});
        }

        if (e.target.name === 'time') {
            const newDate = parse(value);
            if (!(newDate instanceof Date && !isNaN(newDate))) {
                return alert('Invalid date')
            }
            this.props.updateEvent(id, {date: newDate});
        }
        e.target.blur();
    };

    onChangeColor = (date, color = '', id) => () => {
        const index = colors.findIndex(item => item === color);
        const nextIndex = index > colors.length - 1 ? 0 : index + 1;
        const nextColor = colors[nextIndex];

        this.props.updateEvent(id, {color: nextColor});
    };

    onDeleteClick = (date, id) => () => {
        this.props.deleteEvent(id);
    };

    onEventClick = id => (e) => {
        e.stopPropagation();
        this.setState({selectedEvent: id});

    };

    onDayClick = day => (e) => {
        e.stopPropagation();

        this.props.postEvent({date: day.data});
    };

    onLeftClick = () => {
        this.setState(state => ({selectedMonth: addMonths(state.selectedMonth, -1)}), () => this.getDays());

    };

    onRightClick = () => {
        this.setState(state => ({selectedMonth: addMonths(state.selectedMonth, 1)}), () => this.getDays());
    };

    getDays = () => {
        const {selectedMonth} = this.state;
        const first = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
        let shiftDayOfWeek = format(first, "E") - 1;
        let day = shiftDayOfWeek > 0 ? addDays(first, shiftDayOfWeek * -1) : first;
        const days = Array.from(Array(35)).reduce((acc) => {

            acc.push({
                data: day,
                date: day.toDateString(),
                day: day.getDate(),
                currentMonth: day.getMonth() === selectedMonth.getMonth(),
                dayOfWeek: format(day, 'dddd'),
                month: format(day, 'MMMM'),
                year: format(day, 'YYYY')
            });
            day = addDays(day, 1);
            return acc;
        }, []);
        this.setState({days});
    }
}

const mapStateToProps = createStructuredSelector({
    events: getEventsByDate,
});

const mapDispatchToProps = {
    postEvent: ACTIONS.postEvent,
    getEvents: ACTIONS.getEvents,
    deleteEvent: ACTIONS.deleteEvent,
    updateEvent: ACTIONS.updateEvent,
};

export default connect(
    mapStateToProps, mapDispatchToProps
)(CalendarController);
