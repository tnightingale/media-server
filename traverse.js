/**
 *
 */
var bfs = function (directory, callback, state) {
  state = state || { depth: 0 };

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

  directory.get_contents(function(dir) {
    dir.process_contents(finish);
  });
};
exports.bfs = bfs;
