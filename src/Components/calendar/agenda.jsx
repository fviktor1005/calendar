import React from "react";
import {format, parse} from "date-fns";

import {colors} from "./calendar-constants";

const Agenda = ({ events, selectedEvent, days, onChangeColor, onTimeBlur, onDeleteClick, onTimeClick, onKeyPress }) => (
    <div className="agenda">
        <ol className="days">{days.map(item => (
            <li key={item.date} className={`day ${item.currentMonth ? '' : 'outside'} ${events[item.date] && events[item.date].length ? '' : 'empty'}`}>
                <div className="date">
                    <span className="day">{item.day}</span>
                    <span className="month">{item.month}</span>
                    <span className="year">{item.year}</span>
                </div>
                <div className="events">
                    {(events[item.date] || []).map(event => (
                        <div key={event.id} className={`event ${event.color}`}>
                            {selectedEvent === event.id
                                ? <input name="time" autoFocus onBlur={onTimeBlur} className="event" defaultValue={(parse(event.date)).toLocaleString()} onKeyPress={onKeyPress} id={event.id} />
                                : <div className="time" onClick={onTimeClick(event.id)}>{format(event.date, "HH:mm")}</div>}
                            <input name="value" maxLength={30} autoFocus className={`event ${event.color}`} type="text" defaultValue={event.text} onKeyPress={onKeyPress} id={event.id} />
                            <button onClick={onChangeColor(item.date, event.color, event.id)}
                                    className={`change-color ${colors[event.color ? colors.findIndex(color => color === event.color) +1 : 1]}`} />
                            <button onClick={onDeleteClick(item.date, event.id)} className="delete">x
                            </button>
                        </div>
                    ))}
                </div>
            </li>
        ))}
        </ol>

    </div>
);

export default Agenda;