exports.dependencies = 'stylus'
exports.extension = 'styl'
exports.attr_types =
  'text/stylus': 'styl'

exports.process = (engine, text, data, callback) ->
  require(process.cwd() + '/node_modules/stylus').render(text, {filename: ''}, callback)
