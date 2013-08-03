exports.dependencies = 'stylus'
exports.extension = 'styl'
exports.attr_types =
  'text/stylus': 'styl'

exports.process = (engine, text, data, filename, callback) ->
  require(process.cwd() + '/node_modules/stylus').render(text, {filename: filename or '/path.styl'}, callback)
