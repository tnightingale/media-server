Resource = require('express-resource');

exports.init = function (app) {
  app.get('/', function (req, res) {
    res.send("Hello world");
  });

  app.resource('artists', require('./resources/artists.js'));
  app.resource('albums', require('./resources/albums.js'));
  app.resource('tracks', require('./resources/tracks.js'));
};
