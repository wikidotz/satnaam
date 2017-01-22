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

    var productsMap = {};

    this.getProducts = function() {
        return $http.get('/products').then(function(response) {
            for (var i = 0; i < response.data.length; i++) {
                productsMap[response.data[i].prod_id] = response.data[i];
            }
            return response.data;
        })
    }

    this.getProductsByIdSync = function(id) {
        return productsMap[id];
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

    this.productEditView = function(id){
        this.productEdit = this.getProductsByIdSync(id);
    }

}])

.filter('parseJSONObj',function(){
    return function(input,prop){
       if(input==undefined)
       {
        return "";
       }
       
        return JSON.parse(input)[prop];
    }
})


.controller('AddEditProductCtrl', ['$scope', '$stateParams', '$location', 'ProductService', function($scope, $stateParams, $location, ProductService) {

    $scope.mode = $stateParams.mode;

    function init() {

        if (ProductService.productEdit == null) {
            $location.path('/products/list');
            return
        }

        if (($scope.mode == 'edit' || $scope.mode == 'view') && ProductService.productEdit) {
            $scope.product = angular.copy(ProductService.productEdit);
            $scope.category = {
                category_name: $scope.product.prod_category_name,
                category_id: $scope.product.prod_category_id
            }
        }else{
            $scope.product = {};
            $scope.category = null
        }



        /*ProductService.getAllBldgs().then(function(data){
            $scope.allBldgs = data;
        });*/
        console.log()
        $scope.product.prod_available = true;

        ProductService.getCategories().then(function(data){
            $scope.categories = data;
            if($scope.category){
                $scope.category = {
                    category_name: 'Select Category',
                    category_id: -1
                }    
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
            $location.path('/products/list');
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



    var allProducts = [];
    var columnDefs = [
        {headerName: "ID", field: "prod_id", width:50},
        {headerName: "Display Name", field: "prod_dispname", filter: 'text'},
        {headerName: "Category Name", field: "prod_category_name"},
        {headerName: "Rate", field: "prod_rate", width:80},
        {headerName: "Ingredients", field: "prod_ingredients", width:100},
        //{headerName: "Desc", field: "prod_desc"},
        {headerName: "Pre Max Time (sec)", field: "prod_pre_max_time_sec", width:80},
        {headerName: "Size", field: "prod_size", width:100},
        {headerName: "Veg/Nonveg", field: "prod_veg_nonveg", width:100},
        {headerName: "Weight", field: "prod_weight", width:100},
        {headerName: "Edit/Delete",  width: 100, 
            cellRenderer: function (params) {      // Function cell renderer
                return createButtons (params);
            }
        }
    ];

    function createButtons(params){
        //console.log()
        return '<a ng-click="viewProduct('+params.data.prod_id+')" class="anchor-btn" href=""><i class="fa fa-eye" aria-hidden="true"></i></a>'+
                '<a ng-click="editProduct('+params.data.prod_id+')" class="anchor-btn" href=""><i class="fa fa-pencil" aria-hidden="true"></i></a>';
    }

    ProductService.getCategories().then(function(data){
        $scope.categories = data;
        $scope.selected_cat = {
            category_name: 'Select Category',
            category_id: -1
        }
    });

    $scope.categoryChange = function(){

        $scope.products = [];
        allProducts.map(function(product){
            
            if(product.prod_category_id == $scope.selected_cat.category_id){
                $scope.products.push(product)    
            }
        })
    }

    $scope.gridOptions = {
        columnDefs: columnDefs,
        angularCompileRows: true,
        enableFilter: true,
        enableSorting: true,
        animateRows: true

    };

    ProductService.getProducts().then(function(data) {
        allProducts = angular.copy(data);
        $scope.products = data;

        $scope.gridOptions.api.setRowData(data);
    })

    function createRowData(){
        return $scope.products
    }

    $scope.gotoAddUser = function() {
        //$location.path('/app/users/add');
    }

    $scope.viewProduct = function(id) {
        ProductService.productEditView(id);// = getProductsByIdSync(id)
        $location.path('/products/view');
    }

    $scope.editProduct = function(id) {
        //ProductService.productEdit = getProductsByIdSync(id)
        ProductService.productEditView(id);
        $location.path('/products/edit');
    }

    $scope.deleteProduct = function(id, index) {
        ProductService.deleteProduct(id).then(function(res) {
            $scope.products.splice(index, 1);
        })
    }

    

}])
