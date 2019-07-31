import {createSelector} from "reselect";
import {parse} from "date-fns";

const getEvents = state => state.events;

export const getEventsByDate = createSelector(
    [getEvents],
    (events) => (
        Object.keys(events).reduce((acc, id) => {
            const cur = events[id];
            const date = parse(cur.date).toDateString();
            if (!acc[date]) {
                acc[date] = [];
            }
            const newArr = [...acc[date], {id, ...cur}];
            newArr.sort((a, b) => new Date(a.date) - new Date(b.date));
            acc[date] = newArr;
            return acc;
        }, {})
    )
);