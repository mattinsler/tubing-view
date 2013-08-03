exports.dependencies = (engine) -> ['consolidate', engine]

# https://npmjs.org/package/consolidate
exports.extensions = [
  'atpl'
  'dust'
  'eco'
  'ect'
  'ejs'
  'haml'
  'haml-coffee'
  'handlebars'
  'hogan'
  'jade'
  'jazz'
  'jqtpl'
  'just'
  'liquor'
  'mustache'
  'qejs'
  'swig'
  'templayed'
  'toffee'
  'underscore'
  'walrus'
  'whiskers'
]

exports.process = (engine, text, data, filename, callback) ->
  require(process.cwd() + '/node_modules/consolidate')[engine].render(text, data, callback)
