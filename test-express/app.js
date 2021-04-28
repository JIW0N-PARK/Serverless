const serverless = require('serverless-http');
const express = require('express');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Route
app.use('/', indexRouter);
app.use('/users', usersRouter);


module.exports = app;
module.exports.handler = serverless(app);