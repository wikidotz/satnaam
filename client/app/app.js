angular.module('hotelApp', [
    'ui.router', 
    'ngTouch', 
    'ui.bootstrap',
    'ui.slider', 
    'ngMaterial', 
    'angularMoment',
    'LocalForageModule',
    'ngWebSocket'
])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

    $stateProvider
    
    .state('home', {
        url: '/home',
        templateUrl: 'app/create-order/create-order.html',
        controller: 'OrderCtrl'
    })

    .state('orders', {
        url: '/orders',
        templateUrl: 'templates/order-list.html',
        controller: 'OrderListCtrl'
    })

    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
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
                config.headers['x-access-token'] = $window.sessionStorage.token;
                return config;
            },
            response: function(response) {
                return response;
            },
            responseError: function(response) {
                if (response.status === 401) $location.url('/login');
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

.service('Login', function($location, $window, $http) {

    this.login = function(username, password) {
        return $http.post('/login', {
            username: username,
            password: password
        }).then(function(data) {
            $window.sessionStorage.token = data.data.token;
            return data.data
        })
    }

    this.logout = function() {
        if (AuthenticationService.isLogged) {
            AuthenticationService.isLogged = false;
            delete $window.sessionStorage.token;
            $location.path("/");
        }
    }
})


.controller('LoginCtrl', function($scope, $location, Login) {
    


    $scope.login = function(e, loginInfo) {
        console.log(loginInfo);
        
        
        Login.login(loginInfo.uname, loginInfo.pass).then(function(response) {
            $location.path("/home");
        }, function(err){
            $scope.errorMsg = err.data.message;    
        });
    }

    
})


