class JSONHandler
  load: (data) ->
    JSON.parse atob data

  save: (data) ->
    btoa ko.toJSON data

module.exports = JSONHandler if module?
