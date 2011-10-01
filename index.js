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
var traverse = require('./traverse');


var print_dir = function (state) {
  var string = state.dir.to_string();
  console.log("Depth: " + state.depth + "\n" + string);
};

traverse.exec('/Users/thegreat/workspace/sandbox/subnode', print_dir);
