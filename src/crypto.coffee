generateKey = (password, salt, decrypting = false) ->
  if password == ''
    console.error 'Password for key generation empty!'
    return false

  hex = sjcl.codec.hex.fromBits

  unless salt?
    salt = generateSalt()

  options =
    salt: salt
    iter: 5000

  options = sjcl.misc.cachedPbkdf2(password, options)

  key = sjcl.codec.hex.fromBits(options.key)

  return key

generateSalt = (length = 2) ->
  rand = sjcl.random.randomWords(length)
  
  rand = sjcl.codec.hex.fromBits(rand)

  #rand = rand.toUpperCase().replace(/// ///g,'').replace(///(.{8})///g, "$1 ").replace(/// $///, '')

  return rand

encryptData = (key, data, adata = '') ->
  if key == ''
    console.error 'Encryption key empty!'
    return false

  options =
    mode : 'gcm'
    iter : 5000
    ts   : 64
    ks   : 256
    adata: adata

  options_ret = {}

  encdata = sjcl.encrypt key, data, options, options_ret

  return encdata

decryptData = (key, data, adata) ->
  if key == ''
    console.error 'Decryption key empty!'
    return false

  options_ret = {}

  sjcl.decrypt key, data, {}, options_ret