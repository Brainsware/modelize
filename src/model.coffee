if typeof require == 'function'
  ko = require('knockout')

  object_merge = require('./lib/utils')

  Observables  = require './lib/observable'
  Observable   = Observables.Observable
  Computed     = Observables.Computed
  PureComputed = Observables.PureComputed

  Relatable   = require './lib/relatable'
  Containable = require './lib/containable'

  Editable    = require './lib/editable'
  DelayedSave = require './lib/delayedsave'
  HashedSave  = require './lib/hashedsave'

  SJCLUtils   = require './lib/sjcl'

# The modelize main function
# Returns a modelize object
#
# @param [Object] options The main configuration object for modelize
#
Modelize = (options) ->
  'use strict'

  unless options.connector?
    throw new Error 'No connector given for API URI: ' + options.api

  sub_resources = []

  sub_resources = object_merge sub_resources, options.has_one if options.has_one?
  sub_resources = object_merge sub_resources, options.has_many if options.has_many?

  options.connector.init options.api, sub_resources

  connector = options.connector.get options.api

  # Provide the constructor function for the model object.
  # Enriches the optionally provided object with model functions.
  #
  # @param [Object] self prepopulated data object
  #
  model = (self = {}) ->
    # Return api object
    #
    self.api = -> connector

    if options.hash_salt?
      self.hash_salt = options.hash_salt

    # Include sortable functions
    if options.sortable? && options.sortable == true
      Sortable self

    # Include selectable functions
    if options.selectable? && options.selectable == true
      Selectable self

    # Include relation functions
    if options.has_one? || options.has_many? || options.belongs_to?
      Relatable self, options

    # Include containers
    if options.container?
      Containable self, options

    # Set observable fields
    #
    if options.observable?
      for index, name of options.observable
        Observable self, name

    # Set editable fields
    #
    if options.editable?
      for index, name of options.editable
        Editable self, name, DelayedSave.apply(self, [options, self])

    # Hashed editable fields
    #
    if options.hashed_index?
      for index, name of options.hashed_index
        Editable self, name, HashedSave.apply(self, [options, self])

    # Set computed fields
    #
    if options.computed?
      for name, fn of options.computed
        Computed self, name, fn
    if options.purecomputed?
      for name, fn of options.purecomputed
        PureComputed self, name, fn

    # Add user defined functions
    #
    if options.functions?
      for name, fn of options.functions
        self[name] = fn

    # Update self
    #
    self.update = (params, callback) =>
      unless self.id?
        throw new Error 'Trying to update nonexisting model object'

      self.api().update(self.id, params).done callback

    # Destroy self
    #
    self.destroy = (callback) =>
      unless self.id?
        throw new Error 'Trying to delete nonexisting model object'

      if self.onDestroy?
        self.onDestroy()

      self.api().destroy(self.id).done callback

    # Save nonexisting instance of self against API and set self.id
    #
    self.create = (callback) =>
      self.api().create(self.export(false, true)).done (data) =>
        self.id = data.id

        callback()

    # Export all model data as an array
    #
    self.export = (id = false, datahandler = false) =>
      data = {}

      if id == true
        data['id'] = self['id']

      if options.editable?
        for index, name of options.editable
          data[name] = self[name]()

      if options.belongs_to?
        for name, has_data of options.belongs_to
          data[name + '_id'] = self[name + '_id']()

      if options.container?
        for name, settings of options.container
          # move to container
          if datahandler
            field = name.toLowerCase()
            field = settings.field if settings.field?

            datahandler = settings.datahandler if     settings.datahandler?
            datahandler = new JSONHandler()    unless settings.datahandler?

            data[field] = datahandler.save self[name]()
          else
            unless Array.isArray self[name]()
              data[name] = self[name]().export()
            else
              data[name] = []
              data[name][index] = x.export() for x, index in self[name]()

      return data

    return self

  ###
  # These are the collection functions and are not bound to a specific object but to the model
  ###

  # Get objects from API and save into specified observable or callback
  #
  model.get = (params = {}, callbackOrObservable) ->
    callback = (data) ->
      for m in data
        callbackOrObservable.push model(m)

    if typeof callbackOrObservable['push'] == 'undefined'
      if typeof callbackOrObservable != 'function'
        throw new Error 'Collection.get 2nd parameter needs to be either a function or a pushable object (Array, ObservableArray).\nGiven: ' + callbackOrObservable

      callback = callbackOrObservable

    if typeof params != 'object'
      throw new Error 'Passed params is not an object: ' + typeof params

    if options.hashed_index? && params?
      salt = ''
      if options.hash_salt?
        salt = options.hash_salt

      for param of params
        if param in options.hashed_index
          params[param] = SJCLUtils.getHash(params[param] + salt)

    if params? && params.id?
      return connector.read(params.id, params).done callback
    else
      return connector.read(params).done callback

  # Shorthand for model.get, just provide a single ID
  #
  model.get_one = (id, callbackOrObservable) ->
    callback = (data) ->
      callbackOrObservable model(data)

    if ko.isObservable(callbackOrObservable) == false
      if typeof callbackOrObservable != 'function'
        throw new Error 'Collection.get_one 2nd parameter needs to be either a function or an Observable.\nGiven: ' + callbackOrObservable

      callback = callbackOrObservable

    model.get { id: id }, callback

  # Create new object with given params
  #
  model.create = (params = {}, callbackOrObservable) ->
    callback = (data) ->
      callbackOrObservable.push model(data)

    if typeof callbackOrObservable['push'] == 'undefined'
      if typeof callbackOrObservable != 'function'
        throw new Error 'Collection.create 2nd parameter needs to be either a function or a pushable object (Array, ObservableArray).\nGiven: ' + callbackOrObservable

      callback = (data) =>
        # Copy object hack
        m = model(JSON.parse(JSON.stringify(data)))

        if m.after_create?
          m.after_create()

        callbackOrObservable(data)

    m = model(params)
    if m.before_create?
      m.before_create()

    params = m.export(false, true)
    connector.create(params).done callback

  return model


module.exports = Modelize if module?
