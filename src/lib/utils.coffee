String::capitalize = ->
  this.charAt(0).toUpperCase() + this.slice(1)

object_merge = (a, b) ->
  result = {}

  result[key] = a[key] for key in Object.keys(a)

  for key in Object.keys(b)
    result[key] = b[key] unless a[key]?

  result

module.exports = object_merge if module?
