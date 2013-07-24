(function() {

  exports.dependencies = 'recess';

  exports.extension = 'less';

  exports.process = function(engine, text, data, callback) {
    var Recess, instance;
    Recess = require('recess').Constructor;
    instance = new Recess();
    instance.options.compile = true;
    instance.path = 'path.less';
    instance.data = text;
    instance.callback = function() {
      if (instance.errors.length > 0) {
        return callback(instance.errors[0]);
      }
      return callback(null, instance.output.join('\n'));
    };
    return instance.parse();
  };

}).call(this);
