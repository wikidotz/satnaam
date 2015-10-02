angular.module('hotelApp')

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

    $scope.expandFooter = function (){
        isFooterOpen = !isFooterOpen;
    }
})

.controller('OrderListCtrl', function($scope, Order) {

    $scope.orderlist = [];
    $scope.includeCompletedOrders = false;
    
    var getOrderWithStatus = 'pending';

    function init() {
        
        loadOrders();
    }

    $scope.showCompletedChange = function(){

        getOrderWithStatus = ($scope.includeCompletedOrders) ? 'all' : 'pending';
        loadOrders();
    }

    

    function loadOrders(){
        Order.getLatestOrder(getOrderWithStatus).then(function(response) {
            $scope.orderlist = response.orderlist;
        })
    }

    init()

})
