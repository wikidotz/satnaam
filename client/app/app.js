agGrid.initialiseAgGridWithAngular1(angular);

var onlyLoggedIn = function ($location,$q,Login) {
    var deferred = $q.defer();
    if (Login.isLogin()) {
        console.log('sasa')
        deferred.resolve();
    } else {
        console.log('no')

        deferred.reject();
        $location.url('/login');
    }
    return deferred.promise;
};

angular.module('hotelApp', [
    //'ui.router',
    'usermgmt',
    'productsmgmnt',
    'agGrid',
    'ngTouch',
    'ui.bootstrap',
    //'ngMaterial', TO DO :  remove ng material from package.json /bower.json
    'angularMoment'

])



.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {

    $stateProvider

        .state('createOrder', {
            url: '/create-order',
            templateUrl: 'app/create-order/create-order.html',
            controller: 'OrderCtrl',
            resolve:{loggedIn:onlyLoggedIn}
        })

        .state('editOrder', {
            url: '/edit-order/:id',
            templateUrl: 'app/create-order/create-order.html',
            controller: 'OrderCtrl'
        })

        .state('orders', {
            url: '/orders',
            templateUrl: 'app/order-list/order-list.html',
            controller: 'OrderListCtrl'
        })

        .state('login', {
            url: '/login',
            templateUrl: 'app/login/login.html',
            controller: 'LoginCtrl'
        })

        .state('phonelogin', {
            url: '/phonelogin',
            templateUrl: 'app/login/phone-login.html',
            controller: 'PhoneLoginCtrl'
        });

    
    $locationProvider.hashPrefix('');
    //$httpProvider.interceptors.push('TokenInterceptor');
    $httpProvider.interceptors.push(['$q', '$location', '$window', function($q, $location, $window) {
            return {
                // optional method
                request: function(config) {
                    config.headers['Authorization'] = 'Bearer '+$window.sessionStorage.token;
                    return config;
                },
                response: function(response) {
                    return response;
                },
                responseError: function(response) {
                    if (response.status === 401) $location.path('/login');
                    return $q.reject(response);
                }
            };
        }]);
    
    $urlRouterProvider.otherwise('/create-order');
    
}])

.run(['$location', '$window', function($location, $window){
    if($window.sessionStorage.token){
        $location.path($location.path())
    }else{
        $location.path('/login');
    }
}])

