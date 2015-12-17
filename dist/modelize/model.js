var Modelize,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Modelize = function(options) {
  'use strict';
  var connector, model;
  if (options.connector == null) {
    throw new Error('No connector given for api: ' + options.api);
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
        relation_params = relationship_fields(name, data.model, self.api(), options);
        fn = window[data.model];
        if (typeof fn !== 'function') {
          throw new Error('No model for has_one/belongs_to relation found');
        }
        if (typeof self[name + '_id'] !== 'function' && indexOf.call(options.belongs_to, name) < 0) {
          if (options.editable == null) {
            options.editable = [];
          }
          if (ref1 = name + '_id', indexOf.call(options.editable, ref1) < 0) {
            options.editable.push(name + '_id');
          }
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
      ref2 = options.has_many;
      for (name in ref2) {
        data = ref2[name];
        Ham.merge(data, {
          model: name.capitalize()
        });
        relation_params = relationship_fields(name, data.model, self.api(), options);
        if (self[name + 's'] != null) {
          fn = window[data.model];
          items = [];
          ref3 = self[name + 's'];
          for (i = 0, len = ref3.length; i < len; i++) {
            item = ref3[i];
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
      ref4 = options.observable;
      for (index in ref4) {
        name = ref4[index];
        Observable(self, name);
      }
    }
    if (options.editable != null) {
      ref5 = options.editable;
      for (index in ref5) {
        name = ref5[index];
        Editable(self, name, DelayedSave.apply(self, [options, self]));
      }
    }
    if (options.encrypted_editable != null) {
      ref6 = options.encrypted_editable;
      for (index in ref6) {
        name = ref6[index];
        Editable(self, name, EncryptedDelayedSave.apply(self, [options, self]));
      }
    }
    if (options.computed != null) {
      ref7 = options.computed;
      for (name in ref7) {
        fn = ref7[name];
        Computed(self, name, fn);
      }
    }
    if (options.purecomputed != null) {
      ref8 = options.purecomputed;
      for (name in ref8) {
        fn = ref8[name];
        PureComputed(self, name, fn);
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
          throw new Error('Trying to update nonexisting model object');
        }
        return self.api().update(self.id, params).done(callback);
      };
    })(this);
    self.destroy = (function(_this) {
      return function(callback) {
        if (self.id == null) {
          throw new Error('Trying to delete nonexisting model object');
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
            data[name + '_id'] = self[name + '_id']();
          }
        }
        return data;
      };
    })(this);
    return self;
  };

  /*
   * These are the collection functions and are not bound to a specific object but to the model
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
        throw new Error('Collection.get 2nd parameter needs to be either a function or a pushable object (Array, ObservableArray).\nGiven: ' + callbackOrObservable);
      }
      callback = callbackOrObservable;
    }
    if (typeof params !== 'object') {
      throw new Error('Passed params is not an object: ' + typeof params);
    }
    if ((params != null) && (params.id != null)) {
      connector.read(params.id, params).done(callback);
    } else {
      connector.read(params).done(callback);
    }
  };
  model.get_one = function(id, callbackOrObservable) {
    var callback;
    callback = function(data) {
      return callbackOrObservable(model(data));
    };
    if (ko.isObservable(callbackOrObservable) === false) {
      if (typeof callbackOrObservable !== 'function') {
        throw new Error('Collection.get_one 2nd parameter needs to be either a function or an Observable.\nGiven: ' + callbackOrObservable);
      }
      callback = callbackOrObservable;
    }
    return model.get({
      id: id
    }, callbackOrObservable);
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
        throw new Error('Collection.create 2nd parameter needs to be either a function or a pushable object (Array, ObservableArray).\nGiven: ' + callbackOrObservable);
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
      connector.create(params).done(callback);
    } else {
      connector.create().done(callback);
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
        delete data[index];
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
