/**
 * A simple monitor that acts as a counting semaphore for managing usage of a
 * limited set of resources.
 */
exports.semaphore = function (num) {
  // Private
  var count = num,
      waiting = [];


  // Public
  var public = {};

  public.wait = function (fn) {
    var args = Array.prototype.slice.call(arguments, 1, arguments.length);

    if (count > 0) {
      fn.apply(fn, args);
      count -= 1;
    }
    else {
      waiting.push({
        function: fn,
        arguments: args,
      });
    }
    
  }
  
  public.signal = function () {
    if (waiting.length == 0) {
      count += 1;
    }
    else {
      var item = waiting.pop();
      item.function.apply(item.function, item.arguments);
    }
    console.log("signal, remaining: %d; available: %d", waiting.length, count);
  }

  return public;
}

