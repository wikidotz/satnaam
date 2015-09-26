angular.module('hotelApp')

.controller('OrderGridCtrl', function($scope) {
    $scope.getRowStyle = function(item) {
    	console.log(item.isParcel)
        var color = (item.isParcel) ? '#FF0' : '#F0F';

        return {
            'background-color': color
        }
    }

    $scope.isShowingParcel = false;

    $scope.showParcel = function() {
        $scope.isShowingParcel = !$scope.isShowingParcel;
    }
})

.controller('OrderListCtrl', function($scope, Order) {

    $scope.orderlist = [];

    function init() {
        Order.getLatestOrder().then(function(response) {

            $scope.orderlist = response.orderlist;

        })
    }





    init()

})
