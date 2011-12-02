var File = require('file-api').File,
    mtags = require('mtags'),
    traverse = require('./traversal').traverse,
    semaphore = require('./monitor').semaphore(50);

var index = {};

exports.init = function (fields, path) {
  for (field in fields) {
    index[field] = [];
  }

  traverse.bfs(path, function (dir, state) {
    var string = dir.to_string(),
        files = dir.get_files();

    var callback = function (path) {
      semaphore.signal();
      var tags = mtags.getAllTags(path);
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
  var reader = new mtags.getReader('FileAPIReader');
  mtags.loadTags(path, callback, {dataReader: new reader(new File(path))});
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
