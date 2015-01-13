Ham = () -> return

Ham.merge = (a, b) ->
    result = {}

    result[key] = a[key] for key in Object.keys(a)

    for key in Object.keys(b)
      result[key] = b[key] unless a[key]?

    result

module.exports = Ham if module?
