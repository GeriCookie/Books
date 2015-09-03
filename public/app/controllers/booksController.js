import toastr from 'toastr';

import data from 'app/data/data';
import handlebars from 'bower_components/handlebars/handlebars';

import templates from 'app/templates';

function all(context) {
  var params = {
    author: this.params.author,
    genre: this.params.genre
  };
  var books;
  data.books.get(params)
    .then(function(resBooks) {
      books = resBooks;
      return templates.get('book-id');
    })
    .then(function(template) {
      var $container = $('<div/>');
      books.map(template)
        .forEach(function(bookhtml) {
          $container.append(bookhtml);
        });
      $('#content').html($container.html());

      $('.btn-change-status').on('click', function() {
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
}

function add(context) {
  if (!data.users.hasUser()) {
    context.redirect('#/login');
    return;
  }
  templates.get('book-add')
    .then(function(template) {

      $('#content').html(template());

      $('#add-book')
        .on('click', function() {
          toastr.options.extendedTimeOut = 0;
          var validateTitle = data.validation.validateInput($('#tb-title'), 'Title is mandatory!');
          var validateAuthor = data.validation.validateInput($('#tb-author'), 'Author is mandatory!');
          var validateGenre = data.validation.validateInput($('#tb-genre1'), 'At least one genre is mandatory!');
          var validateDescription = data.validation.validateInput($('#tb-description'), 'Description is mandatory!');

          if (validateTitle && validateAuthor && validateGenre && validateDescription) {
            var genres = [];
            $('.tb-genre').each(function(index, genre) {
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
              .then(function(book) {
                toastr.clear();
                toastr.success('Book added successfully!');
                context.redirect('#/books/' + book._id);
              });
          }
        });
    });
}

function byId(context) {
  var that = this;
  var bookId = this.params.id;
  data.books.getById(bookId)
    .then(function(book) {
      $.get('app/partials/book-id-partial.html', function(templateString) {
        var template = handlebars.compile(templateString);
        var html = template(book);
        $('#content').html(html);

        // because html adds the content after the sdk triggering
        // we need to reparse the sdk after the load
        FB.XFBML.parse();

        $('.btn-change-status').on('click', function() {
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
}

function edit(context) {
  if (!data.users.hasUser()) {
    console.log("Hodor hodors");
    context.redirect('#/login');
  } else {
    var bookId = this.params.id;
    data.books.getById(bookId)
      .then(function(book) {
        $.get('app/partials/book-edit-partial.html', function(templateString) {
          var template = handlebars.compile(templateString);
          var html = template(book);
          $('#content').html(html);

          $('#save')
            .on('click', function() {
              console.log('asd');
              toastr.options.extendedTimeOut = 0;
              var validateTitle = data.validation.validateInput($('#tb-title'), 'Title is mandatory!');
              var validateAuthor = data.validation.validateInput($('#tb-author'), 'Author is mandatory!');
              // var validateGenre = data.validation.validateInput($('#tb-genre1'), 'At least one genre is mandatory!');
              var validateDescription = data.validation.validateInput($('#tb-description'), 'Description is mandatory!');

              if (validateTitle && validateAuthor && validateDescription) {
                var genres = [];
                $('.tb-genre').each(function(index, genre) {
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
                  .then(function(book) {
                    context.redirect('#/books/' + book._id);
                  });
                toastr.clear();
                toastr.success('Book edited successfully!');
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
  }
}


export {
  all, add, byId, edit
};
export default {
  all, add, byId, edit
};
