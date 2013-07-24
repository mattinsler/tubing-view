(function() {
  var find_file, is_path_in_root;

  String.prototype.startsWith = function(str) {
    var x, _i, _ref;
    if (this.length < str.length) {
      return false;
    }
    for (x = _i = 0, _ref = str.length; 0 <= _ref ? _i < _ref : _i > _ref; x = 0 <= _ref ? ++_i : --_i) {
      if (this[x] !== str[x]) {
        return false;
      }
    }
    return true;
  };

  find_file = function(needle, haystack) {
    var file, _i, _len;
    for (_i = 0, _len = haystack.length; _i < _len; _i++) {
      file = haystack[_i];
      if (file.filename.startsWith(needle) && (file.filename.length === needle.length || file.filename[needle.length] === '.')) {
        return file;
      }
    }
    return null;
  };

  is_path_in_root = function(root, path) {
    return require('path').relative(root.absolute_path, path).indexOf('..') === -1;
  };

  exports.resolve_path_from_root = function(root, path, callback) {
    path = root.join(path);
    return path.readdir(function(err, files) {
      var f;
      if (files != null) {
        f = find_file('index', files);
        if ((f != null) && is_path_in_root(root, f.absolute_path)) {
          return callback(null, f);
        }
      }
      return path.directory().readdir(function(err, files) {
        if (files != null) {
          f = find_file(path.filename, files);
          if ((f != null) && is_path_in_root(root, f.absolute_path)) {
            return callback(null, f);
          }
        }
        return callback();
      });
    });
  };

  exports.resolve_path_from_root_sync = function(root, path) {
    var f;
    path = root.join(path);
    try {
      f = find_file('index', path.readdir_sync());
      if ((f != null) && is_path_in_root(root, f.absolute_path)) {
        return f;
      }
    } catch (err) {

    }
    try {
      f = find_file(path.filename, path.directory().readdir_sync());
      if ((f != null) && is_path_in_root(root, f.absolute_path)) {
        return f;
      }
    } catch (err) {

    }
    return null;
  };

  exports.resolve_path_from_root_with_extension = function(root, path, extension, callback) {
    var filename;
    filename = require('path').basename(path);
    return exports.resolve_path_from_root(root, path, function(err, resolved_path) {
      if (err != null) {
        return callback(err);
      }
      if (resolved_path == null) {
        return callback();
      }
      if (!(resolved_path.filename.startsWith("index." + extension) || resolved_path.filename.startsWith("" + filename + "." + extension))) {
        return callback();
      }
      return callback(null, resolved_path);
    });
  };

  exports.resolve_path_from_root_with_extension_sync = function(root, path, extension) {
    var filename, resolved_path;
    filename = require('path').basename(path);
    resolved_path = exports.resolve_path_from_root_sync(root, path);
    if ((resolved_path != null) && (resolved_path.filename.startsWith("index." + extension) || resolved_path.filename.startsWith("" + filename + "." + extension))) {
      return resolved_path;
    }
    return null;
  };

}).call(this);
