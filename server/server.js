var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Retrospective = require('./model/retrospective_model.js'),
  bodyParser = require('body-parser'),
  server = require('http').Server(app),
  io = require('socket.io')(server);

global.io = io;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Retrodb');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.static(__dirname + '/client'));
app.use(express.static(__dirname + '/node_modules'));

require('./routes/retrospective_routes.js')(app);
require('./socket.io/events.js')(io);

server.listen(port);

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});
