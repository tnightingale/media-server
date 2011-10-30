var argv = require('optimist').argv,
    id3 = require('id3'),
    directory = require('./directory'),
    traverse = require('./traverse'),
    File = require('file-api').File;

var path = argv.f || './',
    pieces = path.split('/');

var dir = directory.create({
  name: pieces.pop(),
  type: 'd',
  path: pieces.join('/')
});

traverse.bfs(dir, function (dir, state) {
  var string = dir.to_string(),
      files = dir.get_files();

  var callback = function (path) {
    var tags = id3.getAllTags(path);
    if (tags) {
      var version = tags.version ? tags.version : 'n/a';
      console.log("(%s)\t+ %s, %s: %s", version, tags.artist, tags.album, tags.title);
    }
  };

  var i = 0;
  for (i = 0; i < files.length; i++) {
    var path = files[i].get_path() + '/' + files[i].get_name(),
        FileAPIReader = id3.getReader('FileAPIReader');

    id3.loadTags(path, callback, {dataReader: new FileAPIReader(new File(path))});
  }

  //console.log("Depth: %d\n%s", state.depth, string);
});
