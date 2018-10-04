<?php


if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}
$data = json_decode(file_get_contents("php://input"));
// Debes editar las próximas dos líneas de código de acuerdo con tus preferencias
// $email_to = "info@cobertec.com";
$email_from = "info@cobertec.com.ar";
$email_subject = "Turno asignado";

$email_message = "Hola, ".$data->afiliado." ¡Has recibido un turno!\n\n
Su turno para ".$data->clinica." (".$data->domicilio.") ha sido propuesto para el ".$data->fecha." a las ".$data->hora."\n\n
Por favor, ingrese a nuestra aplicación y responda a esta solicitud.";
$email_to = $data->email;


// Ahora se envía el e-mail usando la función mail() de PHP
$headers = 'From: '.$email_from."\r\n".
'Reply-To: '.$email_from."\r\n" .
'X-Mailer: PHP/' . phpversion();
@mail($email_to, $email_subject, $email_message, $headers);

echo "OKs".$data->email;
?>
