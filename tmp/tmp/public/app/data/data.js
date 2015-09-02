import 'app/polyfills/array';
import 'bower_components/sha1/index';
//users
function registerUser(user) {
  var promise = new Promise(function (resolve, reject) {
    var url = 'api/users';
    var pass = user.password;
    var passHash = CryptoJS.SHA1(pass).toString();

    var userSend = {
      username: user.username,
      passHash: passHash
    };

    $.ajax({
      url: url,
      method: 'POST',
      data: JSON.stringify(userSend),
      contentType: 'application/json',
      success: function (user) {
        resolve(user);
      },
      error: function (err) {
        resolve(err);
      }
    });
  });
  return promise;
}

function loginUser(user) {
  var promise = new Promise(function (resolve, reject) {
    var url = 'api/users/auth';
    var pass = user.password;
    var passHash = CryptoJS.SHA1(pass).toString();
    var userSend = {
      username: user.username,
      passHash: passHash
    };

    var authKey = localStorage.getItem('auth-key'),
      username = localStorage.getItem('username');

    $.ajax({
      url: url,
      method: 'PUT',
      data: JSON.stringify(userSend),
      contentType: 'application/json',
      success: function (user) {
        username = user.username;
        authKey = user.authKey;
        localStorage.setItem('username', username);
        localStorage.setItem('auth-key', authKey);
        console.log('in success');
        resolve(user);
      },
      error: function (err) {
        console.log('in error');
        reject(err);

      }
    });
  });
  return promise;
}

function getUser(user) {
  var options = options || {},
    promise = new Promise(function (resolve, reject) {
      var url = '/api/users',
        queryParams = [],
        isFirst = true;
      for (var key in options) {
        if (typeof options[key] === 'undefined') {
          continue;
        }

        var concatSymbol = '&';
        if (isFirst) {
          concatSymbol = '?';
          isFirst = false;
        }
        url += `${concatSymbol}${key}=${options[key]}`;
      }

      $.ajax({
        url: url,
        contentType: 'application/json',
        success: function (users) {
          resolve(users);
        },
        error: function (err) {
          reject(err);
        }
      });
    });
  return promise;
}

function getUserById(id) {
  var promise = new Promise(function (resolve, reject) {
    var url = 'api/users/' + id;

    $.ajax({
      url: url,
      contentType: 'application/json',
      success: function (user) {
        resolve(user);
      },
      error: function (err) {
        reject(err);
      }
    });
  });
  return promise;
}

function editUser(user) {
  var promise = new Promise(function (resolve, reject) {
    var url = '/api/users/' + user.id;

    $.ajax({
      url: url,
      method: 'PUT',
      data: JSON.stringify(user),
      contentType: 'application/json',
      success: function (user) {
        resolve(user);
      }
    });
  });
  return promise;
}


//books
function saveBook(book) {
  var promise = new Promise(function (resolve, reject) {
    var url = 'api/books';

    $.ajax({
      url: url,
      method: 'POST',
      data: JSON.stringify(book),
      contentType: 'application/json',
      success: function (book) {
        resolve(book);
      },
      error: function (err) {
        reject(err);
      }
    });
  });
  return promise;
}

//getBooks({genre: 'sci-fi', author: "...."})
function getBooks(options) {
  options = options || {};

  var promise = new Promise(function (resolve, reject) {
    var url = '/api/books',
      queryParams = [],
      isFirst = true;
    for (var key in options) {
      if (typeof options[key] === 'undefined') {
        continue;
      }

      var concatSymbol = '&';
      if (isFirst) {
        concatSymbol = '?';
        isFirst = false;
      }
      url += `${concatSymbol}${key}=${options[key]}`;
    }

    $.ajax({
      url: url,
      contentType: 'application/json',
      success: function (books) {
        resolve(books);
      },
      error: function (err) {
        reject(err);
      }
    });
  });
  return promise;
}

function getBookById(id) {
  var promise = new Promise(function (resolve, reject) {
    var url = '/api/books/' + id;

    $.ajax({
      url: url,
      method: 'GET',
      contentType: 'application/json',
      success: function (book) {
        resolve(book);
      }
    });
  });
  return promise;
}

function getGenres() {
  var promise = new Promise(function (resolve, reject) {
    var url = '/api/genres';

    $.ajax({
      url: url,
      method: 'GET',
      contentType: 'application/json',
      success: function (genres) {
        resolve(genres);
      }
    });
  });
  return promise;
}

function editBook(book) {
  var promise = new Promise(function (resolve, reject) {

    var url = '/api/books/' + book.id;

    $.ajax({
      url: url,
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(book),
      success: function (resBook) {
        resolve(resBook);
      }
    });
  });

  return promise;
}

var books = {
  get: getBooks,
  save: saveBook,
  getById: getBookById,
  edit: editBook
};

var users = {
  get: getUser,
  register: registerUser,
  login: loginUser,
  getById: getUserById,
  edit: editUser
};

var genres = {
  get: getGenres
};
export {
  books,
  genres,
  users
};

export default {
  books,
  genres,
  users
};