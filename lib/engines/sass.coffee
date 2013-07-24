exports.dependencies = 'sass'
exports.extensions = ['sass', 'scss']

exports.process = (engine, text, data, callback) ->
  process.nextTick ->
    try
      callback(null, require('sass').render(text))
    catch err
      callback(err)
