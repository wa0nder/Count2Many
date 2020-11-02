import React from "react";
import Counter from "./Counter.js";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

function CounterPage( {match} ){

    return (
        <React.Fragment>
            <h2><Link to="/play-app/src/main.html">&lt;-- All Counters</Link></h2>
            <br />
            <Counter match={match}/>
        </React.Fragment>
    );
}

const mapStateToProps = state => state;

export default CounterPage = connect(mapStateToProps)(CounterPage);