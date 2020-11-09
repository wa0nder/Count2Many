<?php

const DB_PATH = __DIR__ . "/timerDB.txt";
const OK = "ok";
const ERROR = "error";

function loadDB(){

    if( ($file = fopen( DB_PATH, "r" )) ){

        $json = fread($file, filesize(DB_PATH));
        return array("status" => OK, "body" => (array)json_decode($json) );
    }

    return array("status" => ERROR, "body" => "Unable to open file!");
}

function saveToDB($data){
    
    if( ($file = fopen( DB_PATH, "w" )) ){

        fwrite($file, json_encode($data));

        fclose($file);

        return array("status" => OK, "body" => "DB successfully updated");
    }

    return array("status" => ERROR, "body" => "Unable to open file!");
}

if( $_SERVER["REQUEST_METHOD"] == "GET" ){

    $out;
    $status;
    if( isset($_GET["count"]) ){

        $fetchNum = $_GET["count"];
        
        $get = loadDB();

        if( $get["status"] == OK ){

            $status = OK;
            $out = array_slice($get["body"], 0, $fetchNum);
        }
        else{
            $status = $get["status"];
            $out = $get["body"];
        }
        
    }
    else{

        $status = ERROR;
        $out = "Resource not available";
    }

    sendJSONResponse($status, $out);
}

else if( $_SERVER["REQUEST_METHOD"] == "POST"){

    $json = file_get_contents('php://input');

    $data = (array)json_decode($json);

    if( !isset($data["action"]) ){ return sendJSONResponse(ERROR, "Nothing was done."); }

    $action = $data["action"];

    if( $action == "SAVE_COUNTERS" && isset($data["data"]) ){
        $counterList = $data["data"];

        foreach($counterList as $id => $counter){
            $counter = (array)$counter;
            unset( $counter["intervalNum"] );
        }

        $result = saveToDB($counterList);

        return sendJSONResponse($result["status"], $result["body"]);
    }

    if( isset($data["id"]) ){

        $id = $data["id"];

        $get = loadDB();

        if( $get["status"] == OK ){

            $counters = $get["body"];

            if($action == "ADD_COUNTER"){ 

                if( isset($counters[$id]) ){

                    return sendJSONResponse(ERROR, "Counter with that ID already exists.");
                }
                    
                $counters[$id] = array( "id" => $id, "val" => 0, "state" => "stopped" ); 
            }
            else if($action == "REMOVE_COUNTER"){ 
                
                $counters = array_filter($counters, function($key) use($id){
                    return $key !== $id;
                },
                ARRAY_FILTER_USE_KEY);
            }

            saveToDB($counters);

            return sendJSONResponse(OK, $counters);
        }
        else{

            return sendJSONResponse($get["status"], $get["body"]);
        }
    }

    return sendJSONResponse(OK, "Nothing happened.");

}

function sendJSONResponse($status, $response){

    header("Content-Type: application/json; charset=utf-8");
    echo json_encode( array(
        "status" => $status,
        "body" => $response
    ));
}