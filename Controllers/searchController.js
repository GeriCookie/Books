require('../polyfills/array');
var searchController = function (Book) {
	var get = function (req, res) {

		var pattern = req.query.pattern.toLowerCase(),
			page = req.query.page || 0,
			size = req.query.size || 10;
		Book.find({
			"title": {
				"$regex": pattern,
				"$options": "ig"
			}
		}, function (err, books) {
			if (err) {
				throw err;
			} else {
				books.sort(function (b1, b2) {
					var title1 = b1.title.toString(),
						title2 = b2.title.toString();
					return title1.localeCompare(title2);
				});
				var count = books.length;
				books = books.slice((page - 1) * size, page * size);


				res.json({
					result: {
						books: books,

						pages: (count + 1) / size
					}
				});
			}
		});
	};


	return {
		get: get
	};
};

module.exports = searchController;