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
        host: "localhost",
        user: "root",
        password: "",
        database: "e_commerce"
    });

    con.connect(function(err) {
        if (err) throw err;
        var sql = "SELECT * FROM users WHERE username = " + mysql.escape(username) + " AND password = " + mysql.escape(password);
        con.query(sql, function (err, result) {
            if (err) throw err;
            
            if (typeof result !== 'undefined' && result.length > 0) {
                var welcomeMessage = "Welcome" + result[0].firstname;
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
    req.session.destroy (function(err) {
        if (err) {
            res.json ({
                message: "You are not currently logged in"
            });
        } else {
            res.json ({
                message: "You have been successfully logged out"
            });
        }
    });
});

module.exports = router;