import toastr from 'toastr';

import data from 'app/data/data';
import handlebars from 'bower_components/handlebars/handlebars';

import templates from 'app/templates';

function login(context) {
  templates.get('login')
    .then(function(template) {
      $('#content').html(template());

      $('#login-form').on('submit', function() {
        var username = $('#username').val();
        var password = $('#password').val();

        data.users.login({
            username: username,
            password: password
          })
          .then(function(user) {
            context.redirect('#/books');
            document.location.reload(true);
          }, function(err) {
            alert(JSON.stringify(err));
          });
      });

      $('#register').on('click', function() {
        console.log('HERE');
        context.redirect('#/register');
      });

    });
}

function register(context) {
  $.get('app/partials/register-partial.html', function(html) {
    $('#content').html(html);

    $('#register').on('click', function() {
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
        .then(function(user) {
          context.redirect('#/login');
        }, function(err) {
          alert(JSON.stringify(err));
        });
    });
  });
}


export {
  login, register
};
export default {
  login, register
};
