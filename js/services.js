var app = angular.module('GestionarApp.services', ['ngMaterial'])


app.service('UserSrv', function ($http, $mdDialog, $mdToast, $rootScope) {

  this.GetPath = function () {
    var path = 'core.php';
    return path;
  }

  this.GetPermisos = function () {

    $http.post(this.GetPath(), {
        'seccion': 'permisos',
        'accion': 'obtenerpermisos',
        'id': '',
        'dni': ''
      })
      .success(function (response) {
        $scope.Usuarios = response;
        console.log(response);
      })
  }

  this.alerta = function (titulo, mensaje) {
    $mdDialog.show(
      $mdDialog.alert()
      .clickOutsideToClose(true)
      .title(titulo)
      .textContent(mensaje)
      .ariaLabel('Left to right demo')
      .ok('Aceptar')
      // You can specify either sting with query selector
      .openFrom('#left')
      // or an element
      .closeTo(angular.element(document.querySelector('#right')))
    );
  }

  this.GetEspecialidades = function () {

  }
  this.ShowLoading = function () {
    var path = '';
    return path;
  }

  // this.showToast = function(mensaje) {
  //     $mdToast.show(
  //       $mdToast.simple()
  //         .textContent(mensaje)
  //         .position('bottom right')
  //         // .theme('toastOK.html')
  //         .hideDelay(3000)
  //         // .action('OK')
  //     );
  //   };

  this.alertOk = function (texto) {
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
    $mdDialog.show(
      $mdDialog.alert()
      .parent(angular.element(document.querySelector('#popupContainer')))
      .clickOutsideToClose(true)
      .title('Excelente')
      .textContent(texto)
      .ok('Ok')
    );
  };

  // this.mensajeExito = function (mensaje) {
  //   if (mensaje = undefined) mensaje = 'Exito al realizar la accion'
  //   $('#mensaje').html('<div class="alert alert-success alert-fixed" role="alert"><strong>¡Exito!</strong> ' + mensaje + '</div>');
  //   setTimeout(function () {
  //     $('#mensaje').html('');
  //   }, 2000);

  // }
  // this.mensajeError = function (mensaje) {
  //   if (mensaje = undefined) mensaje = 'Error al realizar la accion'
  //   $('#mensaje').html('<div class="alert alert-error alert-fixed" role="alert"><strong>¡Error!</strong> ' + mensaje + '</div>');
  //   setTimeout(function () {
  //     $('#mensaje').html('');
  //   }, 2000);

 // }
})
app.service('APIInterceptor', [function () {
  var service = this;

  service.request = function (config) {
    config.headers.Authorization = 'Bearer '+ localStorage.getItem('token');
    return config;
  };
}]);

app.service('Permisos', [function () {

  this.tienePermiso = function (pantalla) {
    var permisos = localStorage.getItem('permisos').split(',')
  
     return permisos.some(permiso => permiso == pantalla );
  };

 /* this.getPermisos = function(){
    return localStorage.getItem('permisos').split(',')
  }

  this.getTodosPermisos = [
    {
      nombre: 'login',
      url: "/login",
      templateUrl: "templates/login.html",
      controller: "loguinCrt",
    },
    {
      nombre: 'solicitudes',
      url: "/solicitudes",
      templateUrl: "templates/solicitudes.html",
      controller: "solicitudesCrt",
      cache: false
    },
    {
      nombre: 'pantallas',
      url: "/pantallas",
      templateUrl: "templates/pantallas.html",
      controller: "pantallasCrt"
    }, 
    {
      nombre:'afiliados',
      url: "/afiliados",
      templateUrl: "templates/afiliados.html",
      controller: "afiliadosCrt"
    },
    {
      nombre: 'clinicas',
      url: "/clinicas",
      templateUrl: "templates/clinicas.html",
      controller: "clinicasCrt"
    }, 
    {
      nombre: 'medicos',
      url: "/medicos",
      templateUrl: "templates/medicos.html",
      controller: "medicosCrt"
    }, 
    {
      nombre: 'farmacias',
      url: "/farmacias",
      templateUrl: "templates/farmacias.html",
      controller: "farmaciasCrt"
    }, 
    {
      nombre: 'usuarios',
      url: "/usuarios",
      templateUrl: "templates/usuarios.html",
      controller: "usuariosCrt"
    }, 
    {
      nombre: 'especialidades',
      url: "/especialidades",
      templateUrl: "templates/especialidades.html",
      controller: "especialidadesCrt"
    }, 
    {
      nombre: 'inicio',
      url: "/inicio",
      templateUrl: "templates/inicial.html",
      controller: "especialidadesCrt"
    }, 
    {
      nombre: 'auditoria',
      url: "/auditoria",
      templateUrl: "templates/auditoria.html",
      controller: "auditoriaCrt"
    }]*/

}]);
