"use strict"

import React from "react";
import ReactDOM from "react-dom";
import { Counter, incAction } from "./Counter.js";
import { store } from "./store.js";

function App(){

    return <Counter store={store}/>;
}

const domContainer = document.getElementById('AnchorComponent');
ReactDOM.render(<App />, domContainer);