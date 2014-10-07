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
    
    # Set relations
    # Lonely
    if options.has_one?
      for name, data of options.has_one
        Ham.merge data,
          model: name.capitalize()
        # Get related models
        callback_fn = (id_param, api_name, name, model) ->
          unless self[id_param]?
            console.log 'Tried to access empty relation key: ' + id_param
            return false
          
          unless callback?
            callback = (data) =>
              @[name] model(data)
          api[api_name].read(self[id_param]).done callback

        fn = window[data.model]
        if self[name]?
          Observable self, name, new fn(self[name])
        else
          LazyObservable self, name, callback_fn, self.relationship_fields(name, data.model), new fn

    # Harem relations
    if options.has_many?
      for name, data of options.has_many
        Ham.merge data,
          model: name.capitalize()
        # Get
        callback_fn = (id_param, api_name, name, model) ->
          unless callback?
            callback = (data) =>
              res = []
              for m in data
                res.push model(m)
                #@[api_name].push model(m)
              @[api_name] res

          self.api()[api_name].read(self.id).done callback
          #(params = {}, callback) =>
          #  p = [self.id, params]
          #  p.shift options.belongs_to if options.belongs_to?
          #
          #  unless callback?
          #    callback = (data) =>
          #      for m in data
          #        @[api_name].push model(m)
          #
          #  self.api()[api_name].read.apply(self, p).done callback
        LazyObservableArray self, name + 's', callback_fn, self.relationship_fields(name, data.model)

        # Create
        callback_fn = (id_param, api_name, name, model) ->
          #(id, callback) =>
          (element, params = {}, callback) =>
            unless callback?
              callback = (data) =>
                @[api_name].push model(data)
            #params = {}
            #params[id_param] = id

            #console.log model

            #model.create { invoice_id: self.id }, callback

            if options.belongs_to?
              self.api()[api_name].create(options.belongs_to, self.id, params).done callback
            else
              self.api()[api_name].create(self.id, params).done callback
        self[name + '_add'] = callback_fn.apply self, self.relationship_fields(name, data.model)

        # Update
        callback_fn = (id_param, api_name, name, model) ->
          (id, params, callback) =>
            if options.belongs_to?
              self.api()[api_name].update(options.belongs_to, self.id, id, params).done callback
            else
              self.api()[api_name].update(self.id, id, params).done callback
        self[name + '_update'] = callback_fn.apply self, self.relationship_fields(name, data.model)

        # Destroy
        callback_fn = (id_param, api_name, name, model) ->
          #(id, callback) =>
          (element) =>
            unless callback?
              callback = (data) =>
                @[api_name].remove element

            element.destroy callback

            #if options.belongs_to?
            #  self.api()[name].destroy(options.belongs_to, self.id, id).done callback
            #else
            #  self.api()[name].destroy(self.id, id).done callback
        self[name + '_destroy'] = callback_fn.apply self, self.relationship_fields(name, data.model)

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