if require?
  ko = require '../../../knockout/build/output/knockout-latest.debug'

Observable = (self, property, initial_value) ->
  initial_value = self[property] if initial_value == undefined

  self[property] = ko.observable initial_value

ObservableArray = (self, property, initial_value) ->
  initial_value = [] if initial_value == undefined

  self[property] = ko.observableArray initial_value

  # Shortcut for ko.utils.arrayFilter
  #
  #   observable_array.select (item) -> return <boolean>
  #
  self[property].select = (fn) -> ko.utils.arrayFilter self[property].call(), fn

  # Shortcut for ko.utils.arrayMap
  #
  #   observable_array.map (item) -> return item.id
  #
  self[property].map = (fn) -> ko.utils.arrayMap self[property].call(), fn

Computed = (self, property, fn) -> self[property] = ko.computed fn, self
PureComputed = (self, property, fn) -> self[property] = ko.pureComputed fn, self

ComputedArray = (self, property, fn) ->
  actual_property = '_actual_' + property
  property_fn = '_' + property

  ObservableArray self, actual_property

  self[property_fn] = =>
    self[actual_property] fn()
    return self[actual_property]()

  self[property] = ko.computed self[property_fn]

LazyObservable = (self, property, callback, params = [], init_value = null, make_array = false) ->
  unless make_array
    _value = ko.observable init_value
  else
    _value = ko.observableArray init_value

  self[property] = ko.computed
    read: ->
      if self[property].loaded() == false
        callback.apply(self, params)
      return _value()
    write: (newValue) ->
      self[property].loaded true
      _value newValue
    deferEvaluation: true

  if make_array == true
    self[property].remove = (e) ->
      return _value.remove e
    self[property].push = (e) ->
      return _value.push e

  #expose the current state, which can be bound against
  self[property].loaded = ko.observable false
  #load it again
  self[property].refresh = ->
    result.loaded(false)

LazyObservableArray = (self, property, callback, params = [], init_value = null) ->
  LazyObservable self, property, callback, params, init_value, true

if module?
  module.exports =
    Observable:      Observable
    ObservableArray: ObservableArray
    Computed:        Computed
    ComputedArray:   ComputedArray
    LazyObservable:  LazyObservable