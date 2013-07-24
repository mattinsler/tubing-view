mime = require 'mime'
tubing = require 'tubing'
betturl = require 'betturl'
walkabout = require 'walkabout'

utils = exports.utils = require './utils'
Engines = exports.Engines = require './engines'

exports.configure = (cmd, done) ->
  @config.path[k] = walkabout(@config.path[k]) for k in @config.path
  
  cmd.data ?= {}
  
  cmd.parsed = betturl.parse(cmd.req.url)
  
  content_type = mime.lookup(cmd.parsed.path)
  content_type = cmd.req.accepted[0].value if content_type is 'application/octet-stream'
  cmd.content_type = mime.extension(content_type)
  
  done()

exports.resolve_path = (config_path_name) ->
  (cmd, done) ->
    path = cmd.parsed.path.replace(new RegExp('\.' + cmd.content_type + '$'), '')
  
    utils.resolve_path_from_root_with_extension @config.path[config_path_name], path, cmd.content_type, (err, content_path) =>
      return done(err) if err?
      return done() unless content_path?
    
      cmd.resolved =
        file: content_path
        path: walkabout(content_path.absolute_path.slice(@config.path[config_path_name].absolute_path.length))
      
      engines = content_path.absolute_path.slice(content_path.absolute_path.lastIndexOf(path) + path.length)
      engines = engines.replace(new RegExp('^(/?index)?\.' + cmd.content_type + '\.?'), '').split('.')
      cmd.engines = engines.filter((e) -> e? and e isnt '').reverse()
    
      done()

exports.fetch_content = (cmd, done) ->
  cmd.resolved.file.read_file (err, content) ->
    return done(err) if err?
    cmd.content = content.toString()
    done()

exports.render_engines = (cmd) ->
  d = @defer()
  
  step = (idx) ->
    return d.resolve() if idx is cmd.engines.length
    
    try
      Engines.render cmd.engines[idx], cmd.content, cmd.data, (err, data) ->
        return d.reject(err) if err?
        cmd.content = data
        step(idx + 1)
    catch err
      return d.reject(err)
    
  step(0)
  
  d.promise

exports.ViewPipeline = tubing.pipeline('View Pipeline')
  .then(exports.configure)
  .then(exports.resolve_path('content'))
  .then(tubing.exit_unless('resolved'))
  .then(exports.fetch_content)
  .then(exports.render_engines)
