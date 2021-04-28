const serverless = require('serverless-http');
const express = require('express');
const { sequelize } = require('./models');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Database Connection
async function connectionTesting() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

connectionTesting();

app.use(express.json());

// Route
app.use('/', indexRouter);
app.use('/users', usersRouter);


module.exports = app;
module.exports.handler = serverless(app);