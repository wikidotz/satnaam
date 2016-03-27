var Q = require('q');
var CustomerIDCounter = require('../model/customerIDCounter-model.js');

module.exports = {
  getNextSequence : function() {

  	var deferred = Q.defer();
    console.log('getNextSequence->creating user');
   CustomerIDCounter.findOneAndUpdate(
     {_id:'custID'},
     {"$inc": { "seq": 1 }} ,
     {"upsert":true,"returnNewDocument":true},
      function(errc,resc){
        if(errc) {
            console.error(errc);
            deferred.reject(errc);
        }
        //returnNewDocuemnt is not working as it is returning old seq
        var nextCustID = resc.seq+1 ;
        obj.custID = nextCustID ;
        var user = new Customer(obj);
        console.log('new customer custid->'+nextCustID);
        user.save(function(err, user) {
            if (err) return console.error(err);
            res.json(user);
        });
      });

   	  //return deferred.promise;
    }
}

return module.exports;