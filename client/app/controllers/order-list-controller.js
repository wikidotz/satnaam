angular.module('hotelApp')

.filter('itemsFilter', function(){

    return function(order, status){
        //order.status = stat
        //console.log(order);
        return order;
    }
})

.controller('OrderGridCtrl', function($scope) {

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
        console.log(order)
    }

    $scope.showDate = function(dateStr){
        return new Date(dateStr).toTimeString().split(' ')[0];
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
    $scope.isFooterExpanded = function(){
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
})

.controller('OrderListCtrl', function($scope, OrderService) {

    $scope.orderlist = [];
    $scope.includeCompletedOrders = false;
    $scope.displayItemGrouped = true;

    var timeSlotMins = 5;

    var getOrderWithStatus = '1';
    var socket = io();

    $scope.filterItems = function(item){
        return item
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

    function init() {


        loadOrders();
        //WSService.init();

        socket.on('order-created', function(){
            $scope.playOrderSound('order_created');
            loadOrders();
        });
    }

    var intervalID;

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

})
