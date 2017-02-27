angular.module('usermgmt', ['ui.router', 'ui.bootstrap'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $stateProvider

        .state('users', {
            url: "/users",
            templateUrl: 'app/users/user-main.html',
        })

        .state('users.list', {
            url: "/list",
            controller: 'UsersCtrl',
            templateUrl: 'app/users/users.html'
        })

        .state('users.mode', {
            url: "/:mode",
            controller: 'AddEditUserCtrl',
            templateUrl: 'app/users/add-edit-view-user.html'
        })

        
    }])


.service('UserService', ['$http', '$q', function($http, $q) {

    this.userEdit = null;
    var userMap = {};

    this.getUsers = function() {
        return $http.get('/customers').then(function(response) {
            console.log(response.data.length)

            for (var i = 0; i < response.data.length; i++) {
                userMap[response.data[i].custID] = response.data[i];
                //console.log(response.data[i])
            }
            // for (var i = 0; i < response.data.length; i++) {
            //     this.userMap[response.data[i].custID] = response.data[i];
            // }            

            return response.data;
        })
    }

    this.getCustByIdSync = function(id) {
        return userMap[id];
    }

    this.custEditView = function(id){
        this.userEdit = this.getCustByIdSync(id);
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

}])

.filter('parseJSONObj',function(){
    return function(input,prop){
       if(input==undefined)
       {
        return "";
       }
       
        console.log(JSON.parse(input));
        return JSON.parse(input)[prop];
    }
})


.controller('AddEditUserCtrl', ['$scope', '$stateParams', '$location', 'UserService', function($scope, $stateParams, $location, UserService) {

    $scope.mode = $stateParams.mode;

    function init() {

        console.log($scope.mode)
        console.log(UserService.userEdit)

        if (($scope.mode == 'edit' || $scope.mode == 'view') && UserService.userEdit) {
            $scope.user = angular.copy(UserService.userEdit);
        } 

        if (!UserService.userEdit) {
            $location.path('/users/list');
        }

        UserService.getAllBldgs().then(function(data){
            $scope.allBldgs = data;
        });
    }

    init();

    $scope.addUser = function(user) {
        user.address = $scope.userAddress(user);
        UserService.addUser(angular.copy(user)).then(function(user) {
            $scope.user = {};
            $location.path('/users/list');
        });
    }

    $scope.updateUser = function(user) {
        user.address = $scope.userAddress(user);
        UserService.updateUser(user._id, angular.copy(user)).then(function(user) {
            $scope.user = {};
            $location.path('/users/list');
        });
    }

    $scope.userAddress = function(user){
        var tempArr = [];

        tempArr.push("Bldg:"+JSON.parse(user.bldg).bldgName+"("+JSON.parse(user.bldg).bldgAcr+")"||'NA');
        tempArr.push("Wing:"+user.bldgWing||'NA');
        tempArr.push("Room:"+user.bldgRoomNo||'NA');
        tempArr.push("Near:"+user.landmark||'NA');
        tempArr.push("city:"+UserService.defaultCity()||'NA');
        tempArr.push("state:"+UserService.defaultState()||'NA');
        tempArr.push("country:"+UserService.defaultCountry()||'NA');

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
}])

.controller('UsersCtrl', ['$scope', '$location', '$filter', 'UserService', function($scope, $location,$filter, UserService) {


    $scope.users = [];
    $scope.userSearchStr;

    var columnDefs = [
        {headerName: "ID", field: "custID", width:50},
        {headerName: "Name", field: "name", filter: 'text'},
        {headerName: "Mobile", field: "mobile"},
        {headerName: "Wing", field: "bldgWing", width:100},
        //{headerName: "Desc", field: "prod_desc"},
        {headerName: "Room No. / Shop No.", field: "bldgRoomNo", width:80},
        {headerName: "Building", field: "bldg", width:100},
        {headerName: "Address", field: "address", width:250},

        {headerName: "Edit/Delete",  width: 100, 
            cellRenderer: function (params) {      // Function cell renderer
                return createButtons (params);
            }
        }
    ];

    function createButtons(params){
        //console.log()
        return '<a ng-click="viewUser('+params.data.custID+')" class="anchor-btn" href=""><i class="fa fa-eye" aria-hidden="true"></i></a>'+
                '<a ng-click="editUser('+params.data.custID+')" class="anchor-btn" href=""><i class="fa fa-pencil" aria-hidden="true"></i></a>';
    }

    $scope.gridOptions = {
        columnDefs: columnDefs,
        angularCompileRows: true,
        enableFilter: true,
        enableSorting: true,
        animateRows: true

    };

    UserService.getUsers().then(function(data) {
        $scope.users = data;
        $scope.gridOptions.api.setRowData(data);
    })

    UserService.getAllBldgs().then(function(data){
            $scope.allBldgs = data;
    });

    $scope.gotoAddUser = function() {
        //$location.path('/app/users/add');
    }

    $scope.viewUser = function(id) { //custEditView
        UserService.custEditView(id)
        $location.path('/users/view/');
    }

    $scope.editUser = function(id) {
        UserService.custEditView(id)
        $location.path('/users/edit');
    }

    $scope.deleteUser = function(id, index) {
        UserService.deleteUser(id).then(function(res) {
            $scope.users.splice(index, 1);
        })
    }

}])
