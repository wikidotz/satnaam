angular.module('hotelApp')

.controller('OrderCtrl', function($scope, Product,Customer, OrderService) {

    $scope.products = [];
    $scope.order = {};
    $scope.customers = [];
    $scope.order.customer = {cust_id:0,cust_first_name:'',cust_last_name:'',cust_nick_name:'',cust_mobile:'',
    cust_email:'',cust_desc:'',cust_address1:'',cust_city1:'',cust_state1:'',cust_address2:'',cust_city2:'',
    cust_state2:''};

    $scope.order.itemsInOrder=[];
    //$scope.order.totalQty = 0;
    $scope.order.order_total_amt = 0.00;
    $scope.order.order_token_no = 0;
    MAX_TOKEN_NUM = 100;
    START_TOKEN_NUM = 1;
    function init() {

        $('#orderDateTime').datetimepicker();

        Product.getProducts().then(function(data) {
            logger().log("info","loading products data");
            $scope.products = data;
        })

        /*Customer.getAllCustomers().then(function(data){
            logger().log("info","loading all customers data");
            $scope.customers = data;  
        },function(err){

        })*/


        //initialise bootstrap date time picker in order detail page
        /*$("#orderDateTime").datepicker({
        	format:'dd-mm-yyyy hh:mm'
        });*/
        //Customer.getAllCustomers().then(function(data){
          //logger().log("info","loading all customers");
            //$scope.customers = data;  
        //})
        showCurrentDateTime();
        $scope.createNewOrderScreen();

        
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
        //$scope.$digest();
        //while opening order details section show current date and time
        showCurrentDateTime();
    }

   
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
		for (var i = 0; i < $scope.order.itemsInOrder.length; i++) {
    		if($scope.order.itemsInOrder[i].OP_PROD_ID == product.prod_id){
    			$scope.order.itemsInOrder.splice(i,1);
    			break;
    		}
    	};

    	product.OP_QUANTITY--;
        $scope.calTotalAmt();
    }

    $scope.addItem = function(product){

        if(product!=undefined)
        {
            if (!product.hasOwnProperty('OP_QUANTITY')) {
            product.OP_QUANTITY = 0;
            } else{
                product.OP_QUANTITY++;
            }

            //$scope.order.itemsInOrder.push(castToOrderedProductFactory.castToOrderedProduct(product));
            //copy deep copy into itemsInOrder
            $scope.order.itemsInOrder.push(angular.copy(product));
            $scope.order.order_total_qty = $scope.order.itemsInOrder.length;
            $scope.calTotalAmt();    
        }
        
    }

    $scope.getProductCount = function(product) {
        if (!product.hasOwnProperty('OP_QUANTITY')) {
            product.OP_QUANTITY = 0;
        }

        return product.OP_QUANTITY;

    }

    $scope.calTotalAmt = function(){
        var tempTotalAmt = 0.00;
        for(var i=0;i<$scope.order.itemsInOrder.length;i++)
        {
            tempTotalAmt += ($scope.order.itemsInOrder[i].OP_QUANTITY * $scope.order.itemsInOrder[i].prod_rate);
        }
        $scope.order.order_total_amt = tempTotalAmt;
        
    }

    $scope.createNewOrderScreen = function(){
        if($scope.order.order_token_no==MAX_TOKEN_NUM)
        {
            $scope.order.order_token_no = START_TOKEN_NUM;
        }else
        {
            $scope.order.order_token_no++;    
        }    
        
        $scope.order.itemsInOrder = [];
        $scope.order.order_status = 1;
        $scope.order.order_pay_status = "none";
        $scope.order.order_mng_emp_id = 1;
    }

    $scope.createOrder = function(){
        
        OrderService.createOrder($scope.order).then(function(response){
            
        })
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

    $scope.payOrder = function(){

    }



    $scope.submitOrder = function(){

        //logger().log('info',{$scope.order});
        $scope.order.cust_id = 1;
        $scope.order.order_table_no = 1;
        $scope.order.order_expct_time = 0;
        $scope.order.order_date = formatDateTime(calcCurrentDateTime());
        $scope.order.mode = 'create';
         /*Order.createNewOrder($scope.order).then(function(response) {
            if(response==undefined)
            {
                onOrderSubmitError();
            }else if(response.data!=undefined && response.data.code!=undefined && response.data.code.toUpperCase()=="ORDER_SUBMIT_SUCCESS")
            {
                alert("order submit successfully");    
                $scope.$emit('ORDER_SUBMIT_SUCCESS');
                $scope.createNewOrderScreen();
            }else
            {
               onOrderSubmitError();
            }
            
           // $scope.products = data;
        },
        function(err){
            onOrderSubmitError();

        })*/
    }

    $scope.onCustomerSelect = function($item, $model, $label) {
        Customer.getCustomerInfoByCustomerCode($item.cust_id).then(function(response) {
            $scope.order.customer = response;
        });
    }

    function onOrderSubmitError(){
         alert("Error in order submit");
         logger().log("info","Error in order submit");
    }
    
    function calcCurrentDateTime(){
    	var d = new Date();
		var month = d.getMonth()+1;
		var day = d.getDate();
		var year = d.getFullYear();
		return {year:year,month:month,day:day,date:d,hr:d.getHours(),min:d.getMinutes()};
    }

    function formatDateTime(targetDateObj){
        var formattedDate  = targetDateObj.year+'/'+targetDateObj.month+'/'+targetDateObj.day+' ';
        formattedDate  += targetDateObj.hr+':'+targetDateObj.min+':0';
        return formattedDate;
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
