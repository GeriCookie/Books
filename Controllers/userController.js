require('../polyfills/array');
var userController = function (User) {
	var post = function (req, res) {
		var username = req.body.username,
			passHash = req.body.passhash,
			query = {
				username: username.toLowerCase()
			};

		User.find(query, function (err, users) {
			if (err) {
				throw err;
			}
			if (users && users.length > 0) {
				res.status(400)
					.json({
						err: 'Already such user'
					});
				return;
			}

			var user = new User({
				username: username.toLowerCase(),
				nickname: username,
				passHash: passHash,
				authKey: (function (username) {
					var len = 60,
						chars = '0123456789',
						authKey = username;
					while (authKey.length < len) {
						authKey += chars[(Math.random() * chars.length) | 0];
					}
					return authKey;
				}(username))
			});
			user.save(function (err, user) {
				if (err) throw err;
				res.status(201)
					.json({
						username: user.nickname,
						authKey: user.authKey
					});
			});
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