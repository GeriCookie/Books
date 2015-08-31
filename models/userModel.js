var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


var userModel = new Schema({
	username: {
		type: String
	},
	password: {
		type: String
	},
	booksToRead: {
		type: [String]
	},
	booksCurrentlyReading: {
		type: [String]
	},
	booksRead: {
		type: [String]
	}

});

module.exports = mongoose.model('User', userModel);