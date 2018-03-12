<?php
//Conexión a base de datos
$server = "localhost";
$username = "root";
$password = "root";
$database = "Gestionar";
$con = mysql_connect($server, $username, $password) or die ("Error al conectar: " . mysql_error());
mysql_select_db($database, $con);
?>