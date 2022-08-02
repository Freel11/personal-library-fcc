/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require('mongoose')
const BookModel = require('../models.js').Book
const ObjectId = mongoose.Types.ObjectId

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      BookModel.find({}, (err, librarydata) => {
        if (err) {
          res.send('There was an error finding all the books')
          return
        }

        if (!librarydata) {
          res.json({})
          return
        }

        res.json(librarydata) 

      })
    })
    
    .post(function (req, res){
      const title = req.body.title;
      if (!title) {
        res.send("missing required field title")
        return
      }

      const newBook = new BookModel({
        title
      })

      newBook.save((err, data) => {
        if (err || !data) {
          res.send('There was an error saving this book')
          return
        }
        res.json({
          title: data.title,
          _id: data._id
        }) 
      })

    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      const bookid = req.params.id;

      if (!bookid) {
        res.send('missing required fields _id')
        return
      }

      BookModel.findOne({ _id: bookid }, (err, librarydata) => {
        if (err) {
          res.send('There was an issue finding that book')
          return
        }

        if (!librarydata) {
          res.send('no book exists')
          return
        }

        res.json(librarydata)

      })

    })
    
    .post(function(req, res){
      const bookid = req.params.id;
      const comment = req.body.comment;
      
      if (!bookid) {
        res.send('missing required fields _id')
        return
      }

      if (!comment) {
        res.send('missing required fields comment')
        return
      }


      BookModel.findOne({ _id: bookid }, (err, bookdata) => {
        if (err) {
          res.send('there was an error finding this book')
          return
        }

        if (!bookdata) {
          res.send('no book exists')
          return
        }

        bookdata.comments.push(comment)
        bookdata.commentcount++

        bookdata.save((err, data) => {
          if (err || !data) {
            res.send('there was an error saving this comment')
            return
          }
          res.json(data)
        })
      })

    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
