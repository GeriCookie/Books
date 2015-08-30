require('../polyfills/array');
var bookController = function (Book) {
	var post = function (req, res) {
		var book = new Book(req.body);

		if (!req.body.title) {
			res.status(400);
			res.send('Title is required');
		} else {
			book.save(function (err, result) {
				if (err) {
					throw err;
				}
				res.status(201);
				res.send(book);
			});
		}
	};

	var get = function (req, res) {
		var query = {};

		var validParams = ['author'];
		validParams.forEach(function (name) {
			if (req.query[name]) {
				query[name] = req.query[name];
			}
		});
		Book.find(query, function (err, books) {
			if (err) {
				res.status(500).send(err);
			} else {
				if (req.query.genre) {
					var genre = req.query.genre.toLowerCase();
					books = books.filter(function (book) {
						return !!(book.genres.find(function (bookGenre) {
							return bookGenre.toLowerCase() === genre;
						}));
					});
				}
				res.json(books);
			}
		});
	};

	return {
		post: post,
		get: get
	};
};

module.exports = bookController;