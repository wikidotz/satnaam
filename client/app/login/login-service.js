angular.module('hotelApp')

.service('Login', ['$location', '$window', '$http', '$q', function($location, $window, $http, $q) {

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

    this.isLogin = function (){
        return !!$window.sessionStorage.token;
    }
}])