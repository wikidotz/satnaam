angular.module('hotelApp')

.controller('OrderCtrl', function($scope, Product) {

    $scope.products = [];
    $scope.customer = {id:0,name:''};
    $scope.currentOrder= {};
    $scope.itemsInOrder=[{productname:'sevpuri',qty:2,rate:30.00,amount:60.00,isparcel:0},
                        {productname:'sp.veg cheese grill',qty:2,rate:90.00,amount:180.00,isparcel:1}];
    $scope.totalQty = 0;
    $scope.totalAmt = 0.00;

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
        $scope.$digest();
        //while opening order details section show current date and time
        showCurrentDateTime();
    }

    $scope.itemsInOrder = [];

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
		console.log($scope.itemsInOrder)
    	for (var i = 0; i < $scope.itemsInOrder.length; i++) {
    		if($scope.itemsInOrder[i].prod_id == product.prod_id){
    			$scope.itemsInOrder.splice(i,1);
    			break;
    		}
    	};

    	console.log($scope.itemsInOrder)

    	product.count--;
    }

    

    $scope.addItem = function(product){

        if (!product.hasOwnProperty('count')) {
            product.count = 0;
        } else

            product.count++;

        $scope.itemsInOrder.push(product);
    }

    $scope.getProductCount = function(product) {
        if (!product.hasOwnProperty('count')) {
            product.count = 0;
        }

        return product.count;

    }

    $scope.createNewOrderScreen = function(){
        $scope.itemsInOrder = [];
    }

    /**
        use safrApply instead of apply to prevent error 
    */
    $scope.safeApply = function(fn){
        var phase  = this.$root.$$phase;
        if(phase == '$apply' || phase=='$digest')
        {
            if(fn && typeof(fn) === 'function')
            {
                fn();
            }
        }else
        {
            this.$apply(fn);
        }
    }

    
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
