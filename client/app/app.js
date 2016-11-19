angular.module('hotelApp', [
    'ui.router',
    'ngTouch',
    'ui.bootstrap',
    'ui.slider',
    'ngMaterial',
    'angularMoment',
    'LocalForageModule',
    'usermgmt'
])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

    $stateProvider

        .state('createOrder', {
            url: '/create-order',
            templateUrl: 'app/create-order/create-order.html',
            controller: 'OrderCtrl'
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
        })  

    $urlRouterProvider.otherwise('/login');

    //$httpProvider.interceptors.push('TokenInterceptor');
    $httpProvider.interceptors.push(function($q, $location, $window) {
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
    });
})

.run(function($location, $window){
    if($window.sessionStorage.token){
        $location.path($location.path())
    }else{
        $location.path('/login');
    }
})
