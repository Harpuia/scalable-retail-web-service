var mysql = require('mysql');

var localConnection = mysql.createPool({
    connectionLimit: 10000,
    host: "localhost",
    user: "root",
    password: "",
    database: "e_commerce"
});

var awsConnection = mysql.createPool({
    // When using MySQL instance deployed on AWS RDS service.
    host: "simpleamazon.cektrjgecscm.us-east-1.rds.amazonaws.com",
    user: "root",
    password: "ediss_is_awesome",
    database: "e_commerce"
});

module.exports = {
    localConnection: localConnection,
    awsConnection: awsConnection
};