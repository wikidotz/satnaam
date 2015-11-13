angular.module('hotelApp').service('Customer', function($http, $localForage) {

    this.getAllCustomersRemote = function() {
        return $http.get('/customers').then(function(response) {
                return response.data;
            },
            function(err) {
                return err;
            })
    }

    this.getAllCustomers = function() {
        return $localForage.getItem('customers').then(function(data) {
            return data || [];
        })
    }

    this.addCustomer = function(customer) {
        return $localForage.getItem('customers').then(function(data) {
            var customers = data || [];
            customers.push(customer);
            $localForage.setItem('customers', customers).then(function() {
                return customers;
            });
        })
    }

    this.getCustomerInfoByCustomerCode = function(customerCode) {
        return $http.get('/customer').then(
            function(response) {

            },
            function(err) {

            })
    }
});
