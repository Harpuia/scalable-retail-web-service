var express = require('express');
var redis = require('redis');
var session = require('express-session');
var cookieParser = require('cookie-parser');
//var mySQLStore = require('express-mysql-session')(session);
var redisStore = require('connect-redis')(session);
var client = redis.createClient();
var app = express();

var restRouter = require("./routes/api");
var model = require('./models/model');
//var sessionStore = new mySQLStore(model.localOptions);

app.use(
  session({
    secret: "ssshhhhh",
    //store: model.localSession,
    store: new redisStore({
      //host: "localhost",
      host: "ec2-34-205-182-99.compute-1.amazonaws.com",
      port: 6379,
      client: client,
      ttl: 260
    }),
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: {
      expires: 15 * 60 * 1000
    }
  })
);
app.use(cookieParser("secretSign#143_!223"));
//app.use(bodyParser.urlencoded({extended: false}));
//app.use(bodyParser.json());
app.use("/", restRouter);

app.listen(4000);