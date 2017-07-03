var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var cookieParser = require('cookie-parser');
var path = require('path');
var async = require('async');
var redis = require('redis');
var mysql = require('mysql');
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var client = redis.createClient();
var model = require('../models/model');
//var localDB = model.localConnection;
var localDB = model.awsConnection;
var utility = require('../utility/utility');

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
    return;
  }

  localDB.getConnection(function (err, conn) {
    if (err) throw err;
    var sql = "SELECT * FROM users WHERE username = " + mysql.escape(username);
    conn.query(sql, function (err, result) {
      if (err) throw err;

      if (typeof result !== 'undefined' && result.length > 0) {
        res.json(failureRes);
      } else {
        sql = "INSERT INTO `users` (`fname`, `lname`, `address`, `city`, `state`, `zip`, `email`, `username`, `password`, `role`) VALUES (" +
          mysql.escape(fname) + ", " + mysql.escape(lname) + ", " + mysql.escape(address) + ", " + mysql.escape(city) + ", " +
          mysql.escape(state) + ", " + mysql.escape(zip) + ", " + mysql.escape(email) + ", " + mysql.escape(username) + ", " +
          mysql.escape(password) + ", " + mysql.escape("customer") + ")";
        conn.query(sql, function (err, result) {
          conn.release();
          if (err) throw err;
          var successMessage = fname + " was registered successfully";
          res.json({
            message: successMessage
          });
        });
      }
    });

  });
});

router.post("/login", jsonParser, function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var failureRes = {
    message: "There seems to be an issue with the username/password combination that you entered"
  };

  localDB.getConnection(function (err, conn) {
    if (err) throw err;
    var sql = "SELECT * FROM users WHERE username = " + mysql.escape(username) + " AND password = " + mysql.escape(password);
    conn.query(sql, function (err, result) {
      if (err) throw err;

      if (typeof result !== 'undefined' && result.length > 0) {
        var welcomeMessage = "Welcome " + result[0].fname;
        sess = req.session;
        sess.username = req.body.username;
        sess.role = result[0].role;
        res.json({
          message: welcomeMessage
        });
      } else {
        res.json(failureRes);
      }
    });
  });
});

router.post("/logout", function (req, res) {
  sess = req.session;
  if (sess.username) {
    req.session.destroy(function (err) {
      if (err) {
        throw err;
      } else {
        res.json({
          message: "You have been successfully logged out"
        });
      }
    });
  } else {
    res.json({
      message: "You are not currently logged in"
    });
  }
});

router.post("/updateInfo", jsonParser, function (req, res) {
  sess = req.session;
  if (sess.username) {
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

    if (fname === "" || lname === "" || address === "" || city === "" || state === "" || zip === "" || email === "" || username === "" || password === "" || username !== sess.username) {
      res.json(failureRes);
      return;
    }

    localDB.getConnection(function (err, conn) {
      if (err) {
        conn.release();
        throw err;
      }

      var value_set =
        utility.sql_set_value(conn, "fname", fname) + "," +
        utility.sql_set_value(conn, "lname", lname) + "," +
        utility.sql_set_value(conn, "address", address) + "," +
        utility.sql_set_value(conn, "city", city) + "," +
        utility.sql_set_value(conn, "state", state) + "," +
        utility.sql_set_value(conn, "zip", zip) + "," +
        utility.sql_set_value(conn, "email", email) + "," +
        utility.sql_set_value(conn, "username", username) + "," +
        utility.sql_set_value(conn, "password", password)
        ;

      if (value_set != "") {
        var sql = "UPDATE `users` SET " + value_set + " WHERE username=" + conn.escape(sess.username);
        conn.query(sql, function (err, result) {
          conn.release();
          if (err) throw err;
          var successMessage = fname + " your information was successfully updated";
          res.json({
            message: successMessage
          });
        });
      }
    });

  } else {
    res.json({
      message: "You are not currently logged in"
    });
  }
});

router.post("/addProducts", jsonParser, function (req, res) {
  sess = req.session;
  if (sess.username && sess.role == "admin") {
    var asin = req.body.asin;
    var productName = req.body.productName;
    var productDescription = req.body.productDescription;
    var pgroup = req.body.group;

    var failureRes = {
      message: "The input you provided is not valid"
    };

    if (!(asin && productName && productDescription && pgroup)) {
      res.json(failureRes);
      return;
    }

    localDB.getConnection(function (err, conn) {
      if (err) throw err;
      var sql = "SELECT * FROM products WHERE asin = " + mysql.escape(asin);
      conn.query(sql, function (err, result) {
        if (err) throw err;

        if (typeof result !== 'undefined' && result.length > 0) {
          res.json(failureRes);
        } else {
          sql = "INSERT INTO `products` (`asin`, `productName`, `productDescription`, `pgroup`) VALUES (" +
            mysql.escape(asin) + ", " + mysql.escape(productName) + ", " + mysql.escape(productDescription) + ", " + mysql.escape(pgroup) + ")";
          conn.query(sql, function (err, result) {
            conn.release();
            if (err) throw err;
            var successMessage = productName + " was successfully added to the system";
            res.json({
              message: successMessage
            });
          });
        }
      })

    });
  } else if (sess.username && sess.role == "customer") {
    res.json({
      message: "You must be an admin to perform this action"
    });
  } else {
    res.json({
      message: "You are not currently logged in"
    });
  }
});

router.post("/modifyProduct", jsonParser, function (req, res) {
  sess = req.session;
  if (sess.username && sess.role == "admin") {
    var asin = req.body.asin;
    var productName = req.body.productName;
    var productDescription = req.body.productDescription;
    var pgroup = req.body.group;

    var failureRes = {
      message: "The input you provided is not valid"
    };

    if (!(asin && productName && productDescription && pgroup)) {
      res.json(failureRes);
      return;
    }

    localDB.getConnection(function (err, conn) {
      if (err) throw err;

      var value_set =
        utility.sql_set_value(conn, "asin", asin) + "," +
        utility.sql_set_value(conn, "productName", productName) + "," +
        utility.sql_set_value(conn, "productDescription", productDescription) + "," +
        utility.sql_set_value(conn, "pgroup", pgroup)
        ;

      if (value_set != "") {
        var sql = "UPDATE `products` SET " + value_set + " WHERE asin=" + conn.escape(asin);
        conn.query(sql, function (err, result) {
          conn.release();
          if (err) throw err;
          var successMessage = productName + " was successfully updated";
          res.json({
            message: successMessage
          });
        });
      }
    });
  } else if (sess.username && sess.role == "customer") {
    res.json({
      message: "You must be an admin to perform this action"
    });
  } else {
    res.json({
      message: "You are not currently logged in"
    });
  }
});

router.post("/viewUsers", jsonParser, function (req, res) {
  sess = req.session;
  if (sess.username && sess.role == "admin") {
    var firstname = req.body.fname;
    var lastname = req.body.lname;
    localDB.getConnection(function (err, conn) {
      if (err) throw err;
      var sql = "SELECT * FROM users WHERE fname LIKE ";

      if (typeof firstname == 'undefined' || firstname.length == 0) {
        firstname = "'%'";
      } else {
        firstname = "'%" + firstname + "%'";
      }

      if (typeof lastname == 'undefined' || lastname.length == 0) {
        lastname = "'%'";
      } else {
        lastname = "'%" + lastname + "%'";
      }

      sql += firstname + " AND lname LIKE " + lastname;

      conn.query(sql, function (err, result) {
        conn.release();
        if (err) throw err;
        if (typeof result !== 'undefined' && result.length > 0) {
          var users = [];
          for (var i = 0; i < result.length; i++) {
            var resultFirst = result[i].fname;
            var resultLast = result[i].lname;
            var resultId = result[i].username;
            var user = {
              fname: resultFirst,
              lname: resultLast,
              userId: resultId
            };
            users.push(user);
          }
          res.json({
            message: "The action was successful",
            user: users
          });
        } else {
          res.json({
            message: "There are no users that match that criteria"
          });
        }

      });

    });
  } else if (sess.username && sess.role == "customer") {
    res.json({
      message: "You must be an admin to perform this action"
    });
  } else {
    res.json({
      message: "You are not currently logged in"
    });
  }
});

router.post("/viewProducts", jsonParser, function (req, res) {
  var asin = req.body.asin;
  var keyword = req.body.keyword;
  var pgroup = req.body.group;

  if (typeof keyword == 'undefined' || keyword.length == 0) {
    keyword = "'%'";
  } else {
    keyword = "'%" + keyword + "%'";
  }

  if (typeof pgroup == 'undefined' || pgroup.length == 0) {
    pgroup = "'%'";
  } else {
    pgroup = "'%" + pgroup + "%'";
  }

  localDB.getConnection(function (err, conn) {
    if (err) throw err;
    if (typeof asin != 'undefined' && asin != "") {
      var query = "SELECT * FROM products WHERE asin = " + asin + "";
      conn.query(query, function (err, result) {
        if (err) {
          throw (err);
        } else {
          if (typeof result !== 'undefined' && result.length > 0) {
            var products = [];
            for (var i = 0; i < result.length; i++) {
              var resultAsin = result[i].asin;
              var resultProductName = result[i].productName;
              var product = {
                asin: resultAsin,
                productName: resultProductName
              };
              products.push(product);
            }
            res.json({
              product: products
            });
          } else {
            res.json({
              message: "There are no products that match that criteria"
            });
          }
        }
      });
    } else {
      conn.query('SELECT * from products where pgroup like ' + pgroup + ' and (productName LIKE ' + keyword + ' OR productDescription LIKE ' + keyword + ')', function (err, result) {
        if (err) {
          throw (err);
        } else {
          if (typeof result !== 'undefined' && result.length > 0) {
            var products = [];
            for (var i = 0; i < result.length; i++) {
              var resultAsin = result[i].asin;
              var resultProductName = result[i].productName;
              var product = {
                asin: resultAsin,
                productName: resultProductName
              };
              products.push(product);
            }
            res.json({
              product: products
            });
          } else {
            res.json({
              message: "There are no products that match that criteria"
            });
          }
        }
      });
    }
  });
});

function isInteger(x) {
  return (typeof x === 'number') && (x % 1 === 0);
};

module.exports = router;