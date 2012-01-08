var mongoose = require('mongoose'),
    index = require('./index.js')
    _ = require('underscore'),
    app = require('express').createServer(),
    argv = require('optimist').argv;

var BASE_PATH = argv.f || './';

// Connect to mongodb.
mongoose.connect('mongodb://localhost/media');

// Initialize index.
index.init(BASE_PATH);
require('./routes.js').init(app);

app.listen(3000);
