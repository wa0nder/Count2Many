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
    if( isset($_GET["count"]) ){

        $fetchNum = $_GET["count"];
        $status = OK;
        $out = array_slice($counters, 0, $fetchNum);
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

    if( isset($data["id"]) ){

        $id = $data["id"];

        if( isset($counters[$id]) ){
            sendJSONResponse(ERROR, "Counter with that ID already exists.");
        }
        else{
            $counters[$id] = array( "id" => $id, "val" => 0 );
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