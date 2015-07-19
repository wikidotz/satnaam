var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
var crypto = require('crypto');
var DataTypes = require("sequelize");


// db config
var env = "dev";
var config = require('../database.json')[env];
var password = config.password ? config.password : null;

// initialize database connection
var sequelize = new Sequelize(
    config.database,
    config.user,
    config.password, {
        logging: console.log,
        define: {
            timestamps: false
        }
    }
);


var User = sequelize.define('users', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
}, {
    instanceMethods: {
        retrieveAll: function(onSuccess, onError) {
            User.findAll({}, {
                    raw: true
                })
                .success(onSuccess).error(onError);
        },
        retrieveById: function(user_id, onSuccess, onError) {
            User.find({
                    where: {
                        id: user_id
                    }
                }, {
                    raw: true
                })
                .success(onSuccess).error(onError);
        },
        add: function(onSuccess, onError) {
            var username = this.username;
            var password = this.password;

            var shasum = crypto.createHash('sha1');
            shasum.update(password);
            password = shasum.digest('hex');

            User.build({
                    username: username,
                    password: password
                })
                .save().success(onSuccess).error(onError);
        },
        updateById: function(user_id, onSuccess, onError) {
            var id = user_id;
            var username = this.username;
            var password = this.password;

            var shasum = crypto.createHash('sha1');
            shasum.update(password);
            password = shasum.digest('hex');

            User.update({
                    username: username,
                    password: password
                }, {
                    where: {
                        id: id
                    }
                })
                .success(onSuccess).error(onError);
        },
        removeById: function(user_id, onSuccess, onError) {
            User.destroy({
                where: {
                    id: user_id
                }
            }).success(onSuccess).error(onError);
        }
    }
});

router.route('/')

// create a user (accessed at POST http://localhost:8080/api/users)
.post(function(req, res) {

    var username = req.body.username; //bodyParser does the magic
    var password = req.body.password;

    var user = User.build({
        username: username,
        password: password
    });

    user.add(function(success) {
            res.json({
                message: 'User created!'
            });
        },
        function(err) {
            res.send(err);
        });
})

// get all the users (accessed at GET http://localhost:8080/api/users)
.get(function(req, res) {
    console.log('gettttttttt')
    var user = User.build();

    user.retrieveAll(function(users) {
        if (users) {
            res.json(users);
        } else {
            res.send(401, "User not found");
        }
    }, function(error) {
        res.send("User not found");
    });
});


module.exports = router;
