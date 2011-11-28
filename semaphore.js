
exports.Semaphore = function (num) {
  // Private
  var count = num,
      waiting = [];


  // Public
  var public = {};

  public.wait = function (fn) {
    var args = arguments;

    if (count > 0) {
      fn(arguments);
      count -= 1;
    }
    else {
      waiting.push({
        function: fn,
        arguments: args,
      });
    }
  }
  
  public.signal = function (fn) {
    if (waiting.length == 0) {
      count += 1;
    }
    else {
      var item = waiting.pop();
      item.function(item.arguments);
    }
  }

  return public;
}

