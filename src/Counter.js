'use strict'

import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

//Actions
export const incAction = {
    type: "counter/increment",
}

function createIncAction(counterVal){
    return {
        type: "counter/increment",
        payload: counterVal
    }
}

const resetAction = {
    type: "counter/reset"
}
function createResetCounterAction(){
    return resetAction
}

//Reducer
export const counterInitialState = {val: 0};

export function counterReducer(state=counterInitialState, action){

    switch(action.type){

        case incAction.type:
            let obj = Object.assign({}, state, {val: state.val+action.payload});

            return obj;
        
        case resetAction.type:
            obj = Object.assign({}, state, {val:0});

            return obj;

        default:
            return state;
    }
}

//React Component
function Counter({ counter, ctrlBtnClick, resetLinkClick }){

    const ctrlBtnStates = {"Stopped": 1, "Started":2 };
    let [counterState, setCounterState] = useState({
        state: ctrlBtnStates.Stopped,
        btnVal: "Start",
        clearIntervalNum: undefined
    });
    
    let onCtrlBtnClick = () => {

        if(counterState.state === ctrlBtnStates.Stopped){

            setCounterState({
                state: ctrlBtnStates.Started,
                btnVal: "Stop",
                clearIntervalNum: setInterval(()=>{
                    ctrlBtnClick(1); //dispatches action to redux store
    
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

            <div className="counter__holder">
                {counter.val}
            </div>

            <button className="counter__controlBtn" onClick={onCtrlBtnClick}>
                {counterState.btnVal}
            </button>

            <br/>

            <span className="counter__resetLink" onClick={resetLinkClick}>
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

const mapDispatchToProps = dispatch => {
    return {
        ctrlBtnClick: counter => dispatch( createIncAction(counter) ),
        resetLinkClick: () => dispatch( createResetCounterAction() )
    }
}

const mapStateToProps = state => {
    return {
        counter: state.counter
    }
}

export default Counter = connect(mapStateToProps, mapDispatchToProps)(Counter);

