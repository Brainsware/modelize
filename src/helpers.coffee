# Provide all required relationship fields
# externalkey (modelname_id), modelplural for API, modelname, modelfunction
#
relationship_fields = (name, model, connector, options = {}) -> [name + '_id', name + 's', name, window[model], connector, options]

get_fn = (id_param, api_name, name, model, connector, options = {}) ->
  (params = {}, callbackOrObservable) =>
    callback = (data) =>
      res = []
      for m in data
        res.push model(m)
      @[api_name] res

    if typeof callbackOrObservable['push'] == 'undefined'
      if typeof callbackOrObservable != 'function'
        console.error 'Collection.find 2nd parameter needs to be either a function or a pushable object (Array, ObservableArray).\nGiven:'
        console.error callbackOrObservable

      callback = callbackOrObservable

    api = connector.get api_name

    unless api?
      console.error 'No Connector found for resource "' + api_name + '" found: ', api
      return false

    if options.belongs_to?
      api.read(options.belongs_to, @.id, params).done callback
    else
      api.read(@.id, params).done callback

single_get_fn = (id_param, api_name, name, model, connector, options = {}) ->
  (params = {}, callbackOrObservable) =>
    callback = (data) =>
      @[name] model(data)

    ###if typeof callbackOrObservable == 'undefined' and typeof callbackOrObservable['push'] == 'undefined'
      if typeof callbackOrObservable != 'function'
        console.error 'Collection.find 2nd parameter needs to be either a function or a pushable object (Array, ObservableArray).\nGiven:'
        console.error callbackOrObservable

      callback = callbackOrObservable
    ###

    model.get_one @[id_param](), callback

lazy_get_fn = (id_param, api_name, name, model, connector, options) ->
  unless callback?
    callback = (data) =>
      res = []
      for m in data
        res.push model(m)
      @[api_name] res

    api = connector.get api_name

    api.read(@.id).done callback

lazy_single_get_fn = (id_param, api_name, name, model, connector, options) ->
  if typeof @[id_param] != 'function'
    console.error 'External key not an observable: ' + id_param
    return false
  
  unless @[id_param]()?
    console.error 'Tried to access empty relation key: ' + id_param
    return false

  if typeof @[id_param]() == 'function'
    console.error 'Circular referene? Quitting.'
    return false
  
  unless callback?
    callback = (data) =>
      @[name] model(data)
  
  model.get_one @[id_param](), callback

create_fn = (id_param, api_name, name, model, connector, options) ->
  (params = {}, callback, instant = false) =>
    unless callback?
      callback = (data) =>
        @[api_name].push model(data)

    unless @.id?
      console.error 'Empty ID. Save parent model first!'
      return

    if model.encrypted_container?
      params = model.encrypt_container(params)

    api = connector.get api_name

    if options.belongs_to.length > 0
      api.create(options.belongs_to, @.id, params).done callback
    else
      api.create(@.id, params).done callback

update_fn = (id_param, api_name, name, model, connector, options) ->
  (id, params, callback) =>
    unless @.id?
      console.error 'Empty ID. Save parent model first!'
      return

    if model.encrypted_container?
      params = model.encrypt_container(params)

    api = connector.get api_name

    if options.belongs_to?
      api.update(options.belongs_to, @.id, id, params).done callback
    else
      api.update(@.id, id, params).done callback

    if @.after_update?
      @.after_update()

destroy_fn = (id_param, api_name, name, model, connector, options) ->
  (id, callback) =>
    unless callback?
      callback = (data) =>
        @[api_name].remove element

    unless @.id?
      console.error 'Empty ID. Save parent model first!'
      return
    
    api = connector.get api_name

    if options.belongs_to?
      api.destroy(options.belongs_to, @.id, id).done callback
    else
      api.destroy(@.id, id).done callback