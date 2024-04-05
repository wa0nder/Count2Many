<?php

require_once __DIR__ . '/connectionInfo.php';

// if( $file = fopen("sample.txt",r) ){
    
//     while( !feof($file) ){
//         echo fgets($file, filesize("sample.txt")) . "<br>";
//     }
    
//     fclose($file);
// }


$conn = null;

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false
];

try{

    $conn = new PDO("mysql:host=$servername;charset=$charset", $username, $password, $options);
} 
catch(PDOException $e) {
    //re-throw error so that stack trace begins after credentials line so credentials
        //never have chance to be exposed on accident to an end-user
    throw new PDOException($e->getMessage(), (int)$e->getCode());
}



try{

    $conn->exec("CREATE DATABASE IF NOT EXISTS $db");
    $conn->exec("USE $db");
    
    $sql = "CREATE TABLE IF NOT EXISTS Users (
        username VARCHAR(30),
        id VARCHAR(10) NOT NULL PRIMARY KEY,
        val int NOT NULL,
        state VARCHAR(10),
        reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )";
    
    $conn->exec($sql);

    $sql = "CREATE TABLE IF NOT EXISTS HighScores (
        username VARCHAR(30),
        id VARCHAR(10) NOT NULL PRIMARY KEY,
        val int NOT NULL,
        state VARCHAR(10),
        reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )";
    
    $conn->exec($sql);
}
catch(PDOException $e) {
    //re-throw error so that stack trace begins after credentials line so credentials
    //never have chance to be exposed on accident to an end-user
    throw new PDOException($e->getMessage(), (int)$e->getCode());
}

