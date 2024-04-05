import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
//import { counterReducer, counterInitialState } from "./Counter.js";
import { counterListReducer, counterListInitialState } from "./CounterList.js";
import { updateScoresReducer } from "./HighScores.js";

const storeInitialState = {
    scores: {},
    counterList: counterListInitialState
};

function allReducers(state=storeInitialState, action){
    return {
        scores: updateScoresReducer(state.scores, action),
        counterList: counterListReducer(state.counterList, action)
    }
}

export const store = createStore(
    allReducers,
    applyMiddleware(thunkMiddleware)
);

store.subscribe(() => console.log("state: ", store.getState()));

