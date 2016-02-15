var express = require('express');
var router = express.Router();
var logger = require('../logger');
var app = express();
var mongoose = require('mongoose');
var Customer = require('../model/customer-model.js');
var Q = require("q");

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
            console.log('adding user here')
            var obj = req.body.user;
            var user = new Customer(obj);

            user.save(function(err, user) {
                if (err) return console.error(err);
                res.json(user);
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

    return router;
})();
