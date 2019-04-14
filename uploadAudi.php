<?php
header('Access-Control-Allow-Origin: *');

$idVenta = $_POST['idVenta'];
$uploadfilename = $_FILES['audio']['tmp_name'];
$uploadfilename2 = $_FILES['audio2']['tmp_name'];
$uploadfilename3 = $_FILES['audio3']['tmp_name'];

$loc1 = 'ventas/auditorias/'.$idVenta.'/'.$idVenta.'.mp3';
$loc2 = 'ventas/auditorias/'.$idVenta.'/'.$idVenta.'2.mp3';
$loc3 = 'ventas/auditorias/'.$idVenta.'/'.$idVenta.'3.mp3';


if(!is_dir('ventas/auditorias/'.$idVenta)) {
    mkdir('ventas/auditorias/'.$idVenta);
}


if($_FILES['audio']['size'] != 0 )
{
	if(move_uploaded_file($uploadfilename, $loc1)){
        echo 'File successfully uploaded!';
	} else {
        echo 'Upload error!';
	}
}


if($_FILES['audio2']['size'] != 0 )
{
	if(move_uploaded_file($uploadfilename2, $loc2)){
        echo 'File successfully uploaded!';
	} else {
        echo 'Upload error!';
	}
}


if($_FILES['audio3']['size'] != 0 )
{
	if(move_uploaded_file($uploadfilename3, $loc3)){
        echo 'File successfully uploaded!';
	} else {
        echo 'Upload error!';
	}
}



?>
