var Modelize,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Modelize = function(options) {
  'use strict';
  var connector, model;
  if (options.connector == null) {
    console.error('No connector given for api: ' + options.api);
    return;
  }
  options.connector.init(options.api);
  if (options.has_one != null) {
    options.connector.add_apis_to(options.has_one, options.api);
  }
  if (options.has_many != null) {
    options.connector.add_apis_to(options.has_many, options.api);
  }
  connector = options.connector.get(options.api);
  model = function(self) {
    var data, fn, i, index, item, items, len, name, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, relation_params;
    if (self == null) {
      self = {};
    }
    self.api = function() {
      return connector;
    };
    if (options.encrypted_container != null) {
      Encryptable(self, options.encrypted_container, options.encrypted_editable);
    }
    if ((options.sortable != null) && options.sortable === true) {
      Sortable(self);
    }
    if ((options.selectable != null) && options.selectable === true) {
      Selectable(self);
    }
    if (options.belongs_to != null) {
      if (options.has_one == null) {
        options.has_one = [];
      }
      options.has_one = Ham.merge(options.belongs_to, options.has_one);
    } else {
      options.belongs_to = [];
    }
    if (options.has_one != null) {
      ref = options.has_one;
      for (name in ref) {
        data = ref[name];
        Ham.merge(data, {
          model: name.capitalize()
        });
        relation_params = relationship_fields(name, data.model, options.connector, options);
        fn = window[data.model];
        if (typeof self[name + '_id'] !== 'function' && indexOf.call(options.belongs_to, name) < 0) {
          if (options.editable == null) {
            options.editable = [];
          }
          options.editable.push(name + '_id');
        }
        if (self[name] != null) {
          Observable(self, name, new fn(self[name]));
        } else {
          Observable(self, name, new fn());
        }
        self[name + '_get'] = single_get_fn.apply(self, relation_params);
      }
    }
    if (options.has_many != null) {
      ref1 = options.has_many;
      for (name in ref1) {
        data = ref1[name];
        Ham.merge(data, {
          model: name.capitalize()
        });
        relation_params = relationship_fields(name, data.model, options.connector, options);
        if (self[name + 's'] != null) {
          fn = window[data.model];
          items = [];
          ref2 = self[name + 's'];
          for (i = 0, len = ref2.length; i < len; i++) {
            item = ref2[i];
            items.push(new fn(item));
          }
          ObservableArray(self, name + 's', items);
        } else {
          ObservableArray(self, name + 's', []);
        }
        self[name + '_get'] = get_fn.apply(self, relation_params);
        self[name + '_add'] = create_fn.apply(self, relation_params);
        self[name + '_update'] = update_fn.apply(self, relation_params);
        self[name + '_destroy'] = destroy_fn.apply(self, relation_params);
      }
    }
    if (options.observable != null) {
      ref3 = options.observable;
      for (index in ref3) {
        name = ref3[index];
        Observable(self, name);
      }
    }
    if (options.editable != null) {
      ref4 = options.editable;
      for (index in ref4) {
        name = ref4[index];
        Editable(self, name, DelayedSave.apply(self, [options, self]));
      }
    }
    if (options.encrypted_editable != null) {
      ref5 = options.encrypted_editable;
      for (index in ref5) {
        name = ref5[index];
        Editable(self, name, EncryptedDelayedSave.apply(self, [options, self]));
      }
    }
    if (options.computed != null) {
      ref6 = options.computed;
      for (name in ref6) {
        fn = ref6[name];
        Computed(self, name, fn);
      }
    }
    if (options.purecomputed != null) {
      ref7 = options.purecomputed;
      for (name in ref7) {
        fn = ref7[name];
        PureComputed(self, name, fn);
      }
    }
    if (options.computed_array != null) {
      ref8 = options.computed_array;
      for (name in ref8) {
        fn = ref8[name];
        ComputedArray(self, name, fn);
      }
    }
    if (options.functions != null) {
      ref9 = options.functions;
      for (name in ref9) {
        fn = ref9[name];
        self[name] = fn;
      }
    }
    self.update = (function(_this) {
      return function(params, callback) {
        if (self.id == null) {
          console.error('Trying to update nonexisting model object');
          return false;
        }
        return self.api().update(self.id, params).done(callback);
      };
    })(this);
    self.destroy = (function(_this) {
      return function(callback) {
        if (self.id == null) {
          console.error('Trying to delete nonexisting model object');
          return false;
        }
        return self.api().destroy(self.id).done(callback);
      };
    })(this);
    self.create = (function(_this) {
      return function(callback) {
        return self.api().create(self["export"]()).done(function(data) {
          self.id = data.id;
          if (options.encrypted_container != null) {
            self.enc_update(data);
          }
          return callback();
        });
      };
    })(this);
    self["export"] = (function(_this) {
      return function(id) {
        var has_data, ref10, ref11, ref12;
        if (id == null) {
          id = false;
        }
        data = {};
        if (id === true) {
          data['id'] = self['id'];
        }
        if (options.editable != null) {
          ref10 = options.editable;
          for (index in ref10) {
            name = ref10[index];
            data[name] = self[name]();
          }
        }
        if (options.encrypted_editable != null) {
          ref11 = options.encrypted_editable;
          for (index in ref11) {
            name = ref11[index];
            data[name] = self[name]();
          }
        }
        if (options.belongs_to != null) {
          ref12 = options.belongs_to;
          for (name in ref12) {
            has_data = ref12[name];
            data[name + '_id'] = self[name + '_id'];
          }
        }
        return data;
      };
    })(this);
    return self;
  };

  /*
   * These are the collector functions and are not bound to a specific object but to the model
   */
  model.get = function(params, callbackOrObservable) {
    var callback;
    if (params == null) {
      params = {};
    }
    callback = function(data) {
      var i, len, m, results;
      results = [];
      for (i = 0, len = data.length; i < len; i++) {
        m = data[i];
        results.push(callbackOrObservable.push(model(m)));
      }
      return results;
    };
    if (typeof callbackOrObservable['push'] === 'undefined') {
      if (typeof callbackOrObservable !== 'function') {
        console.log('model.get 2nd parameter needs to be either a function or a pushable object (Array, ObservableArray).\nGiven:');
        console.log(callbackOrObservable);
      }
      callback = callbackOrObservable;
    }
    if (typeof params !== 'object') {
      console.error(params, typeof params);
      return;
    }
    if ((params != null) && (params.id != null)) {
      return connector.read(params.id, params).done(callback);
    } else {
      console.log(connector);
      return connector.read(params).done(callback);
    }
  };
  model.get_one = function(id, observable) {
    return model.get({
      id: id
    }, observable);
  };
  model.create = function(params, callbackOrObservable) {
    var callback;
    if (params == null) {
      params = {};
    }
    callback = function(data) {
      return callbackOrObservable.push(model(data));
    };
    if (typeof callbackOrObservable['push'] === 'undefined') {
      if (typeof callbackOrObservable !== 'function') {
        console.log('model.create 2nd parameter needs to be either a function or a pushable object (Array, ObservableArray).\nGiven:');
        console.log(callbackOrObservable);
      }
      callback = (function(_this) {
        return function(data) {
          var m;
          m = model(JSON.parse(JSON.stringify(data)));
          if (m.after_create != null) {
            m.after_create();
          }
          return callbackOrObservable(data);
        };
      })(this);
    }
    if (params.length > 0 || typeof params === 'object') {
      if (model.encrypted_container != null) {
        params = model.encrypt_container(params);
      }
      return connector.create(params).done(callback);
    } else {
      return connector.create().done(callback);
    }
  };
  if (options.encrypted_container != null) {
    model.encrypted_container = options.encrypted_container;
  }
  if (options.encrypted_editable != null) {
    model.encrypted_editable = options.encrypted_editable;
  }
  model.encrypt_container = function(data, container) {
    var encdata, index, value;
    data[model.encrypted_container] = {};
    for (index in data) {
      value = data[index];
      if (indexOf.call(model.encrypted_editable, index) >= 0) {
        data[model.encrypted_container][index] = value;
      }
    }
    encdata = encryptData(sessionStorage.getItem('appKey'), JSON.stringify(data[model.encrypted_container]));
    data[model.encrypted_container] = encdata;
    return data;
  };
  return model;
};

if (typeof module !== "undefined" && module !== null) {
  module.exports = Modelize;
}

//# sourceMappingURL=model.js.map
