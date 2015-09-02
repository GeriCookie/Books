require('../polyfills/array');

var myBooksController = function(User, Book) {
  var put = function(req, res) {
    var user = req.user;

    if (!user) {
      res.status(401);
      res.json({
        message: 'Unauthorized user'
      });
      return;
    }

    var obj = {
      bookId: req.body.bookId,
      bookStatus: req.body.bookStatus
    };
    Book.findById(obj.bookId, function(err, book) {
      if (err) {
        // res.status(500).json(err);
        throw err;
      }
      if (!book) {
        res.status(404).json({
          message: 'No book found'
        });
        return;
      }


      ['booksToRead', 'booksCurrentlyReading', 'booksRead'].forEach(function(name) {
        var index = user[name].findIndex(function(myBook) {
          return myBook.id === book._id.toString();
        });
        if (index >= 0) {
          user[name].splice(index, 1);
        }
      });

      var statusMap = {
        'want-to-read': 'booksToRead',
        'currently-reading': 'booksCurrentlyReading',
        'read': 'booksRead'
      };

      user[statusMap[obj.bookStatus]].push({
        id: book._id,
        updateDate: new Date()
      });

      User.update({
        _id: user._id
      }, {
        booksToRead: user.booksToRead,
        booksCurrentlyReading: user.booksCurrentlyReading,
        booksRead: user.booksRead
      }, function() {
        res.json(true);
        console.log('Book saved');
      });
    });
  };

  var get = function(req, res) {
    var user = req.user;
    if (!user) {
      res.status(401);
      res.json({
        message: 'Unauthorized user'
      });
      return;
    }
    var books = user.booksToRead.concat(user.booksCurrentlyReading).concat(user.booksRead);

    var bookIds = books.map(function(book) {
      return book.id;
    });
    Book.find({
      _id: {
        "$in": bookIds
      }
    }, function(err, books) {
      if (err) {
        throw err;
      }
      res.json(books);
    });
  };

  return {
    put: put,
    get: get
  };
};


module.exports = myBooksController;
