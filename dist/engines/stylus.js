(function() {

  exports.dependencies = 'stylus';

  exports.extension = 'styl';

  exports.process = function(engine, text, data, callback) {
    return require('stylus').render(text, {
      filename: ''
    }, callback);
  };

}).call(this);
