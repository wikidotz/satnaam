angular.module('productsmgmnt', ['ui.router', 'ui.bootstrap'])
    .config([ '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

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
    }])


.service('ProductService', ['$http', '$q', function($http, $q) {

    this.productEdit = null;

    this.getProducts = function() {
        return $http.get('/products').then(function(response) {
            return response.data;
        })
    }

    this.getCategories = function() {
        return $http.get('/products/categories').then(function(response) {
            return response.data;
        })
    }

    this.addCategory = function(name){
        return $http.post('/products/categories/category', {
            category_name: name
        }).then(function(response) {
            return response.data;
        })   
    }

    this.addProduct = function(product) {
        return $http.post('products/product', {
            product: product
        }).then(function(response) {
            return response.data;
        })
    }

    this.deleteProduct = function(id) {
        return $http.delete('products/product/' + id).then(function(response) {
            return response.data;
        })
    }

    this.updateProduct = function(id, User) {
        return $http.put('products/product/' + id, {
            product: User
        }).then(function(response) {
            return response.data;
        })
    }

    this.getUser = function(id) {
        return $http.get('products/product/' + id).then(function(response) {
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


.controller('AddEditProductCtrl', ['$scope', '$stateParams', '$location', 'ProductService', function($scope, $stateParams, $location, ProductService) {

    $scope.mode = $stateParams.mode;

    function init() {

        if (($scope.mode == 'edit' || $scope.mode == 'view') && ProductService.productEdit) {
            $scope.product = angular.copy(ProductService.productEdit);
        }else{
            $scope.product = {};
        }

        /* else if (!ProductService.productEdit) {
            $location.path('/app/users');
        }else{

        }

        ProductService.getAllBldgs().then(function(data){
            $scope.allBldgs = data;
        });*/

        $scope.product.prod_available = true;

        ProductService.getCategories().then(function(data){
            $scope.categories = data;
            $scope.category = {
                category_name: 'Select Category',
                category_id: -1
            }
        });
    }



    init();

    $scope.addingCategory = false;

    $scope.addCategory = function(){

        if($scope.addingCategory){
            if($scope.newCategory != ''){
                ProductService.addCategory($scope.newCategory).then(function(data){
                    $scope.addingCategory = false;
                    $scope.categories.push(data);
                    $scope.category = data;
                })
            }
        }else{
            $scope.addingCategory = true;
        }
        
    }

    $scope.addProduct = function(product) {
        product.prod_category_name = $scope.category.category_name;
        product.prod_category_id = $scope.category.category_id;
        

        ProductService.addProduct(angular.copy(product)).then(function(response) {
            $scope.product = {};
            $location.path('/products/list');
        });
    }

    $scope.updateUser = function(user) {
        //user.address = $scope.userAddress(user);
        ProductService.updateProduct(user._id, angular.copy(user)).then(function(user) {
            $scope.user = {};
            $location.path('/products');
        });
    }



    $scope.reset = function(obj)
    {
        obj = {};
    }
}])

.controller('ProductsCtrl', ['$scope', '$location', '$filter', 'ProductService', function($scope, $location,$filter, ProductService) {


    $scope.users = [];
    $scope.userSearchStr;

    ProductService.getProducts().then(function(data) {
        console.log(data)
        $scope.products = data;
    })

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
        ProductService.deleteProduct(id).then(function(res) {
            $scope.products.splice(index, 1);
        })
    }

}])
