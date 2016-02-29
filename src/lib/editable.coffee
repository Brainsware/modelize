Editable = (self, property, callback) ->
  Observable self, property

  self[property].extend({ editable: "" })

  self[property].subscribe (new_value) =>
    r = callback new_value, property

  return self

ko.extenders.editable = (target, options) ->
  target.editing = ko.observable 'default'

DelayedSave = (options, self, datahandler = null) ->
  (value, prop, delay = 250) =>
    if self.id?
      if self[prop] && self[prop].editing?
        self[prop].editing 'pending'

      window.timeoutEditor = {} unless window.timeoutEditor?
      window.timeoutEditor[options.api + self.id] = {} unless window.timeoutEditor[options.api + self.id]?

      clearTimeout(window.timeoutEditor[options.api + self.id][prop])
      window.timeoutEditor[options.api + self.id][prop] = setTimeout(=>
        if self[prop] && self[prop].editing?
          self[prop].editing 'success'

        edit_value = {}
        edit_value[prop] = value
        if datahandler?
          edit_value[prop] = datahandler.save(value)
        res = self.update edit_value

        if self.on_save_success?
          res.done self.on_save_success
        if self.on_save_fail?
          res.fail self.on_save_fail
      , delay)

HashedSave = (options, self) ->
  (value, prop) =>
    if self.id?
      if self[prop] && self[prop].editing?
        self[prop].editing 'pending'

      if self.hash_salt?
        value += self.hash_salt
      else
        console.log 'No salt for hash found. Intentional?'

      edit_value = {}
      edit_value[prop] = getHash(value)
      res = self.update edit_value

      if self.on_save_success?
        res.done self.on_save_success
      if self.on_save_fail?
        res.fail self.on_save_fail
