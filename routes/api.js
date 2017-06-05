var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var mysql = require('mysql');
var sess;



router.post("/login", jsonParser, function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    sess = req.session;
    sess.username = req.body.username;
    var failureRes = {
        message: "There seems to be an issue with the username/password combination that you entered"
    };

    var con = mysql.createConnection({
        // Uncomment the following host if you've deployed the MySQL server locally.
        // host: "localhost",

        // When using MySQL instance deployed on AWS RDS service.
        host: "simpleamazon.cektrjgecscm.us-east-1.rds.amazonaws.com",
        user: "root",
        password: "ediss_is_awesome",
        database: "e_commerce"
    });

    con.connect(function(err) {
        if (err) throw err;
        var sql = "SELECT * FROM users WHERE username = " + mysql.escape(username) + " AND password = " + mysql.escape(password);
        con.query(sql, function (err, result) {
            if (err) throw err;
            
            if (typeof result !== 'undefined' && result.length > 0) {
                var welcomeMessage = "Welcome " + result[0].firstname;
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