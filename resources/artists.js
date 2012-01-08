var mongoose = require('mongoose');
var Track = require('../models/track').Track(mongoose);

exports.index = function (req, res) {
  Track.distinct('artist', {}, function (err, artists) {
    res.json(artists.sort());
  });
};

exports.show = function (req, res) {
  Track.find({ 'artist': req.params.artist })
    .asc('album', 'title')
    .exclude('path')
    .run(function (err, tracks) {
      res.json(tracks);
    });
};
