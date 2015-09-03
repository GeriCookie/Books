import toastr from 'toastr';

import data from 'app/data/data';
import handlebars from 'bower_components/handlebars/handlebars';

function all(context) {
  if (!data.users.hasUser()) {
    context.redirect('#/login');
  } else {
    data.myBooks.get()
      .then(function(books) {
        var $container = $('<div />');
        $.get('app/partials/book-details-partial.html', function(templateString) {
          var template = handlebars.compile(templateString);
          books.map(template)
            .forEach(function(bookhtml) {
              $container.append(bookhtml);
            });
          $('#content').html($container.html());

          $('.btn-change-status').on('click', function() {
            var $this = $(this);
            var status = $this.attr('data-status');
            var bookId = $this.parents('.book-container').attr('data-id');
            console.log(bookId);
            data.myBooks.changeStatus(bookId, status);
          });
        });
      });
  }
}

export {
  all
};
export default {
  all
};
