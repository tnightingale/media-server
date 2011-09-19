var fs = require('fs');

var File = function(name, type, dir) {
  this.name = name;
  this.type = type;
  this.dir_path = dir.path;
  this.dir_depth = dir.depth;
}

File.prototype.toString = function() {
  var output = "";

  output += "[" + this.type + "]" + " ";
  output += this.name + " "
  output += "(" + this.dir_path + ")";

  return output;
}

var Directory = function(path, contents, depth) {
  this.path = path;
  this.contents = contents;
  this.depth = depth;
  this.files = [];
  this.directories = [];
}

Directory.prototype.addFile = function(file) {
  this.files.push(file);
}

Directory.prototype.addDir = function(dir) {
  this.directories.push(dir);
}

Directory.prototype.getFileInfo = function(name, callback) {
  var filepath = this.path + "/" + name;
  var dir = this;

  fs.lstat(filepath, function (err, stats) {
    if (err) {
      throw err;
    }

    if (stats.isSymbolicLink()) {
      dir.addFile(new File(name, 's', dir));
    }
    else if (stats.isDirectory()) {
      dir.addDir(filepath);
    } 
    else if (stats.isFile()) {
      dir.addFile(new File(name, 'f', dir));
    }

    callback(dir);
  });
}

Directory.prototype.processContents = function(callback) {
  for (var i = 0; i < this.contents.length; i++) {
    this.getFileInfo(this.contents[i], callback);
  }
}

Directory.prototype.toString = function() {
  var output = "";

  output += "> Directory: " + this.path + "\n"
  output += "  Directories:" + "\n";
  for (var i = 0; i < this.directories.length; i++) {
    output += "  + " + this.directories[i] + "\n";
  }

  output += "  Files:" + "\n";
  for (var i = 0; i < this.files.length; i++) {
    output += "  - " + this.files[i].toString() + "\n";
  }

  return output;
}

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
