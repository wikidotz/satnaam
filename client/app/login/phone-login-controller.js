
angular.module('hotelApp')
.controller('PhoneLoginCtrl', function($scope, $location, Login) {
    
    $scope.login = function(e, loginInfo) {
        console.log(loginInfo);
        Login.login(loginInfo.uname, loginInfo.pass).then(function(response) {
            $location.path('/create-order');
        }, function(err){
            $scope.errorMsg = err.data.message;    
        });
    }
})