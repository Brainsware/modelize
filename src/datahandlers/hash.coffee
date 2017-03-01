class HashHandler
  constructor: (settings) ->
    throw new Error 'Please provide a salting hash to the hash handler!' unless settings.salt?

    @salt = settings.salt

  save: (data) =>
    SJCLUtils.getHash(data + @salt)
