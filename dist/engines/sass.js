(function() {

  exports.dependencies = 'sass';

  exports.extensions = ['sass', 'scss'];

  exports.attr_types = {
    'text/sass': 'sass',
    'text/scss': 'scss'
  };

  exports.process = function(engine, text, data, filename, callback) {
    return process.nextTick(function() {
      try {
        return callback(null, require(process.cwd() + '/node_modules/sass').render(text));
      } catch (err) {
        return callback(err);
      }
    });
  };

}).call(this);
