Editable = (self, property, callback) ->
  editing_property = 'editing_' + property

  Observable self, property
  
  if typeof self[property] != 'function'
    console.error 'Editable field "' + property + '" is not a valid Observable'
    return false
  
  Observable self, editing_property, (self[property]() == '' || !self[property]()?)

  self[property].subscribe (new_value) =>
    r = callback new_value, property

    unless r == true
      self[editing_property] false

  self['edit_' + property] = => self[editing_property] true

  return self

DelayedSave = (options, self) ->
  (value, prop, delay = 250) =>
    if self.id?
      window.timeoutEditor = {} unless window.timeoutEditor?
      window.timeoutEditor[options.api + self.id] = {} unless window.timeoutEditor[options.api + self.id]?

      clearTimeout(window.timeoutEditor[options.api + self.id][prop])
      window.timeoutEditor[options.api + self.id][prop] = setTimeout(=>
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
      window.timeoutEditor = {} unless window.timeoutEditor?
      clearTimeout(window.timeoutEditor[options.api + self.id])
      window.timeoutEditor[options.api + self.id] = setTimeout(=>
        self.save_encrypted_container()

        ## and for verification, save it unencrypted too
        edit_value = {}
        edit_value[prop] = value
        self.update edit_value
      , delay)