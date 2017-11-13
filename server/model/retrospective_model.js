'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

var CommentSchema = new Schema({
  message: String,
  votes: Number,
  status: String
});

var ColumnSchema = new Schema({
  name: String,
  comments: [CommentSchema]
});

var RetrospectiveSchema = new Schema({
  slug: { type: String, slug: "name", unique: true },
  name: {
    type: String,
    Required: 'Please enter the name of the retrospective'
  },
  description: {
    type: String,
    Required: 'Please enter the description of the retrospective'
  },
  columns: [ColumnSchema],
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Retrospectives', RetrospectiveSchema);
