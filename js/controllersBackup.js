angular.module('GestionarApp.controllers', ['GestionarApp.services', 'ngMaterial', 'ngAnimate'])


  .controller('usuariosCrt', function($scope, $http, $mdDialog, UserSrv, $filter) {


    $scope.ListarPerfiles = function() {
      $http.post(UserSrv.GetPath(), {
          'seccion': 'perfiles',
          'accion': 'listar',
          'id': '',
          'dni': ''
        })

        .success(function(response) {
          $scope.perfiles = response;
        })

    }

    $scope.ListarPerfiles();

    $scope.ComprobarUsername = function() {
      $('#comprobuser').html('<i class="fa fa-spinner fa-spin fa-fw"></i> Validando nombre..');
      $http.post(UserSrv.GetPath(), {
          'seccion': 'usuarios',
          'accion': 'listarnombre'
        })

        .success(function(response) {
          $scope.ComprobUser = response;
          $('#comprobuser').html('<font color="green"><i class="fa fa-check fa-fw"></i> El nombre se encuentra disponible</font>');
          console.log(response);
        })
    }

    $scope.BuscarUsuario = function() {
      $http.post(UserSrv.GetPath(), {
          'seccion': 'usuarios',
          'accion': 'listar',
          'id': '',
          'dni': ''
        })

        .success(function(response) {
          $scope.Usuarios = response;
          console.log(response);
        })
    }

    $scope.AltaUser = function() {

      if ($scope.usernew != '' && $scope.perfilnew != '' && $scope.contranew != '') {
        $http.post(UserSrv.GetPath(), {
            'seccion': 'usuarios',
            'accion': 'insertar',
            'user': $scope.usernew,
            'contra': $scope.contranew,
            'perfil': $scope.perfilnew.ID,
            'id': '',
            'dni': ''
          })

          .success(function(response) {
            if (response == 1) {
              //TODO BIEN
              UserSrv.alerta('¡PERFECTO!', 'Se dió de alta el usuario.');
            } else {
              //TODO MAL
              UserSrv.alerta('¡UPS!', 'Algo salió mal.');
            }
            console.log(response);
            $scope.BuscarUsuario();
          })
      } else {
        alert("Complete todos los campos");
      }


    }

    $scope.EliminarUsuario = function(id) {

      $http.post(UserSrv.GetPath(), {
          'seccion': 'usuarios',
          'accion': 'eliminar',
          'id': id,
          'dni': ''
        })

        .success(function(response) {
          if (response == 1) {

            //Muestro mensaje OK
            UserSrv.alerta('¡PERFECTO!', 'Se eliminó el perfil.');

          } else {
            //Muestro mensaje Error
            UserSrv.alerta('UPS!', 'Parece ser que algo salió mal.');
          }
          $scope.BuscarUsuario();
        })

    }

    $scope.BuscarUsuario();
  })


  .controller('permisosCrt', function($scope, $http, $mdDialog, UserSrv, $filter) {

  

    $scope.Juan = function() {
      alert('pedro');
    }

    /*        $scope.CorroborarLogin = function () {
                if($cookies.userlogin == undefined){
                    alert('Cookies no definidar');
                }
            }*/
  })


  .controller('pantallasCrt', function($scope, $http, $mdDialog, UserSrv, $filter) {

    $scope.seleccionados = [];
    $scope.checkhijo = [];
    $scope.checkpadre = [];

    $scope.ListarPerfiles = function() {
      $http.post(UserSrv.GetPath(), {
          'seccion': 'perfiles',
          'accion': 'listar',
          'id': '',
          'dni': ''
        })

        .success(function(response) {
          $scope.Perfiles = response;
        })

    }

    $scope.ComprobarPerfil = function() {
      $('#comprobperfil').html('<i class="fa fa-spinner fa-spin fa-fw"></i> Validando nombre..');
      $http.post(UserSrv.GetPath(), {
          'seccion': 'perfiles',
          'accion': 'listarnombre',
          'nombre': $scope.perfilnew
        })

        .success(function(response) {
          console.log(response);
          if (response == 1) {
            $('#comprobperfil').html('<font color="red"><i class="fa fa-check fa-fw"></i> El perfil <b>' + $scope.perfilnew + '</b> ya existe.</font>');
            $scope.btnCrearPerfil = {
              isDisabled: true
            };
          } else {
            $('#comprobperfil').html('<font color="green"><i class="fa fa-check fa-fw"></i> El nombre se encuentra disponible</font>');
            $scope.btnCrearPerfil = {
              isDisabled: false
            };
          }

        })
    }
    $scope.BuscarPantallas = function() {
      $http.post(UserSrv.GetPath(), {
          'seccion': 'perfiles',
          'accion': 'listarpantallas',
          'id': '',
          'dni': ''
        })

        .success(function(response) {
          $scope.pantallas = response;
          console.log($scope.pantallas);
        })

    }

    $scope.CrearPerfil = function() {
      $http.post(UserSrv.GetPath(), {
          'seccion': 'perfiles',
          'accion': 'insertar',
          'perfil': $scope.perfilnew,
          'pantallas': $scope.seleccionados,
          'id': '',
          'dni': ''
        })

        .success(function(response) {
          if (response == 1) {
            $scope.perfilnew = '';
            //Desmarco todos
            $scope.seleccionados.forEach(function(element) {
              $scope.checkhijo[element] = false;
            });
            $('#comprobperfil').html('');
            $scope.seleciconados = '';
            alert('OK');
            $scope.BuscarPantallas();
            $scope.ListarPerfiles();
          } else {
            alert('Error');
          }

        })

    }

    $scope.EliminarPerfil = function(id) {

      $http.post(UserSrv.GetPath(), {
          'seccion': 'perfiles',
          'accion': 'eliminar',
          'id': id,
          'dni': ''
        })

        .success(function(response) {
          if (response == 1) {

            //Muestro mensaje OK
            UserSrv.alerta('¡PERFECTO!', 'Se eliminó el perfil.');

          } else {
            //Muestro mensaje Error
            UserSrv.alerta('UPS!', 'Parece ser que algo salió mal.');
          }
          $scope.ListarPerfiles();
        })

    }

    $scope.MarcarPadre = function(id, esto) {

      //COMPRUEBO SI ESTABA SELECCIONADO ANTES
      if ($scope.checkpadre[id] == true) {
        //MARCO HIJOS
        esto.forEach(function(element) {
          $scope.checkhijo[element.ID] = true;

          var i = 0;
          var existencia = false;

          for (i = 0; i <= $scope.seleccionados.length; i++) {
            if ($scope.seleccionados[i] == element.ID) {
              //Existe, lo dejo.
              existencia = true;
            }
          }

          if (existencia != true) {
            //No existe, lo agrego.
            $scope.seleccionados.push(element.ID);
          }

        });

      } else {
        //DESMARCO HIJOS
        esto.forEach(function(element) {
          $scope.checkhijo[element.ID] = false;
          var i = 0;
          for (i = 0; i <= $scope.seleccionados.length; i++) {
            if ($scope.seleccionados[i] == element.ID) {
              //Existe, lo borro.
              $scope.seleccionados.splice(i, 1);
            }
          }
        });
      }

      console.log($scope.seleccionados);

    }

    $scope.MarcarHijo = function(idpadre, esto) {

      //COMPRUEBO SI EL PADRE ESTABA CHEQUEADO
      if ($scope.checkpadre[idpadre] == true) {
        //LO DESMARCO
        $scope.checkpadre[idpadre] = false;
      }
      //COMPRUEBO SI ESTABA SELECCIONADO ANTES
      var i = 0;
      var existencia = false;
      for (i = 0; i <= $scope.seleccionados.length; i++) {
        if ($scope.seleccionados[i] == esto) {
          //Existe, lo borro.
          existencia = true;
          $scope.seleccionados.splice(i, 1);
        }
      }

      if (existencia != true) {
        //Lo agrego
        $scope.seleccionados.push(esto);
      }

      console.log($scope.seleccionados);
    }

    $scope.BuscarPantallas();
    $scope.ListarPerfiles();
  })


  .controller('solicitudesCrt', function($scope, $http, $mdDialog, UserSrv, $filter) {

    $scope.ActualPage = 1;
    $scope.idmediselected = {'id':undefined, 'nombre':undefined}
    $scope.cantidadpaginas = [];
    $scope.Cargando = "Cargando...";
    $scope.tipos = ['Todos', 'Clínico', 'Especialista', 'Estudio'];
    $scope.estados = ['Todos', 'Pendiente', 'Abierto', 'Rechazado', 'En Espera'];
    $scope.numeritos = ['10', '15', '20', '25', '50'];
    $scope.filtrotipo = $scope.tipos[0];
    $scope.filtroestado = $scope.estados[0];
    $scope.filtronumeritos = $scope.numeritos[0];
    /*$http.post(UserSrv.GetPath(), {
        'seccion': 'solicitudes',
        'accion': 'listar',
        'id': '',
        'dni': ''
      })*/

      $scope.selectorear = function(x){
        $scope.se = [];
        $scope.se[x.id] = true;
        $scope.idmediselected.id = x.id;
        $scope.idmediselected.nombre = x.nombre;
      }

      $http.get('api/public/solicitud/traerElementos')

      .success(function(response) {

        $scope.solicitudes = $scope.maping(response);
        $scope.paginar();
        $scope.Cargando = "";
        console.log(response);
      })

      $http.get('api/public/climed/traerElementos')

      .success(function(response) {

        $scope.Medicos = response;
        console.log(response);
        $scope.espes = $scope.getEspes(response);
        
      })

    $scope.ChangePage = function(pag) {

      $scope.ActualPage = pag;
      $scope.paginar();

    }

    $scope.getEspes = function(source){
      var espes = [];
      for(i = 0; i <= source.length-1; i++){
        espes.push(source[i].especilidades[0].nombre);
      }
      espes = espes.filter(function(value, index){ return espes.indexOf(value) == index });
      console.log(espes);
      return espes;
    }

    $scope.maping = function(source){
      var tamaño = source.length;
      var array = [];
      for(i = 0; i < tamaño; i++){
        if(source[i].tipo == 1 || source[i].revisado == 1){
          //source[i].splice(i-1, 1);
          
          //tamaño = tamaño - 1;
          array.push(source[i]);
          
        }
      } 
    return array;
    }

    $scope.EnviarTurno = function() {
      $scope.fechaturno = moment($scope.fechaturno).format('YYYY-MM-DD');
      $scope.horaturno = moment($scope.horaturno).format('hh:mm:ss');
      $scope.enviandoturno = true;
      $http.post('api/public/turno', {
          'IDSOLICITUD': $scope.solicitudexpandida.id,
          'MEDICOASIGNADO': $scope.idmediselected.id,
          'FECHAT': $scope.fechaturno,
          'HORAT': $scope.horaturno,
          'CONFIRMACION': 0
        })

        .success(function(response) {
          $scope.enviandoturno = false;
          $scope.consultasolicitud($scope.solicitudexpandida.id);
        })

    }

    $scope.consultasolicitud = function(id) {
      $http.get('api/public/solicitud/'+id)

        .success(function(response) {
          $scope.solicitudexpandida = response;
          $scope.validarConfirmacion($scope.solicitudexpandida);
        })
    }

    $scope.paginar = function() {
      var i = 0;
      $scope.cantidadpaginas = [];
      for (i = 0; i < (Object.keys($scope.solicitudes).length / $scope.filtronumeritos); i++) {
        $scope.cantidadpaginas[i] = i + 1;
      }
    }

    $scope.validarConfirmacion = function(solicitud){
      $scope.turnoc = undefined;
      for (i = 0; i < solicitud.turnos.length; i++) {
        $scope.turnoc = solicitud.turnos[i].confirmacion;
      }
      

    }
    $scope.Detallar = function(solicitud) {
      $scope.solicitudexpandida = solicitud;
      $scope.datoexpandida = solicitud;
      $scope.idexpandida = solicitud.id;
      $scope.validarConfirmacion(solicitud);

    }

    $scope.CerrarDetalle = function() {

      $scope.idexpandida = undefined;

    }


  })



  .controller('auditoriaCrt', function($scope, $http, $mdDialog, UserSrv, $filter) {

    $scope.ActualPage = 1;
    $scope.cantidadpaginas = [];
    $scope.Cargando = "Cargando...";
    $scope.tipos = ['Todos', 'Clínico', 'Especialista', 'Estudio'];
    $scope.estados = ['Todos', 'Pendiente', 'Abierto', 'Rechazado', 'En Espera'];
    $scope.numeritos = ['10', '15', '20', '25', '50'];
    $scope.filtrotipo = $scope.tipos[0];
    $scope.filtroestado = $scope.estados[0];
    $scope.filtronumeritos = $scope.numeritos[0];
    /*$http.post(UserSrv.GetPath(), {
        'seccion': 'solicitudes',
        'accion': 'listar',
        'id': '',
        'dni': ''
      })*/

    $scope.ChangePage = function(pag) {

      $scope.ActualPage = pag;
      $scope.paginar();
    }

    $http.get('api/public/solicitud/traerElementos')

      .success(function(response) {

        $scope.solicitudes = $scope.maping(response);
        $scope.paginar();
        $scope.Cargando = "";
        console.log(response);
      })

    $scope.maping = function(source){
      var tamaño = source.length;
      var array = [];
      for(i = 0; i < tamaño; i++){
        if(source[i].tipo == 2 || source[i].tipo == 3){
          //source[i].splice(i-1, 1);
          
          //tamaño = tamaño - 1;
          array.push(source[i]);
          
        }
      } 
    return array;
    }

    $scope.Detallar = function(id) {
      $("#tr"+id).slideToggle();

    }

    $scope.paginar = function() {
      var i = 0;
      $scope.cantidadpaginas = [];
      for (i = 0; i < (Object.keys($scope.solicitudes).length / $scope.filtronumeritos); i++) {
        $scope.cantidadpaginas[i] = i + 1;
      }
    }

  })




  .filter('startFrom', function() {
    return function(input, start) {
      if (input) {
        start = +start; // parse to int
        return input.slice(start);
      }
      return [];
    }
  })


  .filter('myLimitTo', [function() {
    return function(obj, limit) {
      var keys = Object.keys(obj);
      if (keys.length < 1) {
        return [];
      }

      var ret = new Object,
        count = 0;
      angular.forEach(keys, function(key, arrayIndex) {
        if (count >= limit) {
          return false;
        }
        ret[key] = obj[key];
        count++;
      });
      return ret;
    };
  }])


  .controller('afiliadosCrt', function($scope, $http, $mdDialog, UserSrv) {

    $scope.alerta = function(tipo) {
      if (tipo = 'OK') {
        $mdDialog.show(
          $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('¡PERFECTO!')
          .textContent('Todo salió bien')
          .ariaLabel('Left to right demo')
          .ok('Aceptar')
          // You can specify either sting with query selector
          .openFrom('#left')
          // or an element
          .closeTo(angular.element(document.querySelector('#right')))
        );
      } else {
        $mdDialog.show(
          $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('¡UPS!')
          .textContent('Algo salió mal')
          .ariaLabel('Left to right demo')
          .ok('Aceptar')
          // You can specify either sting with query selector
          .openFrom('#left')
          // or an element
          .closeTo(angular.element(document.querySelector('#right')))
        );

      }
    };

    $http.get('api/public/obraSocial/traerElementos')

      .success(function(response) {

        $scope.obrasSociales = response;
        $scope.Cargando = "";
        console.log(response);
      })

    $scope.ListarMedicos = function() {
      $scope.Cargando = "Cargando...";
      $http.get('api/public/afiliado/traerElementos')

        .success(function(response) {
          $scope.afiliados = response;
          $scope.Cargando = "";
          console.log(response);
        })

    }
    $scope.AltaMedico = function() {


      
      var nacimiento = $scope.nacimientoalta;
      nacimiento = moment(nacimiento).format('YYYY-MM-DD');
      var dni = $scope.dnialta;
      var cuil = $scope.cuilalta;
      var direccion = $scope.direccionalta;
      var piso = $scope.pisoalta;
      var dpto = $scope.dptoalta;
      var telefono = $scope.telefonoalta;
      var celular = $scope.celularalta;
      var email = $scope.emailalta;

      $scope.Cargando = "Cargando...";
      $http.post('api/public/afiliado', {
          'NACIMIENTO': nacimiento,
          'NOMBRE': $scope.nombrealta,
          'APELLIDO': $scope.apellidoalta,
          'DIRECCION': $scope.direccionalta,
          'CUIL': $scope.cuilalta,
          'EMAIL': $scope.emailalta,
          'DNI': $scope.dnialta,
          'PISO': $scope.pisoalta,
          'DEPARTAMENTO': $scope.dptoalta,
          'TELEFONO': $scope.telefonoalta,
          'CELULAR': $scope.celularalta,
          'IDOBRASOCIAL': $scope.obrasocialalta,
          'NAFILIADO': $scope.nafiliadoalta,
          'OBS': null,
          'GRUPOF': null
        })

        .success(function(response) {
          $scope.Cargando = "";
          console.log(response);
          $scope.alerta(response);
          $scope.nombrealta = undefined;
          $scope.apellidoalta = undefined;
          $scope.nacimientoalta = undefined;
          $scope.dnialta = undefined;
          $scope.cuilalta = undefined;
          $scope.direccionalta = undefined;
          $scope.pisoalta = undefined;
          $scope.dptoalta = undefined;
          $scope.telefonoalta = undefined;
          $scope.celularalta = undefined;
          $scope.emailalta = undefined;
          $scope.nafiliadoalta = undefined;
          $scope.obrasocialalta = undefined;
        })

    }

    $scope.Eliminar = function(id, nombre) {
      $scope.Cargando = "Cargando...";
      if (confirm('¿Esta seguro que desea eliminar al afiliado?')) {
        $http.delete('api/public/afiliado/'+id)
          .success(function(response) {
            $scope.Cargando = "";
            $scope.ListarMedicos();
          })
      } else {
        $scope.Cargando = "";
      }


    }


    $scope.LlenarModal = function(id) {

      $scope.Cargando = "Cargando...";
      $http.get('api/public/afiliado/'+id)

        .success(function(response) {
          $scope.Cargando = "";
          console.log(response);
          $scope.idafi = id;
          $scope.nombremodi = response.nombre;
          $scope.apellidomodi = response.apellido;
          $scope.nacimientomodi = response.nacimiento;
          $scope.nacimientomodi = new Date($scope.nacimientomodi);
          $scope.dnimodi = parseInt(response.dni);
          $scope.cuilmodi = response.cuil;
          $scope.direccionmodi = response.direccion;
          $scope.pisomodi = response.piso;
          $scope.dptomodi = response.departamento;
          $scope.telefonomodi = parseInt(response.telefono);
          $scope.celularmodi = parseInt(response.celular);
          $scope.emailmodi = response.email;
          $scope.nafiliadomodi = response.nafiliado;
          $scope.obrasocialmodi = response.obra_social.id;
        })

    }

    $scope.Guardar = function(id) {
      $scope.Cargando = "Cargando...";
      var nacimiento = $scope.nacimientomodi;
      nacimiento = moment(nacimiento).format('YYYY-MM-DD');
      $http.put('api/public/afiliado/'+id, {
          'NACIMIENTO': nacimiento,
          'NOMBRE': $scope.nombremodi,
          'APELLIDO': $scope.apellidomodi,
          'DIRECCION': $scope.direccionmodi,
          'CUIL': $scope.cuilmodi,
          'EMAIL': $scope.emailmodi,
          'DNI': $scope.dnimodi,
          'PISO': $scope.pisomodi,
          'DEPARTAMENTO': $scope.dptomodi,
          'TELEFONO': $scope.telefonomodi,
          'CELULAR': $scope.celularmodi,
          'NAFILIADO': $scope.nafiliadomodi,
          'IDOBRASOCIAL': $scope.obrasocialmodi,
          'OBS': null,
          'GRUPOF': null
        })
        .success(function(response) {
          $scope.Cargando = "";
          console.log(response);
          $scope.ListarMedicos();
        })
    }




  })



  ////////////////////////////////////
  //█▀▀ █    ▀ █▀▀▄  ▀ █▀▀ █▀▀█ █▀▀
  //█   █    █ █  █  █ █   █▄▄█ ▀▀█
  //▀▀▀ ▀▀▀  ▀ ▀  ▀  ▀ ▀▀▀ ▀  ▀ ▀▀▀
  ////////////////////////////////////
  .controller('clinicasCrt', function($scope, UserSrv, $http, $mdDialog) {

    $scope.lat = '';
    $scope.lng = '';
    $scope.primeraosegunda = 1;


    $scope.alerta = function(tipo) {
      if (tipo = 'OK') {
        $mdDialog.show(
          $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('¡PERFECTO!')
          .textContent('Todo salió bien')
          .ariaLabel('Left to right demo')
          .ok('Aceptar')
          // You can specify either sting with query selector
          .openFrom('#left')
          // or an element
          .closeTo(angular.element(document.querySelector('#right')))
        );
      } else {
        $mdDialog.show(
          $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('¡UPS!')
          .textContent('Algo salió mal')
          .ariaLabel('Left to right demo')
          .ok('Aceptar')
          // You can specify either sting with query selector
          .openFrom('#left')
          // or an element
          .closeTo(angular.element(document.querySelector('#right')))
        );

      }
    };

    $scope.ListarMedicos = function() {
      $scope.Cargando = "Cargando...";
      $http.post(UserSrv.GetPath() + "?seccion=clinicas&accion=listar", {
          'seccion': 'clinicas',
          'accion': 'listar',
          'id': '',
          'dni': ''
        })

        .success(function(response) {
          $scope.medicos = response;
          $scope.Cargando = "";
          console.log(response);
        })

    }
    $scope.AltaMedico = function() {


      var nombre = $scope.nombrealta;
      var direccion = $scope.direccionalta;
      var localidad = $scope.localidadalta;
      var especialidad = $scope.especialidadalta;
      var latitudalta = $scope.lat;
      var longitudalta = $scope.lng;
      var telefonoalta = $scope.telefonoalta;

      $scope.Cargando = "Cargando...";
      $http.post(UserSrv.GetPath() + "?seccion=clinicas&accion=insertar&nombre=" + nombre + "&especialidad=" + especialidad + "&direccion=" + direccion + "&localidad=" + localidad + "&latitud=" + latitudalta + "&longitud=" + longitudalta + "&telefono=" + telefonoalta, {
          'seccion': 'clinicas',
          'accion': 'insertar',
          'id': '',
          'dni': ''
        })

        .success(function(response) {
          $scope.Cargando = "";
          $scope.alerta(response);
          $scope.nombrealta = '';
          $scope.direccionalta = '';
          $scope.localidadalta = '';
          $scope.especialidadalta = '';
          $scope.lat = '';
          $scope.lng = '';
          document.getElementById('altamapa').style.display = 'none';
          $scope.primeraosegunda = 2;
        })

    }

    $scope.Eliminar = function(id, nombre) {
      $scope.Cargando = "Cargando...";
      if (confirm('¿Esta seguro que desea eliminar el médico ' + nombre + "?")) {
        $http.post(UserSrv.GetPath() + "?seccion=clinicas&accion=eliminar&id=" + id, {
            'seccion': 'clinicas',
            'accion': 'eliminar'
          })
          .success(function(response) {
            $scope.Cargando = "";
            $scope.ListarMedicos();
          })
      } else {
        $scope.Cargando = "";
      }


    }

    $scope.GetEspecialidades = function() {

      $http.post(UserSrv.GetPath() + "?seccion=especialidades&accion=listar", {
          'seccion': 'especialidades',
          'accion': 'listar'
        })
        .success(function(response) {
          //$scope.Especialidades = response;
          $scope.Especialidades = response;
        });
    }



    $scope.GetEspecialidades();

    $scope.LlenarModal = function(id) {

      $scope.Cargando = "Cargando...";
      $http.post(UserSrv.GetPath() + "?seccion=clinicas&accion=listarid&id=" + id, {
          'seccion': 'clinicas',
          'accion': 'listarid'
        })

        .success(function(response) {
          $scope.Cargando = "";
          console.log(response);
          $scope.ID = response.IDCLI;
          $scope.direccion = response.DIRECCION;
          $scope.nombre = response.NOMBRE;
          $scope.localidad = response.LOCALIDAD;
          $scope.latitude = response.latitude;
          $scope.longitude = response.longitude;
          $scope.GetEspecialidades();
          $scope.especialidad = response.IDESPECIALIDAD;
        })

    }

    $scope.Guardar = function(id) {
      $scope.Cargando = "Cargando...";
      $http.post(UserSrv.GetPath() + "?seccion=clinicas&accion=modificar&id=" + $scope.ID + "&nombre=" + $scope.nombre + "&localidad=" + $scope.localidad + "&especialidad=" + $scope.especialidad + "&direccion=" + $scope.direccion.split(' ').join('%20'), {
          'seccion': 'clinicas',
          'accion': 'modificar'
        })
        .success(function(response) {
          $scope.Cargando = "";
          $scope.ListarMedicos();
        })
    }


  })



  ////////////////////////////////////
  //█▀▄▀█ █▀▀ █▀▀▄  ▀  █▀▀ █▀▀█ █▀▀
  //█─▀─█ █▀▀ █──█  █  █   █  █ ▀▀█
  //▀   ▀ ▀▀▀ ▀▀▀─  ▀  ▀▀▀ ▀▀▀▀ ▀▀▀
  ////////////////////////////////////
  .controller('medicosCrt', function($scope, UserSrv, $http, $timeout, $mdDialog) {

    $scope.lat = '';
    $scope.lng = '';
    $scope.primeraosegunda = 1;

    $scope.alerta = function(tipo) {
      if (tipo = 'OK') {
        $mdDialog.show(
          $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('¡PERFECTO!')
          .textContent('Todo salió bien')
          .ariaLabel('Left to right demo')
          .ok('Aceptar')
          // You can specify either sting with query selector
          .openFrom('#left')
          // or an element
          .closeTo(angular.element(document.querySelector('#right')))
        );
      } else {
        $mdDialog.show(
          $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('¡UPS!')
          .textContent('Algo salió mal')
          .ariaLabel('Left to right demo')
          .ok('Aceptar')
          // You can specify either sting with query selector
          .openFrom('#left')
          // or an element
          .closeTo(angular.element(document.querySelector('#right')))
        );

      }
    };

    $http.get('api/public/obraSocial/traerElementos')

      .success(function(response) {

        $scope.obrasSociales = response;
        $scope.Cargando = "";
        console.log(response);
      })

    $scope.ListarMedicos = function() {
      $scope.Cargando = 'Cargando..';
      $http.get('api/public/climed/traerElementos')

        .success(function(response) {
          $scope.medicos = response;
          $scope.Cargando = "";
          console.log(response);
        })

    }

    $scope.AltaMedico = function() {


      var nombre = $scope.nombrealta;
      var direccion = $scope.direccionalta;
      var localidad = $scope.localidadalta;
      var especialidad = $scope.especialidadalta;
      var latitudalta = $scope.lat;
      var longitudalta = $scope.lng;
      var telefonoalta = $scope.telefonoalta;

      $scope.Cargando = "Cargando...";
      $http.post(UserSrv.GetPath() + "?seccion=medicos&accion=insertar&nombre=" + nombre + "&especialidad=" + especialidad + "&direccion=" + direccion + "&localidad=" + localidad + "&latitud=" + latitudalta + "&longitud=" + longitudalta + "&telefono=" + telefonoalta, {
          'seccion': 'medicos',
          'accion': 'insertar'
        })

        .success(function(response) {
          $scope.Cargando = "";
          $scope.alerta(response);
          $scope.nombrealta = '';
          $scope.direccionalta = '';
          $scope.localidadalta = '';
          $scope.especialidadalta = '';
          $scope.lat = '';
          $scope.lng = '';
          document.getElementById('altamapa').style.display = 'none';
          $scope.primeraosegunda = 2;
        })

    }

    $scope.Eliminar = function(id, nombre) {
      $scope.Cargando = "Cargando...";
      if (confirm('¿Esta seguro que desea eliminar el médico ' + nombre + "?")) {
        $http.post(UserSrv.GetPath() + "?seccion=medicos&accion=eliminar&id=" + id, {
            'seccion': 'medicos',
            'accion': 'eliminar'
          })
          .success(function(response) {
            $scope.Cargando = "";
            $scope.ListarMedicos();
          })
      } else {
        $scope.Cargando = "";
      }


    }

    $scope.GetEspecialidades = function() {

      $http.get('api/public/especialidad/traerElementos')
        .success(function(response) {
          //$scope.Especialidades = response;
          $scope.Especialidades = response;
        });
    }



    $scope.GetEspecialidades();

    $scope.LlenarModal = function(id) {

      $scope.Cargando = "Cargando...";
      $http.post(UserSrv.GetPath() + "?seccion=medicos&accion=listarid&id=" + id, {
          'seccion': 'medicos',
          'accion': 'listarid'
        })

        .success(function(response) {
          $scope.Cargando = "";
          console.log(response);
          $scope.ID = response.IDCLI;
          $scope.direccion = response.DIRECCION;
          $scope.nombre = response.NOMBRE;
          $scope.localidad = response.LOCALIDAD;
          $scope.latitude = response.latitude;
          $scope.longitude = response.longitude;
          $scope.GetEspecialidades();
          $scope.especialidad = response.IDESPECIALIDAD;
        })

    }

    $scope.Guardar = function(id) {
      $scope.Cargando = "Cargando...";
      $http.post(UserSrv.GetPath() + "?seccion=medicos&accion=modificar&id=" + $scope.ID + "&nombre=" + $scope.nombre + "&localidad=" + $scope.localidad + "&especialidad=" + $scope.especialidad + "&direccion=" + $scope.direccion.split(' ').join('%20'), {
          'seccion': 'medicos',
          'accion': 'modificar'
        })
        .success(function(response) {
          $scope.Cargando = "";
          $scope.ListarMedicos();
        })
    }
  })



  ////////////////////////////////
  //█▀▀ █▀▀█ █▀▀█ █▀▄▀█ █▀▀█ █▀▀  ▀  █▀▀█ █▀▀
  //█▀▀ █▄▄█ █▄▄▀ █ ▀ █ █▄▄█ █    █  █▄▄█ ▀▀█
  //▀   ▀  ▀ ▀  ▀ ▀   ▀ ▀  ▀ ▀▀▀  ▀  ▀  ▀ ▀▀▀
  ////////////////////////////////
  .controller('farmaciasCrt', function($scope, UserSrv, $http, $mdDialog) {


    $scope.lat = '';
    $scope.lng = '';
    $scope.primeraosegunda = 1;

    $scope.alerta = function(tipo) {
      if (tipo = 'OK') {
        $mdDialog.show(
          $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('¡PERFECTO!')
          .textContent('Todo salió bien')
          .ariaLabel('Left to right demo')
          .ok('Aceptar')
          // You can specify either sting with query selector
          .openFrom('#left')
          // or an element
          .closeTo(angular.element(document.querySelector('#right')))
        );
      } else {
        $mdDialog.show(
          $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('¡UPS!')
          .textContent('Algo salió mal')
          .ariaLabel('Left to right demo')
          .ok('Aceptar')
          // You can specify either sting with query selector
          .openFrom('#left')
          // or an element
          .closeTo(angular.element(document.querySelector('#right')))
        );

      }
    };

    $scope.mostrarMapa = function() {

    }

    $scope.ListarMedicos = function() {
      $scope.Cargando = 'Cargando..';
      $http.post(UserSrv.GetPath(), {
          'seccion': 'farmacias',
          'accion': 'listar'
        })

        .success(function(response) {
          $scope.farmacias = response;
          $scope.Cargando = "";
          console.log(response);
        })

    }

    $scope.AltaMedico = function() {


      var nombre = $scope.nombrealta;
      var direccion = $scope.direccionalta;
      var localidad = $scope.localidadalta;
      var especialidad = $scope.especialidadalta;
      var latitudalta = $scope.lat;
      var longitudalta = $scope.lng;
      var telefonoalta = $scope.telefonoalta;

      $scope.Cargando = "Cargando...";
      $http.post(UserSrv.GetPath() + "?seccion=farmacias&accion=insertar&nombre=" + nombre + "&direccion=" + direccion + "&localidad=" + localidad + "&latitud=" + latitudalta + "&longitud=" + longitudalta + "&telefono=" + telefonoalta, {
          'seccion': 'farmacias',
          'accion': 'insertar'
        })

        .success(function(response) {
          $scope.Cargando = "";
          $scope.alerta(response);
          $scope.nombrealta = '';
          $scope.direccionalta = '';
          $scope.localidadalta = '';
          $scope.lat = '';
          $scope.lng = '';
          document.getElementById('altamapa').style.display = 'none';
          $scope.primeraosegunda = 2;
        })

    }

    $scope.Eliminar = function(id, nombre) {
      $scope.Cargando = "Cargando...";
      if (confirm('¿Esta seguro que desea eliminar la farmacia ' + nombre + "?")) {
        $http.post(UserSrv.GetPath() + "?seccion=farmacias&accion=eliminar&id=" + id, {
            'seccion': 'farmacias',
            'accion': 'eliminar'
          })
          .success(function(response) {
            $scope.Cargando = "";
            $scope.ListarMedicos();
          })
      } else {
        $scope.Cargando = "";
      }


    }


    $scope.LlenarModal = function(id) {

      $scope.Cargando = "Cargando...";
      $http.post(UserSrv.GetPath() + "?seccion=farmacias&accion=listarid&id=" + id, {
          'seccion': 'farmacias',
          'accion': 'listarid'
        })

        .success(function(response) {
          $scope.Cargando = "";
          console.log(response);
          $scope.ID = response.ID;
          $scope.direccion = response.DIRECCION;
          $scope.nombre = response.NOMBRE;
          $scope.localidad = response.LOCALIDAD;
          $scope.latitude = response.latitude;
          $scope.longitude = response.longitude;
        })

    }

    $scope.Guardar = function(id) {
      $scope.Cargando = "Cargando...";
      $http.post(UserSrv.GetPath() + "?seccion=farmacias&accion=modificar&id=" + $scope.ID + "&nombre=" + $scope.nombre + "&localidad=" + $scope.localidad + "&especialidad=" + $scope.especialidad + "&direccion=" + $scope.direccion.split(' ').join('%20'), {
          'seccion': 'farmacias',
          'accion': 'modificar'
        })
        .success(function(response) {
          $scope.Cargando = "";
          $scope.ListarMedicos();
        })
    }


  })



  ////////////////////////////////////////////////
  //█▀▀ █▀▀ █▀▀█ █▀▀ █▀▀  ▀  █▀▀█ █    ▀  █▀▀▄ █▀▀█ █▀▀▄ █▀▀ █▀▀
  //█▀▀ ▀▀█ ████ █▀▀ █    █  █▄▄█ █    █  █  █ █▄▄█ █  █ █▀▀ ▀▀█
  //▀▀▀ ▀▀▀ █    ▀▀▀ ▀▀▀  ▀  ▀  ▀ ▀▀▀  ▀  ▀▀▀  ▀  ▀ ▀▀▀  ▀▀▀ ▀▀▀
  ///////////////////////////////////////////////

  .controller('especialidadesCrt', function($scope, UserSrv, $http, $mdDialog) {
    $scope.nombrealta = '';
    $scope.alerta = function(tipo) {
      if (tipo = 'OK') {
        $mdDialog.show(
          $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('¡PERFECTO!')
          .textContent('Todo salió bien')
          .ariaLabel('Left to right demo')
          .ok('Aceptar')
          // You can specify either sting with query selector
          .openFrom('#left')
          // or an element
          .closeTo(angular.element(document.querySelector('#right')))
        );
      } else {
        $mdDialog.show(
          $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('¡UPS!')
          .textContent('Algo salió mal')
          .ariaLabel('Left to right demo')
          .ok('Aceptar')
          // You can specify either sting with query selector
          .openFrom('#left')
          // or an element
          .closeTo(angular.element(document.querySelector('#right')))
        );

      }
    };

    $scope.ListarEspecialidades = function() {
      $scope.Cargando = "Cargando...";
      $http.post(UserSrv.GetPath() + "?seccion=especialidades&accion=listar", {
          'seccion': 'especialidades',
          'accion': 'listar'
        })

        .success(function(response) {
          $scope.especialidades = response;
          $scope.Cargando = "";
          console.log(response);
        })

    }

    $scope.AltaEspecialidad = function() {
      $scope.Cargando = "Cargando...";
      var nombre = $scope.nombrealta;
      if ($scope.estudioalta == false) {
        var estudio = 0;
      } else {
        var estudio = 1;
      }
      $http.post(UserSrv.GetPath() + "?seccion=especialidades&accion=insertar&nombre=" + nombre + "&estudio=" + estudio, {
          'seccion': 'especialidades',
          'accion': 'insertar'
        })

        .success(function(response) {
          $scope.Cargando = "";
          $scope.alerta(response);
          $scope.estudioalta = false;
          $scope.nombrealta = '';
        })

    }

    $scope.Eliminar = function(id, nombre) {
      $scope.Cargando = "Cargando...";
      if (confirm('¿Esta seguro que desea eliminar la especialidad ' + nombre + "?")) {
        $http.post(UserSrv.GetPath() + "?seccion=especialidades&accion=eliminar&id=" + id, {
            'seccion': 'especialidades',
            'accion': 'eliminar'
          })
          .success(function(response) {
            $scope.Cargando = "";
            $scope.ListarEspecialidades();
          })
      } else {
        $scope.Cargando = "";
      }


    }

    $scope.LlenarModal = function(id) {

      $scope.Cargando = "Cargando...";
      $http.post(UserSrv.GetPath() + "?seccion=especialidades&accion=listarid&id=" + id, {
          'seccion': 'especialidades',
          'accion': 'listarid'
        })

        .success(function(response) {
          $scope.Cargando = "";
          console.log(response);
          $scope.ID = response.IDESPECIALIDAD;
          $scope.nombre = response.NOMBRE;
          if (response.ESTUDIO == 1) {
            $scope.estudio = true;
          } else {
            $scope.estudio = false;
          }
        })

    }

    $scope.Guardar = function(id) {
      $scope.Cargando = "Cargando...";
      if ($scope.estudio == false) {
        var estudio = 0;
      } else {
        var estudio = 1;
      }
      $http.post(UserSrv.GetPath() + "?seccion=especialidades&accion=modificar&id=" + $scope.ID + "&nombre=" + $scope.nombre + "&estudio=" + estudio, {
          'seccion': 'especialidades',
          'accion': 'modificar'
        })
        .success(function(response) {
          $scope.Cargando = "";
          $scope.ListarEspecialidades();
        })
    }



  })
