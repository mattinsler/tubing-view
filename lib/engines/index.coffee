q = require 'q'
fs = require 'fs'
path = require 'path'
{exec} = require 'child_process'
NPM_PATH = require('path').normalize("#{__dirname}/../../node_modules/.bin/npm")

installing = {}
installed = {}

npm_install = (pkg) ->
  return true if installed[pkg]
  return installing[pkg] if installing[pkg]?
  
  d = q.defer()
  installing[pkg] = d.promise
  
  try
    require(process.cwd() + '/node_modules/' + pkg)
    installed[pkg] = true
    d.resolve()
  catch err
    cwd = process.cwd()
    command = "mkdir -p #{cwd}/node_modules; #{NPM_PATH} install #{pkg} -g --prefix #{cwd}; mv #{cwd}/lib/node_modules/* #{cwd}/node_modules/"
    command += "; rm -rf #{cwd}/lib" unless fs.existsSync(cwd + '/lib')
    
    exec command, {stdio: 'inherit'}, (err) ->
      delete installing[pkg]
      installed[pkg] = true
      if err?
        d.reject(err)
      else
        d.resolve()
  
  d.promise


engines = exports.engines = {}
engines_by_ext = exports.engines_by_ext = {}
attr_type_to_ext = exports.attr_type_to_ext = {}

files = fs.readdirSync(__dirname).map (f) -> {
  path: path.join(__dirname, f)
  basename: path.basename(f)
}

for file in files when file.basename isnt 'index'
  e = require file.path
  
  if e.attr_types?
    for k, v of e.attr_types
      attr_type_to_ext[k.toLowerCase()] = v.toLowerCase()
  
  if e.extensions?
    for ext in e.extensions
      if Array.isArray(e.dependencies)
        deps = e.dependencies.slice(0)
      else if typeof e.dependencies is 'string'
        deps = [e.dependencies]
      else if typeof e.dependencies is 'function'
        deps = e.dependencies(ext)
      
      engines_by_ext[ext] = 
        dependencies: deps or []
        process: e.process
        extension: ext
  else
    if Array.isArray(e.dependencies)
      e.dependencies = e.dependencies.slice(0)
    else if typeof e.dependencies is 'string'
      e.dependencies = [e.dependencies]
    
    e.extension ?= file.basename
    engines_by_ext[e.extension] = e
  
  engines[file.basename] = e

exports.get_engine = (ext) ->
  engines_by_ext[ext.toLowerCase()]

exports.get_engine_by_attr_type = (type) ->
  ext = attr_type_to_ext[type.toLowerCase()]
  return null unless ext?
  exports.get_engine(ext)

exports.install_engine_by_ext = (ext, callback) ->
  e = exports.get_engine(ext)
  return callback(new Error("Could not find engine for extension #{ext}")) unless e?
  deps = e.dependencies
  return callback() if deps.length is 0
  
  deps.map((d) -> npm_install.bind(null, d)).reduce(q.when, q()).then ->
    callback()
  , callback

exports.install_engine_by_attr_type = (type, callback) ->
  ext = attr_type_to_ext[type.toLowerCase()]
  return callback(new Error("Engine script type #{type} is not supported")) unless ext?
  exports.install_engine_by_ext(ext, callback)

exports.render = (engine, text, data, callback) ->
  e = exports.get_engine(engine)
  return callback(new Error("Engine #{engine} is not supported")) unless e?
  
  e.process(engine, text, data, callback)

exports.render_by_attr_type = (type, text, data, callback) ->
  e = exports.get_engine_by_attr_type(type)
  return callback(new Error("Engine script type #{type} is not supported")) unless e?
  
  e.process(attr_type_to_ext[type.toLowerCase()], text, data, callback)
