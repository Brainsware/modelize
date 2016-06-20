class JSONHandler
  load: (data) ->
    JSON.parse data

  save: (data) ->
    JSON.stringify data

module.exports = JSONHandler if module?
