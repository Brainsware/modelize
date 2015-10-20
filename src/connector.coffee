class Connector
  constructor: (base = '/api/', @type = 'jquery.rest') ->
    @connector = new $.RestClient base,
      stripTrailingSlash: true
      methodOverride:     true

  get: (main_api) =>
    return @connector[main_api]

  init: (resource) =>
    @connector.add resource unless @connector[resource]?

  add_apis_to: (sub_apis, main_api) =>
    for name, data of sub_apis
      @connector[main_api].add name + 's' unless @connector[main_api][name + 's']


module.exports = Connector if module?