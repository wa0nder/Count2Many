import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Score } from "./HighScores.types";
import { Store } from "../reduxStore.types";

const update_scores = "UPDATE_SCORES";
function getUpdateScoresAction(scores){
    return {
        type: update_scores,
        payload: scores
    };
}

//reducer
export function updateScoresReducer(state, action){
    switch(action.type){

        case update_scores: {
            return action.payload;
        }
        default:
            return state;
    }
}

async function fetchHighScores(dispatch){
    const data = await fetch(`http://www.myreactlearn.com/realDB.php?highscores`);
    const scores = await data.json();
    dispatch( getUpdateScoresAction(scores.body) );
}

function HighScores(){
    
    const dispatch = useDispatch();
    const scores = useSelector<Store, Array<Score>>(state => state.scores);

    useEffect(() => {
        fetchHighScores(dispatch);
    }, []);

    return (
        <div>
            <h1>🏆 High Score List 🏆</h1>
            <ol className="highscoreList">
                {
                    scores.map(
                        (score) => <li key={score.username}>{`${score.username} ${score.val}`}</li>
                    )
                }
            </ol>
        </div>
    )
}

export default HighScores;