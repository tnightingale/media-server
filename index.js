Function.prototype.method = function (name, func) {
  if (!this.prototype[name]) {
    this.prototype[name] = func;
    return this;
  }
}


var fs = require('fs');

var File = function(name, type, dir) {
  this.name = name;
  this.type = type;
  this.dir_path = dir.path;
  this.dir_depth = dir.depth;
}

File.method('toString', function() {
  var output = '';

  output += '[' + this.type + ']' + ' ';
  output += this.name + ' '
  output += '(' + this.dir_path + ')';

  return output;
});

var Directory = function(path, contents, depth) {
  this.path = path;
  this.contents = contents;
  this.depth = depth;
  this.files = [];
  this.directories = [];
}

Directory.method('addFile', function(file) {
  this.files.push(file);
});

Directory.method('addDir', function(dir) {
  this.directories.push(dir);
});

Directory.method('getFileInfo', function(name, callback) {
  var filepath = this.path + '/' + name;
  var that = this;

  fs.lstat(filepath, function (err, stats) {
    if (err) {
      throw err;
    }

    if (stats.isSymbolicLink()) {
      that.addFile(new File(name, 's', that));
    }
    else if (stats.isDirectory()) {
      that.addDir(filepath);
    } 
    else if (stats.isFile()) {
      that.addFile(new File(name, 'f', that));
    }

    callback(that);
  });
});

Directory.method('processContents', function(callback) {
  for (var i = 0; i < this.contents.length; i++) {
    this.getFileInfo(this.contents[i], callback);
  }
});

Directory.method('toString', function() {
  var output = '';

  output += '> Directory: ' + this.path + '\n';

  output += '  Directories:' + '\n';
  for (var i = 0; i < this.directories.length; i++) {
    output += '  + ' + this.directories[i] + '\n';
  }

  output += '  Files:' + '\n';
  for (var i = 0; i < this.files.length; i++) {
    output += '  - ' + this.files[i].toString() + '\n';
  }

  return output;
});

function traverse(path, depth, callback) {
  fs.readdir(path, function(err, files) {
    if (err) {
      throw err;
    }

    var dir = new Directory(path, files, depth);
    dir.processContents(function(dir) {
      for (var i = 0; i < dir.directories.length; i++) {
        traverse(dir.directories[i], dir.depth + 1, callback);
      }
      callback(dir);
    });
  });
}

function printDir(dir) {
  if (dir.files.length + dir.directories.length < dir.contents.length) {
    return;
  }

  console.log(dir.toString());
}

traverse('/Users/thegreat/workspace/sandbox/subnode', 0, printDir);
