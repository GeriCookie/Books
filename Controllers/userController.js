require('../polyfills/array');
var userController = function (User) {
	var post = function (req, res) {
		var user = new User(req.body);

		user.save(function (err, result) {
			if (err) {
				throw err;
			}
			res.status(201);
			res.send(book);
		});
	};

	var get = function (req, res) {
		var query = {};

		User.find(query, function (err, users) {
			if (err) {
				res.status(500).send(err);
			} else {
				res.json(users);
			}
		});
	};

	return {
		post: post,
		get: get
	};
};

module.exports = userController;