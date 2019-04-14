<?php

 
$location = $_POST['directory'];
//$uploadfile = $_POST['fileName'];
$uploadfilename = $_FILES['file']['tmp_name'];
$uploadfile = $_FILES['file']['name'];
 
if(move_uploaded_file($uploadfilename, 'certificados/'.$uploadfile)){
        echo 'File successfully uploaded!';
} else {
        echo 'Upload error!';
}
?>