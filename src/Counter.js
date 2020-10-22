'use strict'

import React, {useState, useCallback} from "react";
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
            let obj = Object.assign({}, state, {val: state.val+1});

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

    let [btnVal, setBtnVal] = useState("Start");

    const ctrlBtnStates = {"Stopped": 1, "Started":2 }
    let ctrlBtnState = ctrlBtnStates.Stopped;
    let clearIntervalNum = undefined;

    let onCtrlBtnClick = () => {

        if(ctrlBtnState === ctrlBtnStates.Stopped){

            ctrlBtnState = ctrlBtnStates.Started;
            setBtnVal("Stop");

            clearTimeoutNum = setInterval(()=>{

                ctrlBtnClick(counter+1); //dispatches action to redux store

            }, 1000);
        }
        else if(ctrlBtnState === ctrlBtnStates.Started){

            clearInterval(clearTimeoutNum);
            clearIntervalNum = undefined;

            ctrlBtnState = ctrlBtnStates.Stopped;
            setBtnVal("Start");
        }
    }
    
    return (

        <div className="counter">

            <div className="counter__holder">
                {counter}
            </div>

            <button className="counter__controlBtn" onClick={onCtrlBtnClick}>
                {btnVal}
            </button>

            <br/>

            <span className="counter__resetLink" onClick={resetLinkClick}>
                reset
            </span>

        </div>
    );

}

Counter.propTypes = {
    ctrlBtnClick: PropTypes.func.isRequired,
    resetLinkClick: PropTypes.func.isRequire

}

const mapDispatchToProps = dispatch => {
    return {
        ctrlBtnClick: counter => dispatch( createIncAction(counter) ),
        resetLinkClick: () => dispatch(createResetCounterAction())
    }
}

const mapStateToProps = state => {
    return {
        counter: state.counter.val
    }
}

export default Counter = connect(mapStateToProps, mapDispatchToProps)(Counter);

