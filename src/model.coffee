Modelize = (options) ->
  api.add options.api unless api[options.api]?
  mapi = api[options.api]
  
  add_apis_to options.has_one, options.api if options.has_one?

  add_apis_to options.has_many, options.api if options.has_many?

  # Enhance data!
  model = (self = {}) ->
    self.api = -> mapi
    self.relationship_fields = (name, model) -> [name + '_id', name + 's', name, window[model]]

    if options.sortable? && options.sortable == true
      Sortable self
    if options.selectable? && options.selectable == true
      Selectable self
    
    # Set relations
    # Lonely
    if options.belongs_to?
      unless options.has_one?
        options.has_one = []
      options.has_one = Ham.merge options.belongs_to, options.has_one

    if options.has_one?
      for name, data of options.has_one
        Ham.merge data,
          model: name.capitalize()

        fn = window[data.model]
        if self[name]?
          Observable self, name, new fn(self[name])
        else
          LazyObservable self, name, lazy_single_get_fn, self.relationship_fields(name, data.model)

    # Harem relations
    if options.has_many?
      for name, data of options.has_many
        Ham.merge data,
          model: name.capitalize()
        
        relation_params = self.relationship_fields name, data.model
        relation_params.push options

        # Get
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
        self[name + '_add'] = create_fn.apply self, relation_params

        # Update
        self[name + '_update'] = update_fn.apply self, relation_params

        # Destroy
        self[name + '_destroy'] = destroy_fn.apply self, relation_params

    # Set observable fields
    if options.observable?
      for index, name of options.observable
        Observable self, name

    # Set editable fields
    if options.editable?
      for index, name of options.editable
        Editable self, name, (value, prop, delay = 250) =>
          window.timeoutEditor = {} unless window.timeoutEditor?
          clearTimeout(window.timeoutEditor[prop])
          window.timeoutEditor[prop] = setTimeout(=>
            edit_value = {}
            edit_value[prop] = value
            self.update edit_value
          , delay)

    # Set computed fields
    if options.computed?
      for name, fn of options.computed
        Computed self, name, fn

    if options.functions?
      for name, fn of options.functions
        self[name] = fn

    self.update = (data, callback) =>
      self.api().update(self.id, data).done callback

    self.destroy = (callback) =>
      self.api().destroy(self.id).done callback

    return self

  model.get = (params, callbackOrObservable) ->
    callback = (data) ->
      for m in data
        callbackOrObservable.push model(m)

    if typeof callbackOrObservable['push'] == 'undefined'
      if typeof callbackOrObservable != 'function'
        console.log 'Collection.find 2nd parameter needs to be either a function or a pushable object (Array, ObservableArray).\nGiven:'
        console.log callbackOrObservable

      callback = callbackOrObservable

    if params? && params.id?
      mapi.read(params.id, params).done callback
    else
      mapi.read(params).done callback

  model.getOne = (observable, id) ->
    model.get observable, { id: id }

  model.create = (params = {}, callbackOrObservable) ->
    callback = (data) ->
      callbackOrObservable.push model(data)
    
    if typeof callbackOrObservable['push'] == 'undefined'
      if typeof callbackOrObservable != 'function'
        console.log 'Collection.find 2nd parameter needs to be either a function or a pushable object (Array, ObservableArray).\nGiven:'
        console.log callbackOrObservable

      callback = callbackOrObservable

    if params.length > 0 || typeof params == 'object'
      mapi.create(params).done callback
    else
      mapi.create().done callback

  return model

ko.bindingHandlers.sortable.afterMove = (element) ->
  if element.item.move_ui?
    element.item.move_ui element

#module.exports = Modelize