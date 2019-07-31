import {createStore, compose, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import mainReducer from "./reducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
    mainReducer,
    composeEnhancers(applyMiddleware(thunk))
);

