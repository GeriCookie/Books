import data from 'app/data/data';
import handlebars from 'bower_components/handlebars/handlebars';

var sammyApp = Sammy('#content', function () {

    this.get('#/', function () {
        console.log('----HOME');
    });

    this.get('#/books', function () {
        var params = {
            author: this.params.author,
            genre: this.params.genre
        };

        data.books.get(params)
            .then(function (books) {
                var $container = $('<div />');
                $.get('app/partials/book-id-partial.html', function (templateString) {
                    var template = handlebars.compile(templateString);
                    books.map(template)
                        .forEach(function (bookhtml) {
                            $container.append(bookhtml);
                        });
                    $('#content').html($container.html());
                });
            });
    });

    this.get('#/login', function (context) {
        $.get('app/partials/login-partial.html', function (html) {
            $('#content').html(html);

            $('#sign-in').on('click', function () {
                var username = $('#username').val();
                var password = $('#password').val();

                data.users.login({
                    username: username,
                    password: password
                })
                    .then(function (user) {

                        context.redirect('#/books');


                    });
            });

            $('#register').on('click', function () {
                context.redirect('#/register');
            });

        });
    });

    this.get('#/register', function (context) {
        $.get('app/partials/register-partial.html', function (html) {
            $('#content').html(html);

            $('#register').on('click', function () {
                var username = $('#username').val();
                var password = $('#password').val();


                data.users.register({
                    username: username,
                    password: password
                })
                    .then(function (user) {
                        context.redirect('#/login');
                    });

            });
        });
    });

    this.get('#/books/add', function (context) {
        //context === this

        $.get('app/partials/book-add-partial.html', function (html) {
            // body...
            $('#content').html(html);

            var $button = $('#add-book')
                .on('click', function () {
                    var genres = [];
                    $('.tb-genre').each(function (index, genre) {
                        var value = $(genre).val();
                        if (value) {
                            genres.push(value);
                        }
                    });

                    data.books.save({
                        title: $('#tb-title').val(),
                        author: $('#tb-author').val(),
                        genres: genres,
                        description: $('#tb-description').val(),
                        pages: $('#tb-pages').val(),
                        coverUrl: $('#tb-cover-url').val()
                    })
                        .then(function (book) {
                            context.redirect('#/books/' + book._id);
                        });
                });

            $(document).ready(function () {
                $('#tb-cover').hide();
            });

            var $uploadButton = $('#tb-btn-preview')
                .on('click', function () {
                    var $imgURL = $('#tb-cover-url').val();
                    $('#tb-cover')
                        .attr('src', $imgURL)
                        .show();

                });
        });
    });

    this.get('#/books/:id/edit', function (context) {
        var bookId = this.params.id;
        data.books.getById(bookId)
            .then(function (book) {
                $.get('app/partials/book-edit-partial.html', function (templateString) {
                    var template = handlebars.compile(templateString);
                    var html = template(book);
                    $('#content').html(html);

                    $(document).ready(function () {
                        $('#tb-cover').hide();
                    });

                    var $uploadButton = $('#tb-btn-preview')
                        .on('click', function () {
                            var $imgURL = $('#tb-cover-url').val();
                            $('#tb-cover')
                                .attr('src', $imgURL)
                                .show();
                        });

                    $('#save')
                        .on('click', function () {

                            var genres = [];
                            $('.tb-genre').each(function (index, genre) {
                                var value = $(genre).val();
                                if (value) {
                                    genres.push(value);
                                }
                            });
                            data.books.edit({
                                id: bookId,
                                title: $('#tb-title').val(),
                                author: $('#tb-author').val(),
                                genres: genres,
                                rating: $('#tb-rating').val(),
                                description: $('#tb-description').val(),
                                pages: $('#tb-pages').val(),
                                coverUrl: $('#tb-cover-url').val()
                            })
                                .then(function (book) {
                                    context.redirect('#/books/' + book._id);
                                });
                        });

                });
            });
    });

    this.get('#/books/:id', function (context) {
        var that = this;
        var bookId = this.params.id;
        data.books.getById(bookId)
            .then(function (book) {
                $.get('app/partials/book-id-partial.html', function (templateString) {
                    var template = handlebars.compile(templateString);
                    var html = template(book);
                    $('#content').html(html);
                });
            });
    });

    this.get('#/genres', function () {
        var genre = this.params.genre;
        data.genres.get()
            .then(function (genres) {
                var $container = $('<div />');
                $.get('app/partials/genres-all-partial.html', function (templateString) {
                    var template = handlebars.compile(templateString);

                    var html = template({
                        genres
                    });
                    $('#content').html(html);
                });
            });
    });
});

$(function () {
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