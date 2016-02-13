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

.controller('OrderListCtrl', function($scope, OrderService, WSService) {

    $scope.orderlist = [];
    $scope.includeCompletedOrders = false;
    
    var getOrderWithStatus = '1';
    var socket = io();

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
            $scope.orderlist = response;

            console.log(response);
        })
    }

    init()

})
