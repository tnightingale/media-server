var argv = require('optimist').argv;
var directory = require('./directory');
var traverse = require('./traverse');

var path = argv.f || './';
var pieces = path.split('/');

var dir = directory.create({
  name: pieces.pop(),
  type: 'd',
  path: pieces.join('/')
});

traverse.bfs(dir, function (dir, state) {
  var string = dir.to_string();
  console.log("Depth: %d\n%s", state.depth, string);
});
