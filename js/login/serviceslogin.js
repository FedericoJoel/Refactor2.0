angular.module('Login.services', [])

.factory('myHttpInterceptor', function($q) {
  return {
    // optional method
    'request': function(config) {
      // do something on success
      var div = '#mensajito';
      $('#LoadingGlobal').show(10);
      return config;
    },
    // optional method
   'requestError': function(rejection) {
        // Muestro el mensaje de Error
        $('#LoadingGlobal').hide(1);
        var data = rejection.data;
        var div = '#mensajito';
        $('#ContenedorMensaje').html('<div id="mensajito" class="alert alert-danger" role="alert"><button type="button" onclick="$(ContenedorMensaje).hide(500); "class="close">&times;</button><strong style="font-size: 20pt;">'+data.title+'</strong></br> <font style="font-size: 15pt;">'+data.detail+'</font></div>');
        $('#ContenedorMensaje').show(500);
        setTimeout(function(){$('#ContenedorMensaje').hide(500);},4000);
    },
    // optional method
    'response': function(response) {
      // do something on success
      $('#LoadingGlobal').hide(1);
      var data = response.data;
        var div = '#mensajito';
        $('#ContenedorMensaje').html('<div id="mensajito" class="alert alert-success" role="alert"><button type="button" onclick="$(ContenedorMensaje).hide(500); "class="close">&times;</button><strong style="font-size: 20pt;">Bienvenido</strong></br> <font style="font-size: 15pt;">Aguarde un instante..</font></div>');
        $('#ContenedorMensaje').show(100);
        var logea = "si";
      return logea;
    },
    // optional method
   'responseError': function(rejection) {
        // Muestro el mensaje de Error
        $('#LoadingGlobal').hide(1);
        var data = rejection.data;
        var div = '#mensajito';
        $('#ContenedorMensaje').html('<div id="mensajito" class="alert alert-danger" style="color: white; background-color: rgba(231, 76, 60, 0.88); border-color: rgba(231, 76, 60, 0.88);" role="alert"><button type="button" onclick="$(ContenedorMensaje).hide(500); "class="close">&times;</button><strong style="font-size: 20pt;">'+data.title+'</strong></br> <font style="font-size: 15pt;">'+data.detail+'</font></div>');
        $('#ContenedorMensaje').show(500);
        setTimeout(function(){$('#ContenedorMensaje').hide(500);},4000);
    }
  };
})

.config(['$httpProvider', function($httpProvider) {  
    $httpProvider.interceptors.push('myHttpInterceptor');
}]);
