var express = require('express');

var routes = function (User, Book, Update) {
	var myBooksRouter = express.Router();

	var myBooksController = require('../Controllers/myBooksController')(User, Book, Update);
	myBooksRouter.route('/')
		.get(myBooksController.get)
		.put(myBooksController.put);


	myBooksRouter.route('/all')
		.get(function (req, res) {
			var user = req.user;
			if (!user) {
				res.status(401);
				res.json({
					message: 'Unauthorized user'
				});
				return;
			}
			var books = user.booksToRead.concat(user.booksCurrentlyReading).concat(user.booksRead);

			var bookIds = books.map(function (book) {
				return book.id;
			});
			Book.find({
				_id: {
					"$in": bookIds
				}
			}, function (err, books) {
				if (err) {
					throw err;
				}
				res.json(books);
			});
		});

	myBooksRouter.route('/to-read')
		.get(function (req, res) {
			var user = req.user;
			if (!user) {
				res.status(401);
				res.json({
					message: 'Unathorized user'
				});
				return;
			}

			var books = user.booksToRead;

			var bookIds = books.map(function (book) {
				return book.id;
			});

			Book.find({
				_id: {
					"$in": bookIds
				}
			}, function (err, books) {
				if (err) {
					throw err;
				}
				res.json(books);
			});
		});

	myBooksRouter.route('/currently-reading')
		.get(function (req, res) {
			var user = req.user;
			if (!user) {
				res.status(401);
				res.json({
					message: 'Unathorized user'
				});
				return;
			}

			var books = user.booksCurrentlyReading;

			var bookIds = books.map(function (book) {
				return book.id;
			});

			Book.find({
				_id: {
					"$in": bookIds
				}
			}, function (err, books) {
				if (err) {
					throw err;
				}
				res.json(books);
			});
		});


	myBooksRouter.route('/read')
		.get(function (req, res) {
			var user = req.user;
			if (!user) {
				res.status(401);
				res.json({
					message: 'Unathorized user'
				});
				return;
			}

			var books = user.booksRead;

			var bookIds = books.map(function (book) {
				return book.id;
			});

			Book.find({
				_id: {
					"$in": bookIds
				}
			}, function (err, books) {
				if (err) {
					throw err;
				}
				res.json(books);
			});
		});



	return myBooksRouter;
};

module.exports = routes;