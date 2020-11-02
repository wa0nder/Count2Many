'use strict'

import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { nanoid } from "nanoid";
import { Link } from "react-router-dom";
import { store } from "./store.js";

export const INC_COUNTER = "INC_COUNTER";
export const RESET_COUNTER = "RESET_COUNTER";

//Actions
function createIncAction(id, val){
    return {
        type: INC_COUNTER,
        payload: {id, val}
    }
}

function createResetCounterAction(id){
    return {
        type: RESET_COUNTER,
        payload: {id}
    }
}

//Reducer
//export const counterInitialState = {id: nanoid(), val: 0};

export function counterReducer(state, action){

    switch(action.type){

        case INC_COUNTER:
            let newstate = Object.assign({}, state);
            newstate.counters[action.payload.id].val += action.payload.val;

            return newstate;
        
        case RESET_COUNTER:
            newstate = Object.assign({}, state);
            newstate.counters[action.payload.id].val = 0;

            return newstate;

        default:
            return state;
    }
}

//React Component
export default function Counter({id, match}){

    const ctrlBtnStates = {"Stopped": 1, "Started":2 };
    const ID = id || match.params.id;
    const dispatch = store.dispatch;
    const counter = store.getState().counterList.counters[ID];

    let [counterState, setCounterState] = useState({
        state: ctrlBtnStates.Stopped,
        btnVal: "Start",
        clearIntervalNum: undefined
    });

    //console.log("counter state: ", counterState);
    
    let onCtrlBtnClick = () => {

        if(counterState.state === ctrlBtnStates.Stopped){

            setCounterState({
                state: ctrlBtnStates.Started,
                btnVal: "Stop",
                clearIntervalNum: setInterval(()=>{
                    dispatch( createIncAction(ID, 1) );
    
                }, 1000)
            });
        }
        else if(counterState.state === ctrlBtnStates.Started){

            clearInterval(counterState.clearIntervalNum);

            setCounterState({
                state: ctrlBtnStates.Stopped,
                btnVal: "Start",
                clearIntervalNum: undefined
            });
        }
    }
    
    return (

        <div className="counter">
            
            <Link to={`/counter/${ID}`}>ID: {ID}</Link>

            <div className="counter__holder">
                {counter.val}
            </div>

            <button className="counter__controlBtn" onClick={onCtrlBtnClick}>
                {counterState.btnVal}
            </button>

            <br/>

            <span className="counter__resetLink" onClick={() => dispatch( createResetCounterAction(ID) )}>
                reset
            </span>

        </div>
    );

}

Counter.propTypes = {
    counter: PropTypes.number.isRequired,
    ctrlBtnClick: PropTypes.func.isRequired,
    resetLinkClick: PropTypes.func.isRequired
}

// const mapDispatchToProps = dispatch => {
//     return {
//         ctrlBtnClick: counter => dispatch( createIncAction(counter) ),
//         resetLinkClick: () => dispatch( createResetCounterAction() )
//     }
// }

// const mapStateToProps = state => {
//     return {
//         counter: state.counter
//     }
// }

// export default Counter = connect(mapStateToProps, mapDispatchToProps)(Counter);

