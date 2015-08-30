var express = require('express'),
	bodyParser = require('body-parser');
mongoose = require('mongoose');


var db = mongoose.connect('mongodb://localhost/books');

var Book = require('./models/bookModel');
var app = express();

var port = 3000;

//needed for the client to work
//  serves public dir to localhost
app.use('/', express.static(__dirname + '/public'));


app.use(bodyParser.json());

var bookRouter = require('./Routes/bookRoutes')(Book);
app.use('/api/books', bookRouter);
app.use('/api/authors', bookRouter);


app.get('/api/genres', function (req, res) {
	Book.find({}, function (err, books) {
		var genres = {};
		books.forEach(function (book) {
			book.genres.forEach(function (genre) {
				genres[genre] = true;
			});

		});
		genres = Object.keys(genres);
		res.json(genres);
	});
});

app.listen(port, function () {
	console.log('Running on PORT: ' + port);
});

module.exports = app;