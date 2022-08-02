/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
let bookId

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'Chai Test Book'
          })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.title, 'Chai Test Book')
            assert.property(res.body, '_id', 'Response should have an _id property')
            bookId = res.body._id
            done()
          })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'missing required field title')
            done()
          })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.isArray(res.body, 'response should be an array')
            assert.isObject(res.body[0], 'response should be an array of objects')
            done()
          })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/12345')
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'no book exists')
            done()
          })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get(`/api/books/${bookId}`)
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.title, 'Chai Test Book')
            done()
          })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post(`/api/books/${bookId}`)
          .send({
            _id: bookId,
            comment: 'This is a chai test comment'
          })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.isArray(res.body.comments, 'Comments need to be held in an array')
            assert.equal(res.body.comments[0], 'This is a chai test comment')
            assert.equal(res.body.commentcount, res.body.comments.length)
            done()
          })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
          .post(`/api/books/${bookId}`)
          .send({
            _id: bookId
          })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'missing required field comment')
            done()
          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
          .post(`/api/books/12345`)
          .send({
            _id: '12345',
            comment: 'This is a chai test comment'
          })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'no book exists')
            done()
          })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
          .delete(`/api/books/${bookId}`)
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'delete successful')
            done()
          })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
          .delete(`/api/books/12345`)
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'no book exists')
            done()
          })
      });

    });

  });

});
