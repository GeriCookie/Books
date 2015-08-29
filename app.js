var express = require('express'),
  bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/public'));

var books = [];
app.get('/api/books', function(req, res) {
  var query = {},
    validParamNames = ['author', 'genre'];

  for (var paramName in validParamNames) {
    if (req.query[paramName]) {
      query[paramName] = req.query[paramName];
    }
  }
  res.json({
    books
  });
});

var lastId = 0;
app.post('/api/books', function(req, res) {
  var book = req.body;

  book.id = lastId += 1;
  books.push(book);

  res.status(201)
    .json(book);
});

app.listen(3000, function() {
  console.log('listening at http://localhost:3000');
});
