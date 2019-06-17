<?php

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}
$dataR = json_decode(file_get_contents("php://input"));
$var = $dataR->idnotif;

function sendPushNotification($to = '', $data = array(), $var){
	$apiKey = 'AIzaSyCXJAuGhrcmO4gZZg1Lrrk9rP82AdZgJa0';
	$fields = array('to' => $var, 'notification' => $data);

	$headers = array('Authorization: key='.$apiKey, 'Content-Type: application/json');

	$url = 'https://fcm.googleapis.com/fcm/send';

	$ch = curl_init();
	curl_setopt( $ch, CURLOPT_URL, $url);
	curl_setopt( $ch, CURLOPT_POST, true);
	curl_setopt( $ch, CURLOPT_HTTPHEADER, $headers);
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true);

	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
	$result = curl_exec($ch);
	curl_close($ch);
	return json_decode($result, true);
}

$data = array(
	'body' => "¡Ha recibido un Turno!"
);

print_r(sendPushNotification($to, $data, $var));
echo $var;