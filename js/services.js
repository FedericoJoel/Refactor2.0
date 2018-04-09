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

  /*this.alertOk = function (texto) {
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
  };*/
  this.alertOk = function(texto) {
    $("#mensaje").html(
     ' <div class="container ">'+
        '<div class="row">'+
          '<div class="col-sm-6 col-md-6 col-sm-offset-2 col-md-offset-2">'+
            '<div class="alert alert-success alert-fixed" id="mensajeContainer" style="-webkit-animation-duration: 0.5s;">'+
              '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>'+
              '<span class="glyphicon glyphicon-ok"></span> <strong>Exito!</strong>'+
              '<hr class="message-inner-separator">'+
              '<p>'+texto+'</p>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div>'
    );
    $("#mensaje").show();
    $('#mensajeContainer').addClass('animated zoomIn')
    setTimeout(function () {
      $('#mensajeContainer').removeClass('animated zoomIn')
      $('#mensajeContainer').addClass('animated zoomOut')
    }, 3000);
}

  this.alertError = function (texto) {
    $("#mensaje").html(
      ' <div class="container ">' +
      '<div class="row">' +
      '<div class="col-sm-6 col-md-6 col-sm-offset-2 col-md-offset-2">' +
      '<div class="alert alert-danger alert-fixed" id="mensajeContainer" style="-webkit-animation-duration: 0.5s;">' +
      '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>' +
      '<span class="glyphicon glyphicon-remove"></span> <strong>Error!</strong>' +
      '<hr class="message-inner-separator">' +
      '<p>' + texto + '</p>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>'
    );
    $("#mensaje").show();
    $('#mensajeContainer').addClass('animated zoomIn')
    setTimeout(function () { 
      $('#mensajeContainer').removeClass('animated zoomIn')
      $('#mensajeContainer').addClass('animated zoomOut') 
    }, 5000);
  }

  /*this.alertError = function (texto) {
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('Error!')
        .textContent(texto)
        .ok('Ok')
    );*/

  $rootScope.$on('notifications:httpError', function (event, responseError) {
   this.alertError('Hubo un error en el sistema. Intente nuevamente')
  });

  this.mensajeExito = function (mensaje) {
     if (mensaje = undefined) mensaje = 'Exito al realizar la accion'
    $('#mensaje').html('<div class="alert alert-success alert-fixed" role="alert"><strong>¡Exito!</strong> ' + mensaje + '</div>');
    setTimeout(function () {
       $('#mensaje').html('');
     }, 2000);

   }
  // this.mensajeError = function (mensaje) {
  //   if (mensaje = undefined) mensaje = 'Error al realizar la accion'
  //   $('#mensaje').html('<div class="alert alert-error alert-fixed" role="alert"><strong>¡Error!</strong> ' + mensaje + '</div>');
  //   setTimeout(function () {
  //     $('#mensaje').html('');
  //   }, 2000);

 // }
})
/*app.service('APIInterceptor', [function () {
  var service = this;

  service.request = function (config) {
    config.headers.Authorization = 'Bearer '+ localStorage.getItem('token');
    return config;
  };
  service.responseError = function (rejection){
    console.log(rejection)
    return rejection.data 
  }
}]);*/

app.factory('APIInterceptor', function ($q, $rootScope) {
    return {
      // optional method
      'request': function (config) {
        // do something on success
        config.headers.Authorization = 'Bearer ' + localStorage.getItem('token');
        return config;
      },

      // optional method
      'requestError': function (rejection) {
        // do something on error
        return $q.reject(rejection);
      },
      // optional method
      'response': function (response) {
        // do something on success
        return response;
      },
      // optional method
      'responseError': function (rejection) {
        // do something on error
        console.log(rejection)
        if(rejection.status == 422){
          return  $q.reject(rejection);
        }else{
          $rootScope.$broadcast('notifications:httpError', rejection);
          return $q.reject(rejection);
        } 
      }
    };
  });

app.service('Permisos', [function ($stateProvider, $urlRouterProvider) {

  this.tienePermiso = function (pantalla) {
    var permisos = localStorage.getItem('permisos').split(',')
  
     return permisos.some(permiso => permiso == pantalla );
  };
}]);

app.service('CargarDatos', ['$http', function ($http) {

  var index = 0
  this.CargarAfiliados = function(){
    cargarAfiliados()
  }
  this.CargarMedicos = function () {
    cargarMedicos()
  }

  var cargarAfiliados = function () {
      var data = {
        'NACIMIENTO': '2018-10-06',
        'NOMBRE': index,
        'APELLIDO': index,
        'DIRECCION': index,
        'CUIL': index,
        'EMAIL': index,
        'DNI': index,
        'PISO': index,
        'DEPARTAMENTO': index,
        'TELEFONO': index,
        'CELULAR': index,
        'IDOBRASOCIAL': 1,
        'NAFILIADO': index,
        'GRUPOF': null
      }
      $http.post('http://des.gestionarturnos.com/afiliado', data)

        .success(function (response) {
          index++
          cargarAfiliados()
        })
  };

  var cargarMedicos = function(){
    var data = {
      'NOMBRE': index,
      'DIRECCION': index,
      'LOCALIDAD': index,
      'TELEFONO': index,
      'ZONA': index,
      'latitude': index,
      'longitude': index,
      'especialidades': [1],
      'obrasSociales': [1],
      'PARTICULAR': 1
    }
    $http.post('http://des.gestionarturnos.com/climed', data)

      .success(function (response) {
        index++
        cargarMedicos()
      })
  }
}]);

