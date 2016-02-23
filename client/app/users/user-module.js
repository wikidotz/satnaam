angular.module('usermgmt', ['ui.router', 'ui.bootstrap'])
    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider

        .state('app', {
            url: "/app",
            templateUrl: 'app/users/user-main.html',
            controller: 'AppCtrl'
        })

        .state('app.users', {
            url: "/users",
            controller: 'UsersCtrl',
            templateUrl: 'app/users/users.html'
        })

        .state('app.mode', {
            url: "/:mode",
            controller: 'AddEditUserCtrl',
            templateUrl: 'app/users/add-edit-view-user.html'
        })
    })


.service('UserService', function($http, $q) {

    this.userEdit = null;


    this.getUsers = function() {
        return $http.get('/customers').then(function(response) {
            return response.data;
        })
    }

    this.addUser = function(User) {
        return $http.post('customers/user', {
            user: User
        }).then(function(response) {
            return response.data;
        })
    }

    this.deleteUser = function(id) {
        return $http.delete('customers/user/' + id).then(function(response) {
            return response.data;
        })
    }

    this.updateUser = function(id, User) {
        return $http.put('customers/user/' + id, {
            user: User
        }).then(function(response) {
            return response.data;
        })
    }

    this.getUser = function(id) {
        return $http.get('customers/user/' + id).then(function(response) {
            return response.data;
        })
    }

    this.getAllBldgs = function(){
        return $http.get('customers/bldgs/').then(function(response){
            return response.data;
        })   
    }

    this.defaultCity = function(){
        return 'Mumbai';
    }

    this.defaultCountry = function(){
        return 'India';
    }

    this.defaultState = function(){
        return 'Maharashtra';
    }

})

.controller('AppCtrl', function($scope) {
    
})


.controller('AddEditUserCtrl', function($scope, $stateParams, $location, UserService) {

    $scope.mode = $stateParams.mode;

    function init() {

        if (($scope.mode == 'edit' || $scope.mode == 'view') && UserService.userEdit) {
            $scope.user = angular.copy(UserService.userEdit);
        } else if (!UserService.userEdit) {
            $location.path('/app/users');
        }

        UserService.getAllBldgs().then(function(data){
            $scope.allBldgs = data;
        });
    }

    init();

    $scope.addUser = function(user) {
        UserService.addUser(angular.copy(user)).then(function(user) {
            console.log('asasas')
            $scope.user = {};
            $location.path('/app/users');
        });
    }

    $scope.updateUser = function(user) {
        UserService.updateUser(user._id, angular.copy(user)).then(function(user) {
            $scope.user = {};
            $location.path('/app/users');
        });
    }

    $scope.userAddress = function(user){
        var tempArr = [];
        tempArr.push("Bldg:"+user.bldgName);
        tempArr.push("Wing:"+user.bldgWing);
        tempArr.push("Room:"+user.bldgRoomNo);
        tempArr.push("Near:"+user.landmark);
        tempArr.push("city:"+UserService.defaultCity);
        tempArr.push("state:"+UserService.defaultState);
        tempArr.push("country:"+UserService.defaultCountry);

        return tempArr.join(',');
    }


    $scope.reset = function(user)
    {
        //mukesh - check for optimised code
        user.custID = (user.custID>0)?user.custID:-1;
        user.name = "";
        user.nameCalled = "";
        user.mobile="";
        user.email="";
        user.bldgName ="";
        user.address = "";
        user.city = "";
        user.landmark = "";
        user.bldgRoomNo = "";
        user.bldgWing = "";
    }
})

.controller('UsersCtrl', function($scope, $location, UserService) {


    $scope.users = [];
    $scope.userSearchStr;

    UserService.getUsers().then(function(data) {
        $scope.users = data;
    })

    UserService.getAllBldgs().then(function(data){
            $scope.allBldgs = data;
    });

    $scope.gotoAddUser = function() {
        //$location.path('/app/users/add');
    }

    $scope.viewUser = function(user, index) {
        UserService.userEdit = angular.copy(user);
        $location.path('/app/view');
    }

    $scope.editUser = function(user, index) {

        UserService.userEdit = angular.copy(user);
        $location.path('/app/edit');
    }

    $scope.deleteUser = function(id, index) {
        UserService.deleteUser(id).then(function(res) {
            $scope.users.splice(index, 1);
        })
    }

    $scope.searchUser = function(searchValue){
        if(searchValue==undefined || searchValue.trim().length==0)
        {
            //show all users
        }else{
            //show users based on search value
        }

    }


})
