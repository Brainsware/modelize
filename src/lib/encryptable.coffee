Encryptable = (self, container) ->
  # Decrypt given container and populate fields with decrypted values
  #
  self.decrypt = (container) =>
    if typeof container == 'string' && container != null && container != ''
      dencdata = decryptData sessionStorage.getItem('appKey'), container

      container = JSON.parse(dencdata)
      
      for index, value of container
        self[index] = value

  if typeof container == 'string'
    self.decrypt self[container]
  else if typeof container == 'object'
    for container in container
      self.decrypt self[container]

  self.enc_update = (data, callback) =>
    for index, value of data
      if index in options.encrypted_editable
        # encrypt
        if typeof self[options.encrypted_container] != 'object' || self[options.encrypted_container] == null
          self[options.encrypted_container] = {}

        self[options.encrypted_container][index] = value

    self.save_encrypted_container()
    
    if callback?
      callback()
  
  self.save_encrypted_container = =>
    encdata = encryptData(sessionStorage.getItem('appKey'), JSON.stringify(self[options.encrypted_container]))

    edit_value = {}
    edit_value[options.encrypted_container] = encdata
    self.update edit_value

  return self