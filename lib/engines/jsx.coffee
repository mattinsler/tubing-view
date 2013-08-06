exports.dependencies = 'react-tools'
exports.extension = 'jsx'
exports.attr_types =
  'text/jsx': 'jsx'

remove_comments = (v) ->
  while (idx = v.indexOf('/*')) isnt -1
    v = v.slice(v.indexOf('*/', idx) + 2)
  v

exports.process = (engine, text, data, filename, callback) ->
  text = '/** @jsx React.DOM */\n' + remove_comments(text)
  
  process.nextTick ->
    try
      callback(null, require(process.cwd() + '/node_modules/react-tools').transform(text))
    catch e
      callback(e)
