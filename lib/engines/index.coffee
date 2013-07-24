Module = require('module').Module

node_path = process.env.NODE_PATH or ''
delimiter = require('path').delimiter or (if node_path.indexOf(':') isnt -1 then ':' else if node_path.indexOf(';') isnt -1 then ';' else ':')
node_path = node_path.split(delimiter)

add_path = process.cwd() + '/node_modules'

unless add_path in Module.globalPaths
  process.env.NODE_PATH = [add_path].concat(node_path).filter((p) -> p? and p isnt '').join(delimiter)
  Module._initPaths()


fs = require 'fs'
path = require 'path'

engines = exports.engines = {}
engines_by_ext = exports.engines_by_ext = {}

files = fs.readdirSync(__dirname).map (f) -> {
  path: path.join(__dirname, f)
  basename: path.basename(f)
}

for file in files when file.basename isnt 'index'
  e = require file.path
  
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
    e.extension ?= file.basename
    engines_by_ext[e.extension] = e
  
  engines[file.basename] = e

exports.get_engine = (ext) ->
  engines_by_ext[ext]

exports.render = (engine, text, data, callback) ->
  engine = engine.toLowerCase()
  e = exports.get_engine(engine)
  return callback(new Error("Engine #{engine} is not supported")) unless e?
  
  e.process(engine, text, data, callback)
