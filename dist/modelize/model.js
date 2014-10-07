var Modelize;

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
    var callback_fn, data, fn, index, name, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
    if (self == null) {
      self = {};
    }
    self.api = function() {
      return mapi;
    };
    self.relationship_fields = function(name, model) {
      return [name + '_id', name + 's', name, window[model]];
    };
    if ((options.sortable != null) && options.sortable === true) {
      Sortable(self);
    }
    if (options.has_one != null) {
      _ref = options.has_one;
      for (name in _ref) {
        data = _ref[name];
        Ham.merge(data, {
          model: name.capitalize()
        });
        callback_fn = function(id_param, api_name, name, model) {
          var callback;
          if (self[id_param] == null) {
            console.log('Tried to access empty relation key: ' + id_param);
            return false;
          }
          if (typeof callback === "undefined" || callback === null) {
            callback = (function(_this) {
              return function(data) {
                return _this[name](model(data));
              };
            })(this);
          }
          return api[api_name].read(self[id_param]).done(callback);
        };
        fn = window[data.model];
        if (self[name] != null) {
          Observable(self, name, new fn(self[name]));
        } else {
          LazyObservable(self, name, callback_fn, self.relationship_fields(name, data.model), new fn);
        }
      }
    }
    if (options.has_many != null) {
      _ref1 = options.has_many;
      for (name in _ref1) {
        data = _ref1[name];
        Ham.merge(data, {
          model: name.capitalize()
        });
        callback_fn = function(id_param, api_name, name, model) {
          var callback;
          if (typeof callback === "undefined" || callback === null) {
            callback = (function(_this) {
              return function(data) {
                var m, res, _i, _len;
                res = [];
                for (_i = 0, _len = data.length; _i < _len; _i++) {
                  m = data[_i];
                  res.push(model(m));
                }
                return _this[api_name](res);
              };
            })(this);
          }
          return self.api()[api_name].read(self.id).done(callback);
        };
        LazyObservableArray(self, name + 's', callback_fn, self.relationship_fields(name, data.model));
        callback_fn = function(id_param, api_name, name, model) {
          return (function(_this) {
            return function(element, params, callback) {
              if (params == null) {
                params = {};
              }
              if (callback == null) {
                callback = function(data) {
                  return _this[api_name].push(model(data));
                };
              }
              if (options.belongs_to != null) {
                return self.api()[api_name].create(options.belongs_to, self.id, params).done(callback);
              } else {
                return self.api()[api_name].create(self.id, params).done(callback);
              }
            };
          })(this);
        };
        self[name + '_add'] = callback_fn.apply(self, self.relationship_fields(name, data.model));
        callback_fn = function(id_param, api_name, name, model) {
          return (function(_this) {
            return function(id, params, callback) {
              if (options.belongs_to != null) {
                return self.api()[api_name].update(options.belongs_to, self.id, id, params).done(callback);
              } else {
                return self.api()[api_name].update(self.id, id, params).done(callback);
              }
            };
          })(this);
        };
        self[name + '_update'] = callback_fn.apply(self, self.relationship_fields(name, data.model));
        callback_fn = function(id_param, api_name, name, model) {
          return (function(_this) {
            return function(element) {
              var callback;
              if (typeof callback === "undefined" || callback === null) {
                callback = function(data) {
                  return _this[api_name].remove(element);
                };
              }
              return element.destroy(callback);
            };
          })(this);
        };
        self[name + '_destroy'] = callback_fn.apply(self, self.relationship_fields(name, data.model));
      }
    }
    if (options.observable != null) {
      _ref2 = options.observable;
      for (index in _ref2) {
        name = _ref2[index];
        Observable(self, name);
      }
    }
    if (options.editable != null) {
      _ref3 = options.editable;
      for (index in _ref3) {
        name = _ref3[index];
        Editable(self, name, (function(_this) {
          return function(value, prop, delay) {
            if (delay == null) {
              delay = 250;
            }
            if (window.timeoutEditor == null) {
              window.timeoutEditor = {};
            }
            clearTimeout(window.timeoutEditor[prop]);
            return window.timeoutEditor[prop] = setTimeout(function() {
              var edit_value;
              edit_value = {};
              edit_value[prop] = value;
              return self.update(edit_value);
            }, delay);
          };
        })(this));
      }
    }
    if (options.computed != null) {
      _ref4 = options.computed;
      for (name in _ref4) {
        fn = _ref4[name];
        Computed(self, name, fn);
      }
    }
    if (options.functions != null) {
      _ref5 = options.functions;
      for (name in _ref5) {
        fn = _ref5[name];
        self[name] = fn;
      }
    }
    self.update = (function(_this) {
      return function(data, callback) {
        return self.api().update(self.id, data).done(callback);
      };
    })(this);
    self.destroy = (function(_this) {
      return function(callback) {
        return self.api().destroy(self.id).done(callback);
      };
    })(this);
    return self;
  };
  model.get = function(params, callbackOrObservable) {
    var callback;
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
        console.log('Collection.find 2nd parameter needs to be either a function or a pushable object (Array, ObservableArray).\nGiven:');
        console.log(callbackOrObservable);
      }
      callback = callbackOrObservable;
    }
    if ((params != null) && (params.id != null)) {
      return mapi.read(params.id, params).done(callback);
    } else {
      return mapi.read(params).done(callback);
    }
  };
  model.getOne = function(observable, id) {
    return model.get(observable, {
      id: id
    });
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
        console.log('Collection.find 2nd parameter needs to be either a function or a pushable object (Array, ObservableArray).\nGiven:');
        console.log(callbackOrObservable);
      }
      callback = callbackOrObservable;
    }
    if (params.length > 0 || typeof params === 'object') {
      return mapi.create(params).done(callback);
    } else {
      return mapi.create().done(callback);
    }
  };
  return model;
};

//# sourceMappingURL=model.js.map
