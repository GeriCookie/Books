import data from 'app/data/data';
import handlebars from 'bower_components/handlebars/handlebars';

var sammyApp = Sammy('#content', function () {

  this.get('#/', function () {
    console.log('----HOME');
  });

  this.get('#/books', function () {
    var params = {
      author: this.params.author,
      genre: this.params.genre
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

    $.get('app/partials/book-add-partial.html', function (html) {
      // body...
      $('#content').html(html);

      var $button = $('#add-book')
        .on('click', function () {
          var genres = [];
          $('.tb-genre').each(function (index, genre) {
            var value = $(genre).val();
            if (value) {
              genres.push(value);
            }
          });
          data.books.save({
              title: $('#tb-title').val(),
              //cover: $('#tb-cover').data(),
              author: $('#tb-author').val(),
              genres: genres,
              description: $('#tb-description').val(),
              pages: $('#tb-pages').val()

            })
            .then(function (book) {
              context.redirect('#/books/' + book._id);
            });
        });

        var $uploadButton = $('#btn-load-cover')
            .on('click', function () {
                $('#btn-hidden').click();

                $('#btn-hidden').on('change', function () {
                    var file = $('#btn-hidden')[0].files[0];
                    var reader = new FileReader();

                    reader.onload = function () {
                    $('#tb-cover').attr('src', reader.result);
                    };
                    reader.readAsDataURL(file);

                    $('#tb-cover').css('display', 'block');
                    })
                });
    });
  });

  this.get('#/books/:id/edit', function (context) {
    var bookId = this.params.id;
    data.books.getById(bookId)
      .then(function (book) {
        $.get('app/partials/book-edit-partial.html', function (templateString) {
          var template = handlebars.compile(templateString);
          var html = template(book);
          $('#content').html(html);

          $('#save')
            .on('click', function () {

              var genres = [];
              $('.tb-genre').each(function (index, genre) {
                var value = $(genre).val();
                if (value) {
                  genres.push(value);
                }
              });
              data.books.edit({
                  id: bookId,
                  title: $('#tb-title').val(),
                  author: $('#tb-author').val(),
                  genres: genres,
                  rating: $('#tb-rating').val(),
                  description: $('#tb-description').val(),
                  pages: $('#tb-pages').val()
                })
                .then(function (book) {
                  context.redirect('#/books/' + book._id);
                });
            });

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
    data.genres.get()
      .then(function (genres) {
        var $container = $('<div />');
        $.get('app/partials/genres-all-partial.html', function (templateString) {
          var template = handlebars.compile(templateString);

          var html = template({
            genres
          });
          $('#content').html(html);
        });
      });
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