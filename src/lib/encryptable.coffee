Encryptable = (self, encrypted_container, encrypted_editable) ->
  # Decrypt given encrypted_container and populate fields with decrypted values
  #
  self.decrypt = (encrypted_container) =>
    if typeof encrypted_container == 'string' && encrypted_container != null && encrypted_container != ''
      dencdata = decryptData sessionStorage.getItem('appKey'), encrypted_container

      encrypted_container = JSON.parse(dencdata)

      for index, value of encrypted_container
        self[index] = value

  if typeof encrypted_container == 'string'
    self.decrypt self[encrypted_container]
  else if typeof encrypted_container == 'object'
    for container in encrypted_container
      self.decrypt self[container]

  self.enc_update = (data, callback) =>
    for index, value of data
      if index in encrypted_editable
        # encrypt
        if typeof self[encrypted_container] != 'object' || self[encrypted_container] == null
          self[encrypted_container] = {}

        self[encrypted_container][index] = value

    self.save_encrypted_container()

    if callback?
      callback()

  self.save_encrypted_container = =>
    encdata = encryptData(sessionStorage.getItem('appKey'), JSON.stringify(self[encrypted_container]))

    edit_value = {}
    edit_value[encrypted_container] = encdata
    self.update edit_value

  return self
