if typeof require == 'function'
  ko = require('knockout')

  Observables  = require './observable'
  Observable   = Observables.Observable

Editable = (self, property, callback) ->
  Observable self, property

  self[property].extend({ editable: "" })

  self[property].subscribe (new_value) =>
    r = callback new_value, property

  return self

ko.extenders.editable = (target, options) ->
  target.editing = ko.observable 'default'

module.exports = Editable if module?
