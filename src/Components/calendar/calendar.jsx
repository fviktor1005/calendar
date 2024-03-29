import React from "react";
import {format} from "date-fns";

import "./styles.scss"

const Calendar = ({ days, selectedMonth, onLeftClick, onRightClick, events, onEventClick, onDayClick }) => {

    return (
        <div className="calendar">
            <div className="btn-group">
                <button type="button" onClick={onLeftClick}>&lt;</button>
                <button type="button" onClick={onRightClick}>&gt;</button>
            </div>
            <div className="title">
                <div className="month">
                    {format(selectedMonth, 'MMMM')}
                </div>
                <div className="year">
                    {format(selectedMonth, 'YYYY')}
                </div>
            </div>

            <ol className='days'>
                {
                    Array.from(Array(7)).map((_, index) => (
                        <ul key={index} className="weekday">{(days[index] || {}).dayOfWeek}</ul>
                    ))
                }
            </ol>

            <ol className="days">{days.map(item => (
                <li key={item.date} onClick={onDayClick(item)}
                    className={`day ${item.currentMonth ? '' : 'outside'} ${events[item.date] ? '' : 'empty'}`}>
                    <div className="date">
                        <span className="day">{item.day}</span>
                        <span className="month">{item.month}</span>
                        <span className="year">{item.year}</span>
                    </div>
                    <div className="events">
                        {(events[item.date] || []).map(event => (
                            <div key={event.id} className={`event ${event.color}`} onClick={onEventClick(event.id)}>{event.text}</div>
                        ))}
                    </div>
                </li>
            ))}

            </ol>
        </div>
    )

};

export default Calendar;