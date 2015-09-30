# Generate key with Pbkdf2
#
generateKey = (password, salt) ->
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

  return sjcl.codec.hex.fromBits options.key

# Generate salt
#
# @param [int] length specifies the number of words produced
#
generateSalt = (length = 2) ->
  rand = sjcl.random.randomWords length
  
  return sjcl.codec.hex.fromBits rand

# Encrypt data with key
# Method used: AES/GCM
#
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

  return sjcl.encrypt key, data, options, options_ret

# Decrypt data with key
#
decryptData = (key, data) ->
  if key == ''
    console.error 'Decryption key empty!'
    return false

  options_ret = {}

  return sjcl.decrypt key, data, {}, options_ret

# Generate SHA256 hash from given string
#
getHash = (value) ->
  unless value?
    console.debug 'Hash value empty'
    value = ''

  hash = sjcl.hash.sha256.hash value
  return sjcl.codec.hex.fromBits hash