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
    var data, fn, index, item, items, name, relation_params, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
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
    if ((options.selectable != null) && options.selectable === true) {
      Selectable(self);
    }
    if (options.belongs_to != null) {
      if (options.has_one == null) {
        options.has_one = [];
      }
      options.has_one = Ham.merge(options.belongs_to, options.has_one);
    }
    if (options.has_one != null) {
      _ref = options.has_one;
      for (name in _ref) {
        data = _ref[name];
        Ham.merge(data, {
          model: name.capitalize()
        });
        fn = window[data.model];
        if (self[name] != null) {
          Observable(self, name, new fn(self[name]));
        } else {
          LazyObservable(self, name, lazy_single_get_fn, self.relationship_fields(name, data.model));
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
        relation_params = self.relationship_fields(name, data.model);
        relation_params.push(options);
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
      _ref5 = options.computed;
      for (name in _ref5) {
        fn = _ref5[name];
        Computed(self, name, fn);
      }
    }
    if (options.functions != null) {
      _ref6 = options.functions;
      for (name in _ref6) {
        fn = _ref6[name];
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

ko.bindingHandlers.sortable.afterMove = function(element) {
  if (element.item.move_ui != null) {
    return element.item.move_ui(element);
  }
};

//# sourceMappingURL=model.js.map
