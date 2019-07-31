import React from "react";
import {Provider} from "react-redux";
import "./App.css";

import {store} from './store';

import Calendar from "Components/calendar";


function App() {
    return (
        <div className="App">
            <Provider store={store}>
                <Calendar />
            </Provider>
        </div>
    );
}

export default App;
