var express = require('express');
var router = express.Router();
var User = require('../models/user');
const catchErrors = require('../lib/async-error');
var bcrypt = require('bcrypt');

function generateHash(password){
  return bcrypt.hash(password, 10);
}

function comparePassword(password, hash){
  return bcrypt.compare(password, hash);
}

function validateEmail(email){
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function validateForm(form){
  var name = form.name || "";
  var email = form.email || "";

  if(!name) {
    return 'Name is required!';
  }

  if (!email) {
    return 'Email is required!';
  }

  if (!validateEmail(email)){
    return 'Invalid Email';
  }

  if (!form.password) {
    return 'Password is required!';
  }

  if (form.password.length < 6) {
    return 'Password is too short!';
  }

  return null;
}

router.get('/', function(req, res, next) {
  res.send('Hello User!');
});

router.post('/register', catchErrors(async (req, res, next) => {
  var err = validateForm(req.body);
  if(err){
    return res.send(err);
  }
  var user = await User.findOne({email: req.body.email});
  if(user) {
    return res.send('Already exists');
  }
  var password = await generateHash(req.body.password);
  user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: password
  });
  res.send('Registered successfully.');
}));

module.exports = router;