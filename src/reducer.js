import {ACTION_TYPES} from "Components/calendar/calendar-constants";

const initialState = {
    selectedDate: null,
    selectedMonth: new Date(),
    selectedEvent: null,
    days: [],
    events: {},
};

const rootReducer = (state = initialState, action) => {
    const { payload } = action;
    switch (action.type) {
        case ACTION_TYPES.ADD:
            return {...state, events: {...state.events, [payload.id]: {...payload.data}}};
        case ACTION_TYPES.GET:
            const events = payload.reduce((acc, cur) => {
                acc[cur.id] = {...cur.data};
                return acc
            }, {});
            return {...state, events};
        case ACTION_TYPES.DELETE:
            const newEvents = {...state.events};
            delete newEvents[payload];
            return {...state, events: newEvents};
        case ACTION_TYPES.UPDATE:
            return {...state, events: {...state.events, [payload.id]: {...state.events[payload.id], ...payload.event }}};
        default:
            return state;
    }
};

export default rootReducer;