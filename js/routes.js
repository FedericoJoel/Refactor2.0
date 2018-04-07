var app = angular.module('GestionarApp', ['ui.router', 'GestionarApp.controllers']);




app.config(function($stateProvider, $urlRouterProvider) {
  
  $stateProvider
  .state('login', {
    url: '/login',
    views: {
      'login': {
      templateUrl: "templates/login.html",
      controller: "loguinCrt"}
    },
    
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
      url: "/medico",
      templateUrl: "templates/clinicas.html",
      controller: "clinicasCrt"
    })
    .state('abmmed', {
      url: "/climed",
      templateUrl: "templates/medicos.html",
      controller: "medicosCrt"
    })
    .state('abmfar', {
      url: "/farmacia",
      templateUrl: "templates/farmacias.html",
      controller: "farmaciasCrt"
    })
    .state('usuarios', {
      url: "/user",
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

    .state('recomendacion', {
      url: "/recomendacion",
      templateUrl: "templates/recomendacion.html",
      controller: "recomendacionCrt"
    })

    .state('estadisticas', {
      url: "/estadisticas",
      templateUrl: "templates/estadisticas.html",
      controller: "estadisticasCrt"
    })

    $urlRouterProvider.otherwise("/login");
  

})

// In the run phase of your Angular application  
app.run(function($rootScope,$state) {

  // Listen to '$locationChangeSuccess', not '$stateChangeStart'
  $rootScope.$on('$locationChangeSuccess', function() {
    var permisos = localStorage.getItem('permisos').split(',')
      if(localStorage.getItem('logueado') == 'false'){
        // log-in promise failed. Redirect to log-in page.
        $state.go('login')

      } else if (window.location.hash.substr(2) == 'login'){
        $state.go('inicio')
      }
      else if (!permisos.some(permiso => permiso == window.location.hash.substr(2))) {
      $state.go('inicio')
      }else{
        $rootScope.$on('$stateChangeSuccess',
          function (event, toState, toParams, fromState, fromParams) {
            console.log(fromState)
            if(fromState.name == 'solicitudes' && toState.name != 'solicitudes'){
              var socket = io.connect('http://localhost:4050');
              socket.emit('deleteClient', localStorage.getItem('user_id'))
            }
          }
        )
        //socket.emit('deleteClient', localStorage.getItem('user_id'))
      }
  })
})
