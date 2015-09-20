var decryptData, encryptData, generateKey, generateSalt;

generateKey = function(password, salt, decrypting) {
  var hex, key, options;
  if (decrypting == null) {
    decrypting = false;
  }
  if (password === '') {
    console.error('Password for key generation empty!');
    return false;
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
  key = sjcl.codec.hex.fromBits(options.key);
  return key;
};

generateSalt = function(length) {
  var rand;
  if (length == null) {
    length = 2;
  }
  rand = sjcl.random.randomWords(length);
  rand = sjcl.codec.hex.fromBits(rand);
  return rand;
};

encryptData = function(key, data, adata) {
  var encdata, options, options_ret;
  if (adata == null) {
    adata = '';
  }
  if (key === '') {
    console.error('Encryption key empty!');
    return false;
  }
  options = {
    mode: 'gcm',
    iter: 5000,
    ts: 64,
    ks: 256,
    adata: adata
  };
  options_ret = {};
  encdata = sjcl.encrypt(key, data, options, options_ret);
  return encdata;
};

decryptData = function(key, data, adata) {
  var options_ret;
  if (key === '') {
    console.error('Decryption key empty!');
    return false;
  }
  options_ret = {};
  return sjcl.decrypt(key, data, {}, options_ret);
};

//# sourceMappingURL=crypto.js.map
