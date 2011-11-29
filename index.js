var id3 = require('id3'),
    directory = require('./directory'),
    traverse = require('./traverse'),
    File = require('file-api').File;

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
        files = dir.get_files(),
        FileAPIReader = id3.getReader('FileAPIReader');

    var callback = function (path) {
      var tags = id3.getAllTags(path);
      if (tags) {
        var version = tags.version ? tags.version : 'n/a';
        console.log("(%s)\t+ %s, %s: %s", version, tags.artist, tags.album, tags.title);

        for (field in fields) {
          index[field].push(tags[fields[field]]);
        }
      }
    };

    var i = 0;
    for (i = 0; i < files.length; i++) {
      var path = files[i].get_path() + '/' + files[i].get_name();
      id3.loadTags(path, callback, {dataReader: new FileAPIReader(new File(path))});
    }

    //console.log("Depth: %d\n%s", state.depth, string);
  });

  return index;
};

exports.get = function (field) {
  if (!field) {
    return index;
  } 

  if (!index[field]) {
    throw "Error: Invalid index field.";
  }

  return index[field];
};
