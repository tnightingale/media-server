var directory = require('./directory');

/**
 * Perform an asynchronous breadth-first traversal of a file-system starting at
 * a specified directory.
 *
 * @param start_dir Either the path of the base directory to start at or a
 *                  directory object.
 */
var bfs = function (start_dir, callback, state) {
  state = state || { depth: 0 };

  if (typeof start_dir === 'string') {
    var pieces = start_dir.split('/');
    start_dir = directory.create({
      name: pieces.pop(),
      type: 'd',
      path: pieces.join('/')
    });
  }

  var finish = function (dir) {
    var directories = dir.get_directories(),
        i = 0,
        new_state = {
          depth: state.depth + 1, 
          path: dir.get_path()
        };

    if (dir.is_processed()) {
      return;
    }

    for (i = 0; i < directories.length; i++) {
      new_state.path += dir.get_name();
      bfs(directories[i], callback, new_state);
    }

    callback(dir, state);
  };

  start_dir.get_contents(function (dir) {
    dir.process_contents(finish);
  });
};
exports.bfs = bfs;
