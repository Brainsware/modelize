var decryptData, encryptData, generateKey, generateSalt, getHash;

generateKey = function(password, salt) {
  var hex, options;
  if (password === '') {
    throw new Error('Password for key generation empty!');
  }
  hex = sjcl.codec.hex.fromBits;
  if (salt == null) {
    salt = generateSalt();
  }
  options = {
    salt: salt,
    iter: 5000
  };
  options = sjcl.misc.cachedPbkdf2(password, options);
  return sjcl.codec.hex.fromBits(options.key);
};

generateSalt = function(length) {
  var rand;
  if (length == null) {
    length = 2;
  }
  rand = sjcl.random.randomWords(length);
  return sjcl.codec.hex.fromBits(rand);
};

encryptData = function(key, data, adata) {
  var options, options_ret;
  if (adata == null) {
    adata = '';
  }
  if (key === '') {
    throw new Error('Encryption key empty!');
  }
  options = {
    mode: 'gcm',
    iter: 5000,
    ts: 64,
    ks: 256,
    adata: adata
  };
  options_ret = {};
  return sjcl.encrypt(key, data, options, options_ret);
};

decryptData = function(key, data) {
  var options_ret;
  if (key === '') {
    throw new Error('Decryption key empty!');
  }
  options_ret = {};
  return sjcl.decrypt(key, data, {}, options_ret);
};

getHash = function(value) {
  var hash;
  if (value == null) {
    console.debug('Hash value empty');
    value = '';
  }
  hash = sjcl.hash.sha256.hash(value);
  return sjcl.codec.hex.fromBits(hash);
};

//# sourceMappingURL=crypto.js.map
