var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var mysql = require('mysql');
var model = require('../models/model');
var sess;

router.post("/registerUser", jsonParser, function (req, res) {
    var fname = req.body.fname;
    var lname = req.body.lname;
    var address = req.body.address;
    var city = req.body.city;
    var state = req.body.state;
    var zip = req.body.zip;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;

    var failureRes = {
        message: "The input you provided is not valid"
    };

    if (!(fname && lname && address && city && state && zip && email && username && password)) {
        res.json(failureRes);
    }

    model.localConnection.getConnection(function(err, conn) {
        if(err) throw err;
        var sql = "SELECT * FROM users WHERE username = " + mysql.escape(username);
        conn.query(sql, function(err, result) {
            if(err) throw err;
            
            if(typeof result !== 'undefined' && result.length > 0) {
                res.json(failureRes);
            } else {
                sql = "INSERT INTO `users` (`fname`, `lname`, `address`, `city`, `state`, `zip`, `email`, `username`, `password`, `role`) VALUES (" + 
                    mysql.escape(fname) + ", " + mysql.escape(lname) + ", " + mysql.escape(address) + ", " + mysql.escape(city) + ", " + 
                    mysql.escape(state) + ", " + mysql.escape(zip) + ", " + mysql.escape(email) + ", " + mysql.escape(username) + ", " +
                    mysql.escape(password) + ", " + mysql.escape("customer") + ")";
                conn.query(sql, function(err, result) {
                    conn.release();
                    if(err) throw err;
                    var successMessage = fname + " was registered successfully";
                    res.json({
                        message: successMessage
                    });
                });
            } 
        })
        
    })
});

router.post("/login", jsonParser, function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    sess = req.session;
    sess.username = req.body.username;
    var failureRes = {
        message: "There seems to be an issue with the username/password combination that you entered"
    };

    model.localConnection.getConnection(function(err, conn) {
        if (err) throw err;
        var sql = "SELECT * FROM users WHERE username = " + mysql.escape(username) + " AND password = " + mysql.escape(password);
        conn.query(sql, function (err, result) {
            if (err) throw err;
            
            if (typeof result !== 'undefined' && result.length > 0) {
                var welcomeMessage = "Welcome " + result[0].fname;
                res.json ({
                    message: welcomeMessage
                });
            } else {
                res.json (failureRes);
            }
        });
    });
});

router.post("/logout", function (req, res) {
    sess = req.session;
    if (sess.username) {
        req.session.destroy (function(err) {
            if (err) {
                throw err;
            } else {
                res.json ({
                    message: "You have been successfully logged out"
                });
            }
        });
    } else {
        res.json ({
            message: "You are not currently logged in"
        });
    }
});

router.post("/add", jsonParser, function (req, res) {
    sess = req.session;
    if (sess.username) {
        var num1 = req.body.num1;
        var num2 = req.body.num2;
        if (isInteger(num1) && isInteger(num2)) {
            res.json ({
                message: "The action was successful",
                result: num1 + num2
            });
        } else {
            res.json ({
                message: "The numbers you entered are not valid"
            });
        }
    } else {
        res.json ({
            message: "You are not currently logged in"
        });
    }
});

router.post("/divide", jsonParser, function (req, res) {
    sess = req.session;
    if (sess.username) {
        var num1 = req.body.num1;
        var num2 = req.body.num2;
        if (isInteger(num1) && isInteger(num2) && num2 != 0) {
            res.json ({
                message: "The action was successful",
                result: num1 / num2
            });
        } else {
            res.json ({
                message: "The numbers you entered are not valid"
            });
        }
    } else {
        res.json ({
            message: "You are not currently logged in"
        });
    }
});

router.post("/multiply", jsonParser, function (req, res) {
    sess = req.session;
    if (sess.username) {
        var num1 = req.body.num1;
        var num2 = req.body.num2;
        if (isInteger(num1) && isInteger(num2)) {
            res.json ({
                message: "The action was successful",
                result: num1 * num2
            });
        } else {
            res.json ({
                message: "The numbers you entered are not valid"
            });
        }
    } else {
        res.json ({
            message: "You are not currently logged in"
        });
    }
});

function isInteger(x) {
    return (typeof x === 'number') && (x % 1 === 0);
};

module.exports = router;