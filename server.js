var mongoose = require('mongoose'),
    index = require('./index.js'),
    _ = require('underscore'),
    express = require('express'),
    argv = require('optimist').argv;

var BASE_PATH = argv.f || './';

app = express.createServer();
app.use(express.cookieParser());
app.use(express.session({ secret: "subnode" }));

// Connect to mongodb.
mongoose.connect('mongodb://localhost/media');

// Initialize index.
index.init(BASE_PATH);
require('./routes.js').init(app);

app.listen(3000);
