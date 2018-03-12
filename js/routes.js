var app = angular.module('GestionarApp', ['ui.router', 'GestionarApp.controllers']);


app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('solicitudes', {
      url: "/solicitudes",
      templateUrl: "templates/solicitudes.html",
      controller: "solicitudesCrt",
      cache:false
    })
    .state('pantallas', {
      url: "/pantallas",
      templateUrl: "templates/pantallas.html",
      controller: "pantallasCrt"
    })
    .state('abmafi', {
      url: "/afiliados",
      templateUrl: "templates/afiliados.html",
      controller: "afiliadosCrt"
    })
    .state('abmcli', {
      url: "/clinicas",
      templateUrl: "templates/clinicas.html",
      controller: "clinicasCrt"
    })
    .state('abmmed', {
      url: "/medicos",
      templateUrl: "templates/medicos.html",
      controller: "medicosCrt"
    })
    .state('abmfar', {
      url: "/farmacias",
      templateUrl: "templates/farmacias.html",
      controller: "farmaciasCrt"
    })
    .state('usuarios', {
      url: "/usuarios",
      templateUrl: "templates/usuarios.html",
      controller: "usuariosCrt"
    })
    .state('abmesp', {
      url: "/especialidades",
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
