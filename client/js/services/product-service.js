angular.module('hotelApp')
.service('Product', function($http){

	this.getProducts = function(){
		return $http.get('/products').then(function(response){
			return response.data;
		})
	}
})