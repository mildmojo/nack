// Generated by CoffeeScript 1.3.3
(function() {
  var createPool, createServer;

  createServer = require('connect').createServer;

  createPool = require('./pool').createPool;

  exports.createServer = function(config, options) {
    var pool, server, _ref, _ref1;
    if (options == null) {
      options = {};
    }
    if ((_ref = options.size) == null) {
      options.size = 3;
    }
    if ((_ref1 = options.idle) == null) {
      options.idle = 15 * 60 * 1000;
    }
    pool = createPool(config, options);
    server = createServer(pool.proxy);
    server.on('close', function() {
      return pool.quit();
    });
    return server;
  };

}).call(this);
