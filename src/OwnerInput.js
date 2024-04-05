'use strict'

import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";

export const UPDATE_OWNER = "UPDATE_OWNER";

//Actions
function createUpdateOwnerAction(owner){

    return {
        type: UPDATE_OWNER,
        payload: owner
    }
}

//Reducer
export function ownerInputReducer(state, action){

    switch(action.type){

        case UPDATE_OWNER: {
            return action.payload;
        }
        
        default:
            return state;
    }
}


function checkUsernameAvailable(setCheckingName, finish, owner){

    return function checkNameAvailableThunk(dispatch, getState){
        setCheckingName(true);
        
        fetch(`http://www.myreactlearn.com/realDB.php?checkOwner=${owner}`)

        .then( response => response.json() )

        .then( data => {
            const valid = (data.status === "ok") ? true : false;
            console.log(data);
            finish(valid);
            if(valid){ dispatch( createUpdateOwnerAction(owner) ); }
        })

        .catch( err => console.error("checkUsernameAvailable() error: ", err))
    }
}

//React Component
function OwnerInput(){

    const [owner, setOwner] = useState("");
    const [validName, setValidName] = useState(true);
    const [availName, setAvailName] = useState(true);
    const [checkingName, setCheckingName] = useState(false);
    const dispatch = useDispatch();

    const finish = (state) => {
        setCheckingName(false);
        setAvailName(state);
    }

    const handleInput = ({target:{value}}) => {
        setOwner(value);
        setValidName(true);
    }
    
    const submitInput = () => {

        if(owner === undefined || owner.length === 0 || checkingName){ 
            return; 
        }

        if( !/^\w{4,15}$/.test(owner) ){

            return setValidName(false);
        }

        dispatch( checkUsernameAvailable(setCheckingName, finish, owner) );
    }
    
    return (
        <>
            { validName ? 
                null
                :
                <span style={{color:"red"}}><br/>*Name must be 5 - 15 characters of only letters and numbers</span>
            }
            { availName ? 
                null
                :
                <span style={{color:"red"}}><br/>*Sorry, that name is already taken.</span>
            }
            <form className="nameEntry">
                <label className="nameEntry_item" htmlFor="name">Enter your name: </label>
                <input className="nameEntry_item" type="text" id="name" name="name" value={owner} onChange={handleInput}/>
                <button className="nameEntry_item counterBtn" type="button" onClick={submitInput}>{"\u2713"}</button>
            </form>
        </>
    );

}

// OwnerInput.propTypes = {
//     updateOnwer: PropTypes.func.isRequired
// }

// const mapDispatchToProps = dispatch => {
//     return {
//         updateOwner: owner => dispatch( createUpdateOwnerAction(owner) )
//     }
// }

export default OwnerInput;// = connect(null, mapDispatchToProps)(OwnerInput);

