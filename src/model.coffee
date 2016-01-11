# The modelize main function
# Returns a modelize object
#
# @param [Object] options The main configuration object for modelize
#
Modelize = (options) ->
  'use strict'

  unless options.connector?
    throw new Error 'No connector given for api: ' + options.api

  options.connector.init options.api

  options.connector.add_apis_to options.has_one, options.api if options.has_one?

  options.connector.add_apis_to options.has_many, options.api if options.has_many?

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

    # Check if de/encryption functions should be included
    #
    if options.encrypted_container?
      Encryptable self, options.encrypted_container, options.encrypted_editable

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

    # Encrypted editable fields
    #
    if options.encrypted_editable?
      for index, name of options.encrypted_editable
        Editable self, name, EncryptedDelayedSave.apply(self, [options, self])

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

      self.api().destroy(self.id).done callback

    # Save nonexisting instance of self against API and set self.id
    #
    self.create = (callback) =>
      self.api().create(self.export()).done (data) =>
        self.id = data.id

        if options.encrypted_container?
          self.enc_update data

        callback()

    # Export all model data as an array
    #
    self.export = (id = false) =>
      data = {}

      if id == true
        data['id'] = self['id']

      if options.editable?
        for index, name of options.editable
          data[name] = self[name]()

      if options.encrypted_editable?
        for index, name of options.encrypted_editable
          data[name] = self[name]()

      if options.belongs_to?
        for name, has_data of options.belongs_to
          data[name + '_id'] = self[name + '_id']()

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

    if params? && params.id?
      connector.read(params.id, params).done callback
    else
      connector.read(params).done callback

    return

  # Shorthand for model.get, just provide a single ID
  #
  model.get_one = (id, callbackOrObservable) ->
    callback = (data) ->
      callbackOrObservable model(data)

    if ko.isObservable(callbackOrObservable) == false
      if typeof callbackOrObservable != 'function'
        throw new Error 'Collection.get_one 2nd parameter needs to be either a function or an Observable.\nGiven: ' + callbackOrObservable

      callback = callbackOrObservable

    model.get { id: id }, callbackOrObservable

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

    if params.length > 0 || typeof params == 'object'
      if model.encrypted_container?
        params = model.encrypt_container(params)

      connector.create(params).done callback
    else
      connector.create().done callback

    return

  model.encrypted_container = options.encrypted_container if options.encrypted_container?

  model.encrypted_editable = options.encrypted_editable if options.encrypted_editable?

  # Debug function
  model.encrypt_container = (data, container) ->
    data[model.encrypted_container] = {}

    for index, value of data
      if index in model.encrypted_editable
        delete data[index]
        data[model.encrypted_container][index] = value

    encdata = encryptData(sessionStorage.getItem('appKey'), JSON.stringify(data[model.encrypted_container]))
    data[model.encrypted_container] = encdata

    return data

  return model


module.exports = Modelize if module?
