angular.module('hotelApp')

.service('OrderService', function($http, Customer){

    var orderToedit = null;

    this.setOrderToEdit = function(order){
        orderToedit = angular.copy(order);
    }

    this.isOrderEdit = function(){
        return !!orderToedit;
    }

    this.getOrderToEdit = function(order){
        var o = angular.copy(orderToedit)
        orderToedit = null;
        return o;
    }

    this.updateOrder = function(id, newOrder){
        return $http.put('orders/order/'+id, {order:newOrder}).then(function(response){
            console.log('res', response)
            return response.data;
        },
        function(error){
            return error;
        })
    }

    this.createOrder = function(data){
        console.log('service',data)
        return $http.post('orders/createOrder', {orderObj:data}).then(function(response){
            Customer.addCustomerInLocalForage(data.customer);
            return response.data;
        },
        function(error){
            return error;
        })
    }

    this.getOrderById = function(id){
        return $http.get('orders/order/'+id).then(function(response){
            return response.data;
        }, function(error){
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

    this.getAllCustomersRemote = function() {
        return $http.get('orders/customersList').then(function(response) {
                return response.data;
            },
            function(err) {
                return err;
            })
    }

    this.getTransactionDetail = function(){
            return $http.get('orders/customersList').then(function(response) {
                return response.data;
            },
            function(err) {
                return err;
            })   
    }


    
});
