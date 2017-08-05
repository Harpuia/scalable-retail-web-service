var mysql = require('mysql');
var model = require('../models/model');
//var localDB = model.localConnection;
var localDB = model.awsConnection;
//var localDB = model.auroraConnection;

var logMsg = function(msg) {
  console.log(msg);
}

var sql_set_value = function (conn, field, content) {
  if (content) {
    return "`" + field + "`=" + conn.escape(content);
  } else {
    return "";
  }
};

var insertOrder = function (session, products, fn) {
  localDB.getConnection(function (err, conn) {
    if (err) {
      console.log(err);
      conn.release();
      return;
    }
    
    // TODO: Check if the asin is in the table
    var values = "";
    var total = 0;
    for(var i = 0; i < products.length; i++) {
      if(total) {
        values += ',';
      }
      values += `('${products[i].asin}','${session.username}')`;
      total++;
    }
    var sql = 'insert into orders (asin,username) values ' + values;
    conn.query(sql, function(err, result) {
      conn.release();
      if(err) {
        console.log(sql);
        console.log(err.message);
        return fn(new Error(err.message));
      } else {
        return fn(null, true);
      }
    });
  });
}

var insertRecommendation = function (products, fn) {
  /*
  poolWrite.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      return;
    }
    var temp = products.asin.replace("[", "");
    var list = temp.replace("]", "").split(",").slice().sort();
    var results = [];
    for (var i = 0; i < list.length; i++) {
      if (i + 1 < list.length && list[i + 1] == list[i]) {
        continue;
      }
      results.push(list[i]);
    }
    if (results.length > 1) {
      var total = 0;
      var values = "";
      for (var i = 0; i < results.length; i++) {
        for (var j = 0; j < results.length; j++) {
          if (i == j) {
            continue;
          }
          if (total) {
            values += ',';
          }
          values += `('${results[i]}','${results[j]}')`;
          total++;
        }
      }
      connection.query('Insert into recom (bought,alsobought) values ' + values, function (err, results) {
        connection.release();
        if (err) {
          console.log(query.sql)
          console.log(err.message)
          return fn(new Error("There was a problem with this action"));
        }
        else {
          return fn(null, true);
        }
      })
    }
    else {
      connection.release();
      return fn(null, true);
    }

  });
  */
}

var getProductsPurchased = function(username, fn) {
  localDB.getConnection(function(err, conn) {
    if(err) {
      console.log(err);
      conn.release();
      return;
    }
    //var sql = "select p.productName,count(*) as quantity from orders o, products p where o.username='" + username + "' and o.asin=p.asin group by o.asin";
    var sql = "select p.productName from orders o, products p where o.username='" + username + "' and o.asin=p.asin group by o.asin";
    //console.log(sql);
    conn.query(sql, function(err, result) {
      conn.release();
      if(err) {
        console.log(sql);
        console.log(err.message);
        return fn(new Error(err.message));
      } else {
        return fn(null, result);
      }
    });
  });
}

var getRecommendations = function(asin, fn) {
    poolRead.getConnection(function (err, connection) {
        if (err) {
          console.log(err);  
          connection.release();
            return;
        }
        connection.query("select name from product_table p join (select alsobought from recom where bought ='" + asin + "' group by alsobought order by count(*) desc limit 5) as r on p.asin=r.alsobought;",
            function (err, results) {
                connection.release();
                if (err) {
                    console.log(query.sql)
                    console.log(err.message);
                    return fn(new Error("There was a problem with this action"));
                }
                else {
                    return fn(null, results);
                }
            })
    })
}

module.exports = {
  sql_set_value: sql_set_value,
  insertOrder: insertOrder,
  insertRecommendation: insertRecommendation,
  getProductsPurchased: getProductsPurchased,
  getRecommendations: getRecommendations,
  logMsg: logMsg
};