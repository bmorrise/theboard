var mongoose = require('mongoose'),
  Retrospective = mongoose.model('Retrospectives');

exports.read_all_retrospectives = function(req, res) {
  Retrospective.find({}, "name slug", function(err, retrospective) {
    if (err)
      res.send(err);
    res.json(retrospective);
  });
}

exports.read_a_retrospective = function(req, res) {
  Retrospective.findOne({slug: req.params.id}, function(err, retrospective) {
    if (err)
      res.send(err);
    res.json(retrospective);
  });
}

exports.delete_a_retrospective = function(req, res) {
  Retrospective.findById(req.params.id, function(err, retrospective) {
    retrospective.remove();
    if (err)
      res.send(err);
    res.json(retrospective);
  });
}

exports.create_a_retrospective = function(req, res) {
  var retrospective = new Retrospective(req.body);
  retrospective.save(function(err, retrospective) {
    if (err)
      res.send(err);
    res.json(retrospective);
  });
};

exports.update_a_retrospective = function(req, res) {
  Retrospective.findById(req.params.id, function(err, retrospective) {
    retrospective.name = req.body.name;
    retrospective.save();
    res.json(retrospective);
    var data = {
      retroId: req.params.id,
      retrospective: {name: retrospective.name, _id: retrospective._id},
      action: "update"
    }
    global.io.emit('update', data);
  });
}

exports.export_a_retrospective = function(req, res) {
  var type = req.params.type
  Retrospective.findById(req.params.id, function(err, retrospective) {
    var filename;
    if (type == "csv") {
       filename = require('./csv')(retrospective);
    } else {
       filename = require('./pdf')(retrospective);
    }
    setTimeout(function() {
      res.download(filename);
    }, 2000);
  });
}

exports.add_a_comment = function(req, res) {
  var retroId = req.params.retro_id;
  var columnId = req.params.column_id;
  Retrospective.findById(retroId, function(err, retrospective) {
    var column = retrospective.columns.id(columnId);
    var comment = column.comments.create(req.body);
    column.comments.push(comment);
    retrospective.save();
    res.json(comment);
    var data = {
      retroId: retroId,
      columnId: columnId,
      comment: comment,
      action: "add"
    }
    global.io.emit('update', data);
  });
}

exports.update_a_comment = function(req, res) {
  var retroId = req.params.retro_id;
  var columnId = req.params.column_id;
  Retrospective.findById(retroId, function(err, retrospective) {
    var column = retrospective.columns.id(columnId);
    var comment = column.comments.id(req.body._id);
    comment.message = req.body.message;
    comment.votes = req.body.votes;
    comment.status = req.body.status;
    retrospective.save();
    res.json(comment);
    var data = {
      retroId: retroId,
      columnId: columnId,
      comment: comment,
      action: "update"
    }
    global.io.emit('update', data);
  });
}

exports.pending_a_comment = function(req, res) {
  var retroId = req.params.retro_id;
  var columnId = req.params.column_id;
  var commentId = req.params.comment_id;
  Retrospective.findById(retroId, function(err, retrospective) {
    var column = retrospective.columns.id(columnId);
    var comment = column.comments.id(commentId);
    comment.status = 'pending';
    retrospective.save();
    res.json();
    var data = {
      retroId: retroId,
      columnId: columnId,
      commentId: commentId,
      action: "pending"
    }
    global.io.emit('update', data);
  });
}

exports.delete_a_comment = function(req, res) {
  var retroId = req.params.retro_id;
  var columnId = req.params.column_id;
  var commentId = req.params.comment_id;
  Retrospective.findById(retroId, function(err, retrospective) {
    var column = retrospective.columns.id(columnId);
    var comment = column.comments.id(commentId);
    comment.remove();
    retrospective.save();
    res.json(comment);
    var data = {
      retroId: retroId,
      columnId: columnId,
      comment: comment,
      action: "delete"
    }
    global.io.emit('update', data);
  });
}

/** Manipulate Columns **/
exports.add_a_column = function(req, res) {
  var retroId = req.params.retro_id;
  Retrospective.findById(retroId, function(err, retrospective) {
    var column = retrospective.columns.create(req.body);
    retrospective.columns.push(column);
    retrospective.save();
    res.json(column);
    var data = {
      retroId: retroId,
      column: column,
      action: "add"
    }
    global.io.emit('update', data);
  });
}

exports.update_a_column = function(req, res) {
  var retroId = req.params.retro_id;
  Retrospective.findById(retroId, function(err, retrospective) {
    var column = retrospective.columns.id(req.body._id);
    column.name = req.body.name;
    retrospective.save();
    res.json(column);
    var data = {
      retroId: retroId,
      column: column,
      action: "update"
    }
    global.io.emit('update', data);
  });
}

exports.delete_a_column = function(req, res) {
  var retroId = req.params.retro_id;
  var columnId = req.params.column_id;
  Retrospective.findById(retroId, function(err, retrospective) {
    var column = retrospective.columns.id(columnId);
    column.remove();
    retrospective.save();
    res.json(column);
    var data = {
      retroId: retroId,
      column: column,
      action: "delete"
    }
    global.io.emit('update', data);
  });
}

exports.pending_a_column = function(req, res) {
  var retroId = req.params.retro_id;
  var columnId = req.params.column_id;
  res.json();
  var data = {
    retroId: retroId,
    columnId: columnId,
    action: "pending"
  }
  global.io.emit('update', data);
}
