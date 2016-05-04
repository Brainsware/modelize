if typeof require == 'function'
  object_merge = require './utils'
  Helpers      = require '../helpers'

  Observables     = require './observable'
  Observable      = Observables.Observable
  ObservableArray = Observables.ObservableArray

Relatable = (self, options) ->
  # Set relations
  # API wise has_one and belongs_to are the same, so we merge them
  #
  if options.belongs_to?
    unless options.has_one?
      options.has_one = []
    options.has_one = object_merge options.belongs_to, options.has_one
  else
    options.belongs_to = []

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
      object_merge data,
        model: name.capitalize()

      relation_params = Helpers.relationship_fields name, data.model, self.api(), options

      fn = window[data.model]
      fn = data.model if data.model? and typeof data.model == 'function'

      if typeof fn != 'function'
        console.debug 'Relation model for "' + name + '" not a function: ', fn
        throw new Error 'No model for has_one/belongs_to relation found'

      if typeof self[name + '_id'] != 'function' && name not in options.belongs_to
        unless options.editable?
          options.editable = []

        if name + '_id' not in options.editable
          options.editable.push name + '_id'

      if self[name]?
        Observable self, name, new fn(self[name])
      else
        Observable self, name, new fn()
        #LazyObservable self, name, lazy_single_get_fn, relation_params

      self[name + '_get'] = Helpers.single_get_fn.apply self, relation_params

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
      object_merge data,
        model: name.capitalize()

      relation_params = Helpers.relationship_fields name, data.model, self.api(), options

      # Get
      #
      if self[name + 's']?
        fn = window[data.model]

        items = []
        for item in self[name + 's']
          items.push new fn(item)

        ObservableArray self, name + 's', items
      else
        ObservableArray self, name + 's', []
        #LazyObservableArray self, name + 's', lazy_get_fn, relation_params
      self[name + '_get'] = Helpers.get_fn.apply self, relation_params

      # Create
      #
      self[name + '_add'] = Helpers.create_fn.apply self, relation_params

      # Destroy
      #
      self[name + '_destroy'] = Helpers.destroy_fn.apply self, relation_params

module.exports = Relatable if module?
