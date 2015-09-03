var express = require('express');

var routes = function (Book) {
	var bookRouter = express.Router();

	var bookController = require('../Controllers/bookController')(Book);

	bookRouter.route('/')
		.post(bookController.post)
		.get(bookController.get);

	bookRouter.use('/:bookId', function (req, res, next) {
		Book.findById(req.params.bookId, function (err, book) {
			if (err) {
				res.status(500).send(err);
			} else if (book) {
				req.book = book;
				next();
			} else {
				res.status(404).send('no book found');
			}
		});
	});

	bookRouter.route('/:bookId')
		.get(function (req, res) {
			var returnBook = req.book.toJSON();

			returnBook.links = {};
			var newLink = 'http://' + req.headers.host + '/api/books/?genre=' + returnBook.genre;
			returnBook.links.FilterByThisGenre = newLink.replace(' ', '%20');
			res.json(returnBook);

		})
		.put(function (req, res) {
			if (req.body._id) {
				delete req.body._id;
			}
			for (var p in req.body) {
				req.book[p] = req.body[p];
			}
			req.book.save(function (err) {
				if (err) {
					res.status(500).send(err);
				} else {
					res.json(req.book);
				}
			});
		})
		.delete(function (req, res) {
			req.book.remove(function (err) {
				if (err) {
					res.status(500).send(err);
				} else {
					res.status(204).send('Removed');
				}
			});
		});

	bookRouter.route('api/books/pages')
		.get(function (req, res) {
			var size = req.query.size || 10;
			Book.find({}, function (err, books) {
				if (err) {
					res.status(404).send(err);
				}
				var booksCount = books.length;
				var pagesCount = booksCount / size + 1;
				res.json({
					pages: pagesCount
				});
			});
		});

	return bookRouter;
};

module.exports = routes;