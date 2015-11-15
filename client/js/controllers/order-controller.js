angular.module('hotelApp')

.controller('IngredientsModalCtrl', function($scope, $uibModalInstance, product){

    function init(){
        $scope.product = product;

        if(!$scope.product.hasOwnProperty('ingredients')){

            $scope.product.ingredients = {
                items:[]
            };

            for (var i = 0; i < $scope.product.prod_qty; i++) {
                $scope.product.ingredients.items[i] = {
                    type:'MIX',
                    abbr: 'M',
                    selected: false
                }
            };
        }else{
            //$scope.product.ingredients.items.length == $scope.product.prod_qty
        }
    }

    init();

    $scope.isAllSelected = false;

    $scope.selectAll = function(){
        
        for (var i = 0; i < $scope.product.ingredients.items.length; i++) {
            $scope.product.ingredients.items[i].selected = !$scope.isAllSelected;
        };
    }

    $scope.toggleItemType = function(type, abbr){
        for (var i = 0; i < $scope.product.ingredients.items.length; i++) {

            if($scope.product.ingredients.items[i].selected){
                $scope.product.ingredients.items[i].type = type;
                $scope.product.ingredients.items[i].abbr = abbr;
                $scope.product.ingredients.items[i].selected = false;
            }
        };
        $scope.isAllSelected = false;
    }

    $scope.addQty = function(){
        product.prod_qty++;
        for (var i = 0; i < $scope.product.prod_qty; i++) {
            $scope.subitems.push({
                selected: false
            })
        };
    }
    $scope.lessQty = function(){
        if(product.prod_qty>1){
            product.prod_qty--;    
            for (var i = 0; i < $scope.product.prod_qty; i++) {
                $scope.subitems.push({
                    selected: false
                })
            };
        }

        
    }

    $scope.ok = function () {
        $uibModalInstance.close($scope.product);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})

.controller('OrderCtrl', function($scope, $window, $uibModal, Product, Customer, OrderService) {

    $scope.products = [];
    $scope.order = {};
    $scope.customers = [];
    $scope.order.customer = {};
    $scope.order.itemsInOrder = [];
    $scope.order.itemsInOrderMap = {};
    //$scope.order.totalQty = 0;
    $scope.order.order_total_amt = 0.00;
    $scope.order.order_token_no = 0;
    MAX_TOKEN_NUM = 100;
    START_TOKEN_NUM = 1;

    $scope.catid = 2

    function init() {

        $('#orderDateTime').datetimepicker();

        Product.getProducts().then(function(data) {
            $scope.products = data;
        })

        $scope.token = $window.sessionStorage.token;

        showCurrentDateTime();
        $scope.createNewOrderScreen();

        Customer.getAllCustomers().then(function(data){
            $scope.customers = data;
        })

        Product.getCategories().then(function(response){
            
            $scope.categories = response;
        })

        //categoryId
    }

    $scope.isDrawerOpen = false;
    $scope.drawerStyle = {
        'margin-left': 'calc(100% - 0px)'
    };

    $scope.isItemSelected = false;

    $scope.changeCategory = function(id){
        $scope.catid = id
    }

    $scope.getSelectedCat = function(id){
        return (id==catid)?'selected':'';
    }

    $scope.openIngredientsModal =  function(p){
        var modalInstance = $uibModal.open({
            animation: 'true',
            templateUrl: 'templates/modals/ingredients-modal.html',
            controller: 'IngredientsModalCtrl',
            size: 'md',
            resolve: {
                product: function () {
                    return p;
                }
            }
        });

        modalInstance.result.then(function (product) {
                p = product;
            }, function () {
                
        });
    }


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

    $scope.quantify = function() {

        return function(item) {
            return item;
        }
    }

    $scope.newOrder = function() {
        //var i = $scope.order.itemsInOrder.length;

        $scope.order.itemsInOrder = [];

        Product.getProducts().then(function(data) {
            $scope.products = data;
        })

        if ($scope.isDrawerOpen) {
            $scope.toggleDrawer()
        }
    }

    $scope.leftSwipe = function(product) {
        product.selected = true;
    }

    $scope.rightSwipe = function(product) {
        product.selected = false;
    }

    $scope.namePriceClass = function(product) {
        return (product.selected) ? 'selected' : '';
    }

    $scope.lessItem = function(product) {

        var p = $scope.order.itemsInOrderMap[product.prod_id];

        var index = -1;

        for (var i = 0; i < $scope.order.itemsInOrder.length; i++) {
            if ($scope.order.itemsInOrder[i].prod_id == product.prod_id) {
                index = i;
                break;
            }
        };

        if (p.prod_qty > 0) {
            p.prod_qty--;
        } 

        if (p.prod_qty == 0) {
            product.selected = false;
            $scope.order.itemsInOrder.splice(index, 1);
            delete $scope.order.itemsInOrderMap[p.prod_id];
        } else {
            $scope.order.itemsInOrderMap[p.prod_id] = p;
        }

        $scope.calTotalAmt();
    }

    $scope.addItem = function(product) {

        var p = angular.copy(product);
        $scope.order.itemsInOrder.push(product);

        
        product.prod_qty++;
        if(product.prod_qty==1){
            product.selected = true;
        }
        
        $scope.order.itemsInOrderMap[product.prod_id] = product;

        $scope.order.order_total_qty = $scope.order.itemsInOrder.length;
        $scope.calTotalAmt();
    }

    $scope.getProductCount = function(product) {
        if (!product.hasOwnProperty('prod_qty')) {
            product.prod_qty = 0;
        }

        return product.prod_qty;

    }

    $scope.calTotalAmt = function() {
        var tempTotalAmt = 0.00;
        var qty = 0;
        for (var product in $scope.order.itemsInOrderMap) {
            tempTotalAmt += ($scope.order.itemsInOrderMap[product].prod_qty * $scope.order.itemsInOrderMap[product].prod_rate);
            qty += $scope.order.itemsInOrderMap[product].prod_qty;
        }
        $scope.order.order_total_amt = tempTotalAmt;
        $scope.order.order_total_qty = qty;

    }

    $scope.createNewOrderScreen = function() {
        if ($scope.order.order_token_no == MAX_TOKEN_NUM) {
            $scope.order.order_token_no = START_TOKEN_NUM;
        } else {
            $scope.order.order_token_no++;
        }

        $scope.order.itemsInOrder = [];
        $scope.order.order_status = 1;
        $scope.order.order_pay_status = "none";
        $scope.order.order_mng_emp_id = 1;
    }

    $scope.createOrder = function() {

        $scope.order.time = new Date().getTime();

        OrderService.createOrder($scope.order).then(function(response) {
            Customer.addCustomer($scope.order.customer);
            $scope.order = {};
        })
    }


    /**
        use safrApply instead of apply to prevent error 
    */
    $scope.safeApply = function(fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && typeof(fn) === 'function') {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    }

    $scope.payOrder = function() {

    }

    $scope.onSelectCustomer = function(item, model, label){
        $scope.order.customer = angular.copy(item);
    }



    $scope.submitOrder = function() {
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

    /*$scope.onCustomerSelect = function($item, $model, $label) {
        Customer.getCustomerInfoByCustomerCode($item.cust_id).then(function(response) {
            $scope.order.customer = response;
        });
    }*/

    function onOrderSubmitError() {
        alert("Error in order submit");
    }

    function calcCurrentDateTime() {
        var d = new Date();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var year = d.getFullYear();
        return {
            year: year,
            month: month,
            day: day,
            date: d,
            hr: d.getHours(),
            min: d.getMinutes()
        };
    }

    function formatDateTime(targetDateObj) {
        var formattedDate = targetDateObj.year + '/' + targetDateObj.month + '/' + targetDateObj.day + ' ';
        formattedDate += targetDateObj.hr + ':' + targetDateObj.min + ':0';
        return formattedDate;
    }

    function showCurrentDateTime() {
        var currentDateTimeObj = calcCurrentDateTime();
        $("#orderDateTime").val(+"" + currentDateTimeObj.day + "/" + currentDateTimeObj.month + "/" + currentDateTimeObj.year + " | " + "" + currentDateTimeObj.hr + ":" + currentDateTimeObj.min);

    }

    init();

})
