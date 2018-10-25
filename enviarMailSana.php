<?php


if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}
$data = json_decode(file_get_contents("php://input"));
// Debes editar las próximas dos líneas de código de acuerdo con tus preferencias
// $email_to = "info@sanatorial.com";
$email_from = "info@sanatorial.com.ar";
$email_subject = "Turno asignado";

$email_message = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<body>

<div style="text-align: center; color: rgb(7, 91, 146);">
<p><img src="http://sanatorial.com.ar/assets/img/logo.png"></p>
<p><b>'.$data->afiliado.'</b>, ¡Te hemos enviado un turno!</p>
<p></p>
<p>Has recibido un turno para tu solicitud en <b>'.$data->clinica.'</b> ('.$data->domicilio.') para el día <b>'.$data->fecha.'</b> a las <b>'.$data->hora.'</b>.</p>
<p>Por favor, <a href="https://tconfirmadossanatorial.com">ingresa a nuestra aplicación</a> para confirmar el turno o bien para solicitar uno en otro día/horario.</p>
<a href="https://tconfirmadossanatorial.com"><p style="text-align: center; background-color: orange; color: white; padding: 10px; border:1px solid white; width: 50%; margin-left: 25%;">INGRESAR A LA APLICACIÓN</p></a>
</div>

</body>
</html>';

$email_to = $data->email;


// Ahora se envía el e-mail usando la función mail() de PHP
$headers = 'From: '.$email_from."\r\n";
$headers .= 'Reply-To: '.$email_from."\r\n";
$headers .= 'X-Mailer: PHP/' . phpversion()."\r\n";
$headers .= 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
@mail($email_to, $email_subject, $email_message, $headers);

echo "OKs".$data->email;
?>