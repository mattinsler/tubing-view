exports.dependencies = 'coffee-script'
exports.extension = 'coffee'
exports.attr_types =
  'text/coffeescript': 'coffee'

exports.process = (engine, text, data, callback) ->
  process.nextTick ->
    try
      callback(null, require(process.cwd() + '/node_modules/coffee-script').compile(text, bare: true))
    catch e
      callback(e)
