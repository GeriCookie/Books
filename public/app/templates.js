import $ from 'jquery';

import handlebars from 'bower_components/handlebars/handlebars';

function get(name){
  var promise = new Promise(function(resolve, reject){
    $.ajax({
      url:'app/partials/' + name  + '-partial.html',
      method: 'GET',
      success:  function(html){
        var template = handlebars.compile(html);
        resolve(template);
      }
    })
  });
  return promise;
}


export {get};
export default {get};
