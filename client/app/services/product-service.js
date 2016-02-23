angular.module('hotelApp')
.service('Product', function($http, $q){

	var products = [];
	var categories = [];

	this.getProducts = function(){

		if(products.length>0){
			var deferred = $q.defer();
			deferred.resolve(products);
			return deferred.promise;	
		}else{
			return $http.get('products').then(function(response){
				products = response.data;
				return products;
			})	
		}
	}

	this.getCategories = function(){

		if(categories.length>0){
			var deferred = $q.defer();
			deferred.resolve(categories);
			return deferred.promise;
		}else{
			return $http.get('products/categories').then(function(response){
				categories = response.data.reverse();
				return categories;
			})
		}
	}

	
})