var id3 = require('mtags'),
    directory = require('./directory'),
    traverse = require('./traverse'),
    File = require('file-api').File,
    semaphore = require('./monitor').semaphore(50);

var index = {};

exports.init = function (fields, path) {
  var pieces = path.split('/');

  var dir = directory.create({
    name: pieces.pop(),
    type: 'd',
    path: pieces.join('/')
  });

  for (field in fields) {
    index[field] = [];
  }

  traverse.bfs(dir, function (dir, state) {
    var string = dir.to_string(),
        files = dir.get_files();

    var callback = function (path) {
      semaphore.signal();
      var tags = id3.getAllTags(path);
      if (tags) {
        var version = tags.version ? tags.version : 'n/a';
        console.log("(%s)\t+ %s, %s: %s\t| %s", version, tags.artist, tags.album, tags.title, path);

        for (field in fields) {
          index[field].push(tags[fields[field]]);
        }
      }
    };

    var i = 0;
    for (i = 0; i < files.length; i++) {
      var path = files[i].get_path() + '/' + files[i].get_name();
      semaphore.wait(loadTags, path, callback);
    }
  });

  return index;
};

function loadTags(path, callback) {
  var FileAPIReader = id3.getReader('FileAPIReader');
  id3.loadTags(path, callback, {dataReader: new FileAPIReader(new File(path))});
}

exports.get = function (field) {
  if (!field) {
    return index;
  } 

  if (!index[field]) {
    throw "Error: Invalid index field.";
  }

  return index[field];
};
