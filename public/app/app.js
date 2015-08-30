import data from 'app/data/data';
import handlebars from 'bower_components/handlebars/handlebars';

var sammyApp = Sammy('#content', function () {

  this.get('#/', function () {
    console.log('----HOME');
  });

  this.get('#/books', function () {
    var params = {
      author: this.params.author,
      genre: this.params.genre,
    };

    data.books.get(params)
      .then(function (books) {
        var $container = $('<div />');
        $.get('app/partials/book-id-partial.html', function (templateString) {
          var template = handlebars.compile(templateString);
          books.map(template)
            .forEach(function (bookhtml) {
              $container.append(bookhtml);
            });
          $('#content').html($container.html());
        });
      });
  });



  this.get('#/books/add', function (context) {
    //context === this

    this.load('app/partials/book-add-partial.html')
      .swap();

    var $button = $('#content')
      .on('click', '#add-book', function () {
        var genres = [];
        $('.tb-genre').each(function (index, genre) {
          var value = $(genre).val();
          if (value) {
            genres.push(value);
          }
        });
        data.books.save({
            title: $('#tb-title').val(),
            author: $('#tb-author').val(),
            genres: genres,
            description: $('#tb-description').val(),
            pages: $('#tb-pages').val(),

          })
          .then(function (book) {
            context.redirect('#/books/' + book._id);
          });
      });

  });

  this.get('#/books/:id', function (context) {
    var that = this;
    var bookId = this.params.id;
    data.books.getById(bookId)
      .then(function (book) {
        $.get('app/partials/book-id-partial.html', function (templateString) {
          var template = handlebars.compile(templateString);
          var html = template(book);
          $('#content').html(html);
        });
      });
  });

  this.get('#/genres', function () {
    var genre = this.params.genre;

    // data.books.getBooks({
    //     genre: genre
    //   })
    //   .then(function (books) {
    //     var $list = $('<ul />');
    //     books.forEach(function (book) {
    //       $('<li/>')
    //         .append(book.title)
    //         .append(
    //           $('<a/>')
    //           .attr('href', '#/genres?genre=' + book.genre)
    //           .html(book.genre)
    //         )
    //         .appendTo($list);
    //     });
    //   });
  });
});

$(function () {
  sammyApp.run('#/');
});

// data.books.save({
//     title: 'Name of the Wind',
//     date: new Date()
//   })
//   .then(function(book) {
//     console.log('Book added:');
//     console.log(book);
//     return data.books.getById(1);
//   })
//   .then(function(book) {
//     console.log('Book found!');
//     console.log(book);
//   });