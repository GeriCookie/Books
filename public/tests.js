import data from 'app/data/data';

mocha.setup('bdd');
var expect = chai.expect;


describe('#sum', function() {
    it('expect to have at least one book in database', function(done){
        data.books.get()
            .then(function (books) {
                expect(books).to.not.be.empty;
                done();
            });
    });
    it('expect first book to all correct properties for object Book', function(done){
        data.books.get()
            .then(function (books) {
                console.log(books[0]);
                expect(books[0]).to.have.property('title');
                //expect(books[0]).to.have.property('author');
                expect(books[0]).to.have.property('reviews');
                expect(books[0]).to.have.property('genres');

                done();
            });
    });
})