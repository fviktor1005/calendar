import React, { useState, useEffect, useCallback } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { addMonths, parse} from 'date-fns';
import Calendar from "./calendar";
import {colors} from "./calendar-constants";
import {ACTIONS} from "./calendar-actions";
import {getEventsByDate} from "./calendar-selectors";
import Agenda from "./agenda";
import {createDays} from "./calendar-functions";

const CalendarWithHooks = () => {

    const [days, setDays] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState(null);

    const events = useSelector(getEventsByDate);

    const dispatch = useDispatch();

    const getEvents = () => dispatch(ACTIONS.getEvents());
    const postEvent = (...args) => dispatch(ACTIONS.postEvent(...args));
    const updateEvent = (...args) => dispatch(ACTIONS.updateEvent(...args));
    const deleteEvent = (...args) => dispatch(ACTIONS.deleteEvent(...args));

    useEffect(() => {
        getEvents();
        const days = createDays(selectedMonth);
        setDays(days);
    }, [selectedMonth]);


    const onLeftClick = () => {
        setSelectedMonth(addMonths(selectedMonth, -1));
    };

    const onRightClick = () => {
        setSelectedMonth(addMonths(selectedMonth, 1));
    };

    const onTimeBlur = (e) => {
        const {id, value, defaultValue} = e.target;
        if (value === defaultValue) {
            setSelectedEvent(null);
            return e.target.blur();
        }

        const newDate = parse(value);
        if (!(newDate instanceof Date && !isNaN(newDate))) {
            e.target.value = e.target.defaultValue;
            return alert('Invalid date')
        }
        updateEvent(id, {date: newDate});
        setSelectedEvent(null);
    };

    const onTextBlur = e => {
        const {id, value, defaultValue } = e.target;
        if (value && value === defaultValue) {
            return e.target.blur();
        }
        if (!value) {
            return deleteEvent(id);
        }
        updateEvent(id, {text: value});
    };

    const onTimeClick = id => () => {
        setSelectedEvent(id);
    };

    const onKeyPress = e => {
        if (e.key !== 'Enter') return;

        const {id, value,  defaultValue} = e.target;

        if (value && value === defaultValue) {
            return e.target.blur();
        }

        if (e.target.name === "value") {
            if (!value) {
                return deleteEvent(id);
            }
            updateEvent(id, {text: value});
        }

        if (e.target.name === 'time') {
            const newDate = parse(value);
            if (!(newDate instanceof Date && !isNaN(newDate))) {
                return alert('Invalid date')
            }
            updateEvent(id, {date: newDate});
        }
        e.target.blur();
    };

    const onChangeColor = (date, color = '', id) => () => {
        const index = colors.findIndex(item => item === color);
        const nextIndex = index > colors.length - 1 ? 0 : index + 1;
        const nextColor = colors[nextIndex];

        updateEvent(id, {color: nextColor});
    };

    const onDeleteClick = (date, id) => () => {
        deleteEvent(id);
    };

    const onEventClick = id => (e) => {
        e.stopPropagation();
        setSelectedEvent(id);
    };

    const onDayClick = useCallback(day => (e) => {
        e.stopPropagation();

        if(!day.currentMonth && day.day > 20) {
            return onLeftClick();
        }
        if(!day.currentMonth) {
            return onRightClick();
        }

        postEvent({date: day.data});
    }, [selectedMonth]);


    return (
        <div className="container">
            <Calendar
                selectedMonth={selectedMonth}
                days={days}
                onDayClick={onDayClick}
                onEventClick={useCallback(onEventClick, [])}
                onLeftClick={useCallback(onLeftClick, [selectedMonth])}
                onRightClick={useCallback(onRightClick, [selectedMonth])}
                events={events}
            />

            <Agenda
                days={days}
                events={events}
                selectedEvent={selectedEvent}
                onDeleteClick={onDeleteClick}
                onChangeColor={onChangeColor}
                onKeyPress={onKeyPress}
                onTimeClick={onTimeClick}
                onTimeBlur={onTimeBlur}
                onTextBlur={onTextBlur}
            />

        </div>
    );
};


export default CalendarWithHooks;
