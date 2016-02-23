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
                console.log(response.length);

                //loop on itemsInOrder, grouped them based on item id and abbr
                var orderList_ungroupedItems = response;
                for(var i=0;i<orderList_ungroupedItems.length;i++)
                {
                    var order = orderList_ungroupedItems[i];
                    order.itemsInOrder = groupByItemID_Abbr(order.itemsInOrder);    
                }
                $scope.orderlist = orderList_ungroupedItems;    
            }else
            {
                $scope.orderlist = response;    
            }
            
        })
    }

    function groupByItemID_Abbr(itemsInOrder){
        var itemsInOrderGrouped = [];
        var prodIdIngrAbbrMap;//prodIdIngrAbbrMap[prod_id-abbr]= 0};
        for(var i=0;i<itemsInOrder.length;i++)
        {
            var tempItem = itemsInOrder[i];
            var key = tempItem.prod_id+'-'+tempItem.ingredients.abbr;
            //check for prod_id,ingredients-abbr
            if(prodIdIngrAbbrMap==undefined)
            {
                prodIdIngrAbbrMap = {};
                prodIdIngrAbbrMap[key]= 1;  
                tempItem.prod_qty = 1;
                itemsInOrderGrouped.push(angular.merge({},tempItem));
            }else
            {
                if(prodIdIngrAbbrMap.hasOwnProperty(key)){
                    //increases only qty as key is already present
                    prodIdIngrAbbrMap[key] += 1;
                    itemsInOrder[i].prod_qty +=1;        
                }else{
                    //
                    prodIdIngrAbbrMap[key]= 1;      
                    tempItem.prod_qty = 1 ;
                    itemsInOrderGrouped.push(angular.merge({},tempItem));
                }
            }
        }

        return itemsInOrderGrouped ;
    }

    init()

})
