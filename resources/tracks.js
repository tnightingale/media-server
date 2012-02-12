var mongoose = require('mongoose'),
    streamer = require('../streamer.js');
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
    .run(function (err, tracks) {
      var track = tracks.pop(),
          path = track.path;

      delete track.path;
      
      if (req.format == 'mp3' || req.is('audio/')) {
        streamer.stream(path, req, res);
      }
      else {
        res.json(track);
      }
    });

};

