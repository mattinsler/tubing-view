exports.dependencies = 'recess'
exports.extension = 'less'
exports.attr_types =
  'text/less': 'less'

exports.process = (engine, text, data, callback) ->
  Recess = require(process.cwd() + '/node_modules/recess').Constructor
  instance = new Recess()
  instance.options.compile = true
  # instance.options.compress = true
  instance.path = 'path.less'
  instance.data = text
  instance.callback = ->
    if instance.errors.length > 0
      return callback(instance.errors[0])
    callback(null, instance.output.join('\n'))

  instance.parse()
