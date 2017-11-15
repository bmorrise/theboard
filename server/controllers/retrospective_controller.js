var mongoose = require('mongoose'),
  Retrospective = mongoose.model('Retrospective'),
  Column = mongoose.model('Column'),
  Comment = mongoose.model('Comment');

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
  }).populate({
    path: "columns",
    populate: {path: "comments"}
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
  Column.findById(columnId, function(err, column) {
    var comment = new Comment(req.body);
    comment._id = new mongoose.Types.ObjectId();
    comment.save(function(err) {
      if (err) res.send(err)
      column.update({$push:{comments:comment}}, function(err) {
        res.json(comment);
        var data = {
          retroId: retroId,
          columnId: columnId,
          comment: comment,
          action: "add"
        }
        global.io.emit('update', data);
      });
    });
  });
}

exports.update_a_comment = function(req, res) {
  var retroId = req.params.retro_id;
  var columnId = req.params.column_id;
  Comment.findById(req.body._id, function(err, comment) {
    comment.message = req.body.message;
    comment.votes = req.body.votes;
    comment.status = req.body.status;
    comment.save(function(err) {
      if (err) res.send(err)
      res.json(comment);
      var data = {
        retroId: retroId,
        columnId: columnId,
        comment: comment,
        action: "update"
      }
      global.io.emit('update', data);
    })
  });
}

exports.pending_a_comment = function(req, res) {
  var retroId = req.params.retro_id;
  var columnId = req.params.column_id;
  var commentId = req.params.comment_id;
  Comment.findById(commentId, function(err, comment) {
    comment.status = 'pending';
    comment.save(function(err) {
      if (err) res.send(err);
      res.json(comment);
      var data = {
        retroId: retroId,
        columnId: columnId,
        commentId: commentId,
        action: "pending"
      }
      global.io.emit('update', data);
    })
  });
}

exports.delete_a_comment = function(req, res) {
  var retroId = req.params.retro_id;
  var columnId = req.params.column_id;
  var commentId = req.params.comment_id;
  Column.findById(columnId, function(err, column) {
    Comment.findById(commentId, function(err, comment) {
      column.update({$pull:{comments:comment}}, function(err) {
        comment.remove();
        res.json(comment);
        var data = {
          retroId: retroId,
          columnId: columnId,
          comment: comment,
          action: "delete"
        }
        global.io.emit('update', data);
      });
    });
  });
}

/** Manipulate Columns **/
exports.add_a_column = function(req, res) {
  var retroId = req.params.retro_id;
  Retrospective.findById(retroId, function(err, retrospective) {
    var column = new Column(req.body);
    column._id = new mongoose.Types.ObjectId();
    column.save(function(err) {
      retrospective.update({$push:{columns:column}}, function(err) {
        if (err) res.send(err)
        res.json(column);
        var data = {
          retroId: retroId,
          column: column,
          action: "add"
        }
        global.io.emit('update', data);
      });
    });
  });
}

/** Manipulate Columns **/
exports.add_columns = function(req, res) {
  var retroId = req.params.retro_id;
  Retrospective.findById(retroId, function(err, retrospective) {
    var columns = req.body;
    columns.forEach(function(col, index) {
      var column = Column(col);
      column._id = new mongoose.Types.ObjectId();
      column.save(function(err) {
        if (err) res.send(err)
        retrospective.update({$push: {columns: column}}, function(err) {
          if (err) res.send(err)
          if (index == columns.length - 1) {
            res.json(retrospective)
          }
        })
      })
    });
  });
}

exports.update_a_column = function(req, res) {
  var retroId = req.params.retro_id;
  console.log(req.body);
  Column.findById(req.body._id, function(err, column) {
    column.name = req.body.name;
    column.save(function(err) {
      if (err) res.send(err)
      res.json(column);
      var data = {
        retroId: retroId,
        column: column,
        action: "update"
      }
      global.io.emit('update', data);
    });
  });
}

exports.delete_a_column = function(req, res) {
  var retroId = req.params.retro_id;
  var columnId = req.params.column_id;
  Retrospective.findById(retroId, function(err, retrospective) {
    Column.findById(columnId, function(err, column) {
      column.comments.forEach(function(comment) {
        comment.remove();
      });
      retrospective.update({$pull:{columns:column}}, function() {
        column.remove(function(err) {
          res.json(column);
          var data = {
            retroId: retroId,
            column: column,
            action: "delete"
          }
          global.io.emit('update', data);
        });
      });
    }).populate("comments");
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
