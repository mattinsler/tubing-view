(function() {

  exports.dependencies = 'coffee-script';

  exports.extension = 'coffee';

  exports.attr_types = {
    'text/coffeescript': 'coffee'
  };

  exports.process = function(engine, text, data, filename, callback) {
    return process.nextTick(function() {
      try {
        return callback(null, require(process.cwd() + '/node_modules/coffee-script').compile(text, {
          bare: true
        }));
      } catch (e) {
        return callback(e);
      }
    });
  };

}).call(this);
