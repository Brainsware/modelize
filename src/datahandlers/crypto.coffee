if typeof require == 'function'
  ko = require('knockout')
  SJCLUtils = require('../lib/sjcl')

class CryptoHandler
  constructor: (settings) ->
    throw new Error 'Please provide an encryption key to the crypto handler!' unless settings.key?

    @key = settings.key
    @salt = settings.salt if settings.salt?

  load: (data) =>
    decrypted_data = SJCLUtils.decryptData @key, data

    JSON.parse decrypted_data

  save: (data) =>
    SJCLUtils.encryptData @key, ko.toJSON(data)

module.exports = CryptoHandler if module?
