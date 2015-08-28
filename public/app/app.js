import data from 'app/data/data';

data.books.save({
    title: 'Name of the Wind',
    date: new Date()
  })
  .then(function(book) {
    console.log('Book added:');
    console.log(book);
    return data.books.getById(1);
  })
  .then(function(book) {
    console.log('Book found!');
    console.log(book);
  });
