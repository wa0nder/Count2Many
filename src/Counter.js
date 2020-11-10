'use strict'

import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { nanoid } from "nanoid";

export const INC_COUNTER = "INC_COUNTER";
export const RESET_COUNTER = "RESET_COUNTER";
export const TOGGLE_COUNTER = "TOGGLE_COUNTER";
export const COUNTER_STATES = {Stopped:"stopped", Started:"started"};

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

function createToggleCounterAction(id, state, intervalNum){
    return {
        type: TOGGLE_COUNTER,
        payload: {id, state, intervalNum}
    }
}

//Reducer

//counter state structure -> { id, val, state };

export function counterReducer(state, action){

    const id = action.payload.id;

    switch(action.type){

        case TOGGLE_COUNTER: {

            const newState = Object.assign({}, state);

            Object.keys(newState).forEach( key => {

                newState[key] = Object.assign({}, state[key]);

                if(key === id){ 
                    newState[key].state = action.payload.state;
                    newState[key].intervalNum = action.payload.intervalNum;
                }
            });

            return newState;
        }

        case INC_COUNTER: {

            const newState = Object.assign({}, state);

            Object.keys(newState).forEach( key => {

                newState[key] = Object.assign({}, state[key]);

                if(key === id){ newState[key].val += action.payload.val; }
            });

            return newState;
        }
        
        case RESET_COUNTER: {

            const newState = Object.assign({}, state);
            
            Object.keys(newState).forEach( key => {

                newState[key] = Object.assign({}, state[key]);

                if(key === id){ newState[key].val = 0; }
            });

            return newState;
        }
        
        default:
            return state;
    }
}

//React Component
export default function Counter({ id, match, counterList, dispatch, exposeProp }){

    const ID = id || match.params.id;
    const counter = counterList.counters[ID];
    const btnVal = (counter.state === COUNTER_STATES.Stopped) ? "Start" : "Stop";
    
    let onCtrlBtnClick = () => {

        if(counter.state === COUNTER_STATES.Stopped){

            const intervalNum = setInterval(()=>{
                dispatch( createIncAction(ID, 1) );

            }, 1000);

            if(exposeProp){ exposeProp(intervalNum); }

            dispatch( createToggleCounterAction(ID, COUNTER_STATES.Started, intervalNum) );
        }
        else if(counter.state === COUNTER_STATES.Started){

            clearInterval(counter.intervalNum);

            dispatch( createToggleCounterAction(ID, COUNTER_STATES.Stopped, undefined) );
        }
    }
    
    return (

        <div className="counter">
            
            <Link to={`/counter/${ID}`}>ID: {ID}</Link>

            <div className="counter__holder">
                {counter.val}
            </div>

            <button className="counter__controlBtn" onClick={onCtrlBtnClick}>
                {btnVal}
            </button>

            <br/>

            <span className="counter__resetLink" onClick={() => dispatch( createResetCounterAction(ID) )}>
                reset
            </span>

        </div>
    );

}

Counter.propTypes = {
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

