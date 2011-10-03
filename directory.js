var fs = require('fs');

var file = require('./file');

/**
 *
 */
var directory = function (spec) {
  var that = file.create(spec),
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

  var get_contents = function (callback) {
    fs.readdir(that.get_path() + '/' + that.get_name(), function (err, files) {
      if (err) {
        throw err;
      }
      contents = files;

      callback(that);
    });
  };
  that.get_contents = get_contents;

  var process_contents = function (callback) {
    var get_file_info = function (name) {
      var path = that.get_path() + '/' + that.get_name(),
          def = {},
          i = 0;

      fs.lstat(path + '/' + name, function (err, stats) {
        if (err) {
          throw err;
        }

        def.name = name;
        def.path = path;

        if (stats.isSymbolicLink()) {
          def.type = 's';
          add_file(file.create(def));
        }
        else if (stats.isDirectory()) {
          def.type = 'd';
          add_dir(directory(def));
        } 
        else if (stats.isFile()) {
          def.type = 'f';
          add_file(file.create(def));
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

    output += '> Directory: ' + that.get_name() + '\n';
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
exports.create = directory;

