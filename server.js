var express = require('express');
var session = require('express-session');
var app = express();

var restRouter = require("./routes/api");

app.use (
    session ({
        secret: "ediss",
        resave: true,
        rolling: true,
        saveUninitialized: false,
        cookie: {
            expires: 15 * 60 * 1000
        }
    })
);

app.use("/", restRouter);

app.listen(4000);