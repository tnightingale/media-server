var fs = require('fs'),
    util = require('util'),
    events = require('events');

function Stream (path) {
  var _stats,
      _path = path,
      _that = this;
  events.EventEmitter.call(this);

  fs.stat(_path, function (err, stats) {
    if (err) throw err;

    _stats = stats;
    _that.emit('ready');
  });

  this.get_stats = function () {
    return _stats;
  };
  this.get_path = function () {
    return _path;
  };
}

util.inherits(Stream, events.EventEmitter);

Stream.prototype.send = function (req, res) {
  var range = req.headers.range; 
  var total = this.get_stats().size; 

  var parts = range.replace(/bytes=/, "").split("-"),
      partialstart = parts[0],
      partialend = parts[1],
      start = parseInt(partialstart, 10),
      end = partialend ? parseInt(partialend, 10) : total - 1,
      chunksize = (end - start); 

  fs.open(this.get_path(), 'r', function (err, fd) {
    if (err) throw err;

    fs.read(fd, new Buffer(chunksize), 0, chunksize, start, function (err, bytesRead, buffer) {
      res.writeHead(206, {
        "Content-Range": "bytes " + start + "-" + end + "/" + total,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": 'audio/mpeg'
      }); 
      res.end(buffer.slice(start, end), "binary"); 
    });
  });
};

exports.stream = (function () {
  var count = 0,
  _streams = {};

  return function (path, req, res) {
    var session_id = 0;
    console.log(req.session);
    if (!req.session.id) {
      req.session.id = count++;
    }
    session_id = req.session.id;
    var id = session_id + ':' + path;

    if (!_streams[id]) {
      _streams[id] = new Stream(path);
      _streams[id].once('ready', function () {
        _streams[id].send(req, res);
      });
    }
    else {
      _streams[id].send(req, res);
    }
  };
}());
