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
      var user = req.user;

      if (!user) {
        res.status(401);
        res.json({
          message: 'Unauthorized user'
        });
        return;
      }

      var rating = req.body.rating | 0;
      if (isNaN(rating) || rating < 1 || 5 < rating) {
        res.status(404);
        res.json({
          message: 'Invalid rating'
        });
        return;
      }

      var bookId = req.body.bookId;
      if (!bookId) {
        res.status(404);
        res.json({
          message: 'Invalid book'
        });
        return;
      }

      Book.findById(bookId, function (err, book) {
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

        if (!book.rating) {
          book.ratings = [];
        }
        var index = book.ratings.findIndex(function (userRating) {
          return userRating.userId == user._id;
        });
        if (index >= 0) {
          book.ratings[index].rating = rating;
        } else {
          book.ratings.push({
            userId: user._id,
            rating: rating
          });
        }

        book.save(function () {
          var newUpdate = new Update({
            text: user.username + ' rated ' + book.title,
            date: new Date(),
            user: {
              username: user.username,
              id: user._id
            },
            book: {
              _id: book.id,
              title: book.title,
            },
            rating: rating
          });
          res.json({
            result: book
          });
        });
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

  return bookRouter;
};

module.exports = routes;