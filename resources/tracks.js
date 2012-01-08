var mongoose = require('mongoose');
var Track = require('../models/track').Track(mongoose);

exports.index = function (req, res) {
  Track.find({})
    .asc('artist', 'album', 'title')
    .exclude('path')
    .run(function (err, tracks) {
      res.json(tracks);
    });
};

exports.show = function (req, res) {
  Track.find({ '_id': req.params.track })
    .exclude('path')
    .run(function (err, tracks) {
      res.json(tracks);
    });
};
