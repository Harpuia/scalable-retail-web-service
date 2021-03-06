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
  connectionLimit: 1000,
  host: "ediss-db.cektrjgecscm.us-east-1.rds.amazonaws.com",
  user: "root",
  port: 3306,
  password: "ediss_is_awesome",
  database: "e_commerce",
  waitForConnections: "false"
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

var auroraOptions = {
  connectionLimit: 1000,
  host: "ediss-aurora.cluster-cektrjgecscm.us-east-1.rds.amazonaws.com",
  user: "root",
  port: 3306,
  password: "ediss_is_awesome",
  database: "e_commerce"
}

var localConnection = mysql.createPool(localOptions);
var awsConnection = mysql.createPool(awsOptions);
var auroraConnection = mysql.createPool(auroraOptions);
//var localSession = new MySQLStore(localOptions, localConnection);
//var awsSession = new MySQLStore(awsOptions, awsConnection);



module.exports = {
  localConnection: localConnection,
  awsConnection: awsConnection
};