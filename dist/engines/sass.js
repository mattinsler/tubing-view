(function() {

  exports.dependencies = 'sass';

  exports.extensions = ['sass', 'scss'];

  exports.process = function(engine, text, data, callback) {
    return process.nextTick(function() {
      try {
        return callback(null, require('sass').render(text));
      } catch (err) {
        return callback(err);
      }
    });
  };

}).call(this);
