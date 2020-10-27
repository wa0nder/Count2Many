import { createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import { counterReducer, counterInitialState } from "./Counter.js";
import { counterListReducer, counterListInitialState } from "./CounterList.js";

const storeInitialState = {
    counter: counterInitialState,
    counterList: counterListInitialState
};

function allReducers(state=storeInitialState, action){
    return {
        counter: counterReducer(state.counter, action),
        counterList: counterListReducer(state.counterList, action)
    }
}

export const store = createStore(
    allReducers,
    applyMiddleware(thunkMiddleware)
);

