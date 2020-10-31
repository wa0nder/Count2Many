import React from "react";
import Counter from "./Counter.js";
import { Link } from "react-router-dom";

export default function CounterPage( {match} ){

    return (
        <React.Fragment>
            <h2><Link to="/play-app/src/main.html">&lt;-- All Counters</Link></h2>
            <br />
            <Counter match={match}/>
        </React.Fragment>
    );
}