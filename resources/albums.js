var mongoose = require('mongoose');
var Track = require('../models/track').Track(mongoose);

exports.index = function (req, res) {
  Track.distinct('album', {}, function (err, albums) {
    res.json(albums.sort());
  });
};

exports.show = function (req, res) {
  Track.find({ 'album': req.params.album })
    .asc('artist', 'title')
    .exclude('path')
    .run(function (err, tracks) {
      res.json(tracks);
    });
};
