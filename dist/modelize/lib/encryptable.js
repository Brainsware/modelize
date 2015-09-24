var Encryptable,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Encryptable = function(self, encrypted_container, encrypted_editable) {
  var container, _i, _len;
  self.decrypt = (function(_this) {
    return function(encrypted_container) {
      var dencdata, index, value, _results;
      if (typeof encrypted_container === 'string' && encrypted_container !== null && encrypted_container !== '') {
        dencdata = decryptData(sessionStorage.getItem('appKey'), encrypted_container);
        encrypted_container = JSON.parse(dencdata);
        _results = [];
        for (index in encrypted_container) {
          value = encrypted_container[index];
          _results.push(self[index] = value);
        }
        return _results;
      }
    };
  })(this);
  if (typeof encrypted_container === 'string') {
    self.decrypt(self[encrypted_container]);
  } else if (typeof encrypted_container === 'object') {
    for (_i = 0, _len = encrypted_container.length; _i < _len; _i++) {
      container = encrypted_container[_i];
      self.decrypt(self[container]);
    }
  }
  self.enc_update = (function(_this) {
    return function(data, callback) {
      var index, value;
      for (index in data) {
        value = data[index];
        if (__indexOf.call(encrypted_editable, index) >= 0) {
          if (typeof self[encrypted_container] !== 'object' || self[encrypted_container] === null) {
            self[encrypted_container] = {};
          }
          self[encrypted_container][index] = value;
        }
      }
      self.save_encrypted_encrypted_container();
      if (callback != null) {
        return callback();
      }
    };
  })(this);
  self.save_encrypted_encrypted_container = (function(_this) {
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
