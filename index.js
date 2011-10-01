Function.prototype.method = function (name, func) {
  if (!this.prototype[name]) {
    this.prototype[name] = func;
    return this;
  }
}

Object.method('superior', function (name) {
  var that = this;
  var method = that[name];

  return function () {
    return method.apply(that, arguments);
  };
});


var fs = require('fs');

var file = function (spec) {
  var that = {},
      name = spec.name,
      type = spec.type,
      path = spec.path;

  var to_string = function () {
    var output = '';

    output += '[' + type + ']' + ' ';
    output += name + ' ';
    output += '(' + path + ')';

    return output;
  };
  that.to_string = to_string;

  var get_path = function () {
    return path;
  };
  that.get_path = get_path;

  var get_name = function () {
    return name;
  };
  that.get_name = get_name;

  return that;
};


var directory = function (spec) {
  var that = file(spec),
      contents = spec.contents,
      files = [],
      directories = [];

  var add_file = function (file) {
    files.push(file);
    return that;
  };
  that.add_file = add_file;

  var add_dir = function (dir) {
    directories.push(dir);
    return that;
  };
  that.add_dir = add_dir;

  var process_contents = function (callback) {
    var get_file_info = function (name) {
      var path = that.get_path(),
          def = {},
          i = 0;

      fs.lstat(path + '/' + name, function (err, stats) {
        if (err) {
          throw err;
        }

        def.name = name,
        def.path = path;

        if (stats.isSymbolicLink()) {
          def.type = 's';
          add_file(file(def));
        }
        else if (stats.isDirectory()) {
          def.type = 'd';
          add_dir(directory(def));
        } 
        else if (stats.isFile()) {
          def.type = 'f';
          add_file(file(def));
        }

        callback(that);
      });
    };

    for (i = 0; i < contents.length; i += 1) {
      get_file_info(contents[i]);
    }
  };
  that.process_contents = process_contents;

  var is_processed = function () {
    return files.length + directories.length < contents.length;
  };
  that.is_processed = is_processed;

  var to_string = function () {
    var output = '',
        i = 0;

    output += '> Directory: ' + that.get_path() + '\n';
    if (directories.length > 0) {
      for (i = 0; i < directories.length; i += 1) {
        output += '  + ' + directories[i].get_name() + '\n';
      }
    }

    if (files.length > 0) {
      for (i = 0; i < files.length; i += 1) {
        output += '  - ' + files[i].to_string() + '\n';
      }
    }

    return output;
  };
  that.to_string = to_string;

  var get_directories = function () {
    return directories;
  };
  that.get_directories = get_directories;

  return that;
};

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

  fs.readdir(path, function(err, files) {
    if (err) {
      throw err;
    }

    def = {
      name: '.',
      type: 'd',
      path: path,
      contents: files
    }

    dir = directory(def);
    dir.process_contents(finish);
  });
};

var print_dir = function (state) {
  var string = state.dir.to_string();
  console.log("Depth: " + state.depth + "\n" + string);
};

traverse('/Users/thegreat/workspace/sandbox/subnode/test', print_dir);
