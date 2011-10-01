var directory = require('./directory');

/**
 *
 */
var traverse = function (path, callback, state) {
  var def = {},
      dir = {};

  state = state || { depth: 0 };

  var finish = function (dir) {
    var directories = dir.get_directories(),
        path = dir.get_path(),
        name,
        new_state = { depth: state.depth + 1 },
        i = 0;

    if (dir.is_processed()) {
      return;
    }

    for (i = 0; i < directories.length; i++) {
      name = directories[i].get_name();
      traverse(path + '/' + name, callback, new_state);
    }

    state['dir'] = dir;
    callback(state);
  }

  var dir = directory.create({
    name: '.',
    type: 'd',
    path: path,
  }).get_contents(function(dir) {
    dir.process_contents(finish);
  });
};
exports.exec = traverse;
