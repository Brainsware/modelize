get_fn = (id_param, api_name, name, model, options) ->
  (params = {}, callbackOrObservable) =>
    callback = (data) =>
      res = []
      for m in data
        res.push model(m)
      @[api_name] res

    if typeof callbackOrObservable['push'] == 'undefined'
      if typeof callbackOrObservable != 'function'
        console.log 'Collection.find 2nd parameter needs to be either a function or a pushable object (Array, ObservableArray).\nGiven:'
        console.log callbackOrObservable

      callback = callbackOrObservable

    if options.belongs_to?
      @.api()[api_name].read(options.belongs_to, @.id, params).done callback
    else
      @.api()[api_name].read(@.id, params).done callback

lazy_get_fn = (id_param, api_name, name, model, options) ->
  unless callback?
    callback = (data) =>
      res = []
      for m in data
        res.push model(m)
      @[api_name] res

    @.api()[api_name].read(@.id).done callback

lazy_single_get_fn = (id_param, api_name, name, model, options) ->
  unless @[id_param]()?
    console.log 'Tried to access empty relation key: ' + id_param
    return false
  
  unless callback?
    callback = (data) =>
      @[name] model(data)
  
  model.get @[id_param](), callback

create_fn = (id_param, api_name, name, model, options) ->
  (params = {}, callback) =>
    unless callback?
      callback = (data) =>
        @[api_name].push model(data)

    if options.belongs_to?
      @.api()[api_name].create(options.belongs_to, @.id, params).done callback
    else
      @.api()[api_name].create(@.id, params).done callback

update_fn = (id_param, api_name, name, model, options) ->
  (id, params, callback) =>
    if options.belongs_to?
      @.api()[api_name].update(options.belongs_to, @.id, id, params).done callback
    else
      @.api()[api_name].update(@.id, id, params).done callback

destroy_fn = (id_param, api_name, name, model, options) ->
  (id, callback) =>
    unless callback?
      callback = (data) =>
        @[api_name].remove element

    if options.belongs_to?
      @.api()[api_name].destroy(options.belongs_to, @.id, id).done callback
    else
      @.api()[api_name].destroy(@.id, id).done callback