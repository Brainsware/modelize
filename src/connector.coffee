class RESTConnector
  constructor: (base = '/api/', settings = {}) ->
    default_settings =
      stripTrailingSlash: true
      methodOverride:     true

    settings = Ham.merge settings, default_settings

    @connector = new $.RestClient base, settings

  get: (base_uri) =>
    return @connector[base_uri]

  init: (resource, sub_resources = []) =>
    @connector.add resource unless @connector[resource]?

    for name, data of sub_resources
      @connector[resource].add name + 's' unless @connector[resource][name + 's']

module.exports = Connector if module?
