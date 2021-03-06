angular.module('hotelApp')

.filter('itemsFilter', function(){

    return function(order, status){
        //order.status = stat
        //console.log(order);
        return order;
    }
})

.controller('OrderGridCtrl', ['$scope', '$location', '$timeout', 'OrderService', function($scope, $location, $timeout, OrderService) {

    var isFooterOpen = false;
    var statusClasses = [
        '',
        'pending',
        'process',
        'completed',
        'delivered',
        'cancelled'
    ];


    $scope.editOrder = function(order){
        OrderService.setOrderToEdit(order);
        $location.path('/edit-order/'+order._id)
    }

    $scope.showDate = function(dateStr){
        return new Date(dateStr).toTimeString().split(' ')[0];
    }

    $scope.payBal = false;

    $scope.makeBalPayment = function(e){

        $scope.payBal = true;
        var target = event.target;

        $timeout(function(){
            angular.element(target).closest('.sol-additional-opts').find('.paid-amt')[0].focus();
        },30)
    }

    $scope.makeBalPaymentCancel = function(){
        $scope.payBal = false;
    }

    $scope.makeBalPaymentPay = function(){
        //add service call here
        $scope.payBal = false;
    }

    $scope.payOrderChange = function(order){
        order.bal_amt = (order.paid_amt <= order.order_total_amt) ? order.order_total_amt - order.paid_amt : 0;
    }

    $scope.changeStatus = function(item){
        item.status++;
        item.status = item.status % 4;
        if(item.status==0){
            item.status++;
        }
    }

    $scope.getStatus = function (item) {
        var classes = '';
        if(!$scope.isShowingParcel){
            classes = 'hide-bg '
        }

        return classes + statusClasses[item.status]
    }

    $scope.getRowStyle = function(item) {
        var color = (item.isParcel) ? '#FF0' : '#F0F';

        return {
            'background-color': color
        }
    }
    $scope.isFooterExpanded = function(order){
        return (isFooterOpen) ? 'isOpen' : '';
    }

    $scope.isShowingParcel = false;

    $scope.showParcel = function() {
        $scope.isShowingParcel = !$scope.isShowingParcel;
    }

    $scope.orderStatus = '1';

    $scope.expandFooter = function (){
        isFooterOpen = !isFooterOpen;
    }


}])

.controller('OrderListCtrl', ['$scope', '$location', '$stateParams', '$timeout', 'OrderService', 'Product', function($scope, $location, $stateParams, $timeout, OrderService, Product) {

    $scope.orderlist = [];
    $scope.orderlistFiltered = [];
    $scope.includeCompletedOrders = false;
    $scope.displayItemGrouped = true;

    $scope.products = [];
    $scope.categories = [];

    $scope.isFilterSelected = false;
    $scope.selectedFilterCat = '';
    $scope.selectedFilterOpt = 'OR';
    $scope.selectedFilteritem = '';

    var timeSlotMins = 5;
    var getOrderWithStatus = '1';
    var socket = io();
    var wasFiltered = false;

    $scope.filterItems = function(item){
        return item
    }

    $scope.orderEdit = false;
    $scope.alert = null;

    var alerts = [
        { type: 'danger', msg: 'Oh snap! unable to update order, Please try again.' },
        { type: 'success', msg: 'Well done! You successfully updated the Order' }
    ];

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

    function init() {

        loadOrders();
        loadProducts();
        loadCategory();

        if($location.search().hasOwnProperty('orderEditSuccess')) {
            $scope.orderEdit = true;
            if($location.search().orderEditSuccess == true){
                $scope.alert = alerts[1]
            }else{
                $scope.alert = alerts[0]
            }
            initiateAutoHide()
        }else{
            $scope.orderEdit = false;
        }



        socket.on('order-created', function(){
            $scope.playOrderSound('order_created');
            loadOrders();
        });
    }

    var intervalID;


    function initiateAutoHide(){
        $timeout(function(){
            $scope.orderEdit = false;
            $scope.alert = null
        }, 5000)
    }

    function loadCategory(){
        Product.getCategories().then(function(data){
            $timeout(function(){
                $scope.categories = data;
            },10)

        })
    }

    $scope.getFilterOptionsArray = function(){
        return ($scope.selectedFilterCat == '') ? ['OR'] : ['OR','AND'];

    }

    function loadProducts(){
        Product.getProducts().then(function(data){
            $scope.products = data;
        })
    }

    $scope.filterSelectionChange = function(){
        if($scope.isFilterSelected){
            localFilter()
        }else{
            if(wasFiltered){

                loadOrders();
            }

        }
    }

    $scope.filterCatChanged = function(){
        $scope.isFilterSelected = true;
        localFilter()
    }

    $scope.filterOptionChanged = function(){
        $scope.isFilterSelected = true;

        for (var i = 0; i < Things.length; i++) {
            Things[i]
        }
        localFilter()

    }

    $scope.filterItemChanged = function(){
        $scope.isFilterSelected = true;
        localFilter()
    }

    function localFilter(){

        if ($scope.selectedFilterCat == '') return;

        $scope.orderlist = []
        for(var i=0;i<orderBackBuffer.length;i++)
        {
            var order = orderBackBuffer[i];
            var exists = false;
            for (var j = 0; j < order.itemsInOrder.length; j++) {
                if($scope.selectedFilterOpt.trim() == 'OR') {
                    if(order.itemsInOrder[j].prod_category_id == $scope.selectedFilterCat.category_id ||
                    order.itemsInOrder[j].prod_id == $scope.selectedFilteritem.prod_id){
                        exists = true;
                    }
                }else if($scope.selectedFilterOpt.trim() == 'AND') {
                    if(order.itemsInOrder[j].prod_category_id == $scope.selectedFilterCat.category_id &&
                    order.itemsInOrder[j].prod_id == $scope.selectedFilteritem.prod_id){
                        exists = true;
                    }
                }
            }
            if(exists){
                wasFiltered = true;
                $scope.orderlist.push(angular.copy(order))
            }
        }
    }

    function createTimer() {

        var now = new Date();
        var newTime = new Date();
        var ahead = (Math.ceil(now.getMinutes()/timeSlotMins) * timeSlotMins) % 60;

        if(ahead == 0){
            newTime.setHours(newTime.getHours()+1)
            newTime.setMinutes(0);
        }else{
            newTime.setMinutes(ahead);
        }

        var diff = newTime - now;

        setTimeout(function(){
            if(intervalID){
                clearInterval(intervalID)
            }

            intervalID = setInterval(scheduleReloader, timeSlotMins*60*1000)
            scheduleReloader();
        }, diff)
    }

    function scheduleReloader(){
        $scope.$apply(function(){
            $scope.orderlist = filterScheduledOrder(orderBackBuffer);
        })

    }

    $scope.showCompletedChange = function(){

        getOrderWithStatus = ($scope.includeCompletedOrders) ? '1' : '1';
        loadOrders();
    }

    var orderBackBuffer = [];

    function loadOrders(){
        OrderService.getLatestOrder(getOrderWithStatus).then(function(response) {

            if($scope.displayItemGrouped)
            {
                orderBackBuffer = response;
                for(var i=0;i<orderBackBuffer.length;i++)
                {
                    var order = orderBackBuffer[i];
                    order.itemsInOrderMap = groupByItemID_Abbr(order.itemsInOrder);
                }
                $scope.orderlist = filterScheduledOrder(orderBackBuffer);
            }else
            {
                $scope.orderlist = response;
            }
            createTimer()
        })
    }

    function filterScheduledOrder(orders){
        return orders.filter(function(order){

            if(order.is_scheduled==1){
                var now = new Date()
                now.setSeconds(59);
                var sdt = new Date(order.scheduled_date_time)
                return ((sdt - now) <= (timeSlotMins*60*1000))
            }

            return true;
        })
    }

    function groupByItemID_Abbr(itemsInOrder){
        var map={};
        for(var i=0;i<itemsInOrder.length;i++)
        {
            var product = itemsInOrder[i];
            var key = product.prod_id + JSON.stringify(product.ingredients).replace(/[{}"]/g, '');

            if(map.hasOwnProperty(key)){
                product.prod_qty++;
            }



            map[key] = product;
        }
        return map;
    }

    init()

}])
