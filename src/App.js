"use strict";

import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import PageHolder from "./PageHolder.js";
import CounterPage from "./CounterPage.js";
import CounterList from "./CounterList.js";
import { store } from "./store.js";

function App({ store }){

    return <Provider store={store}>
        <Router>
            <Route path="/">
                <PageHolder />
            </Route>
            <Route exact path="/src/main.html">
                <CounterList />
            </Route>
            <Route exact path="/counter/:id" component={CounterPage} />
        </Router>
    </Provider>
}

App.propTypes = {
    store: PropTypes.object.isRequired
}

ReactDOM.render(<App store={store}/>, document.getElementById('AnchorComponent'));