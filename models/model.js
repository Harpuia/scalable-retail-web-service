var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var localOptions = {
  connectionLimit: 10000,
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "e_commerce",
  /*
  createDatabaseTable: true,
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
  */
};

var awsOptions = {
  // When using MySQL instance deployed on AWS RDS service.
  host: "ediss-db.cektrjgecscm.us-east-1.rds.amazonaws.com",
  user: "root",
  password: "ediss_is_awesome",
  database: "e_commerce",
  /*
  createDatabaseTable: true,
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
  */
};

var localConnection = mysql.createPool(localOptions);
var awsConnection = mysql.createPool(awsOptions);
//var localSession = new MySQLStore(localOptions, localConnection);
//var awsSession = new MySQLStore(awsOptions, awsConnection);



module.exports = {
  localConnection: localConnection,
  awsConnection: awsConnection
};