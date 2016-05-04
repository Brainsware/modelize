if typeof require == 'function'
  object_merge = require('./lib/utils')

  $ = require('jquery')
  window.jQuery = require('jquery')
  require('../vendor/jquery.rest/dist/1/jquery.rest.min.js')

class RESTConnector
  constructor: (base = '/api/', settings = {}) ->
    default_settings =
      stripTrailingSlash: true
      methodOverride:     true

    settings = object_merge settings, default_settings

    @connector = new $.RestClient base, settings

  get: (base_uri) =>
    return @connector[base_uri]

  init: (resource, sub_resources = []) =>
    @connector.add resource unless @connector[resource]?

    for name, data of sub_resources
      @connector[resource].add name + 's' unless @connector[resource][name + 's']

module.exports = RESTConnector if module?
