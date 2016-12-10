angular.module('hotelApp')

.service('AccountService', ['$http', 'Customer', function($http, Customer){

    this.addBill = function(data)
    {
        return $http.post('transactions/addBill',{transObj:data}).then(function(response){
            return response.data ;
        },function(error){
            return error;
        })
    }
    
    this.addBillPayment = function(data)
    {
        return $http.post('transactions/addBillPayment',{transObj:data}).then(function(response){
            return response.data ;
        },function(error){
            return error;
        })
    }
    
}])
