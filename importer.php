<?php
require("Includes/conexionbd.php");

$consulta = mysql_query("LOAD DATA INFILE 'importar.csv' 
INTO TABLE survey 
FIELDS TERMINATED BY ';' 
ENCLOSED BY '-'
LINES TERMINATED BY '\r\n'
IGNORE 1 LINES;");


?>