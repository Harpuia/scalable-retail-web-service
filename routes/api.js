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
//var localDB = model.auroraConnection;
var utility = require('../utility/utility');

var auroraOptions = {
  connectionLimit: 10000,
  host: "ediss-aurora.cluster-cektrjgecscm.us-east-1.rds.amazonaws.com",
  user: "root",
  port: 3306,
  password: "ediss_is_awesome",
  database: "e_commerce"
};

//var auroraConnection = mysql.createPool(auroraOptions);
//var localDB = auroraConnection;

var sess;

router.post("/registerUser", jsonParser, function (req, res, next) {
  utility.logMsg("[Enter] '/registerUser' with username " + req.body.username);
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
    utility.logMsg("[Fail] '/registerUser' with username " + username);
    res.json(failureRes);
    return;
  }

  utility.logMsg("[BeforeConn] '/registerUser' with username " + req.body.username);
  localDB.getConnection(function (err, conn) {
    utility.logMsg("[AfterConn] '/registerUser' with username " + req.body.username);
    if (err) {
      utility.logMsg(err);
      //conn.release();
      next(err);
    }
    var sql = "SELECT * FROM users WHERE username = " + mysql.escape(username);
    conn.query(sql, function (err, result) {
      if (err) {
        utility.logMsg(err);
        conn.release();
        next(err);
      }

      if (typeof result !== 'undefined' && result.length > 0) {
        conn.release();
        utility.logMsg("[Fail] '/registerUser' with username " + username);
        res.json(failureRes);
      } else {
        sql = "INSERT INTO `users` (`fname`, `lname`, `address`, `city`, `state`, `zip`, `email`, `username`, `password`, `role`) VALUES (" +
          mysql.escape(fname) + ", " + mysql.escape(lname) + ", " + mysql.escape(address) + ", " + mysql.escape(city) + ", " +
          mysql.escape(state) + ", " + mysql.escape(zip) + ", " + mysql.escape(email) + ", " + mysql.escape(username) + ", " +
          mysql.escape(password) + ", " + mysql.escape("customer") + ")";
        conn.query(sql, function (err, result) {
          conn.release();
          if (err) {
            utility.logMsg(err);
            next(err);
          }
          var successMessage = fname + " was registered successfully";
          utility.logMsg("[Success] '/registerUser' with username " + username);
          res.json({
            message: successMessage
          });
        });
      }
    });

  });
});

router.post("/login", jsonParser, function (req, res, next) {
  utility.logMsg("[Enter] '/login' with username " + req.body.username);
  var username = req.body.username;
  var password = req.body.password;
  var failureRes = {
    message: "There seems to be an issue with the username/password combination that you entered"
  };

  localDB.getConnection(function (err, conn) {
    if (err) {
      utility.logMsg(err);
      //conn.release();
      next(err);
    }
    var sql = "SELECT * FROM users WHERE username = " + mysql.escape(username) + " AND password = " + mysql.escape(password);
    conn.query(sql, function (err, result) {
      conn.release();
      if (err) {
        utility.logMsg(err);
        next(err);
      }

      if (typeof result !== 'undefined' && result.length > 0) {
        var welcomeMessage = "Welcome " + result[0].fname;
        sess = req.session;
        sess.username = req.body.username;
        sess.role = result[0].role;
        utility.logMsg("[Success] '/login' with username " + username);
        res.json({
          message: welcomeMessage
        });
      } else {
        utility.logMsg("[Fail] '/login' with username " + username);
        res.json(failureRes);
      }
    });
  });
});

router.post("/logout", function (req, res, next) {
  utility.logMsg("[Enter] '/logout' with username " + req.session.username);
  sess = req.session;
  if (sess.username) {
    var username = sess.username;
    req.session.destroy(function (err) {
      if (err) {
        utility.logMsg(err);
        next(err);
      } else {
        utility.logMsg("[Success] '/logout' with username " + username);
        res.json({
          message: "You have been successfully logged out"
        });
      }
    });
  } else {
    utility.logMsg("[Fail] '/logout' with username " + req.session.username);
    res.json({
      message: "You are not currently logged in"
    });
  }
});

router.post("/updateInfo", jsonParser, function (req, res, next) {
  utility.logMsg("[Enter] '/updateInfo' with username " + req.session.username);
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
      utility.logMsg("[Fail] '/updateInfo' with username " + req.session.username);
      res.json(failureRes);
      return;
    }

    localDB.getConnection(function (err, conn) {
      if (err) {
        utility.logMsg(err);
        //conn.release();
        next(err);
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
          if (err) {
            utility.logMsg(err);
            next(err);
          }
          var successMessage = fname + " your information was successfully updated";
          utility.logMsg("[Success] '/updateInfo' with username " + req.session.username);
          res.json({
            message: successMessage
          });
        });
      }
    });

  } else {
    utility.logMsg("[Fail] '/updateInfo' with username " + req.session.username);
    res.json({
      message: "You are not currently logged in"
    });
  }
});

router.post("/addProducts", jsonParser, function (req, res, next) {
  utility.logMsg("[Enter] '/addProducts' with username " + req.session.username);
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
      utility.logMsg("[Fail] '/addProducts' with username " + req.session.username);
      res.json(failureRes);
      return;
    }

    localDB.getConnection(function (err, conn) {
      if (err) {
        utility.logMsg(err);
        //conn.release();
        next(err);
      }

      var sql = "SELECT * FROM products WHERE asin = " + mysql.escape(asin);
      conn.query(sql, function (err, result) {
        if (err) {
          utility.logMsg(err);
          conn.release();
          next(err);
        }

        if (typeof result !== 'undefined' && result.length > 0) {
          conn.release();
          utility.logMsg("[Fail] '/addProducts' with username " + req.session.username);
          res.json(failureRes);
        } else {
          sql = "INSERT INTO `products` (`asin`, `productName`, `productDescription`, `pgroup`) VALUES (" +
            mysql.escape(asin) + ", " + mysql.escape(productName) + ", " + mysql.escape(productDescription) + ", " + mysql.escape(pgroup) + ")";
          conn.query(sql, function (err, result) {
            conn.release();
            if (err) {
              utility.logMsg(err);
              next(err);
            }
            var successMessage = productName + " was successfully added to the system";
            utility.logMsg("[Success] '/addProducts' with username " + req.session.username);
            res.json({
              message: successMessage
            });
          });
        }
      })

    });
  } else if (sess.username && sess.role == "customer") {
    utility.logMsg("[Fail] '/addProducts' with username " + req.session.username);
    res.json({
      message: "You must be an admin to perform this action"
    });
  } else {
    utility.logMsg("[Fail] '/addProducts' with username " + req.session.username);
    res.json({
      message: "You are not currently logged in"
    });
  }
});

router.post("/modifyProduct", jsonParser, function (req, res, next) {
  utility.logMsg("[Enter] '/modifyProduct' with username " + req.session.username);
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
      utility.logMsg("[Fail] '/modifyProduct' with username " + req.session.username);
      res.json(failureRes);
      return;
    }

    localDB.getConnection(function (err, conn) {
      if (err) {
        utility.logMsg(err);
        //conn.release();
        next(err);
      }

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
          if (err) {
            utility.logMsg(err);
            next(err);
          }
          var successMessage = productName + " was successfully updated";
          utility.logMsg("[Success] '/modifyProduct' with username " + req.session.username);
          res.json({
            message: successMessage
          });
        });
      }
    });
  } else if (sess.username && sess.role == "customer") {
    utility.logMsg("[Fail] '/modifyProduct' with username " + req.session.username);
    res.json({
      message: "You must be an admin to perform this action"
    });
  } else {
    utility.logMsg("[Fail] '/modifyProduct' with username " + req.session.username);
    res.json({
      message: "You are not currently logged in"
    });
  }
});

router.post("/viewUsers", jsonParser, function (req, res, next) {
  utility.logMsg("[Enter] '/viewUsers' with username " + req.session.username);
  sess = req.session;
  if (sess.username && sess.role == "admin") {
    var firstname = req.body.fname;
    var lastname = req.body.lname;
    localDB.getConnection(function (err, conn) {
      if (err) {
        utility.logMsg(err);
        //conn.release();
        next(err);
      }

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
        if (err) {
          utility.logMsg(err);
          next(err);
        }
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
          utility.logMsg("[Success] '/viewUsers' with username " + req.session.username);
          res.json({
            message: "The action was successful",
            user: users
          });
        } else {
          utility.logMsg("[Fail] '/viewUsers' with username " + req.session.username);
          res.json({
            message: "There are no users that match that criteria"
          });
        }

      });

    });
  } else if (sess.username && sess.role == "customer") {
    utility.logMsg("[Fail] '/viewUsers' with username " + req.session.username);
    res.json({
      message: "You must be an admin to perform this action"
    });
  } else {
    utility.logMsg("[Fail] '/viewUsers' with username " + req.session.username);
    res.json({
      message: "You are not currently logged in"
    });
  }
});

router.post("/viewProducts", jsonParser, function (req, res, next) {
  utility.logMsg("[Enter] '/viewProducts' with asin " + req.body.asin + " keyword " + req.body.keyword + " pgroup " + req.body.group);
  var asin = req.body.asin;
  var keyword = req.body.keyword;
  var pgroup = req.body.group;

  /*
  if (typeof keyword == 'undefined' || keyword.length == 0) {
    keyword = "'%'";
  } else {
    keyword = "'%" + keyword + "%'";
  }
  */

  if (typeof pgroup == 'undefined' || pgroup.length == 0) {
    pgroup = "'%'";
  } else {
    pgroup = "'%" + pgroup + "%'";
  }

  localDB.getConnection(function (err, conn) {
    if (err) {
      utility.logMsg(err);
      //conn.release();
      next(err);
    }

    if (typeof asin != 'undefined' && asin != "") {
      var query = "SELECT asin, productName FROM products WHERE asin = '" + asin + "'";
      conn.query(query, function (err, result) {
        conn.release();
        if (err) {
          //throw (err);
          //console.log(sql);
          //res.send(err.message);
          utility.logMsg(err);
          next(err);
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
            utility.logMsg("[Success] '/viewProducts' with asin " + req.body.asin + " keyword " + req.body.keyword + " pgroup " + req.body.group);
            res.json({
              product: products
            });
          } else {
            utility.logMsg("[Fail] '/viewProducts' with asin " + req.body.asin + " keyword " + req.body.keyword + " pgroup " + req.body.group);
            res.json({
              message: "There are no products that match that criteria"
            });
          }
        }
      });
    } else {
      //var sql = 'SELECT * from products where pgroup like ' + pgroup + ' and (productName LIKE ' + keyword + ' OR productDescription LIKE ' + keyword + ')';
      /*
      var sql = "SELECT * from products where productName = '" + keyword + "'";
      conn.query(sql, function (err, result) {
        conn.release();
        if (err) {
          //throw (err);
          console.log(sql);
          res.send("SQL error");
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
      */
      if (typeof keyword == 'undefined' || keyword.length == 0) {
        utility.logMsg("[Fail] '/viewProducts' with asin " + req.body.asin + " keyword " + req.body.keyword + " pgroup " + req.body.group);
        res.json({
          message: "There are no products that match that criteria"
        });
      } else {
        var products = [];
        var product = {
          asin: "0000000000",
          productName: keyword
        };
        products.push(product);
        utility.logMsg("[Success] '/viewProducts' with asin " + req.body.asin + " keyword " + req.body.keyword + " pgroup " + req.body.group);
        res.json({
          product: products
        });
      }
    }
  });
});

router.post("/buyProducts", jsonParser, function (req, res, next) {
  utility.logMsg("[Enter] '/buyProducts' with username " + req.session.username);
  var failureRes = {
    message: "There are no products that match that criteria"
  };

  sess = req.session;
  if (sess.username) {
    var products = req.body.products;

    if (!products) {
      utility.logMsg("[Fail] '/buyProducts' with username " + req.session.username);
      res.json(failureRes);
      return;
    }

    utility.insertOrder(sess, req.body.products, function (err, data) {
      if (err) {
        utility.logMsg("[Fail] '/buyProducts' with username " + req.session.username);
        res.json(failureRes);
      } else {
        /*
        utility.updateRecommendation(req.body, function(err, data) {
          if(err) {
            res.json(failureRes);
          } else {
            res.json({
              message: "The action was successful"
            });
          }
        });
        */
        utility.logMsg("[Success] '/buyProducts' with username " + req.session.username);
        res.json({
          message: "The action was successful"
        });
      }
    });
  } else {
    utility.logMsg("[Fail] '/buyProducts' with username " + req.session.username);
    res.json({
      message: "You are not currently logged in"
    });
  }
});

router.post("/productsPurchased", jsonParser, function (req, res, next) {
  utility.logMsg("[Enter] '/productsPurchased' with username " + req.session.username);
  sess = req.session;
  if (sess.username && sess.role == "admin") {
    var failureRes = {
      message: "There are no users that match that criteria"
    };

    var username = req.body.username;
    if (!username) {
      utility.logMsg("[Fail] '/buyProducts' with username " + req.session.username);
      res.json(failureRes);
      return;
    }

    
    utility.getProductsPurchased(username, function (err, result) {
      if (err) {
        utility.logMsg("[Fail] '/buyProducts' with username " + req.session.username);
        res.json(failureRes);
      } else {
        if (typeof result !== 'undefined' && result.length > 0) {
          var retProducts = [];
          for (var i = 0; i < result.length; i++) {
            var resultProductName = result[i].productName;
            //var resultQuantity = result[i].quantity;
            var resultQuantity = 3;
            var product = {
              productName: resultProductName,
              quantity: resultQuantity
            };
            retProducts.push(product);
          }
          utility.logMsg("[Success] '/buyProducts' with username " + req.session.username);
          res.json({
            message: "The action was successful",
            products: retProducts
          })
        } else {
          utility.logMsg("[Fail] '/buyProducts' with username " + req.session.username);
          res.json(failureRes);
        }
      }
    });
    
    //res.json(failureRes);
  } else if (sess.username && sess.role == "customer") {
    utility.logMsg("[Fail] '/buyProducts' with username " + req.session.username);
    res.json({
      message: "You must be an admin to perform this action"
    });
  } else {
    utility.logMsg("[Fail] '/buyProducts' with username " + req.session.username);
    res.json({
      message: "You are not currently logged in"
    });
  }
});

router.post("/getRecommendations", jsonParser, function(req, res, next) {
  utility.logMsg("[Enter] '/getRecommendations' with username " + req.session.username);
  sess = req.session;
  if(sess.username) {
    utility.logMsg("[Fail] '/getRecommendations' with username " + req.session.username);
    res.json({
      message: "There are no recommendations for that product"
    });
  } else {
    utility.logMsg("[Fail] '/getRecommendations' with username " + req.session.username);
    res.json({
      message: "You are not currently logged in"
    });
  }
});

function isInteger(x) {
  return (typeof x === 'number') && (x % 1 === 0);
};

module.exports = router;