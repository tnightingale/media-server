var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Track = new Schema({
  path: String,
  artist: String,
  album: String,
  title: String
});

mongoose.model('Track', Track);

exports.Track = function (db) {
  var db = db || mongoose;
  return db.model('Track');
}
