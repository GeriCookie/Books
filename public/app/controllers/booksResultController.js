import toastr from 'toastr';

import data from 'app/data/data';
import handlebars from 'bower_components/handlebars/handlebars';

import templates from 'app/templates';

function all(context) {
  var params = {
    pattern: this.params.pattern,
    page: this.params.page,
    size: this.params.size
  };
  var books,
    pages;
  data.books.getSearchedBooks(params)
    .then(function (res) {
      console.log(res);
      books = res.result.books;
      pages = +res.result.pages;
      return templates.get('book-id');
    })
    .then(function (template) {
      var $container = $('<div/>');

      books.map(function (book) {
          book.description = book.description.substr(0, 290);
          return book;
        })
        .map(template)
        .forEach(function (bookhtml) {
          $container.append(bookhtml);
        });

      var $pages = $('<div/>')
        .addClass('pages')
        .html('<strong>Page: </strong>');
      for (var i = 0; i < pages; i += 1) {
        $('<a />')
          .attr('href', '#/books-result?pattern=' + params.pattern + '&page=' + (i + 1))
          .html(i + 1)
          .appendTo($pages);
      }

      $('#content').html($container.html())
        .append($pages);

      $('.btn-change-status').on('click', function () {
        if (!data.users.hasUser()) {
          context.redirect('#/login');
          return;
        }
        var $this = $(this);
        var status = $this.attr('data-status');
        var bookId = $this.parents('.book-container').attr('data-id');
        data.myBooks.changeStatus(bookId, status);
      });
    });
}



export {
  all
};
export default {
  all
};