'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

var CommentSchema = new Schema({
  _id: Schema.Types.ObjectId,
  message: String,
  votes: Number,
  status: String
});

var ColumnSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  comments: [{type: Schema.Types.ObjectId, ref:'Comment'}]
});

var RetrospectiveSchema = new Schema({
  slug: { type: String, slug: "name", unique: true },
  name: {
    type: String,
    required: 'Please enter the name of the retrospective'
  },
  columns: [{type: Schema.Types.ObjectId, ref:'Column'}],
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);
module.exports = mongoose.model('Column', ColumnSchema);
module.exports = mongoose.model('Retrospective', RetrospectiveSchema);
