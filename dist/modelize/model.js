'use strict';
var Modelize,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Modelize = function(options) {
  var mapi, model;
  if (api[options.api] == null) {
    api.add(options.api);
  }
  mapi = api[options.api];
  if (options.has_one != null) {
    add_apis_to(options.has_one, options.api);
  }
  if (options.has_many != null) {
    add_apis_to(options.has_many, options.api);
  }
  model = function(self) {
    var data, fn, index, item, items, name, relation_params, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
    if (self == null) {
      self = {};
    }
    self.api = function() {
      return mapi;
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
      _ref = options.has_one;
      for (name in _ref) {
        data = _ref[name];
        Ham.merge(data, {
          model: name.capitalize()
        });
        relation_params = relationship_fields(name, data.model, options);
        fn = window[data.model];
        if (typeof self[name + '_id'] !== 'function' && __indexOf.call(options.belongs_to, name) < 0) {
          if (options.editable == null) {
            options.editable = [];
          }
          options.editable.push(name + '_id');
        }
        if (self[name] != null) {
          Observable(self, name, new fn(self[name]));
        } else {
          LazyObservable(self, name, lazy_single_get_fn, relation_params);
        }
        self[name + '_get'] = single_get_fn.apply(self, relation_params);
      }
    }
    if (options.has_many != null) {
      _ref1 = options.has_many;
      for (name in _ref1) {
        data = _ref1[name];
        Ham.merge(data, {
          model: name.capitalize()
        });
        relation_params = relationship_fields(name, data.model, options);
        if (self[name + 's'] != null) {
          fn = window[data.model];
          items = [];
          _ref2 = self[name + 's'];
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            item = _ref2[_i];
            items.push(new fn(item));
          }
          ObservableArray(self, name + 's', items);
        } else {
          LazyObservableArray(self, name + 's', lazy_get_fn, relation_params);
        }
        self[name + '_get'] = get_fn.apply(self, relation_params);
        self[name + '_add'] = create_fn.apply(self, relation_params);
        self[name + '_update'] = update_fn.apply(self, relation_params);
        self[name + '_destroy'] = destroy_fn.apply(self, relation_params);
      }
    }
    if (options.observable != null) {
      _ref3 = options.observable;
      for (index in _ref3) {
        name = _ref3[index];
        Observable(self, name);
      }
    }
    if (options.editable != null) {
      _ref4 = options.editable;
      for (index in _ref4) {
        name = _ref4[index];
        Editable(self, name, DelayedSave.apply(self, [options, self]));
      }
    }
    if (options.encrypted_editable != null) {
      _ref5 = options.encrypted_editable;
      for (index in _ref5) {
        name = _ref5[index];
        Editable(self, name, EncryptedDelayedSave.apply(self, [options, self]));
      }
    }
    if (options.computed != null) {
      _ref6 = options.computed;
      for (name in _ref6) {
        fn = _ref6[name];
        Computed(self, name, fn);
      }
    }
    if (options.purecomputed != null) {
      _ref7 = options.purecomputed;
      for (name in _ref7) {
        fn = _ref7[name];
        PureComputed(self, name, fn);
      }
    }
    if (options.computed_array != null) {
      _ref8 = options.computed_array;
      for (name in _ref8) {
        fn = _ref8[name];
        ComputedArray(self, name, fn);
      }
    }
    if (options.functions != null) {
      _ref9 = options.functions;
      for (name in _ref9) {
        fn = _ref9[name];
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
        return mapi.create(self["export"]()).done(function(data) {
          self.id = data.id;
          if (options.encrypted_container != null) {
            self.enc_update(data);
          }
          return callback();
        });
      };
    })(this);
    self["export"] = (function(_this) {
      return function() {
        var has_data, _ref10, _ref11, _ref12;
        data = {};
        if (options.editable != null) {
          _ref10 = options.editable;
          for (index in _ref10) {
            name = _ref10[index];
            data[name] = self[name]();
          }
        }
        if (options.encrypted_editable != null) {
          _ref11 = options.encrypted_editable;
          for (index in _ref11) {
            name = _ref11[index];
            data[name] = self[name]();
          }
        }
        if (options.belongs_to != null) {
          _ref12 = options.belongs_to;
          for (name in _ref12) {
            has_data = _ref12[name];
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
      var m, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        m = data[_i];
        _results.push(callbackOrObservable.push(model(m)));
      }
      return _results;
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
      return mapi.read(params.id, params).done(callback);
    } else {
      return mapi.read(params).done(callback);
    }
  };
  model.getOne = function(id, observable) {
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
      return mapi.create(params).done(callback);
    } else {
      return mapi.create().done(callback);
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
      if (__indexOf.call(model.encrypted_editable, index) >= 0) {
        data[model.encrypted_container][index] = value;
      }
    }
    encdata = encryptData(sessionStorage.getItem('appKey'), JSON.stringify(data[model.encrypted_container]));
    data[model.encrypted_container] = encdata;
    return data;
  };
  return model;
};

//# sourceMappingURL=model.js.map
