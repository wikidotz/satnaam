angular.module('hotelApp')
.service('Product', function($http){

	this.getProducts = function(){
		return $http.get('/product').then(function(response){
			return response.data;
		})
	}
})