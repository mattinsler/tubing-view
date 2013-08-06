(function() {
  var remove_comments;

  exports.dependencies = 'react-tools';

  exports.extension = 'jsx';

  exports.attr_types = {
    'text/jsx': 'jsx'
  };

  remove_comments = function(v) {
    var idx;
    while ((idx = v.indexOf('/*')) !== -1) {
      v = v.slice(v.indexOf('*/', idx) + 2);
    }
    return v;
  };

  exports.process = function(engine, text, data, filename, callback) {
    text = '/** @jsx React.DOM */\n' + remove_comments(text);
    return process.nextTick(function() {
      try {
        return callback(null, require(process.cwd() + '/node_modules/react-tools').transform(text));
      } catch (e) {
        return callback(e);
      }
    });
  };

}).call(this);
