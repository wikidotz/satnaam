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
       
        var dummyData = [
        {bldgID:1,bldgName:'AJOY '},
{bldgID:2,bldgName:'APEKSHA ENCLAVE'},
{bldgID:3,bldgName:'ARPIT ENCLAVE'},
{bldgID:4,bldgName:'BHOOMI DARSHAN'},
{bldgID:5,bldgName:'BHOOMI ENCLAVE'},
{bldgID:6,bldgName:'BHOOMI GARDEN'},
{bldgID:7,bldgName:'BHOOMI SANKIT'},
{bldgID:8,bldgName:'BLOSSOM'},
{bldgID:9,bldgName:'BLUE ARCH'},
{bldgID:10,bldgName:'BLUE OASIS -1'},
{bldgID:11,bldgName:'BLUE OASIS -2'},
{bldgID:12,bldgName:'BLUE TULIP'},
{bldgID:13,bldgName:'BLUE TULIP'},
{bldgID:14,bldgName:'BREEZY CORNER'},
{bldgID:15,bldgName:'CHANAKYA '},
{bldgID:16,bldgName:'DEV NAGAR'},
{bldgID:17,bldgName:'EDEN GARDEN'},
{bldgID:18,bldgName:'EKTA BHOOMI'},
{bldgID:19,bldgName:'EKTA TERRACE'},
{bldgID:20,bldgName:'GAURAV HEIGHTS'},
{bldgID:21,bldgName:'GAURAV PLAZA'},
{bldgID:22,bldgName:'GAURAV VILLA'},
{bldgID:23,bldgName:'GHANSHYAM'},
{bldgID:24,bldgName:'GOKUL'},
{bldgID:25,bldgName:'GOVARDHAN NAGAR'},
{bldgID:26,bldgName:'HIGHLAND HARMONY'},
{bldgID:27,bldgName:'HIRANDANI'},
{bldgID:28,bldgName:'I-20'},
{bldgID:29,bldgName:'J-17'},
{bldgID:30,bldgName:'JEEVAN DEEP'},
{bldgID:31,bldgName:'KAILASH TOWER'},
{bldgID:32,bldgName:'KAMLA ASHISH TOWER'},
{bldgID:33,bldgName:'KAMLA VIHAR- G'},
{bldgID:34,bldgName:'KESAR ASHISH'},
{bldgID:35,bldgName:'KRISHNA'},
{bldgID:36,bldgName:'KUBER'},
{bldgID:37,bldgName:'MAHAVIR DARSHAN'},
{bldgID:38,bldgName:'MAHAVIR KRIPA'},
{bldgID:39,bldgName:'MALHAR'},
{bldgID:40,bldgName:'MATRI'},
{bldgID:41,bldgName:'MATRI TOWER'},
{bldgID:42,bldgName:'MHATRE PLAZA'},
{bldgID:43,bldgName:'MOHAN NAGAR'},
{bldgID:44,bldgName:'NISARG'},
{bldgID:45,bldgName:'OM PUSHPANJALI'},
{bldgID:46,bldgName:'ORCHID SUBURBIA'},
{bldgID:47,bldgName:'PANCHASHEEL GARDEN'},
{bldgID:48,bldgName:'PANCHASHEEL HEIGHT'},
{bldgID:49,bldgName:'PANCHASHEEL RESIDENCY'},
{bldgID:50,bldgName:'PARIJAT'},
{bldgID:51,bldgName:'PRAGATI SOCIETY'},
{bldgID:52,bldgName:'PRANIK GARDEN'},
{bldgID:53,bldgName:'PUSHPA HERITAGE'},
{bldgID:54,bldgName:'RUBY APARTMENT '},
{bldgID:55,bldgName:'RUBY CLASSIC '},
{bldgID:56,bldgName:'RADHA'},
{bldgID:57,bldgName:'RAGHULEELA'},
{bldgID:58,bldgName:'RAHUL CLASSIC'},
{bldgID:59,bldgName:'RAHUL TOWER'},
{bldgID:60,bldgName:'RAJ ARCADE'},
{bldgID:61,bldgName:'RAJ GARDEN'},
{bldgID:62,bldgName:'RAJ RESIDENCY- 2'},
{bldgID:63,bldgName:'RAJ RESIDENCY- 3'},
{bldgID:64,bldgName:'RAJ RESIDENCY- I'},
{bldgID:65,bldgName:'RAJ VAIBHAV TOWER'},
{bldgID:66,bldgName:'RAJ VAIBHAV-I'},
{bldgID:67,bldgName:'RATNAKAR'},
{bldgID:68,bldgName:'RNA REGENCY PARK'},
{bldgID:69,bldgName:'RNA ROYAL'},
{bldgID:70,bldgName:'ROCK ENCLAVE'},
{bldgID:71,bldgName:'SAFALYA'},
{bldgID:72,bldgName:'SAREETA'},
{bldgID:73,bldgName:'SHILPIN'},
{bldgID:74,bldgName:'SHREE KRISHNA'},
{bldgID:75,bldgName:'SHREE SHUBHAM'},
{bldgID:76,bldgName:'SHREE VALLABH'},
{bldgID:77,bldgName:'SHREE YAMUNA'},
{bldgID:78,bldgName:'SHYAM KUNJ'},
{bldgID:79,bldgName:'SIDDHIVINAYAK SOCIETY'},
{bldgID:80,bldgName:'SITA SADAN'},
{bldgID:81,bldgName:'STARLIGHT APARTMENT'},
{bldgID:82,bldgName:'SYMPHONY APARTMENT'},
{bldgID:83,bldgName:'ULHAS BASTI'},
{bldgID:84,bldgName:'VASANT AARDHANA'},
{bldgID:85,bldgName:'VASANT COMPLEX'},
{bldgID:86,bldgName:'VASANT SADHANA'},
{bldgID:87,bldgName:'VEENA GEET'},
{bldgID:88,bldgName:'VEENA SANTOOR'},
{bldgID:89,bldgName:'VEENA SARANG'},
{bldgID:90,bldgName:'VEENA SARGAM'},
{bldgID:91,bldgName:'VEENA SITAR'},
{bldgID:92,bldgName:'VEENA VIHAR'},
{bldgID:93,bldgName:'VICKY CLASSIC'},
{bldgID:94,bldgName:'VISHWA MILAN'},
{bldgID:95,bldgName:'VISHWADEEP HEIGHTS'},
{bldgID:96,bldgName:'VRINDAVAN SOCIETY'},
{bldgID:97,bldgName:'XTH CENTRAL MALL'}
                       
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
