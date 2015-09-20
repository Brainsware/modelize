var Encryptable,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Encryptable = function(self, container) {
  var _i, _len;
  self.decrypt = (function(_this) {
    return function(container) {
      var dencdata, index, value, _results;
      if (typeof container === 'string' && container !== null && container !== '') {
        dencdata = decryptData(sessionStorage.getItem('appKey'), container);
        container = JSON.parse(dencdata);
        _results = [];
        for (index in container) {
          value = container[index];
          _results.push(self[index] = value);
        }
        return _results;
      }
    };
  })(this);
  if (typeof container === 'string') {
    self.decrypt(self[container]);
  } else if (typeof container === 'object') {
    for (_i = 0, _len = container.length; _i < _len; _i++) {
      container = container[_i];
      self.decrypt(self[container]);
    }
  }
  self.enc_update = (function(_this) {
    return function(data, callback) {
      var index, value;
      for (index in data) {
        value = data[index];
        if (__indexOf.call(options.encrypted_editable, index) >= 0) {
          if (typeof self[options.encrypted_container] !== 'object' || self[options.encrypted_container] === null) {
            self[options.encrypted_container] = {};
          }
          self[options.encrypted_container][index] = value;
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
      encdata = encryptData(sessionStorage.getItem('appKey'), JSON.stringify(self[options.encrypted_container]));
      edit_value = {};
      edit_value[options.encrypted_container] = encdata;
      return self.update(edit_value);
    };
  })(this);
  return self;
};

//# sourceMappingURL=encryptable.js.map
