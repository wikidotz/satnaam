angular.module('hotelApp')

.service('Login', ['$location', '$window', '$http', function($location, $window, $http) {

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
}])