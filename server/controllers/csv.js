module.exports = function(retrospective) {
  csvWriter = require('csv-write-stream'),
  writer = csvWriter();
  const fs = require('fs');

  var headers = new Array();
  var content = new Array();
  for (var i = 0; i < retrospective.columns.length; i++) {
    var column = retrospective.columns[i];
    headers.push(column.name);    
    for (var j = 0; j < column.comments.length; j++) {
      if (!content[j]) {
        content[j] = new Array();
      }
      if (!content[j][i]) {
        content[j][i] = new Array();
      }
      content[j][i] = column.comments[j].message;
    }
  }
  var writer = csvWriter({headers: headers})
  var filename = '/tmp/' + retrospective.slug + '.csv';
  writer.pipe(fs.createWriteStream(filename))
  for (var i = 0; i < content.length; i++) {
    writer.write(content[i]);
  }
  writer.end()
  return filename;
}
