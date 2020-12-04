<?php

// if( $file = fopen("sample.txt",r) ){
    
//     while( !feof($file) ){
//         echo fgets($file, filesize("sample.txt")) . "<br>";
//     }
    
//     fclose($file);
// }

$servername = "localhost";
$username = "root";
$password = "root";
$db = "myDBPDO";
$conn = null;

try{

    $conn = new PDO("mysql:host=$servername", $username, $password);

    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "CREATE DATABASE IF NOT EXISTS $db";
    $conn->exec($sql);

    $sql = "USE $db";
    $conn->query($sql);
    //$sql = $conn->prepare("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'myDBPDO'");

    //$sql = "DROP TABLE Users";
    //$conn->query($sql);
    
    $sql = "CREATE TABLE IF NOT EXISTS Users (
        username VARCHAR(30),
        id VARCHAR(10) NOT NULL PRIMARY KEY,
        val int NOT NULL,
        state VARCHAR(10),
        reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )";
    
    $conn->exec($sql);

    // $sql = "CREATE TABLE IF NOT EXISTS Counters (
    //     ID VARCHAR(10),
    //     val int NOT NULL,
    //     state VARCHAR(10),
    //     PRIMARY KEY (ID),
    //     FOREIGN KEY (username) REFERENCES Users(username)
    // )";

    // $conn->exec($sql);
    
    //filter user input
    //check if username already exists
    //if so return error message
    //otherwise, insert the data
    // $user = $_SERVER["GET"]
    // $json = 
    // $sql = "INSERT INTO Users (username, id, val, state)
    //     VALUES ('default', 'one', '5', 'stopped')";
    
    // $conn->exec($sql);

    //$result = $sql->setFetchMode(PDO::FETCH_ASSOC);
    //echo ($result == true) ? "DB already exists" : "DB doesn't exist";
    
    //echo "Connected successfully<br>";
    //echo "Database created successfully<br>";
    //echo "Table 'Users' created successfully<br>";
    //echo "New Record successfully added";

    //$conn = null;
} 
catch(PDOException $e) {
    exit( $sql . "<br>" . $e->getMessage() );
}


