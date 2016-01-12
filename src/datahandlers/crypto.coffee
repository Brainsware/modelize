class CryptoHandler
  constructor: (settings) ->
    throw new Error 'Please provide an encryption key to the crypto handler!' unless settings.key?

    @key = settings.key
    @salt = settings.salt if settings.salt?

  load: (data) =>
    decrypted_data = decryptData @key, data

    JSON.parse decrypted_data

  save: (data) =>
    encryptData @key, ko.toJSON(data)
