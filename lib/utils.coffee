String::startsWith = (str) ->
  return false if @length < str.length
  
  for x in [0...str.length]
    return false unless @[x] is str[x]
  true

find_file = (needle, haystack) ->
  for file in haystack
    return file if file.filename.startsWith(needle) and (file.filename.length is needle.length or file.filename[needle.length] is '.')
  null

is_path_in_root = (root, path) ->
  require('path').relative(root.absolute_path, path).indexOf('..') is -1

exports.resolve_path_from_root = (root, path, callback) ->
  path = root.join(path)
  path.readdir (err, files) ->
    if files?
      f = find_file('index', files)
      return callback(null, f) if f? and is_path_in_root(root, f.absolute_path)
    
    path.directory().readdir (err, files) ->
      if files?
        f = find_file(path.filename, files)
        return callback(null, f) if f? and is_path_in_root(root, f.absolute_path)
      
      callback()

exports.resolve_path_from_root_sync = (root, path) ->
  path = root.join(path)
  try
    f = find_file('index', path.readdir_sync())
    return f if f? and is_path_in_root(root, f.absolute_path)
  catch err
  
  try
    f = find_file(path.filename, path.directory().readdir_sync())
    return f if f? and is_path_in_root(root, f.absolute_path)
  catch err
  
  null

exports.resolve_path_from_root_with_extension = (root, path, extension, callback) ->
  filename = require('path').basename(path)
  
  exports.resolve_path_from_root root, path, (err, resolved_path) ->
    return callback(err) if err?
    return callback() unless resolved_path?
    return callback() unless resolved_path.filename.startsWith("index.#{extension}") or resolved_path.filename.startsWith("#{filename}.#{extension}")
    callback(null, resolved_path)

exports.resolve_path_from_root_with_extension_sync = (root, path, extension) ->
  filename = require('path').basename(path)

  resolved_path = exports.resolve_path_from_root_sync(root, path)
  return resolved_path if resolved_path? and (resolved_path.filename.startsWith("index.#{extension}") or resolved_path.filename.startsWith("#{filename}.#{extension}"))
  
  null
