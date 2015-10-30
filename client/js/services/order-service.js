angular.module('hotelApp')

.service('OrderService', function($http){

    this.createOrder = function(data){
        return $http.post('orders/createOrder', {orderObj:data}).then(function(response){
            return response.response
        })
    }

    this.getLatestOrder = function(status){

		return $http.get('/orders/'+status).then(function(response){
			return response.data;
		})
	}
    
})
