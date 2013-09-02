(function() {

  exports.dependencies = function(engine) {
    return ['consolidate', 'hogan.js'];
  };

  exports.extension = 'hogan';

  exports.process = function(opts, callback) {
    return opts.dependencies.consolidate.hogan.render(opts.text, opts.data, callback);
  };

}).call(this);
