import { createStore } from "redux";
import { counterReducer, counterInitialState } from "./Counter.js";

const storeInitialState = {
    counter: counterInitialState
};

function allReducers(state=storeInitialState, action){
    return {
        counter: counterReducer(state.counter, action)
    }
}

export const store = createStore(allReducers);

