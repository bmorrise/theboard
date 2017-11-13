module.exports = function(retrospective) {
  const fs = require('fs');
  const PDFDocument = require('pdfkit');

  function getFormattedDate(date) {
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    return month + "/" + day + "/" + year;
  }

  doc = new PDFDocument
  var date = new Date(retrospective.date);

  var filename = "/tmp/"+retrospective.slug+".pdf";
  doc.pipe(fs.createWriteStream(filename))
  doc.font('font/OpenSans-Regular.ttf')
    .fontSize(20)
    .text(retrospective.name + " - " + getFormattedDate(date), 50, 50)
  var position = 100;
  for (var i = 0; i < retrospective.columns.length; i++) {
    var column = retrospective.columns[i];
      doc.fontSize(15)
        .text(column.name, 50, position);
    doc.moveTo(50, position+25)
      .lineTo(550, position+25)
      .stroke();
    position += 30;
    doc.fontSize(10);
    if (column.comments.length > 0) {
      for (var j = 0; j < column.comments.length; j++) {
        var comment = column.comments[j];
        doc.text("+" + comment.votes + " - " + comment.message, 50, position);
        var height = doc.heightOfString("+" + comment.votes + " - " + comment.message);
        position += height + 10;
      }
    } else {
      doc.text("None", 50, position);
      position += 20;
    }
    position += 10;
  }

  doc.end()
  return filename
}
