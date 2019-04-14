<?php


if (isset($_SERVER['HTTP_ORIGIN'])) {
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}
$data = json_decode(file_get_contents("php://input"));

//recipient
$to = $data->to;

//sender
$from = 'info@cobertec.com.ar';
$fromName = 'Cobertec';

//email subject
$subject = 'Autorización para su turno en '.$data->climed; 

//attachment file path
$file = "../autorizaciones/".$data->file;

//email body content
$htmlContent = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<body>

<div style="text-align: center; color: rgb(7, 91, 146);">
<p><img src="http://cobertec.com.ar/images/header_logo.png"></p>
<p><b>'.$data->afiliado.'</b>, ¡Te acercamos tu autorización!</p>
<p></p>
<p>Ten en cuenta que esta autorización deberás presentarla al prestador el día del turno.</p>
</div>

</body>
</html>';

//header for sender info
$headers = "From: $fromName"." <".$from.">";

//boundary 
$semi_rand = md5(time()); 
$mime_boundary = "==Multipart_Boundary_x{$semi_rand}x"; 

//headers for attachment 
$headers .= "\nMIME-Version: 1.0\n" . "Content-Type: multipart/mixed;\n" . " boundary=\"{$mime_boundary}\""; 

//multipart boundary 
$message = "--{$mime_boundary}\n" . "Content-Type: text/html; charset=\"UTF-8\"\n" .
"Content-Transfer-Encoding: 7bit\n\n" . $htmlContent . "\n\n"; 

//preparing attachment
if(!empty($file) > 0){
    if(is_file($file)){
        $message .= "--{$mime_boundary}\n";
        $fp =    @fopen($file,"rb");
        $data =  @fread($fp,filesize($file));

        @fclose($fp);
        $data = chunk_split(base64_encode($data));
        $message .= "Content-Type: application/octet-stream; name=\"".basename($file)."\"\n" . 
        "Content-Description: ".basename($file)."\n" .
        "Content-Disposition: attachment;\n" . " filename=\"".basename($file)."\"; size=".filesize($file).";\n" . 
        "Content-Transfer-Encoding: base64\n\n" . $data . "\n\n";
    }
}
$message .= "--{$mime_boundary}--";
$returnpath = "-f" . $from;

//send email
$mail = @mail($to, $subject, $message, $headers, $returnpath); 

//email sending status
echo $mail?"<h1>Mail sent.</h1>":"<h1>Mail sending failed.</h1>";























/* 

// Debes editar las próximas dos líneas de código de acuerdo con tus preferencias
// $email_to = "info@cobertec.com";
$email_from = "info@cobertec.com.ar";
$email_subject = "Autorización para su turno en ".$data->climed;

$email_message = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<body>

<div style="text-align: center; color: rgb(7, 91, 146);">
<p><img src="http://cobertec.com.ar/images/header_logo.png"></p>
<p><b>'.$data->afiliado.'</b>, ¡Te acercamos tu autorización!</p>
<p></p>
<p>Ten en cuenta que esta autorización deberás presentarla al prestador el día del turno.</p>
</div>

</body>
</html>';

//$email_to = $data->email;


// Ahora se envía el e-mail usando la función mail() de PHP
$headers = 'From: '.$email_from."\r\n";
$headers .= 'Reply-To: '.$email_from."\r\n"     ;
$headers .= 'X-Mailer: PHP/' . phpversion()."\r\n";
$headers .= 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
@mail("juanpabloaccinelli@gmail.com", $email_subject, $email_message, $headers);

echo "OKs".$data->email;
?> */