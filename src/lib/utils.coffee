Sorted = (array, fn) ->
  unless fn?
    fn = (a, b) ->
      a_name = a.name().toLowerCase()
      b_name = b.name().toLowerCase()

      return -1 if (a_name < b_name)
      return 1  if (a_name > b_name)
      return 0

  return array.sort fn

String.prototype.capitalize = ->
    this.charAt(0).toUpperCase() + this.slice(1)