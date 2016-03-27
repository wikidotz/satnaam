var express = require('express');
var router = express.Router();
var logger = require('../logger');
var app = express();
var mongoose = require('mongoose');
var Customer = require('../model/customer-model.js');
var CustomerIDCounter = require('../model/customerIDCounter-model.js');
var Q = require("q");
var customerIDGenerator = require('../common/customerid.js');
//fetch customers list
module.exports = (function() {
    'use strict';
    var router = express.Router();

    //Get all Customers
    router.get('/', function(req, res) {
        Customer.find({}, function(err, docs) {
            res.json(docs);
        });
    });

    //Add the Customer
    router.route('/user')
        .post(function(req, res) {
            var obj = req.body.user;
                   
            CustomerIDCounter.findOneAndUpdate(
                 {_id:'custID'},
                 {"$inc": { "seq": 1 }} ,
                 {"upsert":true,"returnNewDocument":true},
                  function(errc,resc){
                    if(errc)
                        console.error(errc);
                    //returnNewDocuemnt is not working as it is returning old seq
                    obj.custID = resc.seq+1 ;
                    console.log('customers.js->new customer custID'+obj.custID);
                    var user = new Customer(obj);
           
                    user.save(function(err, user) {
                        if (err) return console.error(err);
                        res.json(user);
                    });   
            });
        
        });

    //This method use to generate a unique id
    /*function getUID(fname, lname) {


        var deferred = Q.defer();
        var charCount = 1;

        generate();

        function generate() {
            var tempUID = String(fname.substr(0, charCount) + lname).toLowerCase();
            Customer.find({
                uid: tempUID
            }, function(err, docs) {

                if (err) {
                    deferred.reject(err);
                    return console.error(err);
                }
                if (docs.length < 1) {
                    deferred.resolve(tempUID);
                } else {
                    charCount++;
                    generate();
                }
            });
        }

        return deferred.promise;
    }*/

    router.route('/user/:id')
        //delete the customers
        .delete(function(req, res) {

            Customer.find({
                _id: req.params.id
            }).remove().exec();
            res.send({
                message: 'ok'
            });

        })
        //update the customers
        .put(function(req, res) {

            Customer.findOneAndUpdate({_id:req.params.id}, req.body.user, function (err, user) {
                res.send(req.body.user);
            });
        })

    router.route('/bldgs').get(function(req,res){
        console.log('bldgs royte');
        var dummyData = [{bldgID:1,bldgAcr:'SKRI',bldgName:'Shree Krishna'},
                         {bldgID:2,bldgAcr:'SKNJ',bldgName:'Shyam Kunj'}
                        ];
        res.send(dummyData);
    });
    
    router.route('/initCustomerIDCounter').get(function(req,res){
        console.log('initialising CustomerIDCounter collection');

        var startCounter = new CustomerIDCounter({
              _id: "custID",
              seq: 0
           });

        var customerIDCounterObj = new CustomerIDCounter(startCounter);
        customerIDCounterObj.save(function(err, result) {
            if (err) return console.error(err);
            console.log('CustomerIDCounter result['+result+']   ');
            res.json(result);
        });
    })
    return router;
})();
