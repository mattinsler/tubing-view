(function() {

  exports.dependencies = 'stylus';

  exports.extension = 'styl';

  exports.attr_types = {
    'text/stylus': 'styl'
  };

  exports.process = function(engine, text, data, filename, callback) {
    return require(process.cwd() + '/node_modules/stylus').render(text, {
      filename: filename || '/path.styl'
    }, callback);
  };

}).call(this);
