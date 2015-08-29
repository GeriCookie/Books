import 'app/polyfills/array';

const KEYS = {
  BOOKS: 'books-storage-key',
  LAST_BOOK_ID: 'books-last-id-key'
};

function saveBook(book) {
  var promise = new Promise(function(resolve, reject) {
    var lastBookId = +(localStorage.getItem(KEYS.LAST_BOOK_ID) || 0);
    var books = JSON.parse(localStorage.getItem(KEYS.BOOKS) || '[]');
    book.id = lastBookId += 1;
    books.push(book);
    localStorage.setItem(KEYS.BOOKS, JSON.stringify(books));
    localStorage.setItem(KEYS.LAST_BOOK_ID, lastBookId);
    resolve(book);
  });

  return promise;
}

function getAllBooksLocalStorage() {
  var promise = new Promise(function(resolve, reject) {
    var books = JSON.parse(localStorage.getItem(KEYS.BOOKS) || '[]');
    resolve(books);
  });

  return promise;
}

//getBooks({genre: 'sci-fi', author: "...."})
function getBooks(options) {
  options = options || {};

  var promise = new Promise(function(resolve, reject) {
    var url = '/api/books',
      queryParams = [],
      isFirst = true;
    for (var key in options) {
      var concatSymbol = '&';
      if (isFirst) {
        concatSymbol = '?';
        isFirst = false;
      }
      url += `${concatSymbol}${key.toLowerCase()}=${options[key].toLowerCase()}`;
    };

    $.ajax({
      url: url,
      contentType: 'application/json',
      success: function(books) {
        resolve(books);
      },
      error: function(err) {
        reject(err);
      }
    });
  });
  return promise;
}

function getBookById(id) {
  id = +id;
  var promise = new Promise(function(resolve, reject) {
    var books = JSON.parse(localStorage.getItem(KEYS.BOOKS) || '[]');

    var book = books.find(function(dbBook) {
      return id === dbBook.id;
    });

    resolve(book);
  });

  return promise;
}

var books = {
  filter: getBooks,
  save: saveBook,
  getAll: getAllBooks,
  getById: getBookById
};

export {
  books
};
export default {
  books
};
