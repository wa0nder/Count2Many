"use strict"

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Counter from "./Counter.js";
import { store } from "./store.js";

function App(){

    return <Counter />;
}

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, 
document.getElementById('AnchorComponent'));