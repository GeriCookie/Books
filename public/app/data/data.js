import 'app/polyfills/array';


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
    console.log(book);
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

var genres = {
  get: getGenres
};
export {
  books,
  genres
};
export default {
  books,
  genres
};