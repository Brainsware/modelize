Editable = (self, property, callback) ->
  editing_property = 'editing_' + property

  Observable self, property

  Observable self, editing_property, 'default'

  self[property].subscribe (new_value) =>
    r = callback new_value, property

  return self

DelayedSave = (options, self, datahandler = null) ->
  (value, prop, delay = 250) =>
    if self.id?
      if self['editing_' + prop]?
        self['editing_' + prop] 'pending'

      window.timeoutEditor = {} unless window.timeoutEditor?
      window.timeoutEditor[options.api + self.id] = {} unless window.timeoutEditor[options.api + self.id]?

      clearTimeout(window.timeoutEditor[options.api + self.id][prop])
      window.timeoutEditor[options.api + self.id][prop] = setTimeout(=>
        if self['editing_' + prop]?
          self['editing_' + prop] 'success'

        edit_value = {}
        edit_value[prop] = value
        if datahandler?
          edit_value[prop] = datahandler.save(value)
        self.update edit_value
      , delay)

HashedSave = (options, self) ->
  (value, prop) =>
    if self.id?
      if self['editing_' + prop]?
        self['editing_' + prop] 'pending'

      if self.encryption_salt?
        value += self.encryption_salt
      else
        console.log 'No salt for hash found. Intentional?'

      edit_value = {}
      edit_value[prop] = getHash(value)
      self.update edit_value
