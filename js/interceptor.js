angular.module('interceptorService', ['GestionarApp.services'])

    .factory('myHttpInterceptor', function ($q) {
        return {
            // optional method
            'request': function (config) {
                // do something on success
                
                return config || $q.when(config);

            },
            // optional method
            'requestError': function (rejection) {
                // Muestro el mensaje de Error
                console.log(rejection)
                return rejection || $q.when(rejection);
            },
            // optional method
            'response': function (response) {
                // do something on success
                
                return response || $q.when(response);
            },
            // optional method
            'responseError': function (rejection) {
                console.log(rejection)
                return rejection || $q.when(rejection);
                // Muestro el mensaje de Error
                
            }
        };
    })

    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('myHttpInterceptor');
    }]);