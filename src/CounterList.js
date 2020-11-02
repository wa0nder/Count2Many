import React, {useState, useEffect} from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Counter, {counterReducer, INC_COUNTER, RESET_COUNTER} from "./Counter.js";

//Actions
export const ADD_COUNTER = "ADD_COUNTER";
export const REMOVE_COUNTER = "REMOVE_COUNTER";
export const FETCH_COUNTERS_LIST = "FETCH_COUNTERS_LIST";

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
export function invalidCountersList(error){
    return {
        type: FETCH_COUNTERS_LIST,
        status: "failure",
        payload: error
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

        console.log("id: ", id);
        
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

//Reducer
export const counterListInitialState = {
    needUpdate: true, 
    isFetching: false,
    currentCounterId: undefined,
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
        
        case ADD_COUNTER:

            const id = action.payload;
            const newCounters = { [id] : {id, val: 0} };
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
        case RESET_COUNTER:
            return counterReducer(state, action);
                
        default:
            return state;
    }
}

//React View Component
function CounterList( {list, addCounter, removeCounter, getCounterList } ){

    const [isCreating, setIsCreating] = useState(false);
    const [name, setName] = useState("");

    //put useEffect for initial onMount
    useEffect( () => {
        getCounterList(9);
    }, []);

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

            <ol>
                {
                    Object.keys(list.counters).map( id => {
                        return (
                            <li className="counter_li" key={id}> 
                                <Counter id={id} />
                                <button className="counterBtn__remove" onClick={()=>removeCounter(id)}>X</button>
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
        addCounter: id => dispatch( updateCountersList(id, ADD_COUNTER) ),
        removeCounter: id => dispatch( updateCountersList(id, REMOVE_COUNTER) ),
        getCounterList: num => dispatch( getCountersList(num) )
    }
}

const mapStateToProps = state => {

    return {
        list: state.counterList
    }
}

export default CounterList = connect(mapStateToProps, mapDispatchToProps)(CounterList);