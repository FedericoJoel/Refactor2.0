var app = angular.module('GestionarApp', ['ui.router', 'GestionarApp.controllers']);

/*app.config(['$routeProvider', function ($routeProvider, Permisos) {

  //this loads up our routes dynamically from the previous object 
  for (var path in Permisos.getTodosPermisos) {
    $routeProvider.when(path, getTodosPermisos[path]);
  }
  $routeProvider.otherwise({ redirectTo: '/login' });

}])*/

app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('login', {
    url: "/login",
    templateUrl: "templates/login.html",
    controller: "loguinCrt",
  })
    .state('solicitudes', {
      url: "/solicitud",
      templateUrl: "templates/solicitudes.html",
      controller: "solicitudesCrt",
      cache:false
    })
    .state('pantallas', {
      url: "/pantalla",
      templateUrl: "templates/pantallas.html",
      controller: "pantallasCrt"
    })
    .state('abmafi', {
      url: "/afiliado",
      templateUrl: "templates/afiliados.html",
      controller: "afiliadosCrt"
    })
    .state('abmcli', {
      url: "/climed",
      templateUrl: "templates/clinicas.html",
      controller: "clinicasCrt"
    })
    .state('abmmed', {
      url: "/medico",
      templateUrl: "templates/medicos.html",
      controller: "medicosCrt"
    })
    .state('abmfar', {
      url: "/farmacia",
      templateUrl: "templates/farmacias.html",
      controller: "farmaciasCrt"
    })
    .state('usuarios', {
      url: "/usuario",
      templateUrl: "templates/usuarios.html",
      controller: "usuariosCrt"
    })
    .state('abmesp', {
      url: "/especialidad",
      templateUrl: "templates/especialidades.html",
      controller: "especialidadesCrt"
    })

    .state('inicio', {
      url: "/inicio",
      templateUrl: "templates/inicial.html",
      controller: "especialidadesCrt"
    })

    .state('auditoria', {
      url: "/auditoria",
      templateUrl: "templates/auditoria.html",
      controller: "auditoriaCrt"
    })


  $urlRouterProvider.otherwise("/inicio");

});
