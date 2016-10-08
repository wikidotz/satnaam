angular.module('hotelApp')


.factory('SubProduct', function() {

    function SubProduct(product) {
        SubProduct.prototype = product.prototype;
    }

    return (SubProduct);
})

.factory('TransactionFactory',function(){

    var transaction ={};
    transaction.createOrderBill = function(order){
        var transaction = {};
        transaction.order = order;
        transaction.bill_no = 0;

        transaction.paid_amt = order.paid_amt;
        transaction.bal_amt = order.bal_amt;
        transaction.modified_by = "admin";
        transaction.last_modified_date_time = new Date();
        transaction.desc = "Bill for order";
        transaction.mode = "CASH";
        transaction.order_id_str = order.order_id_str;
        transaction.order_total_qty = order.order_total_qty;
        transaction.tran_date_time = new Date();
        transaction.order_total_amt = order.order_total_amt;
        //transaction.bal_amt = $scope.orderorder_total_amt - $scope.transaction.paidAmt;

        transaction.type = "ORDER_PAYMENT";

        return transaction;
    }
    return transaction;
})
.filter('parseJSONObj',function(){
    return function(input,prop){
       if(input==undefined)
       {
        return "";
       }

        return JSON.parse(input)[prop];
    }
})

.controller('OrderCtrl', function($scope, $location, $timeout, $window, $uibModal, $stateParams, SubProduct, Product, Customer, OrderService, TransactionFactory) {

    $scope.isProductsLoaded = false;
    $scope.products = [];
    $scope.customers = [];
    $scope.showOrderDetail = true;
    $scope.sideBarOrderDetailOpen = false;
    $scope.editMode = $stateParams.hasOwnProperty('id');

    if($scope.editMode && !OrderService.isOrderEdit()){
        $location.path('/create-order')
    }


    //new code
    MAX_TOKEN_NUM = 100;
    START_TOKEN_NUM = 1;


    $scope.catid = 2;

    function init() {

        $('#orderDateTime').datetimepicker();
        $("[name='order-paid']").bootstrapSwitch();

        Product.getProducts().then(function(data) {
            $scope.productsUnchanged = angular.copy(data);
            $scope.products = data;
            $scope.isProductsLoaded = true;
            if($scope.editMode){
                $timeout(function(){
                    $scope.order = OrderService.getOrderToEdit();

                    for (var i = 0; i < $scope.products.length; i++) {
                        var key = $scope.products[i].prod_id
                        for (var j = 0; j < $scope.order.itemsInOrder.length; j++) {
                            if($scope.order.itemsInOrder[j].prod_id == key){
                                $scope.products[i] = angular.copy($scope.order.itemsInOrder[j]);    
                                $scope.products[i].selected = true;
                            }
                        }


                    }
                },100)
            }

            if($scope.editMode) {
                
            }
            
        })

        $scope.token = $window.sessionStorage.token;

        showCurrentDateTime();
        $scope.initNewOrderObj();
        //$scope.initNewTransactionObj();

        //fetch all customers record from online db
        $scope.refreshCustomerList();
        Product.getCategories().then(function(response) {

            $scope.categories = response;
        })
    }

    $scope.isDrawerOpen = false;
    $scope.drawerStyle = {
        'margin-left': 'calc(100% - 0px)'
    };

    $scope.isItemSelected = false;

    $scope.changeCategory = function(id) {
        $scope.catid = id
    }

    $scope.getSelectedCat = function(id) {
        return (id == catid) ? 'selected' : '';
    }

    $scope.openIngredientsModal = function(p) {
        var modalInstance = $uibModal.open({
            animation: 'true',
            templateUrl: 'templates/modals/ingredients-modal.html',
            controller: 'IngredientsModalCtrl',
            size: 'md',
            resolve: {
                product: function() {
                    return p;
                },
                order: function() {
                    return $scope.order;
                },
                lessItem: function(){
                    return false;
                }
            }
        });

        modalInstance.result.then(function(product) {
            p = product;
        }, function() {

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
        $scope.sideBarOrderDetailOpen = !$scope.sideBarOrderDetailOpen;
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
        $scope.order = {};
        $scope.order.itemsInOrder = [];
        $scope.order.itemsInOrderMap = {};
        $scope.initNewOrderObj();
        $scope.source = "machine-id";
        $scope.products = angular.copy($scope.productsUnchanged);
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

        var isModifiersSelected  = false;
        var lastKeyId = -1;

        for (var i = 0; i < $scope.order.itemsInOrder.length; i++) {
            if(product.prod_id == $scope.order.itemsInOrder[i].prod_id && $scope.order.itemsInOrder[i].isModified){
                isModifiersSelected = true;
                break;
            }
        }

        if(isModifiersSelected && $scope.order.itemsInOrder.length >1){

            var modalInstance = $uibModal.open({
                animation: 'true',
                templateUrl: 'templates/modals/ingredients-modal.html',
                controller: 'IngredientsModalCtrl',
                size: 'md',
                resolve: {
                    product: function() {
                        return product;
                    },
                    order: function() {
                        return $scope.order;
                    },
                    lessItem: function(){
                        return true;
                    }

                }
            });

            modalInstance.result.then(function(itemsToBeRemoved) {

                var itemsOrder = angular.copy($scope.order.itemsInOrder);

                for (var i = 0; i < itemsOrder.length; i++) {
                    var key = itemsOrder[i].prod_id + JSON.stringify(itemsOrder[i].ingredients).replace(/[{}"]/g, '');
                    var k = itemsToBeRemoved.indexOf(key);

                    if(k != -1){
                        itemsToBeRemoved.splice(k,1);
                        $scope.order.itemsInOrder.splice(k,1);

                        if(product.prod_qty > 0){
                            product.prod_qty--;
                        }
                        if(product.prod_qty == 0){
                            product.selected = false;
                            product.iSelected = false;
                            delete product.ingredients;
                        }
                    }

                }

            }, function() {
                //
            });
        }else{

            if($scope.order.itemsInOrder.length==1){
                $scope.order.itemsInOrder.splice(0);
                product.selected = false;
                product.iSelected = false;
                product.prod_qty = 0;
                delete product.ingredients;
                return
            }


            var productKey = product.prod_id + JSON.stringify(product.ingredients).replace(/[{}"]/g, '');

            for (var i = 0; i < $scope.order.itemsInOrder.length; i++) {
                var currKey = $scope.order.itemsInOrder[i].prod_id + JSON.stringify($scope.order.itemsInOrder[i].ingredients).replace(/[{}"]/g, '');

                if(currKey == productKey){

                    $scope.order.itemsInOrder.splice(i,1);

                    if(product.prod_qty > 1){
                        product.prod_qty--;
                    }else{
                        product.selected = false;
                        product.iSelected = false;
                        product.prod_qty = 0;
                        delete product.ingredients;
                    }

                    break;
                }
            }
        }

        //$scope.calTotalAmt();
    }

    $scope.addItem = function(product) {
        var p = angular.copy(angular.extend(product, {
            ingredients: {
                type: 'MIX',
                abbr: 'M',
                sweet: 'medium',
                garlic: 'medium',
                chilli: 'medium',
                isMedium: true
            },
            status: 1

        }));

        var p = angular.copy(product);
        p.prod_qty = 1;
        $scope.order.itemsInOrder.push(p);

        product.prod_qty++;

        if (product.prod_qty == 1) {
            product.selected = true;
            //product.iSelected = true;
        }

        $scope.order.order_total_qty = $scope.order.itemsInOrder.length;
        //$scope.calTotalAmt();
    }

    $scope.$watch('order.itemsInOrder', function(orderItemsNew, orderItemsOld){
        if(!$scope.order) return;
        $scope.order.itemsInOrderMap = {};

        for (var i = 0; i < orderItemsNew.length; i++) {
            var key = orderItemsNew[i].prod_id + JSON.stringify(orderItemsNew[i].ingredients).replace(/[{}"]/g, '')

            if($scope.order.itemsInOrderMap.hasOwnProperty(key)){
                $scope.order.itemsInOrderMap[key].prod_qty++;
            }else{
                $scope.order.itemsInOrderMap[key] = angular.copy(orderItemsNew[i]);
                $scope.order.itemsInOrderMap[key].prod_qty = 1;
            }
        }

        $scope.calTotalAmt();

    }, true)

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

    $scope.validateOrderSave = function(mode) {

        if(!$scope.editMode) {

            if (mode.toLowerCase() == 'create') {
               $("#createOrderBtn").html('Saving........');
                $scope.createOrder();
            }
        }
        else{
            OrderService.updateOrder($stateParams.id, $scope.order)
        }


    }

    var socket = io();

    $scope.createOrder = function() {

        $scope.order.time = new Date().getTime();
        //$scope.order.order_pay_status = $("#order-paid-check").prop('checked') ? 'full' : 'none';
        if(parseFloat($scope.order.bal_amt) == 0)
        {
            $scope.order.order_pay_status = 'full';
        }else if(parseFloat($scope.order.paid_amt) > 0){
            $scope.order.order_pay_status = 'partial';
        }else if(parseFloat($scope.order.paid_amt) == 0){
            $scope.order.order_pay_status = 'none';
        }

        OrderService.createOrder($scope.order).then(function(response) {

            $scope.playOrderSound(response.code);

            if (response.code == 'ORDER_CREATED') {

                socket.emit('order-created');

                //alert(response.msg + '.Token Number:' + response.curr_token);
                $scope.order.order_token_no = response.curr_token;
                //store generated new order id
                $scope.order.order_id_str = response.order_id_str;
                $scope.refreshCustomerList();
                var orderCopy = {};
                angular.copy($scope.order, orderCopy);
                $scope.generateBill(orderCopy, function() {
                    //clear binded variables
                    $scope.order.paid_amt = 0;
                    $scope.order.bal_amt = 0;

                    $scope.newOrder();
                });

            } else if (response.code == 'ERROR') {
                alert(response.msg + '[Code=' + response.code + ']');
                console.log(response.stack);
            }

            $("#createOrderBtn").html('Create Order');

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

    $scope.onSelectCustomer = function(item, model, label) {
        $scope.order.customer = angular.copy(item);
    }

    /*$scope.onCustomerSelect = function($item, $model, $label) {
    Customer.getCustomerInfoByCustomerCode($item.cust_id).then(function(response) {
    $scope.order.customer = response;
    });
    }*/

    $scope.parcelOrder = function() {
        $scope.order.delivery_mode = 'PARCEL';
        $scope.order.tableNo = $scope.tables[$scope.tables.length-1].no;
    }

    $scope.dinningOrder = function() {
        $scope.order.delivery_mode = 'DINE';
    }

    $scope.showSchedulerElement = false;

    $scope.showScheduler = function(e){

        if(!$scope.showSchedulerElement){
            $scope.showOrderDetail = false;
            $scope.showSchedulerElement = true
        }else{
            $scope.showOrderDetail = true;
            $scope.showSchedulerElement = false
        }
    }

    $scope.scheduleOrder = function(){
        $scope.order.is_scheduled = 1;
        $scope.showScheduler();
    }

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

    //transaction code

    $scope.initNewOrderObj = function() {
        $scope.order = {};
        $scope.order.customer = {};
        $scope.order.itemsInOrder = [];
        $scope.order.itemsInOrderMap = {};
        $scope.order.order_total_amt = 0.00;
        $scope.order.order_token_no = 0;
        $scope.order.order_id_str = "";
        $scope.order.order_date_time = new Date();
        //1-> order pending, 2-> order in process ,3-> completed,4-> order delivered,5-> order cancelled
        $scope.order.order_status = 1;
        $scope.order.modified_by = 'admin';
        $scope.order.last_modified_date_time = new Date();
        $scope.order.delivery_mode = 'DINE';
        $scope.order.is_scheduled = 0;
        var dt = new Date();
        dt.setMinutes((Math.round(dt.getMinutes()/5) * 5) % 60);
        dt.setSeconds(0);
        $scope.order.scheduled_date_time = dt;
        //set it after order is delivered by
        $scope.order.order_dlv_by = "";
        $scope.order.tableNo= "NO Table";
    }

    $scope.generateBill = function(orderData, callBack) {

        var bill = TransactionFactory.createOrderBill(orderData);

        OrderService.addBill(bill).then(function(response) {
            if (response.code == 'TRANS_ADDED') {
                callBack.call();

            } else if (response.code == 'ERROR') {
                alert(response.msg + '[Code=' + response.code + ']');
                console.log(response.stack);
            }

        })
    }

    $scope.refreshCustomerList = function(){
        Customer.getAllCustomersRemote().then(function(data) {
            $scope.customers = data;
        })

    }

    $scope.balanceAmt = function(){
        var balAmt = 0;
        balAmt = $scope.order.order_total_amt - $scope.order.paid_amt;
        $scope.order.bal_amt = balAmt;
        return balAmt ;
    }

    $scope.playOrderSound = function(type){
        var audio ;
        switch(type.toLowerCase())
        {
            case 'order_created':
            audio = document.getElementById("order_created_audio");
            break;
            case 'error':
            audio = document.getElementById("error_audio");
            break;
        }
        audio.play();
    }

    $scope.propmptCancelOrder = function(){
        //prompt for cancel order
        if(confirm("Cancel Order?")==true)
        {
            $scope.newOrder();
        }
    }

    //code for assigning table nos
    $scope.showDinningTableElement = false;

    $scope.showDinningTableSetter = function(e){

        if(!$scope.showDinningTableElement){
            $scope.showOrderDetail = false;
            $scope.showDinningTableElement = true;
        }else{
            $scope.showOrderDetail = true;
            $scope.showDinningTableElement = false;
        }
    }

    $scope.assignDiningTableNo = function(){
      //  $scope.order.tableNo= 1;//hard code table no
        $scope.order.tableNo = $scope.selectedTableObj.no;
        $scope.showDinningTableSetter();
    }

    //hard code tables list
    $scope.tables = [
    						{no:1,available:true,tokenno:0,custCode:0},
    					  {no:2,available:true,tokenno:0,custCode:0},
    					  {no:3,available:true,tokenno:0,custCode:0},
    					  {no:4,available:true,tokenno:0,custCode:0},
    					  {no:5,available:true,tokenno:0,custCode:0},
    					  {no:6,available:true,tokenno:0,custCode:0},
    					  {no:7,available:true,tokenno:0,custCode:0},
    					  {no:8,available:true,tokenno:0,custCode:0},
    					  {no:9,available:true,tokenno:0,custCode:0},
                {no:10,available:true,tokenno:0,custCode:0},
                {no:11,available:true,tokenno:0,custCode:0},
                {no:12,available:true,tokenno:0,custCode:0},
                {no:13,available:true,tokenno:0,custCode:0},
                {no:"NO Table",available:false,tokenno:0,custCode:0}];

    $scope.selectedTableObj = $scope.tables[$scope.tables.length-1];//last value no table
    $scope.selectTable = function(tableObj){
      $scope.selectedTableObj = tableObj;
    }

    //show customer address
    $scope.showSelectedCustomerElement = false;

    $scope.showSelectedCustomerAddr = function(e){
      
        if(!$scope.showSelectedCustomerElement){
            $scope.showOrderDetail = false;
            $scope.showSelectedCustomerElement = true;
        }else{
            $scope.showOrderDetail = true;
            $scope.showSelectedCustomerElement = false;
        }
    }


    init();

})//end of OrderCtrl
