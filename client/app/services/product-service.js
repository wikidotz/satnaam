angular.module('hotelApp')
.service('Product', function($http, $q){

	var products = [];
	var categories = [];

	this.getProducts = function(){

		return $http.get('products').then(function(response){
			return response.data;
		})
	}

	this.getCategories = function(){

		var deferred = $q.defer();

		if(categories.length>0){
			deferred.resolve(categories);
		}else{
			return $http.get('products/categories').then(function(response){
				categories = response.data.reverse();
				return categories;
			})
		}

		return deferred.promise;
	}

	
})