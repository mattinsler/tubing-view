(function() {
  var Engines, betturl, mime, tubing, utils, walkabout;

  mime = require('mime');

  tubing = require('tubing');

  betturl = require('betturl');

  walkabout = require('walkabout');

  utils = exports.utils = require('./utils');

  Engines = exports.Engines = require('./engines');

  exports.configure = function(cmd, done) {
    var content_type, k, _i, _len, _ref, _ref1;
    _ref = this.config.path;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      k = _ref[_i];
      this.config.path[k] = walkabout(this.config.path[k]);
    }
    if ((_ref1 = cmd.data) == null) {
      cmd.data = {};
    }
    cmd.parsed = betturl.parse(cmd.req.url);
    content_type = mime.lookup(cmd.parsed.path);
    if (content_type === 'application/octet-stream') {
      content_type = cmd.req.accepted[0].value;
    }
    cmd.content_type = mime.extension(content_type);
    return done();
  };

  exports.resolve_path = function(config_path_name) {
    return function(cmd, done) {
      var path,
        _this = this;
      path = cmd.parsed.path.replace(new RegExp('\.' + cmd.content_type + '$'), '');
      return utils.resolve_path_from_root_with_extension(this.config.path[config_path_name], path, cmd.content_type, function(err, content_path) {
        var engines;
        if (err != null) {
          return done(err);
        }
        if (content_path == null) {
          return done();
        }
        cmd.resolved = {
          file: content_path,
          path: walkabout(content_path.absolute_path.slice(_this.config.path[config_path_name].absolute_path.length))
        };
        engines = content_path.absolute_path.slice(content_path.absolute_path.lastIndexOf(path) + path.length);
        engines = engines.replace(new RegExp('^(/?index)?\.' + cmd.content_type + '\.?'), '').split('.');
        cmd.engines = engines.filter(function(e) {
          return (e != null) && e !== '';
        }).reverse();
        return done();
      });
    };
  };

  exports.fetch_content = function(cmd, done) {
    return cmd.resolved.file.read_file(function(err, content) {
      if (err != null) {
        return done(err);
      }
      cmd.content = content.toString();
      return done();
    });
  };

  exports.render_engines = function(cmd) {
    var d, step;
    d = this.defer();
    step = function(idx) {
      if (idx === cmd.engines.length) {
        return d.resolve();
      }
      try {
        return Engines.render(cmd.engines[idx], cmd.content, cmd.data, function(err, data) {
          if (err != null) {
            return d.reject(err);
          }
          cmd.content = data;
          return step(idx + 1);
        });
      } catch (err) {
        return d.reject(err);
      }
    };
    step(0);
    return d.promise;
  };

  exports.ViewPipeline = tubing.pipeline('View Pipeline').then(exports.configure).then(exports.resolve_path('content')).then(tubing.exit_unless('resolved')).then(exports.fetch_content).then(exports.render_engines);

}).call(this);
