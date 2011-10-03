/**
 *
 */
var file = function (spec) {
  var that = {},
      name = spec.name,
      type = spec.type,
      path = spec.path;

  /**
   *
   */
  var to_string = function () {
    var output = '';

    output += '[' + type + ']' + ' ';
    output += name + ' ';
    output += '(' + path + ')';

    return output;
  };
  that.to_string = to_string;

  /**
   *
   */
  var get_path = function () {
    return path;
  };
  that.get_path = get_path;

  /**
   *
   */
  var get_name = function () {
    return name;
  };
  that.get_name = get_name;

  return that;
};
exports.create = file;

