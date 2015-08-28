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

function getAllBooks() {
  var promise = new Promise(function(resolve, reject) {
    var books = JSON.parse(localStorage.getItem(KEYS.BOOKS) || '[]');
    resolve(books);
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
