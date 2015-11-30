angular.module('hotelApp')

.directive('sauces', function(){
    return {
        templateUrl: 'templates/sauces-directive.html',
        link: function(scope, element, attrs){
            
            var stepSlider = $(element).find('.slider-snap')[0];

            noUiSlider.create(stepSlider, {
                start: [ 0 ],
                step: 4,
                range: {
                    'min': [  0 ],
                    'max': [ 12 ]
                }
            });

        },
        scope: {
            name: '@name'
        },
    }
})

.factory('SubProduct', function(){

    function SubProduct (product){
        SubProduct.prototype = product.prototype;
    }

    return( SubProduct);
})

.controller('IngredientsModalCtrl', function($scope, $uibModalInstance, product){

    function init(){
        $scope.product = product;

        for (var i = 0; i < $scope.product.quantities.length; i++) {
            $scope.product.quantities[i].ingredients = {
                type:'MIX',
                abbr: 'M',
                selected: false
            }
        };
    
    }

    init();

    $scope.isAllSelected = false;

    $scope.selectAll = function(){
        
        for (var i = 0; i < $scope.product.quantities.items.length; i++) {
            $scope.product.quantities[i].selected = !$scope.isAllSelected;
        };
    }

    $scope.toggleItemType = function(type, abbr){
        for (var i = 0; i < $scope.product.quantities.length; i++) {

            if($scope.product.quantities[i].selected){
                $scope.product.quantities[i].ingredients.type = type;
                $scope.product.quantities[i].ingredients.abbr = abbr;
                $scope.product.quantities[i].selected = false;
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

.controller('OrderCtrl', function($scope, $window, $uibModal, SubProduct, Product, Customer, OrderService) {

    $scope.products = [];
    $scope.customers = [];
    $scope.sideBarOrderDetailOpen =false;
    
    //new code
    MAX_TOKEN_NUM = 100;
    START_TOKEN_NUM = 1;


    $scope.catid = 2;

    function init() {

        $('#orderDateTime').datetimepicker();
        $("[name='order-paid']").bootstrapSwitch();
        
        Product.getProducts().then(function(data) {
            $scope.products = data;

            new Clipboard('.copy-btn');
        })

        $scope.token = $window.sessionStorage.token;

        showCurrentDateTime();
        $scope.initNewOrderObj();
        $scope.initNewTransactionObj();

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
            product.quantities.splice(0, 1);
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

        if(!product.hasOwnProperty('quantities')){
            product.quantities = [];
        }
        product.quantities.push(new SubProduct(angular.copy(product)));
        
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

    $scope.validateOrderSave = function(mode){
        if(mode.toLowerCase() == 'create')
        {
            $scope.createOrder();
        }
    }

    $scope.createOrder = function() {

        $scope.order.time = new Date().getTime();
        $scope.order.order_pay_status = $("#order-paid-check").prop('checked')? 'full':'none';
        OrderService.createOrder($scope.order).then(function(response) {
            if(response.code == 'ORDER_CREATED')
            {
                alert(response.msg+'.Token Number:'+response.curr_token);
                $scope.order.order_token_no = response.curr_token;
                //store generated new order id 
                $scope.order.order_id_str = response.order_id_str;
                Customer.addCustomer($scope.order.customer);
                var orderCopy = {};
                angular.copy($scope.order, orderCopy);
                $scope.generateBill(orderCopy,function(){
                    $scope.newOrder();    
                });
                
            }else if(response.code == 'ERROR')
            {
                alert(response.msg+'[Code='+response.code+']');
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

    $scope.onSelectCustomer = function(item, model, label){
        $scope.order.customer = angular.copy(item);
    }

    /*$scope.onCustomerSelect = function($item, $model, $label) {
        Customer.getCustomerInfoByCustomerCode($item.cust_id).then(function(response) {
            $scope.order.customer = response;
        });
    }*/

    $scope.parcelOrder = function (){
        $scope.order.delivery_mode = 'PARCEL';   
    }

    $scope.dinningOrder = function (){
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

     $scope.initNewTransactionObj = function(){
        $scope.transaction = {};
        $scope.transaction.order = {};
        $scope.transaction.bill_no= 0;
        $scope.transaction.order_total_amt = 0.0;
        $scope.transaction.paid_amt = 0.0;
        $scope.transaction.bal_amt = 0.0;
        $scope.transaction.tran_date_time = new Date();
        $scope.transaction.modified_by ="admin";
        $scope.transaction.last_modified_date_time = new Date();
        $scope.transaction.desc = "";
        $scope.transaction.type="ORDER_PAYMENT";
        $scope.transaction.mode = "CASH";
    }

    //transaction code
    
    $scope.initNewOrderObj = function(){
        $scope.order = {};
        $scope.order.customer = {};
        $scope.order.itemsInOrder = [];
        $scope.order.itemsInOrderMap = {};
        $scope.order.order_total_amt = 0.00;
        $scope.order.order_token_no = 0;
        $scope.order.order_id_str="";
        $scope.order.order_date_time = new Date();
        //1-> order pending, 2-> order in process ,3-> completed,4-> order delivered,5-> order cancelled
        $scope.order.order_status=1;
        $scope.order.modified_by = 'admin';
        $scope.order.last_modified_date_time= new Date();
        $scope.order.delivery_mode = 'DINE';
        $scope.order.is_scheduled = 0;
        $scope.order.scheduled_date_time = undefined;
        //set it after order is delivered by
        $scope.order.order_dlv_by = "";
    }

     $scope.generateBill = function(orderData, callBack) {
        alert('generateBill');
        
        $scope.transaction.order_id_str = orderData.order_id_str ;
        $scope.transaction.order_total_amt = orderData.order_total_amt;
        $scope.transaction.order_total_qty= orderData.order_total_qty;
    
        $scope.transaction.tran_date_time = new Date();
        $scope.transaction.paidAmt = 100.00;
        
        $scope.transaction.order_total_amt = orderData.order_total_amt;
        $scope.transaction.bal_amt = orderData.order_total_amt - $scope.transaction.paidAmt ;

        $scope.transaction.type="ORDER_PAYMENT";

        OrderService.addBill($scope.transaction).then(function(response) {
            if(response.code == 'TRANS_ADDED')
            {
                alert(response.msg);
                //Customer.addCustomer($scope.order.customer);
                callBack.call();

            }else if(response.code == 'ERROR')
            {
                alert(response.msg+'[Code='+response.code+']');
                console.log(response.stack);
            }
            
        })
    }

    init();
    
})

/*
CURRENTLY NOT IN USE
SOME ISSUES WITH BELOW NEWLY CREATED CONTROL
NEED TO FIX
*/
.controller('TransactionCtrl',function($scope,Customer,OrderService){
    $scope.transaction.order = {};
    $scope.transaction.bill_no= 0;
    $scope.transaction.order_total_amt = 0.0;
    $scope.transaction.paid_amt = 0.0;
    $scope.transaction.bal_amt = 0.0;
    $scope.transaction.tran_date_time = new Date();
    $scope.transaction.modified_by ="admin";
    $scope.transaction.last_modified_date_time = new Date();
    $scope.transaction.desc = "";
    $scope.transaction.type="ORDER";
    $scope.transaction.mode = "CASH";

     $scope.generateBill = function(orderData) {
        alert('generateBill');
        $scope.transaction.order = orderData;
        $scope.transaction.tran_date_time = new Date();
        $scope.transaction.paidAmt = 100.00;
        $scope.transaction.bal_amt = 0.00;
        $scope.transaction.order_total_amt = $scope.transaction.order.order_total_amt;


        OrderService.addBill($scope.transaction.order).then(function(response) {
            if(response.code == 'TRANS_ADDED')
            {
                alert(response.msg);
                //Customer.addCustomer($scope.order.customer);
            }else if(response.code == 'ERROR')
            {
                alert(response.msg+'[Code='+response.code+']');
                console.log(response.stack);
            }
            
        })
    }

    $scope.$on('test',function(event){
        alert('test event catched');
    })

    $scope.$on('generate-bill',function(event,orderData){
        $scope.generateBill(orderData);
    })
})
