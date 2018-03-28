angular.module('GestionarApp.controllers', ['GestionarApp.services', 'ngMaterial', 'ngAnimate', 'angular-loading-bar', 'paginado'])

  .config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('APIInterceptor');
  }])

  .controller('loguinCrt', function ($scope, $http, $compile, $location, $window, $state) {

      .success(function (response) {
        console.log(response);
        var token = response.data.token
        var decoded = jwt_decode(token);
        localStorage.setItem('token', token);
        localStorage.setItem('logueado', true);
        localStorage.setItem('permisos', decoded.permisos);
        $state.go('inicio')
       
      }).error(function (response) {
        $scope.errorText = response;
        $scope.errorMsj = "*Usuario o contraseña incorrecta";
      })
    // manda las solicitud http necesarias para manejar los requerimientos de un abm
    $scope.enviarFormulario = function () {
      var data = {
        'name': $scope.name,
        'password': $scope.password
      }
      $http.post('http://des.gestionarturnos.com/login', data)

        .success(function (response) {
          var token = response.data.token
          var decoded = jwt_decode(token);
          localStorage.setItem('token', token);
          localStorage.setItem('logueado', true);
          localStorage.setItem('permisos', decoded.permisos);
          $state.go('inicio')

        }).error(function (response) {
          $scope.errorText = response;
          $scope.errorMsj = "*Usuario o contraseña incorrecta";
        })

    }
  })

  .controller('usuariosCrt', function ($scope, $http, $mdDialog, UserSrv, $filter, Permisos) {

    $scope.PS = Permisos;
    $scope.errorText
    $scope.ActualPage = 1;
    $scope.filtronumeritos = 15;
    $scope.CargandoOS = "Cargando.."



    $scope.ComprobarUsername = function () {
      $('#comprobuser').html('<i class="fa fa-spinner fa-spin fa-fw"></i> Validando nombre..');
      $http.post(UserSrv.GetPath(), {
          'seccion': 'usuarios',
          'accion': 'listarnombre'
        })

        .success(function (response) {
          $scope.ComprobUser = response;
          $('#comprobuser').html('<font color="green"><i class="fa fa-check fa-fw"></i> El nombre se encuentra disponible</font>');
          console.log(response);
        })
    }

    $scope.Alta = function () {
      var data = {
        'name': $scope.name,
        'email': $scope.email,
        'password': $scope.password,
        'id_perfil': $scope.id_perfil,
        'obrasSociales': $scope.ObrasSocialesAgregar.map(OS => OS.id)
      }
      $http.post('http://des.gestionarturnos.com/user', data)

        .success(function (response) {
          limpiarCampos()
          console.log(response);
          UserSrv.alertOk('El usuario se dio de alta correctamente');
          $route.reload();
        }).error(function (response) {
          $scope.errorText = response;
          $scope.errorMsj = "*Revise los datos e intente nuevamente";
        })
    }

    $scope.Guardar = function () {
      $http.put('http://des.gestionarturnos.com/user/' + $scope.userModificando.id, {
          'name': $scope.userModificando.name,
          'id_perfil': $scope.userModificando.id_perfil,
          'email': $scope.userModificando.email,
          'obrasSociales': $scope.ObrasSocialesAgregar.map(OS => OS.id)
        })

        .success(function (response) {
          UserSrv.alertOk('Se edito con exito.');
          $scope.modificando = true;
          limpiarErrores();
        }).error(function (response) {
          $scope.errorText = response;
          $scope.errorMsj = "*Revise los datos e intente nuevamente";
        })
    }

    $scope.Editar = function (x) {

      $scope.userModificando = x;
      $scope.ObrasSocialesAgregar = $scope.userModificando.obras_sociales
      $scope.modificando = true;
    }

    $scope.Eliminar = function (ev, x) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
        .title('¿Esta seguro de eliminar?')
        .textContent('El usuario sera eliminado de forma permantente')
        .ariaLabel('Lucky day')
        .targetEvent(ev)
        .ok('Continuar')
        .cancel('Cancelar');

      $mdDialog.show(confirm).then(function () {
        $http.delete('http://des.gestionarturnos.com/user/' + x.id)
          .success(function (response) {
            UserSrv.alertOk("Se elimino con exito.");
            $scope.traerUsuarios();
          })
      })
    }

    $scope.paginar = function () {
      var i = 0;
      var last = 0;
      $scope.cantidadpaginas = [];
      for (i = 0; i < (Object.keys($scope.usuarios).length / $scope.filtronumeritos); i++) {
        $scope.cantidadpaginas[i] = i + 1;
      }
    }


    $scope.AgregarOS = function (obraSocial) {
      $scope.ObrasSocialesAgregar.push(obraSocial)
    }
    $scope.QuitarOS = function (obraSocial) {
      var index = $scope.ObrasSocialesAgregar.indexOf(obraSocial)
      $scope.ObrasSocialesAgregar.splice(index, 1);
    }
    $scope.EliminarUsuario = function (id) {

      $http.post(UserSrv.GetPath(), {
          'seccion': 'usuarios',
          'accion': 'eliminar',
          'id': id,
          'dni': ''
        })

        .success(function (response) {
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
    $scope.traerUsuarios = function () {

      $http.get('http://des.gestionarturnos.com/user/traerElementos')

        .success(function (response) {

          $scope.usuarios = response;
          $scope.paginar()
          console.log(response);

        })
    }
    traerPerfiles = function () {

      $http.get('http://des.gestionarturnos.com/perfil/traerElementos')

        .success(function (response) {

          $scope.perfiles = response;
          console.log(response);

        })
    }
    $scope.traerOS = function () {

      $http.get('http://des.gestionarturnos.com/obraSocial/traerElementos')
        .success(function (response) {
          $scope.obrasSociales = response;
          $scope.CargandoOS = "Seleccione..";
          console.log(response);
        })
    }
    limpiarErrores = function () {
      $scope.errorText = null;
      $scope.errorMsj = null;
    }
    limpiarCampos = function () {
      limpiarErrores();
      $("#comprobuser").remove();
      $scope.name = null;
      $scope.password = null;
      $scope.email = null;
      $scope.obrasSociales = [];
      $scope.ObrasSocialesAgregar = [];
      $scope.perfiles = [];
    }

    $scope.ObrasSocialesAgregar = []
    traerPerfiles()
    $scope.traerOS()


  })


  .controller('permisosCrt', function ($scope, $http, $mdDialog, UserSrv, $filter, Permisos, $state) {

    $scope.PS = Permisos;

    $scope.logOut = function () {

      localStorage.setItem('permisos', '')
      localStorage.setItem('token', '')
      localStorage.setItem('logueado', false)

      $state.go("login")

    }


  })


  .controller('pantallasCrt', function ($scope, $http, $mdDialog, UserSrv, $filter, Permisos) {

    $scope.seleccionados = [];
    $scope.checkhijo = [];
    $scope.checkpadre = [];
    $scope.PS = Permisos;
    $scope.ListarPerfiles = function () {
      $http.post(UserSrv.GetPath(), {
          'seccion': 'perfiles',
          'accion': 'listar',
          'id': '',
          'dni': ''
        })

        .success(function (response) {
          $scope.Perfiles = response;
        })

    }

    $scope.ComprobarPerfil = function () {
      $('#comprobperfil').html('<i class="fa fa-spinner fa-spin fa-fw"></i> Validando nombre..');
      $http.post(UserSrv.GetPath(), {
          'seccion': 'perfiles',
          'accion': 'listarnombre',
          'nombre': $scope.perfilnew
        })

        .success(function (response) {
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
    $scope.BuscarPantallas = function () {
      $http.post(UserSrv.GetPath(), {
          'seccion': 'perfiles',
          'accion': 'listarpantallas',
          'id': '',
          'dni': ''
        })

        .success(function (response) {
          $scope.pantallas = response;
          console.log($scope.pantallas);
        })

    }

    $scope.CrearPerfil = function () {
      $http.post(UserSrv.GetPath(), {
          'seccion': 'perfiles',
          'accion': 'insertar',
          'perfil': $scope.perfilnew,
          'pantallas': $scope.seleccionados,
          'id': '',
          'dni': ''
        })

        .success(function (response) {
          if (response == 1) {
            $scope.perfilnew = '';
            //Desmarco todos
            $scope.seleccionados.forEach(function (element) {
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

    $scope.EliminarPerfil = function (id) {

      $http.post(UserSrv.GetPath(), {
          'seccion': 'perfiles',
          'accion': 'eliminar',
          'id': id,
          'dni': ''
        })

        .success(function (response) {
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

    $scope.MarcarPadre = function (id, esto) {

      //COMPRUEBO SI ESTABA SELECCIONADO ANTES
      if ($scope.checkpadre[id] == true) {
        //MARCO HIJOS
        esto.forEach(function (element) {
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
        esto.forEach(function (element) {
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

    $scope.MarcarHijo = function (idpadre, esto) {

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


  .controller('solicitudesCrt', function ($scope, $http, $mdDialog, UserSrv, $filter, Permisos) {

    $scope.ActualPage = 1;
    $scope.idmediselected = {
      'id': undefined,
      'nombre': undefined
    }
    $scope.cantidadpaginas = [];
    $scope.Cargando = "Cargando...";
    $scope.tipos = ['Todos', 'Clinico', 'Especialista', 'Estudio'];
    $scope.estados = ['Todos', 'Pendiente', 'Abierto', 'Rechazado', 'En Espera'];
    $scope.numeritos = ['10', '15', '20', '25', '50'];
    $scope.filtrotipo = $scope.tipos[0];
    $scope.filtroestado = $scope.estados[0];
    $scope.filtronumeritos = $scope.numeritos[0];
    $scope.PS = Permisos;
    /*$http.post(UserSrv.GetPath(), {
        'seccion': 'solicitudes',
        'accion': 'listar',
        'id': '',
        'dni': ''
      })*/
    var traerSolicitudes = function () {
      $http.get('http://des.gestionarturnos.com/solicitud/solicitudesEnProceso')

        .success(function (response) {

          $scope.solicitudes = response;
          $scope.solicitudesNoFiltradas = response;
          $scope.paginar();
          $scope.Cargando = "";
          console.log(response);
        })
    }
    $scope.selectorear = function (x) {
      $scope.se = [];
      $scope.se[x.id] = true;
      $scope.idmediselected.id = x.id;
      $scope.idmediselected.nombre = x.nombre;
    }

    traerSolicitudes()

    $http.get('http://des.gestionarturnos.com/climed/traerElementos')

      .success(function (response) {

        $scope.Medicos = response;
        console.log(response);
        $scope.espes = $scope.getEspes(response);

      })

    $scope.ChangePage = function (pag) {

      $scope.ActualPage = pag;
      $scope.paginar();

    }

    function DialogController($scope, $mdDialog, items) {
      $scope.items = items;
      $scope.closeDialog = function () {
        $mdDialog.hide();
      }
    }

    var getNumeroEsp = function (tipo) {
      switch (tipo) {
        case 'Clinico':
          return 1;
        case 'Especialista':
          return 2;
        case 'Estudio':
          return 3;
        default:
          return;
      }
    }
    $scope.filtroTipo = solicitud => ($scope.filtrotipo == undefined) ? true : ($scope.filtrotipo == 'Todos') ? true : solicitud.tipo == getNumeroEsp($scope.filtrotipo);
    $scope.filtroEstado = solicitud => ($scope.filtroestado == undefined) ? true : ($scope.filtroestado == 'Todos') ? true : solicitud.estado == $scope.filtroestado;
    $scope.filtroFechaDesde = solicitud => ($scope.fechadesde == undefined) ? true : moment(solicitud.fecha).isSameOrAfter($scope.fechadesde, 'day');
    $scope.filtroFechaHasta = solicitud => ($scope.fechahasta == undefined) ? true : moment(solicitud.fecha).isSameOrBefore($scope.fechahasta, 'day')

    /*$scope.filtrarSolicitudes = function(funcionFiltrado){
      $scope.solicitudes = $scope.solicitudesNoFiltradas.filter(funcionFiltrado)
    }*/

    $scope.RechazarSolicitud = function (ev, id) {


      var confirm = $mdDialog.prompt()
        .title('Ingrese el motivo por el cual desea rechazar solicitud')
        .textContent('')
        .placeholder('Ej: Demaciados rechazos de turno')
        .ariaLabel('Motivo')
        .ok('Enviar')
        .cancel('Cancelar');

      // $mdDialog.show(confirm);

      $mdDialog.show(confirm).then(function (motivo) {
        $http.post('http://des.gestionarturnos.com/solicitud/rechazar', {
            'id': id,
            'MOTIVO': motivo
          })

          .success(function (response) {
            $mdDialog.hide()
            UserSrv.alertOk('La solicitud fue rechazada con exito.');
            traerSolicitudes()
          })

      })
    }



    $scope.getEspes = function (source) {
      var espes = [];
      for (i = 0; i <= source.length - 1; i++) {
        espes.push(source[i].especialidades[0].nombre);
      }
      espes = espes.filter(function (value, index) {
        return espes.indexOf(value) == index
      });
      console.log(espes);
      return espes;
    }

    $scope.maping = function (source) {
      var tamaño = source.length;
      var array = [];
      for (i = 0; i < tamaño; i++) {
        if (source[i].tipo == 1 || source[i].revisado == 1) {
          //source[i].splice(i-1, 1);

          //tamaño = tamaño - 1;
          array.push(source[i]);

        }
      }
      return array;
    }

    $scope.EnviarTurno = function (fecha, hora, medico) {

      $scope.fecha = moment(fecha).format('YYYY-MM-DD');
      $scope.hora = moment(hora).format('hh:mm:ss');
      $scope.enviandoturno = true;

      var data = {
        'IDSOLICITUD': $scope.solicitudexpandida.id,
        'MEDICOASIGNADO': medico,
        'FECHAT': $scope.fecha,
        'HORAT': $scope.hora,
        'CONFIRMACION': 0
      }
      $http.post('http://des.gestionarturnos.com/turno', data)

        .success(function (response) {
          $scope.enviandoturno = false;
          UserSrv.alertOk('La solicitud fue generada con exito.');
          $scope.consultasolicitud($scope.solicitudexpandida.id);
          traerSolicitudes()
        })

    }

    $scope.consultasolicitud = function (id) {
      $http.get('http://des.gestionarturnos.com/solicitud/' + id)

        .success(function (response) {
          $scope.solicitudexpandida = response;
          $scope.validarConfirmacion($scope.solicitudexpandida);
        })
    }

    $scope.paginar = function () {
      var i = 0;
      var last = 0;
      $scope.cantidadpaginas = [];
      for (i = 0; i < (Object.keys($scope.solicitudes).length / $scope.filtronumeritos); i++) {
        $scope.cantidadpaginas[i] = i + 1;
      }
    }

    $scope.validarConfirmacion = function (solicitud) {
      $scope.turnoc = undefined;
      for (i = 0; i < solicitud.turnos.length; i++) {
        $scope.turnoc = solicitud.turnos[i].confirmacion;
      }


    }
    $scope.Detallar = function (solicitud) {
      $scope.solicitudexpandida = solicitud;
      $scope.datoexpandida = solicitud;
      $scope.idexpandida = solicitud.id;
      $scope.validarConfirmacion(solicitud);

    }

    $scope.CerrarDetalle = function () {

      $scope.idexpandida = undefined;

    }


  })



  .controller('auditoriaCrt', function ($scope, $http, $mdDialog, UserSrv, $filter, Permisos) {

    $scope.ActualPage = 1;
    $scope.cantidadpaginas = [];
    $scope.Cargando = "Cargando...";
    $scope.tipos = ['Todos', 'Clinico', 'Especialista', 'Estudio'];
    $scope.estados = ['Todos', 'Pendiente', 'Abierto', 'Rechazado', 'En Espera'];
    $scope.numeritos = ['10', '15', '20', '25', '50'];
    $scope.filtrotipo = $scope.tipos[0];
    $scope.filtroestado = $scope.estados[0];
    $scope.filtronumeritos = $scope.numeritos[0];
    $scope.PS = Permisos;
    /*$http.post(UserSrv.GetPath(), {
        'seccion': 'solicitudes',
        'accion': 'listar',
        'id': '',
        'dni': ''
      })*/

    $scope.filtroClimed = function(solicitud){
      if($scope.searchClimed == undefined){return true}
      if (solicitud.climed == null || solicitud.climed.nombre.indexOf($scope.searchClimed) > -1){return true} 
      else{return false}
    }

    $scope.Autorizar = function (id) {
      if($scope.especialidadesAgregar.length > 0){ // Osea que es una solicitud de estudio
      var data = {
        'id_especialidad': $scope.especialidadesAgregar[0].id,
        'id_clinica': $scope.clinicasAgregar[0].id
      }
      $http.put('http://des.gestionarturnos.com/solicitud/'+id, data)
        .success(function (response) {
          $http.post('http://des.gestionarturnos.com/solicitud/autorizar', {
            'id': id
          })
            .success(function (response) {
              console.log(response);
              UserSrv.alertOk('La solicitud fue validada con exito.');
              traerSolicitudes()
              $('#auditar').modal('hide');
            }).error(function (response) {
              $('#auditar').modal('hide');
              UserSrv.alertError('Hubo un error en la validacion de la solicitud. Intente nuevamente.');
            })
        }).error(function (response) {
          $('#auditar').modal('hide');
          UserSrv.alertError('Hubo un error en la asignacion de la solicitud. Intente nuevamente.');
        })

      }else{
        $http.post('http://des.gestionarturnos.com/solicitud/autorizar', {
          'id': id
        })
          .success(function (response) {
            console.log(response);
            UserSrv.alertOk('La solicitud fue validada con exito.');
            traerSolicitudes()
            $('#auditar').modal('hide');
          }).error(function (response) {
            $('#auditar').modal('hide');
            UserSrv.alertError('Hubo un error en la validacion de la solicitud. Intente nuevamente.');
          })
      }
    }
     $scope.filtro = {
       'afiliado':{
         'nombre': undefined
       },
       'fecha':undefined
     }
    $scope.formatDate = function(date){

      var b = moment(date).format('YYYY-MM-DD');
      $scope.filtro.fecha = b
      var j = 1
    }
    $scope.Rechazar = function (ev, id) {

      $('#auditar').modal('hide');
      var confirm = $mdDialog.prompt()
        .title('Ingrese el motivo por el cual desea rechazar solicitud')
        .textContent('')
        .placeholder('Ej: Demaciados rechazos de turno')
        .ariaLabel('Motivo')
        .ok('Enviar')
        .cancel('Cancelar');

      // $mdDialog.show(confirm);

      $mdDialog.show(confirm).then(function (motivo) {
        $http.post('http://des.gestionarturnos.com/solicitud/rechazar', {
            'id': id,
            'MOTIVO': motivo
          })

          .success(function (response) {
            $mdDialog.hide()
            UserSrv.alertOk('La solicitud fue rechazada con exito.');
            traerSolicitudes()
          }).error(function (response) {
            $('#auditar').modal('hide');
            UserSrv.alertError('Hubo un error en el rechazo de la solicitud. Intente nuevamente.');
          })

      })
    }

    $scope.ChangePage = function (pag) {

      $scope.ActualPage = pag;
      $scope.paginar();
    }

    var traerSolicitudes = function () {
      $http.get('http://des.gestionarturnos.com/solicitud/solicitudesParaAuditar')

        .success(function (response) {

          $scope.solicitudes = response;
          $scope.paginar();
          $scope.Cargando = "";
          console.log(response);
        })
    }
    var traerEspecialidades = function(){
      $http.get('http://des.gestionarturnos.com/especialidad/traerElementos')
        .success(function (response) {
          $scope.Especialidades = response;
        })
    }
    $scope.quitarEspecialidad = function (especialidad) {
      $scope.especialidadesAgregar = []
    }
    $scope.especialidadesAgregar = []
    $scope.agregarEspecialidad = function (especialidad) {
      $scope.especialidadesAgregar.push(especialidad)
      especialidad.agregado = true
      $('#Espes').modal('hide');
    }

    var traerClinicas = function () {
      $http.get('http://des.gestionarturnos.com/climed/traerElementos')
        .success(function (response) {
          $scope.Clinicas = response;
        })
    }
    $scope.quitarClinicas= function (clinica) {
      $scope.clinicasAgregar = []
    }
    $scope.clinicasAgregar = []
    $scope.agregarClinica = function (clinica) {
      $scope.clinicasAgregar.push(clinica)
      $('#Climed').modal('hide');
    }

    traerSolicitudes()
    traerClinicas()
    traerEspecialidades()

    $scope.Detallar = function (id) {
      $("#tr" + id).slideToggle();

    }

    $scope.paginar = function () {
      var i = 0;
      $scope.cantidadpaginas = [];
      for (i = 0; i < (Object.keys($scope.solicitudes).length / $scope.filtronumeritos); i++) {
        $scope.cantidadpaginas[i] = i + 1;
      }
    }

    $scope.Auditar = function (x) {
      $scope.especialidadesAgregar= []
      $scope.clinicasAgregar = []
      $scope.y = x;
      console.log($scope.y);
    }

    $scope.limpiarFiltros = function(){
      $scope.filtro = {
        'afiliado': {
          'nombre': undefined
        },
        'fecha': undefined
      }
      $scope.searchClimed = ''
    }

  })




  .filter('startFrom', function () {
    return function (input, start) {
      if (input) {
        start = +start; // parse to int
        return input.slice(start);
      }
      return [];
    }
  })


  .filter('myLimitTo', [function () {
    return function (obj, limit) {
      var keys = Object.keys(obj);
      if (keys.length < 1) {
        return [];
      }

      var ret = new Object,
        count = 0;
      angular.forEach(keys, function (key, arrayIndex) {
        if (count >= limit) {
          return false;
        }
        ret[key] = obj[key];
        count++;
      });
      return ret;
    };
  }])







  .controller('afiliadosCrt', function ($scope, $http, $mdDialog, UserSrv, Permisos) {
    $scope.errorText
    $scope.ActualPage = 1;
    $scope.filtronumeritos = 15;
    $scope.CargandoOS = "Cargando.."
    $scope.PS = Permisos;
    $http.get('http://des.gestionarturnos.com/obraSocial/traerElementos')
      .success(function (response) {
        $scope.obrasSociales = response;
        $scope.CargandoOS = "Seleccione..";
        console.log(response);
      })

    $scope.ChangePage = function (pag) {

      $scope.ActualPage = pag;
      $scope.paginar();

    }

    $scope.paginar = function () {
      var i = 0;
      $scope.cantidadpaginas = [];
      for (i = 0; i < (Object.keys($scope.afiliados).length / $scope.filtronumeritos); i++) {
        $scope.cantidadpaginas[i] = i + 1;
      }
    }

    $scope.ObtenerAfiliados = function () {
      $scope.Cargando = "Cargando...";
      $http.get('http://des.gestionarturnos.com/afiliado/traerElementos')

        .success(function (response) {
          $scope.afiliados = response;
          $scope.paginar();
          console.log($scope.afiliados);
          $scope.Cargando = "";
        })

    }

    $scope.Editar = function (x) {
      console.log(x.obra_social);
      x.nacimiento = moment(x.nacimiento).format('YYYY-MM-DD');
      x.nacimiento = new Date(x.nacimiento);
      $scope.afiliadoModificando = x;
      console.log($scope.afiliadoModificando);
      $scope.modificando = true;
    }

    $scope.Guardar = function () {
      $http.put('http://des.gestionarturnos.com/afiliado/' + $scope.afiliadoModificando.id, {
          'ID': $scope.afiliadoModificando.id,
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

        .success(function (response) {
          UserSrv.alertOk('Se edito con exito.');
          $scope.modificando = true;
          limpiarErrores();
        }).error(function (response) {
          $scope.errorText = response;
          $scope.errorMsj = "*Revise los datos e intente nuevamente";
        })
    }

    $scope.Eliminar = function (ev, x) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
        .title('¿Esta seguro de eliminar?')
        .textContent('El afiliado sera eliminado de forma permantente')
        .ariaLabel('Lucky day')
        .targetEvent(ev)
        .ok('Continuar')
        .cancel('Cancelar');

      $mdDialog.show(confirm).then(function () {
        $http.delete('http://des.gestionarturnos.com/afiliado/' + x.id)
          .success(function (response) {
            UserSrv.alertOk("Se elimino con exito.");
            $scope.ObtenerAfiliados();
          })
      }, function () {
        $scope.status = 'You decided to keep your debt.';
      });
      // var txt;
      // var r = confirm("Desea eliminar al afiliado "+x.nombre+" "+x.apellido+"?");
      // if (r == true) {
      //   $http.delete('http://des.gestionarturnos.com/afiliado/'+x.id)
      //   .success(function(response) {
      //     alert('OK');
      //     $scope.ObtenerAfiliados();
      //   })
      // }
    }

    $scope.Alta = function () {

      $scope.sortType = 'nombre'; // el default
      $scope.sortReverse = false;

      var nacimiento = $scope.nacimiento;
      nacimiento = moment(nacimiento).format('YYYY-MM-DD');
      $http.post('http://des.gestionarturnos.com/afiliado', {
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

        .success(function (response) {
          console.log(response);
          UserSrv.alertOk('Se dio de alta con exito.');
          limpiarCamposAlta();
          // $route.reload();
        }).error(function (response) {
          $scope.errorText = response;
          $scope.errorMsj = "*Revise los datos e intente nuevamente";
        })

    }

    limpiarErrores = function () {
      $scope.errorText = null;
      $scope.errorMsj = null;
    }

    limpiarCamposAlta = function () {
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
  .controller('clinicasCrt', function ($scope, UserSrv, $http, $mdDialog, Permisos) {

    $scope.lat = '';
    $scope.lng = '';
    $scope.ActualPage = 1;
    $scope.filtronumeritos = 15;
    $scope.PS = Permisos;
    $scope.CargandoOS = "Cargando.."
    $http.get('http://des.gestionarturnos.com/obraSocial/traerElementos')
      .success(function (response) {
        $scope.obrasSociales = response;
        $scope.CargandoOS = "Seleccione..";
        console.log(response);
      })
    $http.get('http://des.gestionarturnos.com/especialidad/traerElementos')
      .success(function (response) {
        $scope.Especialidades = response.map(esp => ({
          'nombre': esp.nombre,
          'estudio': esp.estudio,
          'id': esp.id,
          'agregado': false
        }));
      })

    $scope.ChangePage = function (pag) {

      $scope.ActualPage = pag;
      $scope.paginar();

    }

    $scope.paginar = function () {
      var i = 0;
      $scope.cantidadpaginas = [];
      for (i = 0; i < (Object.keys($scope.clinicas).length / $scope.filtronumeritos); i++) {
        $scope.cantidadpaginas[i] = i + 1;
      }
    }

    $scope.ObrasSocialesAgregar = []
    $scope.AgregarOS = function (obraSocial, scopeObj) {
      $scope[scopeObj].push(obraSocial)
    }
    $scope.QuitarOS = function (obraSocial, scopeObj) {
      var index = $scope.ObrasSocialesAgregar.indexOf(obraSocial)
      $scope[scopeObj].splice(index, 1);
    }
    $scope.Editar = function (x) {
      console.log(x.obra_social);
      $scope.clinicaModificando = x;
      $scope.especialidades = $scope.clinicaModificando.especialidades
      $scope.ObrasSocialesAgregar = $scope.clinicaModificando.obrasSociales
      $scope.modificando = true;
    }

    $scope.Guardar = function () {
      $http.put('http://des.gestionarturnos.com/climed/' + $scope.clinicaModificando.id, {
          'NOMBRE': $scope.clinicaModificando.nombre,
          'DIRECCION': $scope.clinicaModificando.domicilio,
          'LOCALIDAD': $scope.clinicaModificando.localidad,
          'ZONA': $scope.clinicaModificando.zona,
          'PARTICULAR': 0,
          'latitude': 0,
          'longitude': 0,
          'TELEFONO': $scope.clinicaModificando.telefono,
          'obrasSociales': $scope.ObrasSocialesAgregar.map(OS => OS.id),
          'especialidades': $scope.especialidades.map(esp => esp.id)
        })

        .success(function (response) {
          alert('OK');
        })
    }

    $scope.Eliminar = function (x) {
      var txt;
      var r = confirm("Desea eliminar a la clinica " + x.nombre + "?");
      if (r == true) {
        $http.delete('http://des.gestionarturnos.com/climed/' + x.id)

          .success(function (response) {
            alert('OK');
            $scope.ObtenerClinicas();
          })
      }

    }
    $scope.especialidades = []
    $scope.agregarEspecialidad = function (especialidad, scopeObj) {
      $scope[scopeObj].push(especialidad)
      especialidad.agregado = true
    }
    $scope.quitarEspecialidad = function (especialidad, scopeObj) {
      var index = $scope[scopeObj].indexOf(especialidad)
      if (index > -1) {
        $scope[scopeObj].splice(index, 1);
        especialidad.agregado = false
      }
    }

    $scope.Alta = function () {
      var data = {
        'NOMBRE': $scope.nombre,
        'DIRECCION': $scope.direccion,
        'LOCALIDAD': $scope.localidad,
        'ZONA': $scope.zona,
        'PARTICULAR': 0,
        'latitude': 0,
        'longitude': 0,
        'TELEFONO': $scope.telefono,
        'obrasSociales': $scope.ObrasSocialesAgregar.map(OS => OS.id),
        'especialidades': $scope.especialidades.map(esp => esp.id)
      }
      $http.post('http://des.gestionarturnos.com/climed', data)

        .success(function (response) {
          limpiarcampos()
          console.log(response);
          UserSrv.mensajeExito()
          $route.reload();
        }).error(function (response) {
          $scope.errorText = response;
          $scope.errorMsj = "*Revise los datos e intente nuevamente";
        })
    }

    limpiarcampos = function () {
      $scope.nombre = null;
      $scope.telefono = null;
      $scope.zona = null;
      $scope.especialidades = [];
      $scope.Especialidades = $scope.Especialidades.map(esp => ({
        'nombre': esp.nombre,
        'estudio': esp.estudio,
        'id': esp.id,
        'agregado': false
      }));
      $scope.ObrasSocialesAgregar = [];
    }

    $scope.ObtenerClinicas = function () {
      $scope.Cargando = "Cargando...";
      $http.get('http://des.gestionarturnos.com/climed/traerElementos')

        .success(function (response) {
          $scope.clinicas = response;
          $scope.paginar();
          console.log($scope.clinicas);
          $scope.Cargando = "";
        })

    }
    $scope.terminarModificacion = function () {
      $scope.especialidades = []
      $scope.modificando = false
    }

  })



  ////////////////////////////////////
  //█▀▄▀█ █▀▀ █▀▀▄  ▀  █▀▀ █▀▀█ █▀▀
  //█─▀─█ █▀▀ █──█  █  █   █  █ ▀▀█
  //▀   ▀ ▀▀▀ ▀▀▀─  ▀  ▀▀▀ ▀▀▀▀ ▀▀▀
  ////////////////////////////////////

  .controller('medicosCrt', function ($scope, UserSrv, $http, $timeout, $mdDialog, Permisos) {
    $scope.esconderMapa = true;
    $scope.esconderMapaModificar = true;
    $scope.lat = '';
    $scope.lng = '';
    $scope.modificarlng = '';
    $scope.modificarlat = '';
    $scope.ActualPage = 1;
    $scope.primeraosegunda = 1;
    $scope.filtronumeritos = 10;
    $scope.ObrasSocialesAgregar = new Array;
    $scope.ObrasSocialesAgregarMod = new Array;
    $scope.especialidadesAgregar = new Array;
    $scope.especialidadesAgregarMod = new Array;
    $scope.OSEnvio = new Array;
    $scope.OSEnvioMod = new Array;
    $scope.especialidadesEnvio = new Array;
    $scope.especialidadesEnvioMod = new Array;
    $scope.CargandoOS = "Cargando.."
    $scope.PS = Permisos;
    $http.get('http://des.gestionarturnos.com/obraSocial/traerElementos')
      .success(function (response) {
        $scope.obrasSociales = response;
        $scope.CargandoOS = "Seleccione..";
        console.log(response);
      })
    $http.get('http://des.gestionarturnos.com/especialidad/traerElementos')
      .success(function (response) {
        $scope.Especialidades = response;
      })



    $scope.Mapa = function () {
      $scope.esconderMapa = false;
      initMap($scope.primeraosegunda);
      $scope.primeraosegunda = 2;
    }

    $scope.mapaModificar = function () {
      $scope.esconderMapaModificar = false;
      console.log($scope.medicoModif);
      initMapModificar($scope.primeraosegunda, $scope.medicoModif.latitud, $scope.medicoModif.longitud);
      $scope.primeraosegunda = 2;
    }

    $scope.especialidades = []

    $scope.terminarModificacion = function () {
      $scope.especialidades = []
      $scope.modificando = false
    }

    $scope.agregarEspecialidad = function (especialidad) {
      $scope.especialidadesAgregar.push(especialidad);
      $scope.especialidadesEnvio.push(especialidad.id);
    }

    $scope.agregarEspecialidadMod = function (especialidad) {
      $scope.especialidadesAgregarMod.push(especialidad);
      $scope.especialidadesEnvioMod.push(especialidad.id);
    }

    $scope.quitarEspecialidadMod = function (especialidad) {
      var index = $scope.especialidadesAgregarMod.indexOf(especialidad);
      $scope.especialidadesAgregarMod.splice(index, 1);
      $scope.especialidadesEnvioMod.splice(index, 1);
    }

    $scope.quitarEspecialidad = function (especialidad) {
      var index = $scope.especialidadesAgregar.indexOf(especialidad);
      $scope.especialidadesAgregar.splice(index, 1);
      $scope.especialidadesEnvio.splice(index, 1);
    }

    $scope.ChangePage = function (pag) {

      $scope.ActualPage = pag;
      $scope.paginar();

    }

    $scope.AgregarOS = function (x) {
      $scope.ObrasSocialesAgregar.push(x);
      $scope.OSEnvio.push(x.id);
    }

    $scope.QuitarOS = function (x) {
      var indice = $scope.ObrasSocialesAgregar.indexOf(x);
      $scope.ObrasSocialesAgregar.splice(indice, 1);
      $scope.OSEnvio.splice(indice, 1);
    }

    $scope.modAgregarOS = function (x) {
      $scope.ObrasSocialesAgregarMod.push(x);
      $scope.OSEnvioMod.push(x.id);
    }

    $scope.modQuitarOS = function (x) {
      var indice = $scope.ObrasSocialesAgregarMod.indexOf(x);
      $scope.ObrasSocialesAgregarMod.splice(indice, 1);
      $scope.OSEnvioMod.splice(indice, 1);
    }

    $scope.paginar = function () {
      var i = 0;
      $scope.cantidadpaginas = [];
      for (i = 0; i < (Object.keys($scope.medicos).length / $scope.filtronumeritos); i++) {
        $scope.cantidadpaginas[i] = i + 1;
      }
    }

    $scope.ObtenerMedicos = function () {
      $scope.Cargando = "Cargando...";
      $http.get('http://des.gestionarturnos.com/climed/traerElementos')

        .success(function (response) {
          $scope.medicos = response.filter(medico => medico.particular == 1)
          $scope.paginar();
          console.log($scope.medicos);
          $scope.Cargando = "";
        })

    }

    $scope.Editar = function (x) {
      $scope.medicoModif = x;
      $scope.modificando = true;
      $scope.ObrasSocialesAgregarMod = x.obrasSociales;
      $scope.especialidadesAgregarMod = x.especialidades;
    }

    $scope.Guardar = function () {
      $http.put('http://des.gestionarturnos.com/climed/' + $scope.medicoModif.id, {
          'NOMBRE': $scope.medicoModif.nombre,
          'DIRECCION': $scope.medicoModif.domicilio,
          'LOCALIDAD': $scope.medicoModif.localidad,
          'ZONA': $scope.medicoModif.zona,
          'PARTICULAR': 1,
          'latitude': 0,
          'longitude': 0,
          'TELEFONO': $scope.medicoModif.telefono,
          'obrasSociales': $scope.ObrasSocialesAgregar.map(OS => OS.id),
          'especialidades': $scope.medicoModif.especialidades
        })

        .success(function (response) {
          $scope.ObtenerMedicos()
          alert('OK');
        })
    }

    $scope.Eliminar = function (ev, x) {

      var confirm = $mdDialog.confirm()
        .title('¿Esta seguro de eliminar?')
        .textContent('La clinica o particular sera eliminado de forma permantente')
        .ariaLabel('Lucky day')
        .targetEvent(ev)
        .ok('Continuar')
        .cancel('Cancelar');

      $mdDialog.show(confirm).then(function () {
        $http.delete('http://des.gestionarturnos.com/climed/' + x.id)
          .success(function (response) {
            UserSrv.alertOk("Se elimino con exito.");
            $scope.ObtenerMedicos();
          })
          .error(function (response) {
            UserSrv.alertOk("Hubo un error al eliminar.");
          })
      })
    }

    $scope.Alta = function () {
      var data = {
        'NOMBRE': $scope.medicoAlta.nombre,
        'DIRECCION': $scope.medicoAlta.direccion,
        'LOCALIDAD': $scope.medicoAlta.localidad,
        'TELEFONO': $scope.medicoAlta.telefono,
        'ZONA': $scope.medicoAlta.zona,
        'latitude': $scope.lat,
        'longitude': $scope.lng,
        'especialidades': $scope.especialidadesEnvio,
        'obrasSociales': $scope.OSEnvio,
        'PARTICULAR': $scope.medicoAlta.particular
      }
      $http.post('http://des.gestionarturnos.com/climed', data)

        .success(function (response) {
          console.log($scope.lng);
          console.log($scope.lat);
          limpiarcampos()
          UserSrv.alertOk('El medico se dio de alta correctamente');
        }).error(function (response) {
          $scope.errorText = response;
          $scope.errorMsj = "*Revise los datos e intente nuevamente";
        })
    }

    limpiarcampos = function () {
      $scope.errorText = '';
      $scope.errorMsj = '';
      $scope.esconderMapa = true;
      $scope.medicoAlta.nombre = '';
      $scope.medicoAlta.direccion = '';
      $scope.medicoAlta.localidad = '';
      $scope.medicoAlta.telefono = '';
      $scope.medicoAlta.zona = '';
      $scope.ObrasSocialesAgregar = [];
      $scope.especialidadesAgregar = [];
      $scope.OSEnvio = [];
      $scope.especialidadesenvio = [];
      $scope.especialidadesAgregarMod = [];
      $scope.especialidadesEnvioMod = [];
    }

  })



  ////////////////////////////////
  //█▀▀ █▀▀█ █▀▀█ █▀▄▀█ █▀▀█ █▀▀  ▀  █▀▀█ █▀▀
  //█▀▀ █▄▄█ █▄▄▀ █ ▀ █ █▄▄█ █    █  █▄▄█ ▀▀█
  //▀   ▀  ▀ ▀  ▀ ▀   ▀ ▀  ▀ ▀▀▀  ▀  ▀  ▀ ▀▀▀
  ////////////////////////////////
  .controller('farmaciasCrt', function ($scope, UserSrv, $http, $mdDialog, Permisos) {


    $scope.lat = '';
    $scope.lng = '';
    $scope.primeraosegunda = 1;
    $scope.ActualPage = 1;
    $scope.primeraosegunda = 1;
    $scope.filtronumeritos = 10;
    $scope.ObrasSocialesAgregar = [];
    $scope.PS = Permisos;

    $scope.paginar = function () {
      var i = 0;
      $scope.cantidadpaginas = [];
      for (i = 0; i < (Object.keys($scope.farmacias).length / $scope.filtronumeritos); i++) {
        $scope.cantidadpaginas[i] = i + 1;
      }
    }
    $scope.ChangePage = function (pag) {
      $scope.ActualPage = pag;
      $scope.paginar();
    }


    $scope.Editar = function (x) {
      $scope.farmaciaModif = x;
      $scope.modificando = true;
      $scope.ObrasSocialesAgregar = x.obrasSociales;
    }
    $scope.Eliminar = function (x) {
      var txt;
      var r = confirm("Desea eliminar a la clinica " + x.nombre + "?");
      if (r == true) {
        $http.delete('http://des.gestionarturnos.com/climed/' + x.id)

          .success(function (response) {
            alert('OK');
            $scope.ObtenerMedicos();
          })
      }

    }
    $scope.AgregarOS = function (x) {
      $scope.ObrasSocialesAgregar.push(x);
      $scope.OSEnvio.push(x.id);
    }

    $scope.QuitarOS = function (x) {
      var indice = $scope.ObrasSocialesAgregar.indexOf(x);
      $scope.ObrasSocialesAgregar.splice(indice, 1);
      $scope.OSEnvio.splice(indice, 1);
    }

    $scope.alerta = function (tipo) {
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

    $scope.mostrarMapa = function () {

    }

    $scope.borrarOS = function () {
      $scope.ObrasSocialesAgregar = []
    }

    $scope.ObtenerFarmacias = function () {
      $scope.Cargando = 'Cargando..';
      $http.get('http://des.gestionarturnos.com/farmacia/traerElementos')

        .success(function (response) {
          $scope.farmacias = response
          $scope.paginar()
          $scope.ObrasSocialesAgregar = []
        })

    }

    $scope.ObtenerOS = function () {
      $http.get('http://des.gestionarturnos.com/obraSocial/traerElementos')
        .success(function (response) {
          $scope.obrasSociales = response;
          $scope.CargandoOS = "Seleccione..";
          console.log(response);
        })
    }

    $scope.Alta = function () {
      var data = {
        'NOMBRE': $scope.nombre,
        'DIRECCION': $scope.direccion,
        'LOCALIDAD': $scope.localidad,
        'TELEFONO': $scope.telefono,
        'latitude': 0,
        'longitude': 0,
        'obrasSociales': $scope.ObrasSocialesAgregar.map(OS => OS.id)
      }
      $http.post('http://des.gestionarturnos.com/farmacia', data)

        .success(function (response) {
          console.log(response);
          alert('OK');
          $route.reload();
        }).error(function (response) {
          $scope.errorText = response;
          $scope.errorMsj = "*Revise los datos e intente nuevamente";
        })
    }

    $scope.Eliminar = function (id, nombre) {
      $scope.Cargando = "Cargando...";
      if (confirm('¿Esta seguro que desea eliminar la farmacia ' + nombre + "?")) {
        $http.post(UserSrv.GetPath() + "?seccion=farmacias&accion=eliminar&id=" + id, {
            'seccion': 'farmacias',
            'accion': 'eliminar'
          })
          .success(function (response) {
            $scope.Cargando = "";
            $scope.ListarMedicos();
          })
      } else {
        $scope.Cargando = "";
      }


    }


    $scope.LlenarModal = function (id) {

      $scope.Cargando = "Cargando...";
      $http.post(UserSrv.GetPath() + "?seccion=farmacias&accion=listarid&id=" + id, {
          'seccion': 'farmacias',
          'accion': 'listarid'
        })

        .success(function (response) {
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

    $scope.Guardar = function (id) {
      $scope.Cargando = "Cargando...";
      $http.post(UserSrv.GetPath() + "?seccion=farmacias&accion=modificar&id=" + $scope.ID + "&nombre=" + $scope.nombre + "&localidad=" + $scope.localidad + "&especialidad=" + $scope.especialidad + "&direccion=" + $scope.direccion.split(' ').join('%20'), {
          'seccion': 'farmacias',
          'accion': 'modificar'
        })
        .success(function (response) {
          $scope.Cargando = "";
          $scope.ListarMedicos();
        })
    }

    $scope.ObtenerOS()


  })



  ////////////////////////////////////////////////
  //█▀▀ █▀▀ █▀▀█ █▀▀ █▀▀  ▀  █▀▀█ █    ▀  █▀▀▄ █▀▀█ █▀▀▄ █▀▀ █▀▀
  //█▀▀ ▀▀█ ████ █▀▀ █    █  █▄▄█ █    █  █  █ █▄▄█ █  █ █▀▀ ▀▀█
  //▀▀▀ ▀▀▀ █    ▀▀▀ ▀▀▀  ▀  ▀  ▀ ▀▀▀  ▀  ▀▀▀  ▀  ▀ ▀▀▀  ▀▀▀ ▀▀▀
  ///////////////////////////////////////////////

  .controller('especialidadesCrt', function ($scope, UserSrv, $http, $mdDialog, Permisos) {

    $scope.sortType = 'nombre'; // el default
    $scope.sortReverse = false;
    $scope.PS = Permisos;



    $scope.ObtenerEspecialidades = function () {
      $scope.Cargando = "Cargando...";
      $http.get('http://des.gestionarturnos.com/especialidad/traerElementos')
        .success(function (response) {
          $scope.Especialidades = response;
          $scope.paginar();
          $scope.Cargando = "";
        })
    }

    $scope.Eliminar = function (ev, x) {

      var confirm = $mdDialog.confirm()
        .title('¿Esta seguro de eliminar?')
        .textContent('La especialidad o estudio sera eliminado de forma permantente')
        .ariaLabel('Lucky day')
        .targetEvent(ev)
        .ok('Continuar')
        .cancel('Cancelar');

      $mdDialog.show(confirm).then(function () {
        $http.delete('http://des.gestionarturnos.com/especialidad/' + x.id)
          .success(function (response) {
            UserSrv.alertOk("Se elimino con exito.");
            $scope.ObtenerEspecialidades();
          })
      })
    }

    $scope.Alta = function () {

      $http.post('http://des.gestionarturnos.com/especialidad', {
          'NOMBRE': $scope.espeAlta.nombre,
          'ESTUDIO': $scope.espeAlta.estudio
        })
        .success(function (response) {
          UserSrv.alertOk('Especialidad/Estudio creado con exito.');
          limpiarErrores();
          limpiarCampos();
        }).error(function (response) {
          $scope.errorText = response;
          $scope.errorMsj = "*Revise los datos e intente nuevamente";
        })


    }

    $scope.Modificar = function () {

      $http.put('http://des.gestionarturnos.com/especialidad/' + $scope.espeModif.id, {
          'NOMBRE': $scope.espeModif.nombre,
          'ESTUDIO': $scope.espeModif.estudio
        })
        .success(function (response) {
          UserSrv.alertOk('Editado con exito.');
          limpiarErrores();
        }).error(function (response) {
          $scope.errorText = response;
          $scope.errorMsj = "*Revise los datos e intente nuevamente";
        })

    }

    $scope.Editar = function (x) {
      $scope.espeModif = x;
      $scope.modificando = true;
    }

    limpiarErrores = function () {
      $scope.errorText = null;
      $scope.errorMsj = null;
    }

    limpiarCampos = function () {
      $scope.espeModif.nombre = null;
      $scope.espeModif.estudio = 0;
    }


  })

  .controller('recomendacionCrt', function ($scope, UserSrv, $http, $mdDialog, Permisos) {

    $scope.sortType = 'nombre'; // el default
    $scope.sortReverse = false;
    $scope.PS = Permisos;
    console.log($scope.PS);

    $scope.filtronumeritos = 10;
    $scope.ActualPage = 1;
    $scope.ObtenerRecomendaciones = function () {
      $scope.Cargando = "Cargando...";
      $http.get('http://des.gestionarturnos.com/recomendacion/sinContactar')
        .success(function (response) {
          $scope.Recomendaciones = response;
          console.log($scope.Recomendaciones);
          $scope.Cargando = "";
        })
    }


    $scope.Contactar = function (id) {

      $http.post('http://des.gestionarturnos.com/recomendacion/contactado', {
        'id':id
      })
        .success(function(response) {
      $http.get('http://des.gestionarturnos.com/recomendacion/contactado/' + id)
        .success(function (response) {
          UserSrv.alertOk('Recomendacion marcada como contactada.');
          $scope.ObtenerRecomendaciones();
        }).error(function (response) {
          $scope.errorText = response;
          $scope.errorMsj = "*Revise los datos e intente nuevamente";
        })


    }

    $scope.ObtenerRecomendaciones();


  })


.controller('estadisticasCrt', function ($scope, UserSrv, $http, $mdDialog, Permisos) {


    $scope.sortType     = 'nombre'; // el default
    $scope.fecha_creacion_desde = moment().format('Y') + '-' + moment().format('MM') + '-01';
    $scope.fecha_creacion_hasta = moment().format('Y') + '-' + moment().format('MM') + '-' + moment().daysInMonth();
    $scope.fecha_modificacion_desde = moment().format('Y') + '-' + moment().format('MM') + '-01';
    $scope.fecha_modificacion_hasta = moment().format('Y') + '-' + moment().format('MM') + '-' + moment().daysInMonth();
    $scope.sortReverse  = false;
    $scope.sortType = 'nombre'; // el default
    $scope.sortReverse = false;
    $scope.PS = Permisos;
    console.log($scope.PS);

    $scope.filtronumeritos = 10;
    $scope.ActualPage = 1;

    $scope.setVista = function(vista) {
      $scope.vistaactual = vista;
    }

    function sumZonas(objeto) {
      var pendientes = 0,confirmados = 0, rechazados = 0, total = 0;
      objeto.forEach(function(objeto){
        pendientes = pendientes + objeto.pendientes;
        confirmados = confirmados + objeto.confirmados;
        rechazados = rechazados + objeto.rechazados;
        total = total + objeto.total;
      })
      return {'pendientes':pendientes,'confirmados':confirmados,'rechazados':rechazados, 'total': total};
    }

    $scope.expandir = function(id){
      $scope.expandida = id;
      $scope.Turnos = undefined;
      $http.post('http://des.gestionarturnos.com/reporteSolicitudes/turnos',{
        'id_solicitud': id
      })
      .success(function(response) {
        $scope.Turnos = response;
        //$scope.totalZonas = sumZonas(response);
        console.log($scope.Turnos);
      })
    }

    $scope.ObtenerZonas = function() {
      $scope.vistaactual = "Zonas";
      $http.post('http://des.gestionarturnos.com/reporteSolicitudes/zonas',{
        'fecha_creacion_desde': moment($scope.fecha_creacion_desde).format('YYYY-MM-DD'),
        'fecha_creacion_hasta': moment($scope.fecha_creacion_hasta).format('YYYY-MM-DD'),
        'fecha_modificacion_desde': moment($scope.fecha_modificacion_desde).format('YYYY-MM-DD'),
        'fecha_modificacion_hasta': moment($scope.fecha_modificacion_hasta).format('YYYY-MM-DD')
      })
        .success(function(response) {
          $scope.Zonas = response;
          $scope.totalZonas = sumZonas(response);
          console.log($scope.Zonas);
        })
    }

    $scope.getClinicas = function(zona) {
      $scope.vistaactual = "Clinicas";
      $scope.zonaactual = zona;
      $http.post('http://des.gestionarturnos.com/reporteSolicitudes/clinicas',{
        'zona': zona,
        'fecha_creacion_desde': moment($scope.fecha_creacion_desde).format('YYYY-MM-DD'),
        'fecha_creacion_hasta': moment($scope.fecha_creacion_hasta).format('YYYY-MM-DD'),
        'fecha_modificacion_desde': moment($scope.fecha_modificacion_desde).format('YYYY-MM-DD'),
        'fecha_modificacion_hasta': moment($scope.fecha_modificacion_hasta).format('YYYY-MM-DD')
      })
        .success(function(response) {
          $scope.Clinicas = response;
          $scope.totalClinicas = sumZonas(response);
          console.log($scope.Clinicas);
        })
    }

    $scope.getSolicitudes = function(clinica) {
      $scope.vistaactual = "Solicitudes";
      $scope.clinicaactual = clinica.nombre;
      $http.post('http://des.gestionarturnos.com/reporteSolicitudes/solicitudes',{
        'id_clinica':clinica.id_clinica,
        'fecha_creacion_desde': moment($scope.fecha_creacion_desde).format('YYYY-MM-DD'),
        'fecha_creacion_hasta': moment($scope.fecha_creacion_hasta).format('YYYY-MM-DD'),
        'fecha_modificacion_desde': moment($scope.fecha_modificacion_desde).format('YYYY-MM-DD'),
        'fecha_modificacion_hasta': moment($scope.fecha_modificacion_hasta).format('YYYY-MM-DD')
      })
        .success(function(response) {
          $scope.Solicitudes = response;
          console.log($scope.Solicitudes);
    $scope.ObtenerRecomendaciones = function () {
      $scope.Cargando = "Cargando...";
      $http.get('http://des.gestionarturnos.com/recomendacion/sinContactar')
        .success(function (response) {
          $scope.Recomendaciones = response;
          console.log($scope.Recomendaciones);
          $scope.Cargando = "";
        })
    }


    $scope.Contactar = function (id) {

      $http.get('http://des.gestionarturnos.com/recomendacion/contactado/' + id)
        .success(function (response) {
          UserSrv.alertOk('Recomendacion marcada como contactada.');
          $scope.ObtenerRecomendaciones();
        }).error(function (response) {
          $scope.errorText = response;
          $scope.errorMsj = "*Revise los datos e intente nuevamente";
        })

    }

    $scope.ObtenerZonas();


  })


.controller('estadisticasCrt', function ($scope, UserSrv, $http, $mdDialog, Permisos) {


    $scope.sortType     = 'nombre'; // el default
    $scope.fecha_creacion_desde = moment().format('Y') + '-' + moment().format('MM') + '-01';
    $scope.fecha_creacion_hasta = moment().format('Y') + '-' + moment().format('MM') + '-' + moment().daysInMonth();
    $scope.fecha_modificacion_desde = moment().format('Y') + '-' + moment().format('MM') + '-01';
    $scope.fecha_modificacion_hasta = moment().format('Y') + '-' + moment().format('MM') + '-' + moment().daysInMonth();
    $scope.sortReverse  = false;
    $scope.sortType = 'nombre'; // el default
    $scope.sortReverse = false;
    $scope.PS = Permisos;
    console.log($scope.PS);

    $scope.filtronumeritos = 10;
    $scope.ActualPage = 1;


    $scope.setVista = function(vista) {
      $scope.vistaactual = vista;
    }

    function sumZonas(objeto) {
      var pendientes = 0,confirmados = 0, rechazados = 0, total = 0;
      objeto.forEach(function(objeto){
        pendientes = pendientes + objeto.pendientes;
        confirmados = confirmados + objeto.confirmados;
        rechazados = rechazados + objeto.rechazados;
        total = total + objeto.total;
      })
      return {'pendientes':pendientes,'confirmados':confirmados,'rechazados':rechazados, 'total': total};
    }

    $scope.expandir = function(id){
      $scope.expandida = id;
      $scope.Turnos = undefined;
      $http.post('http://des.gestionarturnos.com/reporteSolicitudes/turnos',{
        'id_solicitud': id
      })
      .success(function(response) {
        $scope.Turnos = response;
        //$scope.totalZonas = sumZonas(response);
        console.log($scope.Turnos);
      })
    }

    $scope.ObtenerZonas = function() {
      $scope.vistaactual = "Zonas";
      $http.post('http://des.gestionarturnos.com/reporteSolicitudes/zonas',{
        'fecha_creacion_desde': moment($scope.fecha_creacion_desde).format('YYYY-MM-DD'),
        'fecha_creacion_hasta': moment($scope.fecha_creacion_hasta).format('YYYY-MM-DD'),
        'fecha_modificacion_desde': moment($scope.fecha_modificacion_desde).format('YYYY-MM-DD'),
        'fecha_modificacion_hasta': moment($scope.fecha_modificacion_hasta).format('YYYY-MM-DD')
      })
        .success(function(response) {
          $scope.Zonas = response;
          $scope.totalZonas = sumZonas(response);
          console.log($scope.Zonas);
        })
    }

    $scope.getClinicas = function(zona) {
      $scope.vistaactual = "Clinicas";
      $scope.zonaactual = zona;
      $http.post('http://des.gestionarturnos.com/reporteSolicitudes/clinicas',{
        'zona': zona,
        'fecha_creacion_desde': moment($scope.fecha_creacion_desde).format('YYYY-MM-DD'),
        'fecha_creacion_hasta': moment($scope.fecha_creacion_hasta).format('YYYY-MM-DD'),
        'fecha_modificacion_desde': moment($scope.fecha_modificacion_desde).format('YYYY-MM-DD'),
        'fecha_modificacion_hasta': moment($scope.fecha_modificacion_hasta).format('YYYY-MM-DD')
      })
        .success(function(response) {
          $scope.Clinicas = response;
          $scope.totalClinicas = sumZonas(response);
          console.log($scope.Clinicas);
        })
    }

    $scope.getSolicitudes = function(clinica) {
      $scope.vistaactual = "Solicitudes";
      $scope.clinicaactual = clinica.nombre;
      $http.post('http://des.gestionarturnos.com/reporteSolicitudes/solicitudes',{
        'id_clinica':clinica.id_clinica,
        'fecha_creacion_desde': moment($scope.fecha_creacion_desde).format('YYYY-MM-DD'),
        'fecha_creacion_hasta': moment($scope.fecha_creacion_hasta).format('YYYY-MM-DD'),
        'fecha_modificacion_desde': moment($scope.fecha_modificacion_desde).format('YYYY-MM-DD'),
        'fecha_modificacion_hasta': moment($scope.fecha_modificacion_hasta).format('YYYY-MM-DD')
      })
        .success(function(response) {
          $scope.Solicitudes = response;
          console.log($scope.Solicitudes);

    $scope.ObtenerRecomendaciones = function () {
      $scope.Cargando = "Cargando...";
      $http.get('http://des.gestionarturnos.com/recomendacion/sinContactar')
        .success(function (response) {
          $scope.Recomendaciones = response;
          console.log($scope.Recomendaciones);
          $scope.Cargando = "";

        })
    }


    $scope.Contactar = function (id) {

      $http.get('http://des.gestionarturnos.com/recomendacion/contactado/' + id)
        .success(function (response) {
          UserSrv.alertOk('Recomendacion marcada como contactada.');
          $scope.ObtenerRecomendaciones();
        }).error(function (response) {
          $scope.errorText = response;
          $scope.errorMsj = "*Revise los datos e intente nuevamente";
        })
    }

    $scope.ObtenerZonas();


  })


  