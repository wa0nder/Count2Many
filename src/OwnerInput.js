'use strict'

import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

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

//React Component
function OwnerInput({ updateOwner }){

    const [owner, setOwner] = useState("");
    const [validName, setValidName] = useState(true);
    //const [checkingName, setCheckingName] = useState(false);

    const handleInput = ({target:{value}}) => {

        setOwner(value);
        setValidName(true);
    }
    
    const submitInput = () => {

        if(owner === undefined || owner.length === 0){ return; }

        if( !/^\w{4,15}$/.test(owner) ){

            return setValidName(false);
        }

        // (function checkUsernameAvailable(){

        //     setCheckingName(true);
            
        //     fetch(`http://sidewalks.com/play-app/realDB.php?owner=${owner}&checkValid=true`)
        
        //     .then( response => response.json() )
    
        //     .then( data => {

        //         setCheckingName(false);

        //         (data.status === "ok") ? updateOwner(owner) : setValidName(false);
        //     })

        //     .catch( err => console.log("checkUsernameAvailable() error: ", err))
            
        // })();

        updateOwner(owner);
    }
    
    return (

        <form>
            <label htmlFor="name">Enter your name: </label>
            <input type="text" id="name" name="name" value={owner} onChange={handleInput}/>
            <button className="counterBtn" type="button" onClick={submitInput}>{"\u2713"}</button>
            { validName ? 
                null
                :
                <span style={{color:"red"}}><br/>*Name must be 5 - 15 characters of only letters and numbers</span>
            }
        </form>
    );

}

OwnerInput.propTypes = {
    updateOnwer: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => {
    return {
        updateOwner: owner => dispatch( createUpdateOwnerAction(owner) )
    }
}

export default OwnerInput = connect(null, mapDispatchToProps)(OwnerInput);

