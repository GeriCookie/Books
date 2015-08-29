import data from 'app/data/data';

var sammyApp = Sammy('#root', function() {

  this.get('#/', function() {
    console.log('----HOME');
  });

  this.get('#/books', function() {
    data.books.getAll()
      .then(function(books) {
        //render books
      });
  });

  this.get('#/books/:id', function() {
    console.log('----Book with id', this.params['id']);
  });
});

$(function() {
  sammyApp.run('#/');
});

// data.books.save({
//     title: 'Name of the Wind',
//     date: new Date()
//   })
//   .then(function(book) {
//     console.log('Book added:');
//     console.log(book);
//     return data.books.getById(1);
//   })
//   .then(function(book) {
//     console.log('Book found!');
//     console.log(book);
//   });
