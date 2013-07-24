(function() {
  var Module, add_path, delimiter, deps, e, engines, engines_by_ext, ext, file, files, fs, node_path, path, _i, _j, _len, _len1, _ref, _ref1,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Module = require('module').Module;

  node_path = process.env.NODE_PATH || '';

  delimiter = require('path').delimiter || (node_path.indexOf(':') !== -1 ? ':' : node_path.indexOf(';') !== -1 ? ';' : ':');

  node_path = node_path.split(delimiter);

  add_path = process.cwd() + '/node_modules';

  if (__indexOf.call(Module.globalPaths, add_path) < 0) {
    process.env.NODE_PATH = [add_path].concat(node_path).filter(function(p) {
      return (p != null) && p !== '';
    }).join(delimiter);
    Module._initPaths();
  }

  fs = require('fs');

  path = require('path');

  engines = exports.engines = {};

  engines_by_ext = exports.engines_by_ext = {};

  files = fs.readdirSync(__dirname).map(function(f) {
    return {
      path: path.join(__dirname, f),
      basename: path.basename(f)
    };
  });

  for (_i = 0, _len = files.length; _i < _len; _i++) {
    file = files[_i];
    if (!(file.basename !== 'index')) {
      continue;
    }
    e = require(file.path);
    if (e.extensions != null) {
      _ref = e.extensions;
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        ext = _ref[_j];
        if (Array.isArray(e.dependencies)) {
          deps = e.dependencies.slice(0);
        } else if (typeof e.dependencies === 'string') {
          deps = [e.dependencies];
        } else if (typeof e.dependencies === 'function') {
          deps = e.dependencies(ext);
        }
        engines_by_ext[ext] = {
          dependencies: deps || [],
          process: e.process,
          extension: ext
        };
      }
    } else {
      if ((_ref1 = e.extension) == null) {
        e.extension = file.basename;
      }
      engines_by_ext[e.extension] = e;
    }
    engines[file.basename] = e;
  }

  exports.get_engine = function(ext) {
    return engines_by_ext[ext];
  };

  exports.render = function(engine, text, data, callback) {
    engine = engine.toLowerCase();
    e = exports.get_engine(engine);
    if (e == null) {
      return callback(new Error("Engine " + engine + " is not supported"));
    }
    return e.process(engine, text, data, callback);
  };

}).call(this);
