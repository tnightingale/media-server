var tracks = require('../index.js').get('tracks');
exports.index = function (req, res) {
  res.json(tracks);
};
