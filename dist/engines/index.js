(function() {
  var NPM_PATH, attr_type_to_ext, deps, e, engines, engines_by_ext, exec, ext, file, files, fs, installed, installing, k, npm_install, path, q, v, _i, _j, _len, _len1, _ref, _ref1, _ref2;

  q = require('q');

  fs = require('fs');

  path = require('path');

  exec = require('child_process').exec;

  NPM_PATH = require('path').normalize("" + __dirname + "/../../node_modules/.bin/npm");

  installing = {};

  installed = {};

  npm_install = function(pkg) {
    var command, cwd, d;
    if (installed[pkg]) {
      return true;
    }
    if (installing[pkg] != null) {
      return installing[pkg];
    }
    d = q.defer();
    installing[pkg] = d.promise;
    try {
      require(process.cwd() + '/node_modules/' + pkg);
      installed[pkg] = true;
      d.resolve();
    } catch (err) {
      cwd = process.cwd();
      command = "mkdir -p " + cwd + "/node_modules; " + NPM_PATH + " install " + pkg + " -g --prefix " + cwd + "; mv " + cwd + "/lib/node_modules/* " + cwd + "/node_modules/";
      if (!fs.existsSync(cwd + '/lib')) {
        command += "; rm -rf " + cwd + "/lib";
      }
      exec(command, {
        stdio: 'inherit'
      }, function(err) {
        delete installing[pkg];
        installed[pkg] = true;
        if (err != null) {
          return d.reject(err);
        } else {
          return d.resolve();
        }
      });
    }
    return d.promise;
  };

  engines = exports.engines = {};

  engines_by_ext = exports.engines_by_ext = {};

  attr_type_to_ext = exports.attr_type_to_ext = {};

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
    if (e.attr_types != null) {
      _ref = e.attr_types;
      for (k in _ref) {
        v = _ref[k];
        attr_type_to_ext[k.toLowerCase()] = v.toLowerCase();
      }
    }
    if (e.extensions != null) {
      _ref1 = e.extensions;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        ext = _ref1[_j];
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
      if (Array.isArray(e.dependencies)) {
        e.dependencies = e.dependencies.slice(0);
      } else if (typeof e.dependencies === 'string') {
        e.dependencies = [e.dependencies];
      }
      if ((_ref2 = e.extension) == null) {
        e.extension = file.basename;
      }
      engines_by_ext[e.extension] = e;
    }
    engines[file.basename] = e;
  }

  exports.get_engine = function(ext) {
    return engines_by_ext[ext.toLowerCase()];
  };

  exports.get_engine_by_attr_type = function(type) {
    ext = attr_type_to_ext[type.toLowerCase()];
    if (ext == null) {
      return null;
    }
    return exports.get_engine(ext);
  };

  exports.install_engine_by_ext = function(ext, callback) {
    deps = exports.get_engine(ext).dependencies;
    if (deps.length === 0) {
      return callback();
    }
    return deps.map(function(d) {
      return npm_install.bind(null, d);
    }).reduce(q.when, q()).then(function() {
      return callback();
    }, callback);
  };

  exports.install_engine_by_attr_type = function(type, callback) {
    ext = attr_type_to_ext[type.toLowerCase()];
    if (ext == null) {
      return callback(new Error("Engine script type " + type + " is not supported"));
    }
    return exports.install_engine_by_ext(ext, callback);
  };

  exports.render = function(engine, text, data, callback) {
    e = exports.get_engine(engine);
    if (e == null) {
      return callback(new Error("Engine " + engine + " is not supported"));
    }
    return e.process(engine, text, data, callback);
  };

  exports.render_by_attr_type = function(type, text, data, callback) {
    e = exports.get_engine_by_attr_type(type);
    if (e == null) {
      return callback(new Error("Engine script type " + type + " is not supported"));
    }
    return e.process(attr_type_to_ext[type.toLowerCase()], text, data, callback);
  };

}).call(this);
