import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Counter, { counterReducer, INC_COUNTER, RESET_COUNTER, TOGGLE_COUNTER, COUNTER_STATES } from "./Counter.js";

//Actions
export const ADD_COUNTER = "ADD_COUNTER";
export const REMOVE_COUNTER = "REMOVE_COUNTER";
export const FETCH_COUNTERS_LIST = "FETCH_COUNTERS_LIST";
const SAVE_COUNTERS_LIST = "SAVE_COUNTERS_LIST";
const SAVE_COUNTERS = "SAVE_COUNTERS";

export function fetchCountersList(numToFetch){
    return {
        type: FETCH_COUNTERS_LIST,
        status: "request",
        payload: numToFetch
    }
}
export function receiveCountersList(list){
    return {
        type: FETCH_COUNTERS_LIST,
        status: "success",
        payload: list
    }
}
export function invalidCountersList(){
    return {
        type: FETCH_COUNTERS_LIST,
        status: "failure"
    }
}

function saveCountersListStart(list){
    return {
        type: SAVE_COUNTERS_LIST,
        status: "request",
        payload: list
    }
}

function saveCountersListSuccess(){
    return {
        type: SAVE_COUNTERS_LIST,
        status: "success"
    }
}

function saveCountersListFailure(){
    return {
        type: SAVE_COUNTERS_LIST,
        status: "failure"
    }
}

function addNewCounterToList(id){
    return {
        type: ADD_COUNTER,
        payload: id
    }
}

function removeCounterFromList(id){
    return {
        type: REMOVE_COUNTER,
        payload: id
    }
}

export function getCountersList(numToFetch){

    return function(dispatch){

        dispatch( fetchCountersList(numToFetch) );

        return fetch(`http://sidewalks.com/play-app/fakeDB.php?count=${numToFetch}`)

        .then( response => response.json() )

        .then( data => {
            return (data.status === "ok") ? 
                dispatch(receiveCountersList(data.body)) : 
                dispatch(invalidCountersList(data.body))
         });
    }
}

function updateCountersList(id, actionType){

    return function(dispatch){

        switch(actionType){
            case ADD_COUNTER:
                dispatch( addNewCounterToList(id) );
                break;
            case REMOVE_COUNTER:
                dispatch( removeCounterFromList(id) );
                break;
        }
        
        return fetch("http://sidewalks.com/play-app/fakeDB.php", {
            method: 'POST', 
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({"action": actionType, "id":id})
          })
          
        .then( response => response.json() )

        .then( data => console.log("Response: ", data));
    }
}

function saveCounters(list, actionType){
    
    return dispatch => {

        dispatch( saveCountersListStart() );

        fetch("http://sidewalks.com/play-app/fakeDB.php", {
            method: 'POST', 
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({"action": actionType, "data":list.counters})
        })
        
        .then( response => response.json() )

        .then( data => {

            console.log("Response: ", data);

            dispatch( (data.status === "ok") ? saveCountersListSuccess() : saveCountersListFailure() );
        });
    }
}

//Reducer
export const counterListInitialState = {
    needUpdate: true, 
    isFetching: false,
    isSaving: false,
    counters: {}
}

export function counterListReducer(state=counterListInitialState, action){

    switch(action.type){

        case FETCH_COUNTERS_LIST:

            switch(action.status){

                case "request":
                    return Object.assign({}, state, {isFetching:true});
                    
                case "success":
                    return Object.assign({}, state, {
                        needUpdate: false, 
                        isFetching: false, 
                        counters: action.payload
                    });

                case "failure":
                    return Object.assign({}, state, {isFetching:false});
            }

            break;
        
        case SAVE_COUNTERS_LIST:

            switch(action.status){
                
                case "request":
                    return Object.assign({}, state, {isSaving:true});
                case "success":
                case "failure":
                    return Object.assign({}, state, {isSaving:false});
            }

            break;
        
        case ADD_COUNTER:

            const id = action.payload;
            const newCounters = { [id] : {id, val: 0, state: COUNTER_STATES.Stopped} };
            return { 
                    needUpdate: state.needUpdate,
                    isFetching: state.isFetching,
                    counters: Object.keys(state.counters).reduce( (cntrsObj, cntrId) => {

                        cntrsObj[cntrId] = Object.assign({}, state.counters[cntrId]);

                        return cntrsObj;

                    }, newCounters)
                };


        case REMOVE_COUNTER:

            const newState = {needUpdate: state.needUpdate, isFetching: state.isFetching, counters:{}};
            
            Object.keys(state.counters)
                .filter(id => id !== action.payload)
                .reduce( (counters, id) => Object.defineProperty(counters, id, {enumerable:true, value: {id, val:state.counters[id].val}}), newState.counters);
            
            return newState;
        
        case INC_COUNTER:
        case TOGGLE_COUNTER:
        case RESET_COUNTER: {

            const newState = Object.assign({}, state);

            newState.counters = counterReducer(state.counters, action);

            return newState;
        }
         
        default:
            return state;
    }
}

//React View Component
//11 x 6
const saveBtnText = (
    " ________ \n" +
    "|| SAVE ||\n" +
    "||______||\n" +
    "|  ____  |\n" +
    "| |!]  | |\n" +
    " `````````");
//14,15,16,17 - letter indexing
//47,48,49,50 - disk read slider indexing

function createLoadingAnimation(){

    const loadingIconArray = saveBtnText.split("");
    let idx = 47;
    let cnt = 0;
    let dir = 1;
    let saveToggle = true;
    
    return () => {

            (saveToggle) ? loadingIconArray.splice(14,4," ", " ", " ", " ") : loadingIconArray.splice(14,4,"S","A","V","E");
            saveToggle = !saveToggle;

            loadingIconArray[idx] = "#";
            loadingIconArray[idx+1] = " ";

            idx += dir;
            cnt += 1;

            loadingIconArray[idx] = "!";
            loadingIconArray[idx+1] = "]";

            if(cnt === 2){
                dir *= -1;
                cnt = 0;
            }

            return loadingIconArray.join("");
        };
}

function CounterList( {list, dispatch, addCounter, removeCounter, saveCounters, getCounterList } ){

    const [isCreating, setIsCreating] = useState(false);
    const [name, setName] = useState("");

    const intervalNumRef = useRef(undefined);

    //onMount
    useEffect( () => {
        
        if( Object.keys(list.counters).length === 0){ getCounterList(9); }
    }, []);

    const [saveBtnIcon, setBtnIcon] = useState(saveBtnText);
    const interval = useRef(undefined);
    if(list.isSaving === true){

        let getNextFrame = createLoadingAnimation();
        interval.current = setInterval( () => setBtnIcon(getNextFrame()), 250);
    }
    else if(interval.current !== undefined){ 

        setTimeout( () => { 
            clearInterval(interval.current);
            interval.current = undefined;
        }, 3000 );
    }

    const toggleCreateNewCounter = () => {
        setIsCreating(!isCreating);
        setName("");
    }

    const verifyDispatchName = () => {

        if( !(typeof name === "string" && name.length > 0) ){ return; }

        toggleCreateNewCounter();
        addCounter(name);
    }

    const handleInput = ({target:{value}}) => setName(value);
    
    const deleteCounter = id => {

        if(intervalNumRef.current !== undefined){ clearInterval(intervalNumRef.current); }
        
        removeCounter(id);
    }

    return( 
        <React.Fragment>

            <h1>Saved Counters</h1>

            {((!isCreating) ? 
                <button className="counterBtn" onClick={toggleCreateNewCounter}>+</button>
                    :
                <form>
                    <label htmlFor="name">Counter ID: </label>
                    <input type="text" id="name" name="name" value={name} onChange={handleInput}/>
                    <button className="counterBtn" type="button" onClick={verifyDispatchName}>O</button>
                    <button className="counterBtn" onClick={toggleCreateNewCounter}>X</button>
                </form>
            )}

            <button className="counterBtn counterBtn__save" onClick={() => saveCounters(list,SAVE_COUNTERS)}>{saveBtnIcon}</button>

            <ol>
                {
                    Object.keys(list.counters).map( id => {
                        return (
                            <li className="counter_li" key={id}> 
                                <Counter dispatch={dispatch} counterList={list} id={id} exposeProp={(intervalNum) => {
                                    intervalNumRef.current = intervalNum;
                                }}
                                 />
                                <button className="counterBtn counterBtn__remove" onClick={()=>deleteCounter(id)}>X</button>
                            </li>
                        );
                    })
                }
            </ol>

        </React.Fragment>
    );
}

CounterList.propTypes = {
    list: PropTypes.object.isRequired
}

const mapDispatchToProps = dispatch => {

    return {
        dispatch,
        addCounter: id => dispatch( updateCountersList(id, ADD_COUNTER) ),
        removeCounter: id => dispatch( updateCountersList(id, REMOVE_COUNTER) ),
        saveCounters: (list, actionType) => dispatch( saveCounters(list, actionType) ),
        getCounterList: num => dispatch( getCountersList(num) )
    }
}

const mapStateToProps = state => {

    return {
        list: state.counterList
    }
}

export default CounterList = connect(mapStateToProps, mapDispatchToProps)(CounterList);