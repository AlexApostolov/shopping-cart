"use strict";
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const session = require('express-session');
// Save session data captured in Express into mongodb
const MongoStore = require('connect-mongo')(session);

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// APIs
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bookshop');

var db = mongoose.connection;
db.on('error', console.error.bind(console, '# MongoDB - connection error: '));

// ---->>> SET UP SESSIONS <<<----
app.use(session({
  secret: 'mySecretString',
  saveUninitialized: false, // Record a session only if user adds a product to cart
  resave: false, // Don't resave if nothing changed
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 2}, // 2 days in milliseconds
  store: new MongoStore({mongooseConnection: db, ttl: 2 * 24 * 60 * 60}) // Set expiration for when to automatically remove session from database (Time To Leave: 2 days * 24 hours * 60 minutes * 60 seconds)
}));
// SAVE SESSION CART API
app.post('/cart', function(req, res) {
  var cart = req.body;
  req.session.cart = cart;
  req.session.save(function(err) {
    if(err) {
      throw err;
    }
    res.json(req.session.cart);
  });
});
// GET SESSION CART API--verify
app.get('/cart', function(req, res) {
  if (typeof req.session.cart !== 'undefined') {
    res.json(req.session.cart);
  }
});
// ---->>> END SESSIONS SET UP <<<----

var Books = require('./models/books.js');

//---->>> POST BOOKS <<<----
// Pass an array of books in the body at /books using the client
app.post('/books', function(req, res) {
  var book = req.body;

  // Save one or more documents with the mongoose "create" method
  Books.create(book, function(err, books) {
    if (err) {
      throw err;
    }
    res.json(books);
  })
});

//---->>> GET BOOKS <<<----
app.get('/books', function(req, res) {
  Books.find(function(err, books) {
    if (err) {
      throw err;
    }
    res.json(books);
  })
});

//---->>> DELETE BOOKS <<<----
app.delete('/books/:_id', function(req, res) {
  var query = {_id: req.params._id};

  Books.remove(query, function(err, books) {
    if (err) {
      throw err;
    }
    res.json(books);
  })
});

//---->>> UPDATE BOOKS <<<----
app.put('/books/:_id', function(req, res) {
  var book = req.body;
  var query = req.params._id;

  // If the field doesn't exist $set will set a new field
  var update = {
    '$set': {
      title: book.title,
      description: book.description,
      image: book.image,
      price: book.price
    }
  };
  // When true, returns the updated document instead of only status
  var options = {new: true};

  Books.findOneAndUpdate(query, update, options, function(err, books) {
    if (err) {
      throw err;
    }
    res.json(books);
  })
});

// END APIs

app.listen(3001, function(err) {
  if (err) {
    return console.log(err);;
  }
  console.log('API Server is listening on http://localhost:3001');
});
