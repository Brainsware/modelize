var Encryptable,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Encryptable = function(self, encrypted_container, encrypted_editable) {
  var container, i, len;
  self.decrypt = (function(_this) {
    return function(encrypted_container) {
      var dencdata, index, results, value;
      if (typeof encrypted_container === 'string' && encrypted_container !== null && encrypted_container !== '') {
        dencdata = decryptData(sessionStorage.getItem('appKey'), encrypted_container);
        encrypted_container = JSON.parse(dencdata);
        results = [];
        for (index in encrypted_container) {
          value = encrypted_container[index];
          results.push(self[index] = value);
        }
        return results;
      }
    };
  })(this);
  if (typeof encrypted_container === 'string') {
    self.decrypt(self[encrypted_container]);
  } else if (typeof encrypted_container === 'object') {
    for (i = 0, len = encrypted_container.length; i < len; i++) {
      container = encrypted_container[i];
      self.decrypt(self[container]);
    }
  }
  self.enc_update = (function(_this) {
    return function(data, callback) {
      var index, value;
      for (index in data) {
        value = data[index];
        if (indexOf.call(encrypted_editable, index) >= 0) {
          if (typeof self[encrypted_container] !== 'object' || self[encrypted_container] === null) {
            self[encrypted_container] = {};
          }
          self[encrypted_container][index] = value;
        }
      }
      self.save_encrypted_container();
      if (callback != null) {
        return callback();
      }
    };
  })(this);
  self.save_encrypted_container = (function(_this) {
    return function() {
      var edit_value, encdata;
      encdata = encryptData(sessionStorage.getItem('appKey'), JSON.stringify(self[encrypted_container]));
      edit_value = {};
      edit_value[encrypted_container] = encdata;
      return self.update(edit_value);
    };
  })(this);
  return self;
};

//# sourceMappingURL=encryptable.js.map
