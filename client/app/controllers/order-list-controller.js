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

    $scope.showCompletedChange = function(){

        getOrderWithStatus = ($scope.includeCompletedOrders) ? '1' : '1';
        loadOrders();
    }

    function loadOrders(){
        OrderService.getLatestOrder(getOrderWithStatus).then(function(response) {

            if($scope.displayItemGrouped)
            {
                var orderList_ungroupedItems = response;
                for(var i=0;i<orderList_ungroupedItems.length;i++)
                {
                    var order = orderList_ungroupedItems[i];
                    order.itemsInOrderMap = groupByItemID_Abbr(order.itemsInOrder);
                }
                $scope.orderlist = orderList_ungroupedItems;
            }else
            {
                $scope.orderlist = response;
            }

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
