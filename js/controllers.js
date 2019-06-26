angular.module('GestionarApp.controllers', ['angular-loading-bar', 'GestionarApp.services', 'ngMaterial', 'ngAnimate', 'paginado'])

  .config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('APIInterceptor');
  }])

  .controller('loguinCrt', function ($scope, $http, $compile, $location, $window, $state) {

    // manda las solicitud http necesarias para manejar los requerimientos de un abm
    $scope.enviarFormulario = function () {
      var data = {
        'name': $scope.name,
        'password': $scope.password
      }
      $http.post('https://guarded-oasis-37936.herokuapp.com/login', data)

        .success(function (response) {
          var token = response.data.token
          var decoded = jwt_decode(token);
          localStorage.setItem('token', token);
          localStorage.setItem('logueado', true);
          localStorage.setItem('user_id', decoded.user_id);
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
    $scope.CargandoOS = "Cargando.."
    $scope.UserSrv = UserSrv

    $scope.mostrarOS = function () {
      console.log('OS', $scope.obrasSociales)
      console.log('OS2', $scope.ObrasSocialesAgregar)
    }

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
      $http.post('https://guarded-oasis-37936.herokuapp.com/user', data)

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

    $scope.userPass = function (x) {
      $scope.userCambio = x;
    }

    $scope.ChangePassword = function () {
      if ($scope.nuevaContrasena != undefined && $scope.nuevaContrasena != '' && $scope.nuevaContrasena != null) {
        $http.post('https://guarded-oasis-37936.herokuapp.com/user/cambiarPassword', {
            'id': $scope.userCambio.id,
            'password': $scope.nuevaContrasena
          })

          .success(function (response) {
            UserSrv.alertOk('La contraseña fue modificada correctamente.');
          }).error(function (response) {
            $scope.errorText = response;
          })
      } else {
        $scope.nuevaContrasenaError = 'Por favor, complete el campo de contraseña.';
      }
    }

    $scope.Guardar = function () {
      $http.put('https://guarded-oasis-37936.herokuapp.com/user/' + $scope.userModificando.id, {
          'name': $scope.userModificando.name,
          'id_perfil': $scope.userModificando.id_perfil,
          'id': $scope.userModificando.id,
          'email': $scope.userModificando.email,
          'obrasSociales': $scope.ObrasSocialesAgregar.map(OS => OS.id)
        })

        .success(function (response) {
          UserSrv.alertOk('Se edito con exito.');
          $scope.modificando = false;
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
        $http.delete('https://guarded-oasis-37936.herokuapp.com/user/' + x.id)
          .success(function (response) {
            UserSrv.alertOk("Se elimino con exito.");
            $scope.traerUsuarios();
          })
      })
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

      $http.get('https://guarded-oasis-37936.herokuapp.com/user/traerElementos')

        .success(function (response) {

          $scope.usuarios = response;

          console.log(response);

        })
    }
    traerPerfiles = function () {

      $http.get('https://guarded-oasis-37936.herokuapp.com/perfil/traerElementos')

        .success(function (response) {

          $scope.perfiles = response;
          console.log(response);

        })
    }
    $scope.traerOS = function () {

      $http.get('https://guarded-oasis-37936.herokuapp.com/obraSocial/traerElementos')
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

    $scope.userName = localStorage.getItem('userName');


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


  .controller('solicitudesCrt', function (Upload, $scope, $http, $mdDialog, UserSrv, $filter, Permisos) {
    /*Esto esta copiado de la directiva del paginador */
    $scope.primeraPagina = 1 // La primera pagina de laspaginas mostradas en el footer para paginar
    $scope.ActualPage = 1 // pagina en la que estoy posicionado
    $scope.elemsPorPagina = 10
    $scope.Regex = '(?<=familiar ).*$'
    var aumentoPaginas = 5

    $scope.getApellidoFamiliar = function(sol){
      var nombreFamiliar = sol.obsFamiliar.match($scope.Regex)[0]
      var apellidoRegex = nombreFamiliar
      var Fencontrado = 'hola'
      for (i = 0; i < sol.afiliado.familiares.length; i++) {
        var match = sol.afiliado.familiares[i].nombre.match(apellidoRegex)
        if(match != null && match != undefined && match != ''){
          Fencontrado = sol.afiliado.familiares[i].apellido
        }
      }
      return Fencontrado
    }

    $scope.getDNIFamiliar = function(sol){
      var nombreFamiliar = sol.obsFamiliar.match($scope.Regex)[0]
      var apellidoRegex = nombreFamiliar
      var Fencontrado = 'hola'
      for (i = 0; i < sol.afiliado.familiares.length; i++) {
        var match = sol.afiliado.familiares[i].nombre.match(apellidoRegex)
        if(match != null && match != undefined && match != ''){
          Fencontrado = sol.afiliado.familiares[i].dni
        }
      }
      return Fencontrado
    }

    $scope.changeElemsPorPagina = function (cant) {
      elemsPorPagina = cantidad
    }
    $scope.getPaginas = function (elems) { // Devuelve un array con un numero ascendente por cada elemento de la lista, necesario cuando la lista se modifica por algun filtro
      if (elems) {
        var cantPaginas = (new Array(Math.ceil(elems.length / $scope.elemsPorPagina)).fill(0).map((x, index) => index + 1))
        return cantPaginas
      }
    }
    $scope.aumentarPagina = function (algo) { // Mueve el numero de pag mostradas en el footer para arriba una cant igual a aumentoPaginas
      if (($scope.getPaginas(algo).length - $scope.primeraPagina) > $scope.elemsPorPagina) {
        $scope.primeraPagina = $scope.primeraPagina + aumentoPaginas
      }
    }
    $scope.disminuirPagina = function () { // Mueve el numero de pag mostradas en el footer para abajo una cant igual a aumentoPaginas
      if ($scope.primeraPagina > 1)
        $scope.primeraPagina = $scope.primeraPagina - aumentoPaginas
    }
    $scope.ChangePage = function (pag) {
      $scope.ActualPage = pag;
    }
    $scope.separarPaginas = function (index) { // Pagina la tabla, dejando visibles una cant de paginas igual a elemsPorPagina
      var x1 = (index <= ($scope.ActualPage * $scope.elemsPorPagina))

      var x2 = (index >= ($scope.ActualPage - 1) * $scope.elemsPorPagina)

      return x1 && x2
    }
    $scope.getPrimeraPagina = function () {
      $scope.ActualPage = 1
      $scope.primeraPagina = 1
    }
    /*Esto esta copiado de la directiva del paginador */
    var socket = io.connect("http://node-gestionar.herokuapp.com:80");
    socket.emit('storeClientInfo', {
      customId: localStorage.getItem('user_id')
    })

    socket.on('actualizarSolicitudes', function (data) {
      $scope.traerSolicitudes()
    })


    var data = {
      'IDCLIMED': 1,
      'ESPECIALIDAD': 1,
      'DNISOLICITANTE': 3,
      'IDAFILIADO': 3,
      'MEDICO': 'asdf',
      'FECHAS': new Date(),
      'ESTADO': 'Pendiente'
    }

    $scope.solicitudesAbiertas = []
    var agregarSolicitudAbierta = function (solicitud) {
      $scope.solicitudesAbiertas.push(solicitud)
    }

    $scope.abrirFile = function() {
      console.log('me apreto');
      $('#autorizacionturnopdf').click();
      console.log($('#autorizacionturnopdf')[0])
    }

    $scope.clinicasCambioR = function () {
      $scope.cargandoClinicasCambio = true;
      $http.get('https://guarded-oasis-37936.herokuapp.com/climed/traerElementos')

        .success(function (response) {

          $scope.clinicasCambio = response;
          $scope.cargandoClinicasCambio = false;
        })
    }

    $scope.cambiandoClinica = 0;

    $scope.cambiarClinica = function (IDCLI, IDS,x) {
      $scope.cambiandoClinica = IDCLI;
      $http.post('https://guarded-oasis-37936.herokuapp.com/solicitud/actualizarClinica', {
          'id': IDS,
          'IDCLIMED': IDCLI
        })

        .success(function (response) {
          $scope.cambiandoClinica = 0;
          UserSrv.alertOk('La clínica de la solicitud fue actualizada con éxito.');
          $scope.solicitudexpandida.climed.nombre = x.nombre;
          $scope.solicitudexpandida.climed.telefono = x.telefono;
          traerSolicitudes()
        })
    }


    var crear = function () {

      $http.post('https://guarded-oasis-37936.herokuapp.com/solicitud/createClinico', data)

        .success(function (response) {
          crear()
          console.log('funciona');
        })
    }

    //crear()


    $scope.ActualPage = 1;
    $scope.idmediselected = {
      'id': undefined,
      'nombre': undefined
    }
    $scope.cantidadpaginas = [];
    $scope.Cargando = "Cargando...";
    $scope.tipos = ['Todos', 'Clinico', 'Especialista', 'Estudio'];
    $scope.estados = ['Todos', 'Pendiente', 'En Espera'];
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
      $http.get('https://guarded-oasis-37936.herokuapp.com/solicitud/solicitudesEnProceso')

        .success(function (response) {

          $scope.solicitudes = response;
          $scope.solicitudesNoFiltradas = response;
          $scope.paginar();
          $scope.Cargando = "";
          console.log(response);
        })
    }

    $scope.traerSolicitudes = function () {
      $http.get('https://guarded-oasis-37936.herokuapp.com/solicitud/solicitudesEnProceso')

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

    $http.get('https://guarded-oasis-37936.herokuapp.com/climed/traerElementos')

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
        $http.post('https://guarded-oasis-37936.herokuapp.com/solicitud/rechazar', {
            'id': id,
            'MOTIVO': motivo
          })

          .success(function (response) {


            var data2 = {
            'idnotif': $scope.solicitudexpandida.afiliado.idnotif
            }
            $http.post('/sendNotiffRechazo.php', data2)
              .success(function (response) {
                $scope.enviandoturno = false;
                $mdDialog.hide()
                UserSrv.alertOk('La solicitud fue rechazada con exito.');
                traerSolicitudes()
              })
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

    $scope.uploadPic = function(){
      if($scope.solicitudexpandida.tipo != 1){
        var file = $('#autorizacionturnopdf')[0].files[0]
        var d = new Date();
        tiempo = d.getTime();
        var filename = tiempo.toString() + 'autorizacionSol' + $scope.solicitudexpandida.id + '.pdf';
        console.log('comienza a cargar la foto');
        var filerenamed = Upload.rename(file, filename);
        $scope.filerenamedGlobal = filerenamed
        $scope.datasa.FILEAUTORIZACION = filerenamed.ngfName
        console.log($scope.datasa)
        file.upload = Upload.upload({
          url: 'http://www.gestionarturnos.com/uploadAutorizacion.php',
          data: {
            file: filerenamed
          },
        });
        
        file.upload.then(function (response) {
          $http.post('https://guarded-oasis-37936.herokuapp.com/turno', $scope.datasa)
            .success(function (response) {
              var data2 = {
                'idnotif': $scope.solicitudexpandida.afiliado.idnotif
              }
              $http.post('/sendNotiff.php', data2)
                .success(function (response) {
                  $scope.enviandoturno = false;
                  UserSrv.alertOk('El turno fue enviado con exito.');
                  $scope.consultasolicitud($scope.solicitudexpandida.id);
                  traerSolicitudes()
                })
            })
        }, function (response) {
          UserSrv.alertError('Hubo un error al asignar la solicitud. Intente nuevamente.');
        });
      }else{
        $http.post('https://guarded-oasis-37936.herokuapp.com/turno', $scope.datasa)
            .success(function (response) {
              var data2 = {
                'idnotif': $scope.solicitudexpandida.afiliado.idnotif
              }
              $http.post('/sendNotiff.php', data2)
                .success(function (response) {
                  $scope.enviandoturno = false;
                  UserSrv.alertOk('El turno fue enviado con exito.');
                  $scope.consultasolicitud($scope.solicitudexpandida.id);
                  traerSolicitudes()
                })
            })
      }
    }

    $scope.EnviarTurno = function (fecha, hora, medico, obsturno, autorizacionturnopdf) {
      $scope.fecha = moment(fecha).format('YYYY-MM-DD');
      $scope.hora = moment(hora).format('HH:mm:ss');
      $scope.enviandoturno = true;

      $scope.datasa = {
        'IDSOLICITUD': $scope.solicitudexpandida.id,
        'MEDICOASIGNADO': medico,
        'FECHAT': $scope.fecha,
        'HORAT': $scope.hora,
        'CONFIRMACION': 0,
        'OBS': obsturno,
        'FILEAUTORIZACION': $scope.filerenamedGlobal
      }
      
      $scope.uploadPic()
          
    }

    $scope.asignarseSolicitud = function (solicitud) {
      $http.post('https://guarded-oasis-37936.herokuapp.com/solicitud/abrir', {
          'id': solicitud.id
        })
        .success(function (response) {
          agregarSolicitudAbierta(solicitud)
        })
        .error(function (response) {
          UserSrv.alertError('Hubo un error al asignar la solicitud. Intente nuevamente.');
        })
    }

    $scope.consultasolicitud = function (id) {
      $http.get('https://guarded-oasis-37936.herokuapp.com/solicitud/' + id)

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
      $scope.asignarseSolicitud(solicitud)
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
    $scope.Regex = '(?<=familiar ).*$'
    $scope.getApellidoFamiliar = function(sol){
      var nombreFamiliar = sol.obsFamiliar.match($scope.Regex)[0]
      var apellidoRegex = nombreFamiliar
      var Fencontrado = 'hola'
      for (i = 0; i < sol.afiliado.familiares.length; i++) {
        var match = sol.afiliado.familiares[i].nombre.match(apellidoRegex)
        if(match != null && match != undefined && match != ''){
          Fencontrado = sol.afiliado.familiares[i].apellido
        }
      }
      return Fencontrado
    }

    $scope.getNafiliadoFamiliar = function(sol){
      var nombreFamiliar = sol.obsFamiliar.match($scope.Regex)[0]
      var apellidoRegex = nombreFamiliar
      var Fencontrado = 'hola'
      for (i = 0; i < sol.afiliado.familiares.length; i++) {
        var match = sol.afiliado.familiares[i].nombre.match(apellidoRegex)
        if(match != null && match != undefined && match != ''){
          Fencontrado = sol.afiliado.familiares[i].nafiliado
        }
      }
      return Fencontrado
    }
    /*$http.post(UserSrv.GetPath(), {
        'seccion': 'solicitudes',
        'accion': 'listar',
        'id': '',
        'dni': ''
      })*/

    var socket = io.connect('http://node-gestionar.herokuapp.com:80');
    socket.emit('storeClientInfo', {
      customId: localStorage.getItem('user_id')
    })

    socket.on('actualizarSolicitudes', function (data) {
      $scope.traerSolicitudes()
    })

    $scope.filtroClimed = function (solicitud) {
      if ($scope.searchClimed == undefined) {
        return true
      }
      if (solicitud.climed == null || solicitud.climed.nombre.indexOf($scope.searchClimed) > -1) {
        return true
      } else {
        return false
      }
    }

    $scope.Autorizar = function (id) {
      if ($scope.especialidadesAgregar.length > 0) { // Osea que es una solicitud de estudio
        var data = {
          'id': id,
          'ESPECIALIDAD': $scope.especialidadesAgregar[0].id,
          'IDCLIMED': $scope.clinicasAgregar[0].id
        }
        $http.post('https://guarded-oasis-37936.herokuapp.com/auditoria/autorizarEstudio', data)
          .success(function (response) {
            $http.post('https://guarded-oasis-37936.herokuapp.com/solicitud/autorizar', {
                'id': id
              })
              .success(function (response) {
                console.log(response);
                UserSrv.alertOk('La solicitud fue validada con exito.');
                traerSolicitudes()
                $scope.ObtenerHistorial();
                $('#auditar').modal('hide');
              }).error(function (response) {
                $('#auditar').modal('hide');
                UserSrv.alertError('Hubo un error en la validacion de la solicitud. Intente nuevamente.');
              })
          }).error(function (response) {
            $('#auditar').modal('hide');
            UserSrv.alertError('Hubo un error en la asignacion de la solicitud. Intente nuevamente.');
          })

      } else {
        $http.post('https://guarded-oasis-37936.herokuapp.com/solicitud/autorizar', {
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
      'afiliado': {
        'nombre': undefined
      },
      'fecha': undefined
    }

    $scope.yer = function (x) {
      $scope.yero = x;
    }
    $scope.formatDate = function (date) {

      var b = moment(date).format('YYYY-MM-DD');
      $scope.filtro.fecha = b

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
        $http.post('https://guarded-oasis-37936.herokuapp.com/solicitud/rechazar', {
            'id': id.id,
            'MOTIVO': motivo
          })

          .success(function (response) {
            $mdDialog.hide()
            UserSrv.alertOk('La solicitud fue rechazada con exito.');
            traerSolicitudes()
            $scope.ObtenerHistorial();
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
      $http.get('https://guarded-oasis-37936.herokuapp.com/solicitud/solicitudesParaAuditar')

        .success(function (response) {

          $scope.solicitudes = response;
          $scope.paginar();
          $scope.Cargando = "";
          console.log(response);
        })
    }

    $scope.VerFoto = function (x) {
      $scope.fotoAutorizacion = "http://www.gestionarturnos.com/certificados/" + x;
    }

    $scope.ObtenerHistorial = function () {
      $http.get('https://guarded-oasis-37936.herokuapp.com/solicitud/historialAuditoria')

        .success(function (response) {

          $scope.historial = response;
          $scope.paginar();
          $scope.Cargando = "";
          console.log(response);
        })
    }

    $scope.traerSolicitudes = function () {
      $http.get('https://guarded-oasis-37936.herokuapp.com/solicitud/solicitudesParaAuditar')

        .success(function (response) {

          $scope.solicitudes = response;
          $scope.paginar();
          $scope.Cargando = "";
          console.log(response);
        })
    }

    var traerEspecialidades = function () {
      $http.get('https://guarded-oasis-37936.herokuapp.com/especialidad/traerElementos')
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
      $http.get('https://guarded-oasis-37936.herokuapp.com/climed/traerElementos')
        .success(function (response) {
          $scope.Clinicas = response;
        })
    }
    $scope.quitarClinicas = function (clinica) {
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
      $scope.especialidadesAgregar = []
      $scope.clinicasAgregar = []
      $scope.y = x;
      console.log($scope.y);
      /*$http.post('https://guarded-oasis-37936.herokuapp.com/auditoria/abrir', {
        'id': idSolicitud
      })

        .error(function (response) {
          UserSrv.alertError('Hubo un error al asignar la solicitud. Intente nuevamente.');
        })*/
    }

    $scope.limpiarFiltros = function () {
      $scope.filtro = {
        'afiliado': {
          'nombre': undefined
        },
        'fecha': undefined
      }
      $scope.searchClimed = ''
    }

  })






























//╭╮ ╭╮   ╭╮         ╭╮ ╭━━━╮    ╭╮╭╮
//┃┃ ┃┃  ╭╯╰╮        ┃┃ ┃╭━╮┃    ┃┣╯╰╮
//┃╰━╯┣┳━┻╮╭╋━━┳━┳┳━━┫┃ ┃┃ ┃┣╮╭┳━╯┣╮╭╋━━┳━┳┳━━╮
//┃╭━╮┣┫━━┫┃┃╭╮┃╭╋┫╭╮┃┃ ┃╰━╯┃┃┃┃╭╮┣┫┃┃╭╮┃╭╋┫╭╮┃
//┃┃ ┃┃┣━━┃╰┫╰╯┃┃┃┃╭╮┃╰╮┃╭━╮┃╰╯┃╰╯┃┃╰┫╰╯┃┃┃┃╭╮┃
//╰╯ ╰┻┻━━┻━┻━━┻╯╰┻╯╰┻━╯╰╯ ╰┻━━┻━━┻┻━┻━━┻╯╰┻╯╰╯



  .controller('historialAuditoriaCrt', function ($scope, $http, $mdDialog, UserSrv, $filter, Permisos) {

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

    var socket = io.connect('http://node-gestionar.herokuapp.com:80');
    socket.emit('storeClientInfo', {
      customId: localStorage.getItem('user_id')
    })

    socket.on('actualizarSolicitudes', function (data) {
      $scope.traerSolicitudes()
    })

    $scope.Regex = '(?<=familiar ).*$'
    $scope.getApellidoFamiliar = function(sol){
      var nombreFamiliar = sol.obsFamiliar.match($scope.Regex)[0]
      var apellidoRegex = nombreFamiliar
      var Fencontrado = 'hola'
      for (i = 0; i < sol.afiliado.familiares.length; i++) {
        var match = sol.afiliado.familiares[i].nombre.match(apellidoRegex)
        if(match != null && match != undefined && match != ''){
          Fencontrado = sol.afiliado.familiares[i].apellido
        }
      }
      return Fencontrado
    }

    $scope.getNafiliadoFamiliar = function(sol){
      var nombreFamiliar = sol.obsFamiliar.match($scope.Regex)[0]
      var apellidoRegex = nombreFamiliar
      var Fencontrado = 'hola'
      for (i = 0; i < sol.afiliado.familiares.length; i++) {
        var match = sol.afiliado.familiares[i].nombre.match(apellidoRegex)
        if(match != null && match != undefined && match != ''){
          Fencontrado = sol.afiliado.familiares[i].nafiliado
        }
      }
      return Fencontrado
    }

    $scope.filtroClimed = function (solicitud) {
      if ($scope.searchClimed == undefined) {
        return true
      }
      if (solicitud.climed == null || solicitud.climed.nombre.indexOf($scope.searchClimed) > -1) {
        return true
      } else {
        return false
      }
    }

    $scope.getPaginas = function (elems) { // Devuelve un array con un numero ascendente por cada elemento de la lista, necesario cuando la lista se modifica por algun filtro
      if (elems) {
        var cantPaginas = (new Array(Math.ceil(elems.length / $scope.elemsPorPagina)).fill(0).map((x, index) => index + 1))
        return cantPaginas
      }
    }

    $scope.separarPaginas = function (index) { // Pagina la tabla, dejando visibles una cant de paginas igual a elemsPorPagina
      var x1 = (index <= ($scope.ActualPage * $scope.elemsPorPagina))

      var x2 = (index >= ($scope.ActualPage - 1) * $scope.elemsPorPagina)

      return x1 && x2
    }

    $scope.Autorizar = function (id) {
      if ($scope.especialidadesAgregar.length > 0) { // Osea que es una solicitud de estudio
        var data = {
          'id': id,
          'ESPECIALIDAD': $scope.especialidadesAgregar[0].id,
          'IDCLIMED': $scope.clinicasAgregar[0].id
        }
        $http.post('https://guarded-oasis-37936.herokuapp.com/auditoria/autorizarEstudio', data)
          .success(function (response) {
            $http.post('https://guarded-oasis-37936.herokuapp.com/solicitud/autorizar', {
                'id': id
              })
              .success(function (response) {
                console.log(response);
                UserSrv.alertOk('La solicitud fue validada con exito.');
                $scope.ObtenerHistorial();
                $('#auditar').modal('hide');
              }).error(function (response) {
                $('#auditar').modal('hide');
                UserSrv.alertError('Hubo un error en la validacion de la solicitud. Intente nuevamente.');
              })
          }).error(function (response) {
            $('#auditar').modal('hide');
            UserSrv.alertError('Hubo un error en la asignacion de la solicitud. Intente nuevamente.');
          })

      } else {
        $http.post('https://guarded-oasis-37936.herokuapp.com/solicitud/autorizar', {
            'id': id
          })
          .success(function (response) {
            console.log(response);
            UserSrv.alertOk('La solicitud fue validada con exito.');
            $('#auditar').modal('hide');
          }).error(function (response) {
            $('#auditar').modal('hide');
            UserSrv.alertError('Hubo un error en la validacion de la solicitud. Intente nuevamente.');
          })
      }
    }
    $scope.filtro = {
      'afiliado': {
        'nombre': undefined
      },
      'fecha': undefined
    }

    $scope.yer = function (x) {
      $scope.yero = x;
    }
    $scope.formatDate = function (date) {

      var b = moment(date).format('YYYY-MM-DD');
      $scope.filtro.fecha = b

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
        $http.post('https://guarded-oasis-37936.herokuapp.com/solicitud/rechazar', {
            'id': id.id,
            'MOTIVO': motivo
          })

          .success(function (response) {
            $mdDialog.hide()
            UserSrv.alertOk('La solicitud fue rechazada con exito.');
            $scope.ObtenerHistorial();
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

    $scope.VerFoto = function (x) {
      $scope.fotoAutorizacion = "http://www.gestionarturnos.com/certificados/" + x;
    }

    $scope.ObtenerHistorial = function () {
      $http.get('https://guarded-oasis-37936.herokuapp.com/solicitud/historialAuditoria')

        .success(function (response) {

          $scope.historial = response;
          $scope.paginar();
          $scope.Cargando = "";
          console.log(response);
        })
    }

    var traerEspecialidades = function () {
      $http.get('https://guarded-oasis-37936.herokuapp.com/especialidad/traerElementos')
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
      $http.get('https://guarded-oasis-37936.herokuapp.com/climed/traerElementos')
        .success(function (response) {
          $scope.Clinicas = response;
        })
    }
    $scope.quitarClinicas = function (clinica) {
      $scope.clinicasAgregar = []
    }
    $scope.clinicasAgregar = []
    $scope.agregarClinica = function (clinica) {
      $scope.clinicasAgregar.push(clinica)
      $('#Climed').modal('hide');
    }

    $scope.ObtenerHistorial()
    traerClinicas()
    traerEspecialidades()

    $scope.Detallar = function (id) {
      $("#tr" + id).slideToggle();
    }

    $scope.paginar = function () {
      var i = 0;
      $scope.cantidadpaginas = [];
      for (i = 0; i < (Object.keys($scope.historial).length / $scope.filtronumeritos); i++) {
        $scope.cantidadpaginas[i] = i + 1;
      }
    }

    $scope.Auditar = function (x) {
      $scope.especialidadesAgregar = []
      $scope.clinicasAgregar = []
      $scope.y = x;
      console.log($scope.y);
      /*$http.post('https://guarded-oasis-37936.herokuapp.com/auditoria/abrir', {
        'id': idSolicitud
      })

        .error(function (response) {
          UserSrv.alertError('Hubo un error al asignar la solicitud. Intente nuevamente.');
        })*/
    }

    $scope.limpiarFiltros = function () {
      $scope.filtro = {
        'afiliado': {
          'nombre': undefined
        },
        'fecha': undefined
      }
      $scope.searchClimed = ''
    }

  })











































  .controller('historialCompletoCrt', function ($scope, $http, $mdDialog, UserSrv, $filter, Permisos) {

    $scope.primeraPagina = 1 // La primera pagina de laspaginas mostradas en el footer para paginar
    $scope.ActualPage = 1 // pagina en la que estoy posicionado
    $scope.elemsPorPagina = 10
    var aumentoPaginas = 5
    $scope.Regex = '(?<=familiar ).*$'
    $scope.getApellidoFamiliar = function(sol){
      var nombreFamiliar = sol.obsFamiliar.match($scope.Regex)[0]
      var apellidoRegex = nombreFamiliar
      var Fencontrado = 'hola'
      for (i = 0; i < sol.afiliado.familiares.length; i++) {
        var match = sol.afiliado.familiares[i].nombre.match(apellidoRegex)
        if(match != null && match != undefined && match != ''){
          Fencontrado = sol.afiliado.familiares[i].apellido
        }
      }
      return Fencontrado
    }

    $scope.getDNIFamiliar = function(sol){
      var nombreFamiliar = sol.obsFamiliar.match($scope.Regex)[0]
      var apellidoRegex = nombreFamiliar
      var Fencontrado = 'hola'
      for (i = 0; i < sol.afiliado.familiares.length; i++) {
        var match = sol.afiliado.familiares[i].nombre.match(apellidoRegex)
        if(match != null && match != undefined && match != ''){
          Fencontrado = sol.afiliado.familiares[i].dni
        }
      }
      return Fencontrado
    }

    $scope.changeElemsPorPagina = function (cant) {
      elemsPorPagina = cantidad
    }
    $scope.getPaginas = function (elems) { // Devuelve un array con un numero ascendente por cada elemento de la lista, necesario cuando la lista se modifica por algun filtro
      if (elems) {
        var cantPaginas = (new Array(Math.ceil(elems.length / $scope.elemsPorPagina)).fill(0).map((x, index) => index + 1))
        return cantPaginas
      }
    }
    $scope.aumentarPagina = function (algo) { // Mueve el numero de pag mostradas en el footer para arriba una cant igual a aumentoPaginas
      if (($scope.getPaginas(algo).length - $scope.primeraPagina) > $scope.elemsPorPagina) {
        $scope.primeraPagina = $scope.primeraPagina + aumentoPaginas
      }
    }
    $scope.disminuirPagina = function () { // Mueve el numero de pag mostradas en el footer para abajo una cant igual a aumentoPaginas
      if ($scope.primeraPagina > 1)
        $scope.primeraPagina = $scope.primeraPagina - aumentoPaginas
    }
    $scope.ChangePage = function (pag) {
      $scope.ActualPage = pag;
    }
    $scope.separarPaginas = function (index) { // Pagina la tabla, dejando visibles una cant de paginas igual a elemsPorPagina
      var x1 = (index <= ($scope.ActualPage * $scope.elemsPorPagina))

      var x2 = (index >= ($scope.ActualPage - 1) * $scope.elemsPorPagina)

      return x1 && x2
    }

    $scope.getPrimeraPagina = function () {
      $scope.ActualPage = 1
      $scope.primeraPagina = 1
    }

    var data = {
      'IDCLIMED': 1,
      'ESPECIALIDAD': 1,
      'DNISOLICITANTE': 3,
      'IDAFILIADO': 3,
      'MEDICO': 'asdf',
      'FECHAS': new Date(),
      'ESTADO': 'Pendiente'
    }

    $scope.solicitudesAbiertas = []
    var agregarSolicitudAbierta = function (solicitud) {
      $scope.solicitudesAbiertas.push(solicitud)
    }

    $scope.cambiandoClinica = 0;

    $scope.ActualPage = 1;
    $scope.idmediselected = {
      'id': undefined,
      'nombre': undefined
    }
    $scope.cantidadpaginas = [];
    $scope.Cargando = "Cargando...";
    $scope.tipos = ['Todos', 'Acceso Directo', 'Autorizacion'];
    $scope.estados = ['Todos', 'Confirmado', 'Rechazado'];
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
      $http.get('https://guarded-oasis-37936.herokuapp.com/solicitud/historialCompleto')

        .success(function (response) {

          $scope.solicitudes = response;
          $scope.solicitudesNoFiltradas = response;
          $scope.paginar();
          $scope.Cargando = "";
          console.log(response);
        })
    }

    $scope.traerSolicitudes = function () {
      $http.get('https://guarded-oasis-37936.herokuapp.com/solicitud/historialCompleto')

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

    $http.get('https://guarded-oasis-37936.herokuapp.com/climed/traerElementos')

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
        case 'Acceso Directo':
          return 1;
        case 'Autorizacion':
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

    $scope.EnviarTurno = function (fecha, hora, medico, obsturno) {

      $scope.fecha = moment(fecha).format('YYYY-MM-DD');
      $scope.hora = moment(hora).format('HH:mm:ss');
      $scope.enviandoturno = true;

      var data = {
        'IDSOLICITUD': $scope.solicitudexpandida.id,
        'MEDICOASIGNADO': medico,
        'FECHAT': $scope.fecha,
        'HORAT': $scope.hora,
        'CONFIRMACION': 0,
        'OBS': obsturno
      }
      $http.post('https://guarded-oasis-37936.herokuapp.com/turno', data)

        .success(function (response) {
          var data2 = {
            'idnotif': $scope.solicitudexpandida.afiliado.idnotif
          }
            $http.post('/sendNotiff.php', data2)
              .success(function (response) {
                $scope.enviandoturno = false;
                UserSrv.alertOk('El turno fue enviado con exito.');
                $scope.consultasolicitud($scope.solicitudexpandida.id);
                traerSolicitudes()
              })
        })

    }

    $scope.consultasolicitud = function (id) {
      $http.get('https://guarded-oasis-37936.herokuapp.com/solicitud/' + id)

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


  .controller('afiliadosCrt', function ($scope, $timeout, $http, $mdDialog, UserSrv, Permisos, CargarDatos, $rootScope) {
    $scope.errorText
    $scope.CargandoOS = "Cargando.."
    $scope.PS = Permisos;
    $scope.familiares = []
    var indexFamiliar = 0
    $scope.tieneConyugue = false

    $scope.agregarFamiliar = function () {
      indexFamiliar += 1
      var unFamiliar = {
        'nombre': null,
        'apellido': null,
        'nacimiento': null,
        'cuil': null,
        'dni': null,
        'nafiliado': null,
        'numero': indexFamiliar
      }
      $scope.familiares.push(unFamiliar)
    }

    $scope.agregarFamiliarModificando = function () {
      indexFamiliar += 1
      var unFamiliar = {
        'nombre': null,
        'apellido': null,
        'nacimiento': null,
        'cuil': null,
        'dni': null,
        'nafiliado': null,
        'numero': indexFamiliar
      }
      $scope.afiliadoModificando.familiares.push(unFamiliar)
    }

    $scope.eliminarFamiliar = function (index) {
      var familiaresTemporal = $scope.familiares
      familiaresTemporal.splice(index, 1) //Parece una pelotudes esto pero sino el ng-repeat no actualiza
      $scope.familiares = familiaresTemporal
      $timeout();

    }

    var getIndexConyugue = function () {
      var conyugue = $scope.familiares.filter(familiar => familiar.relacion == 'Conyugue')
      if (conyugue.length == 0) {
        return $scope.familiares.length
      }
      return $scope.familiares.indexOf(conyugue[0])
    }

    $scope.obtenerNroAfiliado = function (familiar, indice) {
      if (familiar.relacion == undefined) return null
      if (familiar.relacion == 'Conyugue') {
        familiar.nafiliado = $scope.dni.toString() + '/c1';
        //$scope.$apply();
      } else {
        if (indice < getIndexConyugue()) {
          familiar.nafiliado = $scope.dni.toString() + '/h' + (indice + 1);
          // $scope.$apply();
        } else {
          familiar.nafiliado = $scope.dni.toString() + '/h' + indice;
          //$scope.$apply();
        }
      }
    }

    $scope.obtenerNroAfiliadoModif = function (familiar, indice) {
      if (familiar.relacion == undefined) return null
      if (familiar.relacion == 'Conyugue') {
        familiar.nafiliado = $scope.afiliadoModificando.dni.toString() + '/c1';
        //$scope.$apply();
      } else {
        if (indice < getIndexConyugue()) {
          familiar.nafiliado = $scope.afiliadoModificando.dni.toString() + '/h' + (indice + 1);
          // $scope.$apply();
        } else {
          familiar.nafiliado = $scope.afiliadoModificando.dni.toString() + '/h' + indice;
          //$scope.$apply();
        }
      }
    }

    //CargarDatos.CargarAfiliados()
    $http.get('https://guarded-oasis-37936.herokuapp.com/obraSocial/traerElementos')
      .success(function (response) {
        $scope.obrasSociales = response;
        $scope.CargandoOS = "Seleccione..";
        console.log(response);
      })

    $scope.ObtenerAfiliados = function () {
      $scope.Cargando = "Cargando...";
      $http.get('https://guarded-oasis-37936.herokuapp.com/afiliado/traerElementos')

        .success(function (response) {
          $scope.afiliados = response;
          console.log($scope.afiliados);
          $scope.Cargando = "";
        })

    }


    $scope.Editar = function (x) {
      var mapear = function ({
        nombre,
        apellido,
        nacimiento,
        cuil,
        dni,
        nafiliado
      }) {
        var nacimiento = new Date(nacimiento)
        if (nafiliado[nafiliado.length - 2] == 'h') {
          var relacion = 'Hijo'
        } else {
          var relacion = 'Conyugue'
        }
        return {
          nombre,
          apellido,
          nacimiento,
          cuil,
          dni,
          nafiliado,
          relacion
        }
      }
      console.log(x.obra_social);
      //x.nacimiento = moment(x.nacimiento).format('YYYY-MM-DD');
      x.nacimiento = new Date(x.nacimiento);
      $scope.afiliadoModificando = x;
      $scope.familiares = $scope.afiliadoModificando.familiares.map(mapear)
      $scope.nafiliado = $scope.afiliadoModificando.nafiliado
      console.log($scope.afiliadoModificando);
      $scope.modificando = true;
    }

    $scope.Guardar = function () {
      var data = {
        'ID': $scope.afiliadoModificando.id,
        'NACIMIENTO': moment($scope.afiliadoModificando.nacimiento).format('YYYY-MM-DD'),
        'NOMBRE': $scope.afiliadoModificando.nombre,
        'APELLIDO': $scope.afiliadoModificando.apellido,
        'DIRECCION': $scope.afiliadoModificando.direccion,
        'CUIL': $scope.afiliadoModificando.cuil,
        'EMAIL': $scope.afiliadoModificando.email,
        'DNI': $scope.afiliadoModificando.dni,
        'PISO': $scope.afiliadoModificando.piso,
        'LOCALIDAD': $scope.afiliadoModificando.localidad,
        'CP': $scope.afiliadoModificando.codigo_postal,
        'DEPARTAMENTO': $scope.afiliadoModificando.departamento,
        'TELEFONO': $scope.afiliadoModificando.telefono,
        'CELULAR': $scope.afiliadoModificando.celular,
        'IDOBRASOCIAL': $scope.afiliadoModificando.obra_social.id,
        'NAFILIADO': $scope.afiliadoModificando.nafiliado,
        'GRUPOF': null,
        'PLAN': $scope.afiliadoModificando.plan,
        'familiares': $scope.familiares.map(familiar => ({
          'nombre': familiar.nombre,
          'apellido': familiar.apellido,
          'nacimiento': moment(familiar.nacimiento).format('YYYY-MM-DD'),
          'cuil': familiar.cuil,
          'dni': familiar.dni,
          'nafiliado': familiar.nafiliado
        }))
      }
      $http.put('https://guarded-oasis-37936.herokuapp.com/afiliado/' + $scope.afiliadoModificando.id, data)

        .success(function (response) {

          UserSrv.alertOk('Se edito con exito.');
          $scope.afiliadoModificando.familiares = $scope.familiares
          limpiarErrores();
          $scope.modificando = false
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
        $http.delete('https://guarded-oasis-37936.herokuapp.com/afiliado/' + x.id)
          .success(function (response) {
            UserSrv.alertOk("Se elimino con exito.");
            $scope.ObtenerAfiliados();
          })
      }, function () {
        $scope.status = 'You decided to keep your debt.';
      });
    }

    $scope.Alta = function () {

      $scope.sortType = 'nombre'; // el default
      $scope.sortReverse = false;

      var nacimiento = $scope.nacimiento;
      nacimiento = moment(nacimiento).format('YYYY-MM-DD');
      var mapear = function ({
        nombre,
        apellido,
        nacimiento,
        cuil,
        dni,
        nafiliado,
        numero
      }) {
        var nacimiento = moment(nacimiento).format('YYYY-MM-DD')
        return {
          nombre,
          apellido,
          nacimiento,
          cuil,
          dni,
          nafiliado
        }
      }
      var data = {
        'NACIMIENTO': nacimiento,
        'NOMBRE': $scope.nombre,
        'APELLIDO': $scope.apellido,
        'DIRECCION': $scope.domicilio,
        'CUIL': $scope.cuil,
        'LOCALIDAD': $scope.localidad,
        'CP': $scope.codigo_postal,
        'EMAIL': $scope.email,
        'DNI': $scope.dni,
        'PISO': $scope.piso,
        'DEPARTAMENTO': $scope.departamento,
        'TELEFONO': $scope.telefono,
        'CELULAR': $scope.celular,
        'IDOBRASOCIAL': $scope.obrasocial,
        'NAFILIADO': $scope.nafiliado,
        'GRUPOF': null,
        'PLAN': $scope.plan,
        'familiares': $scope.familiares.map(familiar => mapear(familiar))
      }
      $http.post('https://guarded-oasis-37936.herokuapp.com/afiliado', data)

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
      $scope.familiares = []
      indexFamiliar = 0
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
    $http.get('https://guarded-oasis-37936.herokuapp.com/obraSocial/traerElementos')
      .success(function (response) {
        $scope.obrasSociales = response;
        $scope.CargandoOS = "Seleccione..";
        console.log(response);
      })
    $http.get('https://guarded-oasis-37936.herokuapp.com/especialidad/traerElementos')
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
      $http.put('https://guarded-oasis-37936.herokuapp.com/climed/' + $scope.clinicaModificando.id, {
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
        $http.delete('https://guarded-oasis-37936.herokuapp.com/climed/' + x.id)

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
      $http.post('https://guarded-oasis-37936.herokuapp.com/climed', data)

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
      $http.get('https://guarded-oasis-37936.herokuapp.com/climed/traerElementos')

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

  .controller('medicosCrt', function ($scope, UserSrv, $http, $timeout, $mdDialog, Permisos, CargarDatos) {
    $scope.altaMapaInicializador = 0;
    $scope.esconderMapa = true;
    $scope.esconderMapaModificar = true;
    $scope.lat = '';
    $scope.lng = '';
    $scope.modificarlng = '';
    $scope.modificarlat = '';
    $scope.primeraosegunda = 1;
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
    $scope.UserSrv = UserSrv

    //CargarDatos.CargarMedicos()

    $http.get('https://guarded-oasis-37936.herokuapp.com/obraSocial/traerElementos')
      .success(function (response) {
        $scope.obrasSociales = response;
        $scope.CargandoOS = "Seleccione..";
        console.log(response);
      })
    $http.get('https://guarded-oasis-37936.herokuapp.com/especialidad/traerElementos')
      .success(function (response) {
        $scope.Especialidades = response;
      })



    $scope.Mapa = function () {
      $scope.esconderMapa = false;
      $scope.altaMapaInicializador++;
      initMap($scope.altaMapaInicializador);
    }

    $scope.mapaModificar = function () {
      $scope.initMapModificar($scope.primeraosegunda, $scope.medicoModif.latitud, $scope.medicoModif.longitud);
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

    $scope.ObtenerMedicos = function () {
      $scope.Cargando = "Cargando...";
      $http.get('https://guarded-oasis-37936.herokuapp.com/climed/traerElementos')

        .success(function (response) {
          $scope.medicos = response
          console.log($scope.medicos);
          $scope.Cargando = "";
        })

    }

    $scope.Editar = function (x) {
      $scope.medicoModif = x;
      $scope.modificando = true;
      $scope.ObrasSocialesAgregarMod = x.obrasSociales;
      $scope.especialidadesAgregarMod = x.especialidades;
      $scope.initMapModificar($scope.primeraosegunda, $scope.medicoModif.latitud, $scope.medicoModif.longitud);
    }

    $scope.cerrarEditar = function () {
      afiliadoModificando = undefined;
      $scope.esconderMapaModificar = true;
      $scope.modificando = false;
      $scope.ObtenerMedicos();
      // limpiarcampos();
    }

    $scope.Guardar = function () {
      console.log($scope.modificarlat);
      console.log($scope.modificarlng);
      $http.put('https://guarded-oasis-37936.herokuapp.com/climed/' + $scope.medicoModif.id, {
          'NOMBRE': $scope.medicoModif.nombre,
          'DIRECCION': $scope.medicoModif.domicilio,
          'LOCALIDAD': $scope.medicoModif.localidad,
          'ZONA': $scope.medicoModif.zona,
          'PARTICULAR': $scope.medicoModif.particular,
          'latitude': $scope.modificarlat == '' ? $scope.medicoModif.latitud : $scope.modificarlat,
          'longitude': $scope.modificarlng == '' ? $scope.medicoModif.longitud : $scope.modificarlng,
          'TELEFONO': $scope.medicoModif.telefono,
          'obrasSociales': $scope.ObrasSocialesAgregarMod.map(OS => OS.id),
          'especialidades': $scope.medicoModif.especialidades.map(Esp => Esp.id)
        })

        .success(function (response) {
          UserSrv.alertOk("La clinica o particular fue editado con exito.");
          $scope.ObtenerMedicos();
          $scope.cerrarEditar();
          limpiarcampos();
        }).error(function (response) {
          $scope.errorText = response;
          $scope.errorMsj = "*Revise los datos e intente nuevamente";
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
        $http.delete('https://guarded-oasis-37936.herokuapp.com/climed/' + x.id)
          .success(function (response) {
            UserSrv.alertOk("Se elimino con exito.");
            $scope.ObtenerMedicos();
          })
          .error(function (response) {
            UserSrv.alertError("Hubo un error al eliminar.");
          })
      })
    }

    $scope.alerta = function () {
      UserSrv.alertOk('La accion ha sido realizada con exito')
    }
    $scope.Alta = function () {
      console.log($scope.lat);
      console.log($scope.lng)
      var data = {
        'NOMBRE': $scope.medicoAlta.nombre,
        'DIRECCION': $scope.medicoAlta.direccion,
        'LOCALIDAD': $scope.medicoAlta.localidad,
        'TELEFONO': $scope.medicoAlta.telefono,
        'ZONA': $scope.medicoAlta.zona,
        'latitude': $scope.altalat,
        'longitude': $scope.altalng,
        'especialidades': $scope.especialidadesEnvio,
        'obrasSociales': $scope.OSEnvio,
        'PARTICULAR': $scope.medicoAlta.particular
      }
      $http.post('https://guarded-oasis-37936.herokuapp.com/climed', data)

        .success(function (response) {
          limpiarcampos();
          UserSrv.alertOk('La clinica o partucular fue dada de alta correctamente');
          //UserSrv.alertOk('El medico se dio de alta correctamente');
        }).error(function (response) {
          $scope.errorText = response;
          $scope.errorMsj = "*Revise los datos e intente nuevamente";
        })
    }

    $scope.changeFormat = function (particular) {
      if (particular == 1)
        return 'Si'
      return 'No'
    }

    $scope.medicoModif = {
      'nombre': '',
      'direccion': '',
      'localidad': '',
      'telefono': '',
      'zona': ''
    }
    $scope.medicoAlta = {
      'nombre': '',
      'direccion': '',
      'localidad': '',
      'telefono': '',
      'zona': ''
    }
    limpiarcampos = function () {
      $scope.errorText = '';
      $scope.errorMsj = '';
      $scope.esconderMapa = true;
      $scope.esconderMapaModificar = true;
      $scope.medicoAlta.nombre = '';
      $scope.medicoAlta.direccion = '';
      $scope.medicoAlta.localidad = '';
      $scope.medicoAlta.telefono = '';
      $scope.medicoAlta.zona = '';
      $scope.ObrasSocialesAgregar = [];
      $scope.especialidadesAgregar = [];
      $scope.OSEnvio = [];
      $scope.especialidadesEnvio = [];
      $scope.especialidadesAgregarMod = [];
      $scope.especialidadesEnvioMod = [];

    }


    $scope.initMapModificar = function (j, latitude, longitude) {
      console.log(j);
      if (j == 1) {
        $scope.primeraosegunda = 2;
        document.getElementById('modificarmapa').style.display = "block";
        latitud = parseFloat(latitude);
        longitud = parseFloat(longitude);

        var myLatLng = {
          lat: latitud,
          lng: longitud
        };

        $scope.mapModif = new google.maps.Map(document.getElementById('modificarmap'), {
          center: myLatLng,
          zoom: 13
        });

        var ubicacionInicialMarker = new google.maps.Marker({
          map: $scope.mapModif,
          position: myLatLng,
          title: 'Clinica'
        });

        var input = /** @type {!HTMLInputElement} */ (
          document.getElementById('modificarpac-input'));

        var types = document.getElementById('modificartype-selector');
        $scope.mapModif.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        $scope.mapModif.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', $scope.mapModif);

        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
          map: $scope.mapModif,
          anchorPoint: new google.maps.Point(0, -29)
        });
        autocomplete.addListener('place_changed', function () {
          ubicacionInicialMarker.setVisible(false);
          infowindow.close();
          marker.setVisible(false);
          var place = autocomplete.getPlace();
          if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
          }

          // If the place has a geometry, then present it on a map.
          if (place.geometry.viewport) {
            $scope.mapModif.fitBounds(place.geometry.viewport);
          } else {
            $scope.mapModif.setCenter(place.geometry.location);
            $scope.mapModif.setZoom(17); // Why 17? Because it looks good.
          }
          marker.setIcon( /** @type {google.maps.Icon} */ ({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
          }));
          marker.setPosition(place.geometry.location);
          marker.setVisible(true);

          var address = '';
          if (place.address_components) {
            address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
          }

          infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
          infowindow.open($scope.mapModif, marker);
          var latm = marker.getPosition().lat();
          var lngm = marker.getPosition().lng();
          $scope.modificarlat = latm;
          $scope.modificarlng = lngm;
          console.log($scope.modificarlat);
          console.log($scope.modificarlng);
        });

        // Sets a listener on a radio button to change the filter type on Places
        // Autocomplete.
        function setupClickListener(id, types) {
          var radioButton = document.getElementById(id);
          radioButton.addEventListener('click', function () {
            autocomplete.setTypes(types);
          });
        }
        setupClickListener('changetype-all', []);
        setupClickListener('changetype-address', ['address']);
        setupClickListener('changetype-establishment', ['establishment']);
        setupClickListener('changetype-geocode', ['geocode']);

      } else {
        document.getElementById('modificarmapa').style.display = "block";
        latitud = parseFloat(latitude);
        longitud = parseFloat(longitude);
        pos = new google.maps.LatLng(latitud, longitud);
        $scope.mapModif.setCenter(pos);
        $scope.mapModif.setZoom(13);
        var posClinica = {
          lat: latitud,
          lng: longitud
        };

        var ubicacionInicialMarker = new google.maps.Marker({
          map: $scope.mapModif,
          position: posClinica,
          title: 'Clinica'
        });
      };
    }

    function initMap(j) {
      console.log(j);
      if (j == 1) {
        document.getElementById('altamapa').style.display = "block";
        $scope.map = new google.maps.Map(document.getElementById('map'), {
          center: {
            lat: -34.5991567,
            lng: -58.369587499999966
          },
          zoom: 13
        });
        var input = /** @type {!HTMLInputElement} */ (
          document.getElementById('pac-input'));

        var types = document.getElementById('type-selector');
        $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', $scope.map);

        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
          map: $scope.map,
          anchorPoint: new google.maps.Point(0, -29)
        });
        autocomplete.addListener('place_changed', function () {
          infowindow.close();
          marker.setVisible(false);
          var place = autocomplete.getPlace();
          if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
          }

          // If the place has a geometry, then present it on a map.
          if (place.geometry.viewport) {
            $scope.map.fitBounds(place.geometry.viewport);
          } else {
            $scope.map.setCenter(place.geometry.location);
            $scope.map.setZoom(17); // Why 17? Because it looks good.
          }
          marker.setIcon( /** @type {google.maps.Icon} */ ({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
          }));
          marker.setPosition(place.geometry.location);
          marker.setVisible(true);

          var address = '';
          if (place.address_components) {
            address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
          }

          infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
          infowindow.open($scope.map, marker);
          var lat = marker.getPosition().lat();
          var lon = marker.getPosition().lng();
          // var scopelat = angular.element(document.getElementById("lat")).scope();
          // var scopelng = angular.element(document.getElementById("lng")).scope();
          // scopelat.lat = lat;
          // scopelng.lng = lon;
          $scope.altalat = lat;
          $scope.altalng = lon;
          // scopelng.$apply();
          // scopelat.$apply();

        });

        // Sets a listener on a radio button to change the filter type on Places
        // Autocomplete.
        function setupClickListener(id, types) {
          var radioButton = document.getElementById(id);
          radioButton.addEventListener('click', function () {
            autocomplete.setTypes(types);
          });
        }
        setupClickListener('changetype-all', []);
        setupClickListener('changetype-address', ['address']);
        setupClickListener('changetype-establishment', ['establishment']);
        setupClickListener('changetype-geocode', ['geocode']);

      } else {
        document.getElementById('altamapa').style.display = "block";
        latitude = -34.5991567;
        longitude = -58.369587499999966;
        pos = new google.maps.LatLng(latitude, longitude);
        $scope.map.setCenter(pos);
        $scope.map.setZoom(13);
      };
    }





  })


  ////////////////////////////////
  //█▀▀ █▀▀█ █▀▀█ █▀▄▀█ █▀▀█ █▀▀  ▀  █▀▀█ █▀▀
  //█▀▀ █▄▄█ █▄▄▀ █ ▀ █ █▄▄█ █    █  █▄▄█ ▀▀█
  //▀   ▀  ▀ ▀  ▀ ▀   ▀ ▀  ▀ ▀▀▀  ▀  ▀  ▀ ▀▀▀
  ////////////////////////////////
  .controller('farmaciasCrt', function ($scope, UserSrv, $http, $mdDialog, Permisos) {

    $scope.primeraosegunda = 1;
    $scope.altaMapaInicializador = 0;
    $scope.lat = '';
    $scope.lng = '';
    $scope.ObrasSocialesAgregar = [];
    $scope.PS = Permisos;
    $scope.ObrasSocialesAgregar = [];
    $scope.OSEnvio = [];


    $scope.cerrarEditar = function () {
      $scope.farmaciaModif = undefined;
      $scope.esconderMapaModificar = true;
      $scope.modificando = false;
      $scope.ObtenerOS();
      // limpiarcampos();
    }

    $scope.Mapa = function () {
      $scope.esconderMapa = false;
      $scope.altaMapaInicializador++;
      initMap($scope.altaMapaInicializador);
    }

    $scope.Editar = function (x) {
      $scope.farmaciaModif = x;
      $scope.modificando = true;
      $scope.ObrasSocialesAgregar = x.obrasSociales;
      $scope.initMapModificar($scope.primeraosegunda, $scope.farmaciaModif.latitude, $scope.farmaciaModif.longitude);
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

    $scope.borrarOS = function () {
      $scope.ObrasSocialesAgregar = []
    }

    $scope.ObtenerFarmacias = function () {
      $scope.Cargando = 'Cargando..';
      $http.get('https://guarded-oasis-37936.herokuapp.com/farmacia/traerElementos')

        .success(function (response) {
          $scope.farmacias = response
          $scope.ObrasSocialesAgregar = []
        })

    }

    $scope.ObtenerOS = function () {
      $http.get('https://guarded-oasis-37936.herokuapp.com/obraSocial/traerElementos')
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
        'latitude': $scope.altalat,
        'longitude': $scope.altalng,
        'obrasSociales': $scope.ObrasSocialesAgregar.map(OS => OS.id)
      }
      $http.post('https://guarded-oasis-37936.herokuapp.com/farmacia', data)
        .success(function (response) {
          console.log(response);
          UserSrv.alertOk('Farmacia creada con exito.');
          limpiarCampos();
        }).error(function (response) {
          $scope.errorText = response;
          $scope.errorMsj = "*Revise los datos e intente nuevamente";
        })
    }

    $scope.Eliminar = function (ev, id) {
      var confirm = $mdDialog.confirm()
        .title('¿Esta seguro de eliminar?')
        .textContent('La farmacia sera eliminado de forma permantente')
        .ariaLabel('Lucky day')
        .targetEvent(ev)
        .ok('Continuar')
        .cancel('Cancelar');

      $mdDialog.show(confirm).then(function () {
        $http.delete('https://guarded-oasis-37936.herokuapp.com/farmacia/' + id.id)
          .success(function (response) {
            UserSrv.alertOk("Se elimino con exito.");
            $scope.ObtenerFarmacias();
          })
          .error(function (response) {
            UserSrv.alertError("Hubo un error al eliminar.");
          })
      })

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
      $http.put('https://guarded-oasis-37936.herokuapp.com/farmacia/' + $scope.farmaciaModif.id, {
          'NOMBRE': $scope.farmaciaModif.nombre,
          'DIRECCION': $scope.farmaciaModif.direccion,
          'LOCALIDAD': $scope.farmaciaModif.localidad,
          'TELEFONO': $scope.farmaciaModif.telefono,
          'latitude': $scope.modificarlat,
          'longitude': $scope.modificarlng,
          'obrasSociales': $scope.ObrasSocialesAgregar.map(OS => OS.id)
        })

        .success(function (response) {
          UserSrv.alertOk('Se edito con exito.');
          $scope.ObtenerFarmacias();
          $scope.modificando = true;
          limpiarErrores();
          $scope.cerrarEditar();
        }).error(function (response) {
          $scope.errorText = response;
          $scope.errorMsj = "*Revise los datos e intente nuevamente";
        })
    }

    var limpiarErrores = function () {
      $scope.errorText = null;
      $scope.errorMsj = null;
    }
    var limpiarCampos = function () {
      $scope.esconderMapa = true;
      limpiarErrores();
      $scope.nombre = null;
      $scope.telefono = null;
      $scope.ObrasSocialesAgregar = [];
      $scope.errorText = null;
      $scope.errorMsj = null;
      $scope.direccion = null;
      $scope.localidad = null;
    }

    $scope.initMapModificar = function (j, latitude, longitude) {
      if (j == 1) {
        $scope.primeraosegunda = 2;
        document.getElementById('modificarmapa').style.display = "block";
        latitud = parseFloat(latitude);
        longitud = parseFloat(longitude);
        console.log(latitud);
        console.log(longitud);
        console.log(latitude);
        console.log(longitude);

        var myLatLng = {
          lat: latitud,
          lng: longitud
        };

        $scope.mapModif = new google.maps.Map(document.getElementById('modificarmap'), {
          center: myLatLng,
          zoom: 13
        });

        var ubicacionInicialMarker = new google.maps.Marker({
          map: $scope.mapModif,
          position: myLatLng,
          title: 'hola'
        });

        var input = /** @type {!HTMLInputElement} */ (
          document.getElementById('modificarpac-input'));

        var types = document.getElementById('modificartype-selector');
        $scope.mapModif.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        $scope.mapModif.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', $scope.mapModif);

        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
          map: $scope.mapModif,
          anchorPoint: new google.maps.Point(0, -29)
        });
        autocomplete.addListener('place_changed', function () {
          ubicacionInicialMarker.setVisible(false);
          infowindow.close();
          marker.setVisible(false);
          var place = autocomplete.getPlace();
          if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
          }

          // If the place has a geometry, then present it on a map.
          if (place.geometry.viewport) {
            $scope.mapModif.fitBounds(place.geometry.viewport);
          } else {
            $scope.mapModif.setCenter(place.geometry.location);
            $scope.mapModif.setZoom(17); // Why 17? Because it looks good.
          }
          marker.setIcon( /** @type {google.maps.Icon} */ ({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
          }));
          marker.setPosition(place.geometry.location);
          marker.setVisible(true);

          var address = '';
          if (place.address_components) {
            address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
          }

          infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
          infowindow.open($scope.mapModif, marker);
          var latm = marker.getPosition().lat();
          var lngm = marker.getPosition().lng();
          $scope.modificarlat = latm;
          $scope.modificarlng = lngm;
          console.log($scope.modificarlat);
          console.log($scope.modificarlng);
        });

        // Sets a listener on a radio button to change the filter type on Places
        // Autocomplete.
        function setupClickListener(id, types) {
          var radioButton = document.getElementById(id);
          radioButton.addEventListener('click', function () {
            autocomplete.setTypes(types);
          });
        }
        setupClickListener('changetype-all', []);
        setupClickListener('changetype-address', ['address']);
        setupClickListener('changetype-establishment', ['establishment']);
        setupClickListener('changetype-geocode', ['geocode']);

      } else {
        document.getElementById('modificarmapa').style.display = "block";
        latitud = parseFloat(latitude);
        longitud = parseFloat(longitude);
        pos = new google.maps.LatLng(latitud, longitud);
        $scope.mapModif.setCenter(pos);
        $scope.mapModif.setZoom(13);
        var posClinica = {
          lat: latitud,
          lng: longitud
        };

        var ubicacionInicialMarker = new google.maps.Marker({
          map: $scope.mapModif,
          position: posClinica,
          title: 'Clinica'
        });

      };
    }

    function initMap(j) {
      console.log(j);
      if (j == 1) {
        document.getElementById('altamapa').style.display = "block";
        $scope.map = new google.maps.Map(document.getElementById('map'), {
          center: {
            lat: -34.5991567,
            lng: -58.369587499999966
          },
          zoom: 13
        });
        var input = /** @type {!HTMLInputElement} */ (
          document.getElementById('pac-input'));

        var types = document.getElementById('type-selector');
        $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', $scope.map);

        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
          map: $scope.map,
          anchorPoint: new google.maps.Point(0, -29)
        });
        autocomplete.addListener('place_changed', function () {
          infowindow.close();
          marker.setVisible(false);
          var place = autocomplete.getPlace();
          if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
          }

          // If the place has a geometry, then present it on a map.
          if (place.geometry.viewport) {
            $scope.map.fitBounds(place.geometry.viewport);
          } else {
            $scope.map.setCenter(place.geometry.location);
            $scope.map.setZoom(17); // Why 17? Because it looks good.
          }
          marker.setIcon( /** @type {google.maps.Icon} */ ({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
          }));
          marker.setPosition(place.geometry.location);
          marker.setVisible(true);

          var address = '';
          if (place.address_components) {
            address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
          }

          infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
          infowindow.open($scope.map, marker);
          var lat = marker.getPosition().lat();
          var lon = marker.getPosition().lng();
          // var scopelat = angular.element(document.getElementById("lat")).scope();
          // var scopelng = angular.element(document.getElementById("lng")).scope();
          // scopelat.lat = lat;
          // scopelng.lng = lon;
          $scope.altalat = lat;
          $scope.altalng = lon;
          // scopelng.$apply();
          // scopelat.$apply();

        });

        // Sets a listener on a radio button to change the filter type on Places
        // Autocomplete.
        function setupClickListener(id, types) {
          var radioButton = document.getElementById(id);
          radioButton.addEventListener('click', function () {
            autocomplete.setTypes(types);
          });
        }
        setupClickListener('changetype-all', []);
        setupClickListener('changetype-address', ['address']);
        setupClickListener('changetype-establishment', ['establishment']);
        setupClickListener('changetype-geocode', ['geocode']);

      } else {
        document.getElementById('altamapa').style.display = "block";
        latitude = -34.5991567;
        longitude = -58.369587499999966;
        pos = new google.maps.LatLng(latitude, longitude);
        $scope.map.setCenter(pos);
        $scope.map.setZoom(13);
      };
    };


    $scope.ObtenerOS();
    // $scope.initMapModificar($scope.primeraosegunda);



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
      $http.get('https://guarded-oasis-37936.herokuapp.com/especialidad/traerElementos')
        .success(function (response) {
          $scope.Especialidades = response;
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
        $http.delete('https://guarded-oasis-37936.herokuapp.com/especialidad/' + x.id)
          .success(function (response) {
            UserSrv.alertOk("Se elimino con exito.");
            $scope.ObtenerEspecialidades();
          })
      })
    }

    $scope.Alta = function () {

      $http.post('https://guarded-oasis-37936.herokuapp.com/especialidad', {
          'NOMBRE': $scope.espeAlta.nombre,
          'ESTUDIO': $scope.espeAlta.estudio,
          'DIRECTO': $scope.espeAlta.directo
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

      $http.put('https://guarded-oasis-37936.herokuapp.com/especialidad/' + $scope.espeModif.id, {
          'NOMBRE': $scope.espeModif.nombre,
          'ESTUDIO': $scope.espeModif.estudio,
          'IDESPECIALIDAD': $scope.espeModif.id,
          'DIRECTO': $scope.espeModif.directo
        })
        .success(function (response) {
          UserSrv.alertOk('Editado con exito.');
          limpiarErrores();
          $scope.modificando = false
        }).error(function (response) {
          $scope.errorText = response;
          $scope.errorMsj = "*Revise los datos e intente nuevamente";
        })

    }

    $scope.Editar = function (x) {
      $scope.espeModif = x;
      $scope.modificando = true;
    }

    var limpiarErrores = function () {
      $scope.errorText = null;
      $scope.errorMsj = null;
    }

    var limpiarCampos = function () {
      $scope.espeAlta.nombre = null;
      $scope.espeAlta.estudio = 0;
    }


  })

  .controller('recomendacionCrt', function ($scope, UserSrv, $http, $mdDialog, Permisos) {

    $scope.sortType = 'nombre'; // el default
    $scope.sortReverse = false;
    $scope.PS = Permisos;
    $scope.checkbox = [];
    var envio = [];
    console.log($scope.PS);

    $scope.filtronumeritos = 10;
    $scope.ActualPage = 1;
    $scope.ObtenerRecomendaciones = function () {
      $scope.Cargando = "Cargando...";
      $http.get('https://guarded-oasis-37936.herokuapp.com/recomendacion/sinContactar')
        .success(function (response) {
          $scope.Recomendaciones = response;
          console.log($scope.Recomendaciones);
          $scope.Cargando = "";
        })
    }

    $scope.makeIDS = function () {
      envio = [];
      angular.forEach($scope.checkbox, function (value, key) {
        if (value != false) {
          envio.push(key);
        }
      });
      return envio;
    }

    $scope.marcarTodos = function () {
      angular.forEach($scope.Recomendaciones, function (value, key) {
        $scope.checkbox[value.id] = !$scope.checkbox[value.id];
      });
    }

    $scope.muestroBoton = function () {
      var resultado = false;
      angular.forEach($scope.checkbox, function (value, key) {
        if (value != false) {
          resultado = true;
        }
      });
      return resultado;
    }

    $scope.Contactar = function (id) {
      $scope.makeIDS()
      $http.post('https://guarded-oasis-37936.herokuapp.com/recomendacion/contactado', {
          'ids': envio
        })
        .success(function (response) {
          UserSrv.alertOk('Recomendacion/es marcada/s como contactada.');
          $scope.ObtenerRecomendaciones();
        }).error(function (response) {
          $scope.errorText = response;
          $scope.errorMsj = "*Revise los datos e intente nuevamente";
        })
    }

    $scope.ObtenerRecomendaciones();


  })


  .controller('estadisticasCrt', function ($scope, UserSrv, $http, $mdDialog, Permisos) {


    $scope.sortType = 'nombre'; // el default
    $scope.fecha_creacion_desde = moment().format('Y') + '-' + moment().format('MM') + '-01';
    $scope.fecha_creacion_hasta = moment().format('Y') + '-' + moment().format('MM') + '-' + moment().daysInMonth();
    $scope.fecha_modificacion_desde = moment().format('Y') + '-' + moment().format('MM') + '-01';
    $scope.fecha_modificacion_hasta = moment().format('Y') + '-' + moment().format('MM') + '-' + moment().daysInMonth();
    $scope.sortReverse = false;
    $scope.sortType = 'nombre'; // el default
    $scope.sortReverse = false;
    $scope.PS = Permisos;
    $scope.vistaactual = "Zonas";
    console.log($scope.PS);

    $scope.filtronumeritos = 10;
    $scope.ActualPage = 1;

    $scope.setVista = function (vista) {
      $scope.vistaactual = vista;
      if ($scope.ultimaFechaCD != moment($scope.fecha_creacion_desde).format('YYYY-MM-DD') ||
        $scope.ultimaFechaCH != moment($scope.fecha_creacion_hasta).format('YYYY-MM-DD') ||
        $scope.ultimaFechaMD != moment($scope.fecha_modificacion_desde).format('YYYY-MM-DD') ||
        $scope.ultimaFechaMH != moment($scope.fecha_modificacion_hasta).format('YYYY-MM-DD')
      ) {
        switch ($scope.vistaactual) {
          case 'Zonas':
            $scope.ObtenerZonas();
            break;
          case 'Clinicas':
            $scope.getClinicas($scope.zonaactual);
            break;
          case 'Solicitudes':
            $scope.getSolicitudes($scope.clinicaactual);
            break;
        }
        $scope.ultimaFechaCD = moment($scope.fecha_creacion_desde).format('YYYY-MM-DD');
        $scope.ultimaFechaCH = moment($scope.fecha_creacion_hasta).format('YYYY-MM-DD');
        $scope.ultimaFechaMD = moment($scope.fecha_modificacion_desde).format('YYYY-MM-DD');
        $scope.ultimaFechaMH = moment($scope.fecha_modificacion_hasta).format('YYYY-MM-DD');
      }
    }

    $scope.formatDate = function (fecha) {
      if (fecha == null) {
        return ''
      }
      var fechaFormateada = moment(fecha).format('DD/MM/YYYY')
      return fechaFormateada
    }

    function sumZonas(objeto) {
      var pendientes = 0,
        confirmados = 0,
        rechazados = 0,
        total = 0;
      objeto.forEach(function (objeto) {
        pendientes = pendientes + objeto.pendientes;
        confirmados = confirmados + objeto.confirmados;
        rechazados = rechazados + objeto.rechazados;
        total = total + objeto.total;
      })
      return {
        'pendientes': pendientes,
        'confirmados': confirmados,
        'rechazados': rechazados,
        'total': total
      };
    }

    $scope.expandir = function (solicitud) {
      $scope.expandida = solicitud.id;
      $scope.Turnos = undefined;
      $scope.datosNuevos = solicitud;
      $http.post('https://guarded-oasis-37936.herokuapp.com/reporteSolicitudes/turnos', {
          'id_solicitud': solicitud.id
        })
        .success(function (response) {
          $scope.Turnos = response;
          //$scope.totalZonas = sumZonas(response);
          console.log($scope.Turnos);
        })
    }

    $scope.Actualizar = function () {
      switch ($scope.vistaactual) {
        case 'Zonas':
          $scope.ObtenerZonas();
          break;
        case 'Clinicas':
          $scope.getClinicas($scope.zonaactual);
          break;
        case 'Solicitudes':
          $scope.getSolicitudes($scope.clinicaactual);
          break;
      }

    }

    $scope.ObtenerZonas = function () {
      $scope.vistaactual = "Zonas";
      $http.post('https://guarded-oasis-37936.herokuapp.com/reporteSolicitudes/zonas', {
          'fecha_creacion_desde': moment($scope.fecha_creacion_desde).format('YYYY-MM-DD'),
          'fecha_creacion_hasta': moment($scope.fecha_creacion_hasta).format('YYYY-MM-DD'),
          'fecha_modificacion_desde': moment($scope.fecha_modificacion_desde).format('YYYY-MM-DD'),
          'fecha_modificacion_hasta': moment($scope.fecha_modificacion_hasta).format('YYYY-MM-DD')
        })
        .success(function (response) {
          $scope.Zonas = response;
          $scope.totalZonas = sumZonas(response);
          console.log($scope.Zonas);
        })
    }

    $scope.getClinicas = function (zona) {
      $scope.vistaactual = "Clinicas";
      $scope.zonaactual = zona;
      $http.post('https://guarded-oasis-37936.herokuapp.com/reporteSolicitudes/clinicas', {
          'zona': zona,
          'fecha_creacion_desde': moment($scope.fecha_creacion_desde).format('YYYY-MM-DD'),
          'fecha_creacion_hasta': moment($scope.fecha_creacion_hasta).format('YYYY-MM-DD'),
          'fecha_modificacion_desde': moment($scope.fecha_modificacion_desde).format('YYYY-MM-DD'),
          'fecha_modificacion_hasta': moment($scope.fecha_modificacion_hasta).format('YYYY-MM-DD')
        })
        .success(function (response) {
          $scope.Clinicas = response;
          $scope.totalClinicas = sumZonas(response);
          console.log($scope.Clinicas);
        })
    }

    $scope.getSolicitudes = function (clinica) {
      $scope.vistaactual = "Solicitudes";
      $scope.clinicaactual = clinica.nombre;
      $http.post('https://guarded-oasis-37936.herokuapp.com/reporteSolicitudes/solicitudes', {
          'id_clinica': clinica.id_clinica,
          'fecha_creacion_desde': moment($scope.fecha_creacion_desde).format('YYYY-MM-DD'),
          'fecha_creacion_hasta': moment($scope.fecha_creacion_hasta).format('YYYY-MM-DD'),
          'fecha_modificacion_desde': moment($scope.fecha_modificacion_desde).format('YYYY-MM-DD'),
          'fecha_modificacion_hasta': moment($scope.fecha_modificacion_hasta).format('YYYY-MM-DD')
        })
        .success(function (response) {
          $scope.Solicitudes = response

          console.log($scope.Solicitudes);
        })
    }

    $scope.ObtenerRecomendaciones = function () {
      $scope.Cargando = "Cargando...";
      $http.get('https://guarded-oasis-37936.herokuapp.com/recomendacion/sinContactar')
        .success(function (response) {
          $scope.Recomendaciones = response;
          console.log($scope.Recomendaciones);
          $scope.Cargando = "";
        })
    }

    $scope.ObtenerZonas();
    $scope.ultimaFechaCD = moment($scope.fecha_creacion_desde).format('YYYY-MM-DD');
    $scope.ultimaFechaCH = moment($scope.fecha_creacion_hasta).format('YYYY-MM-DD');
    $scope.ultimaFechaMD = moment($scope.fecha_modificacion_desde).format('YYYY-MM-DD');
    $scope.ultimaFechaMH = moment($scope.fecha_modificacion_hasta).format('YYYY-MM-DD');


  })