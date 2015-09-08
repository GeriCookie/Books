import toastr from 'toastr';

import data from 'app/data/data';
import handlebars from 'bower_components/handlebars/handlebars';

function all(context) {
  if (!data.users.hasUser()) {
    context.redirect('#/login');
  } else {
    data.myBooks.get()
      .then(function (books) {
        var $container = $('<div />');
        $.get('app/partials/book-details-partial.html', function (templateString) {
          var template = handlebars.compile(templateString);
          var booksTemplates = books.map(template);
          for (var i = 0; i < books.length; i += 1) {
            $container.append(booksTemplates[i]);
            //console.log(booksTemplates[i]);
            // var status = books[i].status;


          }
          // .forEach(function (bookhtml) {
          //   $container.append(bookhtml);

          // });
          $('#content').html($container.html());

          $('.btn-change-status').on('click', function () {
            var $this = $(this);
            var status = $this.attr('data-status');
            var bookId = $this.parents('.book-container').attr('data-id');
            var bookStatus = $this.parents('.book-container').attr('data-status');
            if (status === bookStatus) {
              $this.addClass("disabled");
            }
            console.log(bookId);
            data.myBooks.changeStatus(bookId, status);
            if (status === bookStatus) {
              $this.addClass("disabled");
            }
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