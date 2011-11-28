var argv = require('optimist').argv,
    app = require('express').createServer(),
    index = require('./index.js');

var resource_types = {
  artists: 'artist',
  albums: 'album',
  tracks: 'title'
};

var data = index.init(resource_types, argv.f || './');

require('./routes.js').init(app, data);

app.listen(3000);
