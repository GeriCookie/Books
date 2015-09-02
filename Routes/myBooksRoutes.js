var express = require('express');

var routes = function(User, Book) {
  var myBooksRouter = express.Router();

  var myBooksController = require('../Controllers/myBooksController')(User, Book);
  myBooksRouter.route('/')
    .get(myBooksController.get)
    .put(myBooksController.put);
  return myBooksRouter;
};

module.exports = routes;
