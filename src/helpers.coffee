# Provide all required relationship fields
# externalkey (modelname_id), modelplural for API, modelname, modelfunction
#
relationship_fields = (name, model, connector, options = {}) -> [name + '_id', name + 's', name, window[model], connector, options]

single_get_fn = (id_param, api_name, name, model, api, options = {}) ->
  (params = {}, callbackOrObservable) =>
    unless callback?
      callback = (data) =>
        @[name] model(data)
    else if typeof callbackOrObservable['push'] == 'undefined'
      if typeof callbackOrObservable != 'function'
        throw new Error 'model.find 2nd parameter needs to be either a function or a pushable object (Array, ObservableArray).\nGiven: ' + callbackOrObservable

      callback = callbackOrObservable

    model.get_one @[id_param](), callback

lazy_get_fn = (id_param, api_name, name, model, api, options) ->
  unless callback?
    callback = (data) =>
      res = []
      for m in data
        res.push model(m)
      @[api_name] res

    api[api_name].read(@.id).done callback

lazy_single_get_fn = (id_param, api_name, name, model, api, options) ->
  if typeof @[id_param] != 'function'
    throw new Error 'External key not an observable: ' + id_param

  unless @[id_param]()?
    throw new Error 'Tried to access empty relation key: ' + id_param

  if typeof @[id_param]() == 'function'
    throw new Error 'Circular referene? Quitting.'

  unless callback?
      callback = (data) =>
      @[name] model(data)

  model.get_one @[id_param](), callback

get_fn = (id_param, api_name, name, model, api, options = {}) ->
  (params = {}, callbackOrObservable) =>
    callback = (data) =>
      res = []
      for m in data
        res.push model(m)
      @[api_name] res

    if callbackOrObservable? && typeof callbackOrObservable['push'] == 'undefined'
      if typeof callbackOrObservable != 'function'
        throw new Error 'model.find 2nd parameter needs to be either a function or a pushable object (Array, ObservableArray).\nGiven: ' + callbackOrObservable

      callback = callbackOrObservable

    unless api?
      throw new Error 'No Connector found for resource "' + api_name + '" found: ', api

    if options.belongs_to? && options.belongs_to.length > 0
      api[api_name].read(options.belongs_to, @.id, params).done callback
    else
      api[api_name].read(@.id, params).done callback

create_fn = (id_param, api_name, name, model, api, options) ->
  (params = {}, callback) =>
    unless callback?
      callback = (data) =>
        @[api_name].push model(data)

    unless @.id?
      throw new Error 'Empty ID. Save parent model first!'

    if model.encrypted_container?
      params = model.encrypt_container(params)

    unless api?
      throw new Error 'No Connector found for resource "' + api_name + '" found: ', api

    if options.belongs_to.length > 0
      api[api_name].create(options.belongs_to, @.id, params).done callback
    else
      api[api_name].create(@.id, params).done callback

update_fn = (id_param, api_name, name, model, api, options) ->
  (id, params, callback) =>
    unless @.id?
      throw new Error 'Empty ID. Save parent model first!'

    if model.encrypted_container?
      params = model.encrypt_container(params)

    if options.belongs_to?
      api[api_name].update(options.belongs_to, @.id, id, params).done callback
    else
      api[api_name].update(@.id, id, params).done callback

    if @.after_update?
      @.after_update()

destroy_fn = (id_param, api_name, name, model, api, options) ->
  (id, callback) =>
    unless callback?
      callback = (data) =>
        @[api_name].remove element

    unless @.id?
      throw new Error 'Empty ID. Save parent model first!'

    api = connector.get api_name

    if options.belongs_to?
      api[api_name].destroy(options.belongs_to, @.id, id).done callback
    else
      api[api_name].destroy(@.id, id).done callback
