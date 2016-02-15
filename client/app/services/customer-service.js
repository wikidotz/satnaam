angular.module('hotelApp').service('Customer', function($http, $localForage) {
    var self = this;
    self.getAllCustomersRemote = function() {
        return $http.get('customers').then(function(response) {
                if(response.data!=undefined|| response.data!=null)
                {
                    $localForage.setItem('customers', response.data);    
                }
                
                return response.data;
            },
            function(err) {
                return err;
            })
    }

    self.getAllCustomers = function() {
        return $localForage.getItem('customers').then(function(data) {
            return data || [];
        })
    }

    self.addCustomer = function(customer) {
        
        $http.post('customers/addCustomer',{custObj:customer}).then(
            function(response){
                addCustomerInLocalForage(customer);       
            },
            function(err){
                return err;
            })
    }

    self.getCustomerInfoByCustomerCode = function(customerCode) {
        return $http.get('/customer').then(
            function(response) {

            },
            function(err) {

            })
    }

    self.addCustomerIfNotExist = function(newCustomer) {
         $localForage.getItem('customers').then(function(data) {
            var existingCustomers = data || [];
            //var tempObj ;
            var mobileNoExist = false;
            angular.forEach(existingCustomers,function(tempObj){
                //check for customer mobile no first
                 mobileNoExist = (newCustomer.mobile == tempObj.mobile);
                 if(mobileNoExist)
                 {
                    return false;    
                 }
            })

            if(!mobileNoExist)
            {
                self.addCustomer(newCustomer);    
            }
            
        })
    }

    self.addCustomerInLocalForage = function(newCustomer){
        $localForage.getItem('customers').then(function(data) {
            var existingCustomers = data || [];
            var mobileNoExist = false;
            angular.forEach(existingCustomers,function(tempObj){
                //check for customer mobile no first
                 mobileNoExist = (newCustomer.mobile == tempObj.mobile);
                 if(mobileNoExist)
                 {
                    return false;    
                 }
            })

            if(!mobileNoExist)
            {
                existingCustomers.push(newCustomer)
                $localForage.setItem('customers', existingCustomers);
            }
            
        })
         
    }
});
