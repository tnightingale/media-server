var File = require('file-api').File,
    mtags = require('mtags'),
    traverse = require('./traversal').traverse,
    semaphore = require('./monitor').semaphore(50),
    _ = require('underscore'),
    mongoose = require('mongoose');

// Get/define Track model.
var Track = require('./models/track').Track(mongoose);

// Known tracks are cached.
var cache = {};

function init(basePath) {
  // Prepare track cache.
  Track.find({}, ['path'], function (err, paths) {
    if (!err) {
      // Key cache by file path.
      _.each(paths, function (element, index) {
        // Tracks initialized to false until existence is verified.
        cache[element.path] = false;
      });

      index(basePath);

    } else {
      throw err;
    }
  });
}
exports.init = init;

function index(path) {
  var parse = function (path) {
    // Signal to release file descriptor.
    semaphore.signal();

    var tags = mtags.getAllTags(path);
    if (tags) {
      save(path, tags);
      // Mark verified paths.
      cache[path] = true;
    }
  };

  // Begin filesystem traversal.
  traverse.bfs(path, function (dir, state) {
    var files = dir.get_files(),
        i = 0;

    // Each file is checked against the cache before it is opened for reading.
    // If file already exists in cache, it is marked as verified and skipped.
    // New files are parsed then verified. Their metadata is stored in db.
    for (i = 0, length = files.length; i < length; i++) {
      var path = files[i].get_path() + '/' + files[i].get_name();

      if (cache.hasOwnProperty(path)) {
        // Mark verified paths.
        cache[path] = true;
      } else {
        // Limited file descriptors, need to use semaphore (wait & signal).
        semaphore.wait(loadTags, path, parse);
      }
    }
  });
}
exports.index = index;

function loadTags(path, callback) {
  var reader = new mtags.getReader('FileAPIReader');
  mtags.loadTags(path, callback, {dataReader: new reader(new File(path))});
}

function save(path, tags) {
  console.log(path);
  var track = new Track({
    path: path,
    artist: tags.artist,
    album: tags.album,
    title: tags.title
  });
  track.save(function (err) {
    if (!err) {
      return console.log("Track created");
    } else {
      throw err;
    }
  });
}
