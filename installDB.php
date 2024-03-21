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
    //re-throw error so that stack trace begins after credentials line so credentials
    //never have chance to be exposed on accident to an end-user
    throw new PDOException($e->getMessage(), (int)$e->getCode());
}

