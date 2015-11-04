Editable = (self, property, callback) ->
  editing_property = 'editing_' + property

  Observable self, property

  # Editing states:
  # -1: error
  # 0: default
  # 1: editing
  # 2: success
  Observable self, editing_property, 0

  self[property].subscribe (new_value) =>
    r = callback new_value, property

  return self

DelayedSave = (options, self) ->
  (value, prop, delay = 250) =>
    if self.id?
      if self['editing_' + prop]?
        self['editing_' + prop] 1

      window.timeoutEditor = {} unless window.timeoutEditor?
      window.timeoutEditor[options.api + self.id] = {} unless window.timeoutEditor[options.api + self.id]?

      clearTimeout(window.timeoutEditor[options.api + self.id][prop])
      window.timeoutEditor[options.api + self.id][prop] = setTimeout(=>
        if self['editing_' + prop]?
          self['editing_' + prop] 2

        edit_value = {}
        edit_value[prop] = value
        self.update edit_value
      , delay)

EncryptedDelayedSave = (options, self) ->
  (value, prop, delay = 250) =>
    if typeof self[options.encrypted_container] != 'object' || self[options.encrypted_container] == null
      self[options.encrypted_container] = {}

      for index, name of options.encrypted_editable
        self[options.encrypted_container][name] = self[name]()

    self[options.encrypted_container][prop] = value

    if self.id?
      self['editing_' + prop] 1

      window.timeoutEditor = {} unless window.timeoutEditor?
      clearTimeout(window.timeoutEditor[options.api + self.id])
      window.timeoutEditor[options.api + self.id] = setTimeout(=>
        self.save_encrypted_container()

        self['editing_' + prop] 2

        ## and for verification, save it unencrypted too
        edit_value = {}
        edit_value[prop] = value
        self.update edit_value
      , delay)
