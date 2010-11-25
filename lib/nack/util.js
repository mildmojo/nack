(function() {
  var EventEmitter, LineBuffer;
  var __slice = Array.prototype.slice, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  EventEmitter = require('events').EventEmitter;
  exports.pause = function(stream) {
    var queue;
    queue = [];
    stream.pause();
    stream.on('data', function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return queue.push(['data'].concat(__slice.call(args)));
    });
    stream.on('end', function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return queue.push(['end'].concat(__slice.call(args)));
    });
    return function() {
      var args, _i, _len;
      for (_i = 0, _len = queue.length; _i < _len; _i++) {
        args = queue[_i];
        stream.emit.apply(stream, args);
      }
      return stream.resume();
    };
  };
  exports.LineBuffer = LineBuffer = function() {
    function LineBuffer(stream) {
      this.stream = stream;
      this.readable = true;
      this._buffer = "";
      this.stream.on('data', __bind(function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return this.write.apply(this, args);
      }, this));
      this.stream.on('end', __bind(function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return this.end.apply(this, args);
      }, this));
    }
    __extends(LineBuffer, EventEmitter);
    LineBuffer.prototype.write = function(chunk) {
      var index, line, _results;
      this._buffer += chunk;
      _results = [];
      while ((index = this._buffer.indexOf("\n")) !== -1) {
        line = this._buffer.slice(0, index);
        this._buffer = this._buffer.slice(index + 1, this._buffer.length);
        _results.push(this.emit('data', line));
      }
      return _results;
    };
    LineBuffer.prototype.end = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (args.length > 0) {
        this.write.apply(this, args);
      }
      return this.emit('end');
    };
    return LineBuffer;
  }();
}).call(this);