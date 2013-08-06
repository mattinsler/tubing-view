(function() {

  exports.dependencies = ['marked', 'pygmentize-bundled'];

  exports.extensions = ['markdown', 'md'];

  exports.process = function(engine, text, data, filename, callback) {
    var marked, pygmentize;
    marked = require(process.cwd() + '/node_modules/marked');
    pygmentize = require(process.cwd() + '/node_modules/pygmentize-bundled');
    marked.setOptions({
      highlight: function(code, lang, callback) {
        return pygmentize({
          lang: lang,
          format: 'html'
        }, code, function(err, result) {
          if (err != null) {
            return callback(err);
          }
          return callback(null, result.toString());
        });
      }
    });
    return process.nextTick(function() {
      try {
        return callback(null, marked(text));
      } catch (e) {
        return callback(e);
      }
    });
  };

}).call(this);
