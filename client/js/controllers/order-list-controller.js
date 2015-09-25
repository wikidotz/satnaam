angular.module('hotelApp')
    .controller('OrderListCtrl', function($scope, Order) {

        $scope.orderlist = [];
        
        function init(){
            Order.getLatestOrder().then(function(response){

                $scope.orderlist = response.orderlist;

            })
        }

        init()

    })
