
var Semaphore = exports.new = function (num) {
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
      console.log("available: %d", count);
    }
    else {
      waiting.push({
        function: fn,
        arguments: args,
      });
      console.log("waiting: %d", waiting.length);
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
    console.log("signal, remaining: %d", waiting.length);
  }

  return public;
}

