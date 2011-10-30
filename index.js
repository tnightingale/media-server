var argv = require('optimist').argv,
    directory = require('./directory'),
    traverse = require('./traverse'),
    id3 = require('./id3'),
    reader = require('./reader');

var path = argv.f || './',
    pieces = path.split('/');

var dir = directory.create({
  name: pieces.pop(),
  type: 'd',
  path: pieces.join('/')
});

traverse.bfs(dir, function (dir, state) {
  var string = dir.to_string();
  console.log("Depth: %d\n%s", state.depth, string);
});
