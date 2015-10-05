var DelayedSave, Editable, EncryptedDelayedSave;

Editable = function(self, property, callback) {
  var editing_property;
  editing_property = 'editing_' + property;
  Observable(self, property);
  if (typeof self[property] !== 'function') {
    console.error('Editable field "' + property + '" is not a valid Observable');
    return false;
  }
  Observable(self, editing_property, 0);
  self[property].subscribe((function(_this) {
    return function(new_value) {
      var r;
      return r = callback(new_value, property);
    };
  })(this));
  return self;
};

DelayedSave = function(options, self) {
  return (function(_this) {
    return function(value, prop, delay) {
      if (delay == null) {
        delay = 250;
      }
      if (self.id != null) {
        if (self['editing_' + prop] != null) {
          self['editing_' + prop](1);
        }
        if (window.timeoutEditor == null) {
          window.timeoutEditor = {};
        }
        if (window.timeoutEditor[options.api + self.id] == null) {
          window.timeoutEditor[options.api + self.id] = {};
        }
        clearTimeout(window.timeoutEditor[options.api + self.id][prop]);
        return window.timeoutEditor[options.api + self.id][prop] = setTimeout(function() {
          var edit_value;
          if (self['editing_' + prop] != null) {
            self['editing_' + prop](2);
          }
          edit_value = {};
          edit_value[prop] = value;
          return self.update(edit_value);
        }, delay);
      }
    };
  })(this);
};

EncryptedDelayedSave = function(options, self) {
  return (function(_this) {
    return function(value, prop, delay) {
      var index, name, ref;
      if (delay == null) {
        delay = 250;
      }
      if (typeof self[options.encrypted_container] !== 'object' || self[options.encrypted_container] === null) {
        self[options.encrypted_container] = {};
        ref = options.encrypted_editable;
        for (index in ref) {
          name = ref[index];
          self[options.encrypted_container][name] = self[name]();
        }
      }
      self[options.encrypted_container][prop] = value;
      if (self.id != null) {
        self['editing_' + prop](1);
        if (window.timeoutEditor == null) {
          window.timeoutEditor = {};
        }
        clearTimeout(window.timeoutEditor[options.api + self.id]);
        return window.timeoutEditor[options.api + self.id] = setTimeout(function() {
          var edit_value;
          self.save_encrypted_container();
          self['editing_' + prop](2);
          edit_value = {};
          edit_value[prop] = value;
          return self.update(edit_value);
        }, delay);
      }
    };
  })(this);
};

//# sourceMappingURL=editable.js.map
