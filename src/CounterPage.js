import React from "react";
import Counter from "./Counter.js";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

function CounterPage( {dispatch, match, counterList} ){

    return (
        <React.Fragment>
            <h2><Link to="/src/main.html">&lt;-- All Counters</Link></h2>
            <br />
            <Counter dispatch={dispatch} counterList={counterList} match={match}/>
        </React.Fragment>
    );
}

const mapDispatchToProps = dispatch => ({dispatch});
const mapStateToProps = state => ({ counterList: state.counterList });

export default CounterPage = connect(mapStateToProps, mapDispatchToProps)(CounterPage);