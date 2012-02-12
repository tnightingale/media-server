var mongoose = require('mongoose');
var Track = require('../models/track').Track(mongoose);

exports.index = function (req, res) {
  Track.distinct('artist', {}, function (err, artists) {
    artists.sort();

    var items = [];
    for (var index in artists) {
      items.push({
        name: artists[index],
        actions: { tracks: '/artists/' + encodeURIComponent(artists[index]) }
      });
    }

    res.json(items);
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
