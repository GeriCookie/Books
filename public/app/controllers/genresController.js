import toastr from 'toastr';

import data from 'app/data/data';
import handlebars from 'bower_components/handlebars/handlebars';

function all(context) {
  var genre = context.params.genre;
  data.genres.get()
    .then(function(genres) {
      var $container = $('<div />');
      $.get('app/partials/genres-all-partial.html', function(templateString) {
        var template = handlebars.compile(templateString);

        var html = template({
          genres
        });
        $('#content').html(html);
      });
    });
}

export {
  all
};
export default {
  all
};
