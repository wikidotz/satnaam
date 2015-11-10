angular.module('hotelApp')

.controller('HomeCtrl', function($scope, Product) {

    $scope.products = [];

    function init() {

        Product.getProducts().then(function(data) {
            console.log("products data");
            console.log(data);
            $scope.products = data;
        })
    }

    $scope.isDrawerOpen = false;
    $scope.drawerStyle = {
        'margin-left': 'calc(100% - 0px)'
    };

    $scope.isItemSelected = false;

    $scope.toggleDrawer = function() {
        if ($scope.isDrawerOpen) {
            $scope.drawerStyle = {
                'margin-left': 'calc(100% - 0px)'
            };

        } else {
            $scope.drawerStyle = {
                'margin-left': 'calc(100% - 320px)'
            };
        }
        $scope.isDrawerOpen = !$scope.isDrawerOpen;
    }


    $scope.ordersArray = [];

    $scope.leftSwipe = function(product) {
    	product.selected = true;
    }

    $scope.rightSwipe = function(product) {
    	product.selected = false;
    }

    $scope.namePriceClass = function(product){
    	return (product.selected) ? 'selected' : '';
    }

    $scope.lessItem = function(product){
//    	product.count--;
    	for (var i = 0; i < $scope.ordersArray.length; i++) {
    		if($scope.ordersArray[i].prod_id == product.prod_id){
    			$scope.ordersArray.splice(i,1);
    			break;
    		}
    	};

    	product.count--;
    }

    

    $scope.addItem = function(product){

        if (!product.hasOwnProperty('count')) {
            product.count = 0;
        } else

            product.count++;

        $scope.ordersArray.push(product);
    }

    $scope.getProductCount = function(product) {
        if (!product.hasOwnProperty('count')) {
            product.count = 0;
        }

        return product.count;

    }



    init();

})
