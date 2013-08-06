exports.dependencies = ['marked', 'pygmentize-bundled']
exports.extensions = ['markdown', 'md']

exports.process = (engine, text, data, filename, callback) ->
  marked = require(process.cwd() + '/node_modules/marked')
  pygmentize = require(process.cwd() + '/node_modules/pygmentize-bundled')
  
  marked.setOptions(
    highlight: (code, lang, callback) ->
      pygmentize lang: lang, format: 'html', code, (err, result) ->
        return callback(err) if err?
        callback(null, result.toString())
  )
  
  process.nextTick ->
    try
      callback(null, marked(text))
    catch e
      callback(e)
