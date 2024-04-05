<?php

require_once __DIR__ . '/installDB.php';

error_reporting(E_ALL); // Error/Exception engine, always use E_ALL

ini_set('ignore_repeated_errors', TRUE); // always use TRUE

ini_set('display_errors', FALSE); // Error/Exception display, use FALSE only in production environment or real server. Use TRUE in development environment

ini_set('log_errors', TRUE); // Error/Exception file logging engine.
ini_set('error_log', __DIR__ . '/errors.log'); // Logging file path

// $myfile = fopen("out.txt", "a") or die("Unable to open file!");
// fwrite($myfile, $result . "\n");
// fclose($myfile);

const OK = "ok";
const ERROR = "error";

function sendJSONResponse($status, $response){

    header("Content-Type: application/json; charset=utf-8");
    echo json_encode( array(
        "status" => $status,
        "body" => $response
    ));
}

function userInDB($conn, $owner){

    try{
        $sql = "SELECT 1 FROM Users WHERE username='$owner'";
        $stmt = $conn->query($sql);

        $result = $stmt->rowCount();
        $stmt->closeCursor();

        return $result > 0;
    }
    catch(PDOException $e){
        error_log("in userInDB() > " . $e);
    }
}

function recordInDB($conn, $owner, $id){

    try{
        $id = $owner . ":" . $id;
        $sql = "SELECT 1 FROM Users WHERE id='$id'";
        $stmt = $conn->query($sql);

        $result = $stmt->rowCount();
        $stmt->closeCursor();

        return $result == 1;
    }
    catch(PDOException $e){
        error_log("in recordInDB() > " . $e);
    }
}
function loadDB($conn, $owner, $fetchNum){

    try {

        $stmt = $fetchNum != -1 ? 
            $conn->prepare("SELECT id, val, state FROM Users WHERE username='$owner' LIMIT $fetchNum")
                :
            $conn->prepare("SELECT id, val, state FROM Users WHERE username='$owner'");

        $stmt->execute();
        
        $stmt->setFetchMode(PDO::FETCH_ASSOC);

        $array = $stmt->fetchAll();

        //convert array idx keys into object id keys
        $out = array();
        foreach($array as $idx=>$obj){

            $obj["val"] = (int)$obj["val"];
            $obj["id"] = explode(":", $obj["id"])[1];

            $out[ $obj["id"] ] = $obj;
        }

        return array("status" => OK, "body" => $out );
    }
    catch(PDOException $e) {
        return array("status" => ERROR, "body" => "Unable to retrieve data!");
    }
    
}

function updateDB($conn, $owner, $data){

    try{
        $conn->beginTransaction();

        foreach($data as $id => $counter){

            $val = $counter["val"];
            $state = $counter["state"];
            $id = $owner . ":" . $id;
            $conn->exec("UPDATE Users SET username='$owner', val='$val', state='$state' WHERE id='$id'");
        }

        $conn->commit();

        return array("status" => OK, "body" => "records in DB successfully updated");
    }
    catch(PDOException $e){

        return array("status" => ERROR, "body" => "updateDB() Error with DB! > " . $e);
    }
}

function saveToDB($conn, $owner, $data){

    try{
        $conn->beginTransaction();

        foreach($data as $id => $counter){

            $val = $counter["val"];
            $state = $counter["state"];
            $id = $owner . ":" . $id;
            $conn->exec("INSERT INTO Users (username, id, val, state) VALUES ('$owner', '$id', '$val', '$state')");
        }

        $conn->commit();

        return array("status" => OK, "body" => "new records successfully inserted into DB");
    }
    catch(PDOException $e){

        return array("status" => ERROR, "body" => "saveToDB() Error with DB! > " . $e);
    }
}

function deleteFromDB($conn, $owner, $id){
    try{

        $id = $owner . ":" . $id;

        $conn->exec("DELETE FROM Users WHERE username='$owner' AND id='$id'");

        return array("status" => OK, "body" => "record successfully deleted from DB");
    }
    catch(PDOException $e){

        return array("status" => ERROR, "body" => "Could not delete from DB! > " . $e);
    }
}

function getHighScores($conn){
    $stmt = $conn->prepare("SELECT * FROM HighScores");
    $stmt->execute();
    $array = $stmt->fetchAll();

    return $array;
}

if( $_SERVER["REQUEST_METHOD"] == "GET" ){

    $out;
    $status;
    if( isset($_GET["count"]) ){

        $owner = $_GET["owner"];
        $fetchNum = $_GET["count"];
        
        $get = loadDB($conn, $owner, $fetchNum);

        $status = $get["status"];
        $out = $get["body"];

    }
    else if( isset($_GET["checkOwner"]) ){

        $exists = userInDB( $conn, $_GET["checkOwner"] );

        $status = $exists ? ERROR : OK;
        $out = $exists ? "Username already taken" : "Username is available";
    }
    else if( isset($_GET["highscores"]) ){
        $out = getHighScores($conn);
        $status = OK;
    }
    else{

        $status = ERROR;
        $out = "Resource not available";
    }

    sendJSONResponse($status, $out);
}

else if( $_SERVER["REQUEST_METHOD"] == "POST"){

    $json = file_get_contents('php://input');

    $data = json_decode($json, true);

    if( !isset($data["action"]) ){ return sendJSONResponse(ERROR, "Nothing was done."); }

    $action = $data["action"];

    if( $action == "SAVE_COUNTERS" && isset($data["data"]) ){

        $counterList = $data["data"];

        foreach($counterList as $id => $counter){
            unset( $counter["intervalNum"] );
        }

        $result = updateDB($conn, $data["owner"], $counterList);

        return sendJSONResponse($result["status"], $result["body"]);
    }

    if( isset($data["id"]) ){

        $id = $data["id"];

        if($action == "ADD_COUNTER"){

            if( recordInDB($conn, $data["owner"], $id) ){

                return sendJSONResponse(ERROR, "Counter with that ID already exists.");
            }
        
            $counters = array();
            $counters[$id] = array( "id" => $id, "val" => 0, "state" => "stopped" ); 

            $res = saveToDB($conn, $data["owner"], $counters);

            return sendJSONResponse($res["status"], $res["body"]);

        }    
        else if($action == "REMOVE_COUNTER"){

            $res = deleteFromDB($conn, $data["owner"], $id);

            return sendJSONResponse($res["status"], $res["body"]);
        }
    }

    return sendJSONResponse(OK, "Nothing happened.");

}

//clean up DB connection
$conn = null;