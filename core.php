<?php
$params = json_decode(file_get_contents('php://input'),true);
require("Includes/conexionbd.php");
$seccion = $params['seccion'];
$accion = $params['accion'];
$idn = $params['id'];
$dni = $params['dni'];


    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: *");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
        
    }
     
    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
     
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         
     
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
     
        exit(0);
    }


switch ($seccion){


    case 'login':

        switch($accion){
            
            case 'logear':

                $user = $params['USUARIO'];
                $pass = $params['PASSWORD'];
                $queryListar = mysql_query("SELECT * FROM Usuarios WHERE USUARIO = '$user' AND CONTRASENA = '$pass'");
                if($queryListar){
                    $datos = true;
                } else { $datos = false; }
            
            break;
        }

    break;

    case 'recomendaciones':

        switch ($accion) {

            case 'listar':
                
                $queryListar = mysql_query("SELECT * FROM Recomendaciones");
                while($row = mysql_fetch_array($queryListar)){
                    $datos[] = $row;
                }

            break;

            case 'contactar':

                $queryListar = mysql_query("UPDATE Recomendaciones SET CONTACTADO=1 WHERE ID = '$idn'");
                if($queryListar){
                    $datos = true;
                } else { $datos = false; }

            break;

        }

    break;

    case 'solicitudes':
    
        switch($accion){
        
            case 'listar':
            
            $queryListar = mysql_query("SELECT
                Solicitudes.DNISOLICITANTE,
                Solicitudes.ESTADO,
                Solicitudes.TIPO,
                Solicitudes.IDS,
                Solicitudes.MEDICO,
                Solicitudes.FECHAS,
                Afiliados.DNI,
                Afiliados.NOMBRE AS NombreAfi,
                Afiliados.APELLIDO AS ApellidoAfi,
                Climed.NOMBRE AS NombreCli
            
             FROM (Solicitudes INNER JOIN Afiliados ON Solicitudes.DNISOLICITANTE = Afiliados.DNI) LEFT JOIN Climed ON Solicitudes.IDCLIMED = Climed.IDCLI");
            while($row = mysql_fetch_array($queryListar)){
            $idss = $row['IDS'];
            $datos[$idss] = $row;
            $queryhistorial = mysql_query("SELECT * FROM Turnos WHERE IDSOLICITUD = '$idss'");
            while($row2 = mysql_fetch_array($queryhistorial))
            $datos[$idss]['historial'][] = $row2;
            }
            
            break;

            case 'listarEstudios':

                $queryListar = mysql_query("SELECT * FROM Solicitudes WHERE TIPO = 3 AND REVISADO = 0");
                while($row = mysql_fetch_array($queryListar)){
                    $datos[] = $row;
                }

            break;

            case 'aprobarRevision':

                $queryListar = mysql_query("UPDATE Solicitudes SET REVISADO = 1 WHERE IDS = '$idn'");
                if($queryListar){
                    $datos = true;
                } else { $datos = false; }

            break;

            case 'rechazarRevision':

                $queryListar = mysql_query("UPDATE Solicitudes SET REVISADO = 1, ESTADO = 'Rechazada' WHERE IDS = '$idn'");
                if($queryListar){
                    $datos = true;
                } else { $datos = false; }

            break;

            case 'listarEspecialistas':

                $queryListar = mysql_query("SELECT * FROM Solicitudes WHERE TIPO = 2 AND REVISADO = 0");
                while($row = mysql_fetch_array($queryListar)){
                    $datos[] = $row;
                }

            break;

            case 'rechazarSolicitud':

            $queryListar = mysql_query("UPDATE Solicitudes SET ESTADO='Rechazado', REVISADO=1 WHERE IDS = '$idn'");
            if($queryListar){
                $datos = true;
            } else { $datos = false; }
            break;
            
            case 'listarid':
                        
            $queryListar = mysql_query("SELECT
                Solicitudes.DNISOLICITANTE,
                Solicitudes.ESTADO,
                Solicitudes.TIPO,
                Solicitudes.IDS,
                Solicitudes.MEDICO,
                Solicitudes.FECHAS,
                Afiliados.DNI,
                Afiliados.NOMBRE AS NombreAfi,
                Afiliados.APELLIDO AS ApellidoAfi,
                Climed.NOMBRE AS NombreCli
            
             FROM ((Solicitudes INNER JOIN Afiliados ON Solicitudes.DNISOLICITANTE = Afiliados.DNI) LEFT JOIN Climed ON Solicitudes.IDCLIMED = Climed.IDCLI) WHERE Solicitudes.IDS = '$idn'");
            while($row = mysql_fetch_array($queryListar))
            $datos[] = $row;
                
                
            break;
            
            case 'historial':
            
                $queryListar = mysql_query("SELECT * FROM Turnos WHERE IDSOLICITUD = '$idn'");
                while($row = mysql_fetch_array($queryListar))
                $datos[] = $row;
            
            break;
            
            case 'datosafi':
            
                $queryListar = mysql_query("SELECT * FROM Afiliados WHERE DNI = '$dni'");
                while($row = mysql_fetch_array($queryListar))
                $datos[] = $row;    
                    
            break;
        
        }
        
        
    
    
    break;


    case 'farmacias':

        switch ($accion){

            case 'listar':
                $queryListar = mysql_query("SELECT * FROM Farmacias");
                while($row = mysql_fetch_array($queryListar))
                    $datos[] = $row;

            break;

            case 'insertar':
                $nombre = $_GET['nombre'];
                $direccion = $_GET['direccion'];
                $localidad = $_GET['localidad'];
                $latitude = $_GET['latitud'];
                $longitude = $_GET['longitud'];
                $telefono = $_GET['telefono'];
                $queryListar = mysql_query("INSERT INTO Farmacias (NOMBRE,DIRECCION,LOCALIDAD,latitude,longitude,TELEFONO) VALUES ('".$nombre."','".$direccion."','".$localidad."',".$latitude.",".$longitude.",'".$telefono."')");
                if($queryListar){$datos = 'OK';}else {$datos = 'NO';}

            break;

            case 'eliminar':
                $id = $_GET['id'];
                $queryListar = mysql_query("DELETE FROM Farmacias WHERE ID=$id");
                if($queryListar){$datos = 'OK';}else {$datos = 'NO';}

            break;

            case 'listarid':
                $id = $_GET['id'];
                $queryListar = mysql_query("SELECT * FROM Farmacias WHERE ID = $id");
                while($row = mysql_fetch_array($queryListar))
                    $datos = $row;


            break;

            case 'modificar':
                $id = $_GET['id'];
                $queryListar = mysql_query("UPDATE Farmacias SET NOMBRE = '".$_GET['nombre']."', LOCALIDAD = '".$_GET['localidad']."', DIRECCION = '".$_GET['direccion']."' WHERE ID = $id");
                if($queryListar){$datos = "SI";} else {$datos = "NO";}

            break;
        }

    break;


    case 'afiliados':

        switch ($accion){

            case 'listar':
                $queryListar = mysql_query("SELECT * FROM Afiliados");
                while($row = mysql_fetch_array($queryListar))
                    $datos[] = $row;

            break;






            case 'insertar':
                $nombre = $params['nombre'];
                $apellido = $params['apellido'];
                $nacimiento = $params['nacimiento'];
                $dni = $params['dni'];
                $cuil = $params['cuil'];
                $piso = $params['piso'];
                $dpto = $params['dpto'];
                $direccion = $params['direccion'];
                $telefono = $params['telefono'];
                $celular = $params['celular'];
                $email = $params['email'];
                $queryListar = mysql_query("INSERT INTO Afiliados                                                                       
            (DNI,NOMBRE,APELLIDO,EMAIL,TELEFONO,CELULAR,DIRECCION,PISO,DEPARTAMENTO,NACIMIENTO,CUIL) 
                VALUES ('$dni','$nombre','$apellido','$email','$telefono','$celular','$direccion','$piso','$dpto','$nacimiento','$cuil')");
                if($queryListar){$datos = $nacimiento;}else {$datos = mysql_error();}

            break;

            case 'eliminar':
                $id = $_GET['id'];
                $queryListar = mysql_query("DELETE FROM Afiliados WHERE ID=$id");
                if($queryListar){$datos = 'OK';}else {$datos = 'NO';}

            break;

            case 'listarid':
                $id = $_GET['id'];
                $queryListar = mysql_query("SELECT * FROM Afiliados WHERE ID = $id");
                while($row = mysql_fetch_array($queryListar))
                    $datos = $row;


            break;

            case 'modificar':
                $id = $params['id'];                
                $nombre = $params['nombre'];
                $apellido = $params['apellido'];
                $nacimiento = $params['nacimiento'];
                $dni = $params['dni'];
                $cuil = $params['cuil'];
                $piso = $params['piso'];
                $dpto = $params['dpto'];
                $direccion = $params['direccion'];
                $telefono = $params['telefono'];
                $celular = $params['celular'];
                $email = $params['email'];
                $queryListar = mysql_query("UPDATE Afiliados SET DNI = '$dni', NOMBRE = '$nombre', APELLIDO = '$apellido', EMAIL = '$email', TELEFONO = '$telefono', CELULAR = '$celular', DIRECCION = '$direccion', PISO = '$piso', DEPARTAMENTO = '$dpto', CUIL = '$cuil' WHERE ID = '$id'");
                if($queryListar){$datos = "SI";} else {$datos = mysql_error();}

            break;
        }

    break;




    case 'clinicas':


            switch ($accion){

            case 'listar':
                        $queryCli = mysql_query("

                        SELECT Climed.IDCLI,
        Climed.NOMBRE,
        Climed.DIRECCION,
        Climed.LOCALIDAD,
        Especialidad.IDESPECIALIDAD,
        Especialidad.NOMBRE AS EspeNom
FROM (
        (Climed INNER JOIN ClimedEsp ON Climed.IDCLI = ClimedEsp.IDCLIMED)
        INNER JOIN Especialidad ON ClimedEsp.IDESP = Especialidad.IDESPECIALIDAD)
    WHERE Climed.PARTICULAR = 0

                    ");
                while($rowd = mysql_fetch_array($queryCli)){
                    $datos[] = $rowd;
                }



            break;

            case 'insertar':
                $nombre = $_GET['nombre'];
                $nombre = $_GET['nombre'];
                $direccion = $_GET['direccion'];
                $localidad = $_GET['localidad'];
                $latitud = $_GET['latitud'];
                $longitud= $_GET['longitud'];
                $telefono = $_GET['telefono'];
                $queryListar = mysql_query("INSERT INTO Climed (NOMBRE,DIRECCION,LOCALIDAD,PARTICULAR,latitude,longitude,TELEFONO) VALUES ('".$nombre."','".$direccion."','".$localidad."',0,".$latitud.",".$longitud.",'".$telefono."')");
                $INSERTID = mysql_insert_id();
                $ESPECIALIDAD = $_GET['especialidad'];
                $queryListar2 = mysql_query("INSERT INTO ClimedEsp (IDCLIMED,IDESP) VALUES (".$INSERTID.",".$ESPECIALIDAD.")");
                if($queryListar){$datos = 'OK';}else {$datos = 'NO';}
            break;

            case 'eliminar':
                $id = $_GET['id'];
                $queryListar = mysql_query("DELETE FROM Climed WHERE IDCLI=$id");
                if($queryListar){$datos = 'OK';}else {$datos = 'NO';}

            break;

            case 'listarid':
             $id = $_GET['id'];
                $queryListar = mysql_query("

                        SELECT Climed.IDCLI,
        Climed.NOMBRE,
        Climed.DIRECCION,
        Climed.LOCALIDAD,
        Climed.latitude,
        Climed.longitude,
        Especialidad.IDESPECIALIDAD,
        Especialidad.NOMBRE AS EspeNom
FROM (
        (Climed INNER JOIN ClimedEsp ON Climed.IDCLI = ClimedEsp.IDCLIMED)
        INNER JOIN Especialidad ON ClimedEsp.IDESP = Especialidad.IDESPECIALIDAD)
    WHERE Climed.IDCLI = $id

                    ");
                while($row = mysql_fetch_array($queryListar))
                    $datos = $row;
            break;

            case 'modificar':
                $id = $_GET['id'];
                $queryListar = mysql_query("UPDATE Climed SET NOMBRE = '".$_GET['nombre']."', LOCALIDAD = '".$_GET['localidad']."', DIRECCION = '".$_GET['direccion']."' WHERE IDCLI = $id");
                $queryListar2 = mysql_query("UPDATE ClimedEsp SET IDESP = ".$_GET['especialidad']." WHERE IDCLIMED = $id");
                if($queryListar && $queryListar2){$datos = "SI";} else {$datos = "NO";}

            break;
        }

    break;

        case 'medicos':


            switch ($accion){

            case 'listar':
                $queryCli = mysql_query("

                        SELECT Climed.IDCLI,
        Climed.NOMBRE,
        Climed.DIRECCION,
        Climed.LOCALIDAD,
        Especialidad.IDESPECIALIDAD,
        Especialidad.NOMBRE AS EspeNom
FROM (
        (Climed INNER JOIN ClimedEsp ON Climed.IDCLI = ClimedEsp.IDCLIMED)
        INNER JOIN Especialidad ON ClimedEsp.IDESP = Especialidad.IDESPECIALIDAD)
    WHERE Climed.PARTICULAR = 1

                    ");
                    
                while($rowd = mysql_fetch_array($queryCli)){
                    
                    $datos[] = $rowd;
                    
                }



            break;

            case 'insertar':
                $nombre = $_GET['nombre'];
                $direccion = $_GET['direccion'];
                $localidad = $_GET['localidad'];
                $latitud = $_GET['latitud'];
                $longitud= $_GET['longitud'];
                $telefono = $_GET['telefono'];
                $queryListar = mysql_query("INSERT INTO Climed (NOMBRE,DIRECCION,LOCALIDAD,PARTICULAR,latitude,longitude,TELEFONO) VALUES ('".$nombre."','".$direccion."','".$localidad."',1,".$latitud.",".$longitud.",'".$telefono."')");
                $INSERTID = mysql_insert_id();
                $ESPECIALIDAD = $_GET['especialidad'];
                $queryListar2 = mysql_query("INSERT INTO ClimedEsp (IDCLIMED,IDESP) VALUES (".$INSERTID.",".$ESPECIALIDAD.")");
                if($queryListar){$datos = 'OK';}else {$datos = 'NO';}

            break;

            case 'eliminar':
                $id = $_GET['id'];
                $queryListar = mysql_query("DELETE FROM Climed WHERE IDCLI=$id");
                if($queryListar){$datos = 'OK';}else {$datos = 'NO';}

            break;

            case 'listarid':
                $id = $_GET['id'];
                $queryListar = mysql_query("

                        SELECT Climed.IDCLI,
        Climed.NOMBRE,
        Climed.DIRECCION,
        Climed.LOCALIDAD,
        Climed.latitude,
        Climed.longitude,
        Especialidad.IDESPECIALIDAD,
        Especialidad.NOMBRE AS EspeNom
FROM (
        (Climed INNER JOIN ClimedEsp ON Climed.IDCLI = ClimedEsp.IDCLIMED)
        INNER JOIN Especialidad ON ClimedEsp.IDESP = Especialidad.IDESPECIALIDAD)
    WHERE Climed.IDCLI = $id

                    ");
                while($row = mysql_fetch_array($queryListar))
                    $datos = $row;

            break;

            case 'modificar':
                $id = $_GET['id'];
                $queryListar = mysql_query("UPDATE Climed SET NOMBRE = '".$_GET['nombre']."', LOCALIDAD = '".$_GET['localidad']."', DIRECCION = '".$_GET['direccion']."' WHERE IDCLI = $id");
                $queryListar2 = mysql_query("UPDATE ClimedEsp SET IDESP = ".$_GET['especialidad']." WHERE IDCLIMED = $id");
                if($queryListar && $queryListar2){$datos = "SI";} else {$datos = "NO";}

            break;
        }

    break;

    case 'especialidades':

        switch ($accion){

            case 'listar':
                $queryCli = mysql_query("SELECT * FROM Especialidad");
                while($rowd = mysql_fetch_array($queryCli)){
                    $datos[] = $rowd;
                }

            break;

            case 'insertar':
                $nombre = $_GET['nombre'];
                $estudio = $_GET['estudio'];
                $queryListar = mysql_query("INSERT INTO Especialidad (NOMBRE,ESTUDIO) VALUES ('".$nombre."','".$estudio."')");
                if($queryListar){$datos = 'OK';}else {$datos = 'NO';}

            break;

            case 'eliminar':
                $id = $_GET['id'];
                $queryListar = mysql_query("DELETE FROM Especialidad WHERE IDESPECIALIDAD=$id");
                if($queryListar){$datos = 'OK';}else {$datos = 'NO';}

            break;

            case 'listarid':
                $id = $_GET['id'];
                $queryListar = mysql_query("SELECT * FROM Especialidad WHERE IDESPECIALIDAD = $id");
                while($row = mysql_fetch_array($queryListar))
                    $datos = $row;

            break;

            case 'modificar':
                $id = $_GET['id'];
                $queryListar = mysql_query("UPDATE Especialidad SET NOMBRE = '".$_GET['nombre']."', ESTUDIO = '".$_GET['estudio']."' WHERE IDESPECIALIDAD = $id");
                if($queryListar){$datos = "SI";} else {$datos = "NO";}

            break;
        }

    break;
    
    case 'usuarios':
    
        switch ($accion){

            case 'listar':
                $queryCli = mysql_query("SELECT * FROM Usuarios");
                while($rowd = mysql_fetch_array($queryCli)){
                    $datos[] = $rowd;
                }



            break;

            case 'prueba':

            $queryListar = mysql_query("SELECT * FROM PantallasPadre");
            while($row = mysql_fetch_array($queryListar)){
            $idpadre = $row['ID'];
            $datos[$idpadre] = $row;
            $queryhijos = mysql_query("SELECT * FROM PantallasHijo WHERE IDPADRE = '$idpadre'");
            while($row2 = mysql_fetch_array($queryhijos))
            $datos[$idpadre]['hijos'][] = $row2;
            }

            break;

/*            case 'listarnombre':

            break;*/

            case 'insertar':
                $user = $params['user'];
                $pass = $params['contra'];
                $permiso = $params['perfil'];
                $queryinsertar = mysql_query("INSERT INTO Usuarios (USUARIO,CONTRASENA) VALUES ('".$user."','".$pass."')");
                $INSERTID = mysql_insert_id();
                if($queryinsertar){

                    $queryinsertar2 = mysql_query("INSERT INTO UsuariosPerfiles (IDUSUARIO,IDPERFIL) VALUES ('".$INSERTID."','".$permiso."')");
                    if($queryinsertar2){
                        $datos = 1;
                    } else {
                        $datos = 0;
                    }

                }else {
                    $datos = 0;
                }

            break;

            case 'eliminar':
                
                $queryListar = mysql_query("DELETE FROM Usuarios WHERE ID=".$idn);
                if($queryListar){

                    $queryListar2 = mysql_query("DELETE FROM UsuariosPerfiles WHERE IDUSUARIO=".$idn);
                    if($queryListar2){

                            $datos = 1;
                      
                    } else {

                        $datos = 0;
                    }

                }else {$datos = 0;}

            break;

            case 'listarid':
                $id = $_GET['id'];
                $queryListar = mysql_query("SELECT * FROM Especialidad WHERE IDESPECIALIDAD = $id");
                while($row = mysql_fetch_array($queryListar))
                    $datos = $row;

            break;

            case 'modificar':
                $id = $_GET['id'];
                $queryListar = mysql_query("UPDATE Especialidad SET NOMBRE = '".$_GET['nombre']."', ESTUDIO = '".$_GET['estudio']."' WHERE IDESPECIALIDAD = $id");
                if($queryListar){$datos = "SI";} else {$datos = "NO";}

            break;
        }
    
    break;


    case 'perfiles':
    
        switch ($accion){

            case 'listar':
                $queryCli = mysql_query("SELECT * FROM Perfiles");
                while($rowd = mysql_fetch_array($queryCli)){
                    $datos[] = $rowd;
                }

            break;

            case 'listarnombre':

                $querynombre = mysql_query("SELECT * FROM Perfiles WHERE NOMBRE ='".$params['nombre']."'");
                if($row = mysql_fetch_array($querynombre)){
                    $datos = 1;
                }else { 
                    $datos = 0; 
                }

            break;

            case 'listarpantallas':

            $queryListar = mysql_query("SELECT * FROM PantallasPadre");
            while($row = mysql_fetch_array($queryListar)){
            $idpadre = $row['ID'];
            $datos[$idpadre] = $row;
            $queryhijos = mysql_query("SELECT * FROM PantallasHijo WHERE IDPADRE = '$idpadre'");
            while($row2 = mysql_fetch_array($queryhijos))
            $datos[$idpadre]['hijos'][] = $row2;
            }

            break;

            case 'insertar':

                $datos = 0;
                $queryinsertar = mysql_query("INSERT INTO Perfiles (NOMBRE) VALUES ('".$params['perfil']."')");
                $INSERTID = mysql_insert_id();
                foreach ($params['pantallas'] as $valor) {
                    
                    $querypantalla = mysql_query("INSERT INTO RelacionesPerfiles (IDPERFIL,IDPANTALLAHIJO) VALUES ('".$INSERTID."','".$valor."')");
                    $datos = 1;

                }
                

            break;

            case 'eliminar':
                
                $queryListar = mysql_query("DELETE FROM Perfiles WHERE ID=".$idn);
                if($queryListar){

                    $queryListar2 = mysql_query("DELETE FROM RelacionesPerfiles WHERE IDPERFIL=".$idn);
                    if($queryListar2){

                        $queryListar3 = mysql_query("DELETE FROM UsuariosPerfiles WHERE IDPERFIL=".$idn);
                        if($queryListar3){
                            $datos = 1;
                        } else {
                            $datos = 0;
                        }
                    } else {
                        $datos = 0;
                    }

                }else {$datos = 0;}

            break;

            case 'listarid':
                $id = $_GET['id'];
                $queryListar = mysql_query("SELECT * FROM Especialidad WHERE IDESPECIALIDAD = $id");
                while($row = mysql_fetch_array($queryListar))
                    $datos = $row;

            break;

            case 'modificar':
                $id = $_GET['id'];
                $queryListar = mysql_query("UPDATE Especialidad SET NOMBRE = '".$_GET['nombre']."', ESTUDIO = '".$_GET['estudio']."' WHERE IDESPECIALIDAD = $id");
                if($queryListar){$datos = "SI";} else {$datos = "NO";}

            break;
        }
    
    break;


}
function utf8ize($mixed) {
    if (is_array($mixed)) {
        foreach ($mixed as $key => $value) {
            $mixed[$key] = utf8ize($value);
        }
    } else if (is_string ($mixed)) {
        return utf8_encode($mixed);
    }
    return $mixed;
}
$datos = utf8ize($datos);
echo json_encode($datos);
?>