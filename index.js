var fs = require('fs');
function traverse(path, depth) {
  fs.readdir(path, function(err, files) {
    if (err) {
      throw err;
    }

    for (var i in files) {
      processFile(path, files[i], depth + '-');
    }
  });
}

function processFile(path, name, depth) {
  var filepath = path + "/" + name;
  fs.lstat(filepath, function (err, stats) {
    if (err) {
      throw err;
    }

    if (stats.isSymbolicLink()) {
      printName(depth, 'S', filepath);
    }
    else if (stats.isDirectory()) {
      printName(depth, 'D', path);
      traverse(filepath, depth);
    } 
    else if (stats.isFile()) {
      printName(depth, 'F', filepath);
    }
  });
}

function printName(suffix, type, name) {
  console.log(suffix + "\t" + "[" + type + "] " + name);
}

traverse('/Users/thegreat/workspace/sandbox/subnode/test', '+');
