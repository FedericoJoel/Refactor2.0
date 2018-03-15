var app = angular.module('Login', []).config(function($interpolateProvider){});

app.controller('loguear', function($scope, $http, $compile, $location, $window) {

  // manda las solicitud http necesarias para manejar los requerimientos de un abm
   $scope.enviarFormulario = function()
   {
         var form = $("#formulario").serializeArray();

         $http({
            url: 'login',
            method: 'post',
            data: $.param(form),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function successCallback(response)
            {
               if(response == 'si'){
                  $window.location.href = '/asociados';
               }
               
            }, function errorCallback(data)
            {
               console.log(data);
               $scope.errores = data.data;
            });

   }


});
