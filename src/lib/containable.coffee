Containable = (self, options) ->
  # Set default single containers
  #
  self.init_single_container = (name, datahandler, container_fn, field, first_class, options) =>
    data = null
    data = datahandler.load(self[field]) if self[field]?

    Observable self, name, new container_fn(data)

    for editable in self[name]().editables
      MappedObservable self, editable, self[name]()

    self[name]().__updated.subscribe (data) =>
      callback = DelayedSave.apply(self, [options, self, datahandler])
      callback data, field

  # Set containers with type 'multi'
  #
  self.init_multi_container = (name, datahandler, container_fn, field, options) =>
    data = null
    data = datahandler.load(self[field]) if self[field]?

    # Load all items and set the subscriber to each Container
    items = []
    if data?
      for item in data
        c = new container_fn(item)
        items.push c
        c.__updated.subscribe =>
          callback = DelayedSave.apply(self, [options, self, datahandler])
          callback self[name](), field

    ObservableArray self, name, items

    self[name + '_add'] = (params = {}) =>
      c = container_fn(params)
      self[name].push c
      c.__updated.subscribe =>
        callback = DelayedSave.apply(self, [options, self, datahandler])
        callback self[name](), field

    self[name].subscribe =>
      callback = DelayedSave.apply(self, [options, self, datahandler])
      callback self[name](), field

  # Initialize all containers
  for name, settings of options.container
    container_fn = window[name]
    container_fn = window[settings.container] if settings.container?

    if typeof container_fn != 'function'
      throw new Error 'No container "' + name + '" found.'

    field = name.toLowerCase()
    field = settings.field if settings.field?

    datahandler = settings.datahandler if settings.datahandler?
    datahandler = new JSONHandler()    unless settings.datahandler?

    first_class = false
    first_class = settings.first_class if settings.first_class?

    if settings.type? && settings.type == 'multi'
      self.init_multi_container name, datahandler, container_fn, field, options
    else
      self.init_single_container name, datahandler, container_fn, field, first_class, options

  self