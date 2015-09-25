angular.module('hotelApp').service('Order',function($http){
	
	this.createNewOrder = function(orderObj){
		logger().log("Saving order details-items");
		orderObj = {
			//"order_id":"1",
			"cust_id":1,
			"order_token_no":"1",
			"order_table_no":1,
			"order_total_amt":100.00,
			"order_total_qty":2,
			"order_expct_time":1200,
			"order_date":"2015-07-20 13:16:00",
			"order_status":1,
			"order_pay_status":"0",
			"order_mng_emp_id":"",
		};

		return $http.put('/order/createOrder',orderObj).then(function(response){
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