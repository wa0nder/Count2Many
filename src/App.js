"use strict"

import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import Counter from "./Counter.js";
import { store } from "./store.js";

function App({ store }){

    return <Provider store={store}>
        <Router>
            <Route path="/" component={Counter} />
        </Router>
    </Provider>
}

App.propTypes = {
    store: PropTypes.object.isRequired
}

ReactDOM.render(<App store={store}/>, document.getElementById('AnchorComponent'));