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
      edit_value[prop] = SJCLUtils.getHash(value)
      res = self.update edit_value

      if self.on_save_success?
        res.done self.on_save_success
      if self.on_save_fail?
        res.fail self.on_save_fail

module.exports = HashedSave if module?
