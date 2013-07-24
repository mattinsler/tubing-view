exports.dependencies = 'stylus'
exports.extension = 'styl'

exports.process = (engine, text, data, callback) ->
  require('stylus').render(text, {filename: ''}, callback)
