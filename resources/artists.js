var artists = require('../index.js').get('artists');

exports.index = function (req, res) {
  console.log(req.artists);
  res.json(artists);
};
