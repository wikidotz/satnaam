angular.module('hotelApp')

.directive('sauces', function() {
    return {
        templateUrl: 'templates/sauces-directive.html',
        link: function(scope, element, attrs) {

            var valuesHash = {
                0 : 'no',
                1 : 'less',
                2 : 'medium',
                3 : 'more'
            }

            scope.stringValue = function(){
                return valuesHash[scope.sliderValue]
            }

            scope.sliderValue = 2;

            scope.slider = {
                options: {
                    stop: function (event, ui) { 
                        console.log(scope.sliderValue); 
                        scope.updateFn()(scope.name, scope.stringValue()) 
                    }
                }
            }

        },
        scope: {
            name: '@name',
            updateFn: '&'
        },
    }
})

.factory('SubProduct', function() {

    function SubProduct(product) {
        SubProduct.prototype = product.prototype;
    }

    return (SubProduct);
})

.factory('TransactionFactory',function(){
    function transaction(order){
        var transaction = {};
        transaction.order = order;
        transaction.bill_no = 0;
        
        transaction.paid_amt = order.paid_amt;
        transaction.bal_amt = order.bal_amt;
        transaction.modified_by = "admin";
        transaction.last_modified_date_time = new Date();
        transaction.desc = "Bill for order";
        transaction.mode = "CASH";
        transaction.order_id_str = orderorder_id_str;
        transaction.order_total_qty = orderorder_total_qty;
        transaction.tran_date_time = new Date();
        transaction.order_total_amt = orderorder_total_amt;
        //transaction.bal_amt = $scope.orderorder_total_amt - $scope.transaction.paidAmt;

        transaction.type = "ORDER_PAYMENT";

        return transaction;
    }
})

.controller('IngredientsModalCtrl', function($scope, $uibModalInstance, product, order) {

    $scope.product = product;
    $scope.order = order;
    $scope.selecteds = [];

    $scope.itemTypes = [{
        type: 'MIX',
        label: 'Mix',
        abbr: 'M'
    }, {
        type: 'HALFJAIN',
        label: 'Half Jain',
        abbr: 'HJ'
    }, {
        type: 'JAIN',
        label: 'Jain',
        abbr: 'J'
    }]

    function isSameProduct(item) {
        return item.prod_id == product.prod_id;
    }

    function isSelected(item) {
        return item.iSelected;
    }

    $scope.productFilter = function(item) {
        return item.prod_id == product.prod_id;
    }

    $scope.isAllSelected = false;

    $scope.selectAll = function() {

        for (var i = 0; i < $scope.order.itemsInOrder.filter(isSameProduct).length; i++) {
            $scope.order.itemsInOrder.filter(isSameProduct)[i].iSelected = $scope.isAllSelected;
        };
    }

    $scope.itemClick = function(item){
        item.iSelected = !item.iSelected;
        $scope.isAllSelected = false;
        console.log($scope.order.itemsInOrder.filter(isSameProduct).filter(isSelected))
    }


    $scope.itemTypeBtnClass = function(type){
        type.type
        
    }

    //$scope.selectAll();

    $scope.toggleItemType = function($event, type) {

        angular.element($event.target).parent().find('button').removeClass('active');
        angular.element($event.target).addClass('active');

        for (var i = 0; i < $scope.order.itemsInOrder.filter(isSameProduct).length; i++) {

            if ($scope.order.itemsInOrder.filter(isSameProduct)[i].iSelected) {
                $scope.order.itemsInOrder.filter(isSameProduct)[i].ingredients.type = type.type;
                $scope.order.itemsInOrder.filter(isSameProduct)[i].ingredients.abbr = type.abbr;
            }
        };

        $scope.isAllSelected = false;
    }

    $scope.updateSauceges = function(name, value){

        for (var i = 0; i < $scope.order.itemsInOrder.filter(isSameProduct).length; i++) {

            if ($scope.order.itemsInOrder.filter(isSameProduct)[i].iSelected) {
                $scope.order.itemsInOrder.filter(isSameProduct)[i].ingredients[name.toLowerCase()] = value;

                $scope.order.itemsInOrder.filter(isSameProduct)[i].ingredients.isMedium = (value == 'medium')

            }
        };
    }

    $scope.addQty = function() {
        product.prod_qty++;
        for (var i = 0; i < $scope.product.prod_qty; i++) {
            $scope.subitems.push({
                selected: false
            })
        };
    }
    $scope.lessQty = function() {
        if (product.prod_qty > 1) {
            product.prod_qty--;
            for (var i = 0; i < $scope.product.prod_qty; i++) {
                $scope.subitems.push({
                    selected: false
                })
            };
        }
    }



    $scope.ok = function() {
        $uibModalInstance.close($scope.product);
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
})

.controller('OrderCtrl', function($scope, $window, $uibModal, SubProduct, Product, Customer, OrderService, TransactionFactory) {

    $scope.isProductsLoaded = false;
    $scope.products = [];
    $scope.customers = [];
    $scope.sideBarOrderDetailOpen = false;


    //new code
    MAX_TOKEN_NUM = 100;
    START_TOKEN_NUM = 1;


    $scope.catid = 2;

    function init() {

        $('#orderDateTime').datetimepicker();
        $("[name='order-paid']").bootstrapSwitch();

        Product.getProducts().then(function(data) {
            $scope.products = data;
            $scope.isProductsLoaded = true;
            new Clipboard('.copy-btn');
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

        //categoryId
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
        $scope.source = "machine-id";
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

        var index = -1;
        for (var i = 0; i < $scope.order.itemsInOrder.length; i++) {
            if ($scope.order.itemsInOrder[i].prod_id == product.prod_id) {
                $scope.order.itemsInOrder.splice(i, 1);
                break;
            }
        };
        if (product.prod_qty > 0) {
            product.prod_qty--;
        }

        if (product.prod_qty == 0) {
            product.selected = false;
            delete $scope.order.itemsInOrderMap[product.prod_id];
        } else {
            $scope.order.itemsInOrderMap[product.prod_id] = product;
        }

        $scope.calTotalAmt();
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
            }
        }));

        product.prod_qty++;

        if (product.prod_qty == 1) {
            product.selected = true;
        }

        $scope.order.itemsInOrder.push(p);
        $scope.order.itemsInOrderMap[p.prod_id] = product;

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

    $scope.validateOrderSave = function(mode) {
        if (mode.toLowerCase() == 'create') {
            $scope.createOrder();
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

        console.log($scope.order);

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
    }

    $scope.dinningOrder = function() {
        $scope.order.delivery_mode = 'DINE';
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

    /*$scope.initNewTransactionObj = function() {
        $scope.transaction = {};
        $scope.transaction.order = {};
        $scope.transaction.bill_no = 0;
        $scope.transaction.order_total_amt = 0.0;
        $scope.transaction.paid_amt = 0.0;
        $scope.transaction.bal_amt = 0.0;
        $scope.transaction.tran_date_time = new Date();
        $scope.transaction.modified_by = "admin";
        $scope.transaction.last_modified_date_time = new Date();
        $scope.transaction.desc = "";
        $scope.transaction.type = "ORDER_PAYMENT";
        $scope.transaction.mode = "CASH";
    }*/

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
        $scope.order.scheduled_date_time = undefined;
        //set it after order is delivered by
        $scope.order.order_dlv_by = "";
    }

    $scope.generateBill = function(orderData, callBack) {

        var bill = TransactionFactory.transaction(orderData);
        
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



    init();


})//end of OrderCtrl