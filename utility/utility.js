var mysql = require('mysql');

var sql_set_value = function (conn, field, content) {
    if(content) {
        return "`" + field + "`=" + conn.escape(content); 
    } else {
        return "";
    }
};

module.exports = {
    sql_set_value: sql_set_value
};