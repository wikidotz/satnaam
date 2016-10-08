angular.module('hotelApp')

.controller('LoginCtrl', function($scope, $location, Login) {

    $scope.login = function(e, loginInfo) {
        Login.login(loginInfo.uname, loginInfo.pass).then(function(response) {
            $location.path("/create-order");
        }, function(err){
            $scope.errorMsg = err.data.message;
        });
    }
})