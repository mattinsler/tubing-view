(function() {

  exports.dependencies = 'coffee-script';

  exports.extension = 'coffee';

  exports.process = function(engine, text, data, callback) {
    return process.nextTick(function() {
      try {
        return callback(null, require('coffee-script').compile(text, {
          bare: true
        }));
      } catch (e) {
        return callback(e);
      }
    });
  };

}).call(this);
