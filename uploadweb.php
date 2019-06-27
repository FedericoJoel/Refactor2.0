<?php 
header('Content-Type: application/json; charset=utf-8');
error_reporting(E_ALL);
ini_set('display_errors', 1);
$response = array();
$upload_dir = 'certifcados/';
if($_FILES['file'])
{
    $file_name = $_POST['nombrefile'];
    $file_tmp_name = $_FILES["file"]["tmp_name"];
    $error = $_FILES["file"]["error"];
    if($error > 0){
        $response = array(
            "status" => "error",
            "error" => true,
            "message" => "Error uploading the file!"
        );
    }else 
    {
    
        if(move_uploaded_file($file_tmp_name ,  '/home/gestiona/public_html/certificados/'.$file_name)) {
            $response = array(
                "status" => "success",
                "error" => false,
                "message" => "File uploaded successfully",
                "url" => "/".$file_name
              );
        }else
        {
            $response = array(
                "status" => "error",
                "error" => true,
                "message" => "Error uploading the file!"
            );
        }
    }
    
}else{
    $response = array(
        "status" => "error",
        "error" => true,
        "message" => "No file was sent!"
    );
}
echo json_encode($response);
?>