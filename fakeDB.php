<?php

static $counters = array(
    "first" => array("id" => "first", "val" => 0),
    "second" => array("id" => "second", "val" => 0),
    "third" => array("id" => "third", "val" => 0)
);

const OK = "ok";
const ERROR = "error";

if( $_SERVER["REQUEST_METHOD"] == "GET" ){

    $out;
    $status;
    switch( $_GET["query"] ){
        
        case "counterlist":
            
            $status = OK;
            $out = $counters;
            break;

        default:
            $status = ERROR;
            $out = "Resource not available";
    }

    sendJSONResponse($status, $out);
}

else if( $_SERVER["REQUEST_METHOD"] == "POST"){

    if( isset($_POST["id"], $_POST["val"]) ){

        $id = $_POST["id"];
        $val = $_POST["val"];

        if( isset($counters[$id]) ){
            sendJSONResponse(ERROR, "Counter with that ID already exists.");
        }
        else{
            $counters[$id] = array(  $id => $val );
            sendJSONResponse(OK, $counters);
        }
    }

}

function sendJSONResponse($status, $response){

    header("Content-Type: application/json; charset=utf-8");
    echo json_encode( array(
        "status" => $status,
        "body" => $response
    ));
}