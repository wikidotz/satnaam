angular.module('hotelApp').service('Customer',function($http){
	this.getAllCustomers = function(){
		return $http.get('/customers').then(function(response){
			return response.data;
		},
		function(err){
			return err;
		})
	}
});