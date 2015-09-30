angular.module('hotelApp').service('Order',function($http){
	
	this.createNewOrder = function(orderObj){
		logger().log("Saving order details-items");
		return $http.put('/order/saveOrder',orderObj).then(function(response){
			alert(response);
		},
		function(err){
			alert(err);
		})
	}

	this.getLatestOrder = function(){

		return $http.get('/order/lastestOrders').then(function(response){
			return response.data;
		})
	}
})