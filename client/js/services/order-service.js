angular.module('hotelApp')

.service('OrderService', function($http, Customer){

    this.createOrder = function(data){
        return $http.post('orders/createOrder', {orderObj:data}).then(function(response){
            
            return response.data;
        },
        function(error){
            return error;
        })
    }



    this.getLatestOrder = function(status){

		return $http.get('/orders/'+status).then(function(response){
			return response.data;
		})
	}

    this.addBill = function(data)
    {
        return $http.post('transactions/addTransaction',{transObj:data}).then(function(response){
            return response.data ;
        },function(error){
            return error;
        })
    }

    this.addPayment = function(data)
    {
        return $http.post('transactions/addTransaction',{transObj:data}).then(function(response){
            return response.data ;
        },function(error){
            return error;
        })
    }

    this.addAdvancePayment = function(data)
    {
        return $http.post('transactions/addAdvancePayment',{transObj:data}).then(function(response){
            return response.data ;
        },function(error){
            return error;
        })
    }

    
});
