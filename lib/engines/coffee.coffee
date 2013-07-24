exports.dependencies = 'coffee-script'
exports.extension = 'coffee'

exports.process = (engine, text, data, callback) ->
  process.nextTick ->
    try
      callback(null, require('coffee-script').compile(text, bare: true))
    catch e
      callback(e)
