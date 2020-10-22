'use strict'

import React, {useState, useCallback} from "react";
import PropTypes from "prop-types";

//Actions
export const incAction = {
    type: "counter/increment",
    payload: "+1"
}

//Reducer
export const counterInitialState = {val: 0};

export function counterReducer(state=counterInitialState, action){

    if(action.type === incAction.type){

        let obj = Object.assign({}, state, {val: state.val+1});

        return obj;
    }

    return state;
}

//React Component
export function Counter({ }){

    const store = props.store;

    let [counter, counterInc] = useState(0);
    let [btnState, setBtnState] = useState("Start");

    store.subscribe( () => {
        counterInc(store.getState().counter.val);
    });
    
    return (

        <div className="counter">

            <div className="counter__holder" onClick={props.onClick}>
                {counter}
            </div>

            <button className="counter__controlBtn" onClick={props.ctrlBtnClick}>
                {btnState}
            </button>

            <br/>

            <span className="counter__resetLink" onClick={props.resetLinkClick}>
                reset
            </span>

        </div>
    );

}

Counter.propTypes = {
    onClick: PropTypes.func.isRequired,

}

