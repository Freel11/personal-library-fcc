const mongoose = require('mongoose')
const { Schema } = mongoose

const CommentSchema = new Schema({
	comment: String
})

const BookSchema = new Schema({
	title: { type: String, required: true },
	commentcount: { type: Number, default: 0 },
	comments: [CommentSchema]
})

const Comment = mongoose.model('Comment', CommentSchema)
const Book = mongoose.model('Book', BookSchema)

exports.Comment = Comment
exports.Book = Book 