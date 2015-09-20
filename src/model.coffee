'use strict'

# The modelize main function
# Returns a modelize object
#
# @param [Object] options The main configuration object for modelize
#
Modelize = (options) ->
  api.add options.api unless api[options.api]?
  mapi = api[options.api]
  
  add_apis_to options.has_one, options.api if options.has_one?

  add_apis_to options.has_many, options.api if options.has_many?

  # Provide the constructor function for the model object.
  # Enriches the optionally provided object with model functions.
  #
  # @param [Object] self prepopulated data object
  #
  model = (self = {}) ->
    # Return api object
    #
    self.api = -> mapi
    # Provide all required relationship fields
    # externalkey (modelname_id), modelplural for API, modelname, modelfunction
    #
    self.relationship_fields = (name, model) -> [name + '_id', name + 's', name, window[model]]

    # Check if de/encryption functions should be included
    #
    if options.encrypted_container?
      Encryptable self, options.encrypted_container

    # Include sortable functions
    if options.sortable? && options.sortable == true
      Sortable self
    
    # Include selectable functions
    if options.selectable? && options.selectable == true
      Selectable self
    
    # Set relations
    # API wise has_one and belongs_to are the same, so we merge them
    #
    if options.belongs_to?
      unless options.has_one?
        options.has_one = []
      options.has_one = Ham.merge options.belongs_to, options.has_one

    # Single relations
    # Generated methods:
    #
    # @method #relationname_get(params, callbackOrObservable)
    #   Get relation data from given model
    # @method #relationname()
    #   The observable, which is also a lazy get function
    #   if there's no predefined content in the given object
    #
    if options.has_one?
      for name, data of options.has_one
        Ham.merge data,
          model: name.capitalize()

        relation_params = self.relationship_fields name, data.model
        relation_params.push options

        fn = window[data.model]
        
        ###if typeof self[name + '_id'] != 'function'
          unless options.editable?
            options.editable = []

          #options.editable.push name + '_id'
        ###

        if self[name]?
          Observable self, name, new fn(self[name])
        else
          LazyObservable self, name, lazy_single_get_fn, self.relationship_fields(name, data.model)

        self[name + '_get'] = single_get_fn.apply self, relation_params

    # Multiple relations
    # Generated methods:
    #
    # @method #relationnames()
    #   ObservableArray containing all relation data.
    #   Is also a lazy get function if there's no predefined
    #   content in the given object
    # @method #relationname_get(params, callbackOrObservable)
    #   Get relation data
    # @method #relationname_add(params, callback)
    #   Add new model instance to relationship
    # @method #relationname_update(id, params, callback)
    #   Update model instance
    # @method #relationname_destroy(id, callback)
    #   Delete model instance
    #
    if options.has_many?
      for name, data of options.has_many
        Ham.merge data,
          model: name.capitalize()
        
        relation_params = self.relationship_fields name, data.model
        relation_params.push options

        # Get
        #
        if self[name + 's']?
          fn = window[data.model]
          
          items = []
          for item in self[name + 's']
            items.push new fn(item)

          ObservableArray self, name + 's', items
        else
          LazyObservableArray self, name + 's', lazy_get_fn, relation_params
        self[name + '_get'] = get_fn.apply self, relation_params

        # Create
        #
        self[name + '_add'] = create_fn.apply self, relation_params

        # Update
        #
        self[name + '_update'] = update_fn.apply self, relation_params

        # Destroy
        #
        self[name + '_destroy'] = destroy_fn.apply self, relation_params

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
    if options.computed_array?
      for name, fn of options.computed_array
        ComputedArray self, name, fn

    # Add user defined functions
    #
    if options.functions?
      for name, fn of options.functions
        self[name] = fn

    # Update self
    #
    self.update = (params, callback) =>
      unless self.id?
        console.error 'Trying to update nonexisting model object'
        return false

      self.api().update(self.id, params).done callback

    # Destroy self
    #
    self.destroy = (callback) =>
      unless self.id?
        console.error 'Trying to delete nonexisting model object'
        return false

      self.api().destroy(self.id).done callback

    # Save nonexisting instance of self against API and set self.id
    #
    self.create = (callback) =>
      mapi.create(self.export()).done (data) =>
        self.id = data.id

    # Export all model data as an array
    #
    self.export = =>
      data = {}
      if options.editable?
        for index, name of options.editable
          data[name] = self[name]()

      if options.encrypted_editable?
        for index, name of options.encrypted_editable
          data[name] = self[name]()

      if options.belongs_to?
        for name, has_data of options.belongs_to
          data[name + '_id'] = self[name + '_id']

      return data

    return self

  ###
  # These are the collector functions and are not bound to a specific object but to the model
  ###

  # Get objects from API and save into specified observable or callback
  #
  model.get = (params = {}, callbackOrObservable) ->
    callback = (data) ->
      for m in data
        callbackOrObservable.push model(m)

    if typeof callbackOrObservable['push'] == 'undefined'
      if typeof callbackOrObservable != 'function'
        console.log 'model.get 2nd parameter needs to be either a function or a pushable object (Array, ObservableArray).\nGiven:'
        console.log callbackOrObservable

      callback = callbackOrObservable

    if params? && params.id?
      mapi.read(params.id, params).done callback
    else
      mapi.read(params).done callback

  # Shorthand for model.get, just provide a single ID
  #
  model.getOne = (id, observable) ->
    model.get { id: id }, observable

  # Create new object with given params
  #
  model.create = (params = {}, callbackOrObservable) ->
    callback = (data) ->
      callbackOrObservable.push model(data)
    
    if typeof callbackOrObservable['push'] == 'undefined'
      if typeof callbackOrObservable != 'function'
        console.log 'model.create 2nd parameter needs to be either a function or a pushable object (Array, ObservableArray).\nGiven:'
        console.log callbackOrObservable

      callback = (data) =>
        # Copy object hack
        m = model(JSON.parse(JSON.stringify(data)))

        if m.after_create?
          m.after_create()
        
        callbackOrObservable(data)

    if params.length > 0 || typeof params == 'object'
      if model.encrypted_container?
        params = model.encrypt_container(params)
      
      mapi.create(params).done callback
    else
      mapi.create().done callback

  if options.encrypted_container?
    model.encrypted_container = options.encrypted_container

  if options.encrypted_editable?
    model.encrypted_editable = options.encrypted_editable

  # Debug function
  model.encrypt_container = (data, container) ->
    data[model.encrypted_container] = {}
    for index, value of data
      if index in model.encrypted_editable
        data[model.encrypted_container][index] = value

    encdata = encryptData(sessionStorage.getItem('appKey'), JSON.stringify(data[model.encrypted_container]))
    data[model.encrypted_container] = encdata

    return data

  return model