angular.module('paginado', [])
    .directive("paginado", function () {
        return {
            scope: false,
            templateUrl:'templates/paginado.html',
            controller: ['$scope', function paginadoController($scope) {
                $scope.primeraPagina = 1 // La primera pagina de laspaginas mostradas en el footer para paginar
                $scope.ActualPage =1 // pagina en la que estoy posicionado
                var elemsPorPagina = 10
                var aumentoPaginas = 5
                $scope.changeElemsPorPagina = function(cant){
                    elemsPorPagina = cantidad
                }
                $scope.getPaginas = function (elems) { // Devuelve un array con un numero ascendente por cada elemento de la lista, necesario cuando la lista se modifica por algun filtro
                    if (elems) {
                        var cantPaginas = (new Array(Math.ceil(elems.length / elemsPorPagina)).fill(0).map((x, index) => index + 1))
                        return cantPaginas
                    }
                }
                $scope.aumentarPagina = function (algo) { // Mueve el numero de pag mostradas en el footer para arriba una cant igual a aumentoPaginas
                    if (($scope.getPaginas(algo).length - $scope.primeraPagina) > elemsPorPagina) {
                        $scope.primeraPagina = $scope.primeraPagina + aumentoPaginas
                    }
                }
                $scope.disminuirPagina = function () { // Mueve el numero de pag mostradas en el footer para abajo una cant igual a aumentoPaginas
                    if($scope.primeraPagina > 1)
                        $scope.primeraPagina = $scope.primeraPagina - aumentoPaginas
                }
                $scope.ChangePage = function (pag) {
                    $scope.ActualPage = pag;
                }
                $scope.separarPaginas= function(index){ // Pagina la tabla, dejando visibles una cant de paginas igual a elemsPorPagina
                    var x1 = (index <= ($scope.ActualPage * elemsPorPagina))

                    var x2 = (index >= ($scope.ActualPage - 1) * elemsPorPagina)
           
                    return x1 && x2
                }
                $scope.getPrimeraPagina= function(){
                    $scope.ActualPage =1
                    $scope.primeraPagina =1
                }
            }],
        }

    });