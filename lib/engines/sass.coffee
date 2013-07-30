exports.dependencies = 'sass'
exports.extensions = ['sass', 'scss']
exports.attr_types =
  'text/sass': 'sass'
  'text/scss': 'scss'

exports.process = (engine, text, data, callback) ->
  process.nextTick ->
    try
      callback(null, require(process.cwd() + '/node_modules/sass').render(text))
    catch err
      callback(err)
