angular.module('hotelApp', ['ui.router', 'ngTouch', 'ui.bootstrap', 'ngMaterial', 'angularMoment'])

.config(function($stateProvider, $urlRouterProvider, $httpProvider  ) {

    $stateProvider
    // HOME STATES AND NESTED VIEWS ========================================
    .state('home', {
        url: '/home',
        templateUrl: 'templates/partial-home.html',
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

    $urlRouterProvider.otherwise('/login');

    //$httpProvider.interceptors.push('TokenInterceptor');
    $httpProvider.interceptors.push(function($q, $location) {
        return {
            response: function(response) {
                return response;
            },
            responseError: function(response) {
                if (response.status === 401) $location.url('/login');
                return $q.reject(response);
            }
        };
    });

    console.log('Hello')


})

.factory('AuthenticationService', function() {
    var auth = {
        isLogged: false
    }

    return auth;
})


.factory('UserService', function($http) {
    return {
        logIn: function(username, password) {
            return $http.post('/login', {
                username: username,
                password: password
            });
        },

        isLoggedin: function(){
            return $http.get('/loggedIn');
        },

        logOut: function() {

        }
    }
})



.service('Login', function($location, $window, UserService, AuthenticationService) {


    this.login = function(username, password) {
        console.log(username + '\t' + password)
        if (username !== undefined && password !== undefined) {

            UserService.logIn(username, password).success(function(data) {
                AuthenticationService.isLogged = data.success;
                $window.sessionStorage.token = data.token;
                $location.path("/home");
            }).error(function(status, data) {
                console.log(status);
                console.log(data);
            });
        }
    }

    this.logout = function() {
        if (AuthenticationService.isLogged) {
            AuthenticationService.isLogged = false;
            delete $window.sessionStorage.token;
            $location.path("/");
        }
    }
})



.controller('LoginCtrl', function($scope, Login) {
    console.log('in login controller..');

    $scope.login = function(uname, pass) {
        console.log(uname + '\t' + pass);
        Login.login(uname, pass);
    }


})
