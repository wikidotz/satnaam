angular.module('hotelApp')

.controller('OrderCtrl', function($scope, Product) {

    $scope.products = [];

    function init() {

        Product.getProducts().then(function(data) {
            console.log("products data");
            console.log(data);
            $scope.products = data;
        })


        //initialise bootstrap date time picker in order detail page
        /*$("#orderDateTime").datepicker({
        	format:'dd-mm-yyyy hh:mm'
        });*/

        showCurrentDateTime();
        
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
        //while opening order details section show current date and time
        showCurrentDateTime();
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
		console.log($scope.ordersArray)
    	for (var i = 0; i < $scope.ordersArray.length; i++) {
    		if($scope.ordersArray[i].prod_id == product.prod_id){
    			$scope.ordersArray.splice(i,1);
    			break;
    		}
    	};

    	console.log($scope.ordersArray)

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


    $scope.currentOrder= {};

    function calcCurrentDateTime(){
    	var d = new Date();
		var month = d.getMonth()+1;
		var day = d.getDate();
		var year = d.getFullYear();
		console.log("day="+day+",date["+d+"]");
		return {year:year,month:month,day:day,date:d,hr:d.getHours(),min:d.getMinutes()};
    }

    function showCurrentDateTime(){
    	var currentDateTimeObj = calcCurrentDateTime();
        $("#orderDateTime").val(
        		+""+currentDateTimeObj.day
        		+"/"+currentDateTimeObj.month
        		+"/"+currentDateTimeObj.year
        		+" | "
        		+""+currentDateTimeObj.hr
        		+":"+currentDateTimeObj.min);

    }

    init();

})
