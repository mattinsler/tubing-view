(function() {

  exports.dependencies = function(engine) {
    return ['consolidate', engine];
  };

  exports.extensions = ['atpl', 'dust', 'eco', 'ect', 'ejs', 'haml', 'haml-coffee', 'handlebars', 'hogan', 'jade', 'jazz', 'jqtpl', 'just', 'liquor', 'mustache', 'qejs', 'swig', 'templayed', 'toffee', 'underscore', 'walrus', 'whiskers'];

  exports.process = function(engine, text, data, filename, callback) {
    return require(process.cwd() + '/node_modules/consolidate')[engine].render(text, data, callback);
  };

}).call(this);
