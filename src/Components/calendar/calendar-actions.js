import * as axios from "axios";
import {ACTION_TYPES, API} from "./calendar-constants";

const postEvent = event => async dispatch => {
    const response = await axios.post(API, event);
    dispatch({type: ACTION_TYPES.ADD, payload: response.data});
};

const getEvents = () => async dispatch => {
    const resp = await axios.get(API);
    dispatch({type: ACTION_TYPES.GET, payload: resp.data})
};

const deleteEvent = id => dispatch => {
    dispatch({type: ACTION_TYPES.DELETE, payload: id});
    axios.delete(`${API}/${id}`);
};

const updateEvent = (id, event) => dispatch => {
    dispatch({type: ACTION_TYPES.UPDATE, payload: {id, event}});
    axios.put(`${API}/${id}`, event);
};

export const ACTIONS = {
    postEvent,
    getEvents,
    deleteEvent,
    updateEvent,
};