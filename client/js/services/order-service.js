angular.module('hotelApp').service('Order',function($http){
	
	this.createNewOrder = function(orderObj){

		var data = {
			//orderObj :JSON.stringify(orderObj)
			orderObj :orderObj
		}
		console.log(data);
		return $http.put('/order/saveOrder',data).then(function(response){
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