angular.module('productsmgmnt', ['ui.router', 'ui.bootstrap'])
    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider

        .state('products', {
            url: "/products",
            templateUrl: 'app/products/products-main.html'
        })

        .state('products.list', {
            url: "/list",
            controller: 'ProductsCtrl',
            templateUrl: 'app/products/products.html'
        })

        .state('products.mode', {
            url: "/:mode",
            controller: 'AddEditProductCtrl',
            templateUrl: 'app/products/add-edit-view-product.html'
        })
    })


.service('ProductService', function($http, $q) {

    this.productEdit = null;

    this.getProducts = function() {
        return $http.get('/products').then(function(response) {
            return response.data;
        })
    }

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


.controller('AddEditProductCtrl', function($scope, $stateParams, $location, ProductService) {

    $scope.mode = $stateParams.mode;

    function init() {

        if (($scope.mode == 'edit' || $scope.mode == 'view') && ProductService.productEdit) {
            $scope.product = angular.copy(ProductService.productEdit);
        }/* else if (!ProductService.productEdit) {
            $location.path('/app/users');
        }else{

        }

        ProductService.getAllBldgs().then(function(data){
            $scope.allBldgs = data;
        });*/
    }

    init();

    $scope.addUser = function(user) {
        user.address = $scope.userAddress(user);
        ProductService.addUser(angular.copy(user)).then(function(user) {
            console.log('addUser');
            $scope.user = {};
            $location.path('/app/users');
        });
    }

    $scope.updateUser = function(user) {
        user.address = $scope.userAddress(user);
        ProductService.updateUser(user._id, angular.copy(user)).then(function(user) {
            $scope.user = {};
            $location.path('/app/users');
        });
    }

    $scope.userAddress = function(user){
        var tempArr = [];

        tempArr.push("Bldg:"+JSON.parse(user.bldg).bldgName+"("+JSON.parse(user.bldg).bldgAcr+")"||'NA');
        tempArr.push("Wing:"+user.bldgWing||'NA');
        tempArr.push("Room:"+user.bldgRoomNo||'NA');
        tempArr.push("Near:"+user.landmark||'NA');
        tempArr.push("city:"+ProductService.defaultCity()||'NA');
        tempArr.push("state:"+ProductService.defaultState()||'NA');
        tempArr.push("country:"+ProductService.defaultCountry()||'NA');

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

.controller('ProductsCtrl', function($scope, $location,$filter, ProductService) {


    $scope.users = [];
    $scope.userSearchStr;

    ProductService.getProducts().then(function(data) {
        console.log(data)
        $scope.products = data;
    })

    ProductService.getAllBldgs().then(function(data){
            $scope.allBldgs = data;
    });

    $scope.gotoAddUser = function() {
        //$location.path('/app/users/add');
    }

    $scope.viewProduct = function(user, index) {
        ProductService.productEdit = angular.copy(user);
        $location.path('/products/view');
    }

    $scope.editProduct = function(user, index) {

        ProductService.productEdit = angular.copy(user);
        $location.path('/products/edit');
    }

    $scope.deleteProduct = function(id, index) {
        ProductService.deleteUser(id).then(function(res) {
            $scope.users.splice(index, 1);
        })
    }

})
