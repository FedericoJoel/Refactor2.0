angular.module('GestionarApp.controllers', ['GestionarApp.services', 'ngMaterial', 'ngAnimate','angular-loading-bar'])


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

      $http.get('http://api.gestionarturnos.com/solicitud/solicitudesEnProceso')

      .success(function(response) {

        $scope.solicitudes = $scope.maping(response);
        $scope.paginar();
        $scope.Cargando = "";
        console.log(response);
      })

      $http.get('http://api.gestionarturnos.com/climed/traerElementos')

      .success(function(response) {

        $scope.Medicos = response;
        console.log(response);
        $scope.espes = $scope.getEspes(response);
        
      })

    $scope.ChangePage = function(pag) {

      $scope.ActualPage = pag;
      $scope.paginar();

    }

    $scope.RechazarSolicitud = function(id){
      $http.post('http://api.gestionarturnos.com/solicitud/rechazar', {
          'id': id
        })

        .success(function(response) {
          alert('Solicitud Rechazada');
        })

      $http.get('http://api.gestionarturnos.com/solicitud/solicitudesEnProceso')

      .success(function(response) {

        $scope.solicitudes = $scope.maping(response);
        $scope.paginar();
        $scope.Cargando = "";
        console.log(response);
      })
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
      $http.post('http://api.gestionarturnos.com/turno', {
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
      $http.get('http://api.gestionarturnos.com/solicitud/'+id)

        .success(function(response) {
          $scope.solicitudexpandida = response;
          $scope.validarConfirmacion($scope.solicitudexpandida);
        })
    }

    $scope.paginar = function() {
      var i = 0;
      var last = 0;
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

    $scope.Autorizar = function(id){
      $http.post('http://api.gestionarturnos.com/solicitud/autorizar', {
          'id': id
        })

        .success(function(response) {
          console.log(response);
          alert('OK');
        })
    }

    $scope.Rechazar = function(id){
      $http.post('http://api.gestionarturnos.com/solicitud/rechazar', {
          'id': id
        })

        .success(function(response) {
          console.log(response);
          alert('OK');
        })
    }

    $scope.ChangePage = function(pag) {

      $scope.ActualPage = pag;
      $scope.paginar();
    }

    $http.get('http://api.gestionarturnos.com/solicitud/solicitudesEnProceso')

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
          source[i].fecha = moment(source[i].fecha).format('DD-MM-YYYY');
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

        $scope.Auditar = function(x){
      $scope.y = x;
      console.log($scope.y);
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
    $scope.errorText
    $scope.ActualPage = 1;
    $scope.filtronumeritos = 15;
    $scope.CargandoOS = "Cargando.."
    $http.get('http://api.gestionarturnos.com/obraSocial/traerElementos')
      .success(function(response) {
        $scope.obrasSociales = response;
        $scope.CargandoOS = "Seleccione..";
        console.log(response);
      })

    $scope.ChangePage = function(pag) {

      $scope.ActualPage = pag;
      $scope.paginar();

    }

    $scope.paginar = function() {
      var i = 0;
      $scope.cantidadpaginas = [];
      for (i = 0; i < (Object.keys($scope.afiliados).length / $scope.filtronumeritos); i++) {
        $scope.cantidadpaginas[i] = i + 1;
      }
    }

    $scope.ObtenerAfiliados = function() {
      $scope.Cargando = "Cargando...";
      $http.get('http://api.gestionarturnos.com/afiliado/traerElementos')

        .success(function(response) {
          $scope.afiliados = response;
          $scope.paginar();
          console.log($scope.afiliados);
          $scope.Cargando = "";
        })

    }

    $scope.Editar = function(x){
      console.log(x.obra_social);
      x.nacimiento = moment(x.nacimiento).format('YYYY-MM-DD');
      x.nacimiento = new Date(x.nacimiento);
      $scope.afiliadoModificando = x;
      console.log($scope.afiliadoModificando);
      $scope.modificando = true;
    }

    $scope.Guardar = function() {
      $http.put('http://api.gestionarturnos.com/afiliado/'+$scope.afiliadoModificando.id, {
          'ID':$scope.afiliadoModificando.id,
          'NACIMIENTO': moment($scope.afiliadoModificando.nacimiento).format('YYYY-MM-DD'),
          'NOMBRE': $scope.afiliadoModificando.nombre,
          'APELLIDO': $scope.afiliadoModificando.apellido,
          'DIRECCION': $scope.afiliadoModificando.direccion,
          'CUIL': $scope.afiliadoModificando.cuil,
          'EMAIL': $scope.afiliadoModificando.email,
          'DNI': $scope.afiliadoModificando.dni,
          'PISO': $scope.afiliadoModificando.piso,
          'DEPARTAMENTO': $scope.afiliadoModificando.departamento,
          'TELEFONO': $scope.afiliadoModificando.telefono,
          'CELULAR': $scope.afiliadoModificando.celular,
          'IDOBRASOCIAL': $scope.afiliadoModificando.obra_social.id,
          'NAFILIADO': $scope.afiliadoModificando.nafiliado,
          'GRUPOF': null
      })

        .success(function(response) {
          UserSrv.alertOk('Se edito con exito.');
          $scope.modificando = true;
          limpiarErrores();
        }).error(function(response){
          $scope.errorText = response;
          $scope.errorMsj = "*Revise los datos e intente nuevamente";
        })
    }

    $scope.Eliminar = function(ev,x){
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
              .title('¿Esta seguro de eliminar?')
              .textContent('El afiliado sera eliminado de forma permantente')
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok('Continuar')
              .cancel('Cancelar');
    
        $mdDialog.show(confirm).then(function() {
          $http.delete('http://api.gestionarturnos.com/afiliado/'+x.id)
            .success(function(response) {
            UserSrv.alertOk("Se elimino con exito.");
            $scope.ObtenerAfiliados();
        })
        }, function() {
          $scope.status = 'You decided to keep your debt.';
        });
      // var txt;
      // var r = confirm("Desea eliminar al afiliado "+x.nombre+" "+x.apellido+"?");
      // if (r == true) {
      //   $http.delete('http://api.gestionarturnos.com/afiliado/'+x.id)
      //   .success(function(response) {
      //     alert('OK');
      //     $scope.ObtenerAfiliados();
      //   })
      // }
    }

    $scope.Alta = function(){

      $scope.sortType     = 'nombre'; // el default
      $scope.sortReverse  = false;

      var nacimiento = $scope.nacimiento;
      nacimiento = moment(nacimiento).format('YYYY-MM-DD');
      $http.post('http://api.gestionarturnos.com/afiliado', {
          'NACIMIENTO': nacimiento,
          'NOMBRE': $scope.nombre,
          'APELLIDO': $scope.apellido,
          'DIRECCION': $scope.domicilio,
          'CUIL': $scope.cuil,
          'EMAIL': $scope.email,
          'DNI': $scope.dni,
          'PISO': $scope.piso,
          'DEPARTAMENTO': $scope.departamento,
          'TELEFONO': $scope.telefono,
          'CELULAR': $scope.celular,
          'IDOBRASOCIAL': $scope.obrasocial,
          'NAFILIADO': $scope.nafiliado,
          'GRUPOF': null
        })

        .success(function(response) {
          console.log(response);
          UserSrv.alertOk('Se dio de alta con exito.');
          limpiarCamposAlta();
          // $route.reload();
        }).error(function(response){
          $scope.errorText = response;
          $scope.errorMsj = "*Revise los datos e intente nuevamente";
        })

    } 
    
    limpiarErrores = function(){
      $scope.errorText = null;
      $scope.errorMsj = null;
    }

    limpiarCamposAlta =function(){
      limpiarErrores();
      $scope.nombre = null;
      $scope.apellido = null;
      $scope.domicilio = null;
      $scope.cuil = null;
      $scope.email = null;
      $scope.dni = null;
      $scope.piso = null;
      $scope.departamento = null;
      $scope.telefono = null;
      $scope.celular = null;
      $scope.obrasocial = null;
      $scope.nafiliado = null;
      $scope.nacimiento = null;
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
    $scope.ActualPage = 1;
    $scope.filtronumeritos = 15;

    $scope.CargandoOS = "Cargando.."
    $http.get('http://api.gestionarturnos.com/obraSocial/traerElementos')
      .success(function(response) {
        $scope.obrasSociales = response;
        $scope.CargandoOS = "Seleccione..";
        console.log(response);
      })
    $http.get('http://api.gestionarturnos.com/especialidad/traerElementos')
      .success(function(response) {
        $scope.Especialidades = response;
      })

    $scope.ChangePage = function(pag) {

      $scope.ActualPage = pag;
      $scope.paginar();

    }

    $scope.paginar = function() {
      var i = 0;
      $scope.cantidadpaginas = [];
      for (i = 0; i < (Object.keys($scope.medico).length / $scope.filtronumeritos); i++) {
        $scope.cantidadpaginas[i] = i + 1;
      }
    }

    $scope.ObtenerMedicos = function() {
      $scope.Cargando = "Cargando...";
      $http.get('http://api.gestionarturnos.com/medico/traerElementos')

        .success(function(response) {
          $scope.medico = response;
          $scope.paginar();
          console.log($scope.medico);
          $scope.Cargando = "";
        })

    }

    $scope.Editar = function(x){
      console.log(x.obra_social);
      $scope.medicoModificando = x;
      $scope.modificando = true;
    }

    $scope.Guardar = function() {
      $http.put('http://api.gestionarturnos.com/medico/'+$scope.afiliadoModificando.id, {
          'NACIMIENTO': moment($scope.afiliadoModificando.nacimiento).format('YYYY-MM-DD'),
          'NOMBRE': $scope.afiliadoModificando.nombre,
          'APELLIDO': $scope.afiliadoModificando.apellido,
          'DIRECCION': $scope.afiliadoModificando.direccion,
          'CUIL': $scope.afiliadoModificando.cuil,
          'EMAIL': $scope.afiliadoModificando.email,
          'DNI': $scope.afiliadoModificando.dni,
          'PISO': $scope.afiliadoModificando.piso,
          'DEPARTAMENTO': $scope.afiliadoModificando.departamento,
          'TELEFONO': $scope.afiliadoModificando.telefono,
          'CELULAR': $scope.afiliadoModificando.celular,
          'IDOBRASOCIAL': $scope.afiliadoModificando.obrasocial,
          'NAFILIADO': $scope.afiliadoModificando.nafiliado,
          'GRUPOF': null
      })

        .success(function(response) {
          alert('OK');
        })
    }

    $scope.Eliminar = function(x){
      var txt;
      var r = confirm("Desea eliminar al medico "+x.nombre+" "+x.apellido+"?");
      if (r == true) {
        $http.delete('http://api.gestionarturnos.com/medico/'+x.id)

        .success(function(response) {
          alert('OK');
          $scope.ObtenerMedicos();
        })
      }

    }

    $scope.Alta = function(){

      $http.post('http://api.gestionarturnos.com/medico', {
          'NACIMIENTO': nacimiento,
          'NOMBRE': $scope.nombre,
          'APELLIDO': $scope.apellido,
          'DIRECCION': $scope.domicilio,
          'CUIL': $scope.cuil,
          'EMAIL': $scope.email,
          'DNI': $scope.dni,
          'PISO': $scope.piso,
          'DEPARTAMENTO': $scope.departamento,
          'TELEFONO': $scope.telefono,
          'CELULAR': $scope.celular,
          'IDOBRASOCIAL': $scope.obrasocial,
          'NAFILIADO': $scope.nafiliado,
          'OBS': null,
          'GRUPOF': null
        })

        .success(function(response) {
          console.log(response);
          alert('ok');
          $route.reload();
        })
    }

    limpiarcampos =function(){
      $scope.nombre = null;
      $scope.apellido = null;
      $scope.domicilio = null;
      $scope.cuil = null;
      $scope.email = null;
      $scope.dni = null;
      $scope.piso = null;
      $scope.departamento = null;
      $scope.telefono = null;
      $scope.celular = null;
      $scope.obrasocial = null;
      $scope.nafiliado = null;
      $scope.nacimiento = null;
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
    $scope.ActualPage = 1;
    $scope.primeraosegunda = 1;
    $scope.filtronumeritos = 10;
    $scope.ObrasSocialesAgregar = new Array;
    $scope.OSEnvio = new Array;
    $scope.CargandoOS = "Cargando.."
    $http.get('http://api.gestionarturnos.com/obraSocial/traerElementos')
      .success(function(response) {
        $scope.obrasSociales = response;
        $scope.CargandoOS = "Seleccione..";
        console.log(response);
      })
    $http.get('http://api.gestionarturnos.com/especialidad/traerElementos')
      .success(function(response) {
        $scope.Especialidades = response;
      })

    $scope.Mapa = function() {
      initMap($scope.primeraosegunda);
      $scope.primeraosegunda = 2;
    }

    $scope.ChangePage = function(pag) {

      $scope.ActualPage = pag;
      $scope.paginar();

    }

    $scope.AgregarOS = function(x) {
      $scope.ObrasSocialesAgregar.push(x);
      $scope.OSEnvio.push(x.id);
    }

    $scope.QuitarOS = function(x){
      var indice = $scope.ObrasSocialesAgregar.indexOf(x);
      $scope.ObrasSocialesAgregar.splice(indice, 1);
      $scope.OSEnvio.splice(indice, 1);
    }

    $scope.modAgregarOS = function(x) {
      $scope.ObrasSocialesAgregar2.push(x);
      $scope.OSEnvio2.push(x.id);
    }

    $scope.modQuitarOS = function(x){
      var indice = $scope.ObrasSocialesAgregar2.indexOf(x);
      $scope.ObrasSocialesAgregar2.splice(indice, 1);
      $scope.OSEnvio2.splice(indice, 1);
    }

    $scope.paginar = function() {
      var i = 0;
      $scope.cantidadpaginas = [];
      for (i = 0; i < (Object.keys($scope.medicos).length / $scope.filtronumeritos); i++) {
        $scope.cantidadpaginas[i] = i + 1;
      }
    }

    $scope.ObtenerMedicos = function() {
      $scope.Cargando = "Cargando...";
      $http.get('http://api.gestionarturnos.com/climed/traerElementos')

        .success(function(response) {
          $scope.medicos = response;
          $scope.paginar();
          console.log($scope.medicos);
          $scope.Cargando = "";
        })

    }

    $scope.Editar = function(x){
      $scope.medicoModif = x;
      $scope.modificando = true;
      $scope.ObrasSocialesAgregar2 = x.obrasSociales;
    }

    $scope.Guardar = function() {
      $http.post('http://api.gestionarturnos.com/medico/'+$scope.afiliadoModificando.id, {
          'NACIMIENTO': moment($scope.afiliadoModificando.nacimiento).format('YYYY-MM-DD'),
          'NOMBRE': $scope.afiliadoModificando.nombre,
          'APELLIDO': $scope.afiliadoModificando.apellido,
          'DIRECCION': $scope.afiliadoModificando.direccion,
          'CUIL': $scope.afiliadoModificando.cuil,
          'EMAIL': $scope.afiliadoModificando.email,
          'DNI': $scope.afiliadoModificando.dni,
          'PISO': $scope.afiliadoModificando.piso,
          'DEPARTAMENTO': $scope.afiliadoModificando.departamento,
          'TELEFONO': $scope.afiliadoModificando.telefono,
          'CELULAR': $scope.afiliadoModificando.celular,
          'IDOBRASOCIAL': $scope.afiliadoModificando.obrasocial,
          'NAFILIADO': $scope.afiliadoModificando.nafiliado,
          'OBS': null,
          'GRUPOF': null
      })

        .success(function(response) {
          alert('OK');
        })
    }

    $scope.Eliminar = function(x){
      var txt;
      var r = confirm("Desea eliminar al medico "+x.nombre+" "+x.apellido+"?");
      if (r == true) {
        $http.delete('http://api.gestionarturnos.com/medico/'+x.id)

        .success(function(response) {
          alert('OK');
          $scope.ObtenerMedicos();
        })
      }

    }

    $scope.Alta = function(){

      $http.post('http://api.gestionarturnos.com/climed', {
          'NOMBRE': $scope.medicoAlta.nombre,
          'DIRECCION': $scope.medicoAlta.direccion,
          'LOCALIDAD': $scope.medicoAlta.localidad,
          'TELEFONO': $scope.medicoAlta.telefono,
          'ZONA': $scope.medicoAlta.zona,
          'latitude': $scope.lat,
          'longitude': $scope.lng,
          'IDESPECIALIDAD': $scope.medicoAlta.especialidad,
          'IDOBRASOCIAL': $scope.OSEnvio,
          'PARTICULAR': 1
        })

        .success(function(response) {
          console.log(response);
          alert('OK');
          $route.reload();
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

   $scope.sortType     = 'nombre'; // el default
    $scope.sortReverse  = false;

    $scope.filtronumeritos = 10;
    $scope.ActualPage = 1;
    $scope.ObtenerEspecialidades = function() {
      $scope.Cargando = "Cargando...";
      $http.get('http://api.gestionarturnos.com/especialidad/traerElementos')
        .success(function(response) {
          $scope.Especialidades = response;
          $scope.paginar();
          console.log($scope.Especialidades);
          $scope.Cargando = "";
        })
    }

    $scope.ChangePage = function(pag) {

      $scope.ActualPage = pag;
      $scope.paginar();

    }

    $scope.paginar = function() {
      var i = 0;
      $scope.cantidadpaginas = [];
      for (i = 0; i < (Object.keys($scope.Especialidades).length / $scope.filtronumeritos); i++) {
        $scope.cantidadpaginas[i] = i + 1;
      }
    }

    $scope.Eliminar = function(ev,x){

      var confirm = $mdDialog.confirm()
              .title('¿Esta seguro de eliminar?')
              .textContent('La especialidad o estudio sera eliminado de forma permantente')
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok('Continuar')
              .cancel('Cancelar');
    
        $mdDialog.show(confirm).then(function() {
          $http.delete('http://api.gestionarturnos.com/especialidad/'+x.id)
            .success(function(response) {
            UserSrv.alertOk("Se elimino con exito.");
            $scope.ObtenerEspecialidades();
            })
        })
    }

    $scope.Alta = function(){

      $http.post('http://api.gestionarturnos.com/especialidad', {
          'NOMBRE': $scope.espeAlta.nombre,
          'ESTUDIO': $scope.espeAlta.estudio
        })
        .success(function(response) {
          UserSrv.alertOk('Especialidad/Estudio creado con exito.');
          limpiarErrores();
          limpiarCampos();
        }).error(function(response){
          $scope.errorText = response;
          $scope.errorMsj = "*Revise los datos e intente nuevamente";
        })
        

    }

    $scope.Modificar = function(){

      $http.put('http://api.gestionarturnos.com/especialidad/'+$scope.espeModif.id, {
          'NOMBRE': $scope.espeModif.nombre,
          'ESTUDIO': $scope.espeModif.estudio
        })
        .success(function(response) {
          UserSrv.alertOk('Editado con exito.');
          limpiarErrores();
        }).error(function(response){
          $scope.errorText = response;
          $scope.errorMsj = "*Revise los datos e intente nuevamente";
        })

    }

    $scope.Editar = function(x){
      $scope.espeModif = x;
      $scope.modificando = true;
    }

    limpiarErrores = function(){
      $scope.errorText = null;
      $scope.errorMsj = null;
    }

    limpiarCampos = function(){
      $scope.espeModif.nombre = null;
      $scope.espeModif.estudio = 0;
    }


  })

