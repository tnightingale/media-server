var albums = require('../index.js').get('albums');
exports.index = function (req, res) {
  res.json(albums);
};
