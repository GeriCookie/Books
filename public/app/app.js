import toastr from 'toastr';

import data from 'app/data/data';
import handlebars from 'bower_components/handlebars/handlebars';

var sammyApp = Sammy('#content', function () {

  this.get('#/', function () {
    console.log('----HOME');
  });

  this.get('#/books', function (context) {
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

          $('.btn-change-status').on('click', function () {
            if (!data.users.hasUser()) {
              context.redirect('#/login');
            } else {
              var $this = $(this);
              var status = $this.attr('data-status');
              var bookId = $this.parents('.book-container').attr('data-id');
              console.log(bookId);
              data.myBooks.changeStatus(bookId, status);
            }
          });
        });
      });


  });

  this.get('#/login', function (context) {
    $.get('app/partials/login-partial.html', function (html) {
      $('#content').html(html);

      $('#login-form').on('submit', function () {
        var username = $('#username').val();
        var password = $('#password').val();

        data.users.login({
            username: username,
            password: password
          })
          .then(function (user) {
            context.redirect('#/books');
            document.location.reload(true);
          }, function (err) {
            alert(JSON.stringify(err));
          });
      });

      $('#register').on('click', function () {
        console.log('HERE');
        context.redirect('#/register');
      });

    });
  });

  this.get('#/register', function (context) {
    $.get('app/partials/register-partial.html', function (html) {
      $('#content').html(html);

      $('#register').on('click', function () {
        var username = $('#username').val();
        var password = $('#password').val();
        var confirmPassword = $('#confirm-password').val();
        var email = $('#email').val();

        if (password !== confirmPassword) {
          $('.wrong-confirm-password').show();
          $('.wrong-confirm-password').parent().addClass('has-error');
          return;

        }

        if (!password.match(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{4,})$/)) {
          $('.wrong-password').show();
          $('.wrong-password').parent().addClass('has-error');
          console.log("Hodor");
          return;

        }

        data.users.register({
            username: username,
            password: password,
            // email: email
          })
          .then(function (user) {
            context.redirect('#/login');
          }, function (err) {
            alert(JSON.stringify(err));
          });
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
          if (!data.users.hasUser()) {
            context.redirect('#/login');
          } else {
            toastr.options.extendedTimeOut = 0;
            var validateTitle = validateInput($('#tb-title'), 'Title is mandatory!');
            var validateAuthor = validateInput($('#tb-author'), 'Author is mandatory!');
            var validateGenre = validateInput($('#tb-genre1'), 'At least one genre is mandatory!');
            var validateDescription = validateInput($('#tb-description'), 'Description is mandatory!');

            if (validateTitle && validateAuthor && validateGenre && validateDescription) {
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
                  coverUrl: $('#tb-cover-url').val()
                })
                .then(function (book) {
                  toastr.clear();
                  toastr.success('Book added successfully!');
                  context.redirect('#/books/' + book._id);
                });
            }
          }
        });

      $(document).ready(function () {
        $('#tb-cover').hide();

        $('#tb-btn-preview').on('click', function () {
          var validateUrl = validateInput($('#tb-cover-url'), 'Invalid cover Url');
          if (validateUrl) {
            var $uploadButton = $('#tb-btn-preview')
              .on('click', function () {
                var $imgURL = $('#tb-cover-url').val();
                $('#tb-cover')
                  .attr('src', $imgURL)
                  .show();
              });
          }
        });
      });

      function validateInput(tagId, errorMsg) {
        if (tagId.val() === '' || tagId.val().trim() === '') {
          toastr.error(errorMsg);
          return false;
        } else {
          return true;
        }
      }
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

          // because html adds the content after the sdk triggering
          // we need to reparse the sdk after the load
          FB.XFBML.parse();

          $('.btn-change-status').on('click', function () {
            if (!data.users.hasUser()) {
              context.redirect('#/login');
            } else {

              var $this = $(this);
              var status = $this.attr('data-status');
              var bookId = $this.parents('.book-container').attr('data-id');
              console.log(bookId);
              data.myBooks.changeStatus(bookId, status);
            }
          });
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

          $(document).ready(function () {
            $('#tb-cover').hide();
          });

          var $uploadButton = $('#tb-btn-preview')
            .on('click', function () {
              var validateUrl = validateInput($('#tb-cover-url'), 'Invalid cover Url');
              if (validateUrl) {
                var $uploadButton = $('#tb-btn-preview')
                  .on('click', function () {
                    var $imgURL = $('#tb-cover-url').val();
                    $('#tb-cover')
                      .attr('src', $imgURL)
                      .show();

                  });
              }
            });

          $('#save')
            .on('click', function () {
              if (!data.users.hasUser()) {
                context.redirect('#/login');
              } else {
                toastr.options.extendedTimeOut = 0;
                var validateTitle = validateInput($('#tb-title'), 'Title is mandatory!');
                var validateAuthor = validateInput($('#tb-author'), 'Author is mandatory!');
                var validateGenre = validateInput($('#tb-genre1'), 'At least one genre is mandatory!');
                var validateDescription = validateInput($('#tb-description'), 'Description is mandatory!');

                if (validateTitle && validateAuthor && validateGenre && validateDescription) {
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
                      pages: $('#tb-pages').val(),
                      coverUrl: $('#tb-cover-url').val()
                    })
                    .then(function (book) {
                      context.redirect('#/books/' + book._id);
                    });
                  toastr.clear();
                  toastr.success('Book edited successfully!');
                }
              }
            });

          function validateInput(tagId, errorMsg) {
            console.log(tagId);
            if (tagId.val() === '' || tagId.val().trim() === '') {
              toastr.error(errorMsg);
              return false;
            } else {
              return true;
            }
          }
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

  this.get('#/mybooks', function () {
    data.myBooks.get()
      .then(function (books) {
        var $container = $('<div />');
        $.get('app/partials/book-id-partial.html', function (templateString) {
          var template = handlebars.compile(templateString);
          books.map(template)
            .forEach(function (bookhtml) {
              $container.append(bookhtml);
            });
          $('#content').html($container.html());

          $('.btn-change-status').on('click', function () {
            var $this = $(this);
            var status = $this.attr('data-status');
            var bookId = $this.parents('.book-container').attr('data-id');
            console.log(bookId);
            data.myBooks.changeStatus(bookId, status);
          });
        });
      });
  });
});

$(function () {
  sammyApp.run('#/');

  if (data.users.hasUser()) {
    $('#btn-nav-logout')
      .removeClass('hidden');
  } else {
    $('#btn-nav-login')
      .removeClass('hidden');
  }

  $('#btn-nav-logout').on('click', function () {
    data.users.logout()
      .then(function () {
        document.location.reload(true);
      });
  });

  loadGenresSidebar();
});

function loadGenresSidebar() {
  data.genres.get()
    .then(function (genres) {
      var $container = $('<div />');
      $.get('app/partials/genres-sidebar-partial.html', function (templateString) {
        var template = handlebars.compile(templateString);

        var html = template({
          genres
        });
        $('#genres-container').html(html);
      });
    });
}